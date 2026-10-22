import React, { useState } from 'react';
import { VIDERE_WIKI } from '../../data/wiki';
import { BookOpen, X, Sparkles, CheckCircle2, Quote, ArrowRight } from 'lucide-react';

interface WikiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WikiModal: React.FC<WikiModalProps> = ({ isOpen, onClose }) => {
  const [activeSectionId, setActiveSectionId] = useState<string>('problem');

  if (!isOpen) return null;

  const currentSection = VIDERE_WIKI.find(s => s.id === activeSectionId) || VIDERE_WIKI[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-4xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-100 text-sm sm:text-base flex items-center space-x-2">
                <span>Videre — Vision, Architecture &amp; Manifesto</span>
                <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">
                  v1.0 Docs
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                The philosophy, pedagogy, and onboarding guide for the cybersecurity society.
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

        {/* Layout: Sidebar + Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Navigation Sidebar */}
          <div className="w-full md:w-64 bg-slate-950/60 border-b md:border-b-0 md:border-r border-slate-800 p-3 space-y-1 overflow-x-auto md:overflow-y-auto">
            {VIDERE_WIKI.map(sec => (
              <button
                key={sec.id}
                onClick={() => setActiveSectionId(sec.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition flex items-center justify-between ${
                  activeSectionId === sec.id
                    ? 'bg-emerald-950/70 text-emerald-300 font-bold border border-emerald-800/80'
                    : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                }`}
              >
                <span>{sec.title}</span>
                {activeSectionId === sec.id && <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            ))}
          </div>

          {/* Section Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {currentSection.badge || 'Document'}
                </span>
              </div>
              <h2 className="font-display text-xl font-bold text-slate-100">{currentSection.title}</h2>
              <p className="text-sm text-slate-400 mt-1">{currentSection.subtitle}</p>
            </div>

            {/* Paragraphs */}
            <div className="space-y-3.5 text-slate-300 text-sm leading-relaxed">
              {currentSection.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Quotes */}
            {currentSection.quotes?.map((q, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-950 rounded-xl border-l-4 border-emerald-500 border border-slate-800/80 text-emerald-200 text-sm italic flex items-start space-x-3"
              >
                <Quote className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>"{q}"</span>
              </div>
            ))}

            {/* Key Takeaways */}
            {currentSection.keyTakeaways && (
              <div className="p-4 bg-slate-950/90 rounded-xl border border-slate-800 space-y-2.5">
                <h4 className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Key Principles</span>
                </h4>
                <ul className="space-y-2">
                  {currentSection.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
