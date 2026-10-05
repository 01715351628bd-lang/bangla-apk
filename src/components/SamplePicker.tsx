import React from 'react';
import { BookOpen } from 'lucide-react';
import { SAMPLE_TEXTS } from '../utils/converter';
import { SampleText } from '../types/converter';

interface SamplePickerProps {
  onSelectSample: (sample: SampleText) => void;
}

export const SamplePicker: React.FC<SamplePickerProps> = ({ onSelectSample }) => {
  return (
    <div className="pt-2 pb-1">
      <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span>Quick Test Samples:</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {SAMPLE_TEXTS.map((sample) => (
          <button
            key={sample.id}
            type="button"
            onClick={() => onSelectSample(sample)}
            className="text-left p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700/60 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all group cursor-pointer shadow-2xs"
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {sample.title}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-sans">
                {sample.category}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {sample.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
