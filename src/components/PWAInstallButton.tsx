import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Smartphone, X, DownloadCloud, CheckCircle, Package } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // If already running in standalone/installed app mode, display indicator
  if (isInstalled) {
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg border border-emerald-200 dark:border-emerald-800">
        <CheckCircle className="w-3.5 h-3.5" />
        <span>App Installed</span>
      </span>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-[0.98]"
        title="APK ডাউনলোড বা অ্যাপ ইনস্টল করুন"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span>Download APK / Install</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 flex flex-col gap-4 text-slate-800 dark:text-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Android APK ও সরাসরি ইনস্টল
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ফাইল এক্সপ্লোরারে APK তৈরি করা হয়েছে ও নিচে ডাউনলোডের অপশন রয়েছে
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-3.5 leading-relaxed text-slate-600 dark:text-slate-300">
              {/* Option 1: Direct APK Download */}
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60">
                <p className="font-bold text-emerald-900 dark:text-emerald-200 mb-1 flex items-center gap-1.5 text-sm">
                  <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>সরাসরি তৈরি করা Android APK ফাইল (সম্পূর্ণ অফলাইন):</span>
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                  আপনার প্রজেক্টের ফাইল এক্সপ্লোরারে <code className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 font-mono text-[11px] text-emerald-800 dark:text-emerald-200">UnicodeToBijoy.apk</code> ফাইলটি সফলভাবে বিল্ড ও সাইন করা হয়েছে। আপনি নিচের বাটনে ক্লিক করে এখনই সরাসরি ডাউনলোড করতে পারেন:
                </p>

                <a
                  href="/UnicodeToBijoy.apk"
                  download="UnicodeToBijoy.apk"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-xl shadow-sm shadow-emerald-600/25 transition-all cursor-pointer"
                >
                  <DownloadCloud className="w-4 h-4" />
                  <span>UnicodeToBijoy.apk ডাউনলোড করুন (410 KB)</span>
                </a>
              </div>

              {/* Option 2: Direct Install without APK */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
                <p className="font-bold text-blue-900 dark:text-blue-200 mb-1.5 flex items-center gap-1.5 text-xs">
                  <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>ফোনের ক্রোম ব্রাউজার থেকে সরাসরি ইনস্টল (PWA):</span>
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-300 text-[11px]">
                  <li>অ্যান্ড্রয়েড ফোনের Chrome ব্রাউজারে সাইটটি ওপেন করুন।</li>
                  <li>ব্রাউজারের ৩টি ডট (⋮) চাপুন এবং <strong>"Install app"</strong> নির্বাচন করুন।</li>
                  <li>কোনো ডাউনলোড ঝামেলা ছাড়াই হোমস্ক্রিনে অ্যাপটি সরাসরি ইনস্টল হয়ে যাবে।</li>
                </ol>
              </div>

              {isIOS && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mb-0.5">
                    🍏 আইফোন / আইপ্যাডের জন্য (iOS Safari):
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Safari ব্রাউজারে নিচে <strong>Share</strong> বাটন চেপে <strong>"Add to Home Screen"</strong> বেছে নিন।
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
              >
                ঠিক আছে, বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
