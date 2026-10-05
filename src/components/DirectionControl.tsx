import React from 'react';
import { ArrowRightLeft, Sparkles, Trash2, Zap } from 'lucide-react';
import { ConversionMode } from '../types/converter';

interface DirectionControlProps {
  mode: ConversionMode;
  onToggleMode: () => void;
  autoConvert: boolean;
  onToggleAutoConvert: () => void;
  onConvert: () => void;
  onClear: () => void;
  hasInput: boolean;
}

export const DirectionControl: React.FC<DirectionControlProps> = ({
  mode,
  onToggleMode,
  autoConvert,
  onToggleAutoConvert,
  onConvert,
  onClear,
  hasInput,
}) => {
  const isUnicodeToBijoy = mode === 'unicode-to-bijoy';

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Direction Switcher Segmented Control */}
      <div className="flex items-center gap-2">
        <div className="inline-flex items-center p-1 bg-slate-100/90 dark:bg-slate-800/90 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
          <button
            type="button"
            onClick={() => {
              if (!isUnicodeToBijoy) onToggleMode();
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              isUnicodeToBijoy
                ? 'bg-white dark:bg-slate-900 text-blue-900 dark:text-blue-300 shadow-xs border border-blue-100/80 dark:border-blue-900/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-600 shadow-xs shadow-blue-500/50" />
            <span>Unicode ➔ Bijoy (SutonnyMJ)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (isUnicodeToBijoy) onToggleMode();
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              !isUnicodeToBijoy
                ? 'bg-white dark:bg-slate-900 text-indigo-900 dark:text-indigo-300 shadow-xs border border-indigo-100/80 dark:border-indigo-900/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            <span>Bijoy ➔ Unicode</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onToggleMode}
          title="Swap input and output directions"
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Action Controls & Settings */}
      <div className="flex items-center gap-3">
        {/* Auto-convert toggle */}
        <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoConvert}
            onChange={onToggleAutoConvert}
            className="w-4 h-4 text-blue-600 border-slate-300 dark:border-slate-600 dark:bg-slate-800 rounded focus:ring-blue-500 cursor-pointer"
          />
          <span className="flex items-center gap-1">
            <Zap className={`w-3.5 h-3.5 ${autoConvert ? 'text-blue-500 fill-blue-500' : 'text-slate-400 dark:text-slate-500'}`} />
            <span>Live Convert</span>
          </span>
        </label>

        {/* Clear Button */}
        {hasInput && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200/80 dark:border-slate-700/80 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}

        {/* Convert Button */}
        <button
          type="button"
          onClick={onConvert}
          disabled={!hasInput}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 cursor-pointer ${
            hasInput
              ? 'bg-blue-600 hover:bg-blue-700 text-white focus-visible:ring-blue-500 active:scale-[0.98] shadow-blue-500/20'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Convert Now</span>
          <kbd className="hidden sm:inline font-mono text-[10px] bg-blue-700/70 px-1.5 py-0.5 rounded text-blue-100">
            Ctrl+Enter
          </kbd>
        </button>
      </div>
    </div>
  );
};
