import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Download,
  Grid,
  Heart,
  Home,
  MapPin,
  Menu,
  MessageCircle,
  Package,
  Percent,
  PhoneCall,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Store,
  Truck,
  User,
  WifiOff,
  X,
  Zap,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useOnlineStatus, usePWAInstall } from '../hooks/usePWAInstall';

export const Navbar: React.FC = () => {
  const {
    user,
    cart,
    wishlist,
    categories,
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
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

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
      {/* Top Express Delivery & Location Strip (Poorvika Style) */}
      <div className="bg-[#101114] text-white border-b border-white/10 text-[11px] sm:text-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-8 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-1.5 text-slate-200 hover:text-[#00C2FF] transition-colors truncate cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#00C2FF] shrink-0" />
            <span className="font-semibold truncate">
              Deliver to: <strong className="text-white">{selectedCity}</strong>
            </span>
            <span className="text-[10px] text-[#00C2FF] underline ml-0.5 shrink-0">Change</span>
          </button>

          <div className="flex items-center gap-3 sm:gap-5 shrink-0 text-slate-300">
            <a
              href={`tel:${(storeSettings.phone || '8818850488').replace(/[^0-9+]/g, '')}`}
              className="inline-flex items-center gap-1 text-[#00C2FF] font-extrabold hover:underline whitespace-nowrap"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{storeSettings.phone || '+91 8818850488'}</span>
            </a>
            <span className="hidden md:inline-flex items-center gap-1 text-emerald-400 font-semibold">
              <Zap className="w-3.5 h-3.5" />
              2-Hr Express Delivery
            </span>
            <Link
              to="/store"
              className="flex items-center gap-1 hover:text-[#00C2FF] transition-colors whitespace-nowrap font-medium"
            >
              <Store className="w-3.5 h-3.5 text-[#00C2FF]" />
              <span>Locate Store</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Poorvika-Style Mobile-First Header */}
      <header className="sticky top-0 z-40 bg-[#101114] text-white shadow-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-2.5 pb-2.5 space-y-2">
          {/* Row 1: Hamburger + Brand Logo + Desktop Search + Action Icons */}
          <div className="flex items-center justify-between gap-2.5 sm:gap-6">
            <div className="flex items-center gap-2">
              {/* Mobile Slide-Out Menu Trigger */}
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                aria-label="Open category menu"
                className="lg:hidden w-9 h-9 rounded-xl bg-white/10 hover:bg-white/15 flex items-center justify-center text-white cursor-pointer shrink-0"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Brand Monogram & Wordmark */}
              <Link to="/" className="flex items-center gap-2 shrink-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#00C2FF] p-[1.5px] shadow-sm">
                  <div className="w-full h-full rounded-[10px] bg-[#101114] flex items-center justify-center">
                    <span className="font-extrabold text-sm tracking-tighter text-white">
                      C<span className="text-[#00C2FF]">M</span>
                    </span>
                  </div>
                </div>
                <div className="leading-none">
                  <span className="block text-sm sm:text-base font-extrabold tracking-tight text-white whitespace-nowrap">
                    CHARLIE MOBILE
                  </span>
                  <span className="block text-[9px] sm:text-[10px] font-bold tracking-widest text-[#00C2FF] uppercase mt-0.5 whitespace-nowrap">
                    &amp; ACCESSORIES
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex flex-1 max-w-xl relative items-center"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search For Products, Brands, Offers (iPhone 17 Pro, S26 Ultra, Vivo V80)..."
                className="w-full h-10 pl-4 pr-11 rounded-xl bg-white text-sm text-[#171717] placeholder:text-[#737373] focus:outline-none focus:ring-2 focus:ring-[#F26522]"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1.5 w-8 h-8 rounded-lg bg-[#F26522] hover:bg-[#EA580C] flex items-center justify-center text-white cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Right Action Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* PWA Install Button */}
              {!isInstalled && isInstallable && (
                <button
                  type="button"
                  onClick={install}
                  className="h-9 px-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Install App</span>
                </button>
              )}
              {!isInstalled && !isInstallable && isIOS && (
                <button
                  type="button"
                  onClick={() => setShowIOSModal(true)}
                  className="h-9 px-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-[11px] font-bold flex items-center gap-1 whitespace-nowrap shrink-0"
                >
                  <Download className="w-3.5 h-3.5 text-[#00C2FF]" />
                  <span>App</span>
                </button>
              )}

              {/* Wishlist Icon */}
              <Link
                to="/account?tab=wishlist"
                aria-label="Wishlist"
                className="relative w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-200"
              >
                <Heart className="w-4 h-4" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-[10px] font-bold flex items-center justify-center tabular-nums text-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Shopping Cart Button */}
              <Link
                to="/cart"
                aria-label="Shopping Cart"
                className="relative h-9 px-2.5 rounded-xl bg-[#F26522] hover:bg-[#EA580C] text-white flex items-center gap-1.5 text-xs font-extrabold transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="tabular-nums">{totalCartItems}</span>
              </Link>
            </div>
          </div>

          {/* Row 2 (Mobile Sticky Search Bar — Always reachable like Poorvika Mobile Web) */}
          <form onSubmit={handleSearchSubmit} className="md:hidden relative flex items-center">
            <Search className="w-4 h-4 text-[#737373] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search For Products, Brands, Offers..."
              className="w-full h-10 pl-9 pr-20 rounded-xl bg-white text-xs font-medium text-[#171717] placeholder:text-[#737373] focus:outline-none shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-1.5 h-7 px-3 rounded-lg bg-[#F26522] text-white text-[11px] font-bold"
            >
              Search
            </button>
          </form>
        </div>

        {/* Desktop Category Strip */}
        <nav className="hidden lg:block bg-[#16181D] border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 h-10 flex items-center justify-between text-xs font-semibold text-slate-300 overflow-x-auto no-scrollbar gap-6">
            <div className="flex items-center gap-6">
              <Link to="/products?category=smartphones" className="hover:text-[#00C2FF] whitespace-nowrap">
                Mobiles &amp; 5G Phones
              </Link>
              <Link to="/products?category=iphone" className="hover:text-[#00C2FF] whitespace-nowrap">
                Apple iPhone
              </Link>
              <Link to="/products?category=samsung" className="hover:text-[#00C2FF] whitespace-nowrap">
                Samsung Galaxy
              </Link>
              <Link to="/products?category=vivo" className="hover:text-[#00C2FF] whitespace-nowrap">
                Vivo ZEISS
              </Link>
              <Link to="/products?category=oppo" className="hover:text-[#00C2FF] whitespace-nowrap">
                Oppo
              </Link>
              <Link to="/products?category=oneplus" className="hover:text-[#00C2FF] whitespace-nowrap">
                OnePlus
              </Link>
              <Link to="/products?category=tablets" className="hover:text-[#00C2FF] whitespace-nowrap">
                Tablets &amp; iPads
              </Link>
              <Link to="/products?category=smartwatches" className="hover:text-[#00C2FF] whitespace-nowrap">
                Smartwatches
              </Link>
              <Link to="/products?category=earbuds" className="hover:text-[#00C2FF] whitespace-nowrap">
                Audio &amp; Buds
              </Link>
              <Link to="/products?category=chargers" className="hover:text-[#00C2FF] whitespace-nowrap">
                Chargers &amp; Power Banks
              </Link>
            </div>
            <div className="flex items-center gap-5 shrink-0">
              <Link to="/offers" className="text-[#00C2FF] font-bold hover:underline whitespace-nowrap">
                Exchange &amp; EMI Zone
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Slide-Out Mobile Navigation Drawer (Poorvika Mobile App Menu) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-xs flex">
          <div className="w-[84%] max-w-xs bg-white h-full flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div>
              {/* Drawer Header */}
              <div className="bg-[#101114] text-white p-4 flex items-center justify-between">
                <Link
                  to="/account"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center font-extrabold text-sm">
                    {user?.displayName ? user.displayName.slice(0, 1).toUpperCase() : 'CM'}
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-white">
                      {user ? user.displayName || 'Charlie Member' : 'Sign In / Register'}
                    </p>
                    <p className="text-[11px] text-[#00C2FF]">
                      {user ? user.email : 'Tap to access Orders & Offers'}
                    </p>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Store Actions */}
              <div className="p-3 grid grid-cols-2 gap-2 border-b border-[#E5E7EB] bg-[#F5F6F8]">
                <Link
                  to="/offers"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] flex items-center gap-2 text-xs font-bold text-[#171717]"
                >
                  <RefreshCw className="w-4 h-4 text-[#2563EB]" />
                  <span>Phone Exchange</span>
                </Link>
                <Link
                  to="/store"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] flex items-center gap-2 text-xs font-bold text-[#171717]"
                >
                  <Store className="w-4 h-4 text-[#2563EB]" />
                  <span>Showroom Info</span>
                </Link>
                <Link
                  to="/account?tab=orders"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] flex items-center gap-2 text-xs font-bold text-[#171717]"
                >
                  <Package className="w-4 h-4 text-[#2563EB]" />
                  <span>Track Orders</span>
                </Link>
                <Link
                  to="/account?tab=wishlist"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] flex items-center gap-2 text-xs font-bold text-[#171717]"
                >
                  <Heart className="w-4 h-4 text-[#2563EB]" />
                  <span>My Wishlist</span>
                </Link>
              </div>

              {/* Shop by Categories List */}
              <div className="p-3">
                <p className="px-2 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#737373]">
                  Shop By Category
                </p>
                <div className="mt-1 divide-y divide-[#E5E7EB]/60">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/products?category=${cat.slug}`}
                      onClick={() => setMobileDrawerOpen(false)}
                      className="py-2.5 px-2 flex items-center justify-between text-xs font-bold text-[#171717] hover:text-[#2563EB]"
                    >
                      <div className="flex items-center gap-2.5">
                        <Smartphone className="w-4 h-4 text-[#2563EB]" />
                        <span>{cat.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#737373]" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer Call & WhatsApp Help */}
            <div className="p-4 border-t border-[#E5E7EB] bg-[#F5F6F8] space-y-2">
              <a
                href={`tel:${(storeSettings.phone || '8818850488').replace(/[^0-9+]/g, '')}`}
                className="w-full h-9 rounded-xl bg-[#101114] text-white text-xs font-bold flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#00C2FF]" />
                <span>Call Store: {storeSettings.phone || '+91 8818850488'}</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  openWhatsAppEnquiry({});
                }}
                className="w-full h-9 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp: 8818850488</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileDrawerOpen(false)} />
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 max-w-sm bg-[#101114] text-white border border-[#00C2FF] px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-[#00C2FF] shrink-0" />
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
        className="fixed bottom-[68px] right-3 md:bottom-6 md:right-6 z-40 h-11 px-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg flex items-center gap-1.5 text-xs font-extrabold transition-transform active:scale-95 cursor-pointer border-2 border-white"
      >
        <MessageCircle className="w-4 h-4 fill-white" />
        <span className="hidden sm:inline">WhatsApp Store</span>
      </button>

      {/* Fixed Bottom Navigation Bar (Mobile App Experience) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E7EB] pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.05)]"
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
                  active ? 'text-[#F26522] font-extrabold' : 'text-[#737373] font-semibold'
                }`}
              >
                {active && (
                  <span className="absolute top-0 w-8 h-0.5 rounded-full bg-[#F26522]" />
                )}
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-[#E5E7EB]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#2563EB]" />
                <h3 className="text-base font-extrabold text-[#171717]">
                  Choose Delivery or Store Pickup
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-3 text-xs text-[#737373]">
              Select your preferred delivery zone for 2-Hour Express Delivery or Instant Pickup at{' '}
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
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition-colors cursor-pointer ${
                    selectedCity === loc
                      ? 'border-[#2563EB] bg-blue-50/70 text-[#2563EB]'
                      : 'border-[#E5E7EB] hover:border-slate-300 text-[#171717]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                    <span className="truncate">{loc}</span>
                  </div>
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
