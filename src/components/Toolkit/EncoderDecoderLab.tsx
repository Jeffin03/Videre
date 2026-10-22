import React, { useState } from 'react';
import { ArrowLeftRight, Copy, Check, Sparkles, AlertCircle, KeyRound, ShieldAlert } from 'lucide-react';

export const EncoderDecoderLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'b64' | 'url' | 'jwt' | 'hex' | 'rot13'>('b64');
  const [input, setInput] = useState('eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXgiLCJyb2xlIjoiYWRtaW4ifQ==');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'decode' | 'encode'>('decode');
  const [copied, setCopied] = useState(false);
  const [jwtParts, setJwtParts] = useState<{ header: any; payload: any; signature: string } | null>(null);

  const processData = (str: string, type: string, currentMode: 'encode' | 'decode') => {
    try {
      if (type === 'b64') {
        if (currentMode === 'decode') {
          let normalized = str.trim().replace(/-/g, '+').replace(/_/g, '/');
          while (normalized.length % 4) normalized += '=';
          setOutput(atob(normalized));
        } else {
          setOutput(btoa(str));
        }
      } else if (type === 'url') {
        if (currentMode === 'decode') {
          setOutput(decodeURIComponent(str));
        } else {
          setOutput(encodeURIComponent(str));
        }
      } else if (type === 'hex') {
        if (currentMode === 'decode') {
          const clean = str.replace(/[^0-9A-Fa-f]/g, '');
          let res = '';
          for (let i = 0; i < clean.length; i += 2) {
            res += String.fromCharCode(parseInt(clean.substr(i, 2), 16));
          }
          setOutput(res);
        } else {
          let res = '';
          for (let i = 0; i < str.length; i++) {
            res += str.charCodeAt(i).toString(16).padStart(2, '0');
          }
          setOutput(res);
        }
      } else if (type === 'rot13') {
        setOutput(
          str.replace(/[a-zA-Z]/g, (c) => {
            const code = c.charCodeAt(0);
            const base = code >= 97 ? 97 : 65;
            return String.fromCharCode(((code - base + 13) % 26) + base);
          })
        );
      } else if (type === 'jwt') {
        const parts = str.trim().split('.');
        if (parts.length >= 2) {
          const decodeB64Url = (b64u: string) => {
            let normalized = b64u.replace(/-/g, '+').replace(/_/g, '/');
            while (normalized.length % 4) normalized += '=';
            return JSON.parse(atob(normalized));
          };
          const header = decodeB64Url(parts[0]);
          const payload = decodeB64Url(parts[1]);
          setJwtParts({ header, payload, signature: parts[2] || 'NO_SIGNATURE' });
          setOutput(JSON.stringify({ header, payload }, null, 2));
        } else {
          setOutput('Invalid JWT structure. A JWT must consist of three parts separated by dots (header.payload.signature).');
          setJwtParts(null);
        }
      }
    } catch (e: any) {
      setOutput(`Error: ${e.message || 'Malformed input'}`);
      setJwtParts(null);
    }
  };

  const handleInputChange = (val: string) => {
    setInput(val);
    processData(val, activeTab, mode);
  };

  const switchTab = (tab: 'b64' | 'url' | 'jwt' | 'hex' | 'rot13') => {
    setActiveTab(tab);
    setJwtParts(null);
    let sample = '';
    if (tab === 'b64') sample = 'eyJ1c2VyIjoiZGV2X3RlYW0iLCJyb2xlIjoiYWRtaW4ifQ==';
    else if (tab === 'url') sample = '%3Cscript%3Ealert%281%29%3C%2Fscript%3E';
    else if (tab === 'jwt') sample = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXgiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MTYyMzkwMjJ9.4z7k2s';
    else if (tab === 'hex') sample = '43796265727365637572697479';
    else if (tab === 'rot13') sample = 'Ivqrre — Frr guvatf bguref zvff';

    setInput(sample);
    processData(sample, tab, mode);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-1.5 overflow-x-auto">
          <button
            onClick={() => switchTab('b64')}
            className={`px-3 py-1.5 rounded transition ${activeTab === 'b64' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Base64
          </button>
          <button
            onClick={() => switchTab('url')}
            className={`px-3 py-1.5 rounded transition ${activeTab === 'url' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800' : 'text-slate-400 hover:text-slate-200'}`}
          >
            URL Encoding
          </button>
          <button
            onClick={() => switchTab('jwt')}
            className={`px-3 py-1.5 rounded transition ${activeTab === 'jwt' ? 'bg-purple-950 text-purple-300 font-bold border border-purple-800' : 'text-slate-400 hover:text-slate-200'}`}
          >
            JWT Inspector
          </button>
          <button
            onClick={() => switchTab('hex')}
            className={`px-3 py-1.5 rounded transition ${activeTab === 'hex' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Hex
          </button>
          <button
            onClick={() => switchTab('rot13')}
            className={`px-3 py-1.5 rounded transition ${activeTab === 'rot13' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800' : 'text-slate-400 hover:text-slate-200'}`}
          >
            ROT13
          </button>
        </div>

        {activeTab !== 'jwt' && (
          <div className="flex items-center space-x-1 bg-slate-900 p-0.5 rounded border border-slate-800">
            <button
              onClick={() => {
                setMode('decode');
                processData(input, activeTab, 'decode');
              }}
              className={`px-2 py-1 rounded text-[11px] ${mode === 'decode' ? 'bg-cyan-600 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              Decode
            </button>
            <button
              onClick={() => {
                setMode('encode');
                processData(input, activeTab, 'encode');
              }}
              className={`px-2 py-1 rounded text-[11px] ${mode === 'encode' ? 'bg-cyan-600 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              Encode
            </button>
          </div>
        )}
      </div>

      {/* Inputs and Output Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">
            Input Payload ({mode === 'decode' ? 'Encoded' : 'Plaintext'})
          </label>
          <textarea
            rows={6}
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-400 break-all"
            placeholder="Type or paste payload..."
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] uppercase font-bold text-slate-400">
                Processed Result
              </label>
              <button
                onClick={copyResult}
                className="flex items-center space-x-1 text-slate-400 hover:text-slate-200 text-[11px]"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 font-mono text-xs min-h-[125px] whitespace-pre-wrap break-all overflow-auto">
              {output || '(Result appears here)'}
            </pre>
          </div>
        </div>
      </div>

      {/* JWT Breakdown Visualizer if JWT tab */}
      {activeTab === 'jwt' && jwtParts && (
        <div className="p-4 bg-slate-950 rounded-lg border border-purple-800/60 space-y-3 font-sans">
          <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs">
            <KeyRound className="w-4 h-4" />
            <span>JWT Structural Breakdown</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-2.5 bg-rose-950/20 border border-rose-800/60 rounded">
              <span className="text-[10px] text-rose-400 uppercase font-bold block mb-1">
                Header (Algorithm)
              </span>
              <pre className="text-rose-200 text-[11px] whitespace-pre-wrap">
                {JSON.stringify(jwtParts.header, null, 2)}
              </pre>
            </div>

            <div className="p-2.5 bg-purple-950/20 border border-purple-800/60 rounded">
              <span className="text-[10px] text-purple-400 uppercase font-bold block mb-1">
                Payload (Claims &amp; Roles)
              </span>
              <pre className="text-purple-200 text-[11px] whitespace-pre-wrap">
                {JSON.stringify(jwtParts.payload, null, 2)}
              </pre>
            </div>

            <div className="p-2.5 bg-cyan-950/20 border border-cyan-800/60 rounded">
              <span className="text-[10px] text-cyan-400 uppercase font-bold block mb-1">
                Signature
              </span>
              <p className="text-cyan-300 text-[11px] break-all">{jwtParts.signature}</p>
              <p className="text-[10px] text-slate-500 font-sans mt-2">
                Only the server with the private key can forge a valid signature.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
