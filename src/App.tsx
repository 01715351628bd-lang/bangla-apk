/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { DirectionControl } from './components/DirectionControl';
import { InputPanel, OutputPanel } from './components/TextareaCard';
import { SamplePicker } from './components/SamplePicker';
import { UsageGuide } from './components/UsageGuide';
import { HistoryModal } from './components/HistoryModal';
import { ApkDownloadBanner } from './components/ApkDownloadBanner';
import { unicodeToBijoy, bijoyToUnicode } from '@abdalgolabs/ansi-unicode-converter';
import { calculateStats } from './utils/converter';
import {
  ConversionMode,
  ConversionHistoryItem,
  SampleText,
} from './types/converter';
import { ArrowRightLeft, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'bn_converter_history_v1';
const AUTO_CONVERT_KEY = 'bn_converter_autoconvert';
const THEME_KEY = 'bn_converter_theme';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  const [mode, setMode] = useState<ConversionMode>('unicode-to-bijoy');
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [autoConvert, setAutoConvert] = useState<boolean>(() => {
    const saved = localStorage.getItem(AUTO_CONVERT_KEY);
    return saved !== null ? saved === 'true' : true;
  });
  const [history, setHistory] = useState<ConversionHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [justConverted, setJustConverted] = useState(false);

  // Sync theme with html root class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Core conversion execution
  const executeConversion = useCallback(
    (textToConvert: string, currentMode: ConversionMode, recordHistory = false) => {
      if (!textToConvert.trim()) {
        setOutputText('');
        return;
      }

      const result =
        currentMode === 'unicode-to-bijoy'
          ? unicodeToBijoy(textToConvert)
          : bijoyToUnicode(textToConvert);

      setOutputText(result);

      if (recordHistory && textToConvert.trim().length > 3) {
        setHistory((prev) => {
          const newItem: ConversionHistoryItem = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            mode: currentMode,
            inputSnippet:
              textToConvert.slice(0, 70) + (textToConvert.length > 70 ? '...' : ''),
            outputSnippet:
              result.slice(0, 70) + (result.length > 70 ? '...' : ''),
            fullInput: textToConvert,
            fullOutput: result,
          };
          const updated = [newItem, ...prev.filter((i) => i.fullInput !== textToConvert)].slice(0, 20);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          } catch {
            // Storage quota handled safely
          }
          return updated;
        });
      }
    },
    []
  );

  // Live conversion when typing (if autoConvert is enabled)
  useEffect(() => {
    if (autoConvert) {
      executeConversion(inputText, mode, false);
    }
  }, [inputText, mode, autoConvert, executeConversion]);

  // Explicit conversion handler (clicking 'Convert' or pressing Ctrl+Enter)
  const handleManualConvert = () => {
    executeConversion(inputText, mode, true);
    setJustConverted(true);
    setTimeout(() => setJustConverted(false), 1200);
  };

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to convert
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleManualConvert();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Toggle conversion direction and swap existing text
  const handleToggleMode = () => {
    const newMode: ConversionMode =
      mode === 'unicode-to-bijoy' ? 'bijoy-to-unicode' : 'unicode-to-bijoy';
    setMode(newMode);

    // Swap input and output text so user can immediately roundtrip
    if (outputText) {
      setInputText(outputText);
      executeConversion(outputText, newMode, false);
    }
  };

  const handleToggleAutoConvert = () => {
    const nextVal = !autoConvert;
    setAutoConvert(nextVal);
    localStorage.setItem(AUTO_CONVERT_KEY, String(nextVal));
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  const handleSelectSample = (sample: SampleText) => {
    if (mode !== 'unicode-to-bijoy') {
      setMode('unicode-to-bijoy');
    }
    setInputText(sample.unicodeText);
    executeConversion(sample.unicodeText, 'unicode-to-bijoy', true);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleRestoreFromHistory = (item: ConversionHistoryItem) => {
    setMode(item.mode);
    setInputText(item.fullInput);
    setOutputText(item.fullOutput);
  };

  const inputStats = calculateStats(inputText);
  const outputStats = calculateStats(outputText);

  const isUnicodeToBijoy = mode === 'unicode-to-bijoy';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* 3-Zone Header Contract with Theme Toggle */}
      <Header
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5">
        {/* Prominent Page Title Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-2 border-b border-slate-200/60 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Unicode to Bijoy Converter
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800">
                SutonnyMJ
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              High-speed, private Bengali text conversion between Unicode and Bijoy ANSI fonts for Microsoft Word, Illustrator, InDesign & Photoshop.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>100% Client-Side & Private</span>
            </span>
          </div>
        </div>

        {/* APK Direct Download Banner */}
        <ApkDownloadBanner />

        {/* Top Control Bar: Direction + Live Convert + Convert Button */}
        <DirectionControl
          mode={mode}
          onToggleMode={handleToggleMode}
          autoConvert={autoConvert}
          onToggleAutoConvert={handleToggleAutoConvert}
          onConvert={handleManualConvert}
          onClear={handleClear}
          hasInput={inputText.trim().length > 0}
        />

        {/* Side-by-Side Large Textarea Grid with Dedicated Counters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 flex-1 items-stretch">
          {/* Left Panel: Large Input Area */}
          <div className="flex flex-col h-full">
            <InputPanel
              title={isUnicodeToBijoy ? 'Unicode Input' : 'Bijoy (ANSI) Input'}
              subtitle={isUnicodeToBijoy ? 'ইউনিকোড বাংলা টেক্সট' : 'বিজয় টেক্সট'}
              value={inputText}
              onChange={setInputText}
              onClear={handleClear}
              stats={inputStats}
              placeholder={
                isUnicodeToBijoy
                  ? 'এখানে ইউনিকোড বাংলা টেক্সট পেস্ট করুন বা টাইপ করুন...\n(যেমন: অব্র বা ওয়েবসাইট থেকে কপি করা লেখা)'
                  : 'Paste legacy Bijoy (SutonnyMJ / ANSI) text here...\n(e.g., Avgvi †mvbvi evsjv...)'
              }
              isBengaliFont={isUnicodeToBijoy}
            />
          </div>

          {/* Right Panel: Large Output Area */}
          <div className="flex flex-col h-full">
            <OutputPanel
              title={isUnicodeToBijoy ? 'Bijoy (SutonnyMJ) Output' : 'Unicode Output'}
              subtitle={isUnicodeToBijoy ? 'বিজয় টেক্সট (সুতোন্মীএমজে)' : 'ইউনিকোড বাংলা টেক্সট'}
              value={outputText}
              stats={outputStats}
              placeholder={
                isUnicodeToBijoy
                  ? 'Converted Bijoy (SutonnyMJ) text will appear here'
                  : 'Converted Unicode Bengali text will appear here'
              }
              onConvertNow={handleManualConvert}
              hasInput={inputText.trim().length > 0}
              isBijoy={isUnicodeToBijoy}
            />
          </div>
        </div>

        {/* Center Quick Action Callout with Modern Blue Accent */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <span>
              {autoConvert
                ? 'Live Conversion is active — text converts automatically as you type.'
                : 'Manual mode active — click Convert or press Ctrl+Enter.'}
            </span>
            {justConverted && (
              <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold text-xs ml-2 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Converted!</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleMode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Swap Directions</span>
            </button>

            <button
              type="button"
              onClick={handleManualConvert}
              disabled={!inputText.trim()}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer ${
                inputText.trim()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-[0.98]'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Convert (Ctrl+Enter)</span>
            </button>
          </div>
        </div>

        {/* Quick Sample Text Buttons */}
        <SamplePicker onSelectSample={handleSelectSample} />

        {/* Trust & Application Guidance Card */}
        <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-slate-900/60 border border-blue-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400 transition-colors">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>
              Client-side converter: Your text never leaves your device. Fully secure for government documents, news articles & private data.
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span>Font applied in Word/Photoshop:</span>
            <span className="font-semibold text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-blue-200/80 dark:border-blue-900/60 shadow-2xs font-mono text-xs">
              SutonnyMJ
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <p>
            <strong className="text-slate-700 dark:text-slate-300 font-semibold">Unicode to Bijoy Converter</strong> · Pure Client-Side JavaScript
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              How to use in Word & Photoshop
            </button>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              Recent History ({history.length})
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <UsageGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        onRestore={handleRestoreFromHistory}
      />
    </div>
  );
}
