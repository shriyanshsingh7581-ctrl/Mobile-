import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Heart,
  MapPin,
  MessageCircle,
  RefreshCw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Star,
  X,
  Zap,
} from 'lucide-react';
import { formatINR, useStore } from '../context/StoreContext';
import { SmartImage } from '../components/SmartImage';
import { ProductCard } from '../components/ProductCard';
import { WhatsAppOrderModal } from '../components/WhatsAppOrderModal';
import { generateProductStudioSvg, VisualAngle } from '../utils/productVisuals';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    products,
    addToCart,
    wishlist,
    toggleWishlist,
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
  const [waModalOpen, setWaModalOpen] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [pinStatus, setPinStatus] = useState<string | null>(null);

  React.useEffect(() => {
    if (!product) return;
    setSelectedColorIdx(0);
    setSelectedRam(product.ramOptions[0] || 'Standard');
    setSelectedStorage(product.storageOptions[0] || 'Standard');
    setQuantity(1);
    setActiveImageIdx(0);
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-bold">Product Not Found</h2>
        <Link to="/products" className="mt-4 inline-block text-sm text-[#F26522] underline">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const activeColor = product.colors[selectedColorIdx] || {
    name: 'Standard',
    hex: '#1E293B',
  };

  const galleryImages = useMemo(() => {
    const angles: VisualAngle[] = ['front_back', 'front_display'];
    const generatedForColor = angles.map((angle) =>
      generateProductStudioSvg({
        title: `${product.name} (${activeColor.name})`,
        brand: product.brand,
        category: product.category,
        primaryHex: activeColor.hex,
        secondaryHex: '#F26522',
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

  const isWishlisted = wishlist.includes(product.id);
  const variantSummary = [
    activeColor.name,
    selectedRam !== 'Standard' ? selectedRam : null,
    selectedStorage !== 'Standard' ? selectedStorage : null,
  ]
    .filter(Boolean)
    .join(', ');

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const handleBuyNow = () => {
    addToCart(product, quantity, activeColor.name, selectedRam, selectedStorage);
    navigate('/checkout');
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.trim().length < 6) {
      setPinStatus('Please enter a valid 6-digit Pincode.');
      return;
    }
    setPinStatus(`Express Delivery & Instant Store Pickup available at ${pinCode}.`);
  };

  const specEntries = Object.entries(product.specs || {});
  const formattedPrice = formatINR(effectivePrice).replace('₹', '₹ ');
  const formattedMrp = formatINR(effectiveMrp).replace('₹', '₹ ');

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 space-y-4">
        {/* Product Image Gallery with Top-Right Heart & Share Icons + Dot Indicators (Exact Video 00:47 - 00:50) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 relative bg-white border-b lg:border border-slate-200 lg:rounded-xl p-4">
            {/* Top-Right Wishlist & Share */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label="Wishlist"
                className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-slate-500 hover:text-rose-500 cursor-pointer"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
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
                className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-slate-500 hover:text-[#F26522] cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Tap Image to Open Fullscreen Zoom Modal (00:48 - 00:49 in Video) */}
            <div
              onClick={() => setZoomOpen(true)}
              className="aspect-square max-h-[320px] mx-auto flex items-center justify-center cursor-zoom-in p-4"
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

            {/* Orange Pill Dot Indicators below Image */}
            <div className="flex items-center justify-center gap-1.5 pt-2">
              {galleryImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  aria-label={`Image ${idx + 1}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    activeImageIdx === idx ? 'w-5 bg-[#F26522]' : 'w-2 bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Product Details Column (Exact Video 00:50 - 00:55) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Title, Orange Rating Pill, Orange Price, Green In Stock */}
            <div className="space-y-1.5">
              <h1 className="text-sm sm:text-xl font-bold text-[#1E293B] leading-snug">
                {product.name} ({variantSummary})
              </h1>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F26522] text-white text-[11px] font-bold">
                  <span>{product.rating.toFixed(1)}</span>
                  <Star className="w-3 h-3 fill-white" />
                </span>
                <span>Product Code: {product.id.replace('prod_', '').toUpperCase()}</span>
              </div>

              {/* Orange Price + Strikethrough MRP + Green In Stock */}
              <div className="pt-1 flex items-baseline gap-2.5 flex-wrap tabular-nums">
                <span className="text-xl sm:text-2xl font-extrabold text-[#F26522]">
                  {formattedPrice}
                </span>
                {effectiveMrp > effectivePrice && (
                  <>
                    <span className="text-xs text-slate-400 line-through">{formattedMrp}</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-[#28A745] text-[11px] font-bold">
                      {discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>

              <p className="text-sm font-extrabold text-[#28A745]">
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>

            {/* Effective Price Dashed Box (Exact Video 00:51) */}
            <div className="rounded-lg border border-dashed border-[#F26522] bg-orange-50/30 p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F26522]" />
                <span className="text-xs font-bold text-[#1E293B]">Effective Price :</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-[#1E293B] tabular-nums">
                  {formattedPrice}
                </span>
                <Link
                  to="/offers"
                  className="block text-[10px] font-semibold text-slate-500 underline"
                >
                  See Offers
                </Link>
              </div>
            </div>

            {/* Direct WhatsApp Order Callout Box */}
            <div className="rounded-xl bg-emerald-50/80 border border-emerald-200 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-[#1E293B]">
                    Order Directly on WhatsApp
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Send this product &amp; variant directly to Charlie Mobile WhatsApp (8818850488)
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
                  className="flex-1 sm:flex-initial px-3 py-2 rounded-lg border border-[#25D366] bg-white text-[#1E293B] hover:bg-emerald-50 text-xs font-extrabold cursor-pointer"
                >
                  1-Click WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setWaModalOpen(true)}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Order on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Color & Storage Selectors */}
            {product.colors.length > 1 && (
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-slate-600">
                  Color: <span className="text-[#1E293B]">{activeColor.name}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c, idx) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColorIdx(idx)}
                      className={`px-3 py-1.5 rounded border text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                        selectedColorIdx === idx
                          ? 'border-[#F26522] bg-orange-50/40 text-[#F26522]'
                          : 'border-slate-200 text-slate-700'
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
                <label className="block text-xs font-bold text-slate-600">Storage</label>
                <div className="flex flex-wrap gap-2">
                  {product.storageOptions.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedStorage(st)}
                      className={`px-3 py-1.5 rounded border text-xs font-bold cursor-pointer ${
                        selectedStorage === st
                          ? 'border-[#F26522] bg-orange-50/40 text-[#F26522]'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Options Pincode Bar (Exact Video 00:52) */}
            <div className="rounded-lg bg-[#F5F6F8] p-3 space-y-2 border border-slate-200">
              <form
                onSubmit={handleCheckPincode}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E293B]">
                  <MapPin className="w-4 h-4 text-[#F26522]" />
                  <span>Delivery Options:</span>
                </div>
                <div className="flex items-center border-b border-slate-400 pb-0.5">
                  <input
                    type="text"
                    maxLength={6}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Delivery Pincode"
                    className="w-28 bg-transparent text-xs focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="text-xs font-bold text-[#F26522] cursor-pointer"
                  >
                    Check
                  </button>
                </div>
              </form>
              {pinStatus && (
                <p className="text-[11px] font-semibold text-[#28A745] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{pinStatus}</span>
                </p>
              )}
            </div>

            {/* Replacement | Warranty | GST Invoice 3-Col Strip (Exact Video 00:52) */}
            <div className="grid grid-cols-3 gap-2 rounded-lg bg-[#FFF5EE] border border-orange-200/70 p-2.5 text-[11px]">
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-[#F26522] shrink-0" />
                <div>
                  <p className="font-bold text-[#1E293B]">Replacement</p>
                  <p className="text-[10px] text-slate-500">in 7 days</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#F26522] shrink-0" />
                <div>
                  <p className="font-bold text-[#1E293B]">Warranty</p>
                  <p className="text-[10px] text-slate-500">in 1 Year</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#F26522] shrink-0" />
                <div>
                  <p className="font-bold text-[#1E293B]">GST Invoice</p>
                  <p className="text-[10px] text-slate-500">Available</p>
                </div>
              </div>
            </div>

            {/* Key Specifications Bullet List (Exact Video 00:52 - 00:53) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#1E293B]">
                <span className="w-2 h-2 rounded-full bg-[#F26522]" />
                <span>Key Specifications</span>
              </div>
              <ul className="space-y-1.5 pl-4 text-xs text-slate-700 list-disc">
                {specEntries.map(([key, val]) => (
                  <li key={key}>
                    <span className="font-semibold text-[#1E293B]">{key}:</span> {val}
                  </li>
                ))}
              </ul>
            </div>

            {/* Overview & Detailed Specs Table */}
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <h2 className="text-xs font-extrabold uppercase tracking-wider bg-slate-100 px-3 py-2 text-[#1E293B]">
                Overview
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed px-1">
                {product.description}
              </p>

              <div className="rounded border border-slate-200 divide-y divide-slate-200 text-xs">
                {specEntries.map(([key, val]) => (
                  <div key={key} className="grid grid-cols-3 p-2.5">
                    <span className="text-slate-500 font-medium">{key}</span>
                    <span className="col-span-2 font-bold text-[#1E293B]">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="pt-4 border-t border-slate-200 space-y-2">
            <h2 className="text-sm sm:text-base font-extrabold text-[#1E293B]">
              Similar Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-l border-slate-200">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* STICKY BOTTOM CTA BAR: WhatsApp Order | Add to Cart | Buy Now */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-2.5 sm:px-4 py-2 flex items-center justify-between gap-2 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <button
          type="button"
          onClick={() => setWaModalOpen(true)}
          className="flex-1 h-11 px-2.5 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <MessageCircle className="w-4 h-4 fill-white shrink-0" />
          <span>WhatsApp Order</span>
        </button>

        <button
          type="button"
          onClick={() =>
            addToCart(product, quantity, activeColor.name, selectedRam, selectedStorage)
          }
          className="flex-1 h-11 px-2.5 rounded-lg border-2 border-[#F26522] text-[#F26522] bg-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 shrink-0" />
          <span>Add to Cart</span>
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 h-11 px-2.5 rounded-lg bg-gradient-to-r from-[#F26522] to-[#EA580C] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Zap className="w-4 h-4 shrink-0" />
          <span>Buy Now</span>
        </button>
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

      {/* FULL-SCREEN IMAGE ZOOM MODAL (Exact Video 00:48 - 00:49 with Top-Left X and "1/2" Counter) */}
      {zoomOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col justify-between p-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setZoomOpen(false)}
              aria-label="Close zoom"
              className="w-10 h-10 rounded-lg border border-slate-300 flex items-center justify-center text-[#F26522] cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <span className="text-xs font-bold text-slate-600 tabular-nums">
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
              className="absolute left-1 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
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
              className="absolute right-1 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
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
                className={`w-14 h-14 rounded border p-1 cursor-pointer ${
                  activeImageIdx === idx ? 'border-[#F26522]' : 'border-slate-200'
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
