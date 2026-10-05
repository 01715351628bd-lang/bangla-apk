import React from 'react';
import { ShieldCheck, HelpCircle, History, Sun, Moon } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  onOpenGuide: () => void;
  onOpenHistory: () => void;
  historyCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGuide,
  onOpenHistory,
  historyCount,
  theme,
  onToggleTheme,
}) => {
  const isDark = theme === 'dark';

  return (
    <header className="border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm ring-1 ring-blue-700/20 shadow-blue-500/20">
            ব
          </div>
          <div>
            <a href="/" className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
              <span>Unicode to Bijoy Converter</span>
              <span className="hidden md:inline text-xs font-normal text-slate-400 dark:text-slate-500 font-bengali">
                (ইউনিকোড ➔ বিজয় কনভার্টার)
              </span>
            </a>
          </div>
        </div>

        {/* Zone 2: Quiet unboxed metadata */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span className="inline-flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>100% Client-Side</span>
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span>Zero Server Storage</span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span>SutonnyMJ Compatible</span>
        </div>

        {/* Zone 3: Primary functional actions */}
        <div className="flex items-center gap-2">
          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Theme Toggle (Light/Dark mode) */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex items-center gap-1.5 p-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-90 duration-200" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 transition-transform -rotate-12 hover:rotate-0 duration-200" />
            )}
          </button>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
            title="View recent conversions saved on your device"
          >
            <History className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Recent</span>
            {historyCount > 0 && (
              <span className="font-mono text-[10px] bg-blue-100 dark:bg-blue-900/60 px-1.5 py-0.2 rounded-full tabular-nums text-blue-700 dark:text-blue-300 font-semibold">
                {historyCount}
              </span>
            )}
          </button>

          {/* Guide Button */}
          <button
            onClick={onOpenGuide}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer shadow-sm shadow-blue-500/20"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How to Use</span>
          </button>
        </div>
      </div>
    </header>
  );
};
