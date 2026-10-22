import React, { useState, useRef } from 'react';
import { Scale, CheckCircle2, XCircle, TrendingDown, RefreshCw, ClipboardList } from 'lucide-react';

/* ── RiskRegisterDemo ─────────────────────────────────────────────────────
   Track 5 (GRC), lesson 5.3 — Risk Registers & Scoring.
   The learner scores four real scenarios: pick Likelihood (1-5) and
   Impact (1-5) per the scenario card (inherent = L x I), then apply a
   treatment control to watch the residual score move. "Submit Register"
   validates every row against the reference assessment with per-row
   feedback, and awards the lesson challenge exactly once on success.
   ───────────────────────────────────────────────────────────────────────── */

interface ControlOption {
  id: string;
  label: string;
  treatment: string;
  residualL: number;
  residualI: number;
}

interface RegisterRow {
  id: string;
  asset: string;
  scenario: string;
  intendedLikelihood: number;
  intendedImpact: number;
  likelihoodRationale: string;
  impactRationale: string;
  controls: ControlOption[];
}

const RISK_ROWS: RegisterRow[] = [
  {
    id: 'R-01',
    asset: 'Customer database admin panel',
    scenario:
      'The web-based admin console for the production customer database is reachable from the open internet at admin-db.nexus.example. No MFA is required; access is password-only.',
    intendedLikelihood: 4,
    intendedImpact: 5,
    likelihoodRationale:
      'Internet-exposed admin panels are found by continuous scanning within hours. Password-only access means one phished or leaked credential is game over.',
    impactRationale:
      'Full PII exfiltration for millions of records: breach notification, GDPR-scale fines, and civil claims. Worst-case impact on the register.',
    controls: [
      {
        id: 'c1',
        label: 'Move behind VPN + enforce MFA',
        treatment: 'Reduce',
        residualL: 1,
        residualI: 5
      },
      {
        id: 'c2',
        label: 'Monthly password rotation only',
        treatment: 'Reduce (weak)',
        residualL: 3,
        residualI: 5
      },
      {
        id: 'c3',
        label: 'Accept as-is (documented, signed)',
        treatment: 'Accept',
        residualL: 4,
        residualI: 5
      }
    ]
  },
  {
    id: 'R-02',
    asset: 'Sales laptop with contract folder',
    scenario:
      'The field sales team carries customer contract folders locally on unencrypted laptops. The devices travel daily; disk encryption and screen locks are not enforced.',
    intendedLikelihood: 2,
    intendedImpact: 3,
    likelihoodRationale:
      'Devices travel and are lost or stolen at a plausible-but-not-daily rate. Physical access is required, so this is no internet-exposed panel.',
    impactRationale:
      'A contract folder is Confidential, not regulated PII: commercial terms and pricing leak, but no notification-to-millions obligation follows.',
    controls: [
      {
        id: 'c1',
        label: 'Full-disk encryption + auto-lock',
        treatment: 'Reduce',
        residualL: 1,
        residualI: 3
      },
      {
        id: 'c2',
        label: 'Privacy screen filter only',
        treatment: 'Reduce (weak)',
        residualL: 2,
        residualI: 3
      },
      {
        id: 'c3',
        label: 'Stop issuing local copies (work in VDI)',
        treatment: 'Avoid',
        residualL: 1,
        residualI: 1
      }
    ]
  },
  {
    id: 'R-03',
    asset: 'Analytics vendor database access',
    scenario:
      'A third-party analytics vendor holds standing read access to the production customer database. The last security reassessment was signed in 2024 by someone who has since left the company.',
    intendedLikelihood: 3,
    intendedImpact: 4,
    likelihoodRationale:
      'A vendor with live production access multiplies your attack surface: their breach becomes your breach, and nobody has re-checked their controls in two years.',
    impactRationale:
      'Behavioral data across all customers: deeply Confidential and one step from regulated. Not the full PII jackpot, so a 4 rather than a 5.',
    controls: [
      {
        id: 'c1',
        label: 'Scoped read-only replica + annual reassessment',
        treatment: 'Reduce',
        residualL: 1,
        residualI: 3
      },
      {
        id: 'c2',
        label: 'Re-send the security questionnaire',
        treatment: 'Reduce (weak)',
        residualL: 2,
        residualI: 4
      },
      {
        id: 'c3',
        label: 'Cyber insurance naming this vendor',
        treatment: 'Transfer',
        residualL: 3,
        residualI: 2
      }
    ]
  },
  {
    id: 'R-04',
    asset: 'Deployment credentials (bus factor: 1)',
    scenario:
      'Exactly one engineer holds the production deployment credentials in their personal password manager. If they leave, fall ill, or get compromised, nobody can safely ship or revoke access.',
    intendedLikelihood: 3,
    intendedImpact: 3,
    likelihoodRationale:
      'Single-holder credentials fail in three ordinary ways: departure, mistake, and compromise. No exotic attacker required — routine attrition does it.',
    impactRationale:
      'Availability and integrity of deploys are hit directly; customer data is indirectly exposed. A disruptive incident rather than a data-breach jackpot.',
    controls: [
      {
        id: 'c1',
        label: 'Shared vault + break-glass rotation',
        treatment: 'Reduce',
        residualL: 1,
        residualI: 3
      },
      {
        id: 'c2',
        label: 'Credentials copied to the team wiki',
        treatment: 'Reduce (made it worse)',
        residualL: 4,
        residualI: 3
      },
      {
        id: 'c3',
        label: 'Dual-control releases (two-person sign-off)',
        treatment: 'Reduce',
        residualL: 2,
        residualI: 3
      }
    ]
  }
];

const scoreBand = (score: number): string => {
  if (score >= 15) return 'bg-rose-950/60 text-rose-300 border-rose-800';
  if (score >= 8) return 'bg-amber-950/60 text-amber-300 border-amber-800';
  if (score >= 4) return 'bg-cyan-950/60 text-cyan-300 border-cyan-800';
  return 'bg-emerald-950/60 text-emerald-300 border-emerald-800';
};

type RowState = { l: number | null; i: number | null; control: string | null };

const EMPTY_STATE: Record<string, RowState> = {
  'R-01': { l: null, i: null, control: null },
  'R-02': { l: null, i: null, control: null },
  'R-03': { l: null, i: null, control: null },
  'R-04': { l: null, i: null, control: null }
};

export const RiskRegisterDemo: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [rows, setRows] = useState<Record<string, RowState>>(EMPTY_STATE);
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const completedRef = useRef(false);

  const setField = (rowId: string, field: 'l' | 'i' | 'control', value: number | string) => {
    setSubmitted(false);
    setNotice(null);
    setRows(prev => ({
      ...prev,
      [rowId]: { ...prev[rowId], [field]: value }
    }));
  };

  const allFilled = Object.values(rows).every(r => r.l !== null && r.i !== null && r.control !== null);
  const rowCorrect = (row: RegisterRow) =>
    rows[row.id].l === row.intendedLikelihood && rows[row.id].i === row.intendedImpact;
  const correctCount = RISK_ROWS.filter(rowCorrect).length;

  const handleSubmit = () => {
    if (!allFilled) {
      setSubmitted(false);
      setNotice('Every row needs a Likelihood, an Impact, and an applied control before the register can be filed.');
      return;
    }
    setSubmitted(true);
    setNotice(null);
    if (correctCount === RISK_ROWS.length && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  };

  const handleReset = () => {
    setRows({
      'R-01': { l: null, i: null, control: null },
      'R-02': { l: null, i: null, control: null },
      'R-03': { l: null, i: null, control: null },
      'R-04': { l: null, i: null, control: null }
    });
    setSubmitted(false);
    setNotice(null);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 my-4 shadow-xl font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100 font-sans">
              Interactive Lab: Enterprise Risk Register — Q3 Intake
            </h4>
            <p className="text-[11px] text-slate-400 font-sans">
              Score inherent risk (Likelihood x Impact, before controls), apply a treatment, then file the register.
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center space-x-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition font-sans"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Register</span>
        </button>
      </div>

      {/* Scale legend */}
      <div className="mb-4 p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[10px] text-slate-400 font-sans leading-relaxed">
        <span className="text-[10px] uppercase font-mono font-bold text-slate-500">Likelihood scale: </span>
        1 Rare (needs stacked failures) · 3 Plausible (ordinary mistakes) · 4 Likely (scanners find it in hours) · 5
        Almost certain (happens yearly already).
        <span className="text-[10px] uppercase font-mono font-bold text-slate-500"> Impact scale: </span>
        1 Minor · 3 Confidential data / team disruption · 4 Deeply confidential data · 5 Regulated PII, existential fines.
      </div>

      {/* Risk rows */}
      <div className="space-y-3">
        {RISK_ROWS.map(row => {
          const st = rows[row.id];
          const inherent = st.l !== null && st.i !== null ? st.l * st.i : null;
          const chosenControl = row.controls.find(c => c.id === st.control) || null;
          const residualScore =
            chosenControl && st.l !== null && st.i !== null
              ? chosenControl.residualL * chosenControl.residualI
              : null;
          const isCorrect = rowCorrect(row);

          return (
            <div key={row.id} className="bg-slate-950 rounded-lg border border-slate-800 p-3 font-sans space-y-2.5">
              {/* Row header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                    {row.id}
                  </span>
                  <span className="text-xs font-bold text-slate-100">{row.asset}</span>
                </div>
                {submitted && (
                  <span
                    className={`flex items-center space-x-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${
                      isCorrect
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                        : 'bg-rose-950/60 text-rose-300 border-rose-800'
                    }`}
                  >
                    {isCorrect ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    <span>{isCorrect ? 'SCORING OK' : 'RE-SCORE'}</span>
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">{row.scenario}</p>

              {/* Likelihood + Impact pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono font-bold text-slate-500">
                    Likelihood (1-5)
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(v => (
                      <button
                        key={v}
                        onClick={() => setField(row.id, 'l', v)}
                        className={`flex-1 py-1 rounded text-xs font-mono transition ${
                          st.l === v
                            ? 'bg-amber-800 text-amber-100 font-bold border border-amber-600'
                            : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono font-bold text-slate-500">Impact (1-5)</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(v => (
                      <button
                        key={v}
                        onClick={() => setField(row.id, 'i', v)}
                        className={`flex-1 py-1 rounded text-xs font-mono transition ${
                          st.i === v
                            ? 'bg-amber-800 text-amber-100 font-bold border border-amber-600'
                            : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scores row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-500">Inherent</span>
                <span
                  className={`px-2 py-0.5 rounded border font-mono font-bold text-xs ${
                    inherent !== null ? scoreBand(inherent) : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  {inherent !== null ? `${st.l} x ${st.i} = ${inherent}` : '—'}
                </span>
                {chosenControl && residualScore !== null && (
                  <>
                    <span className="text-slate-600">→</span>
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-500">Residual</span>
                    <span
                      className={`px-2 py-0.5 rounded border font-mono font-bold text-xs ${scoreBand(residualScore)}`}
                    >
                      {residualScore}
                    </span>
                    <span className="flex items-center space-x-1 text-[10px] text-slate-500">
                      <TrendingDown className="w-3 h-3" />
                      <span>
                        {chosenControl.treatment} · {chosenControl.residualL}x{chosenControl.residualI}
                      </span>
                    </span>
                  </>
                )}
              </div>

              {/* Control / treatment picker */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono font-bold text-slate-500">
                  Apply treatment (then read the residual)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {row.controls.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setField(row.id, 'control', c.id)}
                      className={`px-2 py-1 rounded text-[11px] transition ${
                        st.control === c.id
                          ? 'bg-cyan-800 text-cyan-100 font-bold border border-cyan-600'
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Per-row reference feedback */}
              {submitted && !isCorrect && (
                <div className="p-2.5 bg-rose-950/30 border border-rose-900/60 rounded text-[11px] text-rose-200 leading-relaxed">
                  <span className="font-bold">Reference scoring:</span> {st.l}x{st.i} scored as{' '}
                  <span className="font-mono font-bold">
                    {row.intendedLikelihood} x {row.intendedImpact} = {row.intendedLikelihood * row.intendedImpact}
                  </span>
                  .
                  <div className="mt-1">
                    <span className="text-rose-300 font-bold">Why likelihood {row.intendedLikelihood}:</span>{' '}
                    {row.likelihoodRationale}
                  </div>
                  <div className="mt-1">
                    <span className="text-rose-300 font-bold">Why impact {row.intendedImpact}:</span>{' '}
                    {row.impactRationale}
                  </div>
                </div>
              )}
              {submitted && isCorrect && (
                <div className="p-2.5 bg-emerald-950/30 border border-emerald-800/60 rounded text-[11px] text-emerald-200 leading-relaxed">
                  <span className="font-bold">Reference agrees.</span> {row.likelihoodRationale}{' '}
                  {row.impactRationale}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
        <button
          onClick={handleSubmit}
          className="flex items-center space-x-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs transition font-sans shadow-lg shadow-amber-950/40"
        >
          <ClipboardList className="w-3.5 h-3.5" />
          <span>Submit Register</span>
        </button>
        <span className="text-[11px] text-slate-500 font-sans">
          {submitted
            ? `${correctCount} of ${RISK_ROWS.length} rows match the reference assessment.`
            : 'All four rows must be scored and treated before filing.'}
        </span>
      </div>

      {/* Notices */}
      {notice && (
        <div className="mt-3 p-2.5 bg-amber-950/30 border border-amber-800/60 rounded text-[11px] text-amber-200 font-sans">
          {notice}
        </div>
      )}
      {submitted && correctCount === RISK_ROWS.length && (
        <div className="mt-3 p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-[11px] text-emerald-200 font-sans leading-relaxed flex items-start space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <span className="font-bold">Register filed.</span> You scored inherent risk as if the controls did not
            exist, applied treatments, and can now state the residual the business is being asked to accept.
            Notice how Accept leaves the score untouched while Avoid and Reduce actually move it — that is the
            whole decision the register exists to force.
          </span>
        </div>
      )}
    </div>
  );
};
