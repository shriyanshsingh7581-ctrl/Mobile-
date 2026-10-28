import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Heart,
  LogOut,
  MapPin,
  MessageCircle,
  Package,
  Settings,
  ShieldCheck,
  User as UserIcon,
  X,
} from 'lucide-react';
import { formatINR, useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Order } from '../types/store';

export const AccountPage: React.FC = () => {
  const {
    user,
    isAdmin,
    loginWithGoogle,
    logout,
    orders,
    wishlist,
    products,
    showToast,
    openWhatsAppEnquiry,
  } = useStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'orders';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [savedAddresses, setSavedAddresses] = useState<
    { id: string; label: string; details: string }[]
  >(() => {
    try {
      const raw = localStorage.getItem('charlie_mobile_addresses_v1');
      return raw
        ? JSON.parse(raw)
        : [
            {
              id: 'addr_1',
              label: 'Home Address',
              details: 'Add your preferred doorstep delivery address below.',
            },
          ];
    } catch {
      return [];
    }
  });
  const [newAddrLabel, setNewAddrLabel] = useState('');
  const [newAddrDetails, setNewAddrDetails] = useState('');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) setActiveTab(tabParam);
  }, [searchParams]);

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLabel.trim() || !newAddrDetails.trim()) return;
    const updated = [
      ...savedAddresses,
      { id: `addr_${Date.now()}`, label: newAddrLabel.trim(), details: newAddrDetails.trim() },
    ];
    setSavedAddresses(updated);
    localStorage.setItem('charlie_mobile_addresses_v1', JSON.stringify(updated));
    setNewAddrLabel('');
    setNewAddrDetails('');
    showToast('Saved address added');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-8 space-y-6">
      {/* Top User Banner */}
      <div className="bg-[#101114] text-white rounded-3xl p-5 sm:p-7 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#2563EB] flex items-center justify-center text-xl font-extrabold">
            {user?.displayName ? user.displayName.slice(0, 1).toUpperCase() : 'C'}
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#00C2FF]">
              {user ? 'Verified Charlie Mobile Member' : 'Guest Shopper Account'}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold">
              {user ? user.displayName || user.email : 'Welcome to Charlie Mobile'}
            </h1>
            {user?.email && <p className="text-xs text-slate-400">{user.email}</p>}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {isAdmin && (
            <Link
              to="/admin"
              className="min-h-[40px] px-4 py-2 rounded-xl bg-[#00C2FF] text-[#101114] text-xs font-extrabold flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Open Admin Panel</span>
            </Link>
          )}
          {user ? (
            <button
              type="button"
              onClick={logout}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={loginWithGoogle}
              className="min-h-[42px] px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
            >
              Sign In with Google
            </button>
          )}
        </div>
      </div>

      {/* Authentication Card when signed out */}
      {!user && (
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-5 sm:p-6">
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3 mb-4 text-xs font-bold">
            <button
              type="button"
              onClick={() => setAuthMode('signin')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                authMode === 'signin' ? 'bg-[#101114] text-white' : 'text-[#737373]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                authMode === 'signup' ? 'bg-[#101114] text-white' : 'text-[#737373]'
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('forgot')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                authMode === 'forgot' ? 'bg-[#101114] text-white' : 'text-[#737373]'
              }`}
            >
              Account Recovery
            </button>
          </div>

          {authMode === 'forgot' ? (
            <div className="space-y-2 text-xs text-[#737373]">
              <p className="font-bold text-[#171717]">
                Passwordless Google Sign-In Enabled
              </p>
              <p>
                Charlie Mobile uses secure Google Authentication so you never need to remember a separate store password. Click below to sign in or recover access via your Google Account.
              </p>
              <button
                type="button"
                onClick={loginWithGoogle}
                className="mt-2 h-10 px-5 rounded-xl bg-[#2563EB] text-white text-xs font-bold cursor-pointer"
              >
                Continue with Google
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-base font-extrabold text-[#171717]">
                  {authMode === 'signin'
                    ? 'Sign in to sync your Cart, Wishlist & Order History'
                    : 'Register your Charlie Mobile Account in one tap'}
                </h2>
                <p className="text-xs text-[#737373]">
                  Access instant GST invoices, warranty tracking, and exclusive upgrade offers.
                </p>
              </div>
              <button
                type="button"
                onClick={loginWithGoogle}
                className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#101114] hover:bg-[#2563EB] text-white text-xs font-bold transition-colors shrink-0 cursor-pointer"
              >
                {authMode === 'signin' ? 'Sign In with Google' : 'Sign Up with Google'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Account Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'orders', label: `My Orders (${orders.length})`, icon: Package },
          { id: 'wishlist', label: `Wishlist (${wishlistedProducts.length})`, icon: Heart },
          { id: 'profile', label: 'My Profile', icon: UserIcon },
          { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
          { id: 'settings', label: 'Account Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setSearchParams({ tab: tab.id });
              }}
              className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                active
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-white border border-[#E5E7EB] text-[#171717] hover:border-[#2563EB]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 text-center space-y-3">
              <Package className="w-8 h-8 text-[#2563EB] mx-auto" />
              <p className="text-base font-extrabold text-[#171717]">No Orders Placed Yet</p>
              <p className="text-xs text-[#737373]">
                When you order smartphones or accessories at Charlie Mobile, your live tracking details appear here.
              </p>
              <Link
                to="/products"
                className="inline-block px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold"
              >
                Explore Smartphones
              </Link>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-[#737373]">
                    <span className="font-extrabold text-[#171717]">Order #{ord.id}</span>
                    <span>·</span>
                    <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                    <span>·</span>
                    <span className="uppercase font-bold text-[#2563EB]">{ord.status}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#171717]">
                    {ord.itemsSummary}
                  </p>
                  <p className="text-xs text-[#737373]">
                    Fulfillment: {ord.deliveryMethod.replace('_', ' ')} · Payment:{' '}
                    {ord.paymentStatus.replace('_', ' ')}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-extrabold text-[#171717] tabular-nums">
                    {formatINR(ord.totalAmount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(ord)}
                    className="px-3.5 py-2 rounded-xl border border-[#E5E7EB] hover:border-[#2563EB] text-xs font-bold cursor-pointer"
                  >
                    Order Details
                  </button>
                  <button
                    type="button"
                    onClick={() => openWhatsAppEnquiry({ orderId: ord.id })}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Enquire</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'wishlist' && (
        <div>
          {wishlistedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 text-center space-y-3">
              <Heart className="w-8 h-8 text-rose-500 mx-auto" />
              <p className="text-base font-extrabold text-[#171717]">Your Wishlist is Empty</p>
              <Link
                to="/products"
                className="inline-block px-5 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {wishlistedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-5 sm:p-6 space-y-4 text-xs">
          <h2 className="text-base font-extrabold text-[#171717]">My Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-2xl bg-[#F5F6F8]">
              <span className="text-[#737373]">Full Name</span>
              <p className="font-bold text-[#171717] mt-0.5">
                {user?.displayName || 'Guest Customer'}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F5F6F8]">
              <span className="text-[#737373]">Email Address</span>
              <p className="font-bold text-[#171717] mt-0.5">
                {user?.email || 'Sign in with Google to link your email'}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'addresses' && (
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-5 sm:p-6 space-y-5">
          <h2 className="text-base font-extrabold text-[#171717]">Saved Delivery Addresses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedAddresses.map((addr) => (
              <div
                key={addr.id}
                className="p-4 rounded-2xl border border-[#E5E7EB] bg-[#F5F6F8] text-xs space-y-1"
              >
                <p className="font-extrabold text-[#171717]">{addr.label}</p>
                <p className="text-[#737373]">{addr.details}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddAddress} className="pt-4 border-t border-[#E5E7EB] space-y-3 text-xs max-w-md">
            <h3 className="font-bold text-[#171717]">Add New Address</h3>
            <input
              type="text"
              required
              value={newAddrLabel}
              onChange={(e) => setNewAddrLabel(e.target.value)}
              placeholder="Label (e.g. Home, Office)"
              className="w-full h-9 px-3 rounded-xl border border-[#E5E7EB]"
            />
            <textarea
              required
              rows={2}
              value={newAddrDetails}
              onChange={(e) => setNewAddrDetails(e.target.value)}
              placeholder="Full Street Address, Landmark & PIN Code"
              className="w-full p-3 rounded-xl border border-[#E5E7EB]"
            />
            <button
              type="submit"
              className="h-9 px-4 rounded-xl bg-[#101114] text-white font-bold cursor-pointer"
            >
              Save Address
            </button>
          </form>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-5 sm:p-6 space-y-4 text-xs">
          <h2 className="text-base font-extrabold text-[#171717]">Account &amp; Notification Settings</h2>
          <label className="flex items-center justify-between p-3 rounded-xl bg-[#F5F6F8]">
            <span className="font-semibold text-[#171717]">
              WhatsApp Order &amp; Price Drop Updates
            </span>
            <input type="checkbox" defaultChecked className="rounded text-[#2563EB]" />
          </label>
          <label className="flex items-center justify-between p-3 rounded-xl bg-[#F5F6F8]">
            <span className="font-semibold text-[#171717]">
              New 5G Smartphone Launch Alerts
            </span>
            <input type="checkbox" defaultChecked className="rounded text-[#2563EB]" />
          </label>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h3 className="text-base font-extrabold text-[#171717]">
                Order #{selectedOrder.id} Details
              </h3>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <p>
                <strong>Customer:</strong> {selectedOrder.customerName} ({selectedOrder.customerPhone})
              </p>
              <p>
                <strong>Address / Pickup:</strong> {selectedOrder.shippingAddress}
              </p>
              <p>
                <strong>Items:</strong> {selectedOrder.itemsSummary}
              </p>
              <p>
                <strong>Order Status:</strong>{' '}
                <span className="uppercase font-bold text-[#2563EB]">{selectedOrder.status}</span>
              </p>
              <p>
                <strong>Payment Status:</strong>{' '}
                <span className="uppercase font-bold text-amber-700">
                  {selectedOrder.paymentStatus.replace('_', ' ')}
                </span>
              </p>
              <p className="text-sm font-extrabold pt-2 border-t border-[#E5E7EB] tabular-nums">
                Total Amount: {formatINR(selectedOrder.totalAmount)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
