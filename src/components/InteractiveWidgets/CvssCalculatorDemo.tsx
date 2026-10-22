import React, { useState } from 'react';
import { Shield, AlertCircle, Sparkles, RefreshCw, Layers } from 'lucide-react';

export const CvssCalculatorDemo: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [attackVector, setAttackVector] = useState<'Network' | 'Local'>('Network');
  const [privilegesRequired, setPrivilegesRequired] = useState<'None' | 'Low' | 'High'>('None');
  const [userInteraction, setUserInteraction] = useState<'None' | 'Required'>('None');
  const [confidentiality, setConfidentiality] = useState<'High' | 'Low' | 'None'>('High');
  const [integrity, setIntegrity] = useState<'High' | 'Low' | 'None'>('High');

  // Simple heuristic calculation of CVSS score
  let baseScore = 0;
  if (attackVector === 'Network') baseScore += 3.8;
  else baseScore += 2.0;

  if (privilegesRequired === 'None') baseScore += 2.8;
  else if (privilegesRequired === 'Low') baseScore += 1.5;
  else baseScore += 0.5;

  if (userInteraction === 'None') baseScore += 1.4;
  else baseScore += 0.6;

  if (confidentiality === 'High') baseScore += 1.2;
  else if (confidentiality === 'Low') baseScore += 0.5;

  if (integrity === 'High') baseScore += 0.8;
  else if (integrity === 'Low') baseScore += 0.4;

  const score = Math.min(10.0, Math.max(0.1, parseFloat(baseScore.toFixed(1))));

  let severity = 'Low';
  let tier = 'P4';
  let color = 'text-cyan-400 border-cyan-800 bg-cyan-950/40';

  if (score >= 9.0) {
    severity = 'Critical';
    tier = 'P1';
    color = 'text-rose-400 border-rose-800 bg-rose-950/40';
  } else if (score >= 7.0) {
    severity = 'High';
    tier = 'P2';
    color = 'text-amber-400 border-amber-800 bg-amber-950/40';
  } else if (score >= 4.0) {
    severity = 'Medium';
    tier = 'P3';
    color = 'text-yellow-400 border-yellow-800 bg-yellow-950/40';
  }

  const applyPreset = (presetName: string) => {
    if (presetName === 'mass_idor') {
      setAttackVector('Network');
      setPrivilegesRequired('None');
      setUserInteraction('None');
      setConfidentiality('High');
      setIntegrity('High');
      if (onComplete) onComplete();
    } else if (presetName === 'self_xss') {
      setAttackVector('Network');
      setPrivilegesRequired('Low');
      setUserInteraction('Required');
      setConfidentiality('Low');
      setIntegrity('Low');
    } else if (presetName === 'open_redirect') {
      setAttackVector('Network');
      setPrivilegesRequired('None');
      setUserInteraction('Required');
      setConfidentiality('None');
      setIntegrity('Low');
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 my-4 shadow-xl font-mono text-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100 font-sans">
              Interactive Lab: Severity & Risk Scoring Matrix (CVSS v3.1)
            </h4>
            <p className="text-[11px] text-slate-400 font-sans">
              See how ease of exploitation and real-world business damage determine whether a bug is P1 (Critical) or P4 (Low).
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => applyPreset('mass_idor')}
            className="px-2 py-1 bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded text-[11px] font-sans font-bold transition"
          >
            Scenario: Unauthenticated Mass IDOR
          </button>
          <button
            onClick={() => applyPreset('open_redirect')}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-sans transition"
          >
            Scenario: Open Redirect
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric Controls */}
        <div className="md:col-span-2 space-y-3 font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Attack Vector */}
            <div className="p-2.5 bg-slate-950 rounded border border-slate-800 space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 font-mono">
                Attack Vector (AV)
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setAttackVector('Network')}
                  className={`flex-1 py-1 rounded text-xs transition ${attackVector === 'Network' ? 'bg-purple-900 text-purple-200 font-bold' : 'bg-slate-900 text-slate-400'}`}
                >
                  Network (Internet)
                </button>
                <button
                  onClick={() => setAttackVector('Local')}
                  className={`flex-1 py-1 rounded text-xs transition ${attackVector === 'Local' ? 'bg-purple-900 text-purple-200 font-bold' : 'bg-slate-900 text-slate-400'}`}
                >
                  Local (Physical)
                </button>
              </div>
            </div>

            {/* Privileges Required */}
            <div className="p-2.5 bg-slate-950 rounded border border-slate-800 space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 font-mono">
                Privileges Required (PR)
              </label>
              <div className="flex gap-1.5">
                {(['None', 'Low', 'High'] as const).map(pr => (
                  <button
                    key={pr}
                    onClick={() => setPrivilegesRequired(pr)}
                    className={`flex-1 py-1 rounded text-xs transition ${privilegesRequired === pr ? 'bg-purple-900 text-purple-200 font-bold' : 'bg-slate-900 text-slate-400'}`}
                  >
                    {pr}
                  </button>
                ))}
              </div>
            </div>

            {/* User Interaction */}
            <div className="p-2.5 bg-slate-950 rounded border border-slate-800 space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 font-mono">
                User Interaction (UI)
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setUserInteraction('None')}
                  className={`flex-1 py-1 rounded text-xs transition ${userInteraction === 'None' ? 'bg-purple-900 text-purple-200 font-bold' : 'bg-slate-900 text-slate-400'}`}
                >
                  None (Zero-Click)
                </button>
                <button
                  onClick={() => setUserInteraction('Required')}
                  className={`flex-1 py-1 rounded text-xs transition ${userInteraction === 'Required' ? 'bg-purple-900 text-purple-200 font-bold' : 'bg-slate-900 text-slate-400'}`}
                >
                  Victim Must Click
                </button>
              </div>
            </div>

            {/* Confidentiality Impact */}
            <div className="p-2.5 bg-slate-950 rounded border border-slate-800 space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 font-mono">
                Confidentiality Impact (Data Leak)
              </label>
              <div className="flex gap-1.5">
                {(['High', 'Low', 'None'] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => setConfidentiality(c)}
                    className={`flex-1 py-1 rounded text-xs transition ${confidentiality === c ? 'bg-purple-900 text-purple-200 font-bold' : 'bg-slate-900 text-slate-400'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Integrity Impact */}
            <div className="p-2.5 bg-slate-950 rounded border border-slate-800 space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 font-mono">
                Integrity Impact (Tampering)
              </label>
              <div className="flex gap-1.5">
                {(['High', 'Low', 'None'] as const).map(i => (
                  <button
                    key={i}
                    onClick={() => setIntegrity(i)}
                    className={`flex-1 py-1 rounded text-xs transition ${integrity === i ? 'bg-purple-900 text-purple-200 font-bold' : 'bg-slate-900 text-slate-400'}`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Calculated Score Card */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between font-sans">
          <div className="text-center space-y-2">
            <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider font-mono">
              Calculated CVSS Rating
            </span>
            <div className="text-4xl font-black font-mono text-slate-100">
              {score}
            </div>

            <div className={`p-2 rounded border font-bold text-xs uppercase tracking-wider ${color}`}>
              {tier} — {severity}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            {severity === 'Critical' && (
              <p className="text-rose-300">
                <strong>Critical Priority:</strong> Threat actors can exploit this remotely with zero account access and exfiltrate entire databases. Typical bug bounty: $3,000 - $15,000+.
              </p>
            )}
            {severity === 'High' && (
              <p className="text-amber-300">
                <strong>High Priority:</strong> Severe compromise of individual accounts or unauthorized data modification.
              </p>
            )}
            {severity === 'Medium' && (
              <p className="text-yellow-300">
                <strong>Medium Priority:</strong> Flaws that require significant victim interaction or only leak minor non-sensitive state.
              </p>
            )}
            {severity === 'Low' && (
              <p className="text-cyan-300">
                <strong>Low Priority:</strong> Hard to exploit or negligible direct financial/compliance impact.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
