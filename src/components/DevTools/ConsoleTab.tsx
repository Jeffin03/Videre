import React, { useState } from 'react';
import { Terminal, CornerDownLeft, Trash2, HelpCircle } from 'lucide-react';

interface ConsoleTabProps {
  storageItems: { key: string; value: string; type: 'localStorage' | 'cookie' }[];
  targetUrl: string;
}

interface LogEntry {
  id: string;
  type: 'input' | 'output' | 'error' | 'info';
  content: string;
  timestamp: string;
}

export const ConsoleTab: React.FC<ConsoleTabProps> = ({ storageItems, targetUrl }) => {
  const [command, setCommand] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'init-1',
      type: 'info',
      content: `[Videre Client Sandbox] Ready. Scope attached to ${targetUrl}`,
      timestamp: '00:00:01'
    },
    {
      id: 'init-2',
      type: 'info',
      content: 'Tip: Try `localStorage`, `document.cookie`, `atob("string")`, or `help`',
      timestamp: '00:00:02'
    }
  ]);

  const executeCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const trimmed = command.trim();
    const now = new Date().toTimeString().split(' ')[0];

    const newLogs: LogEntry[] = [
      ...logs,
      { id: Math.random().toString(), type: 'input', content: trimmed, timestamp: now }
    ];

    try {
      if (trimmed === 'help') {
        newLogs.push({
          id: Math.random().toString(),
          type: 'output',
          content: `Available simulated commands:
• localStorage -> View all localStorage key-values
• localStorage.getItem('key') -> Retrieve specific key
• document.cookie -> View active cookies
• window.location -> Inspect origin, host, and path
• atob('encoded_string') -> Decode Base64 string
• btoa('plain_text') -> Encode to Base64
• clear -> Clear console output`,
          timestamp: now
        });
      } else if (trimmed === 'clear') {
        setLogs([]);
        setCommand('');
        return;
      } else if (trimmed === 'localStorage') {
        const local = storageItems.filter(i => i.type === 'localStorage');
        const obj = Object.fromEntries(local.map(i => [i.key, i.value]));
        newLogs.push({
          id: Math.random().toString(),
          type: 'output',
          content: `Storage {\n${JSON.stringify(obj, null, 2)}\n}`,
          timestamp: now
        });
      } else if (trimmed.startsWith('localStorage.getItem(')) {
        const match = trimmed.match(/localStorage\.getItem\(['"](.*)['"]\)/);
        if (match) {
          const key = match[1];
          const found = storageItems.find(i => i.key === key && i.type === 'localStorage');
          newLogs.push({
            id: Math.random().toString(),
            type: 'output',
            content: found ? `"${found.value}"` : 'null',
            timestamp: now
          });
        } else {
          newLogs.push({
            id: Math.random().toString(),
            type: 'error',
            content: 'SyntaxError: Invalid arguments to localStorage.getItem()',
            timestamp: now
          });
        }
      } else if (trimmed === 'document.cookie') {
        const cookies = storageItems.filter(i => i.type === 'cookie');
        newLogs.push({
          id: Math.random().toString(),
          type: 'output',
          content: cookies.map(c => `${c.key}=${c.value}`).join('; ') || '""',
          timestamp: now
        });
      } else if (trimmed.startsWith('atob(')) {
        const match = trimmed.match(/atob\(['"](.*)['"]\)/);
        if (match) {
          try {
            const decoded = atob(match[1]);
            newLogs.push({
              id: Math.random().toString(),
              type: 'output',
              content: `"${decoded}"`,
              timestamp: now
            });
          } catch (err) {
            newLogs.push({
              id: Math.random().toString(),
              type: 'error',
              content: 'DOMException: Failed to execute "atob": The string is not correctly encoded.',
              timestamp: now
            });
          }
        }
      } else if (trimmed.startsWith('btoa(')) {
        const match = trimmed.match(/btoa\(['"](.*)['"]\)/);
        if (match) {
          newLogs.push({
            id: Math.random().toString(),
            type: 'output',
            content: `"${btoa(match[1])}"`,
            timestamp: now
          });
        }
      } else if (trimmed === 'window.location') {
        newLogs.push({
          id: Math.random().toString(),
          type: 'output',
          content: `Location { href: "${targetUrl}", protocol: "https:", host: "${new URL(targetUrl).host}" }`,
          timestamp: now
        });
      } else {
        // Safe evaluation of simple math / expressions
        if (/^[0-9+\-*/% ()^.]+$/.test(trimmed)) {
          // eslint-disable-next-line no-eval
          const res = Function(`"use strict"; return (${trimmed})`)();
          newLogs.push({
            id: Math.random().toString(),
            type: 'output',
            content: String(res),
            timestamp: now
          });
        } else {
          newLogs.push({
            id: Math.random().toString(),
            type: 'error',
            content: `Uncaught ReferenceError: ${trimmed} is not defined. Type 'help' for available simulated methods.`,
            timestamp: now
          });
        }
      }
    } catch (err: any) {
      newLogs.push({
        id: Math.random().toString(),
        type: 'error',
        content: `Uncaught Error: ${err.message || 'Execution error'}`,
        timestamp: now
      });
    }

    setLogs(newLogs);
    setCommand('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-2 font-mono">
      {/* Action Bar */}
      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
        <span className="flex items-center space-x-1.5 text-cyan-400">
          <Terminal className="w-3.5 h-3.5" />
          <span>Interactive Client Console</span>
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCommand('help')}
            className="flex items-center space-x-1 px-1.5 py-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
          >
            <HelpCircle className="w-3 h-3" />
            <span>Help</span>
          </button>
          <button
            onClick={() => setLogs([])}
            className="flex items-center space-x-1 px-1.5 py-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Log Output Stream */}
      <div className="flex-1 overflow-auto space-y-1 text-xs pr-1">
        {logs.map((log) => {
          let color = 'text-slate-300';
          let prefix = '<';
          if (log.type === 'input') {
            color = 'text-cyan-400 font-semibold';
            prefix = '>';
          } else if (log.type === 'error') {
            color = 'text-rose-400 bg-rose-950/20 p-1 rounded';
            prefix = '✕';
          } else if (log.type === 'info') {
            color = 'text-slate-500 italic';
            prefix = 'ℹ';
          }

          return (
            <div key={log.id} className="flex items-start space-x-1.5">
              <span className="text-slate-600 select-none text-[10px] w-6 shrink-0">{prefix}</span>
              <pre className={`whitespace-pre-wrap font-mono break-all flex-1 ${color}`}>
                {log.content}
              </pre>
            </div>
          );
        })}
      </div>

      {/* Command Prompt Input */}
      <form onSubmit={executeCommand} className="flex items-center space-x-2 pt-2 border-t border-slate-800">
        <span className="text-cyan-400 font-bold select-none">&gt;</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Type command... (e.g. localStorage, atob('...'), document.cookie)"
          className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none text-xs font-mono"
        />
        <button
          type="submit"
          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 rounded"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
