import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Heart, Star } from 'lucide-react';
import { Product } from '../types/store';
import { formatINR, useStore } from '../context/StoreContext';
import { SmartImage } from './SmartImage';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

const DEFAULT_TAGLINES: Record<string, string> = {
  iphone: 'TITANIUM / PRO OPTICS / FLAGSHIP',
  samsung: 'GALAXY AI / DYNAMIC AMOLED / 5G',
  vivo: 'ZEISS PORTRAIT / STUDIO / SLIM',
  oppo: 'HASSELBLAD / MASTER EDITION / 5G',
  smartwatches: 'SAPPHIRE / CHRONO / WEARABLE',
  tablets: 'STUDIO DISPLAY / ULTRA SLIM / PRO',
  'tv-audio': 'ACOUSTIC / DOLBY ATMOS / CINEMA',
  'mobile-accessories': 'ARTISANAL / BESPOKE / SIGNATURE',
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { wishlist, toggleWishlist, addToCart, setActiveNotifyModalProduct } = useStore();
  const isWishlisted = wishlist.includes(product.id);
  const isOutOfStock = product.stock <= 0;

  const discountPercent =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  const goldTagline =
    product.goldTagline ||
    DEFAULT_TAGLINES[product.category.toLowerCase()] ||
    `${product.brand.toUpperCase()} / SIGNATURE / EDITION`;

  return (
    <div className="group flex flex-col bg-white h-full select-none">
      {/* 1. Square Warm Alabaster (#F5F5F5) Image Container (Exact Video 00:00 - 00:05) */}
      <div className="relative aspect-square w-full bg-[#F5F5F5] overflow-hidden flex items-center justify-center p-4 sm:p-5">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-[#666666] hover:text-[#B5893D] transition-colors cursor-pointer"
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              isWishlisted ? 'fill-[#B5893D] text-[#B5893D]' : 'text-[#666666]'
            }`}
          />
        </button>

        <Link
          to={`/product/${product.id}`}
          className="w-full h-full flex items-center justify-center"
        >
          <SmartImage
            src={product.mainImage}
            alt={product.name}
            brand={product.brand}
            category={product.category}
            primaryHex={product.colors[0]?.hex}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      </div>

      {/* 2. Centered Luxury Editorial Details Block (Exact Video 00:00 - 00:05 & 00:26 - 00:35) */}
      <div className="flex flex-col flex-1 pt-3 pb-1 text-center justify-between">
        <Link to={`/product/${product.id}`} className="space-y-1 px-1">
          {/* Uppercase Gold Tagline (#B5893D) */}
          <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.1em] text-[#B5893D] truncate">
            {goldTagline}
          </p>

          {/* Bold Product Title (#1A1A1A) */}
          <h3 className="text-xs sm:text-[13px] font-semibold text-[#1A1A1A] group-hover:text-[#B5893D] transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>

          {/* 5 Gold Stars + Review Count */}
          <div className="flex items-center justify-center gap-1 pt-0.5">
            <div className="flex items-center text-[#D4AF37]">
              {[0, 1, 2, 3, 4].map((starIdx) => (
                <Star
                  key={starIdx}
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#D4AF37] text-[#D4AF37]"
                />
              ))}
            </div>
            <span className="text-[10px] text-[#666666] tabular-nums">
              {product.reviewCount || 42} reviews
            </span>
          </div>

          {/* Price Row: Bold Selling Price + Strikethrough MRP + Gold % OFF */}
          <div className="flex items-center justify-center flex-wrap gap-1.5 pt-1 tabular-nums">
            <span className="text-xs sm:text-sm font-bold text-[#1A1A1A]">
              {formatINR(product.price)}
            </span>
            {product.mrp > product.price && (
              <>
                <span className="text-[10px] sm:text-[11px] line-through text-[#888888]">
                  {formatINR(product.mrp)}
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#B5893D]">
                  {discountPercent}% OFF
                </span>
              </>
            )}
          </div>
        </Link>

        {/* 3. Full-Width Sharp Bordered ADD TO CART or 🔔 NOTIFY ME Button (Exact Video 00:28) */}
        <div className="pt-3">
          {isOutOfStock ? (
            <button
              type="button"
              onClick={() => setActiveNotifyModalProduct(product)}
              className="w-full h-9 sm:h-10 border border-[#D4AF37] bg-white hover:bg-[#FAF7F2] text-[#1A1A1A] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
              <span>NOTIFY ME</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => addToCart(product, 1)}
              className="w-full h-9 sm:h-10 border border-[#1A1A1A] bg-white hover:bg-[#1A1A1A] text-[#1A1A1A] hover:text-white text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors cursor-pointer"
            >
              ADD TO CART
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
