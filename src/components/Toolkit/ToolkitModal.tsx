import React, { useState, useEffect } from 'react';
import { X, Wrench, KeyRound, Terminal, FileText, CheckCircle2 } from 'lucide-react';
import { EncoderDecoderLab } from './EncoderDecoderLab';
import { SqlAstVisualizerDemo } from '../InteractiveWidgets/SqlAstVisualizerDemo';
import { ReportStudioDemo } from '../InteractiveWidgets/ReportStudioDemo';

interface ToolkitModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: string;
}

export const ToolkitModal: React.FC<ToolkitModalProps> = ({ isOpen, onClose, defaultTab = 'decoder' }) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  // Follow the caller's requested tab whenever the modal opens
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-4xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-100 text-sm sm:text-base">
                Videre Intuition Lab &amp; Sandbox Toolkit
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Hands-on decoding, syntax inspection, and vulnerability reporting utilities.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 px-5 py-2 bg-slate-950/60 border-b border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('decoder')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-sans transition ${
              activeTab === 'decoder'
                ? 'bg-cyan-600 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Decoder &amp; JWT Lab</span>
          </button>

          <button
            onClick={() => setActiveTab('sqli')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-sans transition ${
              activeTab === 'sqli'
                ? 'bg-cyan-600 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>SQL &amp; Syntax Visualizer</span>
          </button>

          <button
            onClick={() => setActiveTab('triage')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-sans transition ${
              activeTab === 'triage'
                ? 'bg-cyan-600 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Bug Bounty Report Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-sans transition ${
              activeTab === 'checklist'
                ? 'bg-cyan-600 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Habit &amp; Mindset Checklist</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-auto p-5">
          {activeTab === 'decoder' && <EncoderDecoderLab />}
          {activeTab === 'sqli' && <SqlAstVisualizerDemo />}
          {activeTab === 'triage' && <ReportStudioDemo />}
          {activeTab === 'checklist' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <h4 className="font-bold text-slate-100 text-sm mb-1">
                  The Systems Thinker Self-Check: Are You Falling into Tool Traps?
                </h4>
                <p className="text-slate-400 text-xs">
                  Compare your instinct when looking at a new target application:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-rose-950/20 border border-rose-800/50 rounded-xl space-y-2">
                  <span className="text-rose-400 font-bold text-xs uppercase font-mono block">
                    ❌ The Tool-Dependent Trap
                  </span>
                  <ul className="space-y-2 text-slate-300 text-xs">
                    <li>• Fires automated port and vuln scanners before clicking a single button.</li>
                    <li>• Sees a 403 Forbidden and immediately assumes the route is impregnable.</li>
                    <li>• Sees Base64 and tries brute-forcing an AES key.</li>
                    <li>• Relies on CTF hints or predetermined flags to feel confident.</li>
                  </ul>
                </div>

                <div className="p-4 bg-emerald-950/20 border border-emerald-800/50 rounded-xl space-y-2">
                  <span className="text-emerald-400 font-bold text-xs uppercase font-mono block">
                    ✓ The Videre Instinct (Systems Thinker)
                  </span>
                  <ul className="space-y-2 text-slate-300 text-xs">
                    <li>• Opens DevTools Network tab and observes what data travels over the wire.</li>
                    <li>• Notices numeric IDs (/invoice/1042) and tests authorization boundaries.</li>
                    <li>• Asks: "What is the client sending that the server should calculate itself?"</li>
                    <li>• Classifies business risk and writes reproducible triage reports.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
