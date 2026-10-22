import React, { useState } from 'react';
import { Filter, ArrowRight, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

export const SanitizationBypassDemo: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [inputVal, setInputVal] = useState('<scr<script>ipt>alert(1)</script>');
  const [filterMode, setFilterMode] = useState<'naive_blacklist' | 'contextual_encoding'>('naive_blacklist');

  // Naive single-pass blacklist: removes exact "<script>" once
  const naivePass = (str: string) => str.replace(/<script>/gi, '');

  // Contextual escaping
  const escapedPass = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');

  const currentResult = filterMode === 'naive_blacklist' ? naivePass(inputVal) : escapedPass(inputVal);
  const bypassSuccessful = filterMode === 'naive_blacklist' && /<script.*>/i.test(currentResult);

  const testPreset = (val: string) => {
    setInputVal(val);
    if (val.includes('<scr<script>ipt>') && filterMode === 'naive_blacklist' && onComplete) {
      onComplete();
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 my-4 shadow-xl font-mono text-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100 font-sans">
              Interactive Lab: Blacklist Sanitization Collapse
            </h4>
            <p className="text-[11px] text-slate-400 font-sans">
              See why single-pass string deletion fails against nested inputs like <code>&lt;scr&lt;script&gt;ipt&gt;</code>.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilterMode('naive_blacklist')}
            className={`px-2 py-1 rounded text-[11px] font-sans transition ${
              filterMode === 'naive_blacklist'
                ? 'bg-amber-950 text-amber-300 border border-amber-800 font-bold'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            Naive Blacklist (regex)
          </button>
          <button
            onClick={() => setFilterMode('contextual_encoding')}
            className={`px-2 py-1 rounded text-[11px] font-sans transition ${
              filterMode === 'contextual_encoding'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            Contextual Encoding
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-sans">
            User Input to Forum Filter
          </label>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              if (e.target.value.includes('<scr<script>ipt>') && onComplete) {
                onComplete();
              }
            }}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-xs font-mono focus:outline-none focus:border-amber-400"
            placeholder="Type payload..."
          />
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="text-slate-400 font-sans">Presets:</span>
          <button
            onClick={() => testPreset('<script>alert(1)</script>')}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
          >
            Basic: &lt;script&gt;
          </button>
          <button
            onClick={() => testPreset('<scr<script>ipt>alert(1)</script>')}
            className="px-2 py-0.5 bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-300 rounded font-bold"
          >
            Nested: &lt;scr&lt;script&gt;ipt&gt;
          </button>
          <button
            onClick={() => testPreset('<img src=x onerror=alert(1)>')}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-cyan-300"
          >
            No-Script Vector: &lt;img onerror&gt;
          </button>
        </div>

        {/* Step-by-step Transformation Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Filter Operation
            </span>
            {filterMode === 'naive_blacklist' ? (
              <div className="font-sans text-xs text-slate-300 space-y-1">
                <code className="text-amber-400 font-mono text-[11px] block bg-slate-900 p-1.5 rounded">
                  str.replace(/&lt;script&gt;/gi, '')
                </code>
                <p className="text-slate-400 text-[11px]">
                  Scans string once from left to right. Finds first <code>&lt;script&gt;</code> and deletes it. Does NOT re-scan the resulting output!
                </p>
              </div>
            ) : (
              <div className="font-sans text-xs text-slate-300 space-y-1">
                <code className="text-emerald-400 font-mono text-[11px] block bg-slate-900 p-1.5 rounded">
                  encodeHtmlEntities(str)
                </code>
                <p className="text-slate-400 text-[11px]">
                  Replaces every <code>&lt;</code> with <code>&amp;lt;</code>. The character becomes harmless visual ink.
                </p>
              </div>
            )}
          </div>

          <div className={`p-4 rounded-lg border ${
            bypassSuccessful
              ? 'bg-rose-950/20 border-rose-500/60'
              : 'bg-slate-950 border-slate-800'
          }`}>
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
              Final Output Sent to Web Page
            </span>
            <pre className={`p-2.5 rounded font-mono text-xs whitespace-pre-wrap break-all ${
              bypassSuccessful
                ? 'bg-rose-950/50 text-rose-300 border border-rose-800 font-bold'
                : 'bg-slate-900 text-emerald-300'
            }`}>
              {currentResult || '(Empty String)'}
            </pre>
            <div className="mt-2 text-[11px]">
              {bypassSuccessful ? (
                <span className="text-rose-400 font-sans font-semibold">
                  ⚠️ Bypass Succeeded! The outer halves collapsed into a valid &lt;script&gt; tag after the middle was removed!
                </span>
              ) : filterMode === 'contextual_encoding' ? (
                <span className="text-emerald-400 font-sans font-semibold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Safely rendered as text. Browser cannot execute encoded characters.</span>
                </span>
              ) : (
                <span className="text-slate-500 font-sans">
                  The word was stripped, but alternate vectors or nested tags can easily slip through.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
