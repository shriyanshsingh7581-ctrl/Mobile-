import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Bookmark,
  ChevronRight,
  MessageCircle,
  Minus,
  Plus,
  ShoppingCart,
  Tag,
  Trash2,
} from 'lucide-react';
import { formatINR, getVariantKey, useStore } from '../context/StoreContext';
import { SmartImage } from '../components/SmartImage';
import { WhatsAppOrderModal } from '../components/WhatsAppOrderModal';

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
    sendCartOrderViaWhatsApp,
  } = useStore();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);
  const [waModalOpen, setWaModalOpen] = useState(false);

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
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5">
      {/* Breadcrumb: Home > My Cart */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#595959]">
        <Link to="/" className="hover:text-[#B5893D]">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#1A1A1A] font-semibold">My Cart</span>
      </nav>

      {cart.length === 0 ? (
        <div className="bg-white border border-[#EAE5DC] py-12 px-6 text-center space-y-5">
          <div className="relative w-40 h-32 mx-auto flex items-center justify-center">
            <div className="w-28 h-20 border-2 border-[#B5893D]/40 bg-[#FAF7F2] flex items-center justify-center relative">
              <ShoppingCart className="w-9 h-9 text-[#B5893D]" />
            </div>
          </div>

          <h1 className="font-serif-luxury text-xl sm:text-2xl font-semibold text-[#1A1A1A]">
            Your shopping bag is empty
          </h1>

          <div>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-7 py-2.5 bg-[#1A1A1A] hover:bg-[#B5893D] text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors"
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
                  className="bg-white border border-[#EAE5DC] p-4 flex gap-4 items-center"
                >
                  <Link
                    to={`/product/${item.productId}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 bg-[#F5F5F5] border border-[#EAE5DC] p-2 shrink-0 flex items-center justify-center"
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
                    <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#A67C33]">
                      {item.product.brand}
                    </span>
                    <Link
                      to={`/product/${item.productId}`}
                      className="block text-sm sm:text-base font-semibold text-[#1A1A1A] truncate hover:text-[#B5893D]"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-[#595959] mt-0.5">
                      Variant: {item.selectedColor}
                      {item.selectedRam !== 'Standard' ? ` · ${item.selectedRam}` : ''}
                      {item.selectedStorage !== 'Standard' ? ` · ${item.selectedStorage}` : ''}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-base font-bold text-[#1A1A1A] tabular-nums">
                        {formatINR(item.unitPrice * item.quantity)}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-[#D4CFC7] bg-[#FAF7F2]">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.productId, vKey, -1)}
                            aria-label="Decrease quantity"
                            className="w-8 h-8 flex items-center justify-center text-[#1A1A1A] cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.productId, vKey, 1)}
                            aria-label="Increase quantity"
                            className="w-8 h-8 flex items-center justify-center text-[#1A1A1A] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => moveToSavedForLater(item)}
                          className="text-xs font-medium text-[#595959] hover:text-[#B5893D] flex items-center gap-1 cursor-pointer"
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
          <div className="lg:col-span-4 bg-white border border-[#EAE5DC] p-5 space-y-5 sticky top-28">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#1A1A1A] mb-2">
                Apply Promotional Coupon
              </label>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter code (e.g. CHARLIE1500)"
                  className="flex-1 h-10 px-3 border border-[#D4CFC7] text-xs font-semibold uppercase focus:outline-none focus:border-[#B5893D]"
                />
                <button
                  type="submit"
                  className="h-10 px-4 bg-[#1A1A1A] hover:bg-[#B5893D] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Apply
                </button>
              </form>
              {couponFeedback && (
                <p className="mt-1.5 text-xs font-semibold text-[#A67C33]">{couponFeedback}</p>
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
                      className="w-full p-2.5 bg-[#FAF7F2] hover:bg-[#F3ECE0] border border-[#EAE5DC] flex items-center justify-between text-left text-xs cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-[#B5893D] shrink-0" />
                        <div>
                          <span className="font-bold text-[#1A1A1A]">{c.code}</span>
                          <span className="block text-[11px] text-[#595959]">{c.title}</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-[#A67C33]">Apply</span>
                    </button>
                  ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAE5DC] space-y-2.5 text-xs">
              <div className="flex justify-between text-[#595959] tabular-nums">
                <span>Total MRP</span>
                <span>{formatINR(mrpTotal)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold tabular-nums">
                <span>Store Price Savings</span>
                <span>- {formatINR(productDiscount)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-[#A67C33] font-semibold tabular-nums">
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
              <div className="flex justify-between text-[#595959]">
                <span>Store Pickup / Local Delivery</span>
                <span className="font-semibold text-emerald-700">FREE</span>
              </div>
              <div className="pt-3 border-t border-[#EAE5DC] flex justify-between items-baseline text-base font-bold text-[#1A1A1A] tabular-nums">
                <span>Total Payable</span>
                <span className="text-xl text-[#1A1A1A]">{formatINR(estimatedTotal)}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => setWaModalOpen(true)}
                className="w-full h-12 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Order Cart on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => sendCartOrderViaWhatsApp()}
                className="w-full h-10 border border-[#25D366] bg-emerald-50/60 hover:bg-emerald-50 text-[#1A1A1A] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>1-Click Direct WhatsApp Order</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full h-12 bg-[#1A1A1A] hover:bg-[#B5893D] text-white text-xs font-bold uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <WhatsAppOrderModal
        isOpen={waModalOpen}
        onClose={() => setWaModalOpen(false)}
        mode="cart"
      />

      {savedForLater.length > 0 && (
        <section className="space-y-3 pt-6 border-t border-[#EAE5DC]">
          <h2 className="font-serif-luxury text-lg font-semibold text-[#1A1A1A]">
            Saved for Later ({savedForLater.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedForLater.map((item) => (
              <div
                key={getVariantKey(item)}
                className="bg-white border border-[#EAE5DC] p-3.5 flex items-center gap-3"
              >
                <div className="w-16 h-16 bg-[#F5F5F5] p-1.5 shrink-0">
                  <SmartImage
                    src={item.product.mainImage}
                    alt={item.product.name}
                    brand={item.product.brand}
                    category={item.product.category}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#1A1A1A] truncate">{item.product.name}</p>
                  <p className="text-xs font-bold text-[#1A1A1A] tabular-nums">
                    {formatINR(item.unitPrice)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveToCartFromSaved(item)}
                      className="px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#B5893D] text-white text-[11px] font-semibold cursor-pointer"
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
