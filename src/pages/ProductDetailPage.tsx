import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Heart,
  MapPin,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Store,
  Truck,
  X,
  Zap,
  ZoomIn,
} from 'lucide-react';
import { formatINR, useStore } from '../context/StoreContext';
import { SmartImage } from '../components/SmartImage';
import { ProductCard } from '../components/ProductCard';
import { generateProductStudioSvg, VisualAngle } from '../utils/productVisuals';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    products,
    addToCart,
    wishlist,
    toggleWishlist,
    storeSettings,
    openWhatsAppEnquiry,
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
  const [zoomOpen, setZoomOpen] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [pinStatus, setPinStatus] = useState<string | null>(null);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [localReviews, setLocalReviews] = useState(product?.reviews || []);

  // Reset variant selections when switching product ID
  React.useEffect(() => {
    if (!product) return;
    setSelectedColorIdx(0);
    setSelectedRam(product.ramOptions[0] || 'Standard');
    setSelectedStorage(product.storageOptions[0] || 'Standard');
    setQuantity(1);
    setActiveImageIdx(0);
    setLocalReviews(product.reviews || []);
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-bold">Product Not Found</h2>
        <Link to="/products" className="mt-4 inline-block text-sm text-[#2563EB] underline">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const activeColor = product.colors[selectedColorIdx] || {
    name: 'Standard',
    hex: '#1E293B',
  };

  // Compute dynamic gallery images that adapt to the selected color finish
  const galleryImages = useMemo(() => {
    const angles: VisualAngle[] = ['front_back', 'front_display', 'back_camera', 'side_profile'];
    const generatedForColor = angles.map((angle) =>
      generateProductStudioSvg({
        title: `${product.name} (${activeColor.name})`,
        brand: product.brand,
        category: product.category,
        primaryHex: activeColor.hex,
        secondaryHex: '#00C2FF',
        angle,
      })
    );
    if (product.mainImage && !product.mainImage.startsWith('data:image/svg+xml')) {
      return [product.mainImage, ...(product.gallery || []), ...generatedForColor.slice(0, 2)];
    }
    return generatedForColor;
  }, [product, activeColor]);

  const storageIdx = Math.max(0, product.storageOptions.indexOf(selectedStorage));
  const effectivePrice = product.price + storageIdx * 10000;
  const effectiveMrp = product.mrp + storageIdx * 10000;
  const discountPercent =
    effectiveMrp > effectivePrice
      ? Math.round(((effectiveMrp - effectivePrice) / effectiveMrp) * 100)
      : 0;

  const isWishlisted = wishlist.includes(product.id);
  const variantSummary = [
    activeColor.name,
    selectedRam !== 'Standard' ? selectedRam : null,
    selectedStorage !== 'Standard' ? selectedStorage : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const similarProducts = products
    .filter(
      (p) =>
        p.id !== product.id &&
        p.category !== product.category &&
        Math.abs(p.price - product.price) <= 35000
    )
    .slice(0, 4);

  const handleBuyNow = () => {
    addToCart(product, quantity, activeColor.name, selectedRam, selectedStorage);
    navigate('/checkout');
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.trim().length < 6) {
      setPinStatus('Please enter a valid 6-digit PIN code.');
      return;
    }
    setPinStatus(
      `Express Same-Day Store Pickup & Doorstep Delivery available for PIN ${pinCode}.`
    );
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;
    setLocalReviews((prev) => [
      {
        id: `rev_${Date.now()}`,
        author: reviewAuthor.trim(),
        rating: reviewRating,
        date: 'Just now',
        comment: reviewComment.trim(),
        verifiedBuyer: true,
      },
      ...prev,
    ]);
    setReviewAuthor('');
    setReviewComment('');
    showToast('Thank you! Your review has been posted.');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-28 md:pb-12 space-y-8">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'Product',
            name: product.name,
            brand: { '@type': 'Brand', name: product.brand },
            description: product.description,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'INR',
              price: effectivePrice,
              availability:
                product.stock > 0
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
            },
          }),
        }}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#737373] overflow-x-auto no-scrollbar">
        <Link to="/" className="hover:text-[#171717] shrink-0">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link
          to={`/products?category=${product.category}`}
          className="hover:text-[#171717] capitalize shrink-0"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="font-semibold text-[#171717] truncate">{product.name}</span>
      </nav>

      {/* Main Contiguous Purchase Module (2-Column Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left: Sticky Product Image Gallery */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 bg-white rounded-3xl border border-[#E5E7EB] p-4 sm:p-6">
          <div className="relative aspect-square rounded-2xl bg-[#F8FAFC] flex items-center justify-center overflow-hidden p-4">
            <SmartImage
              src={galleryImages[activeImageIdx] || galleryImages[0]}
              alt={`${product.name} - ${activeColor.name}`}
              brand={product.brand}
              category={product.category}
              primaryHex={activeColor.hex}
              className="w-full h-full object-contain transition-all duration-200"
            />

            {/* Wishlist & Zoom Buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label="Toggle Wishlist"
                className="w-10 h-10 rounded-full bg-white shadow-sm border border-[#E5E7EB] flex items-center justify-center hover:text-[#2563EB] cursor-pointer"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-[#171717]'
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={() => setZoomOpen(true)}
                aria-label="Zoom Image"
                className="w-10 h-10 rounded-full bg-white shadow-sm border border-[#E5E7EB] flex items-center justify-center text-[#171717] hover:text-[#2563EB] cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="mt-4 grid grid-cols-4 gap-2.5">
            {galleryImages.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIdx(idx)}
                className={`aspect-square rounded-xl border p-1.5 bg-[#F8FAFC] overflow-hidden cursor-pointer transition-all ${
                  activeImageIdx === idx
                    ? 'border-[#2563EB] ring-2 ring-[#2563EB]/20'
                    : 'border-[#E5E7EB] hover:border-slate-300'
                }`}
              >
                <SmartImage
                  src={imgUrl}
                  alt={`${product.name} angle ${idx + 1}`}
                  brand={product.brand}
                  category={product.category}
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Contiguous Product Details & Variant Configurator */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E5E7EB] p-5 sm:p-7 space-y-6">
          {/* Header Metadata & Title */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#737373]">
              <span className="uppercase tracking-wider text-[#2563EB] font-bold">
                {product.brand}
              </span>
              <span>·</span>
              <span>{product.is5G ? '5G Smartphone' : product.category}</span>
              <span>·</span>
              <span className={product.stock > 0 ? 'text-emerald-600 font-bold' : 'text-rose-600'}>
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </span>
            </div>

            <h1 className="mt-1.5 text-xl sm:text-3xl font-extrabold text-[#171717] leading-tight">
              {product.name}
            </h1>

            <p className="mt-1 text-xs font-medium text-[#737373]">
              Selected Configuration: <strong className="text-[#171717]">{variantSummary}</strong>
            </p>

            {/* Rating Line */}
            <div className="mt-2.5 flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 font-bold text-[#171717] tabular-nums">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-[#737373] font-medium">
                  ({product.reviewCount + localReviews.length} Verified Ratings)
                </span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-700 font-semibold">{product.warranty}</span>
            </div>
          </div>

          {/* Price & EMI Box */}
          <div className="p-4 rounded-2xl bg-[#F5F6F8] border border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-2.5 tabular-nums">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
                  {formatINR(effectivePrice)}
                </span>
                {effectiveMrp > effectivePrice && (
                  <>
                    <span className="text-sm text-[#737373] line-through">
                      MRP {formatINR(effectiveMrp)}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-600">
                      Save {formatINR(effectiveMrp - effectivePrice)} ({discountPercent}% OFF)
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-[#737373] mt-0.5">
                Inclusive of all GST taxes · Official GST Invoice Provided
              </p>
            </div>

            <div className="text-xs sm:text-right">
              <p className="font-bold text-[#171717]">
                No-Cost EMI from {formatINR(product.emiStartingAt)}/mo
              </p>
              {product.exchangeBonus > 0 && (
                <p className="text-[#2563EB] font-semibold">
                  + Up to {formatINR(product.exchangeBonus)} Exchange Bonus
                </p>
              )}
            </div>
          </div>

          {/* Variant Selectors: Color, RAM, Storage */}
          <div className="space-y-4">
            {/* Color Options */}
            {product.colors.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-2">
                  Color: <span className="text-[#2563EB]">{activeColor.name}</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((c, idx) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColorIdx(idx)}
                      className={`min-h-[40px] px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        selectedColorIdx === idx
                          ? 'border-[#2563EB] bg-blue-50/70 text-[#2563EB]'
                          : 'border-[#E5E7EB] bg-white text-[#171717] hover:border-slate-300'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-slate-300 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* RAM & Storage Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.ramOptions[0] !== 'Standard' && (
                <div>
                  <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-2">
                    RAM Memory
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.ramOptions.map((ram) => (
                      <button
                        key={ram}
                        type="button"
                        onClick={() => setSelectedRam(ram)}
                        className={`min-h-[40px] px-3.5 py-1.5 rounded-xl border text-xs font-bold cursor-pointer ${
                          selectedRam === ram
                            ? 'border-[#2563EB] bg-[#101114] text-white'
                            : 'border-[#E5E7EB] bg-white text-[#171717]'
                        }`}
                      >
                        {ram}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.storageOptions[0] !== 'Standard' && (
                <div>
                  <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-2">
                    Internal Storage
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.storageOptions.map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setSelectedStorage(st)}
                        className={`min-h-[40px] px-3.5 py-1.5 rounded-xl border text-xs font-bold cursor-pointer ${
                          selectedStorage === st
                            ? 'border-[#2563EB] bg-[#101114] text-white'
                            : 'border-[#E5E7EB] bg-white text-[#171717]'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Primary Purchase Controls (Desktop & Tablet Inline) */}
          <div className="pt-2 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  addToCart(product, quantity, activeColor.name, selectedRam, selectedStorage)
                }
                disabled={product.stock <= 0}
                className="min-h-[48px] px-5 py-3 rounded-xl bg-[#101114] hover:bg-slate-800 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="min-h-[48px] px-5 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Direct WhatsApp Product Enquiry Button */}
            <button
              type="button"
              onClick={() =>
                openWhatsAppEnquiry({
                  productName: product.name,
                  price: effectivePrice,
                  variant: variantSummary,
                  quantity,
                })
              }
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/15 border border-emerald-600/30 text-emerald-800 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>
                Enquire on WhatsApp (Live Store Deal &amp; Instant Stock Check)
              </span>
            </button>
          </div>

          {/* Delivery, Store Pickup & Exchange Perks */}
          <div className="pt-4 border-t border-[#E5E7EB] space-y-3">
            <form onSubmit={handleCheckPincode} className="flex items-center gap-2">
              <div className="relative flex-1">
                <MapPin className="w-4 h-4 text-[#2563EB] absolute left-3 top-2.5" />
                <input
                  type="text"
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Enter 6-digit Delivery PIN Code"
                  className="w-full h-9 pl-9 pr-3 rounded-xl border border-[#E5E7EB] text-xs font-medium focus:outline-none focus:border-[#2563EB]"
                />
              </div>
              <button
                type="submit"
                className="h-9 px-4 rounded-xl bg-[#101114] text-white text-xs font-bold cursor-pointer"
              >
                Check
              </button>
            </form>
            {pinStatus && (
              <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{pinStatus}</span>
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#F5F6F8] flex items-start gap-2.5">
                <Store className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#171717]">Store Pickup Ready</p>
                  <p className="text-[11px] text-[#737373]">Pickup in 30 mins at Charlie Mobile</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#F5F6F8] flex items-start gap-2.5">
                <RefreshCw className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#171717]">Smart Exchange</p>
                  <p className="text-[11px] text-[#737373]">
                    Up to {formatINR(product.exchangeBonus || 4000)} bonus on old phone
                  </p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#F5F6F8] flex items-start gap-2.5">
                <CreditCard className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#171717]">No-Cost EMI</p>
                  <p className="text-[11px] text-[#737373]">3/6/9/12 Months Easy EMI</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description & Technical Specifications */}
          <div className="pt-4 border-t border-[#E5E7EB] space-y-4">
            <div>
              <h2 className="text-sm font-extrabold text-[#171717] uppercase tracking-wider">
                Product Overview
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-[#737373] leading-relaxed">
                {product.description}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-[#171717] uppercase tracking-wider mb-2.5">
                Technical Specifications
              </h3>
              <div className="rounded-2xl border border-[#E5E7EB] divide-y divide-[#E5E7EB] overflow-hidden text-xs">
                {Object.entries(product.specs || {}).map(([key, val]) => (
                  <div
                    key={key}
                    className="grid grid-cols-3 p-3 bg-white odd:bg-[#F5F6F8]/60 gap-2"
                  >
                    <span className="font-semibold text-[#737373]">{key}</span>
                    <span className="col-span-2 font-bold text-[#171717]">{val}</span>
                  </div>
                ))}
                <div className="grid grid-cols-3 p-3 bg-white gap-2">
                  <span className="font-semibold text-[#737373]">Warranty</span>
                  <span className="col-span-2 font-bold text-emerald-700">
                    {product.warranty} ({storeSettings.businessName} Authorized Invoice)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="bg-white rounded-3xl border border-[#E5E7EB] p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-lg font-extrabold text-[#171717]">Customer Reviews</h2>
            <p className="text-xs text-[#737373]">
              Verified feedback from Charlie Mobile shoppers
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#171717] tabular-nums">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span>{product.rating.toFixed(1)} / 5.0</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-3">
            {localReviews.length === 0 ? (
              <p className="text-xs text-[#737373]">
                Be the first to review {product.name} purchased from Charlie Mobile!
              </p>
            ) : (
              localReviews.map((r) => (
                <div key={r.id} className="p-4 rounded-2xl bg-[#F5F6F8] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#171717]">{r.author}</span>
                    <span className="text-[#737373]">{r.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-[#171717] leading-relaxed">{r.comment}</p>
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={handleAddReview}
            className="lg:col-span-5 bg-[#F5F6F8] p-4 rounded-2xl space-y-3"
          >
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#171717]">
              Write a Customer Review
            </h3>
            <input
              type="text"
              required
              value={reviewAuthor}
              onChange={(e) => setReviewAuthor(e.target.value)}
              placeholder="Your Name"
              className="w-full h-9 px-3 rounded-xl bg-white border border-[#E5E7EB] text-xs"
            />
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold">Rating:</span>
              {[5, 4, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setReviewRating(num)}
                  className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${
                    reviewRating === num
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-white border border-[#E5E7EB]'
                  }`}
                >
                  {num} ★
                </button>
              ))}
            </div>
            <textarea
              required
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share your experience with camera, battery, or delivery..."
              className="w-full p-3 rounded-xl bg-white border border-[#E5E7EB] text-xs"
            />
            <button
              type="submit"
              className="w-full h-9 rounded-xl bg-[#101114] text-white text-xs font-bold cursor-pointer"
            >
              Submit Review
            </button>
          </form>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#171717]">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#171717]">
            Similar Price Range Recommendations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Bottom Purchase Bar on Mobile */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 z-30 bg-white border-t border-[#E5E7EB] px-3 py-2 flex items-center justify-between gap-2 shadow-lg">
        <div>
          <p className="text-xs text-[#737373] truncate max-w-[120px]">{activeColor.name}</p>
          <p className="text-base font-extrabold text-[#171717] tabular-nums">
            {formatINR(effectivePrice)}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            type="button"
            onClick={() =>
              addToCart(product, quantity, activeColor.name, selectedRam, selectedStorage)
            }
            className="h-10 px-3.5 rounded-xl bg-[#101114] text-white text-xs font-bold whitespace-nowrap"
          >
            Add to Cart
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="h-10 px-4 rounded-xl bg-[#2563EB] text-white text-xs font-bold whitespace-nowrap"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Fullscreen Image Zoom Modal */}
      {zoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6">
            <button
              type="button"
              onClick={() => setZoomOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-square max-h-[75vh] mx-auto flex items-center justify-center">
              <SmartImage
                src={galleryImages[activeImageIdx] || galleryImages[0]}
                alt={product.name}
                brand={product.brand}
                category={product.category}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
