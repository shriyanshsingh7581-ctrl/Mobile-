import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpDown, Check, RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import { formatINR, useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { SmartImage } from '../components/SmartImage';

export const ProductListingPage: React.FC = () => {
  const { products, categories } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category') || 'all';
  const initialBrand = searchParams.get('brand') || '';
  const initial5G = searchParams.get('5g') === 'true';
  const initialSort = searchParams.get('sort') || 'recommended';
  const initialMinPrice = Number(searchParams.get('minPrice') || 0);
  const initialMaxPrice = Number(searchParams.get('maxPrice') || 300000);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    initialBrand ? [initialBrand] : []
  );
  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice || 300000);
  const [minPrice, setMinPrice] = useState<number>(initialMinPrice || 0);
  const [only5G, setOnly5G] = useState<boolean>(initial5G);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>(initialSort);

  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [mobileSortOpen, setMobileSortOpen] = useState<boolean>(false);

  React.useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    const brand = searchParams.get('brand');
    const minP = Number(searchParams.get('minPrice') || 0);
    const maxP = Number(searchParams.get('maxPrice') || 300000);
    const is5gParam = searchParams.get('5g') === 'true';

    setSelectedCategory(cat);
    setSelectedBrands(brand ? [brand] : []);
    setMinPrice(minP);
    setMaxPrice(maxP);
    setOnly5G(is5gParam);
  }, [searchParams]);

  const allBrands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort(),
    [products]
  );

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedBrands([]);
    setMinPrice(0);
    setMaxPrice(300000);
    setOnly5G(false);
    setOnlyInStock(false);
    setSortBy('recommended');
    setSearchParams({});
  };

  const filteredAndSorted = useMemo(() => {
    const list = products.filter((p) => {
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'smartphones') {
          const phoneCats = [
            'smartphones',
            'iphone',
            'samsung',
            'vivo',
            'oppo',
            'realme',
            'redmi',
            'oneplus',
            'iqoo',
          ];
          if (!phoneCats.includes(p.category.toLowerCase())) return false;
        } else if (
          p.category.toLowerCase() !== selectedCategory.toLowerCase() &&
          p.brand.toLowerCase() !== selectedCategory.toLowerCase()
        ) {
          return false;
        }
      }

      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }

      if (p.price < minPrice || p.price > maxPrice) {
        return false;
      }

      if (only5G && !p.is5G) {
        return false;
      }

      if (onlyInStock && p.stock <= 0) {
        return false;
      }

      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'newest') return (b.isNewRelease ? 1 : 0) - (a.isNewRelease ? 1 : 0);
      if (sortBy === 'popularity') return b.reviewCount - a.reviewCount;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, selectedBrands, minPrice, maxPrice, only5G, onlyInStock, sortBy]);

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedBrands.length +
    (only5G ? 1 : 0) +
    (onlyInStock ? 1 : 0);

  // Category Top Banner matching Video (00:28 shows Stream, Play, Conquer banner on Gaming/Entertainment listing)
  const getCategoryBanner = () => {
    if (selectedCategory === 'gaming') {
      return 'https://img-prd-pim.poorvika.com/pageimg/Stream-Play-Conquer-Mob.webp';
    }
    if (selectedCategory === 'tv-audio') {
      return 'https://img-prd-pim.poorvika.com/pageimg/Bring-The-Stadium-Home-Mob.webp';
    }
    if (selectedCategory === 'laptops') {
      return 'https://img-prd-pim.poorvika.com/pageimg/MacBook-Neo-Banner-Mob.webp';
    }
    if (selectedCategory === 'kitchen-appliances') {
      return 'https://img-prd-pim.poorvika.com/pageimg/Kitchen-Appliances-Mob-M-A-2026.webp';
    }
    if (selectedCategory === 'home-appliances') {
      return 'https://img-prd-pim.poorvika.com/pageimg/Home-Appliances-Mob-M-A-2026.webp';
    }
    if (selectedCategory === 'personal-care') {
      return 'https://img-prd-pim.poorvika.com/pageimg/Personal-care-home-page-mob.webp';
    }
    return 'https://img-prd-pim.poorvika.com/pageimg/samsung-galaxy-z-fold8-z-flip7-m.webp';
  };

  const sortOptions = [
    { id: 'recommended', label: 'Top Sellers' },
    { id: 'popularity', label: 'Most Popular' },
    { id: 'price_asc', label: 'Price: Low to High' },
    { id: 'price_desc', label: 'Price: High to Low' },
    { id: 'newest', label: 'New Arrivals' },
  ];

  return (
    <div className="bg-[#F5F6F8] min-h-screen pb-10">
      {/* Top Category Banner (Exact Video 00:28) */}
      <div className="max-w-7xl mx-auto">
        <SmartImage
          src={getCategoryBanner()}
          alt={selectedCategory}
          brand="Charlie Mobile"
          category={selectedCategory}
          className="w-full h-auto max-h-[220px] object-cover"
        />
      </div>

      {/* Exact Video Sticky "Sort | Filter (1)" Bar + "Found - X" Counter (00:28 - 00:41) */}
      <div className="sticky top-[92px] z-30 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto grid grid-cols-2 divide-x divide-slate-200 h-11">
          <button
            type="button"
            onClick={() => setMobileSortOpen(true)}
            className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-[#1E293B] hover:text-[#F26522] cursor-pointer"
          >
            <span>Sort</span>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-[#1E293B] hover:text-[#F26522] cursor-pointer"
          >
            <span>Filter</span>
            <div className="relative flex items-center">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              {activeFilterCount > 0 && (
                <span className="ml-1 w-4 h-4 rounded-full bg-[#28A745] text-white text-[10px] font-extrabold flex items-center justify-center tabular-nums">
                  {activeFilterCount}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* "Found - X" Grey Strip (Exact Video 00:31) */}
        <div className="bg-[#F5F6F8] px-3 py-1.5 border-t border-slate-200 text-xs text-slate-600">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span>
              Found - <strong className="text-[#1E293B]">{filteredAndSorted.length}</strong>
            </span>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-[11px] font-bold text-[#F26522] hover:underline cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2-Column Bordered Product Grid (Exact Video 00:31 - 00:42) */}
      <div className="max-w-7xl mx-auto bg-white border-t border-l border-slate-200">
        {filteredAndSorted.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <p className="text-sm font-bold text-[#1E293B]">No matching products found</p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="px-4 py-2 rounded bg-[#F26522] text-white text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {filteredAndSorted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Sort Modal */}
      {mobileSortOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex flex-col justify-end">
          <div className="bg-white rounded-t-2xl p-5 space-y-3 max-w-lg w-full mx-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <h3 className="text-sm font-extrabold text-[#1E293B]">Sort Products By</h3>
              <button
                type="button"
                onClick={() => setMobileSortOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              {sortOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setSortBy(opt.id);
                    setMobileSortOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-lg flex items-center justify-between text-xs font-bold cursor-pointer ${
                    sortBy === opt.id
                      ? 'bg-orange-50 text-[#F26522]'
                      : 'text-[#1E293B] hover:bg-slate-50'
                  }`}
                >
                  <span>{opt.label}</span>
                  {sortBy === opt.id && <Check className="w-4 h-4 text-[#F26522]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex flex-col justify-end">
          <div className="bg-white rounded-t-2xl max-h-[82vh] flex flex-col overflow-hidden max-w-lg w-full mx-auto">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#1E293B]">Filter Products</h3>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs font-bold text-[#F26522] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-5 overflow-y-auto space-y-5 text-xs flex-1">
              <div>
                <h4 className="font-extrabold text-[#1E293B] uppercase mb-2">Category</h4>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 rounded font-bold cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-[#F26522] text-white'
                        : 'bg-slate-100 text-[#1E293B]'
                    }`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`px-3 py-1.5 rounded font-bold cursor-pointer ${
                        selectedCategory === cat.slug
                          ? 'bg-[#F26522] text-white'
                          : 'bg-slate-100 text-[#1E293B]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-extrabold text-[#1E293B] uppercase">Max Price</h4>
                  <span className="font-bold text-[#F26522]">{formatINR(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min={2000}
                  max={300000}
                  step={5000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#F26522]"
                />
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h4 className="font-extrabold text-[#1E293B] uppercase mb-2">Brand</h4>
                <div className="grid grid-cols-2 gap-2">
                  {allBrands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="accent-[#F26522]"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full h-10 rounded bg-[#F26522] text-white text-xs font-extrabold cursor-pointer"
              >
                Apply Filters ({filteredAndSorted.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
