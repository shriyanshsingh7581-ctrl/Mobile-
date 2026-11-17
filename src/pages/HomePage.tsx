import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  ChevronLeft,
  ChevronRight,
  Globe,
  ShoppingBag,
  Sparkles,
  Star,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { formatINR, useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { SmartImage } from '../components/SmartImage';
import { isVideoUrl } from '../utils/cloudinary';

export const HomePage: React.FC = () => {
  const {
    products,
    categories,
    banners,
    celebrityReels,
    shopByNotes,
    shopByOccasions,
    testimonials,
    blogPosts,
    storeSettings,
    homepageSections,
    addToCart,
  } = useStore();

  const [activeSlide, setActiveSlide] = useState(0);
  const [bannerMuted, setBannerMuted] = useState(true);
  const [activeBestsellerTab, setActiveBestsellerTab] = useState('ALL');
  const [unmutedReelId, setUnmutedReelId] = useState<string | null>(null);
  const [brandVideoMuted, setBrandVideoMuted] = useState(true);

  const activeBanners = useMemo(() => {
    const list = banners.filter((b) => b.enabled);
    return list.length > 0 ? list : banners;
  }, [banners]);

  const activeReels = useMemo(() => {
    return celebrityReels.filter((r) => r.enabled).sort((a, b) => a.order - b.order);
  }, [celebrityReels]);

  const intervalMs = Math.max(2, Number(storeSettings.bannerIntervalSeconds || 5)) * 1000;

  // Auto-advance Hero Banner every N seconds (default 5 seconds)
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % activeBanners.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [activeBanners.length, intervalMs]);

  useEffect(() => {
    if (activeSlide >= activeBanners.length) {
      setActiveSlide(0);
    }
  }, [activeBanners.length, activeSlide]);

  const isSectionEnabled = (id: string) => {
    const found = homepageSections.find((s) => s.id === id);
    return found ? found.enabled : true;
  };

  const getSectionTitle = (id: string, fallback: string) => {
    const found = homepageSections.find((s) => s.id === id);
    return found && found.title ? found.title : fallback;
  };

  const bestsellerTabs =
    storeSettings.bestsellerTabs && storeSettings.bestsellerTabs.length > 0
      ? storeSettings.bestsellerTabs
      : ['ALL', 'HIM', 'HER', 'ATTAR / PRO', 'GIFTING'];

  const bestsellerProducts = useMemo(() => {
    const base = products.filter((p) => p.isBestSeller || p.stock > 0);
    if (activeBestsellerTab === 'ALL') return base.slice(0, 8);
    const tabUpper = activeBestsellerTab.toUpperCase();
    const matched = products.filter((p) => {
      if (p.bestsellerTab && p.bestsellerTab.toUpperCase() === tabUpper) return true;
      if (tabUpper.includes('HIM')) return ['iphone', 'samsung', 'smartphones'].includes(p.category);
      if (tabUpper.includes('HER')) return ['vivo', 'oppo', 'smartwatches'].includes(p.category);
      if (tabUpper.includes('ATTAR') || tabUpper.includes('PRO'))
        return p.isFlagship || p.price >= 30000;
      if (tabUpper.includes('GIFT'))
        return ['mobile-accessories', 'smartwatches', 'earbuds'].includes(p.category);
      return true;
    });
    return (matched.length > 0 ? matched : base).slice(0, 8);
  }, [products, activeBestsellerTab]);

  const featuredFavouriteProducts = useMemo(() => {
    const list = products.filter((p) => p.isFeatured && p.stock > 0);
    return (list.length >= 4 ? list : products).slice(0, 8);
  }, [products]);

  const newArrivalProducts = useMemo(() => {
    // Include out-of-stock collector item so 🔔 NOTIFY ME is showcased just like 00:28 in video
    const outOfStockItems = products.filter((p) => p.stock <= 0);
    const inStockNew = products.filter((p) => p.isNewRelease && p.stock > 0);
    const combined = [...inStockNew.slice(0, 3), ...outOfStockItems, ...inStockNew.slice(3)];
    return (combined.length > 0 ? combined : products).slice(0, 8);
  }, [products]);

  const currentHero = activeBanners[activeSlide] || activeBanners[0];
  const currentHeroIsVideo =
    currentHero &&
    (currentHero.mediaType === 'video' ||
      isVideoUrl(currentHero.videoUrl) ||
      isVideoUrl(currentHero.image));

  return (
    <div className="bg-white min-h-screen pb-10 space-y-10 sm:space-y-14 select-none">
      {/* =====================================================================
          1. FULL-WIDTH HERO BANNER SLIDER (EXACT VIDEO 00:31 - 00:35)
      ===================================================================== */}
      {currentHero && (
        <section className="relative w-full overflow-hidden bg-[#F5F7FA]">
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/8] max-h-[480px] overflow-hidden">
            {currentHeroIsVideo ? (
              <div className="relative w-full h-full bg-[#1A1A1A]">
                <video
                  key={currentHero.videoUrl || currentHero.image}
                  src={currentHero.videoUrl || currentHero.image}
                  poster={
                    !isVideoUrl(currentHero.image) ? currentHero.image : undefined
                  }
                  className="w-full h-full object-cover"
                  autoPlay
                  muted={bannerMuted}
                  loop
                  playsInline
                  preload="auto"
                />
                <button
                  type="button"
                  onClick={() => setBannerMuted((m) => !m)}
                  aria-label={bannerMuted ? 'Unmute video' : 'Mute video'}
                  className="absolute bottom-3 right-3 z-20 px-3 py-1.5 bg-black/65 text-white text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  {bannerMuted ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Tap for Sound</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#B5893D]" />
                      <span>Sound On</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <SmartImage
                src={currentHero.image}
                alt={currentHero.title}
                className="w-full h-full object-cover"
              />
            )}

            {/* Editorial Headline & SHOP NOW Overlay (Exact Video 00:31 - 00:35) */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/55 to-transparent flex items-center">
              <div className="max-w-7xl mx-auto w-full px-8 sm:px-14">
                <div className="max-w-md space-y-2 sm:space-y-3">
                  {currentHero.tag && (
                    <span className="inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#B5893D]">
                      {currentHero.tag}
                    </span>
                  )}
                  <h1 className="font-serif-luxury text-xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] uppercase leading-none tracking-wider">
                    {currentHero.title}
                  </h1>
                  {currentHero.subtitle && (
                    <p className="text-[11px] sm:text-sm text-[#4A4A4A] line-clamp-2 max-w-sm">
                      {currentHero.subtitle}
                    </p>
                  )}
                  <div className="pt-1">
                    <Link
                      to={currentHero.ctaLink || '/products'}
                      className="inline-flex items-center justify-center h-8 sm:h-10 px-5 sm:px-7 bg-[#1A1A1A] hover:bg-[#B5893D] text-white text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] transition-colors"
                    >
                      {currentHero.ctaText || 'SHOP NOW'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Left < and Right > Navigation Arrows (Exact Video 00:31 - 00:35) */}
            {activeBanners.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveSlide(
                      (prev) => (prev - 1 + activeBanners.length) % activeBanners.length
                    )
                  }
                  aria-label="Previous slide"
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/85 hover:bg-white text-[#1A1A1A] shadow-md flex items-center justify-center cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveSlide((prev) => (prev + 1) % activeBanners.length)
                  }
                  aria-label="Next slide"
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/85 hover:bg-white text-[#1A1A1A] shadow-md flex items-center justify-center cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </>
            )}
          </div>
        </section>
      )}

      {/* =====================================================================
          2. "OUR BESTSELLERS" WITH CATEGORY FILTER TABS (EXACT VIDEO 00:00 - 00:05)
      ===================================================================== */}
      {isSectionEnabled('our_bestsellers') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5">
          {/* Header Row: OUR BESTSELLERS + Horizontal Line + View More Button */}
          <div className="flex items-center gap-4">
            <h2 className="font-serif-luxury text-base sm:text-2xl font-semibold uppercase tracking-[0.12em] text-[#1A1A1A] shrink-0">
              {getSectionTitle('our_bestsellers', 'OUR BESTSELLERS')}
            </h2>
            <div className="h-[1px] bg-[#E5E0D8] flex-1" />
            <Link
              to="/products"
              className="h-8 sm:h-9 px-3.5 sm:px-5 border border-[#D4CFC7] hover:border-[#1A1A1A] text-[11px] sm:text-xs font-medium text-[#1A1A1A] flex items-center justify-center shrink-0 transition-colors"
            >
              View More
            </Link>
          </div>

          {/* Interactive Category Filter Tabs (HIM | HER | ATTAR / PRO | GIFTING) */}
          <div className="flex items-center gap-5 sm:gap-8 overflow-x-auto no-scrollbar border-b border-[#F0ECE1]">
            {bestsellerTabs.map((tab) => {
              const isActive = activeBestsellerTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveBestsellerTab(tab)}
                  className={`pb-2.5 text-xs sm:text-sm font-medium uppercase tracking-[0.12em] whitespace-nowrap transition-colors relative cursor-pointer ${
                    isActive
                      ? 'text-[#1A1A1A] font-semibold'
                      : 'text-[#888888] hover:text-[#1A1A1A]'
                  }`}
                >
                  {tab}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-0 h-[2px] bg-[#B5893D]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Horizontal Swipeable Product Cards Rail (3 visible on mobile/tablet, 4 on desktop) */}
          <div className="flex gap-3 sm:gap-5 overflow-x-auto no-scrollbar pb-2">
            {bestsellerProducts.map((product) => (
              <div
                key={product.id}
                className="w-[155px] sm:w-[220px] lg:w-[260px] shrink-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================================
          3. "LOVED BY CELEBRITIES" — AUTOPLAYING 9:16 VIDEO REELS (EXACT VIDEO 00:00 - 00:11)
      ===================================================================== */}
      {isSectionEnabled('loved_by_celebrities') && activeReels.length > 0 && (
        <section
          id="celebrity-reels"
          className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5 scroll-mt-20"
        >
          <div className="flex items-center gap-4">
            <h2 className="font-serif-luxury text-base sm:text-2xl font-semibold uppercase tracking-[0.12em] text-[#1A1A1A] shrink-0">
              {getSectionTitle('loved_by_celebrities', 'LOVED BY CELEBRITIES')}
            </h2>
            <div className="h-[1px] bg-[#E5E0D8] flex-1" />
          </div>

          <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2">
            {activeReels.map((reel) => {
              const linkedProduct =
                products.find((p) => p.id === reel.linkedProductId) || products[0];
              const isMuted = unmutedReelId !== reel.id;

              return (
                <div
                  key={reel.id}
                  className="w-[165px] sm:w-[225px] lg:w-[250px] shrink-0 flex flex-col bg-white"
                >
                  {/* 9:16 Vertical Auto-Playing Video Container */}
                  <div className="relative aspect-[9/16] w-full bg-[#1A1A1A] overflow-hidden">
                    <video
                      src={reel.videoUrl}
                      poster={reel.posterUrl || linkedProduct?.mainImage}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted={isMuted}
                      loop
                      playsInline
                      preload="auto"
                    />

                    {/* Subtle Top-Right Tap-to-Unmute Toggle */}
                    <button
                      type="button"
                      onClick={() =>
                        setUnmutedReelId((prev) => (prev === reel.id ? null : reel.id))
                      }
                      aria-label={isMuted ? 'Unmute reel' : 'Mute reel'}
                      className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/75 cursor-pointer"
                    >
                      {isMuted ? (
                        <VolumeX className="w-3.5 h-3.5" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                      )}
                    </button>

                    {/* Optional Celebrity Caption Overlay at Bottom of Video */}
                    {reel.celebrityName && (
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-2.5 pointer-events-none">
                        <p className="text-[10px] font-semibold text-white/95 truncate">
                          {reel.celebrityName}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Linked Mini Product Bar Directly Underneath Video (Exact Video 00:00 - 00:11) */}
                  {linkedProduct && (
                    <div className="mt-2 border border-[#E5E5E5] bg-white p-2 flex items-center justify-between gap-2">
                      <Link
                        to={`/product/${linkedProduct.id}`}
                        className="flex items-center gap-2 min-w-0 flex-1"
                      >
                        <div className="w-9 h-9 bg-[#F5F5F5] p-1 shrink-0 flex items-center justify-center">
                          <SmartImage
                            src={linkedProduct.mainImage}
                            alt={linkedProduct.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] sm:text-[11px] font-medium text-[#1A1A1A] line-clamp-2 leading-tight">
                            {linkedProduct.name}
                          </p>
                          <p className="text-[11px] sm:text-xs font-bold text-[#1A1A1A] mt-0.5 tabular-nums">
                            {formatINR(linkedProduct.price)}
                          </p>
                        </div>
                      </Link>

                      <button
                        type="button"
                        onClick={() => addToCart(linkedProduct, 1)}
                        aria-label={`Add ${linkedProduct.name} to cart`}
                        className="w-8 h-8 sm:w-9 sm:h-9 border border-[#1A1A1A] bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =====================================================================
          4. 4-COLUMN VISUAL CATEGORY GRID (EXACT VIDEO 00:04 - 00:11)
      ===================================================================== */}
      {isSectionEnabled('visual_categories') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-4 gap-2.5 sm:gap-5">
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                to={cat.slug === 'offers' ? '/offers' : `/products?category=${cat.slug}`}
                className="group flex flex-col items-start space-y-2"
              >
                <div className="aspect-square w-full rounded-xl bg-[#FAF7F2] border border-[#EAE5DC] overflow-hidden p-2 sm:p-4 flex items-center justify-center">
                  <SmartImage
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-[11px] sm:text-sm font-medium text-[#1A1A1A] group-hover:text-[#B5893D] transition-colors line-clamp-1">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================================
          5. "DISCOVER LUXURY GIFTING" FULL-WIDTH ESPRESSO & GOLD BANNER (00:04 - 00:13)
      ===================================================================== */}
      {isSectionEnabled('luxury_gifting') && (
        <section className="w-full bg-gradient-to-r from-[#2A1810] via-[#3A2216] to-[#2A1810] text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-5 sm:px-10 py-7 sm:py-12 grid grid-cols-12 items-center gap-4">
            <div className="col-span-7 sm:col-span-6 space-y-2 sm:space-y-3">
              <span className="block text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#E6C67C]">
                DISCOVER
              </span>
              <h2 className="font-serif-editorial text-2xl sm:text-5xl font-normal italic text-[#F4D993] leading-none">
                {storeSettings.luxuryGiftingBannerTitle || 'Luxury Gifting'}
              </h2>
              <p className="text-[11px] sm:text-sm text-white/90 max-w-sm">
                {storeSettings.luxuryGiftingBannerSubtitle ||
                  'Premium Gift Sets For Every Occasion.'}
              </p>
              <div className="pt-2">
                <Link
                  to={storeSettings.luxuryGiftingBannerLink || '/offers'}
                  className="inline-flex items-center justify-center h-8 sm:h-10 px-5 sm:px-7 bg-white hover:bg-[#F4D993] text-[#2A1810] text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] transition-colors"
                >
                  SHOP NOW
                </Link>
              </div>
            </div>

            <div className="col-span-5 sm:col-span-6 flex items-center justify-end">
              <div className="w-36 h-32 sm:w-64 sm:h-52 flex items-center justify-center">
                <SmartImage
                  src={
                    storeSettings.luxuryGiftingBannerImage ||
                    'https://img-prd-pim.poorvika.com/product/Apple-iPhone-17-Pro-Max-Cosmic-Orange-2tB-front-back-view.png'
                  }
                  alt="Luxury Gifting"
                  className="w-full h-full object-contain drop-shadow-[0_14px_24px_rgba(0,0,0,0.5)]"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          6. "SHOP BY NOTES / HIGHLIGHTS" (EXACT VIDEO 00:12 - 00:13)
      ===================================================================== */}
      {isSectionEnabled('shop_by_notes') && shopByNotes.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5">
          <div className="flex items-center gap-4">
            <h2 className="font-serif-luxury text-base sm:text-2xl font-semibold uppercase tracking-[0.12em] text-[#1A1A1A] shrink-0">
              {getSectionTitle('shop_by_notes', 'SHOP BY NOTES')}
            </h2>
            <div className="h-[1px] bg-[#E5E0D8] flex-1" />
          </div>

          <div className="grid grid-cols-4 gap-2.5 sm:gap-5">
            {shopByNotes.map((item) => (
              <Link
                key={item.id}
                to={item.link || '/products'}
                className="group flex flex-col text-left space-y-2"
              >
                <div className="aspect-square w-full bg-[#F5F5F5] p-2.5 sm:p-5 flex items-center justify-center overflow-hidden">
                  <SmartImage
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h3 className="text-[11px] sm:text-sm font-semibold text-[#1A1A1A] group-hover:text-[#B5893D] truncate">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-[9px] sm:text-xs text-[#666666] truncate">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================================
          7. "RANVEER'S FAVOURITE" / FEATURED FAVOURITES (EXACT VIDEO 00:12 - 00:14)
      ===================================================================== */}
      {isSectionEnabled('featured_favourites') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5">
          <div className="flex items-center gap-4">
            <h2 className="font-serif-luxury text-base sm:text-2xl font-semibold uppercase tracking-[0.12em] text-[#1A1A1A] shrink-0">
              {storeSettings.featuredFavouritesTitle ||
                getSectionTitle('featured_favourites', "RANVEER'S FAVOURITE")}
            </h2>
            <div className="h-[1px] bg-[#E5E0D8] flex-1" />
          </div>

          <div className="flex gap-3 sm:gap-5 overflow-x-auto no-scrollbar pb-2">
            {featuredFavouriteProducts.map((product) => (
              <div
                key={product.id}
                className="w-[155px] sm:w-[220px] lg:w-[260px] shrink-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================================
          8. "SHOP BY OCCASIONS" (EXACT VIDEO 00:13 - 00:14)
      ===================================================================== */}
      {isSectionEnabled('shop_by_occasions') && shopByOccasions.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5">
          <div className="flex items-center gap-4">
            <h2 className="font-serif-luxury text-base sm:text-2xl font-semibold uppercase tracking-[0.12em] text-[#1A1A1A] shrink-0">
              {getSectionTitle('shop_by_occasions', 'SHOP BY OCCASIONS')}
            </h2>
            <div className="h-[1px] bg-[#E5E0D8] flex-1" />
          </div>

          <div className="grid grid-cols-4 gap-2.5 sm:gap-5">
            {shopByOccasions.map((occ) => (
              <Link
                key={occ.id}
                to={occ.link || '/products'}
                className="group flex flex-col text-left space-y-2"
              >
                <div className="aspect-square w-full bg-[#FAF7F2] overflow-hidden p-2 sm:p-4 flex items-center justify-center">
                  <SmartImage
                    src={occ.image}
                    alt={occ.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h3 className="text-[11px] sm:text-sm font-semibold text-[#1A1A1A] group-hover:text-[#B5893D] truncate">
                    {occ.title}
                  </h3>
                  {occ.subtitle && (
                    <p className="text-[9px] sm:text-xs text-[#666666] truncate">
                      {occ.subtitle}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================================
          9. "NEW ARRIVALS" WITH "🔔 NOTIFY ME" STOCK SUPPORT (EXACT VIDEO 00:14 & 00:28)
      ===================================================================== */}
      {isSectionEnabled('new_arrivals') && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5">
          <div className="flex items-center gap-4">
            <h2 className="font-serif-luxury text-base sm:text-2xl font-semibold uppercase tracking-[0.12em] text-[#1A1A1A] shrink-0">
              {getSectionTitle('new_arrivals', 'NEW ARRIVALS')}
            </h2>
            <div className="h-[1px] bg-[#E5E0D8] flex-1" />
          </div>

          <div className="flex gap-3 sm:gap-5 overflow-x-auto no-scrollbar pb-2">
            {newArrivalProducts.map((product) => (
              <div
                key={product.id}
                className="w-[155px] sm:w-[220px] lg:w-[260px] shrink-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================================
          10. HERITAGE GOLD LINE-ART TRUST BADGES (EXACT VIDEO 00:14 - 00:16)
      ===================================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-full border border-[#B5893D]/40 flex items-center justify-center text-[#B5893D]">
              <Award className="w-5 h-5 stroke-[1.5]" />
            </div>
            <span className="font-serif-luxury text-[10px] sm:text-sm font-semibold uppercase tracking-[0.14em] text-[#1A1A1A]">
              LEGACY QUALITY
            </span>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-full border border-[#B5893D]/40 flex items-center justify-center text-[#B5893D]">
              <Sparkles className="w-5 h-5 stroke-[1.5]" />
            </div>
            <span className="font-serif-luxury text-[10px] sm:text-sm font-semibold uppercase tracking-[0.14em] text-[#1A1A1A]">
              100% AUTHENTIC
            </span>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-full border border-[#B5893D]/40 flex items-center justify-center text-[#B5893D]">
              <Globe className="w-5 h-5 stroke-[1.5]" />
            </div>
            <span className="font-serif-luxury text-[10px] sm:text-sm font-semibold uppercase tracking-[0.14em] text-[#1A1A1A]">
              LOVED WORLDWIDE
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================================
          11. "FROM OUR LOVED ONES" GOLD-BORDERED TESTIMONIALS (EXACT VIDEO 00:14 - 00:16)
      ===================================================================== */}
      {isSectionEnabled('from_our_loved_ones') && testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5">
          <div className="flex items-center gap-4">
            <h2 className="font-serif-luxury text-base sm:text-2xl font-semibold uppercase tracking-[0.12em] text-[#1A1A1A] shrink-0">
              {getSectionTitle('from_our_loved_ones', 'FROM OUR LOVED ONES')}
            </h2>
            <div className="h-[1px] bg-[#E5E0D8] flex-1" />
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-5">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="border border-[#B5893D]/45 bg-white p-3 sm:p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center gap-0.5 text-[#B5893D]">
                    {[0, 1, 2, 3, 4].map((idx) => (
                      <Star
                        key={idx}
                        className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-[#B5893D] text-[#B5893D]"
                      />
                    ))}
                  </div>
                  <p className="text-[10px] sm:text-xs text-[#4A4A4A] leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 pt-2">
                  <img
                    src={item.avatarUrl}
                    alt={item.authorName}
                    className="w-7 h-7 sm:w-10 sm:h-10 rounded-full object-cover shrink-0 border border-[#B5893D]/30"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs font-bold text-[#1A1A1A] truncate">
                      {item.authorName}
                    </p>
                    <p className="text-[8px] sm:text-[10px] text-[#777777] truncate">
                      {item.authorRole}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================================
          12. "TRUSTED BY LEADING BRANDS" LOGO STRIP (EXACT VIDEO 00:15 - 00:17)
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5">
        <div className="flex items-center gap-4">
          <h2 className="font-serif-luxury text-base sm:text-2xl font-semibold uppercase tracking-[0.12em] text-[#1A1A1A] shrink-0">
            TRUSTED BY LEADING BRANDS
          </h2>
          <div className="h-[1px] bg-[#E5E0D8] flex-1" />
        </div>

        <div className="py-3 flex items-center justify-around gap-6 overflow-x-auto no-scrollbar border-y border-[#F2EFE9]">
          {['FORBES', 'ELLE', 'GRAZIA', 'FORBES', 'ELLE', 'GRAZIA'].map((brand, idx) => (
            <span
              key={`${brand}-${idx}`}
              className="font-serif-editorial text-xl sm:text-3xl font-semibold tracking-[0.18em] text-[#1A1A1A]/85 shrink-0"
            >
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* =====================================================================
          13. "BLOGS" 2-COLUMN EDITORIAL CARDS (EXACT VIDEO 00:15 - 00:24)
      ===================================================================== */}
      {isSectionEnabled('blogs_section') && blogPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5">
          <div className="flex items-center gap-4">
            <h2 className="font-serif-luxury text-base sm:text-2xl font-semibold uppercase tracking-[0.12em] text-[#1A1A1A] shrink-0">
              {getSectionTitle('blogs_section', 'BLOGS')}
            </h2>
            <div className="h-[1px] bg-[#E5E0D8] flex-1" />
          </div>

          <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-2">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="w-[240px] sm:w-[360px] lg:w-[400px] shrink-0 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2.5">
                  <Link
                    to={post.link || '/products'}
                    className="block aspect-[16/10] w-full bg-[#F5F5F5] overflow-hidden"
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </Link>
                  <h3 className="text-xs sm:text-sm font-medium text-[#1A1A1A] line-clamp-2 leading-relaxed">
                    {post.title}
                  </h3>
                </div>

                <div>
                  <Link
                    to={post.link || '/products'}
                    className="inline-flex items-center gap-2 h-8 sm:h-9 px-3.5 border border-[#D4CFC7] hover:border-[#1A1A1A] text-[10px] sm:text-xs font-medium text-[#1A1A1A] transition-colors"
                  >
                    <span>{post.ctaText || 'Find Your Style'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================================
          14. "LET US WALK YOU THROUGH" — FULL-WIDTH INLINE BRAND VIDEO (00:17 - 00:24)
      ===================================================================== */}
      {isSectionEnabled('walk_you_through') && (
        <section className="space-y-5 pt-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-4">
            <h2 className="font-serif-luxury text-base sm:text-2xl font-semibold uppercase tracking-[0.12em] text-[#1A1A1A] shrink-0">
              {storeSettings.brandStoryTitle ||
                getSectionTitle('walk_you_through', 'LET US WALK YOU THROUGH')}
            </h2>
            <div className="h-[1px] bg-[#E5E0D8] flex-1" />
          </div>

          <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] max-h-[520px] bg-[#1A1A1A] overflow-hidden">
            <video
              key={
                storeSettings.brandStoryVideoUrl ||
                'https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-modern-smartphone-42619-large.mp4'
              }
              src={
                storeSettings.brandStoryVideoUrl ||
                'https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-modern-smartphone-42619-large.mp4'
              }
              poster={storeSettings.brandStoryPosterUrl}
              className="w-full h-full object-cover"
              autoPlay
              muted={brandVideoMuted}
              loop
              playsInline
              preload="auto"
            />
            <button
              type="button"
              onClick={() => setBrandVideoMuted((m) => !m)}
              aria-label={brandVideoMuted ? 'Unmute brand video' : 'Mute brand video'}
              className="absolute bottom-4 right-4 z-10 px-3.5 py-1.5 bg-black/60 hover:bg-black/80 text-white text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              {brandVideoMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Unmute Story</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Sound On</span>
                </>
              )}
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
