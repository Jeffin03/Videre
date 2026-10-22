import React, { useState, useRef } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, RefreshCw, FileSearch, AlertTriangle } from 'lucide-react';

/* ── ControlGapAuditDemo ──────────────────────────────────────────────────
   Track 5 (GRC), lesson 5.8 — Audit Evidence.
   An audit evidence packet for the customer database: ten controls, each
   with a claimed artifact. The learner classifies each as Evidence Present
   / Missing. Evidence must also be CURRENT (cover the audit period) and
   prove OPERATION (not just intent) — three controls fail on those terms.
   "Run Gap Analysis" validates with per-row feedback and awards the
   lesson challenge exactly once when the correct three gaps are found.
   ───────────────────────────────────────────────────────────────────────── */

interface ControlRow {
  id: string;
  control: string;
  artifact: string;
  intended: 'present' | 'missing';
  gapMode?: 'stale' | 'absent' | 'intent';
  note: string;
}

const CONTROL_ROWS: ControlRow[] = [
  {
    id: 'ENC-01',
    control: 'Encryption at rest for the customer database (AES-256, managed keys)',
    artifact: 'kms_key_rotation_log_2026Q3.csv',
    intended: 'present',
    note: 'Operational log covering the audit period: keys rotated on schedule, attributable to the KMS.'
  },
  {
    id: 'MFA-02',
    control: 'MFA enforced for all accounts with admin access',
    artifact: 'okta_mfa_policy_export_2026-09.pdf',
    intended: 'present',
    note: 'Current policy export showing the MFA factor requirement bound to every admin group.'
  },
  {
    id: 'AR-04',
    control: 'Quarterly access review for the customer database',
    artifact: 'access_review_2024Q4.xlsx',
    intended: 'missing',
    gapMode: 'stale',
    note: 'Stale evidence: the review is 14 months old and covers zero days of the 2026 audit period. Design exists; operation does not — for this period, the control did not happen.'
  },
  {
    id: 'BK-07',
    control: 'Backup restore test (semiannual, documented results)',
    artifact: '— no artifact found in the evidence drive —',
    intended: 'missing',
    gapMode: 'absent',
    note: 'Absent evidence: nobody has ever tested that the backups restore. "We take backups" is an assumption until a restore log proves it.'
  },
  {
    id: 'LOG-03',
    control: 'Audit log retention of at least 12 months',
    artifact: 'splunk_retention_query_2026-09.csv',
    intended: 'present',
    note: 'Query results prove the retention configuration is live: 400 days of searchable audit logs.'
  },
  {
    id: 'CHG-05',
    control: 'Documented approvals for production changes',
    artifact: 'jira_cr_approvals_2026Q3.csv',
    intended: 'present',
    note: 'Approval export for every Q3 production change: attributable, timestamped, complete.'
  },
  {
    id: 'IR-09',
    control: 'Annual incident response tabletop exercise',
    artifact: 'tabletop_report_2026-05.pdf',
    intended: 'present',
    note: 'Dated exercise report with attendance and lessons-learned actions — the artifact of a control that actually operated.'
  },
  {
    id: 'VND-06',
    control: 'Security reassessment of all critical vendors',
    artifact: 'vendor_assessment_matrix_2026.xlsx',
    intended: 'present',
    note: 'Current matrix: every critical vendor reassessed within the last 12 months, with sign-off dates.'
  },
  {
    id: 'PEN-10',
    control: 'Annual penetration test with tracked remediation',
    artifact: 'pentest_report_vantara_2026-07.pdf',
    intended: 'present',
    note: 'Third-party report from this year plus the remediation tracker closing the findings.'
  },
  {
    id: 'DSP-11',
    control: 'Data disposal executed and logged when retention expires',
    artifact: 'data_disposal_policy_v2.pdf',
    intended: 'missing',
    gapMode: 'intent',
    note: 'A policy filed as evidence: it proves the rule was written, not that anyone ever executed it. Execution needs a disposal log with dates and volumes.'
  }
];

type Verdict = 'present' | 'missing' | null;

export const ControlGapAuditDemo: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [verdicts, setVerdicts] = useState<Record<string, Verdict>>(
    Object.fromEntries(CONTROL_ROWS.map(r => [r.id, null])) as Record<string, Verdict>
  );
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const completedRef = useRef(false);

  const setVerdict = (id: string, v: Verdict) => {
    setSubmitted(false);
    setNotice(null);
    setVerdicts(prev => ({ ...prev, [id]: v }));
  };

  const rowCorrect = (row: ControlRow) => verdicts[row.id] === row.intended;
  const correctCount = CONTROL_ROWS.filter(rowCorrect).length;
  const allClassified = CONTROL_ROWS.every(r => verdicts[r.id] !== null);
  const gapsFound = CONTROL_ROWS.filter(r => verdicts[r.id] === 'missing').length;

  const handleSubmit = () => {
    if (!allClassified) {
      setSubmitted(false);
      setNotice('Classify all ten controls before running the gap analysis — an unclassified control is exactly how gaps hide.');
      return;
    }
    setSubmitted(true);
    setNotice(null);
    if (correctCount === CONTROL_ROWS.length && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  };

  const handleReset = () => {
    setVerdicts(Object.fromEntries(CONTROL_ROWS.map(r => [r.id, null])) as Record<string, Verdict>);
    setSubmitted(false);
    setNotice(null);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 my-4 shadow-xl font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100 font-sans">
              Interactive Lab: Audit Evidence Gap Analysis
            </h4>
            <p className="text-[11px] text-slate-400 font-sans">
              Ten claimed controls, ten artifacts. Evidence must exist, cover the audit period, and prove the control
              operated — not just that it was designed.
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center space-x-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition font-sans"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Packet</span>
        </button>
      </div>

      {/* Asset profile */}
      <div className="mb-4 p-3 bg-slate-950 rounded-lg border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 font-sans">
        <div>
          <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block">Asset</span>
          <span className="text-xs text-slate-200 font-semibold">Customer Database (PROD)</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block">Owner</span>
          <span className="text-xs text-slate-200">Data Platform Team</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block">Audit Period</span>
          <span className="text-xs text-amber-300 font-mono">2026-01-01 → 2026-09-30</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block">In Scope For</span>
          <span className="text-xs text-slate-200">SOC 2 Type II · ISO 27001</span>
        </div>
      </div>

      {/* Control rows */}
      <div className="space-y-2">
        {CONTROL_ROWS.map(row => {
          const verdict = verdicts[row.id];
          const isCorrect = rowCorrect(row);

          return (
            <div
              key={row.id}
              className="bg-slate-950 rounded-lg border border-slate-800 p-3 font-sans space-y-1.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-start space-x-2">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 shrink-0 mt-0.5">
                    {row.id}
                  </span>
                  <span className="text-xs text-slate-200 leading-snug">{row.control}</span>
                </div>
                <div className="flex items-center space-x-1.5 shrink-0">
                  <button
                    onClick={() => setVerdict(row.id, 'present')}
                    className={`px-2 py-1 rounded text-[11px] transition ${
                      verdict === 'present'
                        ? 'bg-emerald-800 text-emerald-100 font-bold border border-emerald-600'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    Evidence Present
                  </button>
                  <button
                    onClick={() => setVerdict(row.id, 'missing')}
                    className={`px-2 py-1 rounded text-[11px] transition ${
                      verdict === 'missing'
                        ? 'bg-rose-800 text-rose-100 font-bold border border-rose-600'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    Missing
                  </button>
                  {submitted && (
                    <span
                      className={`flex items-center space-x-1 text-[10px] font-bold font-mono px-1.5 py-0.5 rounded border ${
                        isCorrect
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                          : 'bg-rose-950/60 text-rose-300 border-rose-800'
                      }`}
                    >
                      {isCorrect ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{isCorrect ? 'OK' : 'GAP CALL WRONG'}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="text-[10px] text-slate-500">
                <span className="uppercase font-mono font-bold">Artifact offered: </span>
                <span className="font-mono text-slate-400">{row.artifact}</span>
              </div>

              {submitted && (
                <div
                  className={`p-2 rounded text-[11px] leading-relaxed border ${
                    isCorrect
                      ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                      : 'bg-rose-950/30 border-rose-900/60 text-rose-200'
                  }`}
                >
                  <span className="font-bold">
                    {row.intended === 'missing' ? 'Actual verdict: MISSING.' : 'Actual verdict: PRESENT.'}
                  </span>{' '}
                  {row.note}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
        <button
          onClick={handleSubmit}
          className="flex items-center space-x-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs transition font-sans shadow-lg shadow-amber-950/40"
        >
          <FileSearch className="w-3.5 h-3.5" />
          <span>Run Gap Analysis</span>
        </button>
        <span className="text-[11px] text-slate-500 font-sans">
          {submitted
            ? `${gapsFound} gap(s) claimed by you · ${correctCount} of ${CONTROL_ROWS.length} verdicts match the auditor's.`
            : 'Classify every control, then run the analysis.'}
        </span>
      </div>

      {/* Notices */}
      {notice && (
        <div className="mt-3 p-2.5 bg-amber-950/30 border border-amber-800/60 rounded text-[11px] text-amber-200 font-sans">
          {notice}
        </div>
      )}
      {submitted && correctCount !== CONTROL_ROWS.length && (
        <div className="mt-3 p-3 bg-amber-950/30 border border-amber-800/60 rounded-lg text-[11px] text-amber-200 font-sans leading-relaxed flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <span className="font-bold">Not audit-ready yet.</span> Re-read the three failure modes in the rows you
            missed: evidence that is <span className="font-mono">stale</span> (does not cover 2026-01-01 →
            2026-09-30), evidence that is <span className="font-mono">absent</span> (no artifact at all), and a
            policy filed as if it were proof of <span className="font-mono">operation</span>.
          </span>
        </div>
      )}
      {submitted && correctCount === CONTROL_ROWS.length && (
        <div className="mt-3 p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-[11px] text-emerald-200 font-sans leading-relaxed flex items-start space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <span className="font-bold">Gap analysis complete: three findings.</span> AR-04 (stale access review),
            BK-07 (no restore-test record), DSP-11 (policy filed as evidence) — each becomes a finding with an
            owner, a severity, and a due date. Ten controls, three gaps, and the auditor grades the weakest
            evidence you produced, not the strongest.
          </span>
        </div>
      )}
    </div>
  );
};
