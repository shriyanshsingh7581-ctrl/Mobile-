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
    (p) => p.isMidRange || (p.price >= 15000 && p.price <= 58000)
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

  // Real Poorvika Mobile Brand Badges (El[9])
  const poorvikaMobileBrands = [
    {
      name: 'Apple',
      img: 'https://img-prd-pim.poorvika.com/pageimg/Apple-Mobile-and-Accessories-2026-mob.webp',
      link: '/products?brand=Apple',
    },
    {
      name: 'Samsung',
      img: 'https://img-prd-pim.poorvika.com/pageimg/Samsung-Mobile-and-Accessories-2026-mob.webp',
      link: '/products?brand=Samsung',
    },
    {
      name: 'Vivo',
      img: 'https://img-prd-pim.poorvika.com/pageimg/Vivo-Mobile-and-Accessories-2026-mob.webp',
      link: '/products?brand=Vivo',
    },
    {
      name: 'Oppo',
      img: 'https://img-prd-pim.poorvika.com/pageimg/Oppo-Mobile-and-Accessories-2026-mob.webp',
      link: '/products?brand=Oppo',
    },
    {
      name: 'Redmi',
      img: 'https://img-prd-pim.poorvika.com/pageimg/MI-Mobile-and-Accessories-2026-mob.webp',
      link: '/products?brand=Redmi',
    },
    {
      name: 'Realme',
      img: 'https://img-prd-pim.poorvika.com/pageimg/Realme-Mobile-and-Accessories-2026-mob.webp',
      link: '/products?brand=Realme',
    },
    {
      name: 'Nothing',
      img: 'https://img-prd-pim.poorvika.com/pageimg/Nothing-Mobile-and-Accessories-2026-mob.webp',
      link: '/products?brand=Nothing',
    },
    {
      name: 'Google',
      img: 'https://img-prd-pim.poorvika.com/pageimg/Google-Mobile-and-Accessories-2026-mob.webp',
      link: '/products?brand=Google',
    },
    {
      name: 'Xiaomi',
      img: 'https://img-prd-pim.poorvika.com/pageimg/Xiaomi-Mobile-and-Accessories-2026-mob.webp',
      link: '/products?brand=Xiaomi',
    },
    {
      name: 'OnePlus',
      img: 'https://img-prd-pim.poorvika.com/pageimg/Oneplus-Accessories-mobile-2026.webp',
      link: '/products?brand=OnePlus',
    },
  ];

  // Real Poorvika Budget Brackets (El[14])
  const poorvikaBudgetCards = [
    {
      label: '₹10,000 – ₹14,999',
      min: 0,
      max: 15000,
      img: 'https://img-prd-pim.poorvika.com/pageimg/10k-to-14999-Mobile-and-Accessories-2026-mob.webp',
    },
    {
      label: '₹15,000 – ₹19,999',
      min: 15000,
      max: 20000,
      img: 'https://img-prd-pim.poorvika.com/pageimg/15k-to-19999-Mobile-and-Accessories-2026-mob.webp',
    },
    {
      label: '₹20,000 – ₹29,999',
      min: 20000,
      max: 30000,
      img: 'https://img-prd-pim.poorvika.com/pageimg/20k-to-29999-Mobile-and-Accessories-2026-mob.webp',
    },
    {
      label: '₹30,000 – ₹49,999',
      min: 30000,
      max: 50000,
      img: 'https://img-prd-pim.poorvika.com/pageimg/30k-to-49999-Mobile-and-Accessories-2026-mob.webp',
    },
    {
      label: '₹50,000 – ₹74,999',
      min: 50000,
      max: 75000,
      img: 'https://img-prd-pim.poorvika.com/pageimg/50k-to-74999-Mobile-and-Accessories-2026-mob.webp',
    },
    {
      label: '₹75,000 – ₹99,999',
      min: 75000,
      max: 100000,
      img: 'https://img-prd-pim.poorvika.com/pageimg/75k-to-99999-Mobile-and-Accessories-2026-mob.webp',
    },
    {
      label: 'Above ₹1,00,000',
      min: 100000,
      max: 300000,
      img: 'https://img-prd-pim.poorvika.com/pageimg/Above-1L-Mobile-and-Accessories-2026-mob.webp',
    },
  ];

  // Real Poorvika New Release Launch Posters (El[28])
  const poorvikaNewReleasePosters = [
    {
      title: 'iPhone 17 Series',
      img: 'https://img-prd-pim.poorvika.com/pageimg/Iphone-17-Series-Mobile-and-Accessories-Mob.webp',
      link: '/products?category=iphone',
    },
    {
      title: 'Galaxy S26 Ultra 5G',
      img: 'https://img-prd-pim.poorvika.com/pageimg/Samsung-S26-Ultra-Mobile-and-Accessories-2026-Mob.webp',
      link: '/product/prod_samsung_s26_ultra',
    },
    {
      title: 'Galaxy Z Fold8 Ultra 5G',
      img: 'https://img-prd-pim.poorvika.com/pageimg/Galaxy-Z-Fold8-Ultra-5G-Mobile-and-Accessories-2026-Mob.webp',
      link: '/product/prod_samsung_z_fold8_ultra',
    },
    {
      title: 'Nothing Phone (4b) 5G',
      img: 'https://img-prd-pim.poorvika.com/pageimg/Nothing-4B-5G-Mobile-and-Accessories-2026-Mob.webp',
      link: '/product/prod_nothing_phone_4b',
    },
    {
      title: 'Oppo Reno 16c 5G',
      img: 'https://img-prd-pim.poorvika.com/pageimg/Oppo-Reno-16C-5G-Mobile-and-Accessories-2026-Mob.webp',
      link: '/product/prod_oppo_reno_16c',
    },
    {
      title: 'OnePlus N6x 5G',
      img: 'https://img-prd-pim.poorvika.com/pageimg/Oneplus-N6x-5G-Mobile-and-Accessories-2026-Mob.webp',
      link: '/product/prod_oneplus_n6x_5g',
    },
  ];

  // Real Poorvika Accessory Brand Tiles (El[32])
  const poorvikaAccessoryBrands = [
    {
      name: 'Apple',
      img: 'https://img-prd-pim.poorvika.com/pageimg/Apple-Accessories-Mobile-and-Accessories-2026-mob.webp',
      link: '/products?brand=Apple',
    },
    {
      name: 'Samsung',
      img: 'https://img-prd-pim.poorvika.com/pageimg/Samsung-Accessories-Mobile-and-Accessories-2026-mob.webp',
      link: '/products?brand=Samsung',
    },
    {
      name: 'MI / Xiaomi',
      img: 'https://img-prd-pim.poorvika.com/pageimg/MI-Accessories-Mobile-and-Accessories-2026-mob.webp',
      link: '/products?brand=Xiaomi',
    },
    {
      name: 'Boat',
      img: 'https://img-prd-pim.poorvika.com/pageimg/Boat-Accessories-Mobile-and-Accessories-2026-mob.webp',
      link: '/products?brand=Boat',
    },
    {
      name: 'OnePlus',
      img: 'https://img-prd-pim.poorvika.com/pageimg/Oneplus-Accessories-mobile-2026.webp',
      link: '/products?brand=OnePlus',
    },
    {
      name: 'Yarr',
      img: 'https://img-prd-pim.poorvika.com/pageimg/Yarr-Accessories-Mobile-and-Accessories-2026-mob.webp',
      link: '/products?brand=Yarr',
    },
    {
      name: 'Realme',
      img: 'https://img-prd-pim.poorvika.com/pageimg/Realme-Accessories-Mobile-and-Accessories-2026-mob.webp',
      link: '/products?brand=Realme',
    },
    {
      name: 'Sandisk',
      img: 'https://img-prd-pim.poorvika.com/pageimg/Sandisk-Accessories-Mobile-and-Accessories-2026-mob.webp',
      link: '/products?category=mobile-accessories',
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-7 pb-8">
      {/* POORVIKA PATTERN 1: Top Category Icon Carousel (El[4] Style) */}
      <section className="bg-white border-b border-[#E5E7EB] py-3">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-start gap-3 sm:gap-5 overflow-x-auto no-scrollbar snap-x">
            {categories.map((cat, idx) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center shrink-0 w-[72px] sm:w-[88px] snap-start"
              >
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-[2px] transition-transform duration-150 group-hover:scale-105 shadow-2xs ${
                    idx % 2 === 0
                      ? 'bg-gradient-to-tr from-[#F26522] to-[#FF8A00]'
                      : 'bg-gradient-to-tr from-[#101114] to-[#2563EB]'
                  }`}
                >
                  <div className="w-full h-full rounded-[14px] bg-white p-1.5 flex items-center justify-center overflow-hidden">
                    <SmartImage
                      src={cat.image}
                      alt={cat.name}
                      brand={cat.name}
                      category={cat.slug}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <span className="mt-1.5 text-[11px] sm:text-xs font-extrabold text-[#171717] group-hover:text-[#F26522] text-center leading-tight line-clamp-1">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* POORVIKA PATTERN 2: Full-Width Hero Campaign Banner + Bank Cashback Strip */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 space-y-2.5">
        {currentBanner && (
          <div className="relative rounded-2xl sm:rounded-3xl bg-[#101114] text-white overflow-hidden border border-white/10 shadow-md">
            {/* Full Poorvika Banner Image on Top + Quick Action Strip Below */}
            <Link to={currentBanner.ctaLink || '/products'} className="block relative bg-[#0B0F19]">
              <SmartImage
                src={currentBanner.image}
                alt={currentBanner.title}
                brand="Charlie Mobile"
                category="smartphones"
                className="w-full max-h-[220px] sm:max-h-[340px] object-cover sm:object-contain mx-auto"
              />
            </Link>

            <div className="p-3.5 sm:px-6 sm:py-4 bg-gradient-to-r from-[#101114] via-[#181B22] to-[#101114] flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10">
              <div className="space-y-0.5 min-w-0">
                <div className="inline-flex items-center gap-1 text-[10px] font-extrabold tracking-wider uppercase text-[#F97316]">
                  <Sparkles className="w-3 h-3" />
                  <span>{currentBanner.tag || 'CHARLIE MOBILE EXCLUSIVE'}</span>
                </div>
                <h1 className="text-sm sm:text-lg font-extrabold tracking-tight truncate">
                  {currentBanner.title}
                </h1>
                <p className="text-[11px] sm:text-xs text-slate-300 line-clamp-1">
                  {currentBanner.subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                {activeBanners.length > 1 && (
                  <div className="flex items-center gap-1.5 mr-2">
                    <button
                      type="button"
                      onClick={() =>
                        setBannerIndex(
                          (prev) => (prev - 1 + activeBanners.length) % activeBanners.length
                        )
                      }
                      aria-label="Previous slide"
                      className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {activeBanners.map((b, idx) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBannerIndex(idx)}
                        aria-label={`Banner ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          idx === bannerIndex % activeBanners.length
                            ? 'w-5 bg-[#F26522]'
                            : 'w-1.5 bg-white/30'
                        }`}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={() => setBannerIndex((prev) => (prev + 1) % activeBanners.length)}
                      aria-label="Next slide"
                      className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <Link
                  to={currentBanner.ctaLink || '/products'}
                  className="h-9 px-4 rounded-xl bg-[#F26522] hover:bg-[#EA580C] text-white text-xs font-extrabold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <span>{currentBanner.ctaText || 'Shop Now'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Poorvika-Style Instant Bank Cashback & EMI Partner Strip */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-2.5 sm:p-3.5 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#F26522] border border-orange-200 flex items-center justify-center font-extrabold text-xs">
              %
            </div>
            <div>
              <p className="text-xs font-extrabold text-[#171717] whitespace-nowrap">
                {storeSettings.bankOfferTitle ||
                  'Up to ₹10,000 Instant Bank Cashback & Zero Down-Payment EMI'}
              </p>
              <p className="text-[11px] text-[#737373] whitespace-nowrap">
                {storeSettings.bankOfferSubtitle ||
                  'HDFC · ICICI · SBI · Axis · Bajaj Finserv · IDFC First'}
              </p>
            </div>
          </div>
          <Link
            to="/offers"
            className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#F26522] text-xs font-extrabold shrink-0 flex items-center gap-1"
          >
            <span>View Offers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* POORVIKA PATTERN 3: Quick Mobile & Accessories Visual Row (Exact El[4] Tiles from Poorvika) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3">
          {[
            {
              title: 'Mobiles',
              img: 'https://img-prd-pim.poorvika.com/pageimg/Mobile-Mobile-and-Accessories-2026.webp',
              link: '/products?category=smartphones',
            },
            {
              title: 'Chargers',
              img: 'https://img-prd-pim.poorvika.com/pageimg/Chargers-Mobile-and-Accessories-2026.webp',
              link: '/products?category=chargers',
            },
            {
              title: 'Adapters',
              img: 'https://img-prd-pim.poorvika.com/pageimg/Adapters-Mobile-and-Accessories-2026.webp',
              link: '/products?category=chargers',
            },
            {
              title: 'Tempered Glass',
              img: 'https://img-prd-pim.poorvika.com/pageimg/Tempered-Glass-Mobile-and-Accessories-2026.webp',
              link: '/products?category=mobile-accessories',
            },
            {
              title: 'Power Bank',
              img: 'https://img-prd-pim.poorvika.com/pageimg/Power-Bank-Mobile-and-Accessories-2026.webp',
              link: '/products?category=power-banks',
            },
            {
              title: 'Case & Covers',
              img: 'https://img-prd-pim.poorvika.com/pageimg/Case-Covers-Mobile-and-Accessories-2026.webp',
              link: '/products?category=mobile-accessories',
            },
            {
              title: 'True Wireless',
              img: 'https://img-prd-pim.poorvika.com/pageimg/True-Wireless-Mobile-and-Accessories-2026.webp',
              link: '/products?category=earbuds',
            },
          ].map((tile) => (
            <Link
              key={tile.title}
              to={tile.link}
              className="group bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#F26522] p-2 flex flex-col items-center transition-all shadow-2xs"
            >
              <div className="w-full aspect-square flex items-center justify-center overflow-hidden">
                <SmartImage
                  src={tile.img}
                  alt={tile.title}
                  brand={tile.title}
                  category="smartphones"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="mt-1 text-[10px] sm:text-xs font-extrabold text-[#171717] group-hover:text-[#F26522] text-center line-clamp-1">
                {tile.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* POORVIKA PATTERN 4: Best Selling Smartphones (El[5]) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#F26522]" />
            <div>
              <h2 className="text-base sm:text-xl font-extrabold text-[#171717] leading-tight">
                {getSection('best_selling', 'Best Selling Smartphones').title}
              </h2>
              <p className="text-[11px] sm:text-xs text-[#737373]">
                Most popular smartphones at {storeSettings.storeName} today
              </p>
            </div>
          </div>
          <Link
            to="/products?sort=popularity"
            className="text-xs font-extrabold text-[#F26522] flex items-center gap-1 shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Interactive Brand Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            'All',
            'Apple',
            'Samsung',
            'Vivo',
            'Oppo',
            'OnePlus',
            'Redmi',
            'Realme',
            'Nothing',
            'Google',
          ].map((brandName) => (
            <button
              key={brandName}
              type="button"
              onClick={() => setSelectedBrandTab(brandName)}
              className={`h-8 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                selectedBrandTab === brandName
                  ? 'bg-[#F26522] text-white shadow-2xs'
                  : 'bg-white border border-[#E5E7EB] text-[#171717] hover:border-[#F26522]'
              }`}
            >
              {brandName}
            </button>
          ))}
        </div>

        <div className="flex lg:grid lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
          {(brandFilteredBestSellers.length > 0 ? brandFilteredBestSellers : bestSellers)
            .slice(0, 8)
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

      {/* POORVIKA PATTERN 5: Shop By Mobile Brands (El[6]–El[9] with Real Poorvika Brand Graphics) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 space-y-3">
        <div className="text-center sm:text-left">
          <h2 className="text-base sm:text-xl font-extrabold text-[#171717]">
            {getSection('top_brands', 'Shop By Mobile Brands').title}
          </h2>
          <p className="text-[11px] sm:text-xs text-[#737373]">
            100% Sealed Pack Phones with Official Brand Warranty
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
          {poorvikaMobileBrands.map((brand) => (
            <Link
              key={brand.name}
              to={brand.link}
              className="group bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#F26522] p-2 flex items-center justify-center overflow-hidden shadow-2xs transition-all h-16 sm:h-20"
            >
              <SmartImage
                src={brand.img}
                alt={brand.name}
                brand={brand.name}
                category="smartphones"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* POORVIKA PATTERN 6: 5G Smartphones Product Rail (El[10]) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-[#171717]">
              {getSection('latest_5g', '5G Smartphones').title}
            </h2>
            <p className="text-[11px] sm:text-xs text-[#737373]">
              Ultra-fast 5G smartphones ready for instant store pickup or 2-hour delivery
            </p>
          </div>
          <Link
            to="/products?5g=true"
            className="text-xs font-extrabold text-[#F26522] flex items-center gap-1 shrink-0"
          >
            <span>See All 5G</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex lg:grid lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
          {latest5G.slice(0, 8).map((product) => (
            <div
              key={product.id}
              className="w-[172px] sm:w-[220px] lg:w-auto shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* POORVIKA PATTERN 7: Shop Mobile By Budget (El[11]–El[14] Real Poorvika Budget Cards) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-[#171717]">
              {getSection('shop_by_budget', 'Shop Mobile By Budget').title}
            </h2>
            <p className="text-[11px] sm:text-xs text-[#737373]">
              Pick your price bracket — Easy No-Cost EMI available on every range
            </p>
          </div>
        </div>

        <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-7 gap-2.5 overflow-x-auto no-scrollbar snap-x">
          {poorvikaBudgetCards.map((b) => (
            <Link
              key={b.label}
              to={`/products?minPrice=${b.min}&maxPrice=${b.max}`}
              className="group w-[135px] sm:w-auto shrink-0 snap-start bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#F26522] overflow-hidden shadow-2xs transition-all flex flex-col"
            >
              <div className="aspect-[4/3] w-full bg-[#F8FAFC] overflow-hidden">
                <SmartImage
                  src={b.img}
                  alt={b.label}
                  brand={b.label}
                  category="smartphones"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-2 text-center bg-white border-t border-[#F1F5F9]">
                <span className="text-[11px] font-extrabold text-[#171717] group-hover:text-[#F26522] tabular-nums">
                  {b.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* POORVIKA PATTERN 8: Featured Categories & Choose Your Comfort (El[15]–El[20]) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Featured Categories: Apple, Android, Feature Phone */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-3.5 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-lg font-extrabold text-[#171717]">
              Featured Categories
            </h2>
            <Link to="/products" className="text-xs font-bold text-[#F26522]">
              Explore All
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              {
                name: 'Apple iPhones',
                img: 'https://img-prd-pim.poorvika.com/pageimg/Apple-Mobile-and-Accessories-2026.webp',
                link: '/products?category=iphone',
              },
              {
                name: 'Android 5G',
                img: 'https://img-prd-pim.poorvika.com/pageimg/Android-Mobile-and-Accessories-2026.webp',
                link: '/products?category=smartphones',
              },
              {
                name: 'Keypad & Budget',
                img: 'https://img-prd-pim.poorvika.com/pageimg/Feature-Phone-Mobile-and-Accessories-2026.webp',
                link: '/products?maxPrice=20000',
              },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.link}
                className="group rounded-xl overflow-hidden border border-[#E5E7EB] hover:border-[#F26522] flex flex-col items-center bg-[#F8FAFC]"
              >
                <SmartImage
                  src={item.img}
                  alt={item.name}
                  brand={item.name}
                  category="smartphones"
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform"
                />
                <span className="py-1.5 text-[11px] font-extrabold text-[#171717] text-center">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Choose Your Comfort: Wireless, Wired, True Wireless */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-3.5 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-lg font-extrabold text-[#171717]">
              Choose Your Audio Comfort
            </h2>
            <Link to="/products?category=earbuds" className="text-xs font-bold text-[#F26522]">
              Shop Audio
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              {
                name: 'True Wireless',
                img: 'https://img-prd-pim.poorvika.com/pageimg/True-Wireless-Mobile-and-Accessories-2026.webp',
                link: '/products?category=earbuds',
              },
              {
                name: 'Wireless Neckband',
                img: 'https://img-prd-pim.poorvika.com/pageimg/Wireless-Mobile-and-Accessories-2026.webp',
                link: '/products?category=earbuds',
              },
              {
                name: 'Wired Audio',
                img: 'https://img-prd-pim.poorvika.com/pageimg/Wired-Mobile-and-Accessories-2026.webp',
                link: '/products?category=earbuds',
              },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.link}
                className="group rounded-xl overflow-hidden border border-[#E5E7EB] hover:border-[#F26522] flex flex-col items-center bg-[#F8FAFC]"
              >
                <SmartImage
                  src={item.img}
                  alt={item.name}
                  brand={item.name}
                  category="earbuds"
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform"
                />
                <span className="py-1.5 text-[11px] font-extrabold text-[#171717] text-center">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* POORVIKA PATTERN 9: New Releases Posters + Product Rail (El[25]–El[28]) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-[#171717]">
              {getSection('new_releases', 'New Releases').title}
            </h2>
            <p className="text-[11px] sm:text-xs text-[#737373]">
              Just launched smartphones &amp; foldables available at Charlie Mobile
            </p>
          </div>
          <Link
            to="/products?sort=newest"
            className="text-xs font-extrabold text-[#F26522] flex items-center gap-1"
          >
            <span>Explore Launches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Real Poorvika New Release Launch Poster Cards */}
        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-2.5 overflow-x-auto no-scrollbar snap-x">
          {poorvikaNewReleasePosters.map((poster) => (
            <Link
              key={poster.title}
              to={poster.link}
              className="group w-[145px] sm:w-auto shrink-0 snap-start rounded-2xl overflow-hidden border border-[#E5E7EB] hover:border-[#F26522] bg-white shadow-2xs"
            >
              <SmartImage
                src={poster.img}
                alt={poster.title}
                brand={poster.title}
                category="smartphones"
                className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* POORVIKA PATTERN 10: A Flagship Experience Banner + Flagship Phones Rail (El[38]–El[40]) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 space-y-3">
        <Link
          to="/products?minPrice=55000"
          className="block rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-2xs bg-[#101114]"
        >
          <SmartImage
            src="https://img-prd-pim.poorvika.com/pageimg/A-Flagship-Experence-Mobile-and-Accessories-2026.webp"
            alt="A Flagship Experience"
            brand="Flagship Smartphones"
            category="smartphones"
            className="w-full max-h-[200px] object-cover"
          />
        </Link>

        <div className="flex items-center justify-between pt-1">
          <h2 className="text-base sm:text-xl font-extrabold text-[#171717]">
            {getSection('flagship_smartphones', 'Flagship Phones').title}
          </h2>
          <Link
            to="/products?minPrice=55000"
            className="text-xs font-extrabold text-[#F26522] flex items-center gap-1"
          >
            <span>See All Flagships</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex lg:grid lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
          {flagshipPhones.slice(0, 8).map((product) => (
            <div
              key={product.id}
              className="w-[172px] sm:w-[220px] lg:w-auto shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* POORVIKA PATTERN 11: Best Camera Smartphones Banner + Camera / Mid-Range Tabs (El[41]–El[44]) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 space-y-3">
        <Link
          to="/products?category=smartphones"
          className="block rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-2xs bg-[#101114]"
        >
          <SmartImage
            src="https://img-prd-pim.poorvika.com/pageimg/Best-Camera-Smart-Phones-Mobile-and-Accessories-2026.webp"
            alt="Best Camera Smartphones"
            brand="Pro Camera Phones"
            category="smartphones"
            className="w-full max-h-[200px] object-cover"
          />
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#E5E7EB] self-start">
            <button
              type="button"
              onClick={() => setCameraOrMidTab('camera')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-colors cursor-pointer ${
                cameraOrMidTab === 'camera'
                  ? 'bg-[#F26522] text-white'
                  : 'text-[#171717] hover:bg-slate-100'
              }`}
            >
              Best Camera Smart Phones
            </button>
            <button
              type="button"
              onClick={() => setCameraOrMidTab('midrange')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-colors cursor-pointer ${
                cameraOrMidTab === 'midrange'
                  ? 'bg-[#F26522] text-white'
                  : 'text-[#171717] hover:bg-slate-100'
              }`}
            >
              Best Budget &amp; Mid-Range
            </button>
          </div>
          <Link
            to="/products?category=smartphones"
            className="text-xs font-extrabold text-[#F26522] flex items-center gap-1"
          >
            <span>View Full Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex lg:grid lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
          {(cameraOrMidTab === 'camera' ? bestCameraPhones : midRangePhones)
            .slice(0, 8)
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

      {/* POORVIKA PATTERN 12: Shop Accessories By Brands (El[29]–El[32]) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 space-y-3">
        <div>
          <h2 className="text-base sm:text-xl font-extrabold text-[#171717]">
            {getSection('accessories_by_brand', 'Shop Accessories By Brands').title}
          </h2>
          <p className="text-[11px] sm:text-xs text-[#737373]">
            Original Apple, Samsung, Xiaomi, Boat, Yarr &amp; OnePlus accessories
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {poorvikaAccessoryBrands.map((b) => (
            <Link
              key={b.name}
              to={b.link}
              className="group bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#F26522] p-2 flex items-center justify-center h-16 overflow-hidden shadow-2xs"
            >
              <SmartImage
                src={b.img}
                alt={b.name}
                brand={b.name}
                category="chargers"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* POORVIKA PATTERN 13: Genuine Chargers, Power Banks, Tempered Glass & Cases (El[45]–El[55]) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 space-y-3">
        {/* Poorvika 3-Banner Strip for Screen Protectors, Cables & Chargers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          <Link
            to="/products?category=chargers"
            className="rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-2xs"
          >
            <SmartImage
              src="https://img-prd-pim.poorvika.com/pageimg/Charger-Adaptors-Mobile-and-Accessories-2026-mob.webp"
              alt="Chargers & Adapters"
              brand="Chargers"
              category="chargers"
              className="w-full h-28 sm:h-36 object-cover"
            />
          </Link>
          <Link
            to="/products?category=mobile-accessories"
            className="rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-2xs"
          >
            <SmartImage
              src="https://img-prd-pim.poorvika.com/pageimg/Screen-Protectors-Mobile-and-Accessories-2026-mob0.webp"
              alt="Screen Protectors"
              brand="Screen Protectors"
              category="mobile-accessories"
              className="w-full h-28 sm:h-36 object-cover"
            />
          </Link>
          <Link
            to="/products?category=chargers"
            className="rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-2xs"
          >
            <SmartImage
              src="https://img-prd-pim.poorvika.com/pageimg/Cables-Connectors-Mobile-and-Accessories-2026-mob.webp"
              alt="Cables & Connectors"
              brand="Cables"
              category="chargers"
              className="w-full h-28 sm:h-36 object-cover"
            />
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-[#171717]">
              Mobile Accessories, Chargers, Power Banks &amp; Earbuds
            </h2>
            <p className="text-[11px] sm:text-xs text-[#737373]">
              Original adapters, 165W power banks, MagSafe cases, privacy glass &amp; ANC buds
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['All', 'Apple', 'Xiaomi', 'Urban', 'Noise', 'Yarr'].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setAccessoryBrandTab(b)}
                className={`h-8 px-3 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                  accessoryBrandTab === b
                    ? 'bg-[#F26522] text-white'
                    : 'bg-white border border-[#E5E7EB] text-[#171717]'
                }`}
              >
                {b === 'All' ? 'All Brands' : b}
              </button>
            ))}
          </div>
        </div>

        <div className="flex lg:grid lg:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
          {(filteredAccessories.length > 0 ? filteredAccessories : allAccessories)
            .slice(0, 8)
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

      {/* POORVIKA PATTERN 14: Smartwatches, iPads & Audio Wearables */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-[#171717]">
              iPads, Smartwatches &amp; AirPods
            </h2>
            <p className="text-[11px] sm:text-xs text-[#737373]">
              Apple iPad Air M4, AirPods Pro 3rd Gen, Boat Wave Sigma 3 &amp; ANC Buds
            </p>
          </div>
          <Link
            to="/products?category=smartwatches"
            className="text-xs font-extrabold text-[#F26522] flex items-center gap-1 shrink-0"
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

      {/* POORVIKA PATTERN 15: Exchange & EMI Value Banners */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-2xl bg-[#101114] text-white p-4 sm:p-6 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#F97316] uppercase tracking-wider">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Charlie Mobile Smart Exchange</span>
              </div>
              <h3 className="mt-1.5 text-base sm:text-xl font-extrabold">
                Trade In Your Old Phone — Get Up to{' '}
                {formatINR(storeSettings.exchangeMaxBonus || 12000)} Bonus
              </h3>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                Instant evaluation in 2 minutes. Upgrade from any old 4G/5G device right at our counter or during doorstep delivery.
              </p>
            </div>
            <div className="mt-3.5">
              <Link
                to="/offers"
                className="inline-flex h-9 px-4 rounded-xl bg-[#F26522] hover:bg-[#EA580C] text-white text-xs font-bold items-center gap-1.5"
              >
                <span>Check Exchange Value</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-white text-[#171717] p-4 sm:p-6 border border-[#E5E7EB] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#F26522] uppercase tracking-wider">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Paperless Instant Finance</span>
              </div>
              <h3 className="mt-1.5 text-base sm:text-xl font-extrabold">
                No-Cost EMI Starting at {formatINR(storeSettings.emiStartingPrice || 649)}/Month
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

      {/* POORVIKA PATTERN 16: Physical Store & Customer Care Showcase */}
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
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#F26522] uppercase tracking-wider">
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
                  <MapPin className="w-4 h-4 text-[#F26522] shrink-0" />
                  <span className="truncate font-semibold">
                    Call / WhatsApp: {storeSettings.phone || '+91 8818850488'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F5F6F8] flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-[#F26522] shrink-0" />
                  <span className="truncate font-semibold">
                    Email: {storeSettings.email || 'charliegedekar@gmail.com'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <a
                href={`tel:${(storeSettings.phone || '8818850488').replace(/[^0-9+]/g, '')}`}
                className="h-10 px-4 rounded-xl bg-[#F26522] hover:bg-[#EA580C] text-white text-xs font-extrabold flex items-center gap-1.5 transition-colors"
              >
                <span>Call {storeSettings.phone || '+91 8818850488'}</span>
              </a>
              <button
                type="button"
                onClick={() => openWhatsAppEnquiry({})}
                className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp 8818850488</span>
              </button>
              <Link
                to="/store"
                className="h-10 px-4 rounded-xl bg-[#101114] hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Store className="w-4 h-4" />
                <span>Showroom Info</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
