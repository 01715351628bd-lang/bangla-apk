import React from 'react';
import { X, Trash2, ArrowRight, Copy, Check } from 'lucide-react';
import { ConversionHistoryItem } from '../types/converter';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ConversionHistoryItem[];
  onClearHistory: () => void;
  onRestore: (item: ConversionHistoryItem) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onRestore,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Recent Conversions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Locally cached on your device for your convenience (never uploaded)
            </p>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500">
              <p className="text-sm">No recent conversions yet.</p>
              <p className="text-xs mt-1">Conversions you perform will be saved here automatically.</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex flex-col gap-2"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {item.mode === 'unicode-to-bijoy' ? 'Unicode ➔ Bijoy' : 'Bijoy ➔ Unicode'}
                  </span>
                  <span className="font-mono tabular-nums">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 font-bengali text-slate-700 dark:text-slate-300 line-clamp-2">
                    {item.inputSnippet}
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300 line-clamp-2">
                    {item.outputSnippet}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.id, item.fullOutput)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md transition-colors cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Output</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onRestore(item);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-900/60 rounded-md transition-colors cursor-pointer"
                  >
                    <span>Load into Editor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Kept locally in browser storage</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
