import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Product } from '../types/store';
import { formatINR, useStore } from '../context/StoreContext';
import { SmartImage } from './SmartImage';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { wishlist, toggleWishlist } = useStore();
  const isWishlisted = wishlist.includes(product.id);

  const discountPercent =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  // Format variant line in exact Poorvika video style: "( Thunder Black, 4GB-64GB )"
  const primaryColor = product.colors[0]?.name || '';
  const primaryRam =
    product.ramOptions[0] && product.ramOptions[0] !== 'Standard'
      ? product.ramOptions[0]
      : '';
  const primaryStorage =
    product.storageOptions[0] && product.storageOptions[0] !== 'Standard'
      ? product.storageOptions[0]
      : '';

  const ramStorage = [primaryRam, primaryStorage].filter(Boolean).join('-');
  const rawVariant = [primaryColor, ramStorage].filter(Boolean).join(', ');
  const variantText = rawVariant ? `( ${rawVariant} )` : `( ${product.brand} Official )`;

  // Format price with space after ₹ as shown in video: "₹ 18,999"
  const formattedPrice = formatINR(product.price).replace('₹', '₹ ');
  const formattedMrp = formatINR(product.mrp).replace('₹', '₹ ');

  return (
    <div className="group relative flex flex-col bg-white border-r border-b border-slate-200 hover:bg-slate-50/40 transition-colors h-full">
      {/* Top-Right Heart Icon (Exact Video Position) */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
      >
        <Heart
          className={`w-4 h-4 ${
            isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
          }`}
        />
      </button>

      {/* Product Studio Image */}
      <Link
        to={`/product/${product.id}`}
        className="relative bg-white flex items-center justify-center overflow-hidden pt-6 pb-3 px-3 h-44 sm:h-52"
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

      {/* Product Info Block (Exact Video Layout: Title -> Grey Variant -> Green Price -> Strikethrough MRP + % OFF) */}
      <Link
        to={`/product/${product.id}`}
        className="flex flex-col flex-1 px-3 pb-3.5 pt-1 justify-between text-left"
      >
        <div>
          <h3 className="text-[13px] sm:text-sm font-bold text-[#1E293B] group-hover:text-[#F26522] truncate leading-snug">
            {product.name}
          </h3>
          <p className="mt-0.5 text-[11px] sm:text-xs text-slate-400 truncate font-normal">
            {variantText}
          </p>
        </div>

        <div className="mt-2 space-y-0.5 tabular-nums">
          <div className="text-sm sm:text-[15px] font-extrabold text-[#28A745] leading-tight">
            {formattedPrice}
          </div>

          {product.mrp > product.price ? (
            <div className="flex items-center gap-2 text-[11px] sm:text-xs">
              <span className="line-through text-slate-400">{formattedMrp}</span>
              <span className="font-bold text-[#1E293B]">{discountPercent}% OFF</span>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400">Official Warranty</div>
          )}
        </div>
      </Link>
    </div>
  );
};
