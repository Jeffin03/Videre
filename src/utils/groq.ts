/**
 * Groq chat client for the Ask Videre mentor.
 *
 * Two modes, tried in order:
 *
 *  1. **Proxy (preferred)** — POST same-origin to `/.netlify/functions/ask`
 *     (Netlify Function). The Groq key lives server-side as `GROQ_API_KEY`
 *     (no VITE_ prefix → never in the public bundle) and the function applies
 *     rate limiting + payload caps.
 *  2. **Direct** — POST api.groq.com straight from the browser using a key the
 *     user supplied (localStorage `videre_groq_config` or `VITE_GROQ_API_KEY`).
 *     Used on hosts without the function, and as a fallback when the
 *     function reports its server key is missing.
 *
 * The proxy is considered "absent" when the response isn't JSON (SPA hosts
 * rewrite unknown paths to index.html), so Vercel/preview deploys degrade to
 * direct mode automatically instead of erroring confusingly.
 */

export const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
export const PROXY_ENDPOINT = '/.netlify/functions/ask';

/** Fast model with generous free-tier limits — replacement for the retired
 *  llama-3.1-8b-instant (see RETIRED_GROQ_MODELS below). */
export const DEFAULT_GROQ_MODEL = 'openai/gpt-oss-20b';

/** Suggested ids for the model picker — verified against console.groq.com/docs
 *  (deprecations page) as of Oct 2026. Groq retires models aggressively; check
 *  console.groq.com/docs/deprecations when a 404 "model not found" appears. */
export const GROQ_MODEL_SUGGESTIONS = [
  'openai/gpt-oss-20b',
  'openai/gpt-oss-120b',
  'qwen/qwen3.8-27b'
];

/** Model ids Groq has shut down (console.groq.com/docs/deprecations) — any of
 *  these (e.g. saved in a visitor's localStorage before the retirement) is
 *  silently swapped for the current default instead of 404ing forever. */
const RETIRED_GROQ_MODELS = new Set([
  'llama-3.1-8b-instant',
  'llama-3.3-70b-versatile',
  'qwen/qwen3-32b',
  'qwen/qwen3.6-27b',
  'meta-llama/llama-4-scout-17b-16e-instruct',
  'meta-llama/llama-4-maverick-17b-128e-instruct',
  'moonshotai/kimi-k2-instruct',
  'moonshotai/kimi-k2-instruct-0905',
  'groq/compound',
  'groq/compound-mini'
]);

/** Trim, default, and de-retire a model id. */
export const normalizeModel = (model: string | undefined): string => {
  const trimmed = (model ?? '').trim();
  if (!trimmed || RETIRED_GROQ_MODELS.has(trimmed)) return DEFAULT_GROQ_MODEL;
  return trimmed;
};

/** Reasoning models answer after an internal "thinking" phase that consumes
 *  completion tokens — keep it short and out of the visible answer. */
const reasoningTuning = (model: string): Record<string, unknown> =>
  model.startsWith('openai/gpt-oss') ? { reasoning_effort: 'low', include_reasoning: false } : {};

const chatBody = (model: string, system: string, user: string, maxTokens: number) => ({
  model,
  temperature: 0.5, // GPT-OSS behaves best in the 0.5–0.7 band
  max_completion_tokens: maxTokens, // current param name (max_tokens is legacy)
  ...reasoningTuning(model),
  messages: [
    { role: 'system', content: system },
    { role: 'user', content: user }
  ]
});

export type GroqErrorKind =
  | 'auth'
  | 'rate'
  | 'model'
  | 'network'
  | 'http'
  | 'empty'
  | 'proxy-absent'
  | 'config';

export class GroqError extends Error {
  kind: GroqErrorKind;
  status?: number;

  constructor(kind: GroqErrorKind, message: string, status?: number) {
    super(message);
    this.name = 'GroqError';
    this.kind = kind;
    this.status = status;
  }
}

export interface AskGroqOptions {
  /** Optional: only needed for direct mode (no proxy / proxy unconfigured). */
  apiKey?: string;
  model: string;
  system: string;
  user: string;
  maxTokens?: number;
  signal?: AbortSignal;
}

type ProxyResult =
  | { kind: 'ok'; content: string }
  | { kind: 'absent' }
  | { kind: 'error'; error: GroqError; serverUnconfigured?: boolean };

/** Map a non-2xx proxy JSON response onto a user-facing GroqError. */
const proxyError = (status: number, data: Record<string, unknown> | null): GroqError => {
  const message =
    typeof data?.error === 'string' && data.error ? data.error : `AI proxy error ${status}.`;
  if (status === 429 || data?.kind === 'rate') return new GroqError('rate', message, 429);
  if (data?.kind === 'auth') return new GroqError('auth', message, status);
  if (data?.kind === 'model') return new GroqError('model', message, status);
  if (data?.kind === 'empty') return new GroqError('empty', message, status);
  return new GroqError('http', message, status);
};

const askViaProxy = async ({
  model,
  system,
  user,
  maxTokens = 800,
  signal
}: AskGroqOptions): Promise<ProxyResult> => {
  let response: Response;
  try {
    response = await fetch(PROXY_ENDPOINT, {
      method: 'POST',
      signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, system, user, max_tokens: maxTokens })
    });
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') throw e;
    return { kind: 'absent' }; // unreachable origin / offline — direct mode will report properly
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return { kind: 'absent' }; // SPA fallback HTML = no function here

  let data: Record<string, unknown> | null = null;
  try {
    data = (await response.json()) as Record<string, unknown>;
  } catch {
    return { kind: 'absent' };
  }

  if (response.ok) {
    const content = data?.content;
    if (typeof content === 'string' && content.trim()) return { kind: 'ok', content: content.trim() };
    return { kind: 'error', error: new GroqError('empty', 'The AI proxy returned an empty response — try rephrasing.') };
  }

  return {
    kind: 'error',
    error: proxyError(response.status, data),
    serverUnconfigured: data?.kind === 'config'
  };
};

const askDirect = async ({ apiKey, model, system, user, maxTokens = 800, signal }: AskGroqOptions): Promise<string> => {
  if (!apiKey?.trim()) {
    throw new GroqError('auth', 'No API key set — add your Groq key first.');
  }

  let response: Response;
  try {
    response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify(chatBody(normalizeModel(model), system, user, maxTokens))
    });
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') throw e;
    throw new GroqError('network', 'Could not reach api.groq.com — network error or blocked request.');
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    if (response.status === 401 || response.status === 403) {
      throw new GroqError('auth', 'Groq rejected the API key (401). Double-check the key and try again.', 401);
    }
    if (response.status === 429) {
      throw new GroqError('rate', 'Rate limited (429). Free Groq tiers throttle quickly — wait ~30 seconds and retry.', 429);
    }
    if (response.status === 404) {
      throw new GroqError('model', `Model "${model}" was not found (404) — check the model id.`, 404);
    }
    const detail = body.slice(0, 240);
    throw new GroqError('http', `Groq error ${response.status}${detail ? `: ${detail}` : ''}`, response.status);
  }

  const data = await response.json().catch(() => null);
  const content: unknown = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) {
    throw new GroqError('empty', 'Groq returned an empty response — try rephrasing your question.');
  }
  return content.trim();
};

/** Ask through the proxy when available, else directly with a client key. */
export async function askGroq(options: AskGroqOptions): Promise<string> {
  // Normalize once up front: trims, defaults empty, and swaps retired ids
  // (saved in old localStorage configs) for the current default model.
  const normalized: AskGroqOptions = { ...options, model: normalizeModel(options.model) };

  const proxied = await askViaProxy(normalized);
  if (proxied.kind === 'ok') return proxied.content;

  if (proxied.kind === 'error' && !proxied.serverUnconfigured) {
    // The proxy exists and reported a real answer-adjacent failure (rate, auth,
    // model…) — surfacing it beats silently switching paths.
    throw proxied.error;
  }

  // Proxy absent, or present-but-unconfigured: direct mode needs a client key.
  if (normalized.apiKey?.trim()) return askDirect(normalized);

  if (proxied.kind === 'error') throw proxied.error; // unconfigured-server message
  throw new GroqError(
    'proxy-absent',
    'No AI proxy on this deployment and no API key set — paste a Groq key in the ⚙ settings (or configure the server key).'
  );
}
