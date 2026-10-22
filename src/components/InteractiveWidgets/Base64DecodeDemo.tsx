import React, { useState } from 'react';
import { ArrowRight, Lock, Unlock, Sparkles, AlertCircle, Copy, Check } from 'lucide-react';

export const Base64DecodeDemo: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const defaultEncoded = 'eyJ1c2VyIjoiZGV2X3RlYW0iLCJmbGFnIjoiaW50dWl0aW9uX292ZXJfdG9vbHMifQ==';
  const [inputVal, setInputVal] = useState(defaultEncoded);
  const [decodedVal, setDecodedVal] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [hasDecodedFirstTime, setHasDecodedFirstTime] = useState(false);

  const handleDecode = () => {
    setError(null);
    try {
      // Handle standard base64 and base64url
      let normalized = inputVal.trim().replace(/-/g, '+').replace(/_/g, '/');
      while (normalized.length % 4) {
        normalized += '=';
      }
      const decoded = atob(normalized);
      setDecodedVal(decoded);
      setHasDecodedFirstTime(true);
      if (onComplete) onComplete();
    } catch (e: any) {
      setError('Not a valid Base64 string! Notice: Base64 strings use [A-Za-z0-9+/] and usually end in "=" or "==".');
    }
  };

  const loadPreset = (val: string) => {
    setInputVal(val);
    setDecodedVal(null);
    setError(null);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 my-4 shadow-xl font-mono text-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {decodedVal ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100 font-sans">Interactive Discovery: The Base64 Illusion</h4>
            <p className="text-[11px] text-slate-400 font-sans">
              Watch "encrypted-looking gibberish" transform back into plaintext with zero secret keys.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => loadPreset(defaultEncoded)}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition"
          >
            Load Lesson Mystery Token
          </button>
          <button
            onClick={() => loadPreset('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjg5Miwicm9sZSI6ImFkbWluIn0')}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded text-[11px] transition hidden sm:inline-block"
          >
            Load JWT Token
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* Encoded Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-[11px]">
            <label className="font-semibold uppercase tracking-wider text-slate-400">
              Encoded String (Over the Wire)
            </label>
            <span className="text-[10px] text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/60">
              Notice the '==' at the end
            </span>
          </div>

          <textarea
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            rows={4}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500 break-all"
            placeholder="Paste any Base64 string..."
          />

          <button
            onClick={handleDecode}
            className="w-full py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-slate-950 font-bold rounded-lg transition flex items-center justify-center space-x-2 text-sm shadow-lg shadow-emerald-950/50"
          >
            <span>Decode Raw Bytes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Decoded Plaintext Output */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-[11px]">
            <label className="font-semibold uppercase tracking-wider text-slate-400">
              Decoded Plaintext (The Reality)
            </label>
            {decodedVal && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(decodedVal);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center space-x-1 text-slate-400 hover:text-slate-200 text-[11px]"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          <div
            className={`min-h-[105px] bg-slate-950 border rounded-lg p-3 transition flex flex-col justify-center ${
              decodedVal
                ? 'border-emerald-500/50 bg-emerald-950/20'
                : 'border-slate-800 text-slate-600'
            }`}
          >
            {error ? (
              <div className="flex items-start space-x-2 text-rose-400 text-[11px]">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            ) : decodedVal ? (
              <div>
                <pre className="text-emerald-300 whitespace-pre-wrap break-all text-xs font-mono font-medium">
                  {decodedVal}
                </pre>
                {decodedVal.includes('flag') && (
                  <div className="mt-2 pt-2 border-t border-emerald-800/40 text-[11px] text-emerald-400 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Secret flag extracted: <strong>intuition_over_tools</strong></span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center italic text-slate-500 text-[11px]">
                Click "Decode Raw Bytes" to uncover what is inside.
              </p>
            )}
          </div>

          {hasDecodedFirstTime && (
            <div className="p-2.5 bg-cyan-950/30 border border-cyan-800/50 rounded-lg text-cyan-200 text-[11px] font-sans flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong>The "Aha!" Moment:</strong> You didn't crack a cipher or break a password. Base64 is merely an alternate alphabet for data transportation!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
