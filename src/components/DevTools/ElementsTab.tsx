import React, { useState } from 'react';
import { Search, Edit3, Eye, AlertCircle, Copy, Check } from 'lucide-react';

interface ElementsTabProps {
  htmlSource: string;
  onDomTamper?: (attribute: string, value: string) => void;
}

export const ElementsTab: React.FC<ElementsTabProps> = ({ htmlSource, onDomTamper }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [tamperAttr, setTamperAttr] = useState('value');
  const [tamperVal, setTamperVal] = useState('1.00');

  const lines = htmlSource.split('\n');

  const copySource = () => {
    navigator.clipboard.writeText(htmlSource);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyTamper = () => {
    if (onDomTamper) {
      onDomTamper(tamperAttr, tamperVal);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Left side: DOM Tree */}
      <div className="flex-1 flex flex-col border-r border-slate-800 p-2 overflow-auto">
        {/* Search Bar */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-500" />
            <input
              type="text"
              placeholder="Find by string, tag, attribute (e.g. TODO, hidden)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded pl-7 pr-2 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            onClick={copySource}
            className="flex items-center space-x-1 px-2 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 ml-2"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy HTML'}</span>
          </button>
        </div>

        {/* DOM Lines */}
        <div className="flex-1 font-mono text-[11.5px] leading-relaxed select-text space-y-0.5">
          {lines.map((line, idx) => {
            const isComment = line.trim().startsWith('<!--');
            const isHiddenInput = line.includes('type="hidden"') || line.includes("type='hidden'");
            const isDisabled = line.includes('disabled');
            const matchesSearch = searchQuery && line.toLowerCase().includes(searchQuery.toLowerCase());

            let highlightBg = '';
            if (matchesSearch) highlightBg = 'bg-yellow-500/20 border-l-2 border-yellow-400 pl-1';
            else if (isComment) highlightBg = 'bg-emerald-950/30 text-emerald-300 border-l-2 border-emerald-500/80 pl-1';
            else if (isHiddenInput) highlightBg = 'bg-purple-950/30 text-purple-200 border-l-2 border-purple-500/80 pl-1';
            else if (isDisabled) highlightBg = 'bg-amber-950/20 border-l-2 border-amber-500/60 pl-1';

            return (
              <div
                key={idx}
                onClick={() => setSelectedTag(line.trim())}
                className={`py-0.5 px-1 rounded hover:bg-slate-800/60 cursor-pointer flex items-start group ${highlightBg}`}
              >
                <span className="w-8 shrink-0 text-slate-600 select-none text-[10px] text-right pr-2">
                  {idx + 1}
                </span>
                <span className="break-all whitespace-pre-wrap">
                  {isComment ? (
                    <span className="text-emerald-400 font-semibold">{line}</span>
                  ) : isHiddenInput ? (
                    <span>
                      <span className="text-slate-400">{line.slice(0, line.indexOf('type="hidden"'))}</span>
                      <span className="bg-purple-900/60 text-purple-200 px-1 rounded font-bold">type="hidden"</span>
                      <span className="text-slate-400">{line.slice(line.indexOf('type="hidden"') + 13)}</span>
                    </span>
                  ) : (
                    <span className="text-slate-300">{line}</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right side: Inspector & DOM Tampering helper */}
      <div className="w-full md:w-72 bg-slate-900/60 p-3 flex flex-col justify-between text-xs border-t md:border-t-0 md:border-l border-slate-800">
        <div>
          <div className="flex items-center space-x-1.5 pb-2 mb-2 border-b border-slate-800 text-cyan-400 font-semibold">
            <Eye className="w-3.5 h-3.5" />
            <span>Inspector Assistant</span>
          </div>

          <div className="space-y-3">
            <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
              <span className="text-[10px] uppercase text-slate-500 block mb-1">Selected Element</span>
              <p className="text-slate-300 font-mono text-[11px] truncate">
                {selectedTag || 'Click any tag on the left to inspect'}
              </p>
            </div>

            <div className="p-2.5 bg-slate-950 rounded border border-slate-800 space-y-2">
              <div className="flex items-center space-x-1 text-slate-300 font-semibold">
                <Edit3 className="w-3 h-3 text-cyan-400" />
                <span>Live Attribute Tamper</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Simulate removing <code className="text-amber-300">disabled</code> or altering <code className="text-purple-300">unit_price</code>:
              </p>
              <div className="space-y-1.5">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase">Attribute</label>
                  <input
                    type="text"
                    value={tamperAttr}
                    onChange={(e) => setTamperAttr(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs"
                    placeholder="e.g. value, disabled"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 uppercase">New Value</label>
                  <input
                    type="text"
                    value={tamperVal}
                    onChange={(e) => setTamperVal(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs"
                    placeholder="e.g. 1.00, false"
                  />
                </div>
                <button
                  onClick={applyTamper}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold py-1 rounded transition text-xs mt-1"
                >
                  Inject Attribute Change
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 p-2 bg-slate-950/80 rounded border border-slate-800/80 text-[11px] text-slate-400">
          <div className="flex items-center space-x-1 text-amber-400 font-semibold mb-1">
            <AlertCircle className="w-3 h-3" />
            <span>Intuition Cue</span>
          </div>
          Developers sometimes disable buttons in HTML instead of checking permissions in the backend API.
        </div>
      </div>
    </div>
  );
};
