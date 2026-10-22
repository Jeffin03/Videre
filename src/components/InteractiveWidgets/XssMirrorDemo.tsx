import React, { useState } from 'react';
import { Search, AlertTriangle, Sparkles, RefreshCw, Eye } from 'lucide-react';

export const XssMirrorDemo: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [searchTerm, setSearchTerm] = useState('Cybersecurity');
  const [simulatedAlert, setSimulatedAlert] = useState<string | null>(null);

  const containsScript = /<script.*>/i.test(searchTerm) || /onerror\s*=/i.test(searchTerm) || /onload\s*=/i.test(searchTerm);
  const containsHtml = /<[a-z][\s\S]*>/i.test(searchTerm);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (containsScript) {
      setSimulatedAlert('Simulated Browser Execution: alert(document.domain) -> "bookvault.com"');
      if (onComplete) onComplete();
    } else {
      setSimulatedAlert(null);
    }
  };

  const loadPayload = (payload: string) => {
    setSearchTerm(payload);
    if (payload.includes('onerror') || payload.includes('<script>')) {
      setSimulatedAlert('Simulated Browser Execution: alert(1)');
      if (onComplete) onComplete();
    } else {
      setSimulatedAlert(null);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 my-4 shadow-xl font-mono text-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100 font-sans">
              Interactive Lab: Reflective Input & HTML Context
            </h4>
            <p className="text-[11px] text-slate-400 font-sans">
              Observe how unescaped user input transitions from plain data into executable HTML/JS instructions.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setSearchTerm('Cybersecurity');
            setSimulatedAlert(null);
          }}
          className="flex items-center space-x-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-slate-100 text-xs font-mono focus:outline-none focus:border-amber-400"
              placeholder="Search library catalog..."
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition"
          >
            Reflect
          </button>
        </form>

        {/* Quick presets */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="text-slate-400 font-sans">Try payloads:</span>
          <button
            onClick={() => loadPayload('Cybersecurity')}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
          >
            Benign: Cybersecurity
          </button>
          <button
            onClick={() => loadPayload('<b>Bold Notice</b>')}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-cyan-300"
          >
            HTML: &lt;b&gt;Bold Notice&lt;/b&gt;
          </button>
          <button
            onClick={() => loadPayload('<img src="invalid" onerror="alert(1)" />')}
            className="px-2 py-0.5 bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-300 rounded font-bold"
          >
            Payload: &lt;img onerror=alert(1)&gt;
          </button>
        </div>

        {/* Browser Alert Simulation Banner */}
        {simulatedAlert && (
          <div className="p-3 bg-rose-950/40 border border-rose-500/60 rounded-lg text-rose-200 text-xs flex items-center justify-between animate-bounce">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                <strong>Script Execution Triggered!</strong> {simulatedAlert}
              </span>
            </div>
            <span className="text-[10px] bg-rose-900 px-2 py-0.5 rounded text-rose-100 font-bold uppercase">
              XSS Confirmed
            </span>
          </div>
        )}

        {/* Dual View: Rendered DOM vs Raw Source */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Rendered View */}
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-sans">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-2 font-mono">
              Rendered Browser Window
            </span>
            <div className="p-3 bg-slate-900 rounded border border-slate-800 text-xs">
              <p className="text-slate-400">
                Search results for:
              </p>
              {/* Safe rendering of benign tags for demo without endangering app */}
              <div className="text-base text-slate-100 mt-1 font-semibold">
                {containsScript ? (
                  <span className="text-amber-400 underline">[Injected Script / Image Element Executed]</span>
                ) : containsHtml ? (
                  <span dangerouslySetInnerHTML={{ __html: searchTerm }} />
                ) : (
                  <span>{searchTerm}</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-3 italic">
                Found 0 matching books in catalog.
              </p>
            </div>
          </div>

          {/* Under the Hood Raw HTML */}
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-2">
              What the Server Sent Into the HTML
            </span>
            <pre className="p-3 bg-slate-900 rounded border border-slate-800 text-[11px] text-slate-300 overflow-x-auto">
{`<div>
  <p>Search results for:</p>
  <span class="query-output">`}
<span className={containsScript ? 'text-rose-400 font-bold bg-rose-950/40 px-1' : containsHtml ? 'text-amber-300 font-bold' : 'text-emerald-400'}>
  {searchTerm}
</span>
{`</span>
</div>`}
            </pre>
            <div className="mt-2 text-[10px] text-slate-400 font-sans">
              {containsScript
                ? 'Because the server inserted raw brackets, the HTML parser stopped reading text and began executing DOM instructions.'
                : 'Safe behavior requires converting "<" into "&lt;" and ">" into "&gt;".'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
