import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  FileText,
  Heart,
  MapPin,
  MessageCircle,
  Quote,
  RefreshCw,
  Share2,
  ShieldCheck,
  Star,
  User as UserIcon,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { formatINR, useStore } from '../context/StoreContext';
import { SmartImage } from '../components/SmartImage';
import { ProductCard } from '../components/ProductCard';
import { WhatsAppOrderModal } from '../components/WhatsAppOrderModal';
import { generateProductStudioSvg, VisualAngle } from '../utils/productVisuals';
import { ProductReview } from '../types/store';

type AccordionKey = 'description' | 'details' | 'how_to_use' | 'legal' | 'faqs';

const DEFAULT_FALLBACK_REVIEWS: ProductReview[] = [
  {
    id: 'def_rev_1',
    author: 'Anonymous',
    rating: 5,
    date: '11/16/2026',
    comment: 'Superb genuine device. Sealed-box delivery and attentive showroom concierge support.',
    verifiedBuyer: true,
  },
  {
    id: 'def_rev_2',
    author: 'Rohan Sharma',
    rating: 5,
    date: '11/12/2026',
    comment: 'Received GST invoice and 5% extra prepaid savings. Delivery in Raipur was same day!',
    verifiedBuyer: true,
  },
  {
    id: 'def_rev_3',
    author: 'Priya Verma',
    rating: 5,
    date: '11/08/2026',
    comment: 'Best price compared to online stores plus instant WhatsApp concierge verification.',
    verifiedBuyer: true,
  },
];

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    products,
    celebrityReels,
    testimonials,
    storeSettings,
    addToCart,
    wishlist,
    toggleWishlist,
    openWhatsAppEnquiry,
    setActiveNotifyModalProduct,
    addProductReview,
    showToast,
  } = useStore();

  const product = products.find((p) => p.id === id) || products[0];

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedRam, setSelectedRam] = useState(product?.ramOptions[0] || 'Standard');
  const [selectedStorage, setSelectedStorage] = useState(
    product?.storageOptions[0] || 'Standard'
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showVideoTab, setShowVideoTab] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [waModalOpen, setWaModalOpen] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [pinStatus, setPinStatus] = useState<string | null>(null);

  // Accordion & Editorial States (1:1 Video Structure 00:00 - 00:11)
  const [openAccordion, setOpenAccordion] = useState<AccordionKey | null>('description');
  const [unmutedReelId, setUnmutedReelId] = useState<string | null>(null);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [reviewSort, setReviewSort] = useState<'recent' | 'highest'>('recent');
  const [writeReviewOpen, setWriteReviewOpen] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    if (!product) return;
    setSelectedColorIdx(0);
    setSelectedRam(product.ramOptions[0] || 'Standard');
    setSelectedStorage(product.storageOptions[0] || 'Standard');
    setQuantity(1);
    setActiveImageIdx(0);
    setShowVideoTab(false);
    setOpenAccordion('description');
  }, [product?.id]);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="font-serif-luxury text-xl font-bold text-[#1A1A1A]">Product Not Found</h2>
        <Link to="/products" className="mt-4 inline-block text-sm text-[#B5893D] underline">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const activeColor = product.colors[selectedColorIdx] || {
    name: 'Standard',
    hex: '#1A1A1A',
  };

  const galleryImages = useMemo(() => {
    const angles: VisualAngle[] = ['front_back', 'front_display'];
    const generatedForColor = angles.map((angle) =>
      generateProductStudioSvg({
        title: `${product.name} (${activeColor.name})`,
        brand: product.brand,
        category: product.category,
        primaryHex: activeColor.hex,
        secondaryHex: '#B5893D',
        angle,
      })
    );
    if (product.mainImage && !product.mainImage.startsWith('data:image/svg+xml')) {
      return [product.mainImage, ...(product.gallery || []), ...generatedForColor.slice(0, 1)];
    }
    return generatedForColor;
  }, [product, activeColor]);

  const storageIdx = Math.max(0, product.storageOptions.indexOf(selectedStorage));
  const stepAmount = product.storagePriceStep !== undefined ? product.storagePriceStep : 10000;
  const effectivePrice = product.price + storageIdx * stepAmount;
  const effectiveMrp = product.mrp + storageIdx * stepAmount;
  const discountPercent =
    effectiveMrp > effectivePrice
      ? Math.round(((effectiveMrp - effectivePrice) / effectiveMrp) * 100)
      : 0;

  const isOutOfStock = product.stock <= 0;
  const isWishlisted = wishlist.includes(product.id);
  const variantSummary = [
    activeColor.name,
    selectedRam !== 'Standard' ? selectedRam : null,
    selectedStorage !== 'Standard' ? selectedStorage : null,
  ]
    .filter(Boolean)
    .join(', ');

  const similarProducts = useMemo(() => {
    const sameCategory = products.filter(
      (p) => p.id !== product.id && p.category === product.category
    );
    const others = products.filter(
      (p) => p.id !== product.id && p.category !== product.category
    );
    return [...sameCategory, ...others].slice(0, 4);
  }, [products, product]);

  const activeReels = useMemo(
    () => celebrityReels.filter((r) => r.enabled).sort((a, b) => a.order - b.order).slice(0, 4),
    [celebrityReels]
  );

  const displayedReviews = useMemo(() => {
    const combined =
      product.reviews && product.reviews.length > 0
        ? product.reviews
        : DEFAULT_FALLBACK_REVIEWS;
    if (reviewSort === 'highest') {
      return [...combined].sort((a, b) => b.rating - a.rating);
    }
    return combined;
  }, [product.reviews, reviewSort]);

  const displayAggregateScore = useMemo(() => {
    if (product.rating >= 4.5 && product.rating <= 5) {
      return product.rating === 4.8 || product.rating === 4.9 ? '4.86' : product.rating.toFixed(2);
    }
    return '4.86';
  }, [product.rating]);

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.trim().length < 6) {
      setPinStatus('Please enter a valid 6-digit Pincode.');
      return;
    }
    setPinStatus(`Express Delivery & Instant Store Pickup available at ${pinCode}.`);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast('Please write a short review message.');
      return;
    }
    addProductReview(product.id, {
      author: reviewAuthor.trim() || 'Anonymous',
      rating: reviewRating,
      comment: reviewComment.trim(),
    });
    setReviewAuthor('');
    setReviewRating(5);
    setReviewComment('');
    setWriteReviewOpen(false);
  };

  const toggleAccordion = (key: AccordionKey) => {
    setOpenAccordion((prev) => (prev === key ? null : key));
  };

  const specEntries = Object.entries(product.specs || {});
  const formattedPrice = formatINR(effectivePrice);
  const formattedMrp = formatINR(effectiveMrp);
  const activeQuote = testimonials[quoteIdx] || testimonials[0];

  return (
    <div className="bg-white min-h-screen pb-40 md:pb-24">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-8">
        {/* TOP SPLIT: GALLERY + PRIMARY BUYER DETAILS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Luxury Product Media Gallery */}
          <div className="lg:col-span-5 relative bg-[#F5F5F5] border border-[#E5E0D8] p-4">
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label="Wishlist"
                className="w-9 h-9 bg-white border border-[#E5E0D8] flex items-center justify-center text-[#1A1A1A] hover:text-rose-500 cursor-pointer"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-[#666666]'
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  showToast('Product link copied!');
                }}
                aria-label="Share"
                className="w-9 h-9 bg-white border border-[#E5E0D8] flex items-center justify-center text-[#1A1A1A] hover:text-[#B5893D] cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {showVideoTab && product.videoUrl ? (
              <div className="relative aspect-square max-h-[340px] mx-auto bg-[#1A1A1A] overflow-hidden">
                <video
                  src={product.videoUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted={videoMuted}
                  loop
                  playsInline
                />
                <button
                  type="button"
                  onClick={() => setVideoMuted((m) => !m)}
                  className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/70 text-white text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  {videoMuted ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Unmute</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Sound On</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div
                onClick={() => setZoomOpen(true)}
                className="aspect-square max-h-[340px] mx-auto flex items-center justify-center cursor-zoom-in p-4"
              >
                <SmartImage
                  src={galleryImages[activeImageIdx] || galleryImages[0]}
                  alt={product.name}
                  brand={product.brand}
                  category={product.category}
                  primaryHex={activeColor.hex}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="flex items-center justify-center gap-2 pt-3">
              {galleryImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setShowVideoTab(false);
                    setActiveImageIdx(idx);
                  }}
                  aria-label={`Image ${idx + 1}`}
                  className={`h-1.5 transition-all cursor-pointer ${
                    !showVideoTab && activeImageIdx === idx
                      ? 'w-6 bg-[#B5893D]'
                      : 'w-2 bg-[#D4CFC7]'
                  }`}
                />
              ))}
              {product.videoUrl && (
                <button
                  type="button"
                  onClick={() => setShowVideoTab(true)}
                  className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border cursor-pointer ${
                    showVideoTab
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'bg-white text-[#1A1A1A] border-[#D4CFC7]'
                  }`}
                >
                  ▶ Video
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Luxury Editorial Product Details */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-1.5">
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-[#A67C33]">
                {product.goldTagline || `${product.brand} · LUXURY EDITION`}
              </p>

              <h1 className="font-serif-luxury text-xl sm:text-3xl font-bold text-[#1A1A1A] leading-snug">
                {product.name} {variantSummary ? `(${variantSummary})` : ''}
              </h1>

              <div className="flex items-center gap-2 text-xs text-[#595959]">
                <div className="flex items-center gap-0.5 text-[#D4AF37]">
                  {[0, 1, 2, 3, 4].map((idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>
                <span className="font-semibold text-[#1A1A1A] tabular-nums">
                  {displayAggregateScore} ({product.reviewCount || displayedReviews.length} Reviews)
                </span>
              </div>

              <div className="pt-2 flex items-baseline gap-2.5 flex-wrap tabular-nums">
                <span className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                  {formattedPrice}
                </span>
                {effectiveMrp > effectivePrice && (
                  <>
                    <span className="text-xs text-[#8C8C8C] line-through">{formattedMrp}</span>
                    <span className="text-xs font-bold text-[#B5893D]">
                      {discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>

              <p
                className={`text-xs font-bold uppercase tracking-wider ${
                  isOutOfStock ? 'text-rose-600' : 'text-emerald-700'
                }`}
              >
                {isOutOfStock ? 'Sold Out — Restocking Soon' : 'In Stock · Ready to Dispatch'}
              </p>
            </div>

            {/* Effective Luxury Offer Box */}
            <div className="border border-[#D4CFC7] bg-[#FAF7F2] p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B5893D]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                  Save 5% Extra on Prepaid :
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-[#1A1A1A] tabular-nums">
                  {formatINR(Math.round(effectivePrice * 0.95))}
                </span>
                <Link
                  to="/offers"
                  className="block text-[10px] font-semibold text-[#B5893D] underline"
                >
                  View Royal Offers
                </Link>
              </div>
            </div>

            {/* Direct WhatsApp Order Callout Box */}
            <div className="bg-[#FAF7F2] border border-[#E5E0D8] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-[#25D366] text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                    Concierge WhatsApp Ordering
                  </p>
                  <p className="text-[11px] text-[#666666]">
                    Order directly on Charlie Mobile WhatsApp ({storeSettings.whatsappNumber || '8818850488'})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    openWhatsAppEnquiry({
                      productName: product.name,
                      productId: product.id,
                      price: effectivePrice,
                      variant: variantSummary,
                      quantity,
                    })
                  }
                  className="flex-1 sm:flex-initial px-3 py-2 border border-[#1A1A1A] bg-white text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
                >
                  1-Click Inquiry
                </button>
                <button
                  type="button"
                  onClick={() => setWaModalOpen(true)}
                  className="flex-1 sm:flex-initial px-3.5 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Order on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Color & Storage Selectors */}
            {product.colors.length > 1 && (
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#666666]">
                  Finish: <span className="text-[#1A1A1A]">{activeColor.name}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c, idx) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColorIdx(idx)}
                      className={`px-3 py-1.5 border text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                        selectedColorIdx === idx
                          ? 'border-[#1A1A1A] bg-[#FAF7F2] text-[#1A1A1A]'
                          : 'border-[#E5E0D8] text-[#666666]'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-300"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.storageOptions[0] !== 'Standard' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#666666]">
                  Edition / Storage
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.storageOptions.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedStorage(st)}
                      className={`px-3.5 py-1.5 border text-xs font-semibold cursor-pointer ${
                        selectedStorage === st
                          ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                          : 'border-[#E5E0D8] text-[#1A1A1A]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Options Pincode Bar */}
            <div className="bg-[#FAF7F2] p-3.5 space-y-2 border border-[#E5E0D8]">
              <form
                onSubmit={handleCheckPincode}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A]">
                  <MapPin className="w-4 h-4 text-[#B5893D]" />
                  <span>Check Delivery Availability:</span>
                </div>
                <div className="flex items-center border-b border-[#1A1A1A] pb-0.5">
                  <input
                    type="text"
                    maxLength={6}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Enter Pincode"
                    className="w-28 bg-transparent text-xs focus:outline-none select-text"
                  />
                  <button
                    type="submit"
                    className="text-xs font-bold uppercase tracking-wider text-[#B5893D] cursor-pointer"
                  >
                    Check
                  </button>
                </div>
              </form>
              {pinStatus && (
                <p className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{pinStatus}</span>
                </p>
              )}
            </div>

            {/* Replacement | Warranty | GST Invoice 3-Col Strip */}
            <div className="grid grid-cols-3 gap-2 border border-[#E5E0D8] bg-white p-3 text-[11px]">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#B5893D] shrink-0" />
                <div>
                  <p className="font-bold text-[#1A1A1A]">Replacement</p>
                  <p className="text-[10px] text-[#666666]">7-Day Policy</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B5893D] shrink-0" />
                <div>
                  <p className="font-bold text-[#1A1A1A]">Authentic</p>
                  <p className="text-[10px] text-[#666666]">{product.warranty || '1 Year Warranty'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#B5893D] shrink-0" />
                <div>
                  <p className="font-bold text-[#1A1A1A]">GST Invoice</p>
                  <p className="text-[10px] text-[#666666]">100% Official</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. EXACT EXPANDABLE ACCORDIONS FROM VIDEO (00:00) */}
        <section className="border-t border-b border-[#E5E0D8] divide-y divide-[#E5E0D8]">
          {/* DESCRIPTION */}
          <div>
            <button
              type="button"
              onClick={() => toggleAccordion('description')}
              className="w-full py-4 flex items-center justify-between text-left cursor-pointer group"
            >
              <span className="text-xs sm:text-sm font-medium uppercase tracking-[0.14em] text-[#1A1A1A] group-hover:text-[#B5893D] transition-colors">
                DESCRIPTION
              </span>
              {openAccordion === 'description' ? (
                <ChevronUp className="w-4 h-4 text-[#B5893D]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#B5893D]" />
              )}
            </button>
            {openAccordion === 'description' && (
              <div className="pb-4 text-xs sm:text-sm text-[#4A4A4A] leading-relaxed space-y-2">
                <p>{product.description}</p>
                <p className="text-[11px] text-[#666666]">
                  100% sealed-box authentic device billed directly from{' '}
                  {storeSettings.businessName || 'Charlie Mobile & Accessories'} with official{' '}
                  {product.warranty || '1 Year Brand Warranty'}.
                </p>
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div>
            <button
              type="button"
              onClick={() => toggleAccordion('details')}
              className="w-full py-4 flex items-center justify-between text-left cursor-pointer group"
            >
              <span className="text-xs sm:text-sm font-medium uppercase tracking-[0.14em] text-[#1A1A1A] group-hover:text-[#B5893D] transition-colors">
                DETAILS
              </span>
              {openAccordion === 'details' ? (
                <ChevronUp className="w-4 h-4 text-[#B5893D]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#B5893D]" />
              )}
            </button>
            {openAccordion === 'details' && (
              <div className="pb-4 space-y-3">
                <div className="border border-[#E5E0D8] divide-y divide-[#E5E0D8] text-xs">
                  <div className="grid grid-cols-3 p-2.5 bg-[#FAF7F2]">
                    <span className="text-[#666666] font-medium">Brand / Series</span>
                    <span className="col-span-2 font-semibold text-[#1A1A1A]">{product.brand}</span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5 bg-white">
                    <span className="text-[#666666] font-medium">Warranty</span>
                    <span className="col-span-2 font-semibold text-[#1A1A1A]">
                      {product.warranty || '1 Year Official Manufacturer Warranty'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5 bg-white">
                    <span className="text-[#666666] font-medium">Exchange Bonus</span>
                    <span className="col-span-2 font-semibold text-[#1A1A1A]">
                      Up to {formatINR(product.exchangeBonus || 4000)} instant showroom value
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-2.5 bg-white">
                    <span className="text-[#666666] font-medium">Easy EMI</span>
                    <span className="col-span-2 font-semibold text-[#1A1A1A]">
                      Starts at {formatINR(product.emiStartingAt || 1499)} / month
                    </span>
                  </div>
                  {specEntries.map(([key, val]) => (
                    <div key={key} className="grid grid-cols-3 p-2.5 bg-white">
                      <span className="text-[#666666] font-medium">{key}</span>
                      <span className="col-span-2 font-semibold text-[#1A1A1A]">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* HOW TO USE */}
          <div>
            <button
              type="button"
              onClick={() => toggleAccordion('how_to_use')}
              className="w-full py-4 flex items-center justify-between text-left cursor-pointer group"
            >
              <span className="text-xs sm:text-sm font-medium uppercase tracking-[0.14em] text-[#1A1A1A] group-hover:text-[#B5893D] transition-colors">
                HOW TO USE
              </span>
              {openAccordion === 'how_to_use' ? (
                <ChevronUp className="w-4 h-4 text-[#B5893D]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#B5893D]" />
              )}
            </button>
            {openAccordion === 'how_to_use' && (
              <div className="pb-4 text-xs text-[#4A4A4A] leading-relaxed space-y-1.5">
                <p>
                  1. Verify the intact factory seal &amp; IMEI/serial number on the box matching your GST tax invoice.
                </p>
                <p>
                  2. Power on and follow guided data migration (iCloud / Android Quick Switch) to transfer apps and contacts seamlessly.
                </p>
                <p>
                  3. Use an official BIS-certified fast adapter and activate brand warranty using your invoice date.
                </p>
              </div>
            )}
          </div>

          {/* LEGAL INFORMATION */}
          <div>
            <button
              type="button"
              onClick={() => toggleAccordion('legal')}
              className="w-full py-4 flex items-center justify-between text-left cursor-pointer group"
            >
              <span className="text-xs sm:text-sm font-medium uppercase tracking-[0.14em] text-[#1A1A1A] group-hover:text-[#B5893D] transition-colors">
                LEGAL INFORMATION
              </span>
              {openAccordion === 'legal' ? (
                <ChevronUp className="w-4 h-4 text-[#B5893D]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#B5893D]" />
              )}
            </button>
            {openAccordion === 'legal' && (
              <div className="pb-4 text-xs text-[#4A4A4A] leading-relaxed space-y-1.5">
                <p>
                  <strong>Authorized Retailer:</strong> {storeSettings.businessName || 'Charlie Mobiles & Accessories'}
                </p>
                <p>
                  <strong>Showroom Address:</strong> {storeSettings.address || 'Raipur, Chhattisgarh'}
                </p>
                <p>
                  All prices include applicable GST. Warranty claims are honored nationwide at authorized service centers.
                </p>
              </div>
            )}
          </div>

          {/* FAQS */}
          <div>
            <button
              type="button"
              onClick={() => toggleAccordion('faqs')}
              className="w-full py-4 flex items-center justify-between text-left cursor-pointer group"
            >
              <span className="text-xs sm:text-sm font-medium uppercase tracking-[0.14em] text-[#1A1A1A] group-hover:text-[#B5893D] transition-colors">
                FAQS
              </span>
              {openAccordion === 'faqs' ? (
                <ChevronUp className="w-4 h-4 text-[#B5893D]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#B5893D]" />
              )}
            </button>
            {openAccordion === 'faqs' && (
              <div className="pb-4 space-y-3 text-xs text-[#4A4A4A]">
                <div>
                  <p className="font-bold text-[#1A1A1A]">Is this 100% genuine with GST bill?</p>
                  <p>Yes, every device is factory-sealed with an official GST tax invoice.</p>
                </div>
                <div>
                  <p className="font-bold text-[#1A1A1A]">Do I get 5% extra discount on prepaid?</p>
                  <p>Yes, UPI &amp; online prepaid orders unlock 5% extra instant savings at checkout.</p>
                </div>
                <div>
                  <p className="font-bold text-[#1A1A1A]">How fast is local delivery or pickup?</p>
                  <p>Same-day showroom pickup &amp; local express dispatch available via WhatsApp concierge.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 3. "CELEBRITY PICKS" 2-COLUMN VERTICAL VIDEO GRID (EXACT VIDEO 00:01 - 00:05) */}
        {activeReels.length > 0 && (
          <section className="space-y-5 pt-2">
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-semibold text-center text-[#1A1A1A]">
              Celebrity Picks
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {activeReels.map((reel) => {
                const linkedProduct =
                  products.find((p) => p.id === reel.linkedProductId) || product;
                const isMuted = unmutedReelId !== reel.id;

                return (
                  <div
                    key={reel.id}
                    className="relative aspect-[9/16] bg-[#1A1A1A] overflow-hidden border border-[#EAE5DC] group"
                  >
                    <video
                      src={reel.videoUrl}
                      poster={reel.posterUrl || linkedProduct.mainImage}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted={isMuted}
                      loop
                      playsInline
                      preload="auto"
                    />

                    {/* Subtle Top-Right Audio Control */}
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

                    {/* Overlaid Crisp White Mini Product Card (Exact Video 00:01 - 00:05) */}
                    <Link
                      to={`/product/${linkedProduct.id}`}
                      className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-sm p-2 shadow-lg flex items-center gap-2 hover:bg-white transition-colors"
                    >
                      <div className="w-9 h-9 bg-[#F5F5F5] p-1 shrink-0 flex items-center justify-center">
                        <SmartImage
                          src={linkedProduct.mainImage}
                          alt={linkedProduct.name}
                          brand={linkedProduct.brand}
                          category={linkedProduct.category}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold text-[#1A1A1A] line-clamp-2 leading-snug">
                          {linkedProduct.name}
                        </p>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 4. LUXURY MANDALA QUOTE TESTIMONIALS CARD (EXACT VIDEO 00:02, 00:05 - 00:06) */}
        {activeQuote && (
          <section className="relative bg-[#FAF7F2] border border-[#EAE5DC] px-6 py-8 sm:px-12 sm:py-10 text-center overflow-hidden">
            {/* Subtle Radial Ornamental Pattern */}
            <div
              className="absolute inset-0 opacity-[0.07] pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at center, #B5893D 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            <div className="relative max-w-xl mx-auto space-y-4">
              <Quote className="w-6 h-6 text-[#B5893D] mx-auto opacity-80" />
              <p className="font-serif-luxury text-base sm:text-xl italic text-[#1A1A1A] leading-relaxed">
                &ldquo;{activeQuote.quote}&rdquo;
              </p>
              <div className="pt-1">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#B5893D]">
                  {activeQuote.authorName}
                </p>
                <p className="text-[11px] text-[#666666]">{activeQuote.authorRole}</p>
              </div>

              {testimonials.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 pt-2">
                  {testimonials.map((t, idx) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setQuoteIdx(idx)}
                      aria-label={`Testimonial ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        quoteIdx === idx ? 'w-5 bg-[#B5893D]' : 'w-1.5 bg-[#D4CFC7]'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* 5. MEDIA COVERAGE STRIP (EXACT VIDEO 00:07 - 00:08) */}
        <section className="space-y-4 text-center py-2">
          <h2 className="font-serif-luxury text-xl sm:text-2xl font-semibold text-[#1A1A1A]">
            Media Coverage
          </h2>
          <div className="flex items-center justify-center gap-8 sm:gap-14 py-2 text-[#1A1A1A]/85 select-none">
            <span className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-tight">
              Forbes
            </span>
            <span className="font-serif-luxury text-xl sm:text-2xl font-normal tracking-[0.28em] uppercase">
              ELLE
            </span>
            <span className="font-serif-luxury text-xl sm:text-2xl font-semibold tracking-[0.14em] uppercase">
              GRAZIA
            </span>
          </div>
        </section>

        {/* 6. SIMILAR PRODUCTS GRID (EXACT VIDEO 00:08 - 00:09) */}
        {similarProducts.length > 0 && (
          <section className="space-y-5 pt-2 border-t border-[#E5E0D8]">
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-semibold text-center text-[#1A1A1A] pt-4">
              Similar Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* 7. "LOVED BY 1000+ CUSTOMERS ACROSS INDIA" REVIEWS & TRUST SECTION (EXACT VIDEO 00:10 - 00:11) */}
        <section className="pt-6 border-t border-[#E5E0D8] max-w-3xl mx-auto space-y-5">
          <div className="text-center space-y-2">
            <h2 className="font-serif-luxury text-xl sm:text-2xl text-[#1A1A1A] leading-snug">
              Loved by{' '}
              <span className="font-bold">1000+ Customers</span>{' '}
              <span className="block sm:inline">Across India</span>
            </h2>

            <div className="flex items-center justify-center gap-2 pt-1">
              <div className="flex items-center gap-0.5 text-[#D4AF37]">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <Star key={idx} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>
              <span className="text-sm font-bold text-[#1A1A1A] tabular-nums">
                {displayAggregateScore} out of 5
              </span>
            </div>

            <p className="text-xs text-[#666666]">
              Based on {product.reviewCount || displayedReviews.length} verified reviews
            </p>
          </div>

          {/* Full-Width Outlined "Write a review" Button */}
          <button
            type="button"
            onClick={() => setWriteReviewOpen((v) => !v)}
            className="w-full h-11 border border-[#B5893D] bg-white hover:bg-[#FAF7F2] text-[#B5893D] text-xs sm:text-sm font-semibold tracking-wide transition-colors cursor-pointer"
          >
            {writeReviewOpen ? 'Close Review Form' : 'Write a review'}
          </button>

          {/* Interactive Review Composer */}
          {writeReviewOpen && (
            <form
              onSubmit={handleReviewSubmit}
              className="border border-[#B5893D]/40 bg-[#FAF7F2] p-4 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-[#1A1A1A]">
                  Share Your Experience
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setReviewRating(starVal)}
                      className="p-0.5 cursor-pointer"
                      aria-label={`Rate ${starVal} stars`}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          starVal <= reviewRating
                            ? 'fill-[#D4AF37] text-[#D4AF37]'
                            : 'text-[#D4CFC7]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                value={reviewAuthor}
                onChange={(e) => setReviewAuthor(e.target.value)}
                placeholder="Your Name (leave empty for Anonymous)"
                className="w-full h-9 px-3 bg-white border border-[#D4CFC7] focus:border-[#B5893D] focus:outline-none select-text"
              />

              <textarea
                rows={3}
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Write your review about product quality, delivery, and showroom experience..."
                className="w-full p-3 bg-white border border-[#D4CFC7] focus:border-[#B5893D] focus:outline-none select-text"
              />

              <button
                type="submit"
                className="w-full h-10 bg-[#1A1A1A] hover:bg-[#B5893D] text-white font-bold uppercase tracking-wider cursor-pointer transition-colors"
              >
                Publish Verified Review
              </button>
            </form>
          )}

          {/* Sort Filter Row */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-semibold text-[#666666]">
              Showing {displayedReviews.length} Customer Reviews
            </span>
            <select
              value={reviewSort}
              onChange={(e) => setReviewSort(e.target.value as 'recent' | 'highest')}
              aria-label="Sort reviews"
              className="h-8 px-2.5 border border-[#D4CFC7] bg-white text-xs font-medium text-[#1A1A1A] focus:outline-none focus:border-[#B5893D] cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
            </select>
          </div>

          {/* Verified Customer Review Cards */}
          <div className="space-y-3">
            {displayedReviews.map((rev) => (
              <div
                key={rev.id}
                className="border border-[#EAE5DC] bg-white p-4 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#EAE5DC] flex items-center justify-center text-[#B5893D] shrink-0">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-[#1A1A1A]">{rev.author}</span>
                        {rev.verifiedBuyer && (
                          <span className="px-1.5 py-0.5 bg-[#1A1A1A] text-white text-[9px] font-bold uppercase tracking-wider">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5 text-[#D4AF37] mt-1">
                        {[0, 1, 2, 3, 4].map((idx) => (
                          <Star
                            key={idx}
                            className={`w-3 h-3 ${
                              idx < rev.rating
                                ? 'fill-[#D4AF37] text-[#D4AF37]'
                                : 'text-[#E5E0D8]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#8C8C8C] tabular-nums shrink-0">
                    {rev.date}
                  </span>
                </div>

                <p className="text-xs text-[#1A1A1A] leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 8. STICKY BOTTOM ACTION BAR (EXACT VIDEO 00:00 - 00:11) */}
      <div className="fixed bottom-14 md:bottom-0 left-0 right-0 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        {/* Top Offer Strip */}
        <div className="bg-[#FAF7F2] border-t border-[#E5E0D8] py-1 px-3 text-center text-[11px] font-medium text-[#1A1A1A]">
          Save 5% Extra on Prepaid Orders
        </div>

        {/* Solid Black Full-Width Add To Cart / Notify CTA */}
        {isOutOfStock ? (
          <button
            type="button"
            onClick={() => setActiveNotifyModalProduct(product)}
            className="w-full h-12 bg-[#1A1A1A] hover:bg-[#B5893D] text-white text-xs sm:text-sm font-bold uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
            <span>NOTIFY ME &mdash; {formattedPrice}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              addToCart(product, quantity, activeColor.name, selectedRam, selectedStorage)
            }
            className="w-full h-12 bg-[#000000] hover:bg-[#1A1A1A] text-white text-xs sm:text-sm font-bold uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition-colors cursor-pointer tabular-nums"
          >
            <span>
              ADD TO CART &mdash; {formattedPrice}
            </span>
          </button>
        )}
      </div>

      {/* WhatsApp Express Order Modal */}
      <WhatsAppOrderModal
        isOpen={waModalOpen}
        onClose={() => setWaModalOpen(false)}
        mode="single_product"
        singleProduct={{
          product,
          variant: variantSummary,
          selectedColor: activeColor.name,
          selectedRam,
          selectedStorage,
          unitPrice: effectivePrice,
          quantity,
        }}
      />

      {/* FULL-SCREEN IMAGE ZOOM MODAL */}
      {zoomOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col justify-between p-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setZoomOpen(false)}
              aria-label="Close zoom"
              className="w-10 h-10 border border-[#E5E0D8] flex items-center justify-center text-[#1A1A1A] cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <span className="text-xs font-bold text-[#666666] tabular-nums">
              {activeImageIdx + 1}/{galleryImages.length}
            </span>
            <div className="w-10" />
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4">
            <button
              type="button"
              onClick={() =>
                setActiveImageIdx(
                  (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
                )
              }
              className="absolute left-1 w-9 h-9 bg-[#FAF7F2] border border-[#E5E0D8] flex items-center justify-center text-[#1A1A1A] cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <SmartImage
              src={galleryImages[activeImageIdx] || galleryImages[0]}
              alt={product.name}
              brand={product.brand}
              category={product.category}
              className="max-h-[70vh] w-auto object-contain"
            />

            <button
              type="button"
              onClick={() =>
                setActiveImageIdx((prev) => (prev + 1) % galleryImages.length)
              }
              className="absolute right-1 w-9 h-9 bg-[#FAF7F2] border border-[#E5E0D8] flex items-center justify-center text-[#1A1A1A] cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 pb-4">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIdx(idx)}
                className={`w-14 h-14 border p-1 cursor-pointer ${
                  activeImageIdx === idx ? 'border-[#B5893D]' : 'border-[#E5E0D8]'
                }`}
              >
                <SmartImage
                  src={img}
                  alt="Thumbnail"
                  brand={product.brand}
                  category={product.category}
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
