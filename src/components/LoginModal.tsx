import React, { useEffect, useState } from 'react';
import { Check, ShieldCheck, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const VALUE_BADGES = [
  '100% Authentic & Sealed',
  'Official Brand Warranty',
  '5% Extra Off on Prepaid Orders',
];

export const LoginModal: React.FC = () => {
  const {
    loginModalOpen,
    setLoginModalOpen,
    storeSettings,
    signInWithMobileNumber,
    loginWithGoogle,
  } = useStore();

  const [mobileNumber, setMobileNumber] = useState('');
  const [notifyOffers, setNotifyOffers] = useState(true);
  const [badgeIdx, setBadgeIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loginModalOpen) return;
    const timer = setInterval(() => {
      setBadgeIdx((prev) => (prev + 1) % VALUE_BADGES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [loginModalOpen]);

  if (!loginModalOpen) return null;

  const digits = mobileNumber.replace(/[^0-9]/g, '');
  const isValidMobile = digits.length === 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidMobile || submitting) return;
    setSubmitting(true);
    try {
      await signInWithMobileNumber(digits, notifyOffers);
      setMobileNumber('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150"
      onClick={() => setLoginModalOpen(false)}
    >
      <div
        className="w-full max-w-[400px] bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[#B5893D]/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Royal Gold/Yellow Gradient Hero Banner (Exact Video 00:27 - 00:32) */}
        <div className="relative bg-gradient-to-br from-[#F7D060] via-[#E5B33A] to-[#C88E1E] px-6 pt-7 pb-11 text-center text-[#1A1A1A]">
          <button
            type="button"
            onClick={() => setLoginModalOpen(false)}
            aria-label="Close Login Modal"
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/20 hover:bg-black/35 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Brand Emblem / Logo */}
          <div className="w-16 h-16 mx-auto rounded-full bg-white shadow-md border-2 border-white/80 flex items-center justify-center p-2 mb-3">
            <img
              src={storeSettings.logoUrl || '/charlie-logo.png'}
              alt={storeSettings.businessName || 'Charlie Luxury'}
              className="w-full h-full object-contain"
            />
          </div>

          <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#1A1A1A] tracking-wide">
            Welcome to {storeSettings.businessName || 'Charlie Luxury'}!
          </h2>

          {/* Feature Highlight Tag */}
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#2A1810] text-[#F4D993] text-[11px] font-semibold tracking-wide shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F4D993] shrink-0" />
            <span>{VALUE_BADGES[badgeIdx]}</span>
          </div>
        </div>

        {/* Overlapping Crisp White Auth Card */}
        <div className="relative -mt-5 mx-3.5 sm:mx-4 mb-4 bg-white rounded-2xl shadow-lg border border-[#EAE5DC] p-5 space-y-4">
          <div className="text-center">
            <p className="text-sm text-[#1A1A1A]">
              Unlock <span className="font-bold">Exclusive Deals Now!</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* +91 Indian Flag Mobile Input Box */}
            <div className="flex items-center h-11 rounded-lg border border-[#D4CFC7] focus-within:border-[#1A1A1A] bg-white px-3 transition-colors">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-[#1A1A1A] pr-2.5 border-r border-[#EAE5DC] shrink-0 select-none">
                <span aria-hidden="true" className="text-base leading-none">
                  🇮🇳
                </span>
                <span>+91</span>
              </span>
              <input
                type="tel"
                inputMode="numeric"
                autoFocus
                maxLength={10}
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                placeholder="Enter Mobile Number"
                className="flex-1 h-full pl-3 text-sm text-[#1A1A1A] placeholder:text-[#8C8C8C] focus:outline-none bg-transparent select-text tabular-nums"
              />
            </div>

            {/* Notify Me Checkbox */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <button
                type="button"
                role="checkbox"
                aria-checked={notifyOffers}
                onClick={() => setNotifyOffers((v) => !v)}
                className={`w-4 h-4 rounded-[3px] flex items-center justify-center border transition-colors cursor-pointer ${
                  notifyOffers
                    ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                    : 'bg-white border-[#B8B8B8]'
                }`}
              >
                {notifyOffers && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
              <span className="text-xs text-[#4A4A4A]">
                Notify me with offers &amp; updates
              </span>
            </label>

            {/* Primary Black Submit CTA */}
            <button
              type="submit"
              disabled={!isValidMobile || submitting}
              className={`w-full h-11 rounded-lg text-xs sm:text-sm font-semibold tracking-wide transition-colors cursor-pointer ${
                isValidMobile
                  ? 'bg-[#000000] hover:bg-[#1A1A1A] text-white'
                  : 'bg-[#5A5A5A] text-white/90 cursor-not-allowed'
              }`}
            >
              {submitting ? 'Signing In...' : 'Submit'}
            </button>
          </form>

          {/* Firebase Google One-Tap Sign-In */}
          <div className="pt-1 space-y-2.5">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#999999]">
              <div className="h-[1px] bg-[#EAE5DC] flex-1" />
              <span>or</span>
              <div className="h-[1px] bg-[#EAE5DC] flex-1" />
            </div>

            <button
              type="button"
              onClick={async () => {
                setLoginModalOpen(false);
                await loginWithGoogle();
              }}
              className="w-full h-10 rounded-lg border border-[#D4CFC7] hover:border-[#1A1A1A] bg-[#FAF7F2] hover:bg-white text-[#1A1A1A] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Continue with Google Account</span>
            </button>
          </div>

          <p className="text-center text-[10px] leading-relaxed text-[#777777] pt-1">
            I accept that I have read &amp; understood your{' '}
            <span className="underline text-[#1A1A1A]">Privacy Policy</span> and{' '}
            <span className="underline text-[#1A1A1A]">T&amp;Cs</span>.
          </p>
        </div>
      </div>
    </div>
  );
};
