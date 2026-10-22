/**
 * Minimal Groq chat-completions client (browser, no SDK).
 *
 * Deliberately small: single-turn requests with tight token budgets so the
 * free/rate-limited Groq tiers stay usable. The API key is never sent
 * anywhere except api.groq.com and is persisted only in localStorage (opt-in)
 * or read from the VITE_GROQ_API_KEY env var at build time.
 */

export const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

/** Fast model with the most generous free-tier limits — safe default. */
export const DEFAULT_GROQ_MODEL = 'llama-3.1-8b-instant';

/** Suggested ids for the model picker; Groq renames models occasionally. */
export const GROQ_MODEL_SUGGESTIONS = [
  'llama-3.1-8b-instant',
  'llama-3.3-70b-versatile',
  'openai/gpt-oss-120b',
  'qwen/qwen3-32b'
];

export type GroqErrorKind = 'auth' | 'rate' | 'model' | 'network' | 'http' | 'empty';

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
  apiKey: string;
  model: string;
  system: string;
  user: string;
  maxTokens?: number;
  signal?: AbortSignal;
}

export async function askGroq({
  apiKey,
  model,
  system,
  user,
  maxTokens = 500,
  signal
}: AskGroqOptions): Promise<string> {
  if (!apiKey.trim()) {
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
      body: JSON.stringify({
        model: model.trim() || DEFAULT_GROQ_MODEL,
        temperature: 0.4,
        max_tokens: maxTokens,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ]
      })
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
      throw new GroqError(
        'rate',
        'Rate limited (429). Free Groq tiers throttle quickly — wait ~30 seconds and retry.',
        429
      );
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
}
