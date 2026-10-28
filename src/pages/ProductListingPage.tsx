import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowUpDown,
  ChevronRight,
  RotateCcw,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { formatINR, useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const ProductListingPage: React.FC = () => {
  const { products, categories } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category') || 'all';
  const initialBrand = searchParams.get('brand') || '';
  const initial5G = searchParams.get('5g') === 'true';
  const initialSort = searchParams.get('sort') || 'recommended';
  const initialMinPrice = Number(searchParams.get('minPrice') || 0);
  const initialMaxPrice = Number(searchParams.get('maxPrice') || 200000);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    initialBrand ? [initialBrand] : []
  );
  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice || 200000);
  const [minPrice, setMinPrice] = useState<number>(initialMinPrice || 0);
  const [selectedRam, setSelectedRam] = useState<string>('all');
  const [selectedStorage, setSelectedStorage] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedOS, setSelectedOS] = useState<string>('all');
  const [only5G, setOnly5G] = useState<boolean>(initial5G);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>(initialSort);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Sync URL parameter changes when user clicks header nav links
  React.useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    const brand = searchParams.get('brand');
    const minP = Number(searchParams.get('minPrice') || 0);
    const maxP = Number(searchParams.get('maxPrice') || 200000);
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

  const allColors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.colors.forEach((c) => set.add(c.name)));
    return Array.from(set).slice(0, 12);
  }, [products]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedBrands([]);
    setMinPrice(0);
    setMaxPrice(200000);
    setSelectedRam('all');
    setSelectedStorage('all');
    setSelectedColor('all');
    setSelectedOS('all');
    setOnly5G(false);
    setOnlyInStock(false);
    setSortBy('recommended');
    setSearchParams({});
  };

  const filteredAndSorted = useMemo(() => {
    const list = products.filter((p) => {
      // Category match
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'smartphones') {
          const nonPhone = [
            'tablets',
            'smartwatches',
            'earbuds',
            'chargers',
            'power-banks',
            'mobile-accessories',
          ];
          if (nonPhone.includes(p.category)) return false;
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

      if (selectedRam !== 'all' && !p.ramOptions.includes(selectedRam)) {
        return false;
      }

      if (selectedStorage !== 'all' && !p.storageOptions.includes(selectedStorage)) {
        return false;
      }

      if (
        selectedColor !== 'all' &&
        !p.colors.some((c) => c.name.toLowerCase() === selectedColor.toLowerCase())
      ) {
        return false;
      }

      if (selectedOS !== 'all' && p.os !== selectedOS) {
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
  }, [
    products,
    selectedCategory,
    selectedBrands,
    minPrice,
    maxPrice,
    selectedRam,
    selectedStorage,
    selectedColor,
    selectedOS,
    only5G,
    onlyInStock,
    sortBy,
  ]);

  const activeCategoryTitle =
    selectedCategory === 'all'
      ? 'All Smartphones & Electronics'
      : categories.find((c) => c.slug === selectedCategory)?.name ||
        selectedCategory.toUpperCase();

  const renderFilterControls = () => (
    <div className="space-y-5 text-xs">
      {/* Category Selector */}
      <div>
        <h4 className="font-bold text-[#171717] uppercase tracking-wider mb-2">Category</h4>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1.5 rounded-lg font-semibold cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#101114] text-white'
                : 'bg-[#F5F6F8] text-[#171717] hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-2.5 py-1.5 rounded-lg font-semibold cursor-pointer ${
                selectedCategory === cat.slug
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-[#F5F6F8] text-[#171717] hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="pt-4 border-t border-[#E5E7EB]">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-[#171717] uppercase tracking-wider">Max Price</h4>
          <span className="font-bold text-[#2563EB] tabular-nums">{formatINR(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={2000}
          max={160000}
          step={2000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#2563EB]"
        />
        <div className="flex justify-between text-[11px] text-[#737373] mt-1 tabular-nums">
          <span>₹2,000</span>
          <span>₹50,000</span>
          <span>₹1,60,000</span>
        </div>
      </div>

      {/* Brand Checkboxes */}
      <div className="pt-4 border-t border-[#E5E7EB]">
        <h4 className="font-bold text-[#171717] uppercase tracking-wider mb-2">Brand</h4>
        <div className="grid grid-cols-2 gap-2">
          {allBrands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 cursor-pointer text-[#171717] font-medium"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* RAM Filter */}
      <div className="pt-4 border-t border-[#E5E7EB]">
        <h4 className="font-bold text-[#171717] uppercase tracking-wider mb-2">RAM</h4>
        <div className="flex flex-wrap gap-1.5">
          {['all', '6GB', '8GB', '12GB', '16GB'].map((ram) => (
            <button
              key={ram}
              type="button"
              onClick={() => setSelectedRam(ram)}
              className={`px-2.5 py-1.5 rounded-lg font-semibold cursor-pointer ${
                selectedRam === ram
                  ? 'bg-[#101114] text-white'
                  : 'bg-[#F5F6F8] text-[#171717]'
              }`}
            >
              {ram === 'all' ? 'Any RAM' : ram}
            </button>
          ))}
        </div>
      </div>

      {/* Storage Filter */}
      <div className="pt-4 border-t border-[#E5E7EB]">
        <h4 className="font-bold text-[#171717] uppercase tracking-wider mb-2">Storage</h4>
        <div className="flex flex-wrap gap-1.5">
          {['all', '128GB', '256GB', '512GB', '1TB'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStorage(st)}
              className={`px-2.5 py-1.5 rounded-lg font-semibold cursor-pointer ${
                selectedStorage === st
                  ? 'bg-[#101114] text-white'
                  : 'bg-[#F5F6F8] text-[#171717]'
              }`}
            >
              {st === 'all' ? 'Any Storage' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Operating System */}
      <div className="pt-4 border-t border-[#E5E7EB]">
        <h4 className="font-bold text-[#171717] uppercase tracking-wider mb-2">
          Operating System
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {['all', 'iOS', 'Android', 'iPadOS', 'WearOS', 'Accessory'].map((os) => (
            <button
              key={os}
              type="button"
              onClick={() => setSelectedOS(os)}
              className={`px-2.5 py-1.5 rounded-lg font-semibold cursor-pointer ${
                selectedOS === os
                  ? 'bg-[#101114] text-white'
                  : 'bg-[#F5F6F8] text-[#171717]'
              }`}
            >
              {os === 'all' ? 'All OS' : os}
            </button>
          ))}
        </div>
      </div>

      {/* Color Finish */}
      <div className="pt-4 border-t border-[#E5E7EB]">
        <h4 className="font-bold text-[#171717] uppercase tracking-wider mb-2">Color Finish</h4>
        <select
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          className="w-full h-9 px-2.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-medium"
        >
          <option value="all">All Colors</option>
          {allColors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* 5G & Availability Toggles */}
      <div className="pt-4 border-t border-[#E5E7EB] space-y-2.5">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="font-semibold text-[#171717]">5G Network Support Only</span>
          <input
            type="checkbox"
            checked={only5G}
            onChange={(e) => setOnly5G(e.target.checked)}
            className="rounded text-[#2563EB]"
          />
        </label>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="font-semibold text-[#171717]">In-Stock Ready for Pickup</span>
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={(e) => setOnlyInStock(e.target.checked)}
            className="rounded text-[#2563EB]"
          />
        </label>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#737373] mb-3">
        <Link to="/" className="hover:text-[#171717]">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/categories" className="hover:text-[#171717]">
          Categories
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-[#171717] truncate">{activeCategoryTitle}</span>
      </nav>

      {/* Title & Sort Bar */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-2xl font-extrabold text-[#171717]">
            {activeCategoryTitle}
          </h1>
          <p className="text-xs text-[#737373] tabular-nums mt-0.5">
            Showing {filteredAndSorted.length} of {products.length} products at Charlie Mobile
          </p>
        </div>

        {/* Mobile Filter & Sort Triggers + Desktop Sort */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden min-h-[40px] px-3.5 py-2 rounded-xl bg-[#101114] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#00C2FF]" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <ArrowUpDown className="w-4 h-4 text-[#737373] hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products"
              className="h-10 px-3 rounded-xl border border-[#E5E7EB] bg-[#F5F6F8] text-xs font-bold text-[#171717] focus:outline-none focus:border-[#2563EB] w-full sm:w-auto"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
              <option value="popularity">Popularity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Desktop Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 bg-white rounded-2xl border border-[#E5E7EB] p-5 sticky top-28">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#2563EB]" />
              <h3 className="text-sm font-extrabold text-[#171717]">Filters</h3>
            </div>
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
          {renderFilterControls()}
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-9">
          {filteredAndSorted.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 text-center space-y-3">
              <p className="text-base font-bold text-[#171717]">
                No matching products found for these filters
              </p>
              <p className="text-xs text-[#737373]">
                Try expanding your price range or clearing active brand filters.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {filteredAndSorted.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Sheet Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden">
            {/* Drag Handle */}
            <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto mt-2.5" />
            <div className="px-5 py-3 border-b border-[#E5E7EB] flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#171717]">Filter Products</h3>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs font-bold text-[#2563EB]"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-5 overflow-y-auto flex-1">{renderFilterControls()}</div>

            <div className="p-4 border-t border-[#E5E7EB] bg-white pb-safe">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full h-11 rounded-xl bg-[#2563EB] text-white text-xs font-bold"
              >
                Show {filteredAndSorted.length} Products
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
