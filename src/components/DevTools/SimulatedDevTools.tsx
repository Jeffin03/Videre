import React, { useState } from 'react';
import { Lesson } from '../../types';
import { ElementsTab } from './ElementsTab';
import { ConsoleTab } from './ConsoleTab';
import { NetworkTab } from './NetworkTab';
import { StorageTab } from './StorageTab';
import { SourcesTab } from './SourcesTab';
import {
  Code,
  Terminal,
  Wifi,
  Database,
  FileCode,
  X,
  Maximize2,
  Minimize2,
  Sparkles,
  Info
} from 'lucide-react';

interface SimulatedDevToolsProps {
  lesson: Lesson;
  isOpen: boolean;
  onClose: () => void;
  onStorageChange?: (key: string, value: string) => void;
  onDomTamper?: (attribute: string, value: string) => void;
}

export const SimulatedDevTools: React.FC<SimulatedDevToolsProps> = ({
  lesson,
  isOpen,
  onClose,
  onStorageChange,
  onDomTamper
}) => {
  const [activeTab, setActiveTab] = useState<'elements' | 'console' | 'sources' | 'network' | 'storage'>('elements');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (!isOpen) return null;

  const target = lesson.simulatedTarget;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-700/80 backdrop-blur-md shadow-2xl flex flex-col transition-all duration-200 font-mono ${
        isExpanded ? 'h-[75vh]' : 'h-[45vh] min-h-[260px] sm:h-[360px]'
      }`}
    >
      {/* DevTools Top Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-300 select-none">
        <div className="flex items-center space-x-1 overflow-x-auto min-w-0 flex-1">
          <div className="flex items-center space-x-1.5 pr-3 border-r border-slate-800 mr-2 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>DEVTOOLS</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-850">
              Interactive
            </span>
          </div>

          <button
            onClick={() => setActiveTab('elements')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded transition ${
              activeTab === 'elements'
                ? 'bg-slate-800 text-cyan-300 border-b-2 border-cyan-400 font-semibold'
                : 'hover:bg-slate-800/60 text-slate-400'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Elements</span>
          </button>

          <button
            onClick={() => setActiveTab('console')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded transition ${
              activeTab === 'console'
                ? 'bg-slate-800 text-cyan-300 border-b-2 border-cyan-400 font-semibold'
                : 'hover:bg-slate-800/60 text-slate-400'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Console</span>
          </button>

          <button
            onClick={() => setActiveTab('sources')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded transition ${
              activeTab === 'sources'
                ? 'bg-slate-800 text-cyan-300 border-b-2 border-cyan-400 font-semibold'
                : 'hover:bg-slate-800/60 text-slate-400'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Sources</span>
          </button>

          <button
            onClick={() => setActiveTab('network')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded transition ${
              activeTab === 'network'
                ? 'bg-slate-800 text-cyan-300 border-b-2 border-cyan-400 font-semibold'
                : 'hover:bg-slate-800/60 text-slate-400'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>Network</span>
            {target?.networkRequests?.length ? (
              <span className="text-[10px] bg-slate-800 px-1.5 rounded-full text-slate-300">
                {target.networkRequests.length}
              </span>
            ) : null}
          </button>

          <button
            onClick={() => setActiveTab('storage')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded transition ${
              activeTab === 'storage'
                ? 'bg-slate-800 text-cyan-300 border-b-2 border-cyan-400 font-semibold'
                : 'hover:bg-slate-800/60 text-slate-400'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Storage</span>
            {target?.storageItems?.length ? (
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/50 px-1.5 rounded-full">
                {target.storageItems.length}
              </span>
            ) : null}
          </button>
        </div>

        <div className="flex items-center space-x-2 pl-2 shrink-0">
          <div className="hidden sm:flex items-center space-x-1 text-[11px] text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800">
            <Info className="w-3 h-3 text-cyan-400" />
            <span>Simulating browser client scope</span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onClose}
            className="p-1 hover:bg-rose-950/60 hover:text-rose-400 rounded text-slate-400 transition"
            title="Close DevTools"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DevTools Body */}
      <div className="flex-1 overflow-auto bg-slate-950 text-slate-200 text-xs">
        {activeTab === 'elements' && (
          <ElementsTab
            htmlSource={target?.htmlSource || '<!-- No DOM content -->'}
            onDomTamper={onDomTamper}
          />
        )}
        {activeTab === 'console' && (
          <ConsoleTab
            storageItems={target?.storageItems || []}
            targetUrl={target?.targetUrl || 'about:blank'}
          />
        )}
        {activeTab === 'sources' && (
          <SourcesTab
            networkRequests={target?.networkRequests || []}
            htmlSource={target?.htmlSource || ''}
          />
        )}
        {activeTab === 'network' && (
          <NetworkTab networkRequests={target?.networkRequests || []} />
        )}
        {activeTab === 'storage' && (
          <StorageTab
            storageItems={target?.storageItems || []}
            onStorageChange={onStorageChange}
          />
        )}
      </div>

      {/* DevTools Status Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-slate-900/90 border-t border-slate-800/80 text-[11px] text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>DOM: Loaded</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="truncate max-w-[130px] sm:max-w-[280px]">Target: {target?.targetUrl || 'localhost'}</span>
        </div>
        <div className="hidden sm:flex items-center space-x-1 text-slate-500 shrink-0">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Videre Discovery Sandbox</span>
        </div>
      </div>
    </div>
  );
};
