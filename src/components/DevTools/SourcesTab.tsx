import React, { useState } from 'react';
import { FileCode, Folder, Search, Copy, Check } from 'lucide-react';

interface NetworkRequest {
  url: string;
  method: string;
  response: any;
}

interface SourcesTabProps {
  networkRequests: NetworkRequest[];
  htmlSource: string;
}

export const SourcesTab: React.FC<SourcesTabProps> = ({ networkRequests, htmlSource }) => {
  const [selectedFile, setSelectedFile] = useState<string>('bundle.js');
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Extract any JS files from requests or mock
  const jsRequest = networkRequests.find(r => r.url.endsWith('.js'));
  const jsContent = jsRequest
    ? (typeof jsRequest.response === 'string' ? jsRequest.response : JSON.stringify(jsRequest.response, null, 2))
    : `// Client Application Bundle v2.1.0
(function() {
  const API_GATEWAY = "https://internal.nexuscorp.io/api";
  const ROUTES = {
    auth: "/auth/login",
    profile: "/users/me",
    // Unlisted legacy migration endpoint:
    adminBulkExport: "/api/v3/internal/bulk-export"
  };

  window.__INITIAL_STATE__ = {
    theme: "dark",
    featureFlags: { betaAdmin: false, experimentalVpn: false }
  };
})();`;

  const files = [
    { name: 'bundle.js', content: jsContent },
    { name: 'index.html', content: htmlSource }
  ];

  const currentContent = files.find(f => f.name === selectedFile)?.content || '';

  const copyContent = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = currentContent.split('\n');

  return (
    <div className="flex flex-col md:flex-row h-full font-mono text-xs">
      {/* File Tree Sidebar */}
      <div className="w-full md:w-56 bg-slate-900/80 border-r border-slate-800 p-2 flex flex-col">
        <span className="text-[10px] uppercase font-bold text-slate-500 mb-2 px-1">Source Tree</span>
        <div className="space-y-1">
          <div className="flex items-center space-x-1 text-slate-400 px-1 py-0.5 text-[11px]">
            <Folder className="w-3.5 h-3.5 text-cyan-400" />
            <span>static / js</span>
          </div>
          {files.map(file => (
            <button
              key={file.name}
              onClick={() => setSelectedFile(file.name)}
              className={`w-full flex items-center space-x-1.5 px-3 py-1 rounded text-left transition ${
                selectedFile === file.name
                  ? 'bg-cyan-950 text-cyan-300 font-semibold border-l-2 border-cyan-400'
                  : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate">{file.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Code Viewer */}
      <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
        {/* Sub-bar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="text-cyan-400 font-semibold">{selectedFile}</span>
            <span className="text-slate-600">|</span>
            <div className="relative">
              <input
                type="text"
                placeholder="Search in file..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-slate-200 text-xs w-40 placeholder-slate-600 focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={copyContent}
            className="flex items-center space-x-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Lines */}
        <div className="flex-1 overflow-auto p-2 font-mono text-[11.5px] leading-relaxed">
          {lines.map((line, idx) => {
            const matchesSearch = searchTerm && line.toLowerCase().includes(searchTerm.toLowerCase());
            return (
              <div
                key={idx}
                className={`flex items-start py-0.5 px-1 rounded ${
                  matchesSearch ? 'bg-yellow-500/20 border-l-2 border-yellow-400' : 'hover:bg-slate-900/60'
                }`}
              >
                <span className="w-8 shrink-0 text-slate-600 select-none text-[10px] text-right pr-2">
                  {idx + 1}
                </span>
                <span className="whitespace-pre-wrap break-all text-slate-300">{line}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
