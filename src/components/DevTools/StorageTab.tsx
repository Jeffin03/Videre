import React, { useState } from 'react';
import { Database, Cookie, Edit2, Check, RefreshCw, Key, ShieldAlert } from 'lucide-react';

interface StorageItem {
  key: string;
  value: string;
  type: 'localStorage' | 'cookie';
}

interface StorageTabProps {
  storageItems: StorageItem[];
  onStorageChange?: (key: string, value: string) => void;
}

export const StorageTab: React.FC<StorageTabProps> = ({ storageItems, onStorageChange }) => {
  const [items, setItems] = useState<StorageItem[]>(storageItems);
  const [filterType, setFilterType] = useState<'all' | 'localStorage' | 'cookie'>('all');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [decodedPreview, setDecodedPreview] = useState<{ [key: string]: string | null }>({});

  const isBase64Like = (str: string) => {
    if (!str || str.length < 8) return false;
    try {
      return btoa(atob(str)) === str || /^[A-Za-z0-9+/=]+$/.test(str);
    } catch {
      return false;
    }
  };

  const handleDecode = (key: string, val: string) => {
    if (decodedPreview[key]) {
      setDecodedPreview(prev => ({ ...prev, [key]: null }));
      return;
    }
    try {
      const decoded = atob(val);
      setDecodedPreview(prev => ({ ...prev, [key]: decoded }));
    } catch {
      setDecodedPreview(prev => ({ ...prev, [key]: 'Error: Not valid Base64' }));
    }
  };

  const startEdit = (item: StorageItem) => {
    setEditingKey(item.key);
    setEditValue(item.value);
  };

  const saveEdit = (key: string) => {
    const updated = items.map(item => item.key === key ? { ...item, value: editValue } : item);
    setItems(updated);
    if (onStorageChange) {
      onStorageChange(key, editValue);
    }
    setEditingKey(null);
  };

  const filtered = items.filter(i => filterType === 'all' || i.type === filterType);

  return (
    <div className="flex flex-col h-full font-mono text-xs">
      {/* Storage Filter Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px]">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-semibold">Store:</span>
          <button
            onClick={() => setFilterType('all')}
            className={`px-2 py-0.5 rounded transition ${
              filterType === 'all' ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Items ({items.length})
          </button>
          <button
            onClick={() => setFilterType('localStorage')}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded transition ${
              filterType === 'localStorage' ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3 h-3 text-cyan-400" />
            <span>LocalStorage</span>
          </button>
          <button
            onClick={() => setFilterType('cookie')}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded transition ${
              filterType === 'cookie' ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cookie className="w-3 h-3 text-amber-400" />
            <span>Cookies</span>
          </button>
        </div>

        <div className="text-slate-500 text-[10px] hidden sm:block">
          Double-click or click pencil to tamper with values
        </div>
      </div>

      {/* Storage Table */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-12 px-3 py-1.5 bg-slate-900/60 border-b border-slate-800 text-[11px] text-slate-400 font-semibold select-none">
          <span className="col-span-2">Type</span>
          <span className="col-span-3">Key</span>
          <span className="col-span-5">Value</span>
          <span className="col-span-2 text-right">Actions</span>
        </div>

        <div className="divide-y divide-slate-900">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-slate-500">No items found in selected storage.</div>
          ) : (
            filtered.map((item) => {
              const isBase64 = isBase64Like(item.value);
              const isEditing = editingKey === item.key;
              const decoded = decodedPreview[item.key];

              return (
                <div key={item.key} className="px-3 py-2 hover:bg-slate-900/50 transition">
                  <div className="grid grid-cols-12 items-center">
                    <span className="col-span-2 flex items-center space-x-1">
                      {item.type === 'localStorage' ? (
                        <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 text-[10px]">
                          local
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800/60 text-[10px]">
                          cookie
                        </span>
                      )}
                    </span>

                    <span className="col-span-3 font-semibold text-slate-200 flex items-center space-x-1 truncate">
                      <Key className="w-3 h-3 text-slate-500 shrink-0" />
                      <span title={item.key}>{item.key}</span>
                    </span>

                    <div className="col-span-5 pr-2">
                      {isEditing ? (
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full bg-slate-900 border border-cyan-500 rounded px-2 py-0.5 text-slate-100 text-xs focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => saveEdit(item.key)}
                            className="p-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded"
                            title="Save changes"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <span
                          onDoubleClick={() => startEdit(item)}
                          className="font-mono text-slate-300 break-all cursor-pointer hover:text-cyan-300"
                          title="Double-click to edit value"
                        >
                          {item.value}
                        </span>
                      )}
                    </div>

                    <div className="col-span-2 flex items-center justify-end space-x-2">
                      {isBase64 && (
                        <button
                          onClick={() => handleDecode(item.key, item.value)}
                          className="px-1.5 py-0.5 bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800/80 rounded text-[10px] transition"
                        >
                          {decoded ? 'Hide' : 'Decode B64'}
                        </button>
                      )}
                      {!isEditing && (
                        <button
                          onClick={() => startEdit(item)}
                          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 rounded transition"
                          title="Edit value"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {decoded && (
                    <div className="mt-2 p-2 bg-purple-950/30 border border-purple-800/40 rounded text-purple-200 text-[11px] font-mono whitespace-pre-wrap break-all">
                      <div className="text-[10px] uppercase font-bold text-purple-400 mb-0.5 flex items-center space-x-1">
                        <ShieldAlert className="w-3 h-3" />
                        <span>Decoded Base64 Content</span>
                      </div>
                      {decoded}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
