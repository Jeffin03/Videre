import React, { useRef, useState } from 'react';
import {
  ScrollText,
  ShieldCheck,
  ShieldX,
  Timer,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Ban,
  UserCheck
} from 'lucide-react';

/* ── ScopeCheckDemo ────────────────────────────────────────────────────────
   "The Hunter's Craft" lesson 7.1 lab.
   The learner reads a bug bounty program brief, then classifies 8 target
   cards as In-Scope / Out-of-Scope / Needs Written Approval. Each answer
   is graded instantly with the real rationale. Scoring 7/8 or better fires
   onComplete exactly once (ref-guarded).
   ──────────────────────────────────────────────────────────────────────── */

type Verdict = 'in' | 'out' | 'approval';

interface ScopeTarget {
  id: string;
  asset: string;
  detail: string;
  answer: Verdict;
  rationale: string;
}

const PASS_THRESHOLD = 7;

const SCOPE_TARGETS: ScopeTarget[] = [
  {
    id: 't1',
    asset: 'app.example.com',
    detail: 'Main customer dashboard, listed in the program asset inventory.',
    answer: 'in',
    rationale: 'Covered by the wildcard rule `*.example.com` and explicitly listed. Full go.'
  },
  {
    id: 't2',
    asset: 'api.example.com/v1/orders',
    detail: 'REST endpoint the dashboard calls. Test accounts provided.',
    answer: 'in',
    rationale: 'The brief calls out `api.example.com/v1/*` as in scope with provided test accounts.'
  },
  {
    id: 't3',
    asset: 'ct-log-se.example.com',
    detail: 'Unlisted subdomain you found in a certificate transparency log.',
    answer: 'in',
    rationale: 'Wildcards cover every subdomain, even ones nobody listed. A newly discovered `*.example.com` host is fair game.'
  },
  {
    id: 't4',
    asset: 'partners.example.net',
    detail: 'Partner portal login form with a password reset flow.',
    answer: 'out',
    rationale: 'Explicitly excluded in the brief, and `*.example.com` never crosses a domain boundary into `.net`.'
  },
  {
    id: 't5',
    asset: 'HTTP flood: 5,000 req/s against /api/checkout',
    detail: 'To measure how much degradation the checkout takes before it fails.',
    answer: 'out',
    rationale: 'DoS and stress testing are excluded. Intent does not matter — testing it voids your safe harbor.'
  },
  {
    id: 't6',
    asset: 'pay.flowpath.com',
    detail: 'PCI payment iframe rendered inside the ExampleCo checkout page.',
    answer: 'approval',
    rationale: 'Third-party service: the program does not own it. The brief requires written approval before testing embedded vendors.'
  },
  {
    id: 't7',
    asset: 'staging.example.com',
    detail: 'Staging host matching the wildcard, but marked "Internal" in the asset inventory.',
    answer: 'approval',
    rationale: 'The wildcard matches, but the brief carves out Internal/staging hosts: written approval first, even for a single request.'
  },
  {
    id: 't8',
    asset: 'Smishing texts impersonating ExampleCo support',
    detail: 'Harvest a support agent\'s credentials via a fake login page.',
    answer: 'out',
    rationale: 'Social engineering is excluded outright. People are not infrastructure, and the report would be rejected pre-triage.'
  }
];

export const ScopeCheckDemo: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [choices, setChoices] = useState<Record<string, Verdict>>({});
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const completedRef = useRef(false);

  const completeOnce = () => {
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  };

  const choose = (id: string, verdict: Verdict) => {
    if (choices[id] !== undefined) return;
    const next = { ...choices, [id]: verdict };
    setChoices(next);

    const answeredCount = Object.keys(next).length;
    const correct = SCOPE_TARGETS.filter(t => next[t.id] === t.answer).length;
    setCorrectCount(correct);

    if (answeredCount === SCOPE_TARGETS.length) {
      setFinished(true);
      if (correct >= PASS_THRESHOLD) completeOnce();
    }
  };

  const reset = () => {
    setChoices({});
    setCorrectCount(0);
    setFinished(false);
  };

  const answeredCount = Object.keys(choices).length;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 my-4 shadow-xl font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
            <ScrollText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100">
              Interactive Lab: Scope Check — "ExampleCo VDP"
            </h4>
            <p className="text-[11px] text-slate-400">
              Read the brief like a professional hunter. Classify all 8 targets. Score 7/8 to internalize the scope.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400">Correct:</span>
            <span className="text-sm font-bold font-mono text-purple-400">
              {correctCount} / {SCOPE_TARGETS.length}
            </span>
          </div>
          <button
            onClick={reset}
            className="flex items-center space-x-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Program brief */}
        <div className="lg:col-span-2 bg-slate-950 rounded-lg border border-slate-800 p-4 space-y-4 text-xs">
          <div className="border-b border-slate-800 pb-2">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block">
              Program Brief — exampleco.com Responsible Disclosure
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              Safe harbor applies only to testing performed inside these written rules.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>In Scope</span>
            </span>
            <ul className="list-disc pl-5 space-y-1 text-slate-300 font-mono text-[11px]">
              <li><code className="text-cyan-300">*.example.com</code> — customer web app + all subdomains</li>
              <li><code className="text-cyan-300">api.example.com/v1/*</code> — published REST API (test accounts provided)</li>
              <li>Any subdomain you discover under <code className="text-cyan-300">example.com</code></li>
            </ul>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono font-bold text-rose-400 flex items-center space-x-1">
              <ShieldX className="w-3.5 h-3.5" />
              <span>Out of Scope</span>
            </span>
            <ul className="list-disc pl-5 space-y-1 text-slate-300 font-mono text-[11px]">
              <li><code className="text-rose-300">partners.example.net</code> and all <code className="text-rose-300">*.example.net</code> assets</li>
              <li>DoS / stress testing / brute force</li>
              <li>Social engineering of employees or customers</li>
              <li>Physical security testing</li>
            </ul>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-mono font-bold text-amber-400 flex items-center space-x-1">
              <Timer className="w-3.5 h-3.5" />
              <span>Written Approval Required</span>
            </span>
            <ul className="list-disc pl-5 space-y-1 text-slate-300 font-mono text-[11px]">
              <li>Third-party services embedded in the product</li>
              <li>Hosts marked <code className="text-amber-300">Internal</code> in the asset inventory (e.g. <code className="text-amber-300">staging.example.com</code>)</li>
            </ul>
          </div>
        </div>

        {/* Target cards */}
        <div className="lg:col-span-3 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SCOPE_TARGETS.map((t, idx) => {
              const chosen = choices[t.id];
              const answered = chosen !== undefined;
              const isCorrect = chosen === t.answer;

              return (
                <div
                  key={t.id}
                  className={`p-3 rounded-lg border transition ${
                    answered
                      ? isCorrect
                        ? 'bg-emerald-950/20 border-emerald-800/70'
                        : 'bg-rose-950/20 border-rose-800/70'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-mono text-[11px] font-bold text-cyan-300 break-all">
                      <span className="text-slate-600 mr-1">#{idx + 1}</span>
                      {t.asset}
                    </span>
                    {answered && (isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">{t.detail}</p>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => choose(t.id, 'in')}
                      disabled={answered}
                      className={`flex-1 py-1.5 rounded text-[11px] font-bold border transition ${
                        answered
                          ? t.answer === 'in'
                            ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-600'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-emerald-500 hover:text-emerald-300'
                      }`}
                    >
                      In-Scope
                    </button>
                    <button
                      onClick={() => choose(t.id, 'out')}
                      disabled={answered}
                      className={`flex-1 py-1.5 rounded text-[11px] font-bold border transition ${
                        answered
                          ? t.answer === 'out'
                            ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-600'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-rose-500 hover:text-rose-300'
                      }`}
                    >
                      Out-of-Scope
                    </button>
                    <button
                      onClick={() => choose(t.id, 'approval')}
                      disabled={answered}
                      className={`flex-1 py-1.5 rounded text-[11px] font-bold border transition ${
                        answered
                          ? t.answer === 'approval'
                            ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-600'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-amber-500 hover:text-amber-300'
                      }`}
                    >
                      Needs Approval
                    </button>
                  </div>

                  {answered && (
                    <div className="flex items-start space-x-1.5 mt-2 text-[11px] leading-relaxed">
                      {isCorrect ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <span className={isCorrect ? 'text-emerald-200' : 'text-rose-200'}>
                        {isCorrect ? 'Correct.' : 'Wrong call.'} {t.rationale}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Score verdict */}
          {finished && (
            <div
              className={`p-3.5 rounded-lg border text-xs leading-relaxed ${
                correctCount >= PASS_THRESHOLD
                  ? 'bg-purple-950/30 border-purple-600/60 text-purple-200'
                  : 'bg-amber-950/30 border-amber-800/60 text-amber-200'
              }`}
            >
              {correctCount >= PASS_THRESHOLD ? (
                <div className="flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-300 shrink-0 mt-0.5" />
                  <p>
                    <strong>Scope internalized — {correctCount}/{SCOPE_TARGETS.length}.</strong> You sorted every target the way a
                    triage team would. Wildcards cross subdomains but never domain boundaries; DoS and social engineering void
                    your safe harbor; third parties and Internal hosts need a written approval email first. This is the
                    paperwork that keeps a hunter out of legal trouble.
                  </p>
                </div>
              ) : (
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <p>
                    <strong>{correctCount}/{SCOPE_TARGETS.length} — below the 7/8 bar.</strong> Re-read the brief's three buckets and
                    try Reset. Watch for the two traps: a wildcard that does not cross domain boundaries, and assets that match
                    the wildcard but still require written approval.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer takeaway */}
      <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2">
        <Ban className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-300">The Takeaway:</strong> Scope is the program's written permission slip, not a
          suggestion. A critical bug found out of scope is still a rejected report — and no safe harbor. When a target is
          genuinely ambiguous, the professional move is to ask the program manager <em>before</em> testing, not to argue
          afterward. <UserCheck className="w-3 h-3 inline -mt-0.5 text-slate-500" />
        </p>
      </div>
    </div>
  );
};
