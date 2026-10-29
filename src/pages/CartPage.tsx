import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Bookmark,
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  Tag,
  Trash2,
} from 'lucide-react';
import { formatINR, getVariantKey, useStore } from '../context/StoreContext';
import { SmartImage } from '../components/SmartImage';

export const CartPage: React.FC = () => {
  const {
    cart,
    savedForLater,
    coupons,
    appliedCoupon,
    updateCartQuantity,
    removeFromCart,
    moveToSavedForLater,
    moveToCartFromSaved,
    removeSavedItem,
    applyCouponCode,
    removeCoupon,
  } = useStore();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const mrpTotal = cart.reduce(
    (sum, item) => sum + Math.max(item.unitPrice, item.product.mrp) * item.quantity,
    0
  );
  const productDiscount = Math.max(0, mrpTotal - subtotal);

  let couponDiscount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrderAmount) {
    if (appliedCoupon.discountType === 'flat') {
      couponDiscount = appliedCoupon.discountValue;
    } else {
      couponDiscount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount) {
        couponDiscount = Math.min(couponDiscount, appliedCoupon.maxDiscount);
      }
    }
  }

  const estimatedTotal = Math.max(0, subtotal - couponDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCouponCode(couponInput);
    setCouponFeedback(res.message);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-6 space-y-5">
      {/* Breadcrumb: Home > My Cart (Exact Video 01:16 & 01:20) */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
        <Link to="/" className="hover:text-[#F26522]">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-700 font-medium">My Cart</span>
      </nav>

      {cart.length === 0 ? (
        /* Exact Empty Cart Screen from Video (01:16 & 01:20) */
        <div className="bg-white rounded-md border border-slate-200 py-12 px-6 text-center space-y-5 shadow-2xs">
          {/* Monitor with Cart + Floating Gadgets Illustration */}
          <div className="relative w-44 h-36 mx-auto flex items-center justify-center">
            <div className="w-28 h-20 rounded-lg border-4 border-slate-700 bg-orange-50 flex items-center justify-center relative shadow-sm">
              <ShoppingCart className="w-9 h-9 text-[#F26522]" />
              <div className="absolute -bottom-3 w-8 h-2 bg-slate-600 rounded" />
              <div className="absolute -bottom-4 w-14 h-1.5 bg-slate-400 rounded-full" />
            </div>
            {/* Decorative dashed orbit */}
            <div className="absolute inset-2 rounded-full border border-dashed border-orange-300 pointer-events-none" />
          </div>

          <h1 className="text-base sm:text-lg font-medium text-[#1E293B]">
            Your shopping cart is empty!
          </h1>

          <div>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-7 py-2.5 rounded-md bg-gradient-to-r from-[#F26522] to-[#EA580C] hover:from-[#EA580C] hover:to-[#D9460F] text-white text-sm font-bold shadow-sm transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Cart Items List */}
          <div className="lg:col-span-8 space-y-3">
            {cart.map((item) => {
              const vKey = getVariantKey(item);
              return (
                <div
                  key={vKey}
                  className="bg-white rounded-xl border border-slate-200 p-4 flex gap-4 items-center"
                >
                  <Link
                    to={`/product/${item.productId}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-white border border-slate-100 p-2 shrink-0 flex items-center justify-center"
                  >
                    <SmartImage
                      src={item.product.mainImage}
                      alt={item.product.name}
                      brand={item.product.brand}
                      category={item.product.category}
                      className="w-full h-full object-contain"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#F26522]">
                      {item.product.brand}
                    </span>
                    <Link
                      to={`/product/${item.productId}`}
                      className="block text-sm sm:text-base font-extrabold text-[#1E293B] truncate hover:text-[#F26522]"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Variant: {item.selectedColor}
                      {item.selectedRam !== 'Standard' ? ` · ${item.selectedRam}` : ''}
                      {item.selectedStorage !== 'Standard' ? ` · ${item.selectedStorage}` : ''}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-base font-extrabold text-[#28A745] tabular-nums">
                        {formatINR(item.unitPrice * item.quantity)}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.productId, vKey, -1)}
                            aria-label="Decrease quantity"
                            className="w-8 h-8 flex items-center justify-center text-[#1E293B] cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center text-xs font-extrabold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.productId, vKey, 1)}
                            aria-label="Increase quantity"
                            className="w-8 h-8 flex items-center justify-center text-[#1E293B] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => moveToSavedForLater(item)}
                          className="text-xs font-semibold text-slate-500 hover:text-[#F26522] flex items-center gap-1 cursor-pointer"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Save</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId, vKey)}
                          aria-label="Remove item"
                          className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Coupon & Price Summary */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 space-y-5 sticky top-28">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1E293B] mb-2">
                Apply Promotional Coupon
              </label>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter code (e.g. CHARLIE1500)"
                  className="flex-1 h-10 px-3 rounded-lg border border-slate-200 text-xs font-bold uppercase focus:outline-none focus:border-[#F26522]"
                />
                <button
                  type="submit"
                  className="h-10 px-4 rounded-lg bg-[#F26522] text-white text-xs font-bold cursor-pointer"
                >
                  Apply
                </button>
              </form>
              {couponFeedback && (
                <p className="mt-1.5 text-xs font-semibold text-[#F26522]">{couponFeedback}</p>
              )}

              <div className="mt-3 space-y-1.5">
                {coupons
                  .filter((c) => c.active)
                  .map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setCouponInput(c.code);
                        const res = applyCouponCode(c.code);
                        setCouponFeedback(res.message);
                      }}
                      className="w-full p-2.5 rounded-lg bg-slate-50 hover:bg-orange-50/50 border border-slate-200 flex items-center justify-between text-left text-xs cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-[#F26522] shrink-0" />
                        <div>
                          <span className="font-extrabold text-[#1E293B]">{c.code}</span>
                          <span className="block text-[11px] text-slate-500">{c.title}</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-[#F26522]">Apply</span>
                    </button>
                  ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-500 tabular-nums">
                <span>Total MRP</span>
                <span>{formatINR(mrpTotal)}</span>
              </div>
              <div className="flex justify-between text-[#28A745] font-semibold tabular-nums">
                <span>Store Price Savings</span>
                <span>- {formatINR(productDiscount)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-[#F26522] font-bold tabular-nums">
                  <span>
                    Coupon ({appliedCoupon.code}){' '}
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="underline text-rose-600 ml-1"
                    >
                      Remove
                    </button>
                  </span>
                  <span>- {formatINR(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Store Pickup / Local Delivery</span>
                <span className="font-bold text-[#28A745]">FREE</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-base font-extrabold text-[#1E293B] tabular-nums">
                <span>Total Payable</span>
                <span className="text-xl text-[#F26522]">{formatINR(estimatedTotal)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full h-12 rounded-lg bg-[#F26522] hover:bg-[#EA580C] text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {savedForLater.length > 0 && (
        <section className="space-y-3 pt-6 border-t border-slate-200">
          <h2 className="text-base font-extrabold text-[#1E293B]">
            Saved for Later ({savedForLater.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedForLater.map((item) => (
              <div
                key={getVariantKey(item)}
                className="bg-white rounded-xl border border-slate-200 p-3.5 flex items-center gap-3"
              >
                <div className="w-16 h-16 rounded-lg bg-slate-50 p-1.5 shrink-0">
                  <SmartImage
                    src={item.product.mainImage}
                    alt={item.product.name}
                    brand={item.product.brand}
                    category={item.product.category}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1E293B] truncate">{item.product.name}</p>
                  <p className="text-xs font-extrabold text-[#28A745] tabular-nums">
                    {formatINR(item.unitPrice)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveToCartFromSaved(item)}
                      className="px-2.5 py-1 rounded bg-[#F26522] text-white text-[11px] font-bold cursor-pointer"
                    >
                      Move to Cart
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSavedItem(item.productId)}
                      className="text-[11px] text-rose-600 font-semibold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
