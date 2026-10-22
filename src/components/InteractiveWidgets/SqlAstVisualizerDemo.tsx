import React, { useState } from 'react';
import { Database, Terminal, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

export const SqlAstVisualizerDemo: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [inputVal, setInputVal] = useState("admin' OR 1=1 --");

  const hasClosedQuote = inputVal.includes("'");
  const hasOrCondition = /or\s+1\s*=\s*1/i.test(inputVal) || /or\s+'1'\s*=\s*'1'/i.test(inputVal);
  const hasComment = inputVal.includes('--') || inputVal.includes('#');
  const isHijacked = hasClosedQuote && hasOrCondition;

  const loadPreset = (val: string) => {
    setInputVal(val);
    if ((val.includes("' OR 1=1") || val.includes("' or 1=1")) && onComplete) {
      onComplete();
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 my-4 shadow-xl font-mono text-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100 font-sans">
              Interactive Lab: SQL Syntax Tree & Boundary Escaping
            </h4>
            <p className="text-[11px] text-slate-400 font-sans">
              Understand why SQL injection happens without memorizing payloads: it is purely quotation boundary management.
            </p>
          </div>
        </div>

        <button
          onClick={() => loadPreset('alice@company.com')}
          className="flex items-center space-x-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Input</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* User Input Input */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-sans">
            User-Supplied Email Input Field
          </label>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              if (
                e.target.value.includes("'") &&
                /or\s+1\s*=\s*1/i.test(e.target.value) &&
                onComplete
              ) {
                onComplete();
              }
            }}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-xs font-mono focus:outline-none focus:border-amber-400"
            placeholder="Type username or ' OR 1=1 --"
          />
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="text-slate-400 font-sans">Presets:</span>
          <button
            onClick={() => loadPreset('alice@corp.io')}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
          >
            Normal Email
          </button>
          <button
            onClick={() => loadPreset("alice'")}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-rose-300"
          >
            Syntax Error Quote: alice'
          </button>
          <button
            onClick={() => loadPreset("admin' OR 1=1 --")}
            className="px-2 py-0.5 bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-300 rounded font-bold"
          >
            Bypass: admin' OR 1=1 --
          </button>
        </div>

        {/* The Live SQL String Renderer */}
        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">
            Constructed SQL String (Evaluated by Database Parser)
          </span>

          <div className="p-3 bg-slate-900 rounded font-mono text-sm leading-relaxed whitespace-pre-wrap break-all">
            <span className="text-purple-400 font-bold">SELECT</span> * <span className="text-purple-400 font-bold">FROM</span> users{' '}
            <span className="text-purple-400 font-bold">WHERE</span> email = '
            <span className="bg-amber-950/70 border-b-2 border-amber-500 text-amber-200 px-1 font-bold">
              {inputVal}
            </span>
            ' <span className="text-purple-400 font-bold">AND</span> password_hash = '5e884898da28'
          </div>
        </div>

        {/* Syntax Token Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans">
          <div className={`p-3 rounded-lg border ${hasClosedQuote ? 'bg-amber-950/30 border-amber-700/60' : 'bg-slate-950 border-slate-800'}`}>
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
              1. String Boundary
            </span>
            <div className="flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${hasClosedQuote ? 'bg-amber-400' : 'bg-slate-600'}`}></span>
              <span className={`text-xs font-semibold ${hasClosedQuote ? 'text-amber-300' : 'text-slate-400'}`}>
                {hasClosedQuote ? "Quote Escaped (Syntax Closed)" : "Inside String Literal"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {hasClosedQuote
                ? "The single quote (') closed the text boundary. Any subsequent characters are now read as SQL commands."
                : "Input is safely trapped inside single quotes as plain string text."}
            </p>
          </div>

          <div className={`p-3 rounded-lg border ${hasOrCondition ? 'bg-rose-950/30 border-rose-700/60' : 'bg-slate-950 border-slate-800'}`}>
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
              2. Logic Tautology
            </span>
            <div className="flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${hasOrCondition ? 'bg-rose-400' : 'bg-slate-600'}`}></span>
              <span className={`text-xs font-semibold ${hasOrCondition ? 'text-rose-300' : 'text-slate-400'}`}>
                {hasOrCondition ? "OR 1=1 (Always TRUE)" : "Normal Equality Check"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {hasOrCondition
                ? "Forces the WHERE clause to evaluate to TRUE for every single row in the users table."
                : "Evaluates exact match against specified email address."}
            </p>
          </div>

          <div className={`p-3 rounded-lg border ${hasComment ? 'bg-cyan-950/30 border-cyan-700/60' : 'bg-slate-950 border-slate-800'}`}>
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
              3. Trailing Syntax Truncation
            </span>
            <div className="flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${hasComment ? 'bg-cyan-400' : 'bg-slate-600'}`}></span>
              <span className={`text-xs font-semibold ${hasComment ? 'text-cyan-300' : 'text-slate-400'}`}>
                {hasComment ? "-- Comment Disables Password" : "Password Check Intact"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {hasComment
                ? "The double-hyphen (--) comments out the remainder of the query, so password verification is never executed."
                : "The password hash is still verified by the database query."}
            </p>
          </div>
        </div>

        {/* Hijack outcome banner */}
        {isHijacked && (
          <div className="p-3 bg-emerald-950/50 border border-emerald-500/60 rounded-lg text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2 font-sans">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>
                <strong>Authentication Bypassed!</strong> Database returns the first row in the table (usually the superadmin) with no password required.
              </span>
            </div>
            <span className="text-[10px] bg-emerald-900 px-2 py-0.5 rounded text-emerald-200 font-bold uppercase font-mono">
              AUTH_SUCCESS
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
