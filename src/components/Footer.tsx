import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Facebook, Instagram, MessageCircle, Phone, Youtube } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { storeSettings, openWhatsAppEnquiry } = useStore();
  const [knowMoreOpen, setKnowMoreOpen] = useState(true);

  return (
    <footer className="bg-white text-[#1E293B] border-t border-slate-200 pb-6">
      {/* 1. 6-Column Social & Contact Icon Bar (Exact Video 00:43 & 01:42) */}
      <div className="border-b border-slate-200 py-3 px-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => openWhatsAppEnquiry({})}
            aria-label="WhatsApp"
            className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
          </button>

          <a
            href={`tel:+${storeSettings.whatsappNumber || '918818850488'}`}
            aria-label="Call Us"
            className="w-10 h-10 rounded-full bg-[#0284C7] text-white flex items-center justify-center shadow-xs"
          >
            <Phone className="w-5 h-5 fill-white" />
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-center shadow-xs"
          >
            <Instagram className="w-5 h-5" />
          </a>

          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-xs"
          >
            <Facebook className="w-5 h-5 fill-white" />
          </a>

          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            aria-label="X"
            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-extrabold text-sm shadow-xs"
          >
            X
          </a>

          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
            className="w-10 h-10 rounded-full bg-[#FF0000] text-white flex items-center justify-center shadow-xs"
          >
            <Youtube className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* 2. White Information Body (Exact Video 00:44 - 00:45 & 01:43) */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 text-xs">
        {/* Contact Information */}
        <div className="space-y-1.5">
          <h3 className="text-sm font-extrabold text-[#1E293B]">Contact Information</h3>
          <p className="font-bold text-[#1E293B]">Head Office</p>
          <p className="text-slate-600 leading-relaxed">
            Charlie Mobiles &amp; Accessories Pvt Ltd, {storeSettings.address}
          </p>
          <p className="pt-1 text-slate-700">
            <strong className="text-[#1E293B]">For Support &amp; Order Inquiries :</strong>{' '}
            <a
              href="mailto:charliegedekar@gmail.com"
              className="text-[#F26522] font-semibold hover:underline"
            >
              charliegedekar@gmail.com
            </a>{' '}
            |{' '}
            <a
              href="tel:+918818850488"
              className="text-[#1E293B] font-bold hover:text-[#F26522]"
            >
              +91 8818850488
            </a>
          </p>
        </div>

        {/* 2-Column Links Grid: Support + Policies & Know More */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-2 border-t border-slate-100">
          <div>
            <h4 className="text-sm font-extrabold text-[#1E293B] mb-2.5">Support</h4>
            <ul className="space-y-2 text-slate-600">
              <li><Link to="/store" className="hover:text-[#F26522]">Contact Us</Link></li>
              <li><Link to="/store" className="hover:text-[#F26522]">Site Map</Link></li>
              <li><Link to="/offers" className="hover:text-[#F26522]">One Assist</Link></li>
              <li><a href="tel:+918818850488" className="hover:text-[#F26522]">1800 / +91 8818850488</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-[#1E293B] mb-2.5">Policies</h4>
            <ul className="space-y-2 text-slate-600">
              <li><Link to="/store" className="hover:text-[#F26522]">T &amp; C</Link></li>
              <li><Link to="/store" className="hover:text-[#F26522]">Privacy Policy</Link></li>
              <li><Link to="/store" className="hover:text-[#F26522]">CSR &amp; Whistle Blower Policy</Link></li>
              <li><Link to="/store" className="hover:text-[#F26522]">Return, Replacement &amp; Refund</Link></li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-sm font-extrabold text-[#1E293B] mb-2.5">Know More</h4>
            <ul className="space-y-2 text-slate-600">
              <li><Link to="/store" className="hover:text-[#F26522]">About Us</Link></li>
              <li><Link to="/store" className="hover:text-[#F26522]">Our Stores</Link></li>
              <li><Link to="/store" className="hover:text-[#F26522]">Service Centres</Link></li>
            </ul>
          </div>
        </div>

        {/* About Us Paragraph */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/file_00000000aecc8211ab63d081eeb80b78_b57e0ffb.png"
              alt="Charlie Mobiles & Accessories"
              className="h-10 w-auto object-contain rounded bg-white p-0.5 border border-slate-200"
            />
            <h4 className="text-sm font-extrabold text-[#1E293B]">About Us :</h4>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Charlie Mobiles &amp; Accessories is a premier omnichannel electronics and smartphone retailer in India. With 100% genuine brand-sealed smartphones, laptops, tablets, smart TVs, home appliances, and original mobile accessories, Charlie Mobiles brings flagship showroom trust directly to your fingertips with instant store pickup, express local delivery, and zero-down-payment EMI options.
          </p>
        </div>

        {/* App Download Badges + EMI Partners + Payment Options (Exact Video 00:45 & 01:44) */}
        <div className="pt-2 border-t border-slate-100 space-y-4">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded bg-black text-white flex items-center gap-2">
              <span className="text-[10px] font-bold">GET IT ON Google Play</span>
            </div>
            <div className="px-3 py-1.5 rounded bg-black text-white flex items-center gap-2">
              <span className="text-[10px] font-bold">Download on the App Store</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="font-extrabold text-[#1E293B] mb-1.5">Our EMI Partners :</p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-slate-700">
                <span className="px-2.5 py-1 rounded border border-slate-200 bg-slate-50">
                  BAJAJ FINSERV
                </span>
                <span className="px-2.5 py-1 rounded border border-slate-200 bg-slate-50">
                  HDFC BANK
                </span>
                <span className="px-2.5 py-1 rounded border border-slate-200 bg-slate-50">
                  HOME CREDIT
                </span>
              </div>
            </div>

            <div>
              <p className="font-extrabold text-[#1E293B] mb-1.5">Payment Option :</p>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-700">
                <span className="px-2.5 py-1 rounded border border-slate-200 bg-slate-50 text-blue-800">
                  VISA
                </span>
                <span className="px-2.5 py-1 rounded border border-slate-200 bg-slate-50 text-orange-600">
                  MasterCard
                </span>
                <span className="px-2.5 py-1 rounded border border-slate-200 bg-slate-50 text-indigo-700">
                  RuPay
                </span>
                <span className="px-2.5 py-1 rounded border border-slate-200 bg-slate-50 text-emerald-700">
                  UPI
                </span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 pt-1">
            Copyright © {new Date().getFullYear()} Charlie Mobiles &amp; Accessories Pvt. Ltd. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* 3. Dark Bottom "Know More about Charlie Mobiles" Section (Exact Video 00:46) */}
      <div className="bg-[#1F242D] text-white">
        <button
          type="button"
          onClick={() => setKnowMoreOpen((v) => !v)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-extrabold border-b border-white/10 cursor-pointer"
        >
          <span>Know More about Charlie Mobiles</span>
          {knowMoreOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {knowMoreOpen && (
          <div className="p-4 space-y-3 text-xs text-slate-300 leading-relaxed max-w-7xl mx-auto">
            <div>
              <h5 className="font-extrabold text-white">No Cost EMI</h5>
              <p className="mt-0.5">
                Walking into Charlie Mobiles or shopping online lets you own your dream iPhone, Samsung Galaxy, laptop, or Smart TV with zero-cost EMI across major credit cards and Bajaj Finserv.
              </p>
            </div>
            <div>
              <h5 className="font-extrabold text-white">EMI On Debit Cards</h5>
              <p className="mt-0.5">
                Don&apos;t have a credit card? Avail instant Debit Card EMI and paperless consumer finance at Charlie Mobiles &amp; Accessories (Call/WhatsApp: +91 8818850488).
              </p>
            </div>
            <div>
              <h5 className="font-extrabold text-white">Mobile Exchange Offers</h5>
              <p className="mt-0.5">
                Get the highest instant exchange value for your old smartphone when upgrading to any new 5G device at Charlie Mobiles.
              </p>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};
