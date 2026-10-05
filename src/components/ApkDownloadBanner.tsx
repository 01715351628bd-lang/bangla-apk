import React, { useState } from 'react';
import { DownloadCloud, CheckCircle2, Smartphone, ShieldCheck, Sparkles } from 'lucide-react';
import { triggerApkDownload } from '../utils/downloadApk';

export const ApkDownloadBanner: React.FC = () => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await triggerApkDownload();
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 4000);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 p-[1px] shadow-lg shadow-emerald-950/10 dark:shadow-emerald-950/30">
      <div className="rounded-[15px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-3.5 sm:px-6 sm:py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 shrink-0 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shadow-inner">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                Android APK ফাইল তৈরি সম্পন্ন হয়েছে
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                <ShieldCheck className="w-3 h-3" />
                <span>Signed • 410 KB</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                <Sparkles className="w-3 h-3" />
                <span>১০০% অফলাইন</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              অ্যান্ড্রয়েড ফোনে সরাসরি ইনস্টল করার জন্য নিচের বাটনে ক্লিক করে <strong className="font-mono text-emerald-700 dark:text-emerald-400">UnicodeToBijoy.apk</strong> এখনই ডাউনলোড করুন।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md shadow-emerald-600/30 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-60 active:scale-[0.98]"
          >
            {downloaded ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>ডাউনলোড শুরু হয়েছে!</span>
              </>
            ) : downloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>ডাউনলোড হচ্ছে...</span>
              </>
            ) : (
              <>
                <DownloadCloud className="w-4 h-4" />
                <span>ডাউনলোড করুন (UnicodeToBijoy.apk)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
