import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Crown, Gift, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SmartImage } from './SmartImage';

const REWARD_SESSION_KEY = 'charlie_luxury_reward_popup_seen_v1';

export const RewardsPopupModal: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '';
  const {
    storeSettings,
    rewardModalOpen,
    setRewardModalOpen,
    submitRewardLead,
    activeNotifyModalProduct,
    setActiveNotifyModalProduct,
    submitNotifyMeRequest,
  } = useStore();

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [notifyContact, setNotifyContact] = useState('');

  // Trigger split luxury reward popup once per session (exact 00:02 - 00:03 in video)
  useEffect(() => {
    if (storeSettings.rewardPopupEnabled === false) return;
    try {
      const alreadySeen = sessionStorage.getItem(REWARD_SESSION_KEY);
      if (!alreadySeen) {
        const timer = setTimeout(() => {
          setRewardModalOpen(true);
          sessionStorage.setItem(REWARD_SESSION_KEY, 'true');
        }, 2200);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore storage errors
    }
  }, [storeSettings.rewardPopupEnabled, setRewardModalOpen]);

  const handleRewardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !email.trim()) return;
    submitRewardLead({
      phone: phone.trim().startsWith('+91') ? phone.trim() : `+91 ${phone.trim()}`,
      email: email.trim(),
      birthday: birthday.trim() || 'Not specified',
    });
    setPhone('');
    setEmail('');
    setBirthday('');
    setRewardModalOpen(false);
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeNotifyModalProduct || !notifyContact.trim()) return;
    submitNotifyMeRequest({
      productId: activeNotifyModalProduct.id,
      productName: activeNotifyModalProduct.name,
      customerContact: notifyContact.trim(),
    });
    setNotifyContact('');
    setActiveNotifyModalProduct(null);
  };

  return (
    <>
      {/* Subtle Floating Gift Trigger on Left Bottom (hidden on Home screen so Home stays completely clean) */}
      {!isHome && (
        <button
          type="button"
          onClick={() => setRewardModalOpen(true)}
          aria-label="Unlock Exclusive Rewards"
          className="fixed bottom-20 md:bottom-6 left-3.5 z-30 h-10 px-3.5 bg-[#2A1810] hover:bg-[#1A1A1A] text-[#E6C67C] border border-[#B5893D]/60 shadow-lg flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase cursor-pointer transition-transform active:scale-95"
        >
          <Gift className="w-3.5 h-3.5 text-[#B5893D]" />
          <span className="hidden sm:inline">Unlock Rewards</span>
        </button>
      )}

      {/* 1. SPLIT LUXURY REWARDS POPUP MODAL (EXACT VIDEO 00:02 - 00:03) */}
      {rewardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[1px] flex items-center justify-center p-3 sm:p-5">
          <div className="relative w-full max-w-[660px] bg-white shadow-2xl overflow-hidden grid grid-cols-12 border border-[#B5893D]/30 animate-in fade-in zoom-in-95 duration-200">
            {/* Close X Button */}
            <button
              type="button"
              onClick={() => setRewardModalOpen(false)}
              aria-label="Close popup"
              className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-[#1A1A1A] flex items-center justify-center shadow-xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Column: Rich Espresso & Gold Luxury Visual ("A LITTLE SOMETHING JUST FOR YOU") */}
            <div className="col-span-5 relative bg-gradient-to-b from-[#2A1810] via-[#1E110B] to-[#120A06] text-white p-4 sm:p-6 flex flex-col justify-between overflow-hidden min-h-[320px]">
              {/* Decorative Gold Radial Glow */}
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 70% 45%, #B5893D 0%, transparent 65%)',
                }}
              />

              {/* Top Gold Crest */}
              <div className="relative z-10 flex flex-col items-start">
                <div className="w-9 h-9 rounded-full border border-[#B5893D]/60 bg-[#B5893D]/15 flex items-center justify-center text-[#E6C67C]">
                  <Crown className="w-4 h-4" />
                </div>
              </div>

              {/* Center Product Visual */}
              <div className="relative z-10 my-auto py-2 flex items-center justify-center">
                <div className="w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
                  <SmartImage
                    src={
                      storeSettings.rewardPopupImage ||
                      'https://img-prd-pim.poorvika.com/product/Apple-iPhone-17-Pro-Max-Cosmic-Orange-2tB-front-back-view.png'
                    }
                    alt="Luxury Reward"
                    className="w-full h-full object-contain drop-shadow-[0_12px_20px_rgba(181,137,61,0.35)]"
                  />
                </div>
              </div>

              {/* Bottom Gold Editorial Headline */}
              <div className="relative z-10 space-y-1">
                <p className="font-serif-luxury text-base sm:text-xl font-bold uppercase leading-tight tracking-wider text-[#F4D993]">
                  A LITTLE
                  <br />
                  SOMETHING
                </p>
                <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D7B56D]">
                  JUST FOR YOU
                </p>
              </div>
            </div>

            {/* Right Column: Clean White Form ("Unlock Your Exclusive Rewards") */}
            <div className="col-span-7 bg-white p-4 sm:p-7 flex flex-col justify-center">
              <h3 className="text-sm sm:text-lg font-bold text-[#1A1A1A] leading-snug pr-5">
                {storeSettings.rewardPopupTitle || 'Unlock Your Exclusive Royal Rewards'}
              </h3>
              <p className="text-[11px] sm:text-xs text-[#666666] mt-1">
                {storeSettings.rewardPopupSubtitle ||
                  'Get Special Offers & Instant Rewards'}
              </p>

              <form onSubmit={handleRewardSubmit} className="mt-4 space-y-2.5">
                <div className="flex items-center border border-[#D4D4D4] focus-within:border-[#B5893D] bg-white h-9 sm:h-10 px-2.5">
                  <span className="text-[11px] sm:text-xs font-semibold text-[#1A1A1A] pr-2 border-r border-[#E5E5E5] flex items-center gap-1">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter Mobile Number *"
                    className="w-full pl-2.5 text-[11px] sm:text-xs text-[#1A1A1A] placeholder:text-[#999999] focus:outline-none"
                  />
                </div>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email *"
                  className="w-full h-9 sm:h-10 px-3 border border-[#D4D4D4] focus:border-[#B5893D] text-[11px] sm:text-xs text-[#1A1A1A] placeholder:text-[#999999] focus:outline-none"
                />

                <input
                  type="text"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  placeholder="Birthday (DD-MM-YYYY)"
                  className="w-full h-9 sm:h-10 px-3 border border-[#D4D4D4] focus:border-[#B5893D] text-[11px] sm:text-xs text-[#1A1A1A] placeholder:text-[#999999] focus:outline-none"
                />

                <button
                  type="submit"
                  className="w-full h-9 sm:h-10 bg-[#262626] hover:bg-[#B5893D] text-white text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer mt-1"
                >
                  CLAIM MY REWARD
                </button>
              </form>

              <p className="text-[9px] sm:text-[10px] text-[#888888] mt-3 leading-relaxed">
                By signing up, you agree to receive exclusive privilege updates &amp; our{' '}
                <span className="underline text-[#1A1A1A]">Privacy Policy</span> and{' '}
                <span className="underline text-[#1A1A1A]">Terms of Service</span>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. "🔔 NOTIFY ME" OUT-OF-STOCK ALERT MODAL (EXACT VIDEO 00:28) */}
      {activeNotifyModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white border border-[#B5893D]/40 p-6 shadow-2xl space-y-4">
            <button
              type="button"
              onClick={() => setActiveNotifyModalProduct(null)}
              aria-label="Close"
              className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center text-[#666666] hover:text-[#1A1A1A] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FAF7F2] border border-[#B5893D]/40 flex items-center justify-center text-[#B5893D] shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B5893D]">
                  PRIORITY WAITLIST
                </span>
                <h3 className="font-serif-luxury text-lg font-bold text-[#1A1A1A] uppercase">
                  Notify Me When Available
                </h3>
              </div>
            </div>

            <div className="p-3 bg-[#FAF7F2] border border-[#EAE5DC] flex items-center gap-3">
              <div className="w-12 h-12 bg-white p-1 shrink-0">
                <SmartImage
                  src={activeNotifyModalProduct.mainImage}
                  alt={activeNotifyModalProduct.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#1A1A1A] truncate">
                  {activeNotifyModalProduct.name}
                </p>
                <p className="text-[11px] text-[#B5893D] font-semibold">
                  Reserve Priority Restock Alert
                </p>
              </div>
            </div>

            <form onSubmit={handleNotifySubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#666666] mb-1">
                  Mobile Number or Email *
                </label>
                <input
                  type="text"
                  required
                  value={notifyContact}
                  onChange={(e) => setNotifyContact(e.target.value)}
                  placeholder="+91 98XXXXXXXX or your@email.com"
                  className="w-full h-10 px-3 border border-[#D4D4D4] focus:border-[#B5893D] text-xs text-[#1A1A1A] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-10 bg-[#1A1A1A] hover:bg-[#B5893D] text-white text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
              >
                🔔 NOTIFY ME ON RESTOCK
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
