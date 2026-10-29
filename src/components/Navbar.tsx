import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  Search,
  ShoppingCart,
  User,
  WifiOff,
  X,
  Zap,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useOnlineStatus } from '../hooks/usePWAInstall';
import { PWAInstallBanner } from './PWAInstallBanner';

const CHARLIE_LOGO_URL = '/charlie-logo.png';

interface DrawerCategory {
  id: string;
  name: string;
  iconImg: string;
  items: {
    label: string;
    link: string;
    hasPlus?: boolean;
    subItems?: string[];
  }[];
}

const POORVIKA_DRAWER_CATEGORIES: DrawerCategory[] = [
  {
    id: 'mobiles',
    name: 'Mobiles & Accessories',
    iconImg:
      'https://img-prd-pim.poorvika.com/pageimg/Mobiles-Accessories-Home-page-Mob.webp',
    items: [
      { label: 'Mobiles', link: '/products?category=smartphones', hasPlus: true },
      { label: 'Mobile Brands', link: '/products?category=smartphones', hasPlus: true },
      { label: 'Mobile Accessories', link: '/products?category=mobile-accessories', hasPlus: true },
      { label: 'Accessories Brands', link: '/products?category=chargers', hasPlus: true },
    ],
  },
  {
    id: 'computers',
    name: 'Computers & Tablets',
    iconImg:
      'https://img-prd-pim.poorvika.com/pageimg/Laptops-tablets-Home-page-Mob.webp',
    items: [
      { label: 'Laptops', link: '/products?category=tablets', hasPlus: true },
      { label: 'Laptop Brands', link: '/products?category=tablets', hasPlus: true },
      { label: 'Desktop PCs', link: '/products?category=tablets', hasPlus: true },
      { label: 'Refurbished Laptops', link: '/products?category=tablets', hasPlus: false },
      { label: 'Computer & Laptop Accessories', link: '/products?category=tablets', hasPlus: true },
      { label: 'Networking', link: '/products?category=tablets', hasPlus: true },
      { label: 'Tabs & iPad', link: '/products?category=tablets', hasPlus: true },
      { label: 'Brands', link: '/products?category=tablets', hasPlus: true },
      { label: 'Tabs & iPad Accessories', link: '/products?category=tablets', hasPlus: true },
      { label: 'Computer Peripherals', link: '/products?category=tablets', hasPlus: true },
      {
        label: 'Software',
        link: '/products?category=tablets',
        hasPlus: true,
        subItems: ['Office Tools', 'Operating Software'],
      },
    ],
  },
  {
    id: 'tv_audio',
    name: 'TV & Audio',
    iconImg:
      'https://img-prd-pim.poorvika.com/pageimg/TV-Audio-Home-page-Mob.webp',
    items: [
      { label: 'Television', link: '/products?category=tv-audio', hasPlus: false },
      { label: 'Tv Brands', link: '/products?category=tv-audio', hasPlus: true },
      { label: 'Tv Screen Size', link: '/products?category=tv-audio', hasPlus: true },
      { label: 'Tv Accessories', link: '/products?category=tv-audio', hasPlus: true },
      { label: 'Entertainment', link: '/products?category=entertainment', hasPlus: true },
      { label: 'Projectors', link: '/products?category=tv-audio', hasPlus: false },
      { label: 'Audio', link: '/products?category=earbuds', hasPlus: true },
      { label: 'Audio Brands', link: '/products?category=earbuds', hasPlus: true },
    ],
  },
  {
    id: 'kitchen',
    name: 'Kitchen Appliances',
    iconImg:
      'https://img-prd-pim.poorvika.com/pageimg/Kitchen-appliances-Home-page-Mob.webp',
    items: [
      { label: 'Air Fryers', link: '/products?category=kitchen-appliances' },
      { label: 'Coffee Makers', link: '/products?category=kitchen-appliances' },
      { label: 'Soup Makers', link: '/products?category=kitchen-appliances' },
      { label: 'Cookwares', link: '/products?category=kitchen-appliances', hasPlus: true },
      { label: 'Dishwashers', link: '/products?category=kitchen-appliances' },
      { label: 'Electric Kettles', link: '/products?category=kitchen-appliances' },
      { label: 'Food Processors', link: '/products?category=kitchen-appliances' },
      { label: 'Choppers', link: '/products?category=kitchen-appliances' },
      { label: 'Induction Cooktops', link: '/products?category=kitchen-appliances' },
      { label: 'Juicer & Mixer Grinders', link: '/products?category=kitchen-appliances', hasPlus: true },
      { label: 'Kitchen Chimneys', link: '/products?category=kitchen-appliances' },
      { label: 'Kitchen Hobs & Gas Stoves', link: '/products?category=kitchen-appliances', hasPlus: true },
      { label: 'Kitchen Utilities', link: '/products?category=kitchen-appliances', hasPlus: true },
      { label: 'Hand Blenders', link: '/products?category=kitchen-appliances' },
      { label: 'Hand Grinders', link: '/products?category=kitchen-appliances' },
      { label: 'Microwave Ovens & OTG', link: '/products?category=kitchen-appliances', hasPlus: true },
      { label: 'Roti Makers', link: '/products?category=kitchen-appliances' },
      { label: 'Pop-up Toasters', link: '/products?category=kitchen-appliances' },
      { label: 'Sandwich Makers', link: '/products?category=kitchen-appliances' },
      { label: 'Pizza Makers', link: '/products?category=kitchen-appliances' },
      { label: 'Dosa Makers', link: '/products?category=kitchen-appliances' },
      { label: 'Steamers & Cookers', link: '/products?category=kitchen-appliances', hasPlus: true },
      { label: 'Wet Grinders', link: '/products?category=kitchen-appliances' },
      { label: 'Graters', link: '/products?category=kitchen-appliances' },
      { label: 'Brands', link: '/products?category=kitchen-appliances', hasPlus: true },
    ],
  },
  {
    id: 'home_appliances',
    name: 'Home Appliances',
    iconImg:
      'https://img-prd-pim.poorvika.com/pageimg/Home-Appliances-Mob-web.webp',
    items: [
      { label: 'Air Conditioners', link: '/products?category=home-appliances', hasPlus: true },
      { label: 'Refrigerators', link: '/products?category=home-appliances', hasPlus: true },
      { label: 'Visi Coolers', link: '/products?category=home-appliances' },
      { label: 'Deep Freezer', link: '/products?category=home-appliances' },
      { label: 'Washing Machines', link: '/products?category=home-appliances', hasPlus: true },
      { label: 'Air Coolers', link: '/products?category=home-appliances' },
      { label: 'Wine Coolers', link: '/products?category=home-appliances' },
      { label: 'Air Purifiers', link: '/products?category=home-appliances' },
      { label: 'Fans', link: '/products?category=home-appliances', hasPlus: true },
      { label: 'Geysers', link: '/products?category=home-appliances', hasPlus: true },
      { label: 'Inverters & Accessories', link: '/products?category=home-appliances', hasPlus: true },
      { label: 'Irons', link: '/products?category=home-appliances', hasPlus: true },
      { label: 'Stabilizers', link: '/products?category=home-appliances' },
      { label: 'Vacuum Cleaners', link: '/products?category=home-appliances' },
      { label: 'Water Purifiers & Dispensers', link: '/products?category=home-appliances', hasPlus: true },
      { label: 'Brands', link: '/products?category=home-appliances', hasPlus: true },
    ],
  },
  {
    id: 'smart_tech',
    name: 'Smart Technology',
    iconImg:
      'https://img-prd-pim.poorvika.com/pageimg/Smart-Technology-Home-page-Mob.webp',
    items: [
      { label: 'Wearables', link: '/products?category=smartwatches', hasPlus: true },
      { label: 'Wearables Brands', link: '/products?category=smartwatches', hasPlus: true },
      { label: 'Watch & Band Accessories', link: '/products?category=smartwatches', hasPlus: true },
      { label: 'Smart Home Devices', link: '/products?category=smartwatches', hasPlus: true },
      { label: 'Smart Trackers', link: '/products?category=smartwatches' },
      { label: 'Cameras & Accessories', link: '/products?category=smartwatches', hasPlus: true },
    ],
  },
  {
    id: 'personal_care',
    name: 'Personal & Health Care',
    iconImg:
      'https://img-prd-pim.poorvika.com/pageimg/Personal-health-care-Home-page-Mob.webp',
    items: [
      { label: 'Personal Care', link: '/products?category=personal-care', hasPlus: true },
      { label: 'Personal Care Brands', link: '/products?category=personal-care', hasPlus: true },
      { label: 'Health Care', link: '/products?category=personal-care', hasPlus: true },
    ],
  },
];

export const Navbar: React.FC = () => {
  const {
    user,
    cart,
    storeSettings,
    selectedCity,
    setSelectedCity,
    toastMessage,
    showToast,
    loginWithGoogle,
    openWhatsAppEnquiry,
  } = useStore();
  const isOnline = useOnlineStatus();

  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [expandedCatId, setExpandedCatId] = useState<string | null>(null);
  const [expandedSubItem, setExpandedSubItem] = useState<string | null>(null);

  // Sign-In Modal fields (exact match to 01:17 in video)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const handleManualSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      showToast('Please enter your Email or Mobile Number');
      return;
    }
    setShowSignInModal(false);
    showToast(`Signed in as ${loginIdentifier.trim()}`);
    navigate('/account');
  };

  return (
    <>
      {/* EXACT POORVIKA ORANGE STICKY HEADER FROM VIDEO (00:00 - 01:44) */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#F26522] to-[#EA580C] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-2 pb-2.5 space-y-2">
          {/* Row 1: Hamburger + Uploaded Logo & Brand Name + Location + Cart (Green Badge) + Profile */}
          <div className="flex items-center justify-between gap-2">
            {/* Left: Hamburger + Uploaded Logo */}
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                aria-label="Open Categories Menu"
                className="p-1 text-white hover:opacity-90 cursor-pointer shrink-0"
              >
                <Menu className="w-6 h-6 stroke-[2.2]" />
              </button>

              <Link to="/" className="flex items-center gap-2 min-w-0">
                <div className="h-9 px-2 rounded-lg bg-white flex items-center justify-center shadow-xs shrink-0">
                  <img
                    src={storeSettings.logoUrl || CHARLIE_LOGO_URL}
                    alt={storeSettings.businessName || 'Charlie Mobiles & Accessories'}
                    className="h-8 w-auto object-contain"
                  />
                </div>
                <div className="leading-none truncate">
                  <span className="block text-base sm:text-xl font-black tracking-wide text-white uppercase truncate">
                    {storeSettings.storeName?.split(' ')[0] || 'CHARLIE'}
                  </span>
                  <span className="block text-[9px] font-bold tracking-widest text-orange-100 uppercase truncate">
                    {storeSettings.businessName?.replace(/^CHARLIE\s*/i, '') || 'MOBILES & ACC.'}
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex flex-1 max-w-xl relative items-center mx-4"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for Products, Brands, Offers"
                className="w-full h-10 pl-4 pr-11 rounded-full bg-white text-sm text-[#171717] placeholder:text-[#737373] focus:outline-none shadow-inner"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-3 text-[#F26522] hover:text-[#EA580C] flex items-center justify-center cursor-pointer"
              >
                <Search className="w-5 h-5 stroke-[2.4]" />
              </button>
            </form>

            {/* Right Controls: Location (RAIPUR) + Cart with Green Badge + White Profile Circle */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {/* Location Pin + City Name Below (Exact match to RAIPUR in video) */}
              <button
                type="button"
                onClick={() => setShowLocationModal(true)}
                className="flex flex-col items-center justify-center leading-none text-white hover:opacity-90 cursor-pointer"
              >
                <MapPin className="w-4 h-4 fill-white text-[#F26522]" />
                <span className="text-[9px] font-extrabold uppercase tracking-tight mt-0.5 max-w-[64px] truncate">
                  {selectedCity || 'RAIPUR'}
                </span>
              </button>

              {/* Shopping Cart with Green Circular Badge (Exact match to video) */}
              <Link
                to="/cart"
                aria-label="Shopping Cart"
                className="relative p-1 text-white hover:opacity-90"
              >
                <ShoppingCart className="w-6 h-6 stroke-[2]" />
                <span className="absolute -top-1 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#16A34A] border border-white text-white text-[10px] font-extrabold flex items-center justify-center tabular-nums">
                  {totalCartItems}
                </span>
              </Link>

              {/* White Circular Profile Icon (Opens Sign-In Modal or Account) */}
              <button
                type="button"
                onClick={() => {
                  if (user) {
                    navigate('/account');
                  } else {
                    setShowSignInModal(true);
                  }
                }}
                aria-label="Account / Sign In"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-[#F26522] flex items-center justify-center shadow-xs cursor-pointer"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5 fill-[#F26522]" />
              </button>
            </div>
          </div>

          {/* Row 2: Mobile Rounded-Full White Search Pill (Exact match to video) */}
          <form onSubmit={handleSearchSubmit} className="md:hidden relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for Products, Brands, Offers"
              className="w-full h-9 pl-4 pr-10 rounded-full bg-white text-xs font-medium text-[#171717] placeholder:text-[#737373] focus:outline-none shadow-xs"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-3 text-[#F26522] flex items-center justify-center cursor-pointer"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>
      </header>

      {/* SLIDE-OUT LEFT CATEGORIES DRAWER (EXACT MATCH TO VIDEO 00:57 - 01:12) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex">
          <div className="w-[82%] max-w-[320px] bg-white h-full flex flex-col overflow-y-auto shadow-2xl">
            {/* Centered "Categories" Header */}
            <div className="relative py-3.5 px-4 border-b border-slate-200 flex items-center justify-center bg-white sticky top-0 z-10">
              <h2 className="text-base font-bold text-[#171717]">Categories</h2>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="Close menu"
                className="absolute right-3 p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Install App Prompt inside Categories Drawer */}
            <PWAInstallBanner variant="drawer-btn" />

            {/* Accordion Category Rows */}
            <div className="divide-y divide-slate-200 flex-1">
              {POORVIKA_DRAWER_CATEGORIES.map((cat) => {
                const isExpanded = expandedCatId === cat.id;
                return (
                  <div key={cat.id} className="bg-white">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedCatId((prev) => (prev === cat.id ? null : cat.id))
                      }
                      className="w-full px-3.5 py-3 flex items-center justify-between gap-3 text-left cursor-pointer hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={cat.iconImg}
                          alt={cat.name}
                          className="w-7 h-7 object-contain shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <span
                          className={`text-[13px] font-medium truncate ${
                            isExpanded ? 'text-[#F26522] font-semibold' : 'text-[#171717]'
                          }`}
                        >
                          {cat.name}
                        </span>
                      </div>
                      {isExpanded ? (
                        <Minus className="w-4 h-4 text-[#171717] shrink-0" />
                      ) : (
                        <Plus className="w-4 h-4 text-[#171717] shrink-0" />
                      )}
                    </button>

                    {/* Expanded Sub-Items in Orange Text (Exact match to 00:59 - 01:12 in video) */}
                    {isExpanded && (
                      <div className="divide-y divide-slate-200 border-t border-slate-200 bg-white">
                        {cat.items.map((sub) => {
                          const isSubOpen = expandedSubItem === `${cat.id}_${sub.label}`;
                          return (
                            <div key={sub.label}>
                              <div className="flex items-center justify-between pl-6 pr-3.5 py-2.5">
                                <Link
                                  to={sub.link}
                                  onClick={() => setMobileDrawerOpen(false)}
                                  className="text-[13px] font-medium text-[#F26522] hover:underline flex-1"
                                >
                                  {sub.label}
                                </Link>
                                {sub.hasPlus && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (sub.subItems) {
                                        setExpandedSubItem((prev) =>
                                          prev === `${cat.id}_${sub.label}`
                                            ? null
                                            : `${cat.id}_${sub.label}`
                                        );
                                      } else {
                                        setMobileDrawerOpen(false);
                                        navigate(sub.link);
                                      }
                                    }}
                                    className="p-1 text-[#171717] cursor-pointer"
                                  >
                                    {isSubOpen ? (
                                      <Minus className="w-4 h-4" />
                                    ) : (
                                      <Plus className="w-4 h-4" />
                                    )}
                                  </button>
                                )}
                              </div>

                              {/* Nested 3rd-level items (e.g. Software -> Office Tools, Operating Software at 01:04) */}
                              {isSubOpen && sub.subItems && (
                                <div className="divide-y divide-slate-100 border-t border-slate-100 bg-slate-50/60">
                                  {sub.subItems.map((nested) => (
                                    <Link
                                      key={nested}
                                      to={sub.link}
                                      onClick={() => setMobileDrawerOpen(false)}
                                      className="block pl-10 pr-4 py-2 text-xs text-[#171717] hover:text-[#F26522]"
                                    >
                                      {nested}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileDrawerOpen(false)} />
        </div>
      )}

      {/* EXACT POORVIKA SIGN-IN MODAL OVERLAY FROM VIDEO (01:17 - 01:19) */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="relative w-full max-w-[360px] bg-white rounded-xs shadow-2xl p-6 pt-8 text-[#171717]">
            {/* Top-Right Orange Square X Button */}
            <button
              type="button"
              onClick={() => setShowSignInModal(false)}
              aria-label="Close Sign In"
              className="absolute top-0 right-0 w-7 h-7 bg-[#F26522] hover:bg-[#EA580C] text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="text-center space-y-1 mb-5">
              <h2 className="text-base font-bold text-[#171717]">Sign In</h2>
              <p className="text-xs text-[#525252]">To Access Your Order Easily</p>
            </div>

            <form onSubmit={handleManualSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#171717] mb-1.5">
                  Email / Mobile Number *
                </label>
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="Email / Mobile Number"
                  className="w-full h-10 px-3 border border-slate-300 text-xs text-[#171717] placeholder:text-slate-400 focus:outline-none focus:border-[#F26522]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#171717] mb-1.5">
                  Password *
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full h-10 pl-3 pr-9 border border-slate-300 text-xs text-[#171717] placeholder:text-slate-400 focus:outline-none focus:border-[#F26522]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2.5 text-slate-600 cursor-pointer"
                  >
                    {showPassword ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowSignInModal(false);
                    navigate('/account');
                  }}
                  className="text-[#F26522] font-semibold hover:underline cursor-pointer"
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Password reset link sent to your email/mobile')}
                  className="text-[#525252] hover:underline cursor-pointer"
                >
                  Forgot Password ?
                </button>
              </div>

              <button
                type="submit"
                className="w-full h-10 bg-gradient-to-r from-[#F26522] to-[#EA580C] text-white text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer"
              >
                LOGIN
              </button>

              <div className="text-center text-xs font-bold text-[#F26522]">or</div>

              <button
                type="button"
                onClick={async () => {
                  setShowSignInModal(false);
                  await loginWithGoogle();
                }}
                className="w-full h-10 border border-slate-300 bg-white hover:bg-slate-50 text-[#171717] text-xs font-semibold uppercase tracking-wide cursor-pointer"
              >
                LOGIN WITH OTP / GOOGLE
              </button>

              <p className="text-[10px] text-center text-slate-500 pt-1">
                Upon Login, I agree to Charlie Mobiles{' '}
                <Link
                  to="/store"
                  onClick={() => setShowSignInModal(false)}
                  className="text-[#2563EB] underline"
                >
                  Privacy Policy
                </Link>{' '}
                &amp;{' '}
                <Link
                  to="/store"
                  onClick={() => setShowSignInModal(false)}
                  className="text-[#2563EB] underline"
                >
                  Terms
                </Link>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Location Picker Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#F26522]" />
                <h3 className="text-sm font-extrabold text-[#171717]">
                  Select Delivery Location
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLocationModal(false)}
                className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                'RAIPUR',
                'NAGPUR',
                'MUMBAI',
                'PUNE',
                'DELHI NCR',
                'BENGALURU',
                'CHENNAI',
                'HYDERABAD',
              ].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    setSelectedCity(city);
                    setShowLocationModal(false);
                  }}
                  className={`p-2.5 rounded-lg border text-xs font-bold text-left cursor-pointer ${
                    selectedCity === city
                      ? 'border-[#F26522] bg-orange-50 text-[#F26522]'
                      : 'border-slate-200 text-[#171717] hover:bg-slate-50'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 max-w-xs bg-[#171717] text-white border-l-4 border-[#F26522] px-3.5 py-2.5 rounded shadow-xl text-xs font-semibold flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-[#F26522] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Offline Mode Indicator */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white shadow-lg">
          <WifiOff className="w-4 h-4" />
          <span>Offline Mode</span>
        </div>
      )}

      {/* TWO FLOATING CIRCULAR ACTION BUTTONS ON BOTTOM-RIGHT (EXACT MATCH TO VIDEO 00:00 - 01:44) */}
      <div className="fixed bottom-5 right-3.5 z-40 flex flex-col items-center gap-2.5">
        {/* Green WhatsApp Circle Button */}
        <button
          type="button"
          onClick={() => openWhatsAppEnquiry({})}
          aria-label="Chat on WhatsApp"
          className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-[0_4px_12px_rgba(0,0,0,0.25)] border-2 border-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
        >
          <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
        </button>

        {/* Orange Phone Call Circle Button */}
        <a
          href={`tel:${(storeSettings.phone || '8818850488').replace(/[^0-9+]/g, '')}`}
          aria-label="Call Store"
          className="w-12 h-12 rounded-full bg-[#F26522] hover:bg-[#EA580C] text-white shadow-[0_4px_12px_rgba(0,0,0,0.25)] border-2 border-white flex items-center justify-center transition-transform active:scale-95"
        >
          <Phone className="w-5 h-5 fill-white text-white" />
        </a>
      </div>
    </>
  );
};
