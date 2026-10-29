import React, { useState } from 'react';
import { CheckCircle2, MapPin, MessageCircle, Store, Truck, User, Phone, X } from 'lucide-react';
import { formatINR, useStore } from '../context/StoreContext';
import { Order, Product } from '../types/store';

interface WhatsAppOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'single_product' | 'cart';
  singleProduct?: {
    product: Product;
    variant: string;
    selectedColor: string;
    selectedRam: string;
    selectedStorage: string;
    unitPrice: number;
    quantity: number;
  };
}

export const WhatsAppOrderModal: React.FC<WhatsAppOrderModalProps> = ({
  isOpen,
  onClose,
  mode,
  singleProduct,
}) => {
  const {
    user,
    cart,
    appliedCoupon,
    storeSettings,
    selectedCity,
    placeOrder,
    openWhatsAppEnquiry,
    sendOrderViaWhatsApp,
    sendCartOrderViaWhatsApp,
  } = useStore();

  const [customerName, setCustomerName] = useState(user?.displayName || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<Order['deliveryMethod']>('local_delivery');
  const [address, setAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const isSingle = mode === 'single_product' && singleProduct;

  const subtotal = isSingle
    ? singleProduct.unitPrice * singleProduct.quantity
    : cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  let couponDiscount = 0;
  if (!isSingle && appliedCoupon && subtotal >= appliedCoupon.minOrderAmount) {
    if (appliedCoupon.discountType === 'flat') {
      couponDiscount = appliedCoupon.discountValue;
    } else {
      couponDiscount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maxDiscount) {
        couponDiscount = Math.min(couponDiscount, appliedCoupon.maxDiscount);
      }
    }
  }

  const totalAmount = Math.max(0, subtotal - couponDiscount);

  const handleInstantOneClickWhatsApp = () => {
    if (isSingle) {
      openWhatsAppEnquiry({
        productName: singleProduct.product.name,
        productId: singleProduct.product.id,
        price: singleProduct.unitPrice,
        variant: singleProduct.variant,
        quantity: singleProduct.quantity,
      });
    } else {
      sendCartOrderViaWhatsApp();
    }
    onClose();
  };

  const handleFullOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fullAddress =
        deliveryMethod === 'store_pickup'
          ? `Store Pickup at ${storeSettings.businessName} (${selectedCity})`
          : `${address.trim()}, ${selectedCity}${pinCode ? ` - ${pinCode}` : ''}`;

      const items = isSingle
        ? [
            {
              productId: singleProduct.product.id,
              name: singleProduct.product.name,
              variant: singleProduct.variant,
              quantity: singleProduct.quantity,
              price: singleProduct.unitPrice,
              image: singleProduct.product.mainImage,
            },
          ]
        : cart.map((i) => ({
            productId: i.productId,
            name: i.product.name,
            variant: `${i.selectedColor} · ${i.selectedStorage}`,
            quantity: i.quantity,
            price: i.unitPrice,
            image: i.product.mainImage,
          }));

      const itemsSummary = items
        .map((i) => `${i.name} (${i.variant}) x${i.quantity}`)
        .join('; ');

      const createdOrder = await placeOrder({
        customerName: customerName.trim() || 'WhatsApp Customer',
        customerPhone: customerPhone.trim(),
        customerEmail: user?.email || '',
        shippingAddress: fullAddress,
        city: selectedCity,
        state: 'Chhattisgarh',
        pinCode: pinCode || '492001',
        deliveryMethod,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'cod_due' : 'pending_verification',
        status: 'pending',
        items,
        itemsSummary,
        subtotal,
        discount: couponDiscount,
        deliveryFee: 0,
        totalAmount,
      });

      sendOrderViaWhatsApp(createdOrder);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Green WhatsApp Header */}
        <div className="bg-[#25D366] text-white px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold leading-tight">
                Order on WhatsApp
              </h3>
              <p className="text-[11px] text-white/90">
                {storeSettings.businessName} · {storeSettings.phone}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-black/15 hover:bg-black/25 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Selected Item / Cart Summary Preview */}
          <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 p-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                {isSingle ? 'Direct Product Order' : `Cart Order (${cart.length} Items)`}
              </span>
              <p className="text-xs sm:text-sm font-extrabold text-[#1E293B] truncate">
                {isSingle
                  ? `${singleProduct.product.name} (${singleProduct.variant})`
                  : cart.map((i) => i.product.name).join(', ')}
              </p>
              {isSingle && (
                <p className="text-[11px] text-slate-500">Quantity: {singleProduct.quantity}</p>
              )}
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold text-slate-500 block">Total Payable</span>
              <span className="text-base font-extrabold text-[#28A745] tabular-nums">
                {formatINR(totalAmount)}
              </span>
            </div>
          </div>

          {/* 1-Click Direct WhatsApp Option */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold text-[#1E293B]">
                Want to chat directly without filling details?
              </p>
              <p className="text-[11px] text-slate-500">
                Send product &amp; price directly to WhatsApp in 1 click
              </p>
            </div>
            <button
              type="button"
              onClick={handleInstantOneClickWhatsApp}
              className="px-3.5 py-2 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-extrabold shrink-0 flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>Instant Send</span>
            </button>
          </div>

          <div className="relative flex py-0.5 items-center">
            <div className="flex-grow border-t border-slate-200" />
            <span className="shrink-0 mx-3 text-[11px] font-bold uppercase text-slate-400">
              Or Add Delivery Details for Instant Order Bill
            </span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          {/* Quick WhatsApp Order Form */}
          <form onSubmit={handleFullOrderSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#1E293B] mb-1">Your Name *</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full h-10 pl-8 pr-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#25D366]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1E293B] mb-1">Mobile Number *</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="10-digit WhatsApp / Mobile No."
                    className="w-full h-10 pl-8 pr-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#25D366]"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Mode */}
            <div>
              <label className="block font-bold text-[#1E293B] mb-1.5">Delivery Option</label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('local_delivery')}
                  className={`p-2.5 rounded-lg border text-left flex items-center gap-2 cursor-pointer ${
                    deliveryMethod !== 'store_pickup'
                      ? 'border-[#25D366] bg-emerald-50/60 text-[#1E293B]'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Truck className="w-4 h-4 text-[#25D366] shrink-0" />
                  <div>
                    <p className="font-extrabold text-xs">Home Delivery</p>
                    <p className="text-[10px] text-slate-500">Doorstep Delivery</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('store_pickup')}
                  className={`p-2.5 rounded-lg border text-left flex items-center gap-2 cursor-pointer ${
                    deliveryMethod === 'store_pickup'
                      ? 'border-[#25D366] bg-emerald-50/60 text-[#1E293B]'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Store className="w-4 h-4 text-[#25D366] shrink-0" />
                  <div>
                    <p className="font-extrabold text-xs">Store Pickup</p>
                    <p className="text-[10px] text-slate-500">Pick at Showroom</p>
                  </div>
                </button>
              </div>
            </div>

            {deliveryMethod !== 'store_pickup' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#1E293B] mb-1">
                    Delivery Address / Landmark *
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House No, Street, Area, City"
                      className="w-full h-10 pl-8 pr-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#25D366]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-[#1E293B] mb-1">Pincode</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="6-digit PIN"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#25D366]"
                  />
                </div>
              </div>
            )}

            {/* Payment Preference */}
            <div>
              <label className="block font-bold text-[#1E293B] mb-1.5">Payment Preference</label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#25D366] bg-emerald-50/60 text-[#1E293B]'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Cash / Pay on Delivery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'border-[#25D366] bg-emerald-50/60 text-[#1E293B]'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>UPI / Online Payment</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-sm font-extrabold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer mt-2"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>
                {submitting
                  ? 'Creating WhatsApp Order...'
                  : `Send Complete Order on WhatsApp (${formatINR(totalAmount)})`}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
