import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Store,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { generateStoreShowroomSvg } from '../utils/productVisuals';

export const StoreLocatorPage: React.FC = () => {
  const { storeSettings, openWhatsAppEnquiry } = useStore();
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const defaultShowroomPhotos = [
    {
      title: 'CHARLIE MOBILE & ACCESSORIES — Main Storefront Fascia',
      caption: 'Official CM Monogram & Illuminated Retail Storefront',
      src: generateStoreShowroomSvg('storefront'),
    },
    {
      title: 'Multi-Brand Live Smartphone Experience Counter',
      caption: 'Hands-on demo units for iPhone, Samsung Galaxy, Vivo, Oppo & OnePlus',
      src: generateStoreShowroomSvg('interior_counter'),
    },
    {
      title: 'Genuine Accessories, Wearables & Fast-Charging Wall',
      caption: 'Original adapters, MagSafe cases, smartwatches, and wireless earbuds',
      src: generateStoreShowroomSvg('accessories_wall'),
    },
  ];

  const showroomPhotos =
    storeSettings.showroomPhotos && storeSettings.showroomPhotos.length > 0
      ? storeSettings.showroomPhotos
      : defaultShowroomPhotos;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#A67C33] uppercase tracking-[0.14em]">
            <Store className="w-4 h-4" />
            <span>Physical Retail Showroom</span>
          </div>
          <h1 className="mt-1 font-serif-luxury text-2xl sm:text-3xl font-semibold text-[#1A1A1A]">
            {storeSettings.businessName}
          </h1>
          <p className="text-xs sm:text-sm text-[#595959] mt-0.5">{storeSettings.tagline}</p>
        </div>
      </div>

      {/* Main Showroom Gallery + Contact Details Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Showroom Photographs */}
        <div className="lg:col-span-7 bg-white border border-[#EAE5DC] p-4 sm:p-6 space-y-4">
          <div className="aspect-video overflow-hidden bg-[#1A1A1A] border border-[#EAE5DC]">
            <img
              src={showroomPhotos[activePhotoIndex].src}
              alt={showroomPhotos[activePhotoIndex].title}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-[#1A1A1A]">
                {showroomPhotos[activePhotoIndex].title}
              </h2>
              <p className="text-xs text-[#595959]">
                {showroomPhotos[activePhotoIndex].caption}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {showroomPhotos.map((photo, idx) => (
              <button
                key={photo.title}
                type="button"
                onClick={() => setActivePhotoIndex(idx)}
                className={`aspect-video overflow-hidden border-2 p-1 bg-[#1A1A1A] cursor-pointer transition-all ${
                  activePhotoIndex === idx ? 'border-[#B5893D]' : 'border-transparent opacity-75'
                }`}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Store Information, Opening Hours, Directions & Pickup Info */}
        <div className="lg:col-span-5 bg-white border border-[#EAE5DC] p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-[#EAE5DC]">
            <div className="w-12 h-12 bg-[#2A1810] text-white flex items-center justify-center font-serif-luxury font-bold text-lg">
              C<span className="text-[#E6C67C]">M</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#1A1A1A]">
                {storeSettings.businessName}
              </h3>
              <p className="text-xs text-emerald-700 font-semibold">
                Authorized Multi-Brand Retail Store
              </p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#B5893D] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#1A1A1A]">Store Address</p>
                <p className="text-[#595959] mt-0.5 leading-relaxed">{storeSettings.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-[#B5893D] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#1A1A1A]">Opening Hours</p>
                <p className="text-[#595959] mt-0.5">{storeSettings.openingHours}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#B5893D] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#1A1A1A]">Store Phone &amp; WhatsApp</p>
                <p className="text-[#595959] mt-0.5 tabular-nums">
                  {storeSettings.phone || storeSettings.whatsappNumber
                    ? `${storeSettings.phone} / WhatsApp: ${storeSettings.whatsappNumber}`
                    : 'Configurable by store owner in Admin Panel'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#B5893D] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#1A1A1A]">Official Store Email</p>
                <p className="text-[#595959] mt-0.5">{storeSettings.email}</p>
              </div>
            </div>
          </div>

          {/* Store Pickup Information Box */}
          <div className="p-4 bg-[#FAF7F2] border border-[#EAE5DC] space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-[#1A1A1A]">
              <ShieldCheck className="w-4 h-4 text-[#B5893D]" />
              <span>How Express Store Pickup Works</span>
            </div>
            <ul className="space-y-1.5 text-[#595959] leading-relaxed">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Select &ldquo;Store Pickup&rdquo; during checkout to reserve your phone.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Inspect sealed box, get free data transfer &amp; screen guard application in-store.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Instant old-phone exchange &amp; paperless EMI processing at the counter.</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <a
              href={storeSettings.mapLink || 'https://maps.google.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#B5893D] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <Navigation className="w-4 h-4" />
              <span>Google Maps Directions</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              type="button"
              onClick={() =>
                openWhatsAppEnquiry({
                  customMessage:
                    'Hello Charlie Mobile, I would like to visit the showroom today. Please share live location and stock details.',
                })
              }
              className="min-h-[44px] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Store Desk</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
