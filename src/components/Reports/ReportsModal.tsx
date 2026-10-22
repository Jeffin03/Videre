import React from 'react';
import { useProgress } from '../../context/ProgressContext';
import { X, FileText, Award, Inbox, CheckCircle2, Target, Wrench } from 'lucide-react';

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SEVERITY_STYLES: Record<string, string> = {
  Critical: 'text-rose-400 bg-rose-950/50 border-rose-800',
  High: 'text-amber-400 bg-amber-950/50 border-amber-800',
  Medium: 'text-yellow-400 bg-yellow-950/50 border-yellow-800',
  Low: 'text-cyan-400 bg-cyan-950/50 border-cyan-800'
};

export const ReportsModal: React.FC<ReportsModalProps> = ({ isOpen, onClose }) => {
  const { reports, progress } = useProgress();

  if (!isOpen) return null;

  const totalReportXp = reports.length * 150;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-4xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-100 text-sm sm:text-base flex items-center space-x-2">
                <span>Triage Report Portfolio</span>
                <span className="text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded">
                  {reports.length} filed
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Every disclosure you have submitted through the Report Studio (+150 XP each).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close reports"
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 divide-x divide-slate-800 bg-slate-950/60 border-b border-slate-800 text-center">
          <div className="py-2.5">
            <div className="text-lg font-black font-mono text-purple-300">{reports.length}</div>
            <div className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider">
              Reports Filed
            </div>
          </div>
          <div className="py-2.5">
            <div className="text-lg font-black font-mono text-emerald-400">+{totalReportXp}</div>
            <div className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider">
              XP Earned
            </div>
          </div>
          <div className="py-2.5">
            <div className="text-lg font-black font-mono text-cyan-300">
              {progress.triageReportsSubmitted}
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider">
              Triage Accepted
            </div>
          </div>
        </div>

        {/* Report List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {reports.length === 0 ? (
            <div className="py-14 text-center space-y-3">
              <div className="inline-flex p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-500">
                <Inbox className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-300">No reports filed yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  Head to <span className="text-cyan-400 font-semibold">Track 4 · Module 4.3</span> and use
                  the Report Studio to draft your first disclosure — or open the Intuition Lab from the navbar.
                </p>
              </div>
            </div>
          ) : (
            reports.map(report => (
              <article
                key={report.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3"
              >
                {/* Title row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <h4 className="font-display font-bold text-slate-100 text-sm leading-snug">
                      {report.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
                      <span className="flex items-center space-x-1 font-mono">
                        <Target className="w-3 h-3 text-cyan-500" />
                        <span className="truncate max-w-[240px]">{report.targetAsset}</span>
                      </span>
                      <span>{report.vulnerabilityType}</span>
                      <span className="font-mono text-slate-500">{report.timestamp}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-1.5 shrink-0">
                    <span
                      className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded border ${
                        SEVERITY_STYLES[report.severity] || 'text-slate-300 bg-slate-800 border-slate-700'
                      }`}
                    >
                      {report.severity}
                    </span>
                    <span className="flex items-center space-x-1 text-[11px] font-bold font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                      <Award className="w-3 h-3" />
                      <span>{report.score ?? '—'}/100</span>
                    </span>
                  </div>
                </div>

                {/* Body fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] leading-relaxed">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="block text-[9.5px] uppercase font-mono font-bold text-cyan-400 mb-1">
                      Steps to Reproduce
                    </span>
                    <p className="text-slate-300 whitespace-pre-wrap break-words line-clamp-4">
                      {report.stepsToReproduce}
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="block text-[9.5px] uppercase font-mono font-bold text-amber-400 mb-1">
                      Business Impact
                    </span>
                    <p className="text-slate-300 whitespace-pre-wrap break-words line-clamp-4">
                      {report.businessImpact}
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="block text-[9.5px] uppercase font-mono font-bold text-emerald-400 mb-1 flex items-center space-x-1">
                      <Wrench className="w-3 h-3" />
                      <span>Remediation</span>
                    </span>
                    <p className="text-slate-300 whitespace-pre-wrap break-words line-clamp-4">
                      {report.remediation}
                    </p>
                  </div>
                </div>

                {/* Triage feedback */}
                {report.feedback && report.feedback.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/70 space-y-1">
                    {report.feedback.map((line, idx) => (
                      <p key={idx} className="flex items-start space-x-1.5 text-[11px] text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-px" />
                        <span>{line}</span>
                      </p>
                    ))}
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
