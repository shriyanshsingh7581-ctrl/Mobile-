import React, { useState } from 'react';
import {
  Check,
  Copy,
  CreditCard,
  Percent,
  RefreshCw,
  Sparkles,
  Tag,
} from 'lucide-react';
import { formatINR, useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const OffersPage: React.FC = () => {
  const { products, coupons, showToast, openWhatsAppEnquiry } = useStore();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [oldPhoneBrand, setOldPhoneBrand] = useState('Apple iPhone');
  const [oldPhoneCondition, setOldPhoneCondition] = useState<'flawless' | 'good' | 'working'>('flawless');
  const [emiPrice, setEmiPrice] = useState(69999);
  const [emiMonths, setEmiMonths] = useState(6);

  const estimatedExchangeValue =
    (oldPhoneBrand === 'Apple iPhone'
      ? 24000
      : oldPhoneBrand === 'Samsung Galaxy'
      ? 18000
      : 12000) *
    (oldPhoneCondition === 'flawless' ? 1 : oldPhoneCondition === 'good' ? 0.8 : 0.55);

  const smartphoneDeals = products.filter((p) => p.mrp - p.price >= 5000).slice(0, 4);
  const accessoryDeals = products
    .filter((p) => ['chargers', 'power-banks', 'earbuds', 'mobile-accessories'].includes(p.category))
    .slice(0, 4);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Copied coupon code ${code}`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-8 space-y-8">
      {/* Promotional Header Banner */}
      <div className="rounded-3xl bg-[#101114] text-white p-6 sm:p-8 border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00C2FF]">
            <Sparkles className="w-4 h-4" />
            <span>Charlie Mobile Festival Deals</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Smartphone Deals, Instant Exchange &amp; No-Cost EMI
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Unlock instant coupon discounts, extra exchange bonuses up to ₹9,000 on your old phone, and zero down-payment EMI plans at Charlie Mobile &amp; Accessories.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            openWhatsAppEnquiry({
              customMessage:
                'Hello Charlie Mobile, please share today’s special store exchange and bank cashback offers.',
            })
          }
          className="self-start lg:self-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white text-xs font-bold cursor-pointer shrink-0"
        >
          Ask Store for Custom Deal
        </button>
      </div>

      {/* Active Coupon Codes */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#2563EB]" />
          <h2 className="text-lg sm:text-xl font-extrabold text-[#171717]">
            Active Promotional Coupon Codes
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {coupons
            .filter((c) => c.active)
            .map((coupon) => (
              <div
                key={coupon.code}
                className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col justify-between gap-3"
              >
                <div>
                  <span className="text-xs font-extrabold text-[#2563EB] uppercase tracking-wider">
                    Min Order {formatINR(coupon.minOrderAmount)}
                  </span>
                  <h3 className="mt-1 text-base font-extrabold text-[#171717]">{coupon.title}</h3>
                  <p className="mt-1 text-xs text-[#737373]">{coupon.description}</p>
                </div>
                <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                  <span className="font-mono-num text-sm font-extrabold text-[#171717] tracking-wider">
                    {coupon.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyCoupon(coupon.code)}
                    className="min-h-[36px] px-3 py-1.5 rounded-xl bg-[#101114] hover:bg-[#2563EB] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedCode === coupon.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Interactive Exchange & No-Cost EMI Calculators */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Old-Phone Exchange Calculator */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB] uppercase tracking-wider">
            <RefreshCw className="w-4 h-4" />
            <span>Smart Upgrade Estimator</span>
          </div>
          <h2 className="text-lg font-extrabold text-[#171717]">
            Old Smartphone Exchange Value Estimator
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-[#171717] mb-1">Your Current Brand</label>
              <select
                value={oldPhoneBrand}
                onChange={(e) => setOldPhoneBrand(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] bg-[#F5F6F8] font-semibold"
              >
                <option>Apple iPhone</option>
                <option>Samsung Galaxy</option>
                <option>Vivo / Oppo / OnePlus</option>
                <option>Redmi / Realme / Motorola</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#171717] mb-1">Device Condition</label>
              <select
                value={oldPhoneCondition}
                onChange={(e) =>
                  setOldPhoneCondition(e.target.value as 'flawless' | 'good' | 'working')
                }
                className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] bg-[#F5F6F8] font-semibold"
              >
                <option value="flawless">Flawless (No Scratches)</option>
                <option value="good">Good (Minor Wear)</option>
                <option value="working">Working (Screen/Body Marks)</option>
              </select>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#F5F6F8] flex items-center justify-between">
            <div>
              <p className="text-xs text-[#737373]">Estimated Exchange Credit + Bonus</p>
              <p className="text-xl font-extrabold text-[#2563EB] tabular-nums">
                Up to {formatINR(estimatedExchangeValue + 5000)}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                openWhatsAppEnquiry({
                  customMessage: `Hi Charlie Mobile, I want to exchange my ${oldPhoneBrand} (${oldPhoneCondition} condition) for a new smartphone.`,
                })
              }
              className="px-4 py-2 rounded-xl bg-[#101114] text-white text-xs font-bold cursor-pointer"
            >
              Book Valuation
            </button>
          </div>
        </div>

        {/* No-Cost EMI Calculator */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB] uppercase tracking-wider">
            <CreditCard className="w-4 h-4" />
            <span>Zero Interest EMI Planner</span>
          </div>
          <h2 className="text-lg font-extrabold text-[#171717]">
            No-Cost Monthly EMI Calculator
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-[#171717] mb-1">
                Smartphone Price: {formatINR(emiPrice)}
              </label>
              <input
                type="range"
                min={10000}
                max={150000}
                step={5000}
                value={emiPrice}
                onChange={(e) => setEmiPrice(Number(e.target.value))}
                className="w-full accent-[#2563EB] mt-2"
              />
            </div>
            <div>
              <label className="block font-bold text-[#171717] mb-1">Tenure (Months)</label>
              <div className="flex gap-1.5">
                {[3, 6, 9, 12].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setEmiMonths(m)}
                    className={`flex-1 h-10 rounded-xl font-bold cursor-pointer ${
                      emiMonths === m
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-[#F5F6F8] text-[#171717]'
                    }`}
                  >
                    {m}M
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#F5F6F8] flex items-center justify-between">
            <div>
              <p className="text-xs text-[#737373]">Monthly No-Cost Installment ({emiMonths} Months)</p>
              <p className="text-xl font-extrabold text-[#171717] tabular-nums">
                {formatINR(emiPrice / emiMonths)} / month
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700">0% Extra Interest</span>
          </div>
        </div>
      </section>

      {/* Top Smartphone Price Drops */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Percent className="w-5 h-5 text-[#2563EB]" />
          <h2 className="text-lg sm:text-xl font-extrabold text-[#171717]">
            Biggest Smartphone Price Drops
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {smartphoneDeals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Accessories Combo Deals */}
      <section className="space-y-3">
        <h2 className="text-lg sm:text-xl font-extrabold text-[#171717]">
          Genuine Accessories &amp; Audio Deals
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {accessoryDeals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
