import React, { useState } from 'react';
import { Send, FileText, CheckCircle2, AlertCircle, Sparkles, Award } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

export const ReportStudioDemo: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const { addTriageReport } = useProgress();
  const [title, setTitle] = useState('IDOR on /api/orders/:id allows unauthenticated access to customer PII');
  const [asset, setAsset] = useState('https://shopnova.io');
  const [vulnType, setVulnType] = useState('Insecure Direct Object Reference (IDOR)');
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('High');
  const [steps, setSteps] = useState(`1. Navigate to https://shopnova.io/orders.
2. Observe current order #8821 for logged-in user buyer_alex.
3. Send a GET request to /api/orders/8820 without sending authentication cookies.
4. The server returns 200 OK containing customer Dr. Evelyn Reed's full name and address (404 DARPA Way).`);
  const [impact, setImpact] = useState('Any attacker can enumerate order numbers sequentially from 1 to 100,000, scraping all customer delivery addresses and order totals, constituting a massive GDPR violation and breach of customer privacy.');
  const [remediation, setRemediation] = useState('Add an ownership check in the order endpoint controller: ensure req.session.userId === order.userId before returning order details.');
  
  const [submittedReport, setSubmittedReport] = useState<any | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !steps || !impact) {
      alert('Please fill out Title, Steps to Reproduce, and Business Impact.');
      return;
    }

    const report = addTriageReport({
      title,
      targetAsset: asset,
      vulnerabilityType: vulnType,
      severity,
      stepsToReproduce: steps,
      businessImpact: impact,
      remediation
    });

    setSubmittedReport(report);
    if (onComplete) onComplete();
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 my-4 shadow-xl font-mono text-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100 font-sans">
              Interactive Lab: Bug Bounty Report Submission & Triage
            </h4>
            <p className="text-[11px] text-slate-400 font-sans">
              Write an undeniable report that a security triage team can verify and award in under 5 minutes.
            </p>
          </div>
        </div>

        <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
          HackerOne / Bugcrowd Standard
        </span>
      </div>

      {submittedReport ? (
        <div className="p-5 bg-slate-950 rounded-xl border border-emerald-500/50 space-y-4 font-sans">
          <div className="flex items-center space-x-3 text-emerald-400">
            <div className="p-2 bg-emerald-950 rounded-lg border border-emerald-800">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-100">
                Report Triaged: Accepted &amp; Verified!
              </h4>
              <p className="text-xs text-slate-400">
                Triaged by Security Response Team • Status: <strong>Triaged / Pending Bounty</strong>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
              <span className="text-[10px] uppercase text-slate-500 block">Assessed Severity</span>
              <span className="font-bold text-purple-400 text-sm font-mono">{submittedReport.severity}</span>
            </div>
            <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
              <span className="text-[10px] uppercase text-slate-500 block">Clarity Score</span>
              <span className="font-bold text-emerald-400 text-sm font-mono">{submittedReport.score} / 100</span>
            </div>
            <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
              <span className="text-[10px] uppercase text-slate-500 block">Intuition Points</span>
              <span className="font-bold text-amber-400 text-sm font-mono">+150 XP</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded border border-slate-800 space-y-1.5 text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Triage Analyst Notes</span>
            <ul className="space-y-1 text-slate-300">
              {submittedReport.feedback?.map((fb: string, i: number) => (
                <li key={i} className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{fb}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setSubmittedReport(null)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-bold transition"
          >
            Edit / Draft Another Report
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 font-sans">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1 font-mono">
                Report Title (Clear, Specific, High-Signal)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100 text-xs font-mono focus:border-purple-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1 font-mono">
                Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 text-xs font-mono focus:outline-none"
              >
                <option value="Low">Low (P4)</option>
                <option value="Medium">Medium (P3)</option>
                <option value="High">High (P2)</option>
                <option value="Critical">Critical (P1)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1 font-mono">
                Target Asset
              </label>
              <input
                type="text"
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100 text-xs font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1 font-mono">
                Vulnerability Classification
              </label>
              <input
                type="text"
                value={vulnType}
                onChange={(e) => setVulnType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-slate-100 text-xs font-mono focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1 font-mono">
              Numbered Steps to Reproduce
            </label>
            <textarea
              rows={4}
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-slate-100 text-xs font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1 font-mono">
              Real-World Business Impact
            </label>
            <textarea
              rows={2}
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-slate-100 text-xs font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1 font-mono">
              Suggested Engineering Remediation
            </label>
            <textarea
              rows={2}
              value={remediation}
              onChange={(e) => setRemediation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-slate-100 text-xs font-mono focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-slate-950 font-bold rounded-lg transition flex items-center justify-center space-x-2 text-xs shadow-lg shadow-purple-950/40"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Report for Triage Evaluation</span>
          </button>
        </form>
      )}
    </div>
  );
};
