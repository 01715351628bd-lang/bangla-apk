import React from 'react';
import { X, ShieldCheck, AlertCircle } from 'lucide-react';

interface UsageGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UsageGuide: React.FC<UsageGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 flex items-center justify-center font-bold text-sm">
              ?
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                How to Use Unicode to Bijoy (SutonnyMJ)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bengali">
                ইউনিকোড থেকে বিজয় টেক্সট ব্যবহারের নিয়ম ও সহায়িকা
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {/* Step by step */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Step-by-Step Workflow
            </h3>
            <ol className="space-y-3">
              <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    Input Your Unicode Bengali Text
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Paste text written using Avro keyboard, Google Input Tools, or copied from web pages into the left box.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    Click 'Convert' or Use Live Mode
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Press the <strong>Convert</strong> button (or press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded font-mono text-[10px]">Ctrl+Enter</kbd>). The conversion processes instantly inside your browser.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    Click 'Copy to Clipboard'
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Click the <strong>Copy to Clipboard</strong> button. The converted ANSI text will be copied directly to your clipboard with a confirmation notification.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    Paste into MS Word / Illustrator & Apply Font
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Paste the text into Microsoft Word, Adobe Photoshop, Illustrator, or InDesign. Highlight the text and select the font <strong className="text-blue-600 dark:text-blue-400">"SutonnyMJ"</strong> (or SutonnyBanglaOMJ).
                  </p>
                </div>
              </li>
            </ol>
          </div>

          {/* Why does it look like English letters? */}
          <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wide">
                  Why does the Bijoy output look like English letters (e.g. Avgvi †mvbvi evsjv)?
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-300/90 mt-1">
                  Bijoy / SutonnyMJ is an <strong>ANSI font</strong> that maps Bengali glyphs to ASCII character codes. This is completely expected. Once you paste it into your document and select the <strong>SutonnyMJ</strong> font, it will immediately display as proper Bengali.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy guarantee */}
          <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wide">
                  100% Client-Side Privacy
                </h4>
                <p className="text-xs text-blue-800 dark:text-blue-300/90 mt-1">
                  Your text never leaves your browser. No data is stored, sent to servers, or logged anywhere. It is completely safe for confidential government documents, legal contracts, and personal writings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-sm shadow-blue-500/20"
          >
            Got it, close
          </button>
        </div>
      </div>
    </div>
  );
};
