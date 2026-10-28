import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Flame,
  Headphones,
  MapPin,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Store,
  Zap,
} from 'lucide-react';
import { formatINR, useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { SmartImage } from '../components/SmartImage';
import { generateStoreShowroomSvg } from '../utils/productVisuals';

export const HomePage: React.FC = () => {
  const {
    products,
    categories,
    banners,
    storeSettings,
    homepageSections,
    openWhatsAppEnquiry,
  } = useStore();

  const getSection = (id: string, fallbackTitle: string) => {
    const found = homepageSections.find((s) => s.id === id);
    return {
      enabled: found ? found.enabled : true,
      title: found?.title || fallbackTitle,
    };
  };

  const activeBanners = banners.filter((b) => b.enabled);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [selectedBrandTab, setSelectedBrandTab] = useState<string>('All');
  const [cameraOrMidTab, setCameraOrMidTab] = useState<'camera' | 'midrange'>('camera');
  const [accessoryBrandTab, setAccessoryBrandTab] = useState<string>('All');

  const currentBanner =
    activeBanners[bannerIndex % Math.max(1, activeBanners.length)] || banners[0];

  // Filtered product collections
  const bestSellers = products.filter((p) => p.isBestSeller);
  const brandFilteredBestSellers =
    selectedBrandTab === 'All'
      ? bestSellers
      : products.filter((p) => p.brand.toLowerCase() === selectedBrandTab.toLowerCase());

  const latest5G = products.filter((p) => p.is5G && p.category !== 'tablets');
  const newReleases = products.filter((p) => p.isNewRelease);
  const flagshipPhones = products.filter((p) => p.isFlagship || p.price >= 55000);
  const bestCameraPhones = products.filter((p) => p.isBestCamera);
  const midRangePhones = products.filter(
    (p) => p.isMidRange || (p.price >= 20000 && p.price <= 50000)
  );
  const allAccessories = products.filter((p) =>
    ['chargers', 'power-banks', 'mobile-accessories', 'earbuds'].includes(p.category)
  );
  const filteredAccessories =
    accessoryBrandTab === 'All'
      ? allAccessories
      : allAccessories.filter((p) => p.brand.toLowerCase() === accessoryBrandTab.toLowerCase());

  const smartwatchesAndGadgets = products.filter((p) =>
    ['smartwatches', 'tablets', 'earbuds'].includes(p.category)
  );

  const topBrands = [
    { name: 'Apple', slug: 'iphone', tagline: 'iPhone & iPad', color: '#101114' },
    { name: 'Samsung', slug: 'samsung', tagline: 'Galaxy AI', color: '#1E3A8A' },
    { name: 'Vivo', slug: 'vivo', tagline: 'ZEISS Camera', color: '#2563EB' },
    { name: 'Oppo', slug: 'oppo', tagline: 'Find & Reno', color: '#047857' },
    { name: 'OnePlus', slug: 'oneplus', tagline: 'Never Settle', color: '#B91C1C' },
    { name: 'Realme', slug: 'realme', tagline: 'GT Series', color: '#C2410C' },
    { name: 'Redmi', slug: 'redmi', tagline: 'Note 14 5G', color: '#334155' },
    { name: 'Motorola', slug: 'motorola', tagline: 'Edge 50 Pro', color: '#4338CA' },
    { name: 'iQOO', slug: 'iqoo', tagline: 'Monster 5G', color: '#18181B' },
    { name: 'Poco', slug: 'poco', tagline: 'F-Series', color: '#CA8A04' },
  ];

  const budgetBrackets = [
    { label: 'Under ₹15,000', tag: 'Entry 5G', min: 0, max: 15000, accent: 'from-blue-600 to-blue-800' },
    { label: '₹15K – ₹30K', tag: 'Best Value', min: 15000, max: 30000, accent: 'from-slate-800 to-slate-950' },
    { label: '₹30K – ₹50K', tag: 'Pro Camera', min: 30000, max: 50000, accent: 'from-indigo-700 to-slate-900' },
    { label: '₹50K – ₹80K', tag: 'Flagship 5G', min: 50000, max: 80000, accent: 'from-blue-700 to-slate-950' },
    { label: 'Above ₹80,000', tag: 'Ultra Titanium', min: 80000, max: 250000, accent: 'from-[#101114] to-[#1E293B]' },
  ];

  return (
    <div className="space-y-5 sm:space-y-8 pb-8">
      {/* POORVIKA MOBILE PATTERN 1: Horizontal App-Story Category Strip */}
      <section className="bg-white border-b border-[#E5E7EB] py-3">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-start gap-3 sm:gap-5 overflow-x-auto no-scrollbar snap-x">
            {categories.map((cat, idx) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center shrink-0 w-[68px] sm:w-[84px] snap-start"
              >
                <div
                  className={`w-15 h-15 sm:w-18 sm:h-18 rounded-2xl p-[2px] transition-transform duration-150 group-hover:scale-105 ${
                    idx < 4
                      ? 'bg-gradient-to-tr from-[#2563EB] to-[#00C2FF]'
                      : 'bg-[#E5E7EB] group-hover:bg-[#2563EB]'
                  }`}
                >
                  <div className="w-full h-full rounded-[14px] bg-[#F8FAFC] p-1.5 flex items-center justify-center overflow-hidden">
                    <SmartImage
                      src={cat.image}
                      alt={cat.name}
                      brand={cat.name}
                      category={cat.slug}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <span className="mt-1.5 text-[11px] sm:text-xs font-bold text-[#171717] group-hover:text-[#2563EB] text-center leading-tight line-clamp-1">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* POORVIKA MOBILE PATTERN 2: Hero Campaign Banner + Bank Cashback Strip */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 space-y-2.5">
        {currentBanner && (
          <div className="relative rounded-2xl sm:rounded-3xl bg-[#101114] text-white overflow-hidden border border-white/10 shadow-md">
            <div className="grid grid-cols-12 items-center">
              {/* Mobile & Desktop Split Copy */}
              <div className="col-span-7 sm:col-span-7 p-4 sm:p-8 lg:p-10 space-y-2 sm:space-y-3.5">
                <div className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-extrabold tracking-wider uppercase text-[#00C2FF]">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>{currentBanner.tag || 'CHARLIE MOBILE EXCLUSIVE'}</span>
                </div>
                <h1 className="text-base sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                  {currentBanner.title}
                </h1>
                <p className="text-[11px] sm:text-sm text-slate-300 line-clamp-2 sm:line-clamp-none max-w-lg leading-relaxed">
                  {currentBanner.subtitle}
                </p>
                <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-2">
                  <Link
                    to={currentBanner.ctaLink || '/products'}
                    className="h-9 sm:h-11 px-3.5 sm:px-5 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white text-[11px] sm:text-sm font-extrabold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    <span>{currentBanner.ctaText || 'Shop Smartphones'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to={currentBanner.secondaryCtaLink || '/offers'}
                    className="hidden sm:inline-flex h-11 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs sm:text-sm font-bold items-center whitespace-nowrap"
                  >
                    {currentBanner.secondaryCtaText || 'Explore Offers'}
                  </Link>
                </div>

                {/* Slide Indicators */}
                {activeBanners.length > 1 && (
                  <div className="pt-1 flex items-center gap-1.5">
                    {activeBanners.map((b, idx) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBannerIndex(idx)}
                        aria-label={`Banner ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          idx === bannerIndex % activeBanners.length
                            ? 'w-6 bg-[#00C2FF]'
                            : 'w-1.5 bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Right Product Showcase Visual */}
              <div className="col-span-5 sm:col-span-5 bg-gradient-to-b from-[#1A1F2E] to-[#101114] p-2 sm:p-6 flex items-center justify-center relative h-full">
                <div className="w-full max-w-[160px] sm:max-w-[300px] aspect-square flex items-center justify-center">
                  <SmartImage
                    src={currentBanner.image}
                    alt={currentBanner.title}
                    brand="Charlie Mobile"
                    category="smartphones"
                    className="w-full h-full object-contain"
                  />
                </div>
                {activeBanners.length > 1 && (
                  <div className="hidden sm:flex absolute bottom-3 right-3 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setBannerIndex(
                          (prev) => (prev - 1 + activeBanners.length) % activeBanners.length
                        )
                      }
                      aria-label="Previous slide"
                      className="w-8 h-8 rounded-lg bg-black/50 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setBannerIndex((prev) => (prev + 1) % activeBanners.length)}
                      aria-label="Next slide"
                      className="w-8 h-8 rounded-lg bg-black/50 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Poorvika-Style Instant Bank Cashback & EMI Partner Strip */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-2.5 sm:p-3.5 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center font-extrabold text-xs">
              %
            </div>
            <div>
              <p className="text-xs font-extrabold text-[#171717] whitespace-nowrap">
                {storeSettings.bankOfferTitle ||
                  'Instant Bank Cashback & Zero Down-Payment EMI'}
              </p>
              <p className="text-[11px] text-[#737373] whitespace-nowrap">
                {storeSettings.bankOfferSubtitle ||
                  'HDFC · ICICI · SBI · Axis · Bajaj Finserv · IDFC First'}
              </p>
            </div>
          </div>
          <Link
            to="/offers"
            className="px-3 py-1.5 rounded-xl bg-[#F5F6F8] hover:bg-blue-50 text-[#2563EB] text-xs font-extrabold shrink-0 flex items-center gap-1"
          >
            <span>Check Eligibility</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* POORVIKA MOBILE PATTERN 3: Trending Categories (4 Compact Visual Tiles) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {[
            {
              title: '5G Mobiles',
              sub: 'Up to ₹9,000 Exchange Bonus',
              slug: 'smartphones',
              theme: 'bg-[#101114] text-white',
            },
            {
              title: 'iPhone Fest',
              sub: 'iPhone 16 & 16 Pro Max',
              slug: 'iphone',
              theme: 'bg-white text-[#171717] border border-[#E5E7EB]',
            },
            {
              title: 'Watches & Buds',
              sub: 'Up to 45% Off Wearables',
              slug: 'smartwatches',
              theme: 'bg-white text-[#171717] border border-[#E5E7EB]',
            },
            {
              title: 'GaN Chargers',
              sub: '100W Adapters & Power Banks',
              slug: 'chargers',
              theme: 'bg-[#1E3A8A] text-white',
            },
          ].map((item) => (
            <Link
              key={item.title}
              to={`/products?category=${item.slug}`}
              className={`rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between transition-transform active:scale-[0.99] ${item.theme}`}
            >
              <div>
                <h3 className="text-sm sm:text-base font-extrabold">{item.title}</h3>
                <p className="text-[11px] opacity-80 mt-0.5">{item.sub}</p>
              </div>
              <span className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-extrabold text-[#00C2FF]">
                Shop Now <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* POORVIKA MOBILE PATTERN 4: Best Selling Smartphones with Brand Filter Pills + Horizontal Rail */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#2563EB]" />
            <div>
              <h2 className="text-base sm:text-xl font-extrabold text-[#171717] leading-tight">
                {getSection('best_selling', 'Best Selling Smartphones').title}
              </h2>
              <p className="text-[11px] sm:text-xs text-[#737373]">
                Most popular deals at {storeSettings.storeName} today
              </p>
            </div>
          </div>
          <Link
            to="/products?sort=popularity"
            className="text-xs font-extrabold text-[#2563EB] flex items-center gap-1 shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Interactive Brand Filter Tabs (Poorvika Mobile Signature) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {['All', 'Apple', 'Samsung', 'Vivo', 'OnePlus', 'Redmi', 'Realme', 'iQOO'].map(
            (brandName) => (
              <button
                key={brandName}
                type="button"
                onClick={() => setSelectedBrandTab(brandName)}
                className={`h-8 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  selectedBrandTab === brandName
                    ? 'bg-[#101114] text-white'
                    : 'bg-white border border-[#E5E7EB] text-[#171717] hover:border-[#2563EB]'
                }`}
              >
                {brandName}
              </button>
            )
          )}
        </div>

        {/* Horizontal Snap-Scroll Rail on Mobile, 4-Col Grid on Desktop */}
        <div className="flex lg:grid lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
          {(brandFilteredBestSellers.length > 0 ? brandFilteredBestSellers : bestSellers)
            .slice(0, 6)
            .map((product) => (
              <div
                key={product.id}
                className="w-[172px] sm:w-[220px] lg:w-auto shrink-0 snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))}
        </div>
      </section>

      {/* POORVIKA MOBILE PATTERN 5: Shop by Budget Strip */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#171717]">
                Shop Smartphones by Price
              </h2>
              <p className="text-[11px] sm:text-xs text-[#737373]">
                Pick your budget — No-Cost EMI available on every range
              </p>
            </div>
          </div>

          <div className="flex sm:grid sm:grid-cols-5 gap-2.5 overflow-x-auto no-scrollbar snap-x">
            {budgetBrackets.map((b) => (
              <Link
                key={b.label}
                to={`/products?minPrice=${b.min}&maxPrice=${b.max}`}
                className={`w-[140px] sm:w-auto shrink-0 snap-start rounded-2xl bg-gradient-to-br ${b.accent} text-white p-3.5 flex flex-col justify-between min-h-[88px] shadow-xs`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00C2FF]">
                  {b.tag}
                </span>
                <span className="text-sm sm:text-base font-extrabold tabular-nums mt-1">
                  {b.label}
                </span>
                <span className="text-[10px] text-slate-300 flex items-center gap-1 mt-1.5">
                  Explore <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* POORVIKA MOBILE PATTERN 6: Latest 5G Smartphones Rail */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-[#171717]">
              {getSection('latest_5g', 'Latest 5G Smartphones').title}
            </h2>
            <p className="text-[11px] sm:text-xs text-[#737373]">
              Next-gen 5G speeds with flagship processors
            </p>
          </div>
          <Link
            to="/products?5g=true"
            className="text-xs font-extrabold text-[#2563EB] flex items-center gap-1 shrink-0"
          >
            <span>See All 5G</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex lg:grid lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
          {latest5G.slice(0, 6).map((product) => (
            <div
              key={product.id}
              className="w-[172px] sm:w-[220px] lg:w-auto shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* POORVIKA MOBILE PATTERN 7: Top Smartphone Brands Grid */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-[#171717]">
              Shop by Official Brand Store
            </h2>
            <p className="text-[11px] sm:text-xs text-[#737373]">
              100% Sealed Devices with Brand Manufacturer Warranty
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {topBrands.map((brand) => (
            <Link
              key={brand.name}
              to={`/products?brand=${encodeURIComponent(brand.name)}`}
              className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#2563EB] p-3 flex items-center justify-between gap-2 transition-all"
            >
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-extrabold text-[#171717] truncate">
                  {brand.name}
                </p>
                <p className="text-[10px] text-[#737373] truncate">{brand.tagline}</p>
              </div>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-extrabold shrink-0"
                style={{ backgroundColor: brand.color }}
              >
                {brand.name.slice(0, 1)}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* POORVIKA MOBILE PATTERN 8: Dark Flagship & New Releases Spotlight */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="rounded-3xl bg-[#101114] p-4 sm:p-6 space-y-4 border border-white/10">
          <div className="flex items-center justify-between text-white">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00C2FF]">
                FLAGSHIP TITANIUM ZONE
              </span>
              <h2 className="text-base sm:text-xl font-extrabold">
                New Releases &amp; Ultra Flagships
              </h2>
            </div>
            <Link
              to="/products?sort=newest"
              className="text-xs font-bold text-[#00C2FF] flex items-center gap-1 shrink-0"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex lg:grid lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
            {(newReleases.length >= 4 ? newReleases : flagshipPhones)
              .slice(0, 4)
              .map((product) => (
                <div
                  key={product.id}
                  className="w-[172px] sm:w-[220px] lg:w-auto shrink-0 snap-start"
                >
                  <ProductCard product={product} />
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* POORVIKA MOBILE PATTERN 9: Interactive Tabbed Section — Best Camera vs Best Mid-Range */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#E5E7EB] self-start">
            <button
              type="button"
              onClick={() => setCameraOrMidTab('camera')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-colors cursor-pointer ${
                cameraOrMidTab === 'camera'
                  ? 'bg-[#2563EB] text-white'
                  : 'text-[#171717] hover:bg-slate-100'
              }`}
            >
              Best Camera Phones
            </button>
            <button
              type="button"
              onClick={() => setCameraOrMidTab('midrange')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-colors cursor-pointer ${
                cameraOrMidTab === 'midrange'
                  ? 'bg-[#2563EB] text-white'
                  : 'text-[#171717] hover:bg-slate-100'
              }`}
            >
              Best Mid-Range (₹20K–₹50K)
            </button>
          </div>
          <Link
            to="/products?category=smartphones"
            className="text-xs font-extrabold text-[#2563EB] flex items-center gap-1"
          >
            <span>View Full Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex lg:grid lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
          {(cameraOrMidTab === 'camera' ? bestCameraPhones : midRangePhones)
            .slice(0, 4)
            .map((product) => (
              <div
                key={product.id}
                className="w-[172px] sm:w-[220px] lg:w-auto shrink-0 snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))}
        </div>
      </section>

      {/* POORVIKA MOBILE PATTERN 10: Smartwatches, Tablets & Audio Wearables */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-[#171717]">
              Smartwatches, Tablets &amp; TWS Earbuds
            </h2>
            <p className="text-[11px] sm:text-xs text-[#737373]">
              Apple Watch Ultra 2, Galaxy Watch 7, iPad Pro M4 &amp; ANC Buds
            </p>
          </div>
          <Link
            to="/products?category=smartwatches"
            className="text-xs font-extrabold text-[#2563EB] flex items-center gap-1 shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex lg:grid lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
          {smartwatchesAndGadgets.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="w-[172px] sm:w-[220px] lg:w-auto shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* POORVIKA MOBILE PATTERN 11: Mobile Accessories & Accessories by Brand */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-[#171717]">
              Mobile Accessories, GaN Chargers &amp; Power Banks
            </h2>
            <p className="text-[11px] sm:text-xs text-[#737373]">
              Original adapters, 20000mAh PD banks, Kevlar MagSafe cases &amp; audio
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['All', 'Apple', 'Samsung', 'OnePlus'].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setAccessoryBrandTab(b)}
                className={`h-8 px-3 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                  accessoryBrandTab === b
                    ? 'bg-[#101114] text-white'
                    : 'bg-white border border-[#E5E7EB] text-[#171717]'
                }`}
              >
                {b === 'All' ? 'All Brands' : `${b} Gear`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex lg:grid lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
          {(filteredAccessories.length > 0 ? filteredAccessories : allAccessories)
            .slice(0, 4)
            .map((product) => (
              <div
                key={product.id}
                className="w-[172px] sm:w-[220px] lg:w-auto shrink-0 snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))}
        </div>
      </section>

      {/* POORVIKA MOBILE PATTERN 12: Exchange & EMI Value Banners */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-2xl bg-[#101114] text-white p-4 sm:p-6 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#00C2FF] uppercase tracking-wider">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Charlie Mobile Smart Exchange</span>
              </div>
              <h3 className="mt-1.5 text-base sm:text-xl font-extrabold">
                Trade In Your Old Phone — Get Up to{' '}
                {formatINR(storeSettings.exchangeMaxBonus || 9000)} Bonus
              </h3>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                Instant evaluation in 2 minutes. Upgrade from any old 4G/5G device right at our counter or during doorstep delivery.
              </p>
            </div>
            <div className="mt-3.5">
              <Link
                to="/offers"
                className="inline-flex h-9 px-4 rounded-xl bg-[#2563EB] text-white text-xs font-bold items-center gap-1.5"
              >
                <span>Check Exchange Value</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-white text-[#171717] p-4 sm:p-6 border border-[#E5E7EB] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#2563EB] uppercase tracking-wider">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Paperless Instant Finance</span>
              </div>
              <h3 className="mt-1.5 text-base sm:text-xl font-extrabold">
                No-Cost EMI Starting at {formatINR(storeSettings.emiStartingPrice || 699)}/Month
              </h3>
              <p className="mt-1 text-xs text-[#737373] leading-relaxed">
                Available on Credit Cards, Debit Card EMI, and in-store consumer finance with zero processing fee on flagship phones.
              </p>
            </div>
            <div className="mt-3.5">
              <Link
                to="/offers"
                className="inline-flex h-9 px-4 rounded-xl bg-[#101114] text-white text-xs font-bold items-center gap-1.5"
              >
                <span>Calculate Monthly EMI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* POORVIKA MOBILE PATTERN 13: Physical Store & Customer Care Showcase */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5 bg-[#101114] p-3 sm:p-4 flex items-center justify-center">
            <img
              src={
                storeSettings.showroomPhotos && storeSettings.showroomPhotos.length > 0
                  ? storeSettings.showroomPhotos[0].src
                  : generateStoreShowroomSvg('storefront')
              }
              alt="Charlie Mobile & Accessories Showroom"
              className="w-full max-h-[220px] object-contain rounded-2xl"
            />
          </div>
          <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#2563EB] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Authorized Retail Showroom</span>
              </div>
              <h2 className="mt-1 text-lg sm:text-2xl font-extrabold text-[#171717]">
                {storeSettings.businessName}
              </h2>
              <p className="mt-1 text-xs text-[#737373] leading-relaxed">
                Visit our physical showroom to experience live demo devices, get free screen guard installation, instant data transfer, and 30-minute Store Pickup.
              </p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#F5F6F8] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span className="truncate font-medium">{storeSettings.address}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F5F6F8] flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span className="truncate font-medium">{storeSettings.openingHours}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <Link
                to="/store"
                className="h-10 px-4 rounded-xl bg-[#101114] hover:bg-[#2563EB] text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Store className="w-4 h-4" />
                <span>Store Photos &amp; Directions</span>
              </Link>
              <button
                type="button"
                onClick={() => openWhatsAppEnquiry({})}
                className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Store Desk</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
