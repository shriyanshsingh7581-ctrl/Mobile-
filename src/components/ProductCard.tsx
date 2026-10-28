import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Heart, MessageCircle, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../types/store';
import { formatINR, useStore } from '../context/StoreContext';
import { SmartImage } from './SmartImage';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const { addToCart, wishlist, toggleWishlist, openWhatsAppEnquiry } = useStore();
  const isWishlisted = wishlist.includes(product.id);
  const discountPercent =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;
  const savingsAmount = Math.max(0, product.mrp - product.price);

  // Format title in Poorvika's exact style: "Product Name (Color, RAM-Storage)"
  const primaryColor = product.colors[0]?.name || '';
  const primaryRam =
    product.ramOptions[0] && product.ramOptions[0] !== 'Standard'
      ? product.ramOptions[0]
      : '';
  const primaryStorage =
    product.storageOptions[0] && product.storageOptions[0] !== 'Standard'
      ? product.storageOptions[0]
      : '';
  const specSuffix = [
    primaryColor,
    [primaryRam, primaryStorage].filter(Boolean).join('-'),
  ]
    .filter(Boolean)
    .join(', ');

  const displayTitle =
    product.name.includes('(') || !specSuffix
      ? product.name
      : `${product.name} (${specSuffix})`;

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#F26522] transition-all duration-150 hover:shadow-md overflow-hidden h-full">
      {/* Top Row Overlay: Poorvika Discount Badge + Wishlist Heart */}
      <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between pointer-events-none">
        {discountPercent > 0 ? (
          <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-[#F26522] to-[#EA580C] text-white text-[10px] font-extrabold tracking-tight tabular-nums shadow-2xs">
            {discountPercent}% OFF
          </span>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="pointer-events-auto w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 border border-[#E5E7EB] shadow-2xs flex items-center justify-center text-[#171717] hover:text-rose-500 transition-colors cursor-pointer"
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
              isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-[#737373]'
            }`}
          />
        </button>
      </div>

      {/* Pure White Studio Product Image Container (Poorvika Signature) */}
      <Link
        to={`/product/${product.id}`}
        className={`relative bg-white flex items-center justify-center overflow-hidden border-b border-[#F1F5F9] ${
          compact ? 'aspect-[4/3] p-2' : 'aspect-square p-2.5 sm:p-3.5'
        }`}
      >
        <SmartImage
          src={product.mainImage}
          alt={displayTitle}
          brand={product.brand}
          category={product.category}
          primaryHex={product.colors[0]?.hex}
          className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
        />
      </Link>

      {/* Product Details Body */}
      <div className="flex flex-col flex-1 p-2.5 sm:p-3.5 justify-between gap-2">
        <div>
          {/* Brand + Stock Status Row */}
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] font-semibold text-[#737373] truncate">
            <span className="uppercase tracking-wider font-extrabold text-[#F26522]">
              {product.brand}
            </span>
            <span className="inline-flex items-center gap-0.5 text-emerald-700 font-bold">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
            </span>
          </div>

          {/* Poorvika-Style Full Title with (Color, RAM-Storage) */}
          <Link
            to={`/product/${product.id}`}
            className="mt-1 block text-xs sm:text-[13px] font-bold text-[#171717] group-hover:text-[#F26522] transition-colors line-clamp-2 leading-snug min-h-[2.25rem]"
          >
            {displayTitle}
          </Link>

          {/* Rating + Color Swatches */}
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#737373]">
            <div className="flex items-center gap-1 tabular-nums">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-[#171717]">{product.rating.toFixed(1)}</span>
              <span className="text-[10px]">({product.reviewCount})</span>
            </div>

            {product.colors.length > 0 && (
              <div className="flex items-center gap-1" title={`${product.colors.length} colors`}>
                {product.colors.slice(0, 4).map((c) => (
                  <span
                    key={c.name}
                    className="w-2.5 h-2.5 rounded-full border border-slate-300"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pricing Block + EMI + Action Buttons */}
        <div className="pt-2 border-t border-[#E5E7EB]/80 space-y-2">
          <div>
            <div className="flex items-baseline gap-1.5 flex-wrap tabular-nums">
              <span className="text-sm sm:text-base font-extrabold text-[#171717]">
                {formatINR(product.price)}
              </span>
              {product.mrp > product.price && (
                <span className="text-[11px] line-through text-[#737373]">
                  {formatINR(product.mrp)}
                </span>
              )}
            </div>
            <p className="text-[10px] font-bold text-emerald-700 tabular-nums truncate">
              {savingsAmount > 0
                ? `Save ${formatINR(savingsAmount)} · EMI ${formatINR(product.emiStartingAt)}/m`
                : `No-Cost EMI from ${formatINR(product.emiStartingAt)}/m`}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => addToCart(product, 1)}
              disabled={product.stock <= 0}
              className="flex-1 h-8 sm:h-9 px-2.5 rounded-xl bg-[#101114] hover:bg-[#F26522] disabled:bg-slate-300 text-white text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
            </button>

            <button
              type="button"
              onClick={() =>
                openWhatsAppEnquiry({
                  productName: displayTitle,
                  price: product.price,
                  variant: specSuffix || 'Standard',
                  quantity: 1,
                })
              }
              aria-label="Enquire on WhatsApp"
              title="Enquire on WhatsApp (8818850488)"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
