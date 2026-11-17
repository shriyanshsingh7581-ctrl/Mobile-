import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
  Film,
  Home,
  LayoutGrid,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  User,
  WifiOff,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useOnlineStatus } from '../hooks/usePWAInstall';
import { PWAInstallBanner } from './PWAInstallBanner';
import { SmartImage } from './SmartImage';
import { LoginModal } from './LoginModal';

const DEFAULT_LOGO_URL = '/charlie-logo.png';

const SHOP_ACCORDION_SECTIONS = [
  {
    id: 'notes',
    label: 'Notes / Highlights',
    items: [
      { name: 'Titanium Craft', link: '/products?category=iphone' },
      { name: 'Cinema Optics', link: '/products?category=vivo' },
      { name: 'Hyper 5G Core', link: '/products?category=samsung' },
      { name: 'Pure Acoustics', link: '/products?category=tv-audio' },
    ],
  },
  {
    id: 'gender',
    label: 'Gender / Edition',
    items: [
      { name: 'For Him — Executive Series', link: '/products?category=smartphones' },
      { name: 'For Her — Signature Gold & Rose', link: '/products?category=iphone' },
      { name: 'Unisex Luxury Collection', link: '/products' },
    ],
  },
  {
    id: 'price',
    label: 'Price',
    items: [
      { name: 'Under ₹15,000', link: '/products' },
      { name: '₹15,000 – ₹40,000', link: '/products?category=vivo' },
      { name: '₹40,000 & Above Flagships', link: '/products?category=iphone' },
    ],
  },
  {
    id: 'collections',
    label: 'Collections',
    items: [
      { name: 'Royal Reserve Series', link: '/products?category=iphone' },
      { name: 'Galaxy Ultra Vault', link: '/products?category=samsung' },
      { name: 'ZEISS Studio Edition', link: '/products?category=vivo' },
      { name: 'Hasselblad Master Series', link: '/products?category=oppo' },
    ],
  },
  {
    id: 'occasions',
    label: 'Occasions',
    items: [
      { name: 'Executive Office', link: '/products?category=tablets' },
      { name: 'Evening Gala', link: '/products?category=iphone' },
      { name: 'Everyday Wear', link: '/products?category=smartwatches' },
      { name: 'Celebration & Gifting', link: '/offers' },
    ],
  },
  {
    id: 'dna',
    label: 'Our Craft & DNA',
    items: [
      { name: '100% Authentic & Sealed', link: '/store' },
      { name: 'Showroom Concierge Experience', link: '/store' },
    ],
  },
];

export const Navbar: React.FC = () => {
  const {
    user,
    mobileUser,
    cart,
    categories,
    storeSettings,
    toastMessage,
    setLoginModalOpen,
    setChatbotOpen,
    openWhatsAppEnquiry,
  } = useStore();
  const isOnline = useOnlineStatus();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [expandedShopSection, setExpandedShopSection] = useState<string | null>(null);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const megaMenuCards =
    storeSettings.megaMenuCards && storeSettings.megaMenuCards.length > 0
      ? storeSettings.megaMenuCards
      : [
          {
            id: 'mm_1',
            title: 'BESTSELLERS',
            image:
              'https://img-prd-pim.poorvika.com/product/Apple-iPhone-17-Pro-Max-Cosmic-Orange-2tB-front-back-view.png',
            link: '/products?category=iphone',
          },
          {
            id: 'mm_2',
            title: 'GIFT SETS',
            image:
              'https://img-prd-pim.poorvika.com/product/Samsung-galaxy-s26-ultra-5g-cobalt-violet-16gb-1Tb-Front-Back-View.webp',
            link: '/offers',
          },
          {
            id: 'mm_3',
            title: 'LUXURY SERIES',
            image:
              'https://img-prd-pim.poorvika.com/product/Vivo-V80-5G-Horizon-Blue-8GB-512GB-front-back-view.webp',
            link: '/products?category=vivo',
          },
        ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const handleReelsNavClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById('celebrity-reels')?.scrollIntoView({ behavior: 'smooth' });
      }, 250);
    } else {
      document.getElementById('celebrity-reels')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BAR (EXACT VIDEO 00:31 - 00:35) */}
      <div className="bg-[#FAF7F2] border-b border-[#EAE5DC] text-[#1A1A1A] py-1.5 px-3 text-center">
        <Link
          to="/offers"
          className="text-[11px] sm:text-xs font-medium tracking-wide text-[#1A1A1A] hover:text-[#B5893D] transition-colors inline-flex items-center justify-center gap-1.5"
        >
          <span>
            {storeSettings.announcementText || '❤ Look Good. Feel Royal. Shop Bestsellers ❤'}
          </span>
        </Link>
      </div>

      {/* 2. STICKY LUXURY WHITE HEADER (EXACT VIDEO 00:21 - 00:35) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EAE5DC] text-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 h-14 sm:h-16 grid grid-cols-3 items-center">
          {/* Left: Hamburger Menu Button (☰) + Instant Search Icon (🔍) */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open Navigation Drawer"
              className="p-1.5 -ml-1.5 text-[#1A1A1A] hover:text-[#B5893D] transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
            </button>

            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search Catalog"
              className="p-1.5 text-[#1A1A1A] hover:text-[#B5893D] transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5 sm:w-5 sm:h-5 stroke-[1.75]" />
            </button>
          </div>

          {/* Center: Royal Gold Crest / Brand Logo */}
          <div className="flex items-center justify-center">
            <Link to="/" className="flex flex-col items-center justify-center group">
              <div className="flex items-center gap-2">
                <img
                  src={storeSettings.logoUrl || DEFAULT_LOGO_URL}
                  alt={storeSettings.businessName || 'Charlie Luxury'}
                  className="h-8 sm:h-10 w-auto object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Right: User Account Icon + Shopping Bag Icon with Live Count Badge */}
          <div className="flex items-center justify-end gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => {
                if (user || mobileUser) {
                  navigate('/account');
                } else {
                  setLoginModalOpen(true);
                }
              }}
              aria-label="Account"
              className="p-1.5 text-[#1A1A1A] hover:text-[#B5893D] transition-colors cursor-pointer"
            >
              <User className="w-5 h-5 stroke-[1.75]" />
            </button>

            <Link
              to="/cart"
              aria-label="Shopping Bag"
              className="relative p-1.5 -mr-1.5 text-[#1A1A1A] hover:text-[#B5893D] transition-colors"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              {totalCartItems > 0 && (
                <span className="absolute top-0.5 right-0 min-w-[16px] h-[16px] px-1 rounded-full bg-[#B5893D] text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
                  {totalCartItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Expandable Instant Search Bar */}
        {searchOpen && (
          <div className="border-t border-[#EAE5DC] bg-[#FAF7F2] px-4 py-3 animate-in slide-in-from-top-1 duration-150">
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-2xl mx-auto relative flex items-center"
            >
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search signature flagships, luxury gift sets, wearables..."
                className="w-full h-10 pl-4 pr-20 bg-white border border-[#D4CFC7] focus:border-[#B5893D] text-xs sm:text-sm text-[#1A1A1A] placeholder:text-[#888888] focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-1.5 h-7 px-3 bg-[#1A1A1A] hover:bg-[#B5893D] text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* 3. SLIDE-OVER MEGA NAVIGATION DRAWER (EXACT VIDEO 00:36 - 00:46) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px] flex">
          <div className="w-[88%] max-w-[380px] bg-white h-full flex flex-col overflow-y-auto shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Top Bar with "Login or Sign Up" & Close X Button (Exact Video 00:26) */}
            <div className="px-4 py-3.5 flex items-center justify-between border-b border-[#F0ECE1] sticky top-0 bg-white z-10">
              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  if (user || mobileUser) {
                    navigate('/account');
                  } else {
                    setLoginModalOpen(true);
                  }
                }}
                className="flex items-center gap-2.5 text-left group cursor-pointer"
              >
                <span className="w-7 h-7 rounded-full border border-[#1A1A1A] flex items-center justify-center text-[#1A1A1A] group-hover:border-[#B5893D] group-hover:text-[#B5893D]">
                  <User className="w-4 h-4 stroke-[1.75]" />
                </span>
                <span className="text-[13px] font-medium text-[#1A1A1A] group-hover:text-[#B5893D]">
                  {user?.displayName || (mobileUser ? `+91 ${mobileUser.phone}` : 'Login or Sign Up')}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="Close Menu"
                className="p-1 text-[#1A1A1A] hover:text-[#B5893D] cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[1.75]" />
              </button>
            </div>

            <div className="p-4 space-y-6 flex-1">
              {/* A. Top 3 Visual Category Cards (Exact Video 00:37 - 00:46) */}
              <div className="grid grid-cols-3 gap-2.5">
                {megaMenuCards.slice(0, 3).map((card) => (
                  <Link
                    key={card.id}
                    to={card.link}
                    onClick={() => setMobileDrawerOpen(false)}
                    className="group text-center space-y-1.5"
                  >
                    <div className="aspect-square bg-[#F5F5F5] p-2.5 flex items-center justify-center overflow-hidden">
                      <SmartImage
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="block text-[9px] font-semibold uppercase tracking-[0.12em] text-[#1A1A1A]">
                      {card.title}
                    </span>
                  </Link>
                ))}
              </div>

              {/* B. Embedded Promo Banner Card inside Drawer ("Too Cool For ORDINARY" — Exact Video 00:37 - 00:46) */}
              <Link
                to={storeSettings.megaMenuBannerLink || '/products'}
                onClick={() => setMobileDrawerOpen(false)}
                className="block relative overflow-hidden bg-[#F5F7FA] border border-[#EAE5DC] group"
              >
                <div className="aspect-[16/6] w-full relative overflow-hidden">
                  <img
                    src={
                      storeSettings.megaMenuBannerUrl ||
                      'https://img-prd-pim.poorvika.com/pageimg/vivo-v80-zeiss-portrait-so-pro-Available-now-M.webp'
                    }
                    alt={storeSettings.megaMenuBannerTitle || 'Too Cool For ORDINARY'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 to-transparent flex flex-col justify-center px-4">
                    <span className="text-[10px] font-medium text-[#1A1A1A]">
                      {storeSettings.megaMenuBannerTitle?.includes('ORDINARY')
                        ? 'Too Cool For'
                        : storeSettings.megaMenuBannerSubtitle || 'Signature Series'}
                    </span>
                    <span className="font-serif-luxury text-lg font-bold uppercase tracking-wider text-[#1A1A1A] leading-none mt-0.5">
                      {storeSettings.megaMenuBannerTitle || 'ORDINARY'}
                    </span>
                  </div>
                </div>
              </Link>

              {/* C. "PRODUCTS" Section (Exact Video 00:37 - 00:46) */}
              <div className="space-y-2.5">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#999999]">
                  PRODUCTS
                </h3>
                <ul className="space-y-2.5 text-[13px] font-medium text-[#1A1A1A]">
                  <li>
                    <Link
                      to="/products?category=smartphones"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="block py-0.5 hover:text-[#B5893D]"
                    >
                      Flagship Smartphones
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/offers"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="block py-0.5 hover:text-[#B5893D]"
                    >
                      Exclusive Privilege Bundles
                    </Link>
                  </li>
                  {categories.slice(0, 5).map((cat) => (
                    <li key={cat.id}>
                      <Link
                        to={`/products?category=${cat.slug}`}
                        onClick={() => setMobileDrawerOpen(false)}
                        className="block py-0.5 hover:text-[#B5893D]"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      to="/products"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="block py-0.5 hover:text-[#B5893D]"
                    >
                      New Arrivals
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/products"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="block py-0.5 hover:text-[#B5893D]"
                    >
                      Bestseller Vault
                    </Link>
                  </li>
                </ul>
              </div>

              {/* D. "SHOP" Expandable Filter Rows (Exact Video 00:37 - 00:46) */}
              <div className="space-y-2 pt-2 border-t border-[#F0ECE1]">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#999999]">
                  SHOP
                </h3>
                <div className="divide-y divide-[#F5F2EB]">
                  {SHOP_ACCORDION_SECTIONS.map((sec) => {
                    const isOpen = expandedShopSection === sec.id;
                    return (
                      <div key={sec.id}>
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedShopSection((prev) => (prev === sec.id ? null : sec.id))
                          }
                          className="w-full py-2.5 flex items-center justify-between text-[13px] font-medium text-[#1A1A1A] hover:text-[#B5893D] cursor-pointer"
                        >
                          <span>{sec.label}</span>
                          {isOpen ? (
                            <ChevronDown className="w-4 h-4 text-[#888888]" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-[#888888]" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="pl-3 pb-2.5 space-y-2">
                            {sec.items.map((item) => (
                              <Link
                                key={item.name}
                                to={item.link}
                                onClick={() => setMobileDrawerOpen(false)}
                                className="block text-xs text-[#666666] hover:text-[#B5893D]"
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* E. "MORE & SUPPORT" Links (Exact Video 00:37 - 00:46) */}
              <div className="space-y-2.5 pt-2 border-t border-[#F0ECE1]">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#999999]">
                  MORE &amp; SUPPORT
                </h3>
                <ul className="space-y-2.5 text-[13px] font-medium text-[#1A1A1A]">
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileDrawerOpen(false);
                        setChatbotOpen(true);
                      }}
                      className="block py-0.5 hover:text-[#B5893D] cursor-pointer"
                    >
                      AI Shopping Assistant
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileDrawerOpen(false);
                        openWhatsAppEnquiry({});
                      }}
                      className="block py-0.5 hover:text-[#B5893D] cursor-pointer"
                    >
                      Contact Us (WhatsApp Concierge)
                    </button>
                  </li>
                  <li>
                    <Link
                      to="/store"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="block py-0.5 hover:text-[#B5893D]"
                    >
                      Our Store
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="block py-0.5 text-[#B5893D] font-semibold hover:underline"
                    >
                      Admin Panel (Store Control)
                    </Link>
                  </li>
                </ul>
              </div>

              {/* PWA Install App Prompt inside Drawer */}
              <div className="pt-2">
                <PWAInstallBanner variant="drawer-btn" />
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileDrawerOpen(false)} />
        </div>
      )}

      {/* 4. CLONED LUXURY LOGIN / SIGN-UP MODAL (EXACT VIDEO 00:27 - 00:32) */}
      <LoginModal />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-xs bg-[#1A1A1A] text-white border-l-4 border-[#B5893D] px-4 py-2.5 shadow-xl text-xs font-medium flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#B5893D] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Offline Mode Indicator */}
      {!isOnline && (
        <div className="fixed bottom-16 left-4 z-50 flex items-center gap-2 bg-[#2A1810] border border-[#B5893D] px-3 py-2 text-xs font-semibold text-[#E6C67C] shadow-lg">
          <WifiOff className="w-4 h-4" />
          <span>Offline Mode</span>
        </div>
      )}

      {/* 5. NATIVE MOBILE APP BOTTOM NAVIGATION BAR (APK / MOBILE SHELL) */}
      <nav
        aria-label="Mobile App Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE5DC] pb-safe"
      >
        <div className="grid grid-cols-5 h-14 items-center">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center gap-0.5 ${
              location.pathname === '/' ? 'text-[#B5893D]' : 'text-[#666666]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[9px] font-semibold uppercase tracking-wider">Home</span>
          </Link>

          <Link
            to="/categories"
            className={`flex flex-col items-center justify-center gap-0.5 ${
              location.pathname.startsWith('/categories') ||
              location.pathname.startsWith('/products')
                ? 'text-[#B5893D]'
                : 'text-[#666666]'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="text-[9px] font-semibold uppercase tracking-wider">Categories</span>
          </Link>

          <button
            type="button"
            onClick={handleReelsNavClick}
            className="flex flex-col items-center justify-center gap-0.5 text-[#666666] hover:text-[#B5893D] cursor-pointer"
          >
            <Film className="w-4 h-4 text-[#B5893D]" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#B5893D]">
              Reels
            </span>
          </button>

          <Link
            to="/cart"
            className={`relative flex flex-col items-center justify-center gap-0.5 ${
              location.pathname === '/cart' ? 'text-[#B5893D]' : 'text-[#666666]'
            }`}
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[14px] h-[14px] px-0.5 rounded-full bg-[#B5893D] text-white text-[8px] font-bold flex items-center justify-center tabular-nums">
                  {totalCartItems}
                </span>
              )}
            </div>
            <span className="text-[9px] font-semibold uppercase tracking-wider">Cart</span>
          </Link>

          <Link
            to="/account"
            className={`flex flex-col items-center justify-center gap-0.5 ${
              location.pathname === '/account' ? 'text-[#B5893D]' : 'text-[#666666]'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="text-[9px] font-semibold uppercase tracking-wider">Account</span>
          </Link>
        </div>
      </nav>
    </>
  );
};
