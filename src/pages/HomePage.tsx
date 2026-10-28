import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Headphones,
  MapPin,
  MessageCircle,
  RefreshCw,
  Search,
  Sparkles,
  Store,
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
    openWhatsAppEnquiry,
  } = useStore();
  const navigate = useNavigate();

  const activeBanners = banners.filter((b) => b.enabled);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [mobileSearch, setMobileSearch] = useState('');

  const currentBanner = activeBanners[bannerIndex % Math.max(1, activeBanners.length)] || banners[0];

  // Filtered product collections for the 20 homepage sections
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);
  const latest5G = products.filter((p) => p.is5G && p.category !== 'tablets').slice(0, 8);
  const newReleases = products.filter((p) => p.isNewRelease).slice(0, 8);
  const flagshipPhones = products.filter((p) => p.isFlagship || p.price >= 55000).slice(0, 8);
  const bestCameraPhones = products.filter((p) => p.isBestCamera).slice(0, 6);
  const midRangePhones = products
    .filter((p) => p.isMidRange || (p.price >= 20000 && p.price <= 50000))
    .slice(0, 6);
  const mobileAccessories = products.filter((p) =>
    ['chargers', 'power-banks', 'mobile-accessories', 'earbuds'].includes(p.category)
  );
  const smartwatches = products.filter((p) => p.category === 'smartwatches' || p.category === 'earbuds');
  const premiumGadgets = products.filter((p) =>
    ['tablets', 'smartwatches', 'earbuds'].includes(p.category)
  );

  const topBrands = [
    { name: 'Apple', slug: 'iphone', tagline: 'iPhone & iPad Pro', accent: '#1E293B' },
    { name: 'Samsung', slug: 'samsung', tagline: 'Galaxy AI Flagships', accent: '#1E3A8A' },
    { name: 'Vivo', slug: 'vivo', tagline: 'ZEISS Camera Pro', accent: '#2563EB' },
    { name: 'Oppo', slug: 'oppo', tagline: 'Find & Reno 5G', accent: '#0F766E' },
    { name: 'OnePlus', slug: 'oneplus', tagline: 'Snapdragon Elite', accent: '#B91C1C' },
    { name: 'Realme', slug: 'realme', tagline: 'GT Pro Performance', accent: '#C2410C' },
    { name: 'Redmi', slug: 'redmi', tagline: 'Note 14 5G Series', accent: '#334155' },
    { name: 'Motorola', slug: 'motorola', tagline: 'Pantone Edge 50', accent: '#4338CA' },
    { name: 'iQOO', slug: 'iqoo', tagline: 'Monster Gaming 5G', accent: '#18181B' },
    { name: 'Poco', slug: 'poco', tagline: 'F-Series Speed', accent: '#CA8A04' },
  ];

  const budgetRanges = [
    { label: 'Under ₹15,000', sub: 'Value 5G Phones', min: 0, max: 15000 },
    { label: '₹15,000 – ₹30,000', sub: 'All-Rounder 5G', min: 15000, max: 30000 },
    { label: '₹30,000 – ₹50,000', sub: 'Pro Camera & Gaming', min: 30000, max: 50000 },
    { label: '₹50,000 – ₹80,000', sub: 'Flagship Performance', min: 50000, max: 80000 },
    { label: 'Above ₹80,000', sub: 'Ultra Titanium Series', min: 80000, max: 250000 },
  ];

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(mobileSearch.trim())}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-10 pb-10">
      {/* Mobile Quick Search Bar */}
      <div className="md:hidden bg-[#101114] px-3 pt-2 pb-3 border-b border-white/10">
        <form onSubmit={handleMobileSearch} className="relative flex items-center">
          <input
            type="text"
            value={mobileSearch}
            onChange={(e) => setMobileSearch(e.target.value)}
            placeholder="Search smartphones, brands, accessories & offers..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-white text-sm text-[#171717] placeholder:text-[#737373] focus:outline-none"
          />
          <Search className="w-4 h-4 text-[#737373] absolute left-3.5" />
        </form>
      </div>

      {/* SECTION 1: Shop by Categories (Horizontal App-Like Carousel) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 pt-2 sm:pt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-extrabold text-[#171717]">
            Shop by Categories
          </h2>
          <Link
            to="/categories"
            className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1 whitespace-nowrap"
          >
            <span>View All ({categories.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex items-start gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center shrink-0 w-[76px] sm:w-[92px]"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-[#E5E7EB] group-hover:border-[#2563EB] p-1.5 flex items-center justify-center shadow-2xs transition-transform group-hover:-translate-y-0.5 overflow-hidden">
                <SmartImage
                  src={cat.image}
                  alt={cat.name}
                  brand={cat.name}
                  category={cat.slug}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="mt-1.5 text-[11px] sm:text-xs font-semibold text-[#171717] group-hover:text-[#2563EB] text-center leading-tight line-clamp-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* HERO SECTION: Poorvika-Inspired Flagship Campaign Showcase */}
      {currentBanner && (
        <section className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="relative rounded-3xl bg-[#101114] text-white overflow-hidden border border-white/10 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              {/* Left Copy */}
              <div className="lg:col-span-7 p-5 sm:p-8 lg:p-10 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#00C2FF]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{currentBanner.tag || 'CHARLIE MOBILE EXCLUSIVE'}</span>
                </div>
                <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-[1.12] text-balance">
                  {currentBanner.title}
                </h1>
                <p className="text-xs sm:text-sm lg:text-base text-slate-300 max-w-xl leading-relaxed">
                  {currentBanner.subtitle}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    to={currentBanner.ctaLink || '/products'}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <span>{currentBanner.ctaText || 'Shop Smartphones'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to={currentBanner.secondaryCtaLink || '/offers'}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <span>{currentBanner.secondaryCtaText || 'Explore Offers'}</span>
                  </Link>
                </div>

                {/* Banner Slide Controls */}
                {activeBanners.length > 1 && (
                  <div className="pt-2 flex items-center gap-2">
                    {activeBanners.map((b, idx) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBannerIndex(idx)}
                        aria-label={`Slide ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          idx === bannerIndex % activeBanners.length
                            ? 'w-7 bg-[#00C2FF]'
                            : 'w-2 bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Right Studio Product Visual */}
              <div className="lg:col-span-5 bg-gradient-to-b from-[#161922] to-[#101114] p-4 sm:p-6 flex items-center justify-center relative">
                <div className="w-full max-w-[300px] sm:max-w-[340px] aspect-square rounded-2xl overflow-hidden bg-white/5 p-2">
                  <SmartImage
                    src={currentBanner.image}
                    alt={currentBanner.title}
                    brand="Charlie Mobile"
                    category="smartphones"
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
                {activeBanners.length > 1 && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setBannerIndex(
                          (prev) => (prev - 1 + activeBanners.length) % activeBanners.length
                        )
                      }
                      aria-label="Previous banner"
                      className="w-8 h-8 rounded-lg bg-black/50 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setBannerIndex((prev) => (prev + 1) % activeBanners.length)}
                      aria-label="Next banner"
                      className="w-8 h-8 rounded-lg bg-black/50 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: Trending Categories (4 Spotlight Tiles) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-xl font-extrabold text-[#171717]">
            Trending Categories
          </h2>
          <span className="text-xs text-[#737373]">Most shopped this week</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              title: '5G Flagship Phones',
              sub: 'Up to ₹9,000 Exchange Bonus',
              slug: 'smartphones',
              bg: 'bg-gradient-to-br from-[#101114] to-[#1E293B] text-white',
            },
            {
              title: 'Apple iPhone Store',
              sub: 'iPhone 16 & 16 Pro Titanium',
              slug: 'iphone',
              bg: 'bg-white text-[#171717] border border-[#E5E7EB]',
            },
            {
              title: 'Smartwatches & Audio',
              sub: 'Watch Ultra 2 & ANC Earbuds',
              slug: 'smartwatches',
              bg: 'bg-white text-[#171717] border border-[#E5E7EB]',
            },
            {
              title: 'GaN Fast Chargers',
              sub: '100W PD & MagSafe Power Banks',
              slug: 'chargers',
              bg: 'bg-gradient-to-br from-[#1E3A8A] to-[#101114] text-white',
            },
          ].map((tile) => (
            <Link
              key={tile.title}
              to={`/products?category=${tile.slug}`}
              className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[115px] transition-transform hover:-translate-y-0.5 ${tile.bg}`}
            >
              <div>
                <h3 className="text-sm sm:text-base font-extrabold leading-snug">{tile.title}</h3>
                <p className="text-xs opacity-80 mt-1">{tile.sub}</p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs font-bold text-[#00C2FF]">
                <span>Explore Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 3: Best Selling Smartphones */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-[#171717]">
              Best Selling Smartphones
            </h2>
            <p className="text-xs text-[#737373]">Top customer favorites at Charlie Mobile</p>
          </div>
          <Link
            to="/products?sort=popularity"
            className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1 whitespace-nowrap"
          >
            <span>See All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {bestSellers.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 4: Latest 5G Smartphones (Horizontal App Carousel on Mobile, Grid on Desktop) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-[#171717]">
              Latest 5G Smartphones
            </h2>
            <p className="text-xs text-[#737373]">Ultra-fast 5G connectivity &amp; AI cameras</p>
          </div>
          <Link
            to="/products?5g=true"
            className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1 whitespace-nowrap"
          >
            <span>View All 5G</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="flex lg:grid lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2">
          {latest5G.slice(0, 4).map((product) => (
            <div key={product.id} className="w-[210px] sm:w-[240px] lg:w-auto shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: Shop by Budget */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-xl font-extrabold text-[#171717]">
                Shop Smartphones by Budget
              </h2>
              <p className="text-xs text-[#737373]">
                Find the right phone for every price point with No-Cost EMI
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
            {budgetRanges.map((b) => (
              <Link
                key={b.label}
                to={`/products?minPrice=${b.min}&maxPrice=${b.max}`}
                className="group rounded-xl border border-[#E5E7EB] hover:border-[#2563EB] bg-[#F5F6F8]/60 hover:bg-blue-50/40 p-3.5 transition-colors flex flex-col justify-between"
              >
                <span className="text-xs text-[#737373] font-medium">{b.sub}</span>
                <span className="mt-1 text-sm sm:text-base font-extrabold text-[#171717] group-hover:text-[#2563EB] tabular-nums">
                  {b.label}
                </span>
                <span className="mt-2 text-[11px] font-bold text-[#2563EB] flex items-center gap-1">
                  Shop Range <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 & 7: Top Smartphone Brands + Featured Categories */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-[#171717]">
              Top Smartphone Brands
            </h2>
            <p className="text-xs text-[#737373]">
              Authorized multi-brand partner with official brand warranty
            </p>
          </div>
          <Link
            to="/categories"
            className="text-xs font-bold text-[#2563EB] hover:underline whitespace-nowrap"
          >
            All Brands
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
          {topBrands.map((brand) => (
            <Link
              key={brand.name}
              to={`/products?brand=${encodeURIComponent(brand.name)}`}
              className="group bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#2563EB] p-3.5 flex items-center justify-between gap-2 transition-transform hover:-translate-y-0.5"
            >
              <div>
                <p className="text-sm font-extrabold text-[#171717] group-hover:text-[#2563EB]">
                  {brand.name}
                </p>
                <p className="text-[11px] text-[#737373] truncate">{brand.tagline}</p>
              </div>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-extrabold shrink-0"
                style={{ backgroundColor: brand.accent }}
              >
                {brand.name.slice(0, 1)}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 8 & 9: New Releases & Flagship Smartphones */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-[#171717]">
              New Releases &amp; Flagship Smartphones
            </h2>
            <p className="text-xs text-[#737373]">
              Experience Titanium builds, Snapdragon 8 Elite &amp; Apple A18 Pro
            </p>
          </div>
          <Link
            to="/products?sort=newest"
            className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1 whitespace-nowrap"
          >
            <span>Explore Flagships</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {(newReleases.length >= 4 ? newReleases : flagshipPhones).slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 10 & 11: Best Camera Smartphones & Best Mid-Range Smartphones */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Camera Smartphones */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#171717]">
                Best Camera Smartphones
              </h2>
              <p className="text-xs text-[#737373]">ZEISS Optics, Hasselblad &amp; 200MP Periscope</p>
            </div>
            <Link
              to="/products?category=smartphones"
              className="text-xs font-bold text-[#2563EB] hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {bestCameraPhones.slice(0, 2).map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </div>

        {/* Best Mid-Range Smartphones */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#171717]">
                Best Mid-Range 5G Smartphones
              </h2>
              <p className="text-xs text-[#737373]">Flagship killers between ₹20,000 – ₹50,000</p>
            </div>
            <Link
              to="/products?minPrice=20000&maxPrice=50000"
              className="text-xs font-bold text-[#2563EB] hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {midRangePhones.slice(0, 2).map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 12 & 13: Mobile Accessories & Accessories by Brand */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-[#171717]">
              Mobile Accessories &amp; Fast Chargers
            </h2>
            <p className="text-xs text-[#737373]">
              Original adapters, 20000mAh PD power banks, MagSafe armor cases &amp; audio
            </p>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {['Apple', 'Samsung', 'OnePlus'].map((b) => (
              <Link
                key={b}
                to={`/products?brand=${b}`}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E7EB] hover:border-[#2563EB] text-xs font-semibold text-[#171717] whitespace-nowrap"
              >
                {b} Accessories
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {mobileAccessories.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 14 & 15: Smartwatches, Wearables & Premium Gadgets */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-[#171717]">
              Smartwatches, Tablets &amp; Premium Gadgets
            </h2>
            <p className="text-xs text-[#737373]">
              Apple Watch Ultra 2, Galaxy Watch 7, iPad Pro M4 &amp; Pro Earbuds
            </p>
          </div>
          <Link
            to="/products?category=smartwatches"
            className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1 whitespace-nowrap"
          >
            <span>All Wearables</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {(premiumGadgets.length >= 4 ? premiumGadgets : smartwatches)
            .slice(0, 4)
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>

      {/* SECTION 16 & 17: Exchange Offers & EMI Offers */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-[#101114] text-white p-5 sm:p-6 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#00C2FF] uppercase tracking-wider">
                <RefreshCw className="w-4 h-4" />
                <span>Instant Old-Phone Exchange</span>
              </div>
              <h3 className="mt-2 text-lg sm:text-xl font-extrabold">
                Get Up to {formatINR(9000)} Extra Exchange Bonus
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Upgrade your old 4G or 5G smartphone at Charlie Mobile &amp; Accessories. Instant on-the-spot valuation with immediate deduction from your new phone price.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Link
                to="/offers"
                className="min-h-[40px] px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <span>Calculate Exchange Value</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-white text-[#171717] p-5 sm:p-6 border border-[#E5E7EB] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                <CreditCard className="w-4 h-4" />
                <span>Zero Down-Payment &amp; No-Cost EMI</span>
              </div>
              <h3 className="mt-2 text-lg sm:text-xl font-extrabold">
                Easy Monthly Installments Starting at {formatINR(699)}/mo
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-[#737373] leading-relaxed">
                Flexible 3, 6, 9, and 12-month No-Cost EMI options across leading bank credit cards, debit card EMI, and in-store paperless finance at Charlie Mobile.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Link
                to="/offers"
                className="min-h-[40px] px-4 py-2 rounded-xl bg-[#101114] hover:bg-[#2563EB] text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>View EMI Plans &amp; Coupons</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 18 & 19: Store Information & Customer Support */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5 bg-[#101114] p-4 flex items-center justify-center">
            <img
              src={generateStoreShowroomSvg('storefront')}
              alt="Charlie Mobile & Accessories Showroom"
              className="w-full h-full max-h-[260px] object-contain rounded-2xl"
            />
          </div>
          <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                <Store className="w-4 h-4" />
                <span>Official Retail Showroom</span>
              </div>
              <h2 className="mt-1 text-xl sm:text-2xl font-extrabold text-[#171717]">
                {storeSettings.businessName}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#737373]">
                Experience live demo units of the latest smartphones, smartwatches, and audio gear, or reserve online for 30-minute express store pickup.
              </p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#171717]">
                <div className="flex items-start gap-2 bg-[#F5F6F8] p-3 rounded-xl">
                  <MapPin className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <span>{storeSettings.address}</span>
                </div>
                <div className="flex items-start gap-2 bg-[#F5F6F8] p-3 rounded-xl">
                  <Headphones className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <span>{storeSettings.openingHours}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/store"
                className="min-h-[42px] px-4 py-2 rounded-xl bg-[#101114] hover:bg-[#2563EB] text-white text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Store className="w-4 h-4" />
                <span>Store Photos &amp; Directions</span>
              </Link>
              <button
                type="button"
                onClick={() => openWhatsAppEnquiry({})}
                className="min-h-[42px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Customer Support</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
