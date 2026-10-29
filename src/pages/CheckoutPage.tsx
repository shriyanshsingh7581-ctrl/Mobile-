import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Lock,
  MessageCircle,
  ShieldCheck,
  Store,
  Truck,
} from 'lucide-react';
import { formatINR, useStore } from '../context/StoreContext';
import { Order } from '../types/store';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    user,
    appliedCoupon,
    storeSettings,
    placeOrder,
    sendOrderViaWhatsApp,
    sendCartOrderViaWhatsApp,
  } = useStore();

  const [customerName, setCustomerName] = useState(user?.displayName || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pinCode, setPinCode] = useState('');

  const [deliveryMethod, setDeliveryMethod] =
    useState<Order['deliveryMethod']>('store_pickup');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>(
    storeSettings.codEnabled ? 'cod' : 'upi'
  );
  const [upiReference, setUpiReference] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sendToWhatsAppOnSubmit, setSendToWhatsAppOnSubmit] = useState(true);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  let couponDiscount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrderAmount) {
    couponDiscount =
      appliedCoupon.discountType === 'flat'
        ? appliedCoupon.discountValue
        : Math.min(
            appliedCoupon.maxDiscount || 999999,
            Math.round((subtotal * appliedCoupon.discountValue) / 100)
          );
  }

  const deliveryFee = deliveryMethod === 'shipping' && subtotal < 15000 ? 199 : 0;
  const totalAmount = Math.max(0, subtotal - couponDiscount + deliveryFee);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setSubmitting(true);
    try {
      const fullAddress =
        deliveryMethod === 'store_pickup'
          ? `Store Pickup at ${storeSettings.businessName} (${city || 'Main Showroom'})`
          : `${address}, ${city}, ${stateName} - ${pinCode}`;

      // IMPORTANT: Never simulate a fake online payment confirmation.
      // COD / Store Pickup Pay-at-Store uses 'cod_due'.
      // UPI / Online Gateway uses 'pending_verification' until verified by an actual payment provider / store admin.
      const paymentStatus: Order['paymentStatus'] =
        paymentMethod === 'cod' ? 'cod_due' : 'pending_verification';

      const itemsSummary = cart
        .map(
          (i) =>
            `${i.product.name} (${i.selectedColor}, ${i.selectedStorage}) x${i.quantity}`
        )
        .join('; ');

      const created = await placeOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        shippingAddress: fullAddress,
        city,
        state: stateName,
        pinCode,
        deliveryMethod,
        paymentMethod,
        paymentStatus,
        status: 'pending',
        items: cart.map((i) => ({
          productId: i.productId,
          name: i.product.name,
          variant: `${i.selectedColor} · ${i.selectedStorage}`,
          quantity: i.quantity,
          price: i.unitPrice,
          image: i.product.mainImage,
        })),
        itemsSummary,
        subtotal,
        discount: couponDiscount,
        deliveryFee,
        totalAmount,
        upiReference: upiReference.trim() || undefined,
      });

      setPlacedOrder(created);
      if (sendToWhatsAppOnSubmit) {
        sendOrderViaWhatsApp(created);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 space-y-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
              {placedOrder.paymentStatus === 'cod_due' ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              ) : (
                <Clock className="w-6 h-6 text-amber-600" />
              )}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Order #{placedOrder.id} Recorded
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#171717]">
                {placedOrder.paymentMethod === 'cod'
                  ? 'Order Placed — Pay on Delivery / Store Pickup'
                  : 'Order Placed — Awaiting Payment Provider Confirmation'}
              </h1>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F6F8] border border-[#E5E7EB] text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[#737373]">Customer:</span>
              <span className="font-bold text-[#171717]">{placedOrder.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#737373]">Fulfillment Mode:</span>
              <span className="font-bold text-[#171717] uppercase">
                {placedOrder.deliveryMethod.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#737373]">Payment Status:</span>
              <span className="font-bold text-amber-700">
                {placedOrder.paymentStatus === 'cod_due'
                  ? 'Payable on Handover / Pickup'
                  : 'Pending Payment Gateway / Bank Verification'}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#E5E7EB] text-sm font-extrabold text-[#171717] tabular-nums">
              <span>Order Total:</span>
              <span>{formatINR(placedOrder.totalAmount)}</span>
            </div>
          </div>

          <p className="text-xs text-[#737373] leading-relaxed">
             Note: We never simulate fake online payment completions. Your order status will update to{' '}
            <strong>Paid &amp; Confirmed</strong> once verified by the payment provider or at the Charlie Mobile counter.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => sendOrderViaWhatsApp(placedOrder)}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Send Full Order #{placedOrder.id} Bill on WhatsApp</span>
            </button>
            <Link
              to="/account"
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#101114] text-white text-xs font-bold flex items-center"
            >
              Track in My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center space-y-4">
        <h1 className="text-xl font-extrabold text-[#171717]">No Items to Checkout</h1>
        <Link
          to="/products"
          className="inline-block px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold"
        >
          Browse Smartphones
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-[#2563EB] uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5" />
          <span>Charlie Mobile Checkout</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
          Complete Your Order
        </h1>
      </div>

      <form
        onSubmit={handleSubmitOrder}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
      >
        {/* Left: Customer Info, Delivery & Payment Options */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Delivery Method */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-5 space-y-4">
            <h2 className="text-base font-extrabold text-[#171717]">
              1. Choose Delivery or Store Pickup
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'store_pickup',
                  title: 'Store Pickup',
                  desc: 'Ready in 30 mins at Charlie Mobile',
                  icon: Store,
                },
                {
                  id: 'local_delivery',
                  title: 'Local Delivery',
                  desc: 'Same-day express doorstep delivery',
                  icon: Truck,
                },
                {
                  id: 'shipping',
                  title: 'Courier Shipping',
                  desc: 'Insured Pan-India delivery',
                  icon: ShieldCheck,
                },
              ].map((opt) => {
                const Icon = opt.icon;
                const active = deliveryMethod === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDeliveryMethod(opt.id as Order['deliveryMethod'])}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      active
                        ? 'border-[#2563EB] bg-blue-50/70'
                        : 'border-[#E5E7EB] hover:border-slate-300'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${active ? 'text-[#2563EB]' : 'text-[#737373]'}`}
                    />
                    <p className="mt-2 text-xs font-extrabold text-[#171717]">{opt.title}</p>
                    <p className="text-[11px] text-[#737373] mt-0.5">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Customer Information */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-5 space-y-4">
            <h2 className="text-base font-extrabold text-[#171717]">
              2. Customer &amp; Address Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#171717] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#171717] mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-bold text-[#171717] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="For GST invoice and warranty registration"
                  className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                />
              </div>

              {deliveryMethod !== 'store_pickup' && (
                <>
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-[#171717] mb-1">
                      Street Address / Landmark *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House/Flat No., Building, Street, Area"
                      className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#171717] mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-[#171717] mb-1">State *</label>
                      <input
                        type="text"
                        required
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        placeholder="State"
                        className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#171717] mb-1">PIN Code *</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="6-digit PIN"
                        className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Step 3: Payment Options */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-5 space-y-4">
            <h2 className="text-base font-extrabold text-[#171717]">3. Payment Method</h2>
            <div className="space-y-2.5 text-xs">
              {storeSettings.codEnabled && (
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#2563EB] bg-blue-50/60'
                      : 'border-[#E5E7EB]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="font-extrabold text-[#171717]">
                      Cash / UPI / Card on Delivery or Store Pickup
                    </p>
                    <p className="text-[#737373] mt-0.5">
                      Inspect your sealed device at Charlie Mobile or at your doorstep before paying.
                    </p>
                  </div>
                </label>
              )}

              <label
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'border-[#2563EB] bg-blue-50/60'
                    : 'border-[#E5E7EB]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <p className="font-extrabold text-[#171717]">Direct UPI Transfer</p>
                  <p className="text-[#737373] mt-0.5">
                    {storeSettings.upiId
                      ? `Merchant UPI ID: ${storeSettings.upiId}`
                      : 'Store UPI ID configurable in Admin Panel. Order will be marked Pending Verification until bank confirmation.'}
                  </p>
                  {paymentMethod === 'upi' && (
                    <input
                      type="text"
                      value={upiReference}
                      onChange={(e) => setUpiReference(e.target.value)}
                      placeholder="Optional 12-digit UPI UTR / Reference Number"
                      className="mt-2 w-full h-9 px-3 rounded-xl bg-white border border-[#E5E7EB] text-xs"
                    />
                  )}
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer ${
                  paymentMethod === 'online'
                    ? 'border-[#2563EB] bg-blue-50/60'
                    : 'border-[#E5E7EB]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'online'}
                  onChange={() => setPaymentMethod('online')}
                  className="mt-0.5"
                />
                <div>
                  <p className="font-extrabold text-[#171717]">
                    Online Payment Gateway / Credit Card EMI
                  </p>
                  <p className="text-[#737373] mt-0.5">
                    Requires live payment provider confirmation. Will be recorded as Pending Verification until gateway webhook confirms payment.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E5E7EB] p-5 space-y-4 sticky top-28">
          <h2 className="text-base font-extrabold text-[#171717]">Order Summary</h2>
          <div className="divide-y divide-[#E5E7EB] max-h-72 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.productId + item.selectedColor} className="py-3 flex justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-[#171717]">{item.product.name}</p>
                  <p className="text-[#737373]">
                    {item.selectedColor} · {item.selectedStorage} × {item.quantity}
                  </p>
                </div>
                <span className="font-extrabold text-[#171717] tabular-nums shrink-0">
                  {formatINR(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E5E7EB] space-y-2 text-xs">
            <div className="flex justify-between text-[#737373] tabular-nums">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold tabular-nums">
                <span>Coupon Discount</span>
                <span>- {formatINR(couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#737373] tabular-nums">
              <span>Delivery Charges</span>
              <span>{deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}</span>
            </div>
            <div className="pt-3 border-t border-[#E5E7EB] flex justify-between items-baseline text-base font-extrabold text-[#171717] tabular-nums">
              <span>Total Payable</span>
              <span className="text-xl">{formatINR(totalAmount)}</span>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            <button
              type="submit"
              disabled={submitting}
              onClick={() => setSendToWhatsAppOnSubmit(true)}
              className="w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] disabled:bg-slate-400 text-white text-sm font-extrabold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>
                {submitting
                  ? 'Sending Order...'
                  : `Place Order on WhatsApp (${formatINR(totalAmount)})`}
              </span>
            </button>

            <button
              type="submit"
              disabled={submitting}
              onClick={() => setSendToWhatsAppOnSubmit(false)}
              className="w-full h-11 rounded-xl bg-[#F26522] hover:bg-[#EA580C] disabled:bg-slate-400 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>
                {submitting
                  ? 'Placing Order...'
                  : `Place Website Order Only (${formatINR(totalAmount)})`}
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                sendCartOrderViaWhatsApp({
                  customerName: customerName.trim(),
                  customerPhone: customerPhone.trim(),
                  shippingAddress: address
                    ? `${address}, ${city} ${pinCode}`
                    : undefined,
                  deliveryMethod,
                  paymentMethod,
                })
              }
              className="w-full h-10 rounded-xl border border-[#25D366] bg-emerald-50/50 hover:bg-emerald-50 text-[#171717] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Quick WhatsApp Order Without Form</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
