import React, { useState } from 'react';
import { Globe, ArrowRight, ShieldAlert, Sparkles, User, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

interface IdorExplorerDemoProps {
  onComplete?: () => void;
}

const INVOICE_DATABASE: Record<number, { client: string; amount: string; date: string; items: string; confidential?: boolean; ownerId: number }> = {
  5000: {
    client: 'Apex Robotics Inc.',
    amount: '$12,400.00',
    date: '2026-10-01',
    items: 'Industrial arm firmware audit & security scan',
    confidential: true,
    ownerId: 771
  },
  5001: {
    client: 'Vanguard Aerospace',
    amount: '$48,500.00',
    date: '2026-10-04',
    items: 'Propulsion telemetry integration contract (CONFIDENTIAL)',
    confidential: true,
    ownerId: 772
  },
  5002: {
    client: 'Alex Chen Designs (You)',
    amount: '$1,450.00',
    date: '2026-10-12',
    items: 'Web layout design & brand guidelines',
    confidential: false,
    ownerId: 892
  },
  5003: {
    client: 'Beacon Health Partners',
    amount: '$9,200.00',
    date: '2026-10-14',
    items: 'HIPAA compliance audit & staff training',
    confidential: true,
    ownerId: 773
  }
};

export const IdorExplorerDemo: React.FC<IdorExplorerDemoProps> = ({ onComplete }) => {
  const [currentId, setCurrentId] = useState<number>(5002);
  const [inputUrl, setInputUrl] = useState('https://invoicer.cloud/portal/invoice?id=5002');
  const [hasFoundIdor, setHasFoundIdor] = useState(false);

  const activeInvoice = INVOICE_DATABASE[currentId];
  const isOwner = activeInvoice?.ownerId === 892;

  const navigateToId = (id: number) => {
    setCurrentId(id);
    setInputUrl(`https://invoicer.cloud/portal/invoice?id=${id}`);
    if (id !== 5002) {
      setHasFoundIdor(true);
      if (onComplete) onComplete();
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const match = inputUrl.match(/id=(\d+)/);
    if (match) {
      const parsed = parseInt(match[1]);
      if (INVOICE_DATABASE[parsed]) {
        navigateToId(parsed);
      } else {
        alert(`Invoice #${parsed} does not exist in simulated database. Try 5000, 5001, 5002, or 5003.`);
      }
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 my-4 shadow-xl font-mono text-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100 font-sans">
              Interactive Lab: Parameter Manipulation (IDOR)
            </h4>
            <p className="text-[11px] text-slate-400 font-sans">
              You are logged in as Alex Chen (User #892). What happens when you change the URL invoice ID?
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
          <User className="w-3.5 h-3.5 text-emerald-400" />
          <span>Logged in: <strong>Alex Chen</strong> (ID #892)</span>
        </div>
      </div>

      {/* Simulated Browser Address Bar */}
      <form onSubmit={handleUrlSubmit} className="flex items-center space-x-2 bg-slate-950 p-2 rounded-lg border border-slate-800 mb-4">
        <div className="flex items-center space-x-1 text-slate-500">
          <button
            type="button"
            onClick={() => currentId > 5000 && navigateToId(currentId - 1)}
            disabled={currentId <= 5000}
            className="p-1 hover:bg-slate-800 rounded disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => currentId < 5003 && navigateToId(currentId + 1)}
            disabled={currentId >= 5003}
            className="p-1 hover:bg-slate-800 rounded disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 flex items-center bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-slate-200">
          <span className="text-slate-500 mr-1 select-none">https://invoicer.cloud/portal/invoice?id=</span>
          <input
            type="number"
            value={currentId}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              setCurrentId(val);
              setInputUrl(`https://invoicer.cloud/portal/invoice?id=${val}`);
            }}
            className="w-16 bg-slate-800 text-cyan-300 font-bold px-1 rounded focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
        </div>

        <button
          type="submit"
          className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded text-xs transition"
        >
          Go
        </button>
      </form>

      {/* Invoice Document Simulation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-5 rounded-lg border transition-all ${
          !isOwner
            ? 'bg-rose-950/20 border-rose-500/50 shadow-lg shadow-rose-950/30'
            : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex justify-between items-start border-b border-slate-800 pb-3 mb-3">
            <div>
              <div className="flex items-center space-x-2">
                <FileText className={`w-4 h-4 ${!isOwner ? 'text-rose-400' : 'text-emerald-400'}`} />
                <h5 className="font-bold text-slate-100 font-sans text-sm">
                  Invoice #{currentId}
                </h5>
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                Issue Date: {activeInvoice?.date || 'N/A'}
              </p>
            </div>

            <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold uppercase ${
              isOwner
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
            }`}>
              {isOwner ? 'Authorized (Your Account)' : 'CONFIDENTIAL (Other Tenant)'}
            </span>
          </div>

          <div className="space-y-3 font-sans text-xs">
            <div>
              <span className="text-[10px] uppercase text-slate-500 font-mono block">Billed Client</span>
              <p className="text-slate-100 font-semibold text-sm">
                {activeInvoice?.client || 'Not Found'}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase text-slate-500 font-mono block">Line Items</span>
              <p className="text-slate-300">{activeInvoice?.items}</p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Total Contract Value:</span>
              <span className="text-lg font-mono font-bold text-emerald-400">
                {activeInvoice?.amount}
              </span>
            </div>
          </div>
        </div>

        {/* Mental Model & Query Breakdown */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-between font-sans">
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-200 block border-b border-slate-800 pb-2">
              The Architecture of the Vulnerability
            </span>

            <div className="text-xs text-slate-300 space-y-2">
              <p>
                <strong>What the vulnerable server did:</strong>
              </p>
              <pre className="p-2 bg-slate-900 border border-rose-900/40 rounded text-rose-300 font-mono text-[11px]">
{`SELECT * FROM invoices 
WHERE id = ${currentId};`}
              </pre>
              <p className="text-slate-400 text-[11px]">
                Notice that the query only asks for the ID passed in the URL. It never asks: <em>"Does user #892 own invoice #{currentId}?"</em>
              </p>
            </div>

            {hasFoundIdor && (
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/60 rounded text-emerald-300 text-xs flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Instinct Activated:</strong> You just pulled off Insecure Direct Object Reference (IDOR). In 2026, IDOR is responsible for millions in bug bounty payouts because systems check <em>who you are</em> (authn), but forget to check <em>what you own</em> (authz).
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            <strong>The Secure Query:</strong>
            <pre className="mt-1 p-2 bg-slate-900 border border-emerald-900/40 rounded text-emerald-300 font-mono text-[10px]">
{`SELECT * FROM invoices 
WHERE id = ? AND owner_id = CURRENT_USER_ID;`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
