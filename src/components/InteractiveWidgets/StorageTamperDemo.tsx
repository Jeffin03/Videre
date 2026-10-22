import React, { useState } from 'react';
import { Lock, Unlock, ShieldAlert, Sparkles, RefreshCw, Key } from 'lucide-react';

interface StorageTamperDemoProps {
  onComplete?: () => void;
}

export const StorageTamperDemo: React.FC<StorageTamperDemoProps> = ({ onComplete }) => {
  const [tier, setTier] = useState<'basic' | 'pro' | 'superadmin'>('basic');
  const [customValue, setCustomValue] = useState('basic');
  const [unlocked, setUnlocked] = useState(false);

  const applyTier = (newTier: string) => {
    setCustomValue(newTier);
    if (newTier === 'superadmin') {
      setTier('superadmin');
      setUnlocked(true);
      if (onComplete) onComplete();
    } else {
      setTier(newTier as any);
      setUnlocked(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 my-4 shadow-xl font-mono text-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className={`p-1.5 rounded-lg ${unlocked ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
            {unlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100 font-sans">
              Interactive Lab: LocalStorage Privilege Escalation
            </h4>
            <p className="text-[11px] text-slate-400 font-sans">
              Experience the flaw of client-side authorization: changing a key in browser storage.
            </p>
          </div>
        </div>

        <button
          onClick={() => applyTier('basic')}
          className="flex items-center space-x-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset to basic</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Simulated Browser Storage Inspector */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1">
              <Key className="w-3.5 h-3.5" />
              <span>Simulated LocalStorage Engine</span>
            </span>
            <span className="text-[10px] text-slate-500 font-sans">Window.localStorage</span>
          </div>

          <div className="p-2.5 bg-slate-900/70 border border-slate-800 rounded space-y-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Key: <strong className="text-slate-200">account_tier</strong></span>
              <span className="text-slate-500 text-[10px]">Type: string</span>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono text-xs focus:border-cyan-400 focus:outline-none"
                placeholder="Type 'superadmin'..."
              />
              <button
                onClick={() => applyTier(customValue)}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded text-xs transition"
              >
                Save
              </button>
            </div>

            <div className="flex items-center space-x-2 pt-1 text-[11px]">
              <span className="text-slate-500">Quick presets:</span>
              <button
                onClick={() => applyTier('basic')}
                className={`px-2 py-0.5 rounded text-[10px] border ${
                  customValue === 'basic' ? 'bg-slate-800 border-slate-600 text-slate-200' : 'border-slate-800 text-slate-400'
                }`}
              >
                basic
              </button>
              <button
                onClick={() => applyTier('pro')}
                className={`px-2 py-0.5 rounded text-[10px] border ${
                  customValue === 'pro' ? 'bg-slate-800 border-slate-600 text-slate-200' : 'border-slate-800 text-slate-400'
                }`}
              >
                pro
              </button>
              <button
                onClick={() => applyTier('superadmin')}
                className={`px-2 py-0.5 rounded text-[10px] border font-bold ${
                  customValue === 'superadmin' ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'border-slate-800 text-emerald-400 hover:bg-emerald-950/40'
                }`}
              >
                superadmin
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-sans leading-relaxed">
            <strong>What naive code looks like:</strong>
            <pre className="mt-1 p-2 bg-slate-900 rounded text-slate-300 text-[10px] overflow-x-auto">
{`const tier = localStorage.getItem('account_tier');
if (tier === 'superadmin') {
  renderExecutiveMetrics(); // ❌ Never verified on server!
}`}
            </pre>
          </div>
        </div>

        {/* Target Application View */}
        <div className={`p-4 rounded-lg border transition-all ${
          unlocked
            ? 'bg-gradient-to-b from-slate-900 to-emerald-950/30 border-emerald-500/50'
            : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] font-bold text-slate-200 font-sans">
              Target App: Pulse Financials
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-sans uppercase font-bold ${
              unlocked
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-850'
                : 'bg-amber-950 text-amber-400 border border-amber-800'
            }`}>
              {unlocked ? 'Unlocked: Superadmin' : 'Restricted: Basic'}
            </span>
          </div>

          {unlocked ? (
            <div className="space-y-3 font-sans">
              <div className="p-3 bg-emerald-950/50 border border-emerald-800/60 rounded-lg text-emerald-300 text-xs flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Access Granted:</strong> The application read your modified LocalStorage value and rendered the classified executive dashboard!
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Q3 Net Revenue</span>
                  <p className="text-emerald-400 font-mono font-bold text-base mt-1">$4,892,100</p>
                </div>
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-400 text-[10px]">Enterprise Churn</span>
                  <p className="text-cyan-400 font-mono font-bold text-base mt-1">0.42%</p>
                </div>
              </div>

              <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[11px] text-slate-400">
                <strong className="text-slate-200">Notice the Security Flaw:</strong> If the API server does not re-authenticate incoming requests via HTTP-only session tokens or cryptographically verified JWT signatures, any client-side check is cosmetic.
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-3 font-sans">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-amber-400">
                <Lock className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-300">Executive Revenue Analytics</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Only users with role <code className="text-amber-400 font-mono">superadmin</code> can access quarterly company metrics.
              </p>
              <div className="text-[11px] text-cyan-400 italic">
                Hint: Modify the account_tier key in LocalStorage on the left to "superadmin".
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
