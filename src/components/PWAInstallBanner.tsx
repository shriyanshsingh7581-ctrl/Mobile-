import React, { useState } from 'react';
import { CheckCircle2, Download, Share, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useStore } from '../context/StoreContext';

interface PWAInstallBannerProps {
  variant?: 'home-card' | 'header-btn' | 'drawer-btn';
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({
  variant = 'home-card',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { storeSettings } = useStore();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const logoSrc = storeSettings.logoUrl || '/charlie-logo.png';

  // Hide when already running as an installed standalone PWA
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      {variant === 'header-btn' && (
        <button
          type="button"
          onClick={handleInstallClick}
          title="Install Charlie Mobiles App"
          className="h-7 px-2.5 rounded-full bg-white text-[#F26522] text-[11px] font-extrabold flex items-center gap-1 shadow-xs hover:bg-orange-50 transition-colors shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      )}

      {variant === 'drawer-btn' && (
        <div className="p-3 bg-orange-50/70 border-b border-orange-200/80">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={logoSrc}
                alt="Charlie Mobiles App"
                className="w-9 h-9 rounded-lg object-contain bg-white border border-orange-200 p-0.5 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-[#1E293B] truncate">
                  {storeSettings.storeName || 'Charlie Mobiles'} App
                </p>
                <p className="text-[10px] text-slate-600 truncate">
                  Fast 1-Tap Shopping &amp; Offers
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded-lg bg-[#F26522] hover:bg-[#EA580C] text-white text-xs font-extrabold flex items-center gap-1 shrink-0 shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
          </div>
        </div>
      )}

      {variant === 'home-card' && !dismissed && (
        <section className="max-w-7xl mx-auto px-2 sm:px-6">
          <div className="bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E293B] text-white rounded-xl p-3 sm:p-4 border border-orange-500/30 shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-xs">
                <img
                  src={logoSrc}
                  alt="Charlie Mobiles PWA"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-extrabold text-white truncate">
                    Install {storeSettings.storeName || 'Charlie Mobiles'} App
                  </span>
                  <span className="hidden sm:inline-block text-[10px] font-bold text-[#F26522] bg-orange-500/15 px-1.5 py-0.5 rounded">
                    OFFICIAL PWA
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300 truncate">
                  Add to Home Screen for faster shopping, live price alerts &amp; offline browsing
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleInstallClick}
                className="h-9 px-3.5 sm:px-4 rounded-lg bg-gradient-to-r from-[#F26522] to-[#EA580C] hover:from-[#EA580C] hover:to-[#D9460F] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install App</span>
              </button>
              <button
                type="button"
                onClick={() => setDismissed(true)}
                aria-label="Dismiss install banner"
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Guided Install Modal for iOS Safari / Mobile Browsers */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-gradient-to-r from-[#F26522] to-[#EA580C] px-4 py-3.5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                <h3 className="text-sm font-extrabold">Install {storeSettings.storeName || 'Charlie Mobiles'} App</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-[#1E293B]">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50/70 border border-orange-200">
                <img
                  src={logoSrc}
                  alt="Charlie Mobiles"
                  className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-200 object-contain shrink-0"
                />
                <div>
                  <p className="font-extrabold text-sm text-[#1E293B]">
                    {storeSettings.businessName || 'CHARLIE MOBILES & ACCESSORIES'}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Works on Android &amp; iPhone · Zero storage overhead
                  </p>
                </div>
              </div>

              {isIOS ? (
                <div className="space-y-2.5">
                  <p className="font-extrabold text-[#F26522] uppercase tracking-wider text-[11px]">
                    Install on iPhone / iPad (Safari):
                  </p>
                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <Share className="w-4 h-4 text-[#F26522] shrink-0 mt-0.5" />
                    <p>
                      1. Tap the <strong>Share</strong> icon at the bottom of your Safari browser.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#28A745] shrink-0 mt-0.5" />
                    <p>
                      2. Scroll down and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>, then tap <strong>Add</strong>.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <p className="font-extrabold text-[#F26522] uppercase tracking-wider text-[11px]">
                    How to Install on Your Phone / Computer:
                  </p>
                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#28A745] shrink-0 mt-0.5" />
                    <p>
                      <strong>Android (Chrome):</strong> Tap the browser menu <strong>(⋮)</strong> in the top-right corner and select <strong>&ldquo;Install app&rdquo;</strong> or <strong>&ldquo;Add to Home screen&rdquo;</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#28A745] shrink-0 mt-0.5" />
                    <p>
                      <strong>iPhone (Safari):</strong> Tap the <strong>Share</strong> button and choose <strong>&ldquo;Add to Home Screen&rdquo;</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#28A745] shrink-0 mt-0.5" />
                    <p>
                      <strong>Desktop Chrome / Edge:</strong> Click the <strong>Install icon</strong> on the right side of the address bar.
                    </p>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="w-full h-10 rounded-xl bg-[#F26522] hover:bg-[#EA580C] text-white font-extrabold text-xs cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
