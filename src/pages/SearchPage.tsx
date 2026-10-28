import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Clock, Flame, Search, Sparkles, Trash2, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const SearchPage: React.FC = () => {
  const { products, categories, recentSearches, addRecentSearch, clearRecentSearches } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [queryText, setQueryText] = useState(initialQuery);

  const popularTerms = [
    'iPhone 16 Pro Max',
    'Galaxy S24 Ultra',
    'Vivo X200 Pro',
    'OnePlus 13',
    '5G Smartphones under 30000',
    '100W GaN Charger',
    'AirPods Pro 2',
    'Apple Watch Ultra 2',
  ];

  const matchingCategories = useMemo(() => {
    const q = queryText.trim().toLowerCase();
    if (!q) return [];
    return categories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    );
  }, [categories, queryText]);

  const matchingProducts = useMemo(() => {
    const q = queryText.trim().toLowerCase();
    if (!q) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (q.includes('5g') && p.is5G)
    );
  }, [products, queryText]);

  const trendingProducts = useMemo(
    () => products.filter((p) => p.isBestSeller || p.isFeatured).slice(0, 4),
    [products]
  );

  const handleSelectTerm = (term: string) => {
    setQueryText(term);
    addRecentSearch(term);
    setSearchParams({ q: term });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryText.trim()) {
      addRecentSearch(queryText.trim());
      setSearchParams({ q: queryText.trim() });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-8 space-y-6">
      {/* Live Search Box */}
      <form onSubmit={handleFormSubmit} className="relative">
        <Search className="w-5 h-5 text-[#2563EB] absolute left-4 top-3.5" />
        <input
          type="text"
          autoFocus
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          placeholder="Search smartphones, brands (Apple, Vivo, Samsung), earbuds, chargers..."
          className="w-full h-12 pl-12 pr-12 rounded-2xl bg-white border-2 border-[#2563EB] text-sm sm:text-base font-medium text-[#171717] shadow-xs focus:outline-none"
        />
        {queryText && (
          <button
            type="button"
            onClick={() => {
              setQueryText('');
              setSearchParams({});
            }}
            aria-label="Clear search"
            className="absolute right-3.5 top-2.5 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4 text-[#171717]" />
          </button>
        )}
      </form>

      {/* Instant Suggestions & Recent/Popular Searches when input is empty */}
      {!queryText.trim() ? (
        <div className="space-y-6">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#171717]">
                  <Clock className="w-4 h-4 text-[#2563EB]" />
                  <span>Recent Searches</span>
                </div>
                <button
                  type="button"
                  onClick={clearRecentSearches}
                  className="text-xs font-semibold text-[#737373] hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleSelectTerm(term)}
                    className="px-3 py-1.5 rounded-xl bg-[#F5F6F8] hover:bg-blue-50 text-xs font-semibold text-[#171717] hover:text-[#2563EB] transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-5">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#171717] mb-3">
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              <span>Popular Searches at Charlie Mobile</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularTerms.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleSelectTerm(term)}
                  className="px-3 py-1.5 rounded-xl border border-[#E5E7EB] hover:border-[#2563EB] text-xs font-semibold text-[#171717] hover:text-[#2563EB] transition-colors cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Trending Smartphones */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#2563EB]" />
              <h2 className="text-base sm:text-lg font-extrabold text-[#171717]">
                Trending Products Right Now
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {trendingProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Live Search Results */
        <div className="space-y-6">
          {/* Matching Category Shortcuts */}
          {matchingCategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-xs font-bold text-[#737373] shrink-0">Categories:</span>
              {matchingCategories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.slug}`}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#2563EB] text-xs font-bold text-[#2563EB] flex items-center gap-1 shrink-0"
                >
                  <span>{cat.name}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              ))}
            </div>
          )}

          {/* Product Results or Empty State */}
          {matchingProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 text-center space-y-3">
              <p className="text-base font-extrabold text-[#171717]">
                No products matched &ldquo;{queryText}&rdquo;
              </p>
              <p className="text-xs text-[#737373]">
                Try searching by brand (Apple, Samsung, Vivo, OnePlus, Redmi) or category (Earbuds, Chargers).
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setQueryText('')}
                  className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold cursor-pointer"
                >
                  View Popular Searches
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-bold text-[#737373] tabular-nums">
                Found {matchingProducts.length} results for &ldquo;{queryText}&rdquo;
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {matchingProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
