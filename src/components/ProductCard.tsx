import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../types/store';
import { formatINR, useStore } from '../context/StoreContext';
import { SmartImage } from './SmartImage';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const isWishlisted = wishlist.includes(product.id);
  const discountPercent =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-[#E5E7EB] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md overflow-hidden">
      {/* Wishlist Button (44x44px touch hitbox) */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        className="absolute top-2 right-2 z-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full bg-white/90 text-[#171717] hover:text-[#2563EB] transition-colors"
      >
        <Heart
          className={`w-4 h-4 ${
            isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-[#737373]'
          }`}
        />
      </button>

      {/* Product Studio Image */}
      <Link
        to={`/product/${product.id}`}
        className={`relative bg-[#F8FAFC] flex items-center justify-center overflow-hidden ${
          compact ? 'aspect-square p-2.5' : 'aspect-square p-3.5'
        }`}
      >
        <SmartImage
          src={product.mainImage}
          alt={product.name}
          brand={product.brand}
          category={product.category}
          primaryHex={product.colors[0]?.hex}
          className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
        />
      </Link>

      {/* Product Details */}
      <div className="flex flex-col flex-1 p-3 sm:p-4 justify-between gap-2">
        <div>
          {/* Clean Unboxed Metadata Line (Zero-Pill Rule) */}
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#737373] truncate">
            <span className="uppercase tracking-wider font-semibold text-[#2563EB]">
              {product.brand}
            </span>
            <span aria-hidden="true">·</span>
            <span>{product.is5G ? '5G' : product.category}</span>
            {product.ramOptions[0] !== 'Standard' && (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  {product.ramOptions[0]}/{product.storageOptions[0]}
                </span>
              </>
            )}
          </div>

          <Link
            to={`/product/${product.id}`}
            className="mt-1 block text-sm sm:text-[15px] font-semibold text-[#171717] group-hover:text-[#2563EB] transition-colors line-clamp-2 leading-snug min-h-[2.5rem]"
          >
            {product.name}
          </Link>

          {/* Rating & Color Swatches */}
          <div className="mt-1.5 flex items-center justify-between text-xs text-[#737373]">
            <div className="flex items-center gap-1 tabular-nums">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-[#171717]">{product.rating.toFixed(1)}</span>
              <span>({product.reviewCount})</span>
            </div>

            {product.colors.length > 0 && (
              <div className="flex items-center gap-1" title={`${product.colors.length} finishes`}>
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

        {/* Price & Action */}
        <div className="pt-2 border-t border-[#E5E7EB]/70 flex items-end justify-between gap-2">
          <div>
            <div className="text-base sm:text-lg font-extrabold text-[#171717] tabular-nums leading-tight">
              {formatINR(product.price)}
            </div>
            {product.mrp > product.price && (
              <div className="flex items-center gap-1.5 text-[11px] tabular-nums mt-0.5">
                <span className="line-through text-[#737373]">{formatINR(product.mrp)}</span>
                <span className="font-bold text-emerald-600">{discountPercent}% off</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className="min-h-[40px] px-3 py-2 rounded-xl bg-[#101114] hover:bg-[#2563EB] disabled:bg-slate-300 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.stock > 0 ? 'Add' : 'Out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
