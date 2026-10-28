import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Grid, Layers } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SmartImage } from '../components/SmartImage';
import { ProductCard } from '../components/ProductCard';

export const CategoriesPage: React.FC = () => {
  const { categories, products } = useStore();
  const [selectedSlug, setSelectedSlug] = useState<string>('all');

  const filteredProducts =
    selectedSlug === 'all'
      ? products
      : products.filter(
          (p) =>
            p.category.toLowerCase() === selectedSlug.toLowerCase() ||
            p.brand.toLowerCase() === selectedSlug.toLowerCase() ||
            (selectedSlug === 'smartphones' &&
              !['tablets', 'smartwatches', 'earbuds', 'chargers', 'power-banks', 'mobile-accessories'].includes(
                p.category
              ))
        );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB] uppercase tracking-wider">
            <Grid className="w-4 h-4" />
            <span>Charlie Mobile Directory</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#171717]">
            Shop All Categories &amp; Brands
          </h1>
          <p className="text-xs sm:text-sm text-[#737373]">
            Explore smartphones, tablets, wearables, audio gear, and genuine charging accessories.
          </p>
        </div>
        <Link
          to="/products"
          className="self-start sm:self-auto min-h-[40px] px-4 py-2 rounded-xl bg-[#101114] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#2563EB] transition-colors"
        >
          <span>Browse Full Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Category Visual Grid (17 Categories) */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const isSelected = selectedSlug === cat.slug;
          return (
            <div
              key={cat.id}
              className={`group rounded-2xl border p-3 flex flex-col items-center text-center transition-all ${
                isSelected
                  ? 'bg-blue-50/70 border-[#2563EB] shadow-xs'
                  : 'bg-white border-[#E5E7EB] hover:border-[#2563EB]'
              }`}
            >
              <button
                type="button"
                onClick={() => setSelectedSlug(cat.slug)}
                className="w-full flex flex-col items-center cursor-pointer"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#F8FAFC] p-2 flex items-center justify-center overflow-hidden">
                  <SmartImage
                    src={cat.image}
                    alt={cat.name}
                    brand={cat.name}
                    category={cat.slug}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="mt-2 text-xs sm:text-sm font-bold text-[#171717] group-hover:text-[#2563EB] line-clamp-1">
                  {cat.name}
                </span>
              </button>
              <Link
                to={`/products?category=${cat.slug}`}
                className="mt-1.5 text-[11px] font-semibold text-[#2563EB] hover:underline flex items-center gap-0.5"
              >
                <span>Open Page</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Category-Specific Product Listing Preview */}
      <div className="space-y-4 pt-4 border-t border-[#E5E7EB]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#2563EB]" />
            <h2 className="text-lg sm:text-xl font-extrabold text-[#171717]">
              {selectedSlug === 'all'
                ? 'All Featured Products'
                : `${categories.find((c) => c.slug === selectedSlug)?.name || selectedSlug} Collection`}
            </h2>
            <span className="text-xs text-[#737373] tabular-nums">
              ({filteredProducts.length} items)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {selectedSlug !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedSlug('all')}
                className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-semibold text-[#171717] cursor-pointer"
              >
                Show All Categories
              </button>
            )}
            <Link
              to={selectedSlug === 'all' ? '/products' : `/products?category=${selectedSlug}`}
              className="px-3.5 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-bold flex items-center gap-1"
            >
              <span>Filter &amp; Sort</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
