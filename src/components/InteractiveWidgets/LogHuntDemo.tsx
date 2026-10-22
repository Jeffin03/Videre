import React, { useRef, useState } from 'react';
import { Radar, Search, Lightbulb, Sparkles, CheckCircle2, RefreshCw, Filter } from 'lucide-react';

type IndicatorKind = 'process' | 'dns' | 'login';

interface LogRow {
  id: number;
  time: string;
  source: string;
  detail: string;
  indicator?: IndicatorKind;
}

const LOG_ROWS: LogRow[] = [
  { id: 1, time: '01:58:02', source: 'WinSec 4624', detail: 'Logon Type 5 — SYSTEM service logon on APP-07 (nightly job)' },
  { id: 2, time: '02:03:11', source: 'WinSec 4624', detail: 'Logon Type 3 — svc_sql from 10.14.4.12 (scheduled ETL job)' },
  { id: 3, time: '02:05:47', source: 'DNS', detail: 'A app.vendor-cdn.com -> 104.18.32.7 (TTL 300)' },
  { id: 4, time: '02:09:33', source: 'Sysmon 1', detail: 'Parent C:\\Windows\\System32\\svchost.exe -> Child taskhostw.exe (scheduled task host)' },
  { id: 5, time: '02:12:56', source: 'WinSec 4625', detail: 'Logon Type 3 — svc_sql from 10.14.4.12 bad password (attempt 1 of 3)' },
  { id: 6, time: '02:14:08', source: 'PowerShell 4104', detail: 'Script block: Rotate-BackupKey -Path \\\\fs01\\keys (approved GPO task)' },
  { id: 7, time: '02:17:22', source: 'DNS', detail: 'A updates.microsoft.com -> 13.107.4.52' },
  { id: 8, time: '02:19:58', source: 'WinSec 4625', detail: 'Logon Type 3 — svc_sql from 10.14.4.12 bad password (attempt 2 of 3)' },
  { id: 9, time: '02:22:41', source: 'Flow', detail: '10.14.9.31:51412 -> 20.42.73.11:443 1.2 MB out (Office update download)' },
  { id: 10, time: '02:25:19', source: 'Sysmon 1', detail: 'Parent C:\\Windows\\explorer.exe -> Child notepad.exe (helpdesk session)' },
  { id: 11, time: '02:28:04', source: 'WinSec 4624', detail: 'Logon Type 7 — console logon, KIOSK-07 lobby shift start' },
  { id: 12, time: '02:31:37', source: 'DNS', detail: 'A telemetry.vendor-cdn.com -> 104.18.33.19 (known updater domain)' },
  { id: 13, time: '02:34:50', source: 'WinSec 4625', detail: 'Logon Type 3 — svc_sql bad password (attempt 3 of 3) — account locked out' },
  { id: 14, time: '02:36:15', source: 'Flow', detail: '10.14.2.31:50822 -> 40.126.32.12:443 84 KB out (backup replication)' },
  { id: 15, time: '02:39:44', source: 'Sysmon 1', detail: 'Parent C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -> Child conhost.exe (normal console spawn)' },
  { id: 16, time: '02:41:09', source: 'DNS', detail: 'A login.microsoftonline.com -> 20.190.160.14' },
  {
    id: 17,
    time: '02:42:03',
    source: 'Sysmon 1',
    detail: 'Parent C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE (opened invoice_0921.docm) -> Child powershell.exe -nop -w hidden -enc SQBFAFgA...',
    indicator: 'process'
  },
  { id: 18, time: '02:43:26', source: 'PowerShell 4104', detail: 'Script block: Set-ItemProperty HKLM:\\Software\\Backup\\Mode "Off" (approved GPO task)' },
  {
    id: 19,
    time: '02:44:10',
    source: 'DNS',
    detail: 'A xk4n-metricsync.top -> 45.129.98.7 (first occurrence in 180 days of DNS history)',
    indicator: 'dns'
  },
  { id: 20, time: '02:45:33', source: 'WinSec 4624', detail: 'Logon Type 3 — svc_backup from 10.14.2.31 (nightly copy job)' },
  {
    id: 21,
    time: '02:47:11',
    source: 'WinSec 4624',
    detail: 'Logon Type 10 (RDP) — Administrator from 45.129.98.7, LogonId 0x8f21c (first external RDP in 60 days)',
    indicator: 'login'
  },
  { id: 22, time: '02:49:02', source: 'Flow', detail: '10.14.9.77:49711 -> 20.190.160.14:443 41 KB out (normal sync traffic)' }
];

const INDICATOR_LABEL: Record<IndicatorKind, string> = {
  process: 'Anomalous parent-child process',
  dns: 'First-seen domain (rare DNS query)',
  login: 'Off-hours privileged logon'
};

const TIMELINE = [
  { time: '02:42:03', phase: 'Execution', text: 'WINWORD.EXE spawns encoded powershell.exe — a document just became a shell (ATT&CK T1059.001).' },
  { time: '02:44:10', phase: 'Command & Control', text: 'The payload calls home to xk4n-metricsync.top, a domain with no history on this network.' },
  { time: '02:45:33', phase: 'Credential Access', text: 'Quiet window: cached credentials are the cheapest prize on a mailbox user’s machine.' },
  { time: '02:47:11', phase: 'Lateral Movement', text: 'RDP as Administrator from 45.129.98.7 — the same IP the rare domain resolved to, minutes earlier.' }
];

export const LogHuntDemo: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [query, setQuery] = useState('');
  const firedRef = useRef(false);

  const targetIds = LOG_ROWS.filter(r => r.indicator).map(r => r.id);
  const foundCount = targetIds.filter(id => selected.includes(id)).length;
  const isComplete = foundCount === targetIds.length;

  const toggleRow = (id: number) => {
    setSelected(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      const found = targetIds.filter(tid => next.includes(tid)).length;
      if (found === targetIds.length && !firedRef.current) {
        firedRef.current = true;
        if (onComplete) onComplete();
      }
      return next;
    });
  };

  const filteredRows = LOG_ROWS.filter(r => {
    if (!query.trim()) return true;
    const haystack = `${r.time} ${r.source} ${r.detail}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 my-4 shadow-xl font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Radar className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100 font-sans">
              Interactive Lab: Log Hunt — One Host, One Bad Night
            </h4>
            <p className="text-[11px] text-slate-400 font-sans">
              22 rows of telemetry from ENG-LAPTOP-221. Exactly three of them are evidence of a compromise. Find them by reading, not guessing.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 font-sans">
            <span className="text-[11px] text-slate-400">Indicators found:</span>
            <span className={`text-sm font-bold font-mono ${isComplete ? 'text-emerald-400' : 'text-amber-400'}`}>
              {foundCount} / {targetIds.length}
            </span>
          </div>
          <button
            onClick={() => setSelected([])}
            className="flex items-center space-x-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition font-sans"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-3 font-sans">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Filter rows (try: 4624, dns, powershell, rdp...)"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
          <Filter className="w-3.5 h-3.5" />
          <span>{filteredRows.length} of {LOG_ROWS.length} rows visible — click a row to flag it</span>
        </div>
      </div>

      {/* Hint line */}
      <div className="flex items-start space-x-2 p-2.5 mb-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-amber-300/90 font-sans">
        <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
        <span>
          Hint: look for <strong>a login that never happens at that hour</strong>, <strong>a process tree no baseline expects</strong>, and <strong>a domain older than your patience but new to these logs</strong>.
        </span>
      </div>

      {/* Log table */}
      <div className="bg-slate-950 rounded-lg border border-slate-800 p-2">
        <div className="grid grid-cols-12 gap-2 px-3 py-1.5 text-[10px] uppercase font-bold text-slate-500 select-none">
          <span className="col-span-2">Time</span>
          <span className="col-span-3">Log Source</span>
          <span className="col-span-7">Event Detail</span>
        </div>

        <div className="max-h-[340px] overflow-y-auto pr-1">
          {filteredRows.map(row => {
            const kind = row.indicator;
            const isSelected = selected.includes(row.id);
            const isTarget = !!kind;

            let rowClass = 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60';
            if (isSelected && !isComplete) rowClass = 'bg-amber-950/30 border-amber-500/60';
            if (isSelected && isComplete && isTarget) rowClass = 'bg-emerald-950/40 border-emerald-500/70';
            if (isSelected && isComplete && !isTarget) rowClass = 'bg-slate-900 border-slate-700';
            if (!isSelected && isComplete && isTarget) rowClass = 'bg-emerald-950/20 border-emerald-800/60';

            return (
              <button
                key={row.id}
                onClick={() => toggleRow(row.id)}
                className={`w-full text-left grid grid-cols-12 gap-2 items-start px-3 py-1.5 mb-1 border rounded-md transition ${rowClass}`}
              >
                <span className="col-span-2 flex items-center space-x-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-sm border shrink-0 ${
                      isSelected ? 'bg-amber-400 border-amber-300' : 'bg-slate-950 border-slate-700'
                    }`}
                  ></span>
                  <span className="text-cyan-300">{row.time}</span>
                </span>
                <span className="col-span-3 text-slate-400">{row.source}</span>
                <span className="col-span-7">
                  <span className="text-slate-300 break-all">{row.detail}</span>
                  {isComplete && kind && (
                    <span className="ml-2 inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-emerald-900/70 border border-emerald-700 text-emerald-200 text-[10px] font-bold uppercase">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Indicator: {INDICATOR_LABEL[kind]}</span>
                    </span>
                  )}
                </span>
              </button>
            );
          })}

          {filteredRows.length === 0 && (
            <p className="text-center text-slate-500 italic py-6">No rows match that filter. Clear it and keep reading.</p>
          )}
        </div>
      </div>

      {/* Completion state */}
      {isComplete && (
        <div className="mt-4 space-y-3">
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/60 rounded-lg text-emerald-200 text-xs font-sans flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>3/3 indicators found.</strong> Three rows, three phases of one intrusion — the rest was noise, and knowing that is the skill.</span>
            </div>
            <span className="text-[10px] bg-emerald-900 px-2 py-0.5 rounded text-emerald-200 font-bold uppercase font-mono shrink-0 ml-2">
              Hunt Complete
            </span>
          </div>

          <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 space-y-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              How the Attack Timeline Reads (Correlated By Time, Host, and IP)
            </span>
            {TIMELINE.map(step => (
              <div key={step.time} className="flex items-start space-x-3">
                <span className="text-cyan-300 shrink-0 w-16">{step.time}</span>
                <span className="text-amber-300 shrink-0 w-40 uppercase text-[10px] font-bold pt-0.5">{step.phase}</span>
                <span className="text-slate-300 font-sans text-[11px] leading-relaxed">{step.text}</span>
              </div>
            ))}
            <p className="text-[11px] text-slate-400 font-sans pt-2 border-t border-slate-800">
              <strong className="text-slate-200">The story:</strong> a phishing document woke up at 02:42, phoned a first-seen domain at 02:44, and turned into an interactive Administrator RDP session at 02:47 — from the very IP the domain resolved to. No single row proves this. The three rows <em>together</em> do.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
