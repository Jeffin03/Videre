import React, { useRef, useState } from 'react';
import { Inbox, ChevronDown, ChevronUp, CheckCircle2, XCircle, RefreshCw, Sparkles, AlertTriangle, Server, FileClock } from 'lucide-react';

type Verdict = 'tp' | 'fp' | 'nmi';

interface TriageAlert {
  id: string;
  rule: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  asset: string;
  assetClass: 'Crown Jewel' | 'Business Critical' | 'Standard';
  source: string;
  snippet: string;
  context: string[];
  verdict: Verdict;
  rationale: string;
}

const ALERTS: TriageAlert[] = [
  {
    id: 'ALT-4471',
    rule: 'Brute force: 14 failed logons in 60s',
    severity: 'High',
    asset: 'MKT-WEB-01',
    assetClass: 'Standard',
    source: '203.0.113.44',
    snippet: '4625 Logon Type 3 — user=guest@marketo failed x14 from 203.0.113.44',
    context: [
      'Asset: public marketing site, static content, no customer data. Owner: growth team.',
      '203.0.113.44 is the corporate QA egress IP — seen in the allowlist since 2024.',
      'Change ticket CHG-4471: approved load test 02:00–03:00 tonight.',
      'Zero matching 4624 successes for that username. EDR shows no new sessions on the host.'
    ],
    verdict: 'fp',
    rationale: 'Documented load test from a known QA egress IP with no successful logons. Close as false positive — but add a note and an allowlist entry scoped to the change window, never a blanket suppress.'
  },
  {
    id: 'ALT-4472',
    rule: 'Member added to Domain Admins (4728)',
    severity: 'Medium',
    asset: 'FIN-DC01',
    assetClass: 'Crown Jewel',
    source: 'FIN-DC01 internal',
    snippet: '4728 Member Added: CN=svc_deploy,OU=ServiceAccounts → CN=Domain Admins',
    context: [
      'Asset: finance domain controller — payroll, file shares, and every hashed credential in the domain.',
      'Change ticket: none found in the last 30 days.',
      'svc_deploy has no standing admin rights; its last use was a routine app deployment 14 days ago.',
      'Time: 03:12, outside any documented maintenance window.'
    ],
    verdict: 'tp',
    rationale: 'Medium severity on a crown-jewel asset with no business justification is a P1 in everything but name. Severity came from the rule; priority comes from the asset and the missing ticket. Escalate now.'
  },
  {
    id: 'ALT-4473',
    rule: 'Periodic outbound connection (every 60s ± 3s)',
    severity: 'Low',
    asset: 'ENG-LAPTOP-221',
    assetClass: 'Standard',
    source: '185.244.21.7',
    snippet: 'TLS SNI syncpulse-analytics.net — 60s interval, sustained 3h, unsigned binary',
    context: [
      'Process is signed by "SyncPulse Ltd" — an unknown publisher with a 47-day-old certificate.',
      'Binary is not in the software catalog; no deployment ticket references it.',
      'Threat intel lookup: no verdict yet — feed cache is 6 hours old.',
      'Asset owner is on leave; nobody can confirm the software is expected.'
    ],
    verdict: 'nmi',
    rationale: 'Regularity beats severity — human traffic is bursty, machine traffic is metronomic — but you still cannot name the binary. Enrich before acting: hash reputation, intel refresh, then contact the owner. Escalate to isolate only if enrichment confirms.'
  },
  {
    id: 'ALT-4474',
    rule: 'Encoded PowerShell command (4104)',
    severity: 'Critical',
    asset: 'LOBBY-KIOSK-07',
    assetClass: 'Business Critical',
    source: 'LOBBY-KIOSK-07',
    snippet: 'powershell.exe -nop -w hidden -enc SQBFAFgA... parent: PDF viewer',
    context: [
      'Asset: unattended lobby kiosk on the public floor — no legitimate user to ask.',
      'Kiosk policy runs a locked-down shell; there is no administrative justification for PowerShell.',
      'Egress observed to a domain registered 11 days ago.',
      'No change ticket, no deployment window, no owner awake.'
    ],
    verdict: 'tp',
    rationale: 'Critical severity, an unattended asset that no human can vouch for, and zero business justification: this is the alert you wake people for. Escalate immediately and isolate the kiosk.'
  },
  {
    id: 'ALT-4475',
    rule: 'Anomalous data upload: 214 MB to cloud storage',
    severity: 'High',
    asset: 'HR-LAPTOP-019',
    assetClass: 'Business Critical',
    source: '10.14.7.19',
    snippet: '214 MB PUT to onedrive.live.com business tenant at 09:11',
    context: [
      'User m.okafor (HR) is uploading onboarding_photos.zip during business hours.',
      'Destination is the approved corporate OneDrive tenant — not a personal or unknown bucket.',
      'DLP tag PII:internal present; classification rules allow this destination for HR.',
      'Manager-approved ticket CHG-4482: "offsite backup of onboarding archive".'
    ],
    verdict: 'fp',
    rationale: 'Technically true (big upload happened) but operationally expected: approved destination, approved ticket, correct data class. Close as false positive and tune the rule to alert on unapproved tenants instead of volume alone.'
  }
];

const VERDICT_META: Record<Verdict, { label: string; buttonClass: string; badgeClass: string }> = {
  tp: {
    label: 'True Positive',
    buttonClass: 'bg-rose-950/50 hover:bg-rose-900/60 border-rose-800 text-rose-300',
    badgeClass: 'bg-rose-950/70 text-rose-300 border-rose-800'
  },
  fp: {
    label: 'False Positive',
    buttonClass: 'bg-emerald-950/50 hover:bg-emerald-900/60 border-emerald-800 text-emerald-300',
    badgeClass: 'bg-emerald-950/70 text-emerald-300 border-emerald-800'
  },
  nmi: {
    label: 'Needs More Info',
    buttonClass: 'bg-cyan-950/50 hover:bg-cyan-900/60 border-cyan-800 text-cyan-300',
    badgeClass: 'bg-cyan-950/70 text-cyan-300 border-cyan-800'
  }
};

const SEVERITY_CLASS: Record<TriageAlert['severity'], string> = {
  Critical: 'bg-rose-950/70 text-rose-300 border-rose-800',
  High: 'bg-amber-950/70 text-amber-300 border-amber-800',
  Medium: 'bg-cyan-950/70 text-cyan-300 border-cyan-800',
  Low: 'bg-slate-800 text-slate-300 border-slate-700'
};

const ASSET_CLASS_BADGE: Record<TriageAlert['assetClass'], string> = {
  'Crown Jewel': 'bg-rose-950/60 text-rose-300 border-rose-800',
  'Business Critical': 'bg-amber-950/60 text-amber-300 border-amber-800',
  Standard: 'bg-slate-800 text-slate-400 border-slate-700'
};

export const AlertTriageDemo: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [verdicts, setVerdicts] = useState<Record<string, Verdict>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const firedRef = useRef(false);

  const answeredCount = Object.keys(verdicts).length;
  const correctCount = ALERTS.filter(a => verdicts[a.id] === a.verdict).length;
  const queueCleared = correctCount >= 4;

  const submitVerdict = (alert: TriageAlert, verdict: Verdict) => {
    setVerdicts(prev => {
      if (prev[alert.id]) return prev;
      const next = { ...prev, [alert.id]: verdict };
      const correct = ALERTS.filter(a => next[a.id] === a.verdict).length;
      if (correct >= 4 && !firedRef.current) {
        firedRef.current = true;
        if (onComplete) onComplete();
      }
      return next;
    });
  };

  const resetQueue = () => {
    setVerdicts({});
    setExpandedId(null);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 my-4 shadow-xl font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Inbox className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100 font-sans">
              Interactive Lab: Alert Triage Queue — Night Shift
            </h4>
            <p className="text-[11px] text-slate-400 font-sans">
              Five alerts, five verdicts. Load each alert's context before deciding — severity is what the rule thinks, priority is what the business would lose.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 font-sans">
            <span className="text-[11px] text-slate-400">Triage score:</span>
            <span className={`text-sm font-bold font-mono ${queueCleared ? 'text-emerald-400' : 'text-amber-400'}`}>
              {correctCount} / {ALERTS.length}
            </span>
            <span className="text-[10px] text-slate-500">({answeredCount} answered)</span>
          </div>
          <button
            onClick={resetQueue}
            className="flex items-center space-x-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition font-sans"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Alert cards */}
      <div className="space-y-3">
        {ALERTS.map(alert => {
          const chosen = verdicts[alert.id];
          const isCorrect = chosen === alert.verdict;
          const isExpanded = expandedId === alert.id;

          return (
            <div
              key={alert.id}
              className={`rounded-lg border transition ${
                chosen
                  ? isCorrect
                    ? 'bg-slate-950 border-emerald-800/60'
                    : 'bg-slate-950 border-rose-800/60'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              {/* Card head */}
              <div className="p-3 border-b border-slate-800/80">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-cyan-300 font-bold">{alert.id}</span>
                  <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold uppercase ${SEVERITY_CLASS[alert.severity]}`}>
                    {alert.severity}
                  </span>
                  <span className="px-1.5 py-0.5 rounded border text-[10px] uppercase text-slate-400 bg-slate-900 border-slate-800">
                    Rule: {alert.rule}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="flex items-center space-x-1 text-slate-300">
                    <Server className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-sans font-semibold">{alert.asset}</span>
                  </span>
                  <span className={`px-1.5 py-0.5 rounded border text-[10px] uppercase ${ASSET_CLASS_BADGE[alert.assetClass]}`}>
                    {alert.assetClass}
                  </span>
                  <span className="text-slate-500">source: <span className="text-slate-400">{alert.source}</span></span>
                </div>

                <pre className="mt-2 p-2 bg-slate-900/80 border border-slate-800 rounded text-[11px] text-amber-200 overflow-x-auto">
                  {alert.snippet}
                </pre>
              </div>

              {/* Context drawer */}
              <div className="px-3 py-2 border-b border-slate-800/80">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                  className="flex items-center space-x-1.5 text-[11px] text-cyan-300 hover:text-cyan-200 transition font-sans"
                >
                  <FileClock className="w-3.5 h-3.5" />
                  <span>{isExpanded ? 'Hide triage context' : 'Load triage context (asset, tickets, enrichment)'}</span>
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {isExpanded && (
                  <ul className="mt-2 space-y-1 list-disc pl-5 text-[11px] text-slate-300 font-sans leading-relaxed">
                    {alert.context.map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Verdict buttons */}
              <div className="p-3">
                {!chosen ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-500 mr-1">Your verdict:</span>
                    <button
                      onClick={() => submitVerdict(alert, 'tp')}
                      className={`px-2.5 py-1 rounded border text-[11px] font-bold transition ${VERDICT_META.tp.buttonClass}`}
                    >
                      True Positive
                    </button>
                    <button
                      onClick={() => submitVerdict(alert, 'fp')}
                      className={`px-2.5 py-1 rounded border text-[11px] font-bold transition ${VERDICT_META.fp.buttonClass}`}
                    >
                      False Positive
                    </button>
                    <button
                      onClick={() => submitVerdict(alert, 'nmi')}
                      className={`px-2.5 py-1 rounded border text-[11px] font-bold transition ${VERDICT_META.nmi.buttonClass}`}
                    >
                      Needs More Info
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className={`flex flex-wrap items-center justify-between gap-2 p-2.5 rounded border ${
                      isCorrect
                        ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                    }`}>
                      <span className="flex items-center space-x-1.5 font-sans text-[11px] font-semibold">
                        {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                        <span>
                          {isCorrect
                            ? `Correct — this is a ${VERDICT_META[alert.verdict].label}.`
                            : `Not quite — the correct verdict was ${VERDICT_META[alert.verdict].label}.`}
                        </span>
                      </span>
                      <span className={`px-1.5 py-0.5 rounded border text-[10px] uppercase font-bold ${VERDICT_META[alert.verdict].badgeClass}`}>
                        {VERDICT_META[alert.verdict].label}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                      <strong className="text-slate-200">Why:</strong> {alert.rationale}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Queue cleared state */}
      {queueCleared && (
        <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-500/60 rounded-lg text-emerald-200 text-xs font-sans flex items-start space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong>Queue cleared.</strong> You treated severity as an input, not a verdict: a Medium alert on a domain controller outranked a High alert on a marketing site, and the beacon you could not yet name stayed in "needs enrichment" instead of becoming a panic page.
          </span>
        </div>
      )}

      {/* Static teaching note */}
      <div className="mt-3 p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-400 font-sans flex items-start space-x-2">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
        <span>
          <strong className="text-slate-300">Remember:</strong> a false positive is not "nothing happened" — it is a tuning ticket. Every FP you document with context is a quieter queue for the next shift.
        </span>
      </div>
    </div>
  );
};
