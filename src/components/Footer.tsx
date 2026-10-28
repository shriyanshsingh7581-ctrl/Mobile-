import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Mail, MapPin, MessageCircle, Phone, ShieldCheck, Store, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { storeSettings, openWhatsAppEnquiry } = useStore();

  return (
    <footer className="bg-[#101114] text-slate-300 border-t border-white/10 pb-20 md:pb-8">
      {/* Trust Strip */}
      <div className="border-b border-white/10 bg-[#15171C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB]/15 text-[#00C2FF] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">100% Genuine Sealed</p>
              <p className="text-[11px] text-slate-400">Official Brand Warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB]/15 text-[#00C2FF] flex items-center justify-center shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">Instant Store Pickup</p>
              <p className="text-[11px] text-slate-400">Ready at Charlie Mobile</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB]/15 text-[#00C2FF] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">Express Local Delivery</p>
              <p className="text-[11px] text-slate-400">Safe Doorstep Handover</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB]/15 text-[#00C2FF] flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">Direct WhatsApp Desk</p>
              <p className="text-[11px] text-slate-400">Live Stock &amp; EMI Assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Col 1: Brand Identity */}
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#090D16] border border-[#00C2FF]/40 flex items-center justify-center">
              <span className="font-extrabold text-base text-white">
                C<span className="text-[#00C2FF]">M</span>
              </span>
            </div>
            <div>
              <p className="text-base font-extrabold text-white tracking-tight">
                {storeSettings.storeName}
              </p>
              <p className="text-[10px] font-bold tracking-widest text-[#00C2FF] uppercase">
                &amp; ACCESSORIES
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400 leading-relaxed">
            {storeSettings.tagline}. Shop the latest 5G smartphones, iPhones, Samsung Galaxy, tablets, smartwatches, and genuine accessories.
          </p>
          <div className="mt-4 space-y-2 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#00C2FF] shrink-0 mt-0.5" />
              <span>{storeSettings.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#00C2FF] shrink-0" />
              <span>{storeSettings.openingHours}</span>
            </div>
            {storeSettings.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#00C2FF] shrink-0" />
                <span>{storeSettings.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#00C2FF] shrink-0" />
              <span>{storeSettings.email}</span>
            </div>
          </div>
        </div>

        {/* Col 2: Smartphones & Brands */}
        <div>
          <h4 className="text-sm font-bold text-white mb-3">Smartphones &amp; Brands</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/products?category=iphone" className="hover:text-white">Apple iPhone Collection</Link></li>
            <li><Link to="/products?category=samsung" className="hover:text-white">Samsung Galaxy Smartphones</Link></li>
            <li><Link to="/products?category=vivo" className="hover:text-white">Vivo ZEISS Camera Phones</Link></li>
            <li><Link to="/products?category=oppo" className="hover:text-white">Oppo Find &amp; Reno Series</Link></li>
            <li><Link to="/products?category=oneplus" className="hover:text-white">OnePlus Flagship 5G</Link></li>
            <li><Link to="/products?category=realme" className="hover:text-white">Realme GT &amp; Number Series</Link></li>
            <li><Link to="/products?category=redmi" className="hover:text-white">Redmi Note &amp; Xiaomi 5G</Link></li>
            <li><Link to="/products?category=iqoo" className="hover:text-white">iQOO Gaming Smartphones</Link></li>
          </ul>
        </div>

        {/* Col 3: Gadgets & Accessories */}
        <div>
          <h4 className="text-sm font-bold text-white mb-3">Gadgets &amp; Accessories</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/products?category=tablets" className="hover:text-white">iPads &amp; Android Tablets</Link></li>
            <li><Link to="/products?category=smartwatches" className="hover:text-white">Smartwatches &amp; Fitness Bands</Link></li>
            <li><Link to="/products?category=earbuds" className="hover:text-white">TWS Earbuds &amp; Audio</Link></li>
            <li><Link to="/products?category=chargers" className="hover:text-white">GaN Fast Chargers &amp; Cables</Link></li>
            <li><Link to="/products?category=power-banks" className="hover:text-white">MagSafe &amp; PD Power Banks</Link></li>
            <li><Link to="/products?category=mobile-accessories" className="hover:text-white">Cases, Covers &amp; Lens Guards</Link></li>
            <li><Link to="/offers" className="hover:text-[#00C2FF] text-slate-300 font-medium">Smartphone Exchange Offers</Link></li>
          </ul>
        </div>

        {/* Col 4: Customer Support & Quick Links */}
        <div>
          <h4 className="text-sm font-bold text-white mb-3">Store &amp; Customer Care</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/store" className="hover:text-white">Physical Showroom &amp; Directions</Link></li>
            <li><Link to="/account" className="hover:text-white">My Account &amp; Order Tracking</Link></li>
            <li><Link to="/cart" className="hover:text-white">Shopping Bag</Link></li>
            <li><Link to="/offers" className="hover:text-white">No-Cost EMI &amp; Bank Deals</Link></li>
          </ul>
          <button
            type="button"
            onClick={() => openWhatsAppEnquiry({})}
            className="mt-4 w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} {storeSettings.businessName}. All rights reserved.</p>
        <p>Original Brand Warranty · Store Pickup · Instant Exchange</p>
      </div>
    </footer>
  );
};
