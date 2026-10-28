import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Download,
  Grid,
  Heart,
  Home,
  MapPin,
  MessageCircle,
  Percent,
  Search,
  ShieldCheck,
  ShoppingBag,
  Store,
  User,
  WifiOff,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useOnlineStatus, usePWAInstall } from '../hooks/usePWAInstall';

export const Navbar: React.FC = () => {
  const {
    cart,
    wishlist,
    storeSettings,
    selectedCity,
    setSelectedCity,
    isAdmin,
    toastMessage,
    openWhatsAppEnquiry,
  } = useStore();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();

  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const bottomNavItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Categories', path: '/categories', icon: Grid },
    { label: 'Offers', path: '/offers', icon: Percent },
    { label: 'Wishlist', path: '/account?tab=wishlist', icon: Heart, badge: wishlist.length },
    { label: 'Account', path: '/account', icon: User },
  ];

  const isPathActive = (itemPath: string) => {
    if (itemPath === '/') return location.pathname === '/';
    if (itemPath.includes('wishlist')) {
      return location.pathname === '/account' && location.search.includes('wishlist');
    }
    if (itemPath === '/account') {
      return location.pathname === '/account' && !location.search.includes('wishlist');
    }
    return location.pathname.startsWith(itemPath);
  };

  return (
    <>
      {/* Slim Promotional Announcement Bar */}
      <div className="bg-[#101114] text-white border-b border-white/10 text-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-8 flex items-center justify-between gap-4">
          <p className="truncate font-medium text-slate-200">
            {storeSettings.announcementText}
          </p>
          <div className="hidden md:flex items-center gap-5 shrink-0 text-slate-300">
            <button
              type="button"
              onClick={() => setShowLocationModal(true)}
              className="flex items-center gap-1 hover:text-[#00C2FF] transition-colors whitespace-nowrap cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#00C2FF]" />
              <span>Deliver to: {selectedCity}</span>
            </button>
            <Link
              to="/store"
              className="flex items-center gap-1 hover:text-[#00C2FF] transition-colors whitespace-nowrap"
            >
              <Store className="w-3.5 h-3.5 text-[#00C2FF]" />
              <span>Store Locator</span>
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1 text-[#00C2FF] font-semibold hover:underline whitespace-nowrap"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#101114]/95 backdrop-blur-md text-white border-b border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand Monogram & Wordmark */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#090D16] border border-[#00C2FF]/40 flex items-center justify-center shadow-inner">
              <span className="font-extrabold text-sm sm:text-base tracking-tighter text-white">
                C<span className="text-[#00C2FF]">M</span>
              </span>
            </div>
            <div className="leading-none">
              <span className="block text-sm sm:text-base font-extrabold tracking-tight text-white whitespace-nowrap">
                CHARLIE MOBILE
              </span>
              <span className="block text-[10px] font-semibold tracking-widest text-[#00C2FF] uppercase mt-0.5 whitespace-nowrap">
                &amp; ACCESSORIES
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl relative items-center"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search smartphones, iPhone 16, Vivo X200, earbuds, chargers..."
              className="w-full h-10 pl-4 pr-11 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-[#00C2FF] focus:bg-white/15 transition-colors"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1.5 w-8 h-8 rounded-lg bg-[#2563EB] hover:bg-blue-500 flex items-center justify-center text-white cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Mobile Location Trigger */}
            <button
              type="button"
              onClick={() => setShowLocationModal(true)}
              aria-label="Select Location"
              className="md:hidden min-w-[40px] min-h-[40px] px-2 rounded-xl bg-white/5 hover:bg-white/10 flex items-center gap-1 text-xs text-slate-200"
            >
              <MapPin className="w-4 h-4 text-[#00C2FF] shrink-0" />
              <span className="max-w-[70px] truncate">{selectedCity}</span>
            </button>

            {/* Mobile Search Button */}
            <Link
              to="/search"
              aria-label="Search Products"
              className="md:hidden min-w-[40px] min-h-[40px] rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* PWA Install Button (Mandatory per PWA skill) */}
            {!isInstalled && isInstallable && (
              <button
                type="button"
                onClick={install}
                className="min-h-[38px] px-2.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Install App</span>
              </button>
            )}
            {!isInstalled && !isInstallable && isIOS && (
              <button
                type="button"
                onClick={() => setShowIOSModal(true)}
                className="min-h-[38px] px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1 whitespace-nowrap shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-[#00C2FF]" />
                <span className="hidden sm:inline">iOS App</span>
              </button>
            )}

            {/* Store Locator Icon on Mobile */}
            <Link
              to="/store"
              aria-label="Store Locator"
              className="min-w-[40px] min-h-[40px] rounded-xl hover:bg-white/10 flex items-center justify-center text-slate-200"
              title="Store Locator"
            >
              <Store className="w-5 h-5" />
            </Link>

            {/* Wishlist Link on Desktop */}
            <Link
              to="/account?tab=wishlist"
              aria-label="Wishlist"
              className="hidden sm:flex relative min-w-[40px] min-h-[40px] rounded-xl hover:bg-white/10 items-center justify-center text-slate-200"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#2563EB] text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart Button */}
            <Link
              to="/cart"
              aria-label="Shopping Cart"
              className="relative min-w-[42px] min-h-[40px] px-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white flex items-center gap-1.5 text-xs font-bold transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="tabular-nums">{totalCartItems}</span>
            </Link>
          </div>
        </div>

        {/* Secondary Quick Category Strip on Desktop */}
        <nav className="hidden md:block bg-[#16181D] border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 h-10 flex items-center justify-between text-xs font-medium text-slate-300 overflow-x-auto no-scrollbar gap-6">
            <div className="flex items-center gap-6">
              <Link to="/products?category=smartphones" className="hover:text-white whitespace-nowrap">
                All 5G Smartphones
              </Link>
              <Link to="/products?category=iphone" className="hover:text-white whitespace-nowrap">
                iPhone Store
              </Link>
              <Link to="/products?category=samsung" className="hover:text-white whitespace-nowrap">
                Samsung Galaxy
              </Link>
              <Link to="/products?category=vivo" className="hover:text-white whitespace-nowrap">
                Vivo ZEISS Series
              </Link>
              <Link to="/products?category=oneplus" className="hover:text-white whitespace-nowrap">
                OnePlus
              </Link>
              <Link to="/products?category=tablets" className="hover:text-white whitespace-nowrap">
                iPads &amp; Tablets
              </Link>
              <Link to="/products?category=smartwatches" className="hover:text-white whitespace-nowrap">
                Smartwatches
              </Link>
              <Link to="/products?category=earbuds" className="hover:text-white whitespace-nowrap">
                Audio &amp; Earbuds
              </Link>
              <Link to="/products?category=chargers" className="hover:text-white whitespace-nowrap">
                GaN Chargers &amp; Power Banks
              </Link>
            </div>
            <div className="flex items-center gap-5 shrink-0">
              <Link to="/offers" className="text-[#00C2FF] font-semibold hover:underline whitespace-nowrap">
                Exchange &amp; EMI Offers
              </Link>
              <Link to="/admin" className="text-slate-400 hover:text-white whitespace-nowrap">
                Admin Dashboard
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 max-w-sm bg-[#101114] text-white border border-[#2563EB] px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2">
          <span className="text-[#00C2FF]">●</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Offline Mode Indicator */}
      {!isOnline && (
        <div className="fixed bottom-20 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg">
          <WifiOff className="w-4 h-4" />
          <span>Offline Mode — Browsing cached Charlie Mobile catalog</span>
        </div>
      )}

      {/* Floating WhatsApp Support Button */}
      <button
        type="button"
        onClick={() => openWhatsAppEnquiry({})}
        aria-label="WhatsApp Store Support"
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 h-11 px-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg flex items-center gap-2 text-xs font-bold transition-transform active:scale-95 cursor-pointer"
      >
        <MessageCircle className="w-4 h-4 fill-white" />
        <span className="hidden sm:inline">WhatsApp Store</span>
      </button>

      {/* Fixed Bottom Navigation Bar (Mobile App Experience) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] pb-safe"
      >
        <div className="grid grid-cols-5 h-14 items-center">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = isPathActive(item.path);
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`relative flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
                  active ? 'text-[#2563EB] font-bold' : 'text-[#737373] font-medium'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#2563EB] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Location Selector Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl border border-[#E5E7EB]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#2563EB]" />
                <h3 className="text-base font-bold text-[#171717]">
                  Select Delivery / Store Pickup Area
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                className="min-w-[36px] min-h-[36px] rounded-lg hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-3 text-xs text-[#737373]">
              Check instant 2-hour local delivery or Express Store Pickup availability at{' '}
              <strong className="text-[#171717]">{storeSettings.businessName}</strong>.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                'Main Showroom (Pickup)',
                'City Center (2-Hr Express)',
                'North Zone Delivery',
                'South Zone Delivery',
                'East & West Hub',
                'All India Courier',
              ].map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    setSelectedCity(loc);
                    setShowLocationModal(false);
                  }}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition-colors cursor-pointer ${
                    selectedCity === loc
                      ? 'border-[#2563EB] bg-blue-50/70 text-[#2563EB]'
                      : 'border-[#E5E7EB] hover:border-slate-300 text-[#171717]'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* iOS PWA Install Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-[#171717]">
              Install CHARLIE MOBILE on iPhone / iPad
            </h3>
            <p className="mt-2 text-xs text-[#737373] leading-relaxed">
              1. Tap the <strong>Share</strong> icon in Safari&apos;s bottom toolbar.
              <br />
              2. Scroll down and select <strong>Add to Home Screen</strong> for a full-screen app experience.
            </p>
            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="mt-4 w-full h-10 rounded-xl bg-[#101114] text-white text-xs font-semibold"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
