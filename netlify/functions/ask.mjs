/*
 * Netlify Function — AI proxy for the "Ask Videre" mentor.
 *
 * Browser  ──POST /.netlify/functions/ask──▶  this function  ──▶  api.groq.com
 *                                             (GROQ_API_KEY)
 *
 * The Groq key lives ONLY in the server environment (set `GROQ_API_KEY` in the
 * Netlify UI — no VITE_ prefix, so Vite never inlines it into public JS).
 *
 * Abuse protection for an open-ish relay:
 *   - per-IP rate limit (best effort; in-memory, resets with the instance)
 *   - strict payload caps (question / context / token budget)
 *   - model id pattern check (no arbitrary long ids)
 *   - response contains only { content } — never the key, never upstream extras
 *
 * Same-origin from the site's perspective → no CORS handling required.
 */

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

// Replacement for Groq's retired llama-3.1-8b-instant. Groq retires models
// aggressively (console.groq.com/docs/deprecations) — when a 404 "model not
// found" appears, update this default and GROQ_MODEL_SUGGESTIONS in
// src/utils/groq.ts together.
const DEFAULT_MODEL = 'openai/gpt-oss-20b';

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 15;
const MAX_USER_CHARS = 1500;
const MAX_SYSTEM_CHARS = 6000;
// GPT-OSS models "think" before answering and spend completion tokens on it —
// headroom so the visible answer isn't squeezed out by reasoning.
const MAX_TOKENS_CAP = 1200;
const DEFAULT_TOKENS = 800;
const MODEL_PATTERN = /^[\w./:-]{1,80}$/;

/** ip -> { count, resetAt } — best-effort, per warm function instance */
const rateBuckets = new Map();

const json = (statusCode, body, extraHeaders = {}) => ({
  statusCode,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    ...extraHeaders
  },
  body: JSON.stringify(body)
});

const clientIp = (event) => {
  const headers = event.headers || {};
  const forwarded = String(headers['x-forwarded-for'] || '').split(',')[0].trim();
  return headers['x-nf-client-connection-ip'] || forwarded || 'unknown';
};

const isRateLimited = (ip) => {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    if (rateBuckets.size > 500) {
      for (const [key, value] of rateBuckets) {
        if (value.resetAt <= now) rateBuckets.delete(key);
      }
    }
    return false;
  }
  bucket.count += 1;
  return bucket.count > MAX_REQUESTS_PER_WINDOW;
};

export const handler = async (event) => {
  const method = event.httpMethod || 'GET';
  if (method !== 'POST') {
    return json(405, { error: 'Use POST.', kind: 'bad-request' }, { allow: 'POST' });
  }

  // Rate limit first so abuse is capped even if configuration is broken.
  const ip = clientIp(event);
  if (isRateLimited(ip)) {
    return json(
      429,
      {
        error: `Rate limited: at most ${MAX_REQUESTS_PER_WINDOW} AI requests per minute per IP. Wait about a minute.`,
        kind: 'rate'
      },
      { 'retry-after': String(Math.ceil(WINDOW_MS / 1000)) }
    );
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON body.', kind: 'bad-request' });
  }

  const model = (typeof payload.model === 'string' && payload.model.trim()) || DEFAULT_MODEL;
  const system = typeof payload.system === 'string' ? payload.system : '';
  const user = typeof payload.user === 'string' ? payload.user.trim() : '';
  const requestedTokens = Number(payload.max_tokens);

  if (!model || !MODEL_PATTERN.test(model)) {
    return json(400, { error: 'Invalid model id.', kind: 'bad-request' });
  }
  if (!user || user.length > MAX_USER_CHARS) {
    return json(400, { error: `Question must be 1–${MAX_USER_CHARS} characters.`, kind: 'bad-request' });
  }
  if (!system || system.length > MAX_SYSTEM_CHARS) {
    return json(413, { error: `Lesson context too large (max ${MAX_SYSTEM_CHARS} characters).`, kind: 'too-large' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return json(500, {
      error: "This site's AI key isn't configured yet — set GROQ_API_KEY in the hosting environment and redeploy.",
      kind: 'config'
    });
  }

  const maxTokens = Math.min(MAX_TOKENS_CAP, Math.max(50, Math.floor(requestedTokens) || DEFAULT_TOKENS));

  // GPT-OSS models are reasoning models: keep the thinking short and out of
  // the visible answer (reasoning tokens would otherwise eat max_tokens).
  const reasoningTuning = model.startsWith('openai/gpt-oss')
    ? { reasoning_effort: 'low', include_reasoning: false }
    : {};

  let upstream;
  try {
    upstream = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        temperature: 0.5, // GPT-OSS behaves best in the 0.5–0.7 band
        max_completion_tokens: maxTokens, // current param name (max_tokens is legacy)
        ...reasoningTuning,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ]
      })
    });
  } catch {
    return json(502, { error: 'Could not reach Groq from the server.', kind: 'upstream' });
  }

  const upstreamText = await upstream.text();

  if (!upstream.ok) {
    if (upstream.status === 401 || upstream.status === 403) {
      return json(502, { error: 'Groq rejected the server key — check GROQ_API_KEY.', kind: 'auth' });
    }
    if (upstream.status === 429) {
      return json(429, { error: 'Groq rate-limited the server key — wait ~30 seconds and retry.', kind: 'rate' });
    }
    if (upstream.status === 404) {
      return json(502, { error: `Model "${model}" was not found on Groq — check the model id.`, kind: 'model' });
    }
    return json(502, { error: `Groq responded with ${upstream.status}.`, kind: 'upstream' });
  }

  let data;
  try {
    data = JSON.parse(upstreamText);
  } catch {
    return json(502, { error: 'Bad response from Groq.', kind: 'upstream' });
  }

  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) {
    return json(502, { error: 'Groq returned an empty response — try rephrasing.', kind: 'empty' });
  }

  // Minimal contract: only the answer text ever leaves this function.
  return json(200, { content: content.trim() });
};
