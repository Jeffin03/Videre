import React, { useRef, useState } from 'react';
import { Zap, Wallet, Activity, CheckCircle2, XCircle, RotateCcw, Sparkles, AlertTriangle, Server, Timer } from 'lucide-react';

/* ── RaceConditionLab ──────────────────────────────────────────────────────
   "The Hunter's Craft" lesson 7.6 lab.
   A fully client-side simulation of a gift-card redemption endpoint with a
   check-then-act gap. The learner fires a burst of N parallel requests and
   watches the read/write timeline. Small bursts lose the race (the check
   sees fresh state); N >= 4 wins it, the wallet goes negative, and the lab
   flags "DOUBLE-SPEND ACHIEVED". onComplete fires exactly once (ref-guarded).

   Deterministic timing model (no randomness, reproducible every run):
   - each request gets a network scheduling offset: (i * 61) % 151 ms
   - the server CHECKs balance on arrival, then spends ~60ms on audit
     logging before it ACTs (writes) — that's the race window
   - a request passes only if no deduction has committed by its read time,
     i.e. read < firstWrite (= firstRead + 60ms)
   offsets in play (ms): req1=0, req2=61, req3=122, req4=32, req5=93,
   req6=3, ...  => applied = 1,1,1,2,2,3,3,3,4,...  => threshold N=4.
   ──────────────────────────────────────────────────────────────────────── */

const WALLET_START = 80;   // credits — enough for exactly ONE license
const LICENSE_COST = 80;   // credits per redemption
const GAP_MS = 60;         // check-then-act window
const TIMELINE_MS = 160;   // visible span of the timeline

interface RaceRow {
  id: number;          // dispatch order, 1-based
  read: number;        // ms when the server CHECK ran
  write: number | null; // ms when the deduction committed (null if rejected)
  applied: boolean;
}

const offsetFor = (i: number): number => (i * 61) % 151;

const simulate = (burst: number): RaceRow[] => {
  const rows: RaceRow[] = [];
  for (let i = 0; i < burst; i++) {
    rows.push({ id: i + 1, read: offsetFor(i), write: null, applied: false });
  }
  const ordered = [...rows].sort((a, b) => a.read - b.read);
  let firstWriteAt = Number.POSITIVE_INFINITY;
  for (const row of ordered) {
    // CHECK passes only while no earlier deduction has committed yet.
    if (row.read < firstWriteAt) {
      row.applied = true;
      row.write = row.read + GAP_MS;
      firstWriteAt = Math.min(firstWriteAt, row.write);
    }
  }
  return ordered;
};

export const RaceConditionLab: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [burst, setBurst] = useState(1);
  const [rows, setRows] = useState<RaceRow[] | null>(null);
  const [racesWon, setRacesWon] = useState(0);
  const completedRef = useRef(false);

  const completeOnce = () => {
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
  };

  const fire = () => {
    const result = simulate(burst);
    setRows(result);
    const applied = result.filter(r => r.applied).length;
    if (applied >= 2) {
      setRacesWon(n => n + 1);
      completeOnce();
    }
  };

  const reset = () => {
    setRows(null);
    setRacesWon(0);
  };

  const appliedCount = rows ? rows.filter(r => r.applied).length : 0;
  const rejectedCount = rows ? rows.length - appliedCount : 0;
  const balanceAfter = WALLET_START - LICENSE_COST * appliedCount;
  const raceWon = appliedCount >= 2;
  const firstRejected = rows ? rows.find(r => !r.applied) : undefined;
  const firstCommitPct = (GAP_MS / TIMELINE_MS) * 100;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 my-4 shadow-xl font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100">
              Interactive Lab: The Race Condition — Double-Spend Window
            </h4>
            <p className="text-[11px] text-slate-400">
              <code className="font-mono text-cyan-300">POST /api/giftcards/redeem</code> — gift card holds 80 credits, each
              license costs 80. Serial requests lose. A big enough burst beats the check.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400">Races won:</span>
            <span className="text-sm font-bold font-mono text-purple-400">{racesWon}</span>
          </div>
          <button
            onClick={reset}
            className="flex items-center space-x-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Controls + server code */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 space-y-3 text-xs">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block">
              Burst Dispatcher
            </span>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">Parallel requests</span>
              <span className="font-mono font-bold text-lg text-cyan-300">{burst}</span>
            </div>

            <input
              type="range"
              min={1}
              max={20}
              value={burst}
              onChange={e => setBurst(parseInt(e.target.value, 10) || 1)}
              className="w-full accent-cyan-400"
            />

            <div className="flex flex-wrap gap-1.5">
              {[
                { n: 1, label: '1 (serial)' },
                { n: 2, label: '2' },
                { n: 4, label: '4' },
                { n: 8, label: '8' },
                { n: 16, label: '16' }
              ].map(p => (
                <button
                  key={p.n}
                  onClick={() => setBurst(p.n)}
                  className={`px-2 py-1 rounded text-[11px] font-mono transition ${
                    burst === p.n
                      ? 'bg-purple-900 text-purple-200 font-bold border border-purple-700'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <button
              onClick={fire}
              className="w-full py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-slate-950 font-bold rounded-lg transition flex items-center justify-center space-x-2 text-sm shadow-lg shadow-purple-950/50"
            >
              <Zap className="w-4 h-4" />
              <span>Fire {burst} Parallel Request{burst === 1 ? '' : 's'}</span>
            </button>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Each request gets realistic network jitter (0–150 ms scheduling offset). The server CHECKs the balance on
              arrival, then spends <strong className="text-slate-300">60 ms</strong> on audit logging before it writes —
              that gap is the race window.
            </p>
          </div>

          <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 text-xs space-y-2">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-500 flex items-center space-x-1">
              <Server className="w-3.5 h-3.5" />
              <span>The Vulnerable Handler</span>
            </span>
            <pre className="p-2.5 bg-slate-900 border border-slate-800 rounded text-[11px] font-mono text-rose-300 overflow-x-auto leading-relaxed">
{`const wallet = await db.wallet.get(me);      // CHECK
if (wallet.balance < COST) return 409;       // decide on what
                                            // you JUST read
await audit.log('redeem', { user: me });     // ~60ms gap
wallet.balance -= COST;                     // ACT (stale!)
await db.wallet.set(wallet);`}
            </pre>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Two requests can both hold "balance = 80" in their hands at the same time. Both deduct. The ledger goes
              negative — classic <strong className="text-slate-200">TOCTOU</strong> (time-of-check to time-of-use).
            </p>
          </div>
        </div>

        {/* Timeline + ledger */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-500 flex items-center space-x-1">
                <Activity className="w-3.5 h-3.5" />
                <span>Request Timeline (0–160 ms)</span>
              </span>
              <span className="flex items-center space-x-2 text-[10px] font-mono">
                <span className="flex items-center space-x-1 text-cyan-300"><span className="w-2 h-2 rounded-full bg-cyan-400" />check</span>
                <span className="flex items-center space-x-1 text-emerald-300"><span className="w-2 h-2 rounded-full bg-emerald-400" />write</span>
                <span className="flex items-center space-x-1 text-rose-300"><span className="w-2 h-2 rounded-full bg-rose-400" />409</span>
              </span>
            </div>

            {!rows ? (
              <div className="py-10 text-center text-slate-500 text-xs italic">
                Configure a burst size and hit "Fire". Start with 1 request to see why serial traffic can never win.
              </div>
            ) : (
              <div className="space-y-1.5">
                {/* the commit marker */}
                <div className="relative h-3">
                  <div
                    className="absolute top-0 bottom-0 border-l border-dashed border-amber-500/70"
                    style={{ left: `${firstCommitPct}%` }}
                  />
                  <span className="absolute -top-0.5 text-[9px] font-mono text-amber-400" style={{ left: `${firstCommitPct + 1}%` }}>
                    first write commits (t=60ms)
                  </span>
                </div>

                {rows.map(row => {
                  const readPct = (row.read / TIMELINE_MS) * 100;
                  const writePct = row.write !== null ? (row.write / TIMELINE_MS) * 100 : null;
                  const widthPct = writePct !== null ? Math.max(writePct - readPct, 1) : 0;

                  return (
                    <div key={row.id} className="flex items-center space-x-2 text-[10px] font-mono">
                      <span className="w-12 shrink-0 text-slate-500">req-{String(row.id).padStart(2, '0')}</span>
                      <span className="w-8 shrink-0 text-slate-500 text-right">{row.read}ms</span>
                      <div className="relative flex-1 h-4 bg-slate-900 rounded border border-slate-800 overflow-hidden">
                        <div
                          className="absolute top-0 bottom-0 border-l border-dashed border-amber-500/40"
                          style={{ left: `${firstCommitPct}%` }}
                        />
                        {row.applied && writePct !== null && (
                          <div
                            className="absolute top-1/2 -translate-y-1/2 h-1 bg-emerald-500/50 rounded"
                            style={{ left: `${readPct}%`, width: `${widthPct}%` }}
                          />
                        )}
                        <div
                          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full ${
                            row.applied ? 'bg-cyan-400' : 'bg-rose-400'
                          }`}
                          style={{ left: `${readPct}%` }}
                          title={`CHECK ran at ${row.read}ms`}
                        />
                        {writePct !== null && (
                          <div
                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-emerald-400"
                            style={{ left: `${writePct}%` }}
                            title={`deduction committed at ${row.write}ms`}
                          />
                        )}
                      </div>
                      <span className={`w-20 shrink-0 text-right font-bold ${row.applied ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {row.applied ? '200 OK' : '409 Conflict'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Ledger */}
          {rows && (
            <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 space-y-3">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-500 flex items-center space-x-1">
                <Wallet className="w-3.5 h-3.5" />
                <span>Gift-Card Ledger After the Burst</span>
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-500 block">Wallet Before</span>
                  <span className="font-mono font-bold text-slate-200">{WALLET_START}.00</span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-500 block">Wallet After</span>
                  <span className={`font-mono font-bold text-lg ${balanceAfter < 0 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {balanceAfter}
                  </span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-500 block">Licenses Granted</span>
                  <span className="font-mono font-bold text-emerald-400">{appliedCount}</span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-500 block">Rejected (409)</span>
                  <span className="font-mono font-bold text-rose-400">{rejectedCount}</span>
                </div>
              </div>

              {raceWon ? (
                <div className="p-3 bg-purple-950/40 border border-purple-600/60 rounded-lg text-purple-200 text-xs flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-300 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-purple-100">DOUBLE-SPEND ACHIEVED.</strong> {appliedCount} redemptions were accepted
                    from a wallet that could only ever afford one — balance{' '}
                    <code className="font-mono text-rose-300">{WALLET_START} → {balanceAfter}</code>. Every winning request
                    CHECKed before the first write committed and acted on the same stale "80 credits left" snapshot. In a
                    real program this is straight money loss.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 text-xs flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p>
                    {burst === 1 ? (
                      <>
                        <strong className="text-slate-100">No race exists here.</strong> One request checks, acts, and
                        finishes before anything else arrives — the wallet goes 80 → 0 exactly as designed. A race needs at
                        least two requests <em>in flight during the same window</em>. Raise the burst.
                      </>
                    ) : (
                      <>
                        <strong className="text-slate-100">Burst too small.</strong> Request #{firstRejected?.id} ran its CHECK
                        at {firstRejected?.read}ms — after the first deduction committed at {GAP_MS}ms. It read balance 0 and
                        got a polite 409. Only requests whose CHECK lands inside the {GAP_MS}ms gap can race it. Push the
                        slider higher.
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer takeaway */}
      <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
        <strong className="text-slate-300">The Takeaway:</strong> Any endpoint that checks a balance, limit, quota, or
        "one-per-user" flag before acting deserves a burst test. Engineers close the gap with a database transaction and a
        row lock, an atomic conditional write (<code className="font-mono text-cyan-300">UPDATE ... WHERE balance &gt;= 80</code>),
        or idempotency keys — never with a read followed by a hopeful write.
      </div>
    </div>
  );
};
