import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Bookmark,
  Minus,
  Plus,
  ShoppingBag,
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
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-[#171717]">Shopping Cart</h1>
          <p className="text-xs text-[#737373] tabular-nums">
            {cart.reduce((s, i) => s + i.quantity, 0)} items in your Charlie Mobile bag
          </p>
        </div>
        <Link
          to="/products"
          className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-10 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-extrabold text-[#171717]">Your Shopping Cart is Empty</h2>
          <p className="text-xs text-[#737373] max-w-md mx-auto">
            Explore our latest 5G smartphones, iPhones, smartwatches, and GaN chargers with instant store pickup and No-Cost EMI.
          </p>
          <Link
            to="/products"
            className="inline-flex min-h-[44px] px-6 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold items-center gap-2"
          >
            <span>Shop Smartphones &amp; Gadgets</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
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
                  className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex gap-4 items-center"
                >
                  <Link
                    to={`/product/${item.productId}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#F8FAFC] p-2 shrink-0 flex items-center justify-center"
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
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB]">
                      {item.product.brand}
                    </span>
                    <Link
                      to={`/product/${item.productId}`}
                      className="block text-sm sm:text-base font-extrabold text-[#171717] truncate hover:text-[#2563EB]"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-[#737373] mt-0.5">
                      Variant: {item.selectedColor}
                      {item.selectedRam !== 'Standard' ? ` · ${item.selectedRam}` : ''}
                      {item.selectedStorage !== 'Standard' ? ` · ${item.selectedStorage}` : ''}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-base font-extrabold text-[#171717] tabular-nums">
                        {formatINR(item.unitPrice * item.quantity)}
                      </div>

                      {/* Quantity Stepper & Actions */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-xl border border-[#E5E7EB] bg-[#F5F6F8]">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.productId, vKey, -1)}
                            aria-label="Decrease quantity"
                            className="w-8 h-8 flex items-center justify-center text-[#171717] cursor-pointer"
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
                            className="w-8 h-8 flex items-center justify-center text-[#171717] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => moveToSavedForLater(item)}
                          className="text-xs font-semibold text-[#737373] hover:text-[#2563EB] flex items-center gap-1 cursor-pointer"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Save for Later</span>
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
          <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E5E7EB] p-5 space-y-5 sticky top-28">
            {/* Coupon Box */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#171717] mb-2">
                Apply Promotional Coupon
              </label>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter code (e.g. CHARLIE1500)"
                  className="flex-1 h-10 px-3 rounded-xl border border-[#E5E7EB] text-xs font-bold uppercase focus:outline-none focus:border-[#2563EB]"
                />
                <button
                  type="submit"
                  className="h-10 px-4 rounded-xl bg-[#101114] text-white text-xs font-bold cursor-pointer"
                >
                  Apply
                </button>
              </form>
              {couponFeedback && (
                <p className="mt-1.5 text-xs font-semibold text-[#2563EB]">{couponFeedback}</p>
              )}

              {/* Quick Available Coupons */}
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
                      className="w-full p-2.5 rounded-xl bg-[#F5F6F8] hover:bg-blue-50/60 border border-[#E5E7EB] flex items-center justify-between text-left text-xs cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                        <div>
                          <span className="font-extrabold text-[#171717]">{c.code}</span>
                          <span className="block text-[11px] text-[#737373]">{c.title}</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-[#2563EB]">Tap to Apply</span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Order Totals */}
            <div className="pt-4 border-t border-[#E5E7EB] space-y-2.5 text-xs">
              <div className="flex justify-between text-[#737373] tabular-nums">
                <span>Total MRP</span>
                <span>{formatINR(mrpTotal)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold tabular-nums">
                <span>Store Price Savings</span>
                <span>- {formatINR(productDiscount)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-[#2563EB] font-bold tabular-nums">
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
              <div className="flex justify-between text-[#737373]">
                <span>Store Pickup / Local Delivery</span>
                <span className="font-bold text-emerald-700">FREE</span>
              </div>
              <div className="pt-3 border-t border-[#E5E7EB] flex justify-between items-baseline text-base font-extrabold text-[#171717] tabular-nums">
                <span>Estimated Total</span>
                <span className="text-xl">{formatINR(estimatedTotal)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full h-12 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Saved For Later Section */}
      {savedForLater.length > 0 && (
        <section className="space-y-3 pt-6 border-t border-[#E5E7EB]">
          <h2 className="text-base sm:text-lg font-extrabold text-[#171717]">
            Saved for Later ({savedForLater.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedForLater.map((item) => (
              <div
                key={getVariantKey(item)}
                className="bg-white rounded-2xl border border-[#E5E7EB] p-3.5 flex items-center gap-3"
              >
                <div className="w-16 h-16 rounded-xl bg-[#F8FAFC] p-1.5 shrink-0">
                  <SmartImage
                    src={item.product.mainImage}
                    alt={item.product.name}
                    brand={item.product.brand}
                    category={item.product.category}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#171717] truncate">{item.product.name}</p>
                  <p className="text-xs font-extrabold text-[#2563EB] tabular-nums">
                    {formatINR(item.unitPrice)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveToCartFromSaved(item)}
                      className="px-2.5 py-1 rounded-lg bg-[#101114] text-white text-[11px] font-bold cursor-pointer"
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
