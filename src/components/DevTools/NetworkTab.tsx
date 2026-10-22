import React, { useState } from 'react';
import { Wifi, ArrowDownRight, ArrowUpRight, Copy, Check } from 'lucide-react';

interface NetworkRequest {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: number;
  headers: Record<string, string>;
  body?: any;
  response: any;
}

interface NetworkTabProps {
  networkRequests: NetworkRequest[];
}

export const NetworkTab: React.FC<NetworkTabProps> = ({ networkRequests }) => {
  const [selectedReq, setSelectedReq] = useState<NetworkRequest | null>(
    networkRequests.length > 0 ? networkRequests[0] : null
  );
  const [detailTab, setDetailTab] = useState<'headers' | 'response' | 'payload'>('headers');
  const [copied, setCopied] = useState(false);

  const copyResponse = () => {
    if (!selectedReq) return;
    navigator.clipboard.writeText(JSON.stringify(selectedReq.response, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col md:flex-row h-full font-mono text-xs">
      {/* Requests Table */}
      <div className="flex-1 flex flex-col border-r border-slate-800 overflow-auto">
        <div className="grid grid-cols-12 px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 font-semibold select-none">
          <span className="col-span-2">Method</span>
          <span className="col-span-6">Name / Path</span>
          <span className="col-span-2">Status</span>
          <span className="col-span-2 text-right">Type</span>
        </div>

        <div className="flex-1 overflow-auto divide-y divide-slate-900">
          {networkRequests.length === 0 ? (
            <div className="p-4 text-center text-slate-500">
              No network requests recorded for this state.
            </div>
          ) : (
            networkRequests.map((req, idx) => {
              const isSelected = selectedReq?.url === req.url && selectedReq?.method === req.method;
              const statusColor =
                req.status >= 200 && req.status < 300
                  ? 'text-emerald-400'
                  : req.status >= 400
                  ? 'text-rose-400'
                  : 'text-amber-400';

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedReq(req)}
                  className={`grid grid-cols-12 px-3 py-1.5 items-center cursor-pointer hover:bg-slate-800/60 transition ${
                    isSelected ? 'bg-cyan-950/40 text-cyan-200 border-l-2 border-cyan-400' : 'text-slate-300'
                  }`}
                >
                  <span className="col-span-2 font-bold text-[11px] flex items-center space-x-1">
                    {req.method === 'GET' ? (
                      <ArrowDownRight className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <ArrowUpRight className="w-3 h-3 text-cyan-400" />
                    )}
                    <span>{req.method}</span>
                  </span>
                  <span className="col-span-6 truncate text-slate-200" title={req.url}>
                    {req.url}
                  </span>
                  <span className={`col-span-2 font-semibold ${statusColor}`}>{req.status}</span>
                  <span className="col-span-2 text-right text-slate-500 text-[11px]">xhr/json</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Details Side Panel */}
      <div className="w-full md:w-80 bg-slate-950 flex flex-col border-t md:border-t-0 md:border-l border-slate-800 overflow-hidden">
        {selectedReq ? (
          <>
            {/* Header sub-tabs */}
            <div className="flex items-center justify-between px-3 py-1 bg-slate-900 border-b border-slate-800 text-[11px]">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setDetailTab('headers')}
                  className={`px-2 py-1 rounded transition ${
                    detailTab === 'headers' ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Headers
                </button>
                <button
                  onClick={() => setDetailTab('response')}
                  className={`px-2 py-1 rounded transition ${
                    detailTab === 'response' ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Response
                </button>
                {selectedReq.body && (
                  <button
                    onClick={() => setDetailTab('payload')}
                    className={`px-2 py-1 rounded transition ${
                      detailTab === 'payload' ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Payload
                  </button>
                )}
              </div>

              {detailTab === 'response' && (
                <button
                  onClick={copyResponse}
                  className="flex items-center space-x-1 text-slate-400 hover:text-slate-200"
                  title="Copy JSON"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            {/* Sub-tab content */}
            <div className="flex-1 p-3 overflow-auto">
              {detailTab === 'headers' && (
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                      General
                    </span>
                    <div className="space-y-0.5 text-[11.5px] bg-slate-900/60 p-2 rounded border border-slate-800/60">
                      <div><strong className="text-slate-400">Request URL:</strong> <span className="text-cyan-400">{selectedReq.url}</span></div>
                      <div><strong className="text-slate-400">Request Method:</strong> <span>{selectedReq.method}</span></div>
                      <div><strong className="text-slate-400">Status Code:</strong> <span className="text-emerald-400">{selectedReq.status} OK</span></div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                      Response Headers
                    </span>
                    <div className="space-y-1 text-[11.5px] bg-slate-900/60 p-2 rounded border border-slate-800/60">
                      {Object.entries(selectedReq.headers).map(([k, v]) => (
                        <div key={k} className="break-all">
                          <span className="text-purple-300 font-semibold">{k}:</span> <span className="text-slate-300">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {detailTab === 'response' && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Raw JSON Body
                  </span>
                  <pre className="p-2.5 bg-slate-900/90 rounded border border-slate-800 text-[11px] text-emerald-300 whitespace-pre-wrap break-all leading-relaxed">
                    {JSON.stringify(selectedReq.response, null, 2)}
                  </pre>
                </div>
              )}

              {detailTab === 'payload' && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Request Payload
                  </span>
                  <pre className="p-2.5 bg-slate-900/90 rounded border border-slate-800 text-[11px] text-amber-300 whitespace-pre-wrap break-all leading-relaxed">
                    {JSON.stringify(selectedReq.body, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-center p-4">
            Select a network request on the left to inspect headers and JSON payload.
          </div>
        )}
      </div>
    </div>
  );
};
