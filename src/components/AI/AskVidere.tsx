import React from 'react';
import { Lesson, Track } from '../../types';
import { getPathForTrack } from '../../data/paths';
import { renderExplanationMarkdown } from '../../utils/markdown';
import { askGroq, GroqError, DEFAULT_GROQ_MODEL, GROQ_MODEL_SUGGESTIONS } from '../../utils/groq';
import { Sparkles, X, Send, Loader2, KeyRound, Settings2, AlertTriangle, RotateCcw } from 'lucide-react';

interface AskVidereProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson;
  track: Track;
}

interface GroqConfig {
  apiKey: string;
  model: string;
}

const STORAGE_KEY = 'videre_groq_config';

const readEnv = (): GroqConfig => ({
  apiKey: (import.meta.env.VITE_GROQ_API_KEY as string | undefined) || '',
  model: (import.meta.env.VITE_GROQ_MODEL as string | undefined) || DEFAULT_GROQ_MODEL
});

const loadConfig = (): GroqConfig => {
  const env = readEnv();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<GroqConfig>;
      return {
        apiKey: typeof parsed.apiKey === 'string' ? parsed.apiKey : env.apiKey,
        model: typeof parsed.model === 'string' && parsed.model ? parsed.model : env.model
      };
    }
  } catch {
    /* corrupted entry — fall back to env */
  }
  return env;
};

const saveConfig = (config: GroqConfig) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    /* storage unavailable — key stays in memory for this session */
  }
};

const trim = (value: string, max: number) =>
  value.length > max ? `${value.slice(0, max)}… [excerpt trimmed]` : value;

/**
 * Everything the model needs to stay grounded in the current lesson.
 * Deliberately excludes challenge/solution fields — the tutor explains
 * concepts, it does not hand over answers.
 */
const buildSystemPrompt = (lesson: Lesson, track: Track): string => {
  const path = getPathForTrack(track.id);
  const notices = lesson.noticeThisMoments.map((n) => `- ${n}`).join('\n');

  return [
    'You are "Videre Mentor", a concise security tutor embedded in an interactive learning app.',
    'Answer the learner\'s question about the CURRENT LESSON below. Ground answers in this lesson\'s concepts.',
    'If the question is unrelated to security or this lesson, answer in one short sentence, then steer back to the lesson.',
    '',
    'Style rules:',
    '- Max ~180 words unless the learner explicitly asks for depth.',
    '- Friendly, direct, analogy-friendly; no filler, no disclaimers about being an AI.',
    '- Markdown ONLY: **bold**, *italic*, `code`, ### headings, - bullet lists, 1. numbered lists, > quotes, ``` code fences.',
    '- NEVER use markdown links, tables, or # H1 headings — they will not render.',
    '- Never invent lab values, flags, or scores that contradict the lesson text.',
    '',
    '=== CURRENT LESSON ===',
    `Path: ${path ? path.title : 'Videre'} › Track ${track.number}: ${track.title}`,
    `Lesson ${lesson.number}: ${lesson.title} — ${lesson.tagline}`,
    '',
    `Mental model: ${lesson.mentalModelConcept}`,
    '',
    `Discovery setup: ${lesson.discoveryPrompt}`,
    '',
    'What the lesson asks learners to notice:',
    notices,
    '',
    `Explanation excerpt:\n${trim(lesson.explanationMarkdown, 1600)}`,
    '',
    `Developer takeaway: ${lesson.devTakeaway}`,
    `Security-researcher takeaway: ${lesson.securityTakeaway}`
  ].join('\n');
};

const SUGGESTIONS = [
  'Explain the mental model of this lesson in a different way.',
  'Quiz me with one tricky question from this lesson.',
  'Give me a real-world example of this concept.'
];

export const AskVidere: React.FC<AskVidereProps> = ({ isOpen, onClose, lesson, track }) => {
  const [config, setConfig] = React.useState<GroqConfig>(loadConfig);
  // Don't force the key panel open on mount: the site's AI proxy (Netlify
  // Function) needs no client key at all. ask() opens it automatically only
  // when there's genuinely no way to reach an AI (no proxy + no key).
  const [showConfig, setShowConfig] = React.useState(false);
  const [apiKeyInput, setApiKeyInput] = React.useState('');
  const [modelInput, setModelInput] = React.useState('');
  const [question, setQuestion] = React.useState('');
  const [answer, setAnswer] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [askCount, setAskCount] = React.useState(0);
  const abortRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    setConfig(loadConfig());
  }, [isOpen]);

  React.useEffect(() => () => abortRef.current?.abort(), []);

  if (!isOpen) return null;

  const persistAndCloseConfig = () => {
    const next: GroqConfig = {
      apiKey: apiKeyInput.trim() || config.apiKey,
      model: modelInput.trim() || config.model || DEFAULT_GROQ_MODEL
    };
    setConfig(next);
    saveConfig(next);
    setApiKeyInput('');
    setModelInput('');
    setShowConfig(false);
    setError('');
  };

  const ask = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    // A key is NOT required when the site's AI proxy is active — askGroq
    // tries the proxy first and only falls back to direct mode (which needs
    // a stored/env key) when no proxy answers.

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError('');
    setAnswer('');

    try {
      const result = await askGroq({
        apiKey: config.apiKey,
        model: config.model,
        system: buildSystemPrompt(lesson, track),
        user: trimmed,
        signal: controller.signal
      });
      setAnswer(result);
      setAskCount((n) => n + 1);
    } catch (e) {
      if ((e as Error)?.name === 'AbortError') return;
      if (e instanceof GroqError) {
        setError(e.message);
        // Nothing to talk to at all → surface the one-time key setup.
        if (e.kind === 'proxy-absent') setShowConfig(true);
      } else setError('Something went wrong talking to Groq — try again.');
    } finally {
      if (abortRef.current === controller) {
        setLoading(false);
        abortRef.current = null;
      }
    }
  };

  const runSuggestion = (text: string) => {
    setQuestion(text);
    void ask(text);
  };

  return (
    <div className="fixed top-16 right-3 left-3 sm:left-auto sm:top-20 sm:right-5 sm:w-[26rem] z-[60] font-sans animate-in fade-in">
      <div className="bg-slate-900/97 border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/50 backdrop-blur-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-950/60 to-slate-900 border-b border-slate-800">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            </span>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-100">Ask Videre</span>
              <span className="ml-2 text-[9px] font-mono uppercase font-bold text-purple-300 bg-purple-950 border border-purple-800 px-1.5 py-px rounded">
                Groq AI
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={() => setShowConfig((s) => !s)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="API key & model settings"
            >
              <Settings2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-950/50 transition"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(100vh-9rem)] overflow-y-auto p-4 space-y-3">
          {/* Lesson context chip */}
          <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500 min-w-0">
            <span className="text-cyan-400 shrink-0">CONTEXT ▸</span>
            <span className="truncate">
              T{track.number}.{lesson.number} · {lesson.title}
            </span>
          </div>

          {/* Settings panel */}
          {showConfig && (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5 animate-in fade-in">
              <label className="block text-[10px] uppercase font-mono font-bold text-slate-500">
                Groq API key{' '}
                <span className="text-slate-600 normal-case font-normal">
                  — optional if this site's AI proxy is active · stored only in this browser
                </span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder={config.apiKey ? '••••••••••••••••  (saved — paste to replace)' : 'gsk_...'}
                  className="flex-1 min-w-0 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-purple-400"
                />
                <KeyRound className="w-4 h-4 text-slate-600 self-center shrink-0" />
              </div>

              <label className="block text-[10px] uppercase font-mono font-bold text-slate-500">
                Model <span className="text-slate-600 normal-case font-normal">— smaller = higher rate limits</span>
              </label>
              <input
                list="videre-groq-models"
                value={modelInput}
                onChange={(e) => setModelInput(e.target.value)}
                placeholder={config.model || DEFAULT_GROQ_MODEL}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-purple-400"
              />
              <datalist id="videre-groq-models">
                {GROQ_MODEL_SUGGESTIONS.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>

              <div className="flex space-x-2 pt-0.5">
                <button
                  onClick={persistAndCloseConfig}
                  disabled={!apiKeyInput.trim() && !config.apiKey && !modelInput.trim()}
                  className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-slate-100 font-bold rounded-lg text-xs transition"
                >
                  {config.apiKey || config.model ? 'Update' : 'Save'}
                </button>
                {(config.apiKey || config.model) && (
                  <button
                    onClick={() => setShowConfig(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <p className="text-[10px] text-slate-600 leading-relaxed">
                Free key: console.groq.com/keys — or set <code className="text-cyan-400">VITE_GROQ_API_KEY</code> in{' '}
                <code className="text-cyan-400">.env</code> at build time. With the site's AI proxy active, no key is
                needed here at all.
              </p>
            </div>
          )}

          {!showConfig && (
            <>
              {/* Suggestion chips */}
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => runSuggestion(s)}
                    disabled={loading}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-purple-950 hover:border-purple-700 border border-slate-700 text-slate-300 hover:text-purple-200 transition disabled:opacity-50"
                  >
                    {s.length > 34 ? `${s.slice(0, 34)}…` : s}
                  </button>
                ))}
              </div>

              {/* Question input */}
              <div className="space-y-2">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      void ask(question);
                    }
                  }}
                  rows={3}
                  placeholder="Ask anything about this lesson… (Ctrl+Enter to send)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 resize-none focus:outline-none focus:border-purple-400"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-600">
                    {askCount} asked this session
                  </span>
                  <button
                    onClick={() => void ask(question)}
                    disabled={loading || !question.trim()}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-slate-100 font-bold rounded-lg text-xs transition"
                  >
                    {loading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>{loading ? 'Thinking…' : 'Ask'}</span>
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start space-x-2 p-2.5 bg-rose-950/50 border border-rose-900 rounded-lg text-[11px] text-rose-200 animate-in fade-in">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Answer */}
              {answer && !loading && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 animate-in fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-500">Mentor</span>
                    <button
                      onClick={() => {
                        setAnswer('');
                        setQuestion('');
                      }}
                      className="flex items-center space-x-1 text-[10px] text-slate-500 hover:text-slate-300 transition"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  </div>
                  <div className="text-sm leading-relaxed text-slate-300">
                    <div dangerouslySetInnerHTML={{ __html: renderExplanationMarkdown(answer) }} />
                  </div>
                </div>
              )}

              <p className="text-[10px] text-slate-600 leading-relaxed">
                Answers are generated by Groq and grounded in this lesson only. Free tiers throttle
                fast — if you hit a 429, wait a moment and retry.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
