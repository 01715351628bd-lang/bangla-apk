import React, { useRef, useState, useEffect } from 'react';
import {
  Copy,
  Check,
  ClipboardPaste,
  Download,
  Upload,
  Trash2,
  Eye,
  Code2,
  FileText,
  FileCode,
  FileCheck,
  ChevronDown
} from 'lucide-react';
import { TextStats } from '../types/converter';
import { downloadAsTxt, downloadAsRtf } from '../utils/fileExport';

interface InputCardProps {
  title: string;
  subtitle: string;
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  stats: TextStats;
  placeholder: string;
  isBengaliFont?: boolean;
}

export const InputPanel: React.FC<InputCardProps> = ({
  title,
  subtitle,
  value,
  onChange,
  onClear,
  stats,
  placeholder,
  isBengaliFont = true,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pasteNotice, setPasteNotice] = useState(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text);
        setPasteNotice(true);
        setTimeout(() => setPasteNotice(false), 1500);
      }
    } catch {
      const textarea = document.getElementById('input-textarea') as HTMLTextAreaElement;
      if (textarea) textarea.focus();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onChange(content);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-900/60 transition-all overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
      {/* Panel Header */}
      <div className="px-4 py-3 bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-xs shadow-blue-500/50" />
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
            <span>{title}</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">· {subtitle}</span>
          </h2>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.doc,.rtf"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-slate-800 rounded-md border border-transparent hover:border-blue-200 dark:hover:border-slate-700 transition-all cursor-pointer"
            title="Import text file (.txt)"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Import .txt</span>
          </button>

          <button
            type="button"
            onClick={handlePaste}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-slate-800 rounded-md border border-transparent hover:border-blue-200 dark:hover:border-slate-700 transition-all cursor-pointer"
            title="Paste text from clipboard"
          >
            {pasteNotice ? (
              <>
                <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-700 dark:text-blue-400 font-semibold">Pasted!</span>
              </>
            ) : (
              <>
                <ClipboardPaste className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Paste</span>
              </>
            )}
          </button>

          {value && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition-colors cursor-pointer"
              title="Clear input"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Larger Textarea Area */}
      <div className="relative flex-1 min-h-[480px] sm:min-h-[540px] lg:min-h-[580px] p-5 flex flex-col bg-transparent">
        <textarea
          id="input-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={title}
          spellCheck={false}
          className={`w-full flex-1 resize-none bg-transparent text-slate-900 dark:text-slate-100 text-base leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none ${
            isBengaliFont ? 'font-bengali' : 'font-sans'
          }`}
        />
      </div>

      {/* Dedicated Character Counter & Statistics Bar Below Textarea */}
      <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/60 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs select-none">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-900/60 font-semibold font-mono text-xs shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span>{stats.chars.toLocaleString()} Characters</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs">
            <span>{stats.words.toLocaleString()} Words</span>
          </span>
        </div>

        <div className="flex items-center gap-2.5 font-mono tabular-nums text-[11px] text-slate-500 dark:text-slate-400">
          <span title="Characters excluding whitespace">
            <strong className="text-slate-700 dark:text-slate-300 font-semibold">{stats.charsWithoutSpaces.toLocaleString()}</strong> non-space
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span title="Line count">
            <strong className="text-slate-700 dark:text-slate-300 font-semibold">{stats.lines}</strong> lines
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-sans">
            Editable input
          </span>
        </div>
      </div>
    </div>
  );
};

interface OutputCardProps {
  title: string;
  subtitle: string;
  value: string;
  stats: TextStats;
  placeholder: string;
  onConvertNow: () => void;
  hasInput: boolean;
  isBijoy?: boolean;
}

export const OutputPanel: React.FC<OutputCardProps> = ({
  title,
  subtitle,
  value,
  stats,
  placeholder,
  onConvertNow,
  hasInput,
  isBijoy = true,
}) => {
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);
  const [fontPreview, setFontPreview] = useState<'raw' | 'sutonny'>('raw');
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const exportDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(e.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const triggerToast = (titleText: string, descText: string) => {
    setToastMessage({ title: titleText, desc: descText });
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleCopyToClipboard = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.getElementById('output-textarea') as HTMLTextAreaElement;
      if (textarea) {
        textarea.select();
        document.execCommand('copy');
      }
    }

    setCopied(true);
    triggerToast('Copied to Clipboard!', 'Converted text is ready to paste into Word or Illustrator.');

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleDownloadTxt = () => {
    if (!value) return;
    downloadAsTxt(value, isBijoy);
    setIsExportMenuOpen(false);
    triggerToast('Downloaded as .TXT file', 'Plain text file saved to your device.');
  };

  const handleDownloadRtf = () => {
    if (!value) return;
    downloadAsRtf(value, isBijoy);
    setIsExportMenuOpen(false);
    triggerToast(
      'Downloaded as .RTF for Word',
      isBijoy
        ? 'Formatted with SutonnyMJ font preset for Word, WordPad & InDesign.'
        : 'Formatted with Unicode Bengali fonts for Word & WordPad.'
    );
  };

  const byteSize = typeof Blob !== 'undefined' ? new Blob([value]).size : value.length;
  const formattedSize =
    byteSize < 1024
      ? `${byteSize} B`
      : `${(byteSize / 1024).toFixed(1)} KB`;

  return (
    <div className="relative flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-900/60 transition-all overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="absolute top-14 right-4 z-40 flex items-center gap-2.5 px-4 py-2.5 bg-slate-900/95 dark:bg-slate-800/95 text-white text-xs rounded-xl shadow-2xl border border-slate-700/60 dark:border-slate-600/60 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-xs">
            <Check className="w-3 h-3 stroke-[3]" />
          </span>
          <div>
            <p className="font-bold text-emerald-400">{toastMessage.title}</p>
            <p className="text-[11px] text-slate-300">{toastMessage.desc}</p>
          </div>
        </div>
      )}

      {/* Panel Header */}
      <div className="px-4 py-3 bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-xs shadow-blue-500/50" />
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
            <span>{title}</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">· {subtitle}</span>
          </h2>
          {value && (
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/70 dark:border-blue-900/60 px-2 py-0.5 rounded-md tabular-nums font-semibold">
              <strong>{stats.chars.toLocaleString()}</strong> chars · <strong>{stats.words.toLocaleString()}</strong> words
            </span>
          )}
        </div>

        {/* Output tools: Font View Switcher + Export Dropdown + Copy to Clipboard Button */}
        <div className="flex items-center gap-1.5">
          {/* SutonnyMJ preview switcher */}
          <div className="hidden sm:inline-flex items-center p-0.5 bg-slate-200/70 dark:bg-slate-800 rounded-lg text-[11px] font-medium text-slate-600 dark:text-slate-400">
            <button
              type="button"
              onClick={() => setFontPreview('raw')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                fontPreview === 'raw'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Display raw ANSI characters needed for Word/Photoshop"
            >
              <Code2 className="w-3 h-3" />
              <span>Raw ANSI</span>
            </button>
            <button
              type="button"
              onClick={() => setFontPreview('sutonny')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                fontPreview === 'sutonny'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Preview with SutonnyMJ font if installed on your system"
            >
              <Eye className="w-3 h-3" />
              <span>SutonnyMJ Font</span>
            </button>
          </div>

          {/* Export Dropdown (.txt and .rtf) */}
          {value && (
            <div className="relative" ref={exportDropdownRef}>
              <button
                type="button"
                onClick={() => setIsExportMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-slate-800 hover:bg-blue-50/50 dark:hover:bg-slate-700/80 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs transition-all cursor-pointer"
                title="Download as .txt or .rtf file"
              >
                <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Download</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isExportMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isExportMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 z-50 w-56 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1.5 animate-in fade-in slide-in-from-top-1 duration-100">
                  <div className="px-3 py-1 border-b border-slate-100 dark:border-slate-700/60 mb-1">
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Export Format
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadTxt}
                    className="w-full flex items-start gap-2.5 px-3 py-2 text-left hover:bg-blue-50 dark:hover:bg-slate-700/70 text-slate-800 dark:text-slate-100 transition-colors cursor-pointer group"
                  >
                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        Plain Text (.txt)
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Standard UTF-8 text file for any editor
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadRtf}
                    className="w-full flex items-start gap-2.5 px-3 py-2 text-left hover:bg-emerald-50 dark:hover:bg-slate-700/70 text-slate-800 dark:text-slate-100 transition-colors cursor-pointer group"
                  >
                    <FileCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex items-center gap-1.5">
                        <span>Rich Text (.rtf)</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded">
                          Word / InDesign
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {isBijoy ? 'Pre-set with SutonnyMJ font for Word' : 'With Unicode Bengali font for Word'}
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Dedicated 'Copy to Clipboard' Button with Toast Confirmation */}
          <button
            type="button"
            onClick={handleCopyToClipboard}
            disabled={!value}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 active:scale-[0.98] ${
              copied
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white focus-visible:ring-emerald-500 scale-102'
                : value
                ? 'bg-blue-600 hover:bg-blue-700 text-white focus-visible:ring-blue-500 shadow-blue-500/20 hover:shadow-blue-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200 dark:border-slate-700'
            }`}
            title={value ? 'Copy converted result to clipboard' : 'No converted text to copy'}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy to Clipboard</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Larger Output Content Area */}
      <div className="relative flex-1 min-h-[480px] sm:min-h-[540px] lg:min-h-[580px] p-5 flex flex-col bg-slate-50/20 dark:bg-slate-950/20">
        {value ? (
          <>
            <textarea
              id="output-textarea"
              readOnly
              value={value}
              aria-label={title}
              className={`w-full flex-1 resize-none bg-transparent text-slate-900 dark:text-slate-100 text-base leading-relaxed focus:outline-none ${
                fontPreview === 'sutonny'
                  ? 'font-sutonny text-lg'
                  : 'font-mono text-sm tracking-normal text-slate-800 dark:text-slate-200'
              }`}
            />
            {/* Quick Action Toolbar with Copy, .TXT, and .RTF buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-100/80 dark:border-slate-800 mt-2">
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                Direct export to Word, WordPad, or text editors
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs transition-all cursor-pointer active:scale-98"
                  title="Download as plain text (.txt)"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>.TXT File</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadRtf}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 bg-emerald-50/70 dark:bg-emerald-950/40 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/60 border border-emerald-200/80 dark:border-emerald-900/60 rounded-lg shadow-2xs transition-all cursor-pointer active:scale-98"
                  title="Download as Rich Text (.rtf) formatted for Microsoft Word"
                >
                  <FileCode className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>.RTF (Word Document)</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyToClipboard}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/80 dark:border-blue-900/60 rounded-lg shadow-2xs transition-all cursor-pointer active:scale-98"
                  title="Copy to Clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Copy to Clipboard</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full flex-1 flex flex-col items-center justify-center text-center p-6 select-none">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-500 dark:text-blue-400 mb-3 shadow-2xs">
              <FileText className="w-7 h-7 stroke-1.5" />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-sm mb-1">
              {placeholder}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mb-4">
              Enter or paste text on the left and click Convert to generate Bijoy (SutonnyMJ) encoded text.
            </p>
            {hasInput && (
              <button
                type="button"
                onClick={onConvertNow}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/25 transition-all cursor-pointer"
              >
                <span>Convert Left Text Now</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Dedicated Character Counter & Statistics Bar Below Output Textarea */}
      <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/60 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs select-none">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-900/60 font-semibold font-mono text-xs shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span>{stats.chars.toLocaleString()} Characters</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs">
            <span>{stats.words.toLocaleString()} Words</span>
          </span>
        </div>

        <div className="flex items-center gap-2.5 font-mono tabular-nums text-[11px] text-slate-500 dark:text-slate-400">
          <span title="Characters excluding whitespace">
            <strong className="text-slate-700 dark:text-slate-300 font-semibold">{stats.charsWithoutSpaces.toLocaleString()}</strong> non-space
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span title="Line count">
            <strong className="text-slate-700 dark:text-slate-300 font-semibold">{stats.lines}</strong> lines
          </span>
          {value && (
            <>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-slate-600 dark:text-slate-300 font-medium" title="Approximate text size">
                Size: <strong className="text-slate-800 dark:text-slate-200 font-semibold">{formattedSize}</strong>
              </span>
            </>
          )}
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-sans">
            {fontPreview === 'sutonny' ? 'SutonnyMJ Font' : 'ANSI Code'}
          </span>
        </div>
      </div>
    </div>
  );
};
