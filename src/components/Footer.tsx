import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Crown,
  Facebook,
  Instagram,
  MessageCircle,
  Youtube,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { storeSettings, openWhatsAppEnquiry, showToast } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    showToast('Thank you for subscribing to our Royal Privilege Newsletter!');
    setNewsletterEmail('');
  };

  const mostSearchedLinks = [
    { label: 'iPhone 17 Pro Max', to: '/product/prod_iphone_17_pro_max' },
    { label: 'Vivo V80 5G', to: '/product/prod_vivo_v80_5g' },
    { label: 'Samsung S26 Ultra', to: '/product/prod_samsung_s26_ultra' },
    { label: 'Oppo Find X10 Pro', to: '/product/prod_oppo_find_x10_pro_max' },
    { label: 'Luxury Gift Sets', to: '/offers' },
    { label: '5G Smartphones', to: '/products?category=smartphones' },
    { label: 'Smartwatches', to: '/products?category=smartwatches' },
    { label: 'Laptops & Tablets', to: '/products?category=tablets' },
    { label: 'TV & Home Audio', to: '/products?category=tv-audio' },
    { label: 'PlayStation 5', to: '/products?category=entertainment' },
  ];

  return (
    <footer className="bg-[#B5893D] text-white pt-10 pb-24 md:pb-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        {/* 1. 4-Column Top Links Grid (Exact Video 00:17 - 00:20) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-xs">
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-[0.12em] text-white text-[11px] sm:text-xs">
              SHOP BY CATEGORY
            </h4>
            <ul className="space-y-2 text-white/90 text-[11px] sm:text-xs">
              <li>
                <Link to="/products?category=iphone" className="hover:underline">
                  Flagship iPhones
                </Link>
              </li>
              <li>
                <Link to="/products?category=samsung" className="hover:underline">
                  Samsung Galaxy Series
                </Link>
              </li>
              <li>
                <Link to="/products?category=vivo" className="hover:underline">
                  Vivo &amp; Oppo Editions
                </Link>
              </li>
              <li>
                <Link to="/products?category=smartwatches" className="hover:underline">
                  Luxury Wearables
                </Link>
              </li>
              <li>
                <Link to="/products?category=tablets" className="hover:underline">
                  Laptops &amp; Tablets
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:underline">
                  Gift Sets
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:underline">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:underline">
                  Corporate Gifting
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-[0.12em] text-white text-[11px] sm:text-xs">
              CUSTOMER SERVICE
            </h4>
            <ul className="space-y-2 text-white/90 text-[11px] sm:text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => openWhatsAppEnquiry({})}
                  className="hover:underline cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <Link to="/account" className="hover:underline">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link to="/store" className="hover:underline">
                  Shipping &amp; Delivery
                </Link>
              </li>
              <li>
                <Link to="/store" className="hover:underline">
                  Return &amp; Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:underline">
                  Care &amp; Warranty Tips
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:underline">
                  Order Return
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-[0.12em] text-white text-[11px] sm:text-xs">
              LEGAL &amp; POLICIES
            </h4>
            <ul className="space-y-2 text-white/90 text-[11px] sm:text-xs">
              <li>
                <Link to="/store" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/store" className="hover:underline">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:underline font-semibold">
                  Store Owner Console
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-[0.12em] text-white text-[11px] sm:text-xs">
              OUR JOURNEY
            </h4>
            <ul className="space-y-2 text-white/90 text-[11px] sm:text-xs">
              <li>
                <Link to="/store" className="hover:underline">
                  Our Showroom Legacy
                </Link>
              </li>
              <li>
                <Link to="/store" className="hover:underline">
                  Store Locator ({storeSettings.city || 'RAIPUR'})
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 2. Middle Row: Contact Us + Center Crest & Newsletter + Right Address (Exact Video 00:18 - 00:20) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-4 border-t border-white/20 text-xs">
          {/* Left: CONTACT US */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="font-bold uppercase tracking-[0.12em] text-white text-xs">
              CONTACT US
            </h4>
            <p className="text-white/90 font-medium">Timings :</p>
            <p className="text-white/90">
              {storeSettings.openingHours || 'Monday to Friday / 10am to 6pm'}
            </p>
            <p className="text-white/90">
              Email:{' '}
              <a
                href={`mailto:${storeSettings.email || 'charliegedekar@gmail.com'}`}
                className="underline"
              >
                {storeSettings.email || 'charliegedekar@gmail.com'}
              </a>
            </p>
            <p className="text-white/90 font-semibold">
              Call:{' '}
              <a
                href={`tel:${(storeSettings.phone || '+91 8818850488').replace(/[^0-9+]/g, '')}`}
                className="underline"
              >
                {storeSettings.phone || '+91 8818850488'}
              </a>
            </p>
          </div>

          {/* Center: Royal Crest + Social Icons + Newsletter Input */}
          <div className="md:col-span-5 flex flex-col items-center text-center space-y-4">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-full bg-white/15 border border-white/40 flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <span className="font-serif-luxury text-sm font-bold tracking-[0.2em] uppercase">
                {storeSettings.storeName || 'CHARLIE LUXURY'}
              </span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <a
                href={storeSettings.facebookUrl || 'https://facebook.com'}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center hover:bg-white hover:text-[#B5893D] transition-colors"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href={storeSettings.instagramUrl || 'https://instagram.com'}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center hover:bg-white hover:text-[#B5893D] transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href={storeSettings.youtubeUrl || 'https://youtube.com'}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center hover:bg-white hover:text-[#B5893D] transition-colors"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => openWhatsAppEnquiry({})}
                aria-label="WhatsApp"
                className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center hover:bg-white hover:text-[#B5893D] transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-white/90 max-w-xs leading-relaxed">
              Subscribe for special offers, newsletters and become a part of our movement
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="w-full max-w-xs flex items-center border border-white/70 bg-transparent h-10 px-3"
            >
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Your Email"
                className="flex-1 bg-transparent text-xs text-white placeholder:text-white/75 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="pl-2 text-white hover:translate-x-0.5 transition-transform cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right: Showroom Address */}
          <div className="md:col-span-3 text-left md:text-right text-[11px] text-white/90 leading-relaxed space-y-1">
            <p className="font-bold text-white uppercase tracking-wider">
              {storeSettings.businessName || 'CHARLIE MOBILES & ACCESSORIES'}
            </p>
            <p>{storeSettings.address}</p>
            <p>{storeSettings.city || 'RAIPUR'}, INDIA</p>
          </div>
        </div>

        {/* 3. Copyright & Most Searched Links (Exact Video 00:19 - 00:20) */}
        <div className="pt-6 border-t border-white/20 space-y-4 text-[11px]">
          <div className="text-center text-white/90">
            © {new Date().getFullYear()} {storeSettings.businessName || 'Charlie Mobiles & Accessories'}. All Rights Reserved.
          </div>

          <div className="space-y-1.5">
            <p className="font-bold text-white">Most Searched</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-white/90">
              {mostSearchedLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="underline hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
