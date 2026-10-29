import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { SmartImage } from '../components/SmartImage';
import { PWAInstallBanner } from '../components/PWAInstallBanner';
import { Product } from '../types/store';

interface TabMediaGroup {
  banner: string;
  bannerLink: string;
  grid: { img: string; link: string; alt: string }[];
}

export const HomePage: React.FC = () => {
  const { products, categories, banners } = useStore();

  const activeBanners = banners.filter((b) => b.enabled);
  const [bannerIndex, setBannerIndex] = useState(0);

  // Interactive Section Tabs matching the Video (00:03, 00:04, 00:06-00:27, 00:18, 00:19, 01:39)
  const [mobileTab, setMobileTab] = useState<'best_seller' | '5g' | 'top_brands' | 'accessories'>('best_seller');
  const [laptopTab, setLaptopTab] = useState<'best_laptops' | 'desktop_pc' | 'ipad_tablets' | 'accessories'>('best_laptops');
  const [tvTab, setTvTab] = useState<'all' | 'television' | 'audio' | 'entertainment'>('all');
  const [kitchenTab, setKitchenTab] = useState<'all' | 'grinders' | 'cookwares' | 'steamers'>('all');
  const [homeAppTab, setHomeAppTab] = useState<'all' | 'ac' | 'cleansers' | 'small'>('all');
  const [personalCareTab, setPersonalCareTab] = useState<'trending' | 'personal_care'>('trending');

  // Horizontal slider refs for `<` `>` buttons in every product rail
  const mobileRailRef = useRef<HTMLDivElement>(null);
  const laptopRailRef = useRef<HTMLDivElement>(null);
  const brandRailRef = useRef<HTMLDivElement>(null);
  const tvRailRef = useRef<HTMLDivElement>(null);
  const kitchenRailRef = useRef<HTMLDivElement>(null);
  const homeRailRef = useRef<HTMLDivElement>(null);
  const smartTechRailRef = useRef<HTMLDivElement>(null);
  const personalCareRailRef = useRef<HTMLDivElement>(null);

  const scrollRail = (ref: React.RefObject<HTMLDivElement | null>, dir: 'left' | 'right') => {
    if (!ref.current) return;
    const amount = dir === 'left' ? -320 : 320;
    ref.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const currentBanner =
    activeBanners[bannerIndex % Math.max(1, activeBanners.length)] || banners[0];

  // Exact Poorvika Mobile & Accessories Tab Media Groups
  const mobileTabMedia: Record<typeof mobileTab, TabMediaGroup> = {
    best_seller: {
      banner: 'https://img-prd-pim.poorvika.com/pageimg/samsung-galaxy-z-fold8-z-flip7-m.webp',
      bannerLink: '/products?category=smartphones',
      grid: [
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Iphone-Mob-M-A-2026.webp',
          link: '/products?brand=Apple',
          alt: 'iPhones',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Galaxy-Ai-Mob-M-A-2026.webp',
          link: '/products?brand=Samsung',
          alt: 'Galaxy AI Phones',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Smart-Phones-Mob-M-A-2026.webp',
          link: '/products?category=smartphones',
          alt: 'Smartphones',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Accessories-Mob-M-A-2026.webp',
          link: '/products?category=mobile-accessories',
          alt: 'Mobile Accessories',
        },
      ],
    },
    '5g': {
      banner: 'https://img-prd-pim.poorvika.com/pageimg/Vivo-V80-Series-Banner-Mob.webp',
      bannerLink: '/products?5g=true',
      grid: [
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/OnePlus-N6X-5G-M.webp',
          link: '/products?brand=OnePlus',
          alt: 'OnePlus N6x 5G',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Oppo-Reno-16-Series-5G-M.webp',
          link: '/products?brand=Oppo',
          alt: 'Oppo Reno 16 5G',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Redmi-Note-16-5G-Mob.webp',
          link: '/products?brand=Redmi',
          alt: 'Redmi Note 16 5G',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Samsung-Galaxy-A58-A38-5G-Banner-M.webp',
          link: '/products?brand=Samsung',
          alt: 'Samsung Galaxy A58 5G',
        },
      ],
    },
    top_brands: {
      banner: 'https://img-prd-pim.poorvika.com/pageimg/Apple-18e-Mob.webp',
      bannerLink: '/products?brand=Apple',
      grid: [
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Vivo-X300-FE-5G-Mob.webp',
          link: '/products?brand=Vivo',
          alt: 'Vivo X300 FE 5G',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Samsung-S26-Series-Banner-M.webp',
          link: '/products?brand=Samsung',
          alt: 'Samsung S26 Series',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Oppo-Find-X10-Series-Mob.webp',
          link: '/products?brand=Oppo',
          alt: 'Oppo Find X10 Series',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Realme-17-Pro-Series-5G-M.webp',
          link: '/products?brand=Realme',
          alt: 'Realme 17 Pro Series',
        },
      ],
    },
    accessories: {
      banner: 'https://img-prd-pim.poorvika.com/pageimg/Mobile-Accessories-Home-Page-2026-mob.webp',
      bannerLink: '/products?category=mobile-accessories',
      grid: [
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Chargers-Adapter-Home-Page-2026-mob.webp',
          link: '/products?category=chargers',
          alt: 'Chargers & Adapters',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Headphones-Speakers-Home-Page-2026-mob.webp',
          link: '/products?category=earbuds',
          alt: 'Headphones & Speakers',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Cases-Covers-Home-Page-2026-mob.webp',
          link: '/products?category=mobile-accessories',
          alt: 'Cases & Covers',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Holders-Stands-Home-Page-2026-mob.webp',
          link: '/products?category=mobile-accessories',
          alt: 'Holders & Stands',
        },
      ],
    },
  };

  // Exact Poorvika Laptop & Tablets Tab Media Groups (00:04 - 00:05)
  const laptopTabMedia: Record<typeof laptopTab, TabMediaGroup> = {
    best_laptops: {
      banner: 'https://img-prd-pim.poorvika.com/pageimg/MacBook-Neo-Banner-Mob.webp',
      bannerLink: '/products?category=laptops',
      grid: [
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Macbooks-Mob-M-A-2026.webp',
          link: '/products?category=laptops',
          alt: 'MacBooks',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Gaming-Laptop-Mob-M-A-2026.webp',
          link: '/products?category=laptops',
          alt: 'Gaming Laptops',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/2-in-1-laptop-Mob-M-A-2026.webp',
          link: '/products?category=laptops',
          alt: '2 in 1 Laptops',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Windows-Laptop-Mob-M-A-2026.webp',
          link: '/products?category=laptops',
          alt: 'Windows Laptops',
        },
      ],
    },
    desktop_pc: {
      banner: 'https://img-prd-pim.poorvika.com/pageimg/Total-Protection-Starts-Here-W.webp',
      bannerLink: '/products?category=laptops',
      grid: [
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/All-In-One-PC-Best-Laptop-Mobile-View.webp',
          link: '/products?category=laptops',
          alt: 'All in One PC',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Tower-PC-Best-Laptop-Mobile-View.webp',
          link: '/products?category=laptops',
          alt: 'Tower PC',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Monitors-Best-Laptop-Mobile-View.webp',
          link: '/products?category=laptops',
          alt: 'Monitors',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Mac-Mini-Studio-M.webp',
          link: '/products?category=laptops',
          alt: 'Mac Mini & Studio',
        },
      ],
    },
    ipad_tablets: {
      banner: 'https://img-prd-pim.poorvika.com/pageimg/Samsung-Galaxy-Tab-S10-Lite-Mob.webp',
      bannerLink: '/products?category=tablets',
      grid: [
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Ipad-Air-M4-Mob.webp',
          link: '/products?category=tablets',
          alt: 'iPad Air M4',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Apple-Ipad-12th-Gen-M.webp',
          link: '/products?category=tablets',
          alt: 'iPad',
        },
      ],
    },
    accessories: {
      banner: 'https://img-prd-pim.poorvika.com/pageimg/Laptops-Tablets-Home-page-2026-mob.webp',
      bannerLink: '/products?category=laptops',
      grid: [
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Printers-Home-Page-2026-mob.webp',
          link: '/products?category=laptops',
          alt: 'Printers',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Mouse-Keyboards-Home-Page-2026-mob.webp',
          link: '/products?category=laptops',
          alt: 'Mouse & Keyboards',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Pendrives-Memory-Card-Home-Page-2026-mob.webp',
          link: '/products?category=mobile-accessories',
          alt: 'Pendrives & Memory Cards',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Hard-Disks-SSD-Home-Page-2026-mob.webp',
          link: '/products?category=laptops',
          alt: 'Hard Disks & SSD',
        },
      ],
    },
  };

  // Exact Poorvika Tv & Audio Tab Media Groups (00:06 - 00:27)
  const tvTabMedia: Record<typeof tvTab, TabMediaGroup> = {
    all: {
      banner: 'https://img-prd-pim.poorvika.com/pageimg/Bring-The-Stadium-Home-Mob.webp',
      bannerLink: '/products?category=tv-audio',
      grid: [
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Smart-Tv-Mob-M-A-2026.webp',
          link: '/products?category=tv-audio',
          alt: 'Smart TVs',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Entertainment-Mob-M-A-2026.webp',
          link: '/products?category=gaming',
          alt: 'Entertainment',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Sound-Bars-Mob-M-A-2026.webp',
          link: '/products?category=tv-audio',
          alt: 'Sound Bars',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Streaming-device-Mob-M-A-2026.webp',
          link: '/products?category=gaming',
          alt: 'Streaming Devices',
        },
      ],
    },
    television: {
      banner: 'https://img-prd-pim.poorvika.com/pageimg/Experience-Theater-Like-Visual-Every-Day-Mob.webp',
      bannerLink: '/products?category=tv-audio',
      grid: [
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Oled-TV-Audio-Mobile-View.webp',
          link: '/products?category=tv-audio',
          alt: 'OLED TV',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Qled-TV-Audio-Mobile-View.webp',
          link: '/products?category=tv-audio',
          alt: 'QLED TV',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Qned-TV-Audio-Mobile-View.webp',
          link: '/products?category=tv-audio',
          alt: 'QNED TV',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Led-TV-Audio-Mobile-View.webp',
          link: '/products?category=tv-audio',
          alt: 'LED TV',
        },
      ],
    },
    audio: {
      banner: 'https://img-prd-pim.poorvika.com/pageimg/LG-Xboom-360-Wireless-Speaker-Turn-up-the-Beat-Anytime-Anywhere-Mob.webp',
      bannerLink: '/products?category=tv-audio',
      grid: [
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Sound-Bar-TV-Audio-Mobile-View.webp',
          link: '/products?category=tv-audio',
          alt: 'Sound Bar',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Party-Speakers-TV-Audio-Mobile-View.webp',
          link: '/products?category=tv-audio',
          alt: 'Party Speakers',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Bluetooth-Speaker-TV-Audio-Mobile-View.webp',
          link: '/products?category=tv-audio',
          alt: 'Bluetooth Speakers',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Smart-Speaker-TV-Audio-Mobile-View.webp',
          link: '/products?category=tv-audio',
          alt: 'Smart Speakers',
        },
      ],
    },
    entertainment: {
      banner: 'https://img-prd-pim.poorvika.com/pageimg/Stream-Play-Conquer-Mob.webp',
      bannerLink: '/products?category=gaming',
      grid: [
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Consoles-TV-Audio-Mobile-View.webp',
          link: '/products?category=gaming',
          alt: 'Consoles',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Controllers-TV-Audio-Mobile-View.webp',
          link: '/products?category=gaming',
          alt: 'Controllers',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Handheld-Universes-TV-Audio-Mobile-View.webp',
          link: '/products?category=gaming',
          alt: 'Handheld Universes',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Straming-Devices-TV-Audio-Mobile-View.webp',
          link: '/products?category=gaming',
          alt: 'Streaming Devices',
        },
      ],
    },
  };

  // Exact Poorvika Kitchen Appliances Tab Media Groups (00:18 - 00:19)
  const kitchenTabMedia: Record<typeof kitchenTab, TabMediaGroup> = {
    all: {
      banner: 'https://img-prd-pim.poorvika.com/pageimg/Kitchen-Appliances-Mob-M-A-2026.webp',
      bannerLink: '/products?category=kitchen-appliances',
      grid: [
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Mixer-Mob-M-A-2026.webp',
          link: '/products?category=kitchen-appliances',
          alt: 'Mixer Grinder',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Hobs-Mob-M-A-2026.webp',
          link: '/products?category=kitchen-appliances',
          alt: 'Kitchen Hobs',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Grinder-Mob-M-A-2026.webp',
          link: '/products?category=kitchen-appliances',
          alt: 'Wet Grinder',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Gas-Stove-Mob-M-A-2026.webp',
          link: '/products?category=kitchen-appliances',
          alt: 'Gas Stove',
        },
      ],
    },
    grinders: {
      banner: 'https://img-prd-pim.poorvika.com/pageimg/Juicer-Mixer-Grinders-Mob.webp',
      bannerLink: '/products?category=kitchen-appliances',
      grid: [
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Food-Processors-Kitchen-Appliances-Mobile-View.webp',
          link: '/products?category=kitchen-appliances',
          alt: 'Food Processors',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Blenders-Kitchen-Appliances-Mobile-View.webp',
          link: '/products?category=kitchen-appliances',
          alt: 'Blenders',
        },
      ],
    },
    cookwares: {
      banner: 'https://img-prd-pim.poorvika.com/pageimg/Cookwares-Sets-Enjoy-Rapid-Heating-and-Long-Lasting-Durability-Mob.webp',
      bannerLink: '/products?category=kitchen-appliances',
      grid: [
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Cookware-Kitchen-Appliances-Mobile-View.webp',
          link: '/products?category=kitchen-appliances',
          alt: 'Cookware',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Gas-Stove-Kitchen-Appliances-Mobile-View.webp',
          link: '/products?category=kitchen-appliances',
          alt: 'Gas Stove',
        },
      ],
    },
    steamers: {
      banner: 'https://img-prd-pim.poorvika.com/pageimg/Healthy-Steaming-Happy-Living-Mob.webp',
      bannerLink: '/products?category=kitchen-appliances',
      grid: [
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Rice-Cooker-Kitchen-Appliances-Mobile-View.webp',
          link: '/products?category=kitchen-appliances',
          alt: 'Rice Cooker',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Idli-Maker-Kitchen-Appliances-Mobile-View.webp',
          link: '/products?category=kitchen-appliances',
          alt: 'Idli Maker',
        },
      ],
    },
  };

  // Exact Poorvika Home Appliances Tab Media Groups (00:19 - 00:20)
  const homeAppTabMedia: Record<typeof homeAppTab, TabMediaGroup> = {
    all: {
      banner: 'https://img-prd-pim.poorvika.com/pageimg/Home-Appliances-Mob-M-A-2026.webp',
      bannerLink: '/products?category=home-appliances',
      grid: [
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Fans-Mob-M-A-2026.webp',
          link: '/products?category=home-appliances',
          alt: 'Fans',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Washing-Machine-Mob-M-A-2026.webp',
          link: '/products?category=home-appliances',
          alt: 'Washing Machine',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Referigerator-Mob-M-A-2026.webp',
          link: '/products?category=home-appliances',
          alt: 'Refrigerator',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Water-Heater-Mob-M-A-2026.webp',
          link: '/products?category=home-appliances',
          alt: 'Water Heater',
        },
      ],
    },
    ac: {
      banner: 'https://img-prd-pim.poorvika.com/pageimg/AC-Summer-ready-banner-mob.webp',
      bannerLink: '/products?category=home-appliances',
      grid: [
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Inverter-Split-AC-Mobile-View.webp',
          link: '/products?category=home-appliances',
          alt: 'Inverter Split AC',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Air-Coolers-Mobile-View.webp',
          link: '/products?category=home-appliances',
          alt: 'Air Coolers',
        },
      ],
    },
    cleansers: {
      banner: 'https://img-prd-pim.poorvika.com/pageimg/Pure-Air-Pure-Water-Pure-Living-Mob.webp',
      bannerLink: '/products?category=home-appliances',
      grid: [
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Vacuum-Cleaner-Mobile-View.webp',
          link: '/products?category=home-appliances',
          alt: 'Vacuum Cleaner',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Water-Purifier-Mobile-View.webp',
          link: '/products?category=home-appliances',
          alt: 'Water Purifier',
        },
      ],
    },
    small: {
      banner: 'https://img-prd-pim.poorvika.com/pageimg/Everyday-Comfort-Starts-with-Small-Appliances-Mob.webp',
      bannerLink: '/products?category=home-appliances',
      grid: [
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Iron-Home-Appliances-Mobile-View.webp',
          link: '/products?category=home-appliances',
          alt: 'Irons',
        },
        {
          img: 'https://img-prd-pim.poorvika.com/pageimg/Fans-Home-Appliances-Mobile-View.webp',
          link: '/products?category=home-appliances',
          alt: 'Fans',
        },
      ],
    },
  };

  // Exact Poorvika Circular Brand Logos Scroller (00:05 - 00:11)
  const circularBrandLogos = [
    { name: 'Apple', img: 'https://img-prd-pim.poorvika.com/pageimg/Apple-Logo-Web.webp', link: '/products?brand=Apple' },
    { name: 'Lenovo', img: 'https://img-prd-pim.poorvika.com/pageimg/Lenovo-Logo-Web.webp', link: '/products?brand=Lenovo' },
    { name: 'Samsung', img: 'https://img-prd-pim.poorvika.com/pageimg/Samsung-Logo-Web.webp', link: '/products?brand=Samsung' },
    { name: 'Oppo', img: 'https://img-prd-pim.poorvika.com/pageimg/Oppo-Logo-Web.webp', link: '/products?brand=Oppo' },
    { name: 'Yarr', img: 'https://img-prd-pim.poorvika.com/pageimg/Yarr-Logo-Web.webp', link: '/products?brand=Yarr' },
    { name: 'Tecno', img: 'https://img-prd-pim.poorvika.com/pageimg/Tecno-Logo-Web.webp', link: '/products?category=smartphones' },
    { name: 'Realme', img: 'https://img-prd-pim.poorvika.com/pageimg/Realme-Logo-Web.webp', link: '/products?brand=Realme' },
    { name: 'Nokia', img: 'https://img-prd-pim.poorvika.com/pageimg/Nokia-Logo-Web.webp', link: '/products?category=smartphones' },
    { name: 'Vivo', img: 'https://img-prd-pim.poorvika.com/pageimg/Vivo-Logo-Web.webp', link: '/products?brand=Vivo' },
    { name: 'Amazon', img: 'https://img-prd-pim.poorvika.com/pageimg/Amazon-Logo-Web.webp', link: '/products?category=tv-audio' },
    { name: 'OnePlus', img: 'https://img-prd-pim.poorvika.com/pageimg/Oneplus-Logo-Web.webp', link: '/products?brand=OnePlus' },
    { name: 'Bose', img: 'https://img-prd-pim.poorvika.com/pageimg/Bose-Logo-Web.webp', link: '/products?category=tv-audio' },
    { name: 'Fingers', img: 'https://img-prd-pim.poorvika.com/pageimg/Fingers-Logo-Web.webp', link: '/products?category=mobile-accessories' },
    { name: 'LG', img: 'https://img-prd-pim.poorvika.com/pageimg/LG-Logo-Web.webp', link: '/products?brand=LG' },
    { name: 'Noise', img: 'https://img-prd-pim.poorvika.com/pageimg/Noise-Logo-Web.webp', link: '/products?brand=Noise' },
  ];

  // Category Product Lists matching the exact video cards
  const mobileProducts = products.filter((p) =>
    ['smartphones', 'realme', 'samsung', 'vivo', 'oppo', 'iphone', 'oneplus'].includes(p.category)
  );
  const laptopProducts = products.filter((p) => ['laptops', 'tablets'].includes(p.category));
  const tvProducts = products.filter((p) => ['tv-audio', 'gaming'].includes(p.category));
  const kitchenProducts = products.filter((p) => p.category === 'kitchen-appliances');
  const homeAppProducts = products.filter((p) => p.category === 'home-appliances');
  const smartTechProducts = products.filter((p) => p.category === 'smartwatches');
  const personalCareProducts = products.filter((p) => p.category === 'personal-care');

  // Helper to render the exact "See All  <  >" bar and 2-column horizontal product rail from the video
  const renderProductRailWithControls = (
    items: Product[],
    seeAllLink: string,
    railRef: React.RefObject<HTMLDivElement | null>
  ) => (
    <div className="bg-white">
      {/* "See All < >" Right-Aligned Header Bar (Exact Video 00:04, 00:05, 00:18, 00:20, 01:39) */}
      <div className="flex items-center justify-end gap-2 px-3 py-2 bg-[#F5F6F8] border-y border-slate-200">
        <Link
          to={seeAllLink}
          className="text-xs font-bold text-[#475569] hover:text-[#F26522] mr-1"
        >
          See All
        </Link>
        <button
          type="button"
          onClick={() => scrollRail(railRef, 'left')}
          aria-label="Scroll left"
          className="w-6 h-6 rounded bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:text-[#F26522] cursor-pointer shadow-2xs"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => scrollRail(railRef, 'right')}
          aria-label="Scroll right"
          className="w-6 h-6 rounded bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:text-[#F26522] cursor-pointer shadow-2xs"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2-Column Mobile / 4-Column Desktop Horizontal Scroller */}
      <div
        ref={railRef}
        className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory border-t border-slate-100"
      >
        {items.map((product) => (
          <div
            key={product.id}
            className="w-1/2 sm:w-1/3 lg:w-1/4 shrink-0 snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-[#F5F6F8] pb-6 space-y-3">
      {/* 1. TOP CIRCULAR CATEGORY BUBBLES (00:00 in Video) */}
      <section className="bg-white py-3 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6">
          <div className="flex items-start gap-3 sm:gap-5 overflow-x-auto no-scrollbar snap-x">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={cat.slug === 'offers' ? '/offers' : `/products?category=${cat.slug}`}
                className="group flex flex-col items-center shrink-0 w-[76px] sm:w-[92px] snap-start"
              >
                <div className="w-[68px] h-[68px] sm:w-20 sm:h-20 rounded-full bg-[#F8FAFC] border border-slate-200 group-hover:border-[#F26522] p-1.5 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 shadow-2xs">
                  <SmartImage
                    src={cat.image}
                    alt={cat.name}
                    brand={cat.name}
                    category={cat.slug}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="mt-1.5 text-[11px] sm:text-xs font-bold text-[#1E293B] group-hover:text-[#F26522] text-center leading-tight line-clamp-2">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PWA INSTALL APP BANNER ON HOME PAGE */}
      <PWAInstallBanner variant="home-card" />

      {/* 2. FESTIVE DEALS & OFFERS TOP STRIP BANNER (00:00 in Video) */}
      <section className="max-w-7xl mx-auto px-2 sm:px-6">
        <Link to="/offers" className="block rounded-lg overflow-hidden shadow-2xs">
          <SmartImage
            src="https://img-prd-pim.poorvika.com/pageimg/Festive-Deals-Offers-2027-M.webp"
            alt="Festive Deals & Offers"
            brand="Charlie Mobile"
            category="smartphones"
            className="w-full h-auto object-cover"
          />
        </Link>
      </section>

      {/* 3. HERO BANNER CAROUSEL WITH LEFT/RIGHT `<` `>` ARROWS & ORANGE PILL DOT INDICATOR (00:01 & 01:25-01:31 in Video) */}
      {currentBanner && (
        <section className="max-w-7xl mx-auto px-2 sm:px-6">
          <div className="relative rounded-lg overflow-hidden bg-white shadow-2xs">
            <Link to={currentBanner.ctaLink || '/products'} className="block">
              <SmartImage
                src={currentBanner.image}
                alt={currentBanner.title}
                brand="Charlie Mobile"
                category="smartphones"
                className="w-full h-auto max-h-[360px] object-cover mx-auto"
              />
            </Link>

            {/* Left `<` Button */}
            <button
              type="button"
              onClick={() =>
                setBannerIndex(
                  (prev) => (prev - 1 + activeBanners.length) % activeBanners.length
                )
              }
              aria-label="Previous banner"
              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-10 rounded bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right `>` Button */}
            <button
              type="button"
              onClick={() => setBannerIndex((prev) => (prev + 1) % activeBanners.length)}
              aria-label="Next banner"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-10 rounded bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Dots with Orange Pill Active Dot */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {activeBanners.map((b, idx) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBannerIndex(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === bannerIndex % activeBanners.length
                    ? 'w-5 bg-[#F26522]'
                    : 'w-2 bg-slate-300'
                }`}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. CATCH THE COOLEST MONSOON DEALS (00:02 in Video) */}
      <section className="max-w-7xl mx-auto bg-white pt-3 pb-2 shadow-2xs">
        <h2 className="text-center text-[15px] sm:text-lg font-extrabold text-[#E0531F] px-3">
          Catch the Coolest Monsoon Deals
        </h2>
        <div className="mt-1.5 py-1.5 border-y border-slate-200 text-center">
          <span className="text-xs font-extrabold text-[#F26522] border-b-2 border-[#F26522] pb-1">
            Monsoon Appliances
          </span>
        </div>

        <div className="p-2 space-y-2">
          <Link to="/products?category=home-appliances" className="block rounded overflow-hidden">
            <SmartImage
              src="https://img-prd-pim.poorvika.com/pageimg/Monsoon-Appliances-2027-mob.webp"
              alt="Monsoon Appliances"
              brand="Monsoon Deals"
              category="home-appliances"
              className="w-full h-auto object-cover"
            />
          </Link>

          <div className="grid grid-cols-2 gap-2">
            {[
              {
                img: 'https://img-prd-pim.poorvika.com/pageimg/Washer-and-dryer-mob-version.webp',
                link: '/products?category=home-appliances',
                alt: 'Washer and Dryer',
              },
              {
                img: 'https://img-prd-pim.poorvika.com/pageimg/Hair-DryerMobile-View.webp',
                link: '/products?category=personal-care',
                alt: 'Hair Dryer',
              },
              {
                img: 'https://img-prd-pim.poorvika.com/pageimg/Iron-Bar-Mobile-View.webp',
                link: '/products?category=home-appliances',
                alt: 'Iron Bar',
              },
              {
                img: 'https://img-prd-pim.poorvika.com/pageimg/Water-Heater-Mobile-View.webp',
                link: '/products?category=home-appliances',
                alt: 'Water Heater',
              },
            ].map((item) => (
              <Link key={item.alt} to={item.link} className="block rounded overflow-hidden">
                <SmartImage
                  src={item.img}
                  alt={item.alt}
                  brand={item.alt}
                  category="home-appliances"
                  className="w-full h-auto object-cover"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MOBILES & ACCESSORIES SECTION (00:03 - 00:04 in Video) */}
      <section className="max-w-7xl mx-auto bg-white pt-3 shadow-2xs">
        <h2 className="text-center text-base sm:text-lg font-extrabold text-[#1E293B]">
          Mobiles &amp; Accessories
        </h2>

        {/* 4 Interactive Tabs: Best seller | 5G Mobiles | Top Brands | Accessories */}
        <div className="mt-2 grid grid-cols-4 border-y border-slate-200 bg-white text-center">
          {[
            { id: 'best_seller', label: 'Best seller' },
            { id: '5g', label: '5G Mobiles' },
            { id: 'top_brands', label: 'Top Brands' },
            { id: 'accessories', label: 'Accessories' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setMobileTab(t.id as typeof mobileTab)}
              className={`py-2.5 text-[11px] sm:text-xs font-bold border-r last:border-r-0 border-slate-200 transition-colors cursor-pointer ${
                mobileTab === t.id
                  ? 'text-[#F26522] border-b-2 border-b-[#F26522] bg-orange-50/20'
                  : 'text-[#1E293B] hover:text-[#F26522]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Active Tab Banner + 2x2 Grid */}
        <div className="p-2 space-y-2">
          <Link to={mobileTabMedia[mobileTab].bannerLink} className="block rounded overflow-hidden">
            <SmartImage
              src={mobileTabMedia[mobileTab].banner}
              alt="Mobiles & Accessories Featured"
              brand="Charlie Mobile"
              category="smartphones"
              className="w-full h-auto object-cover"
            />
          </Link>

          <div className="grid grid-cols-2 gap-2">
            {mobileTabMedia[mobileTab].grid.map((g) => (
              <Link key={g.alt} to={g.link} className="block rounded overflow-hidden">
                <SmartImage
                  src={g.img}
                  alt={g.alt}
                  brand={g.alt}
                  category="smartphones"
                  className="w-full h-auto object-cover"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Product Slider with "See All < >" */}
        {renderProductRailWithControls(
          mobileProducts,
          '/products?category=smartphones',
          mobileRailRef
        )}
      </section>

      {/* 6. LAPTOP & TABLETS SECTION (00:04 - 00:05 in Video) */}
      <section className="max-w-7xl mx-auto bg-white pt-3 shadow-2xs">
        <h2 className="text-center text-base sm:text-lg font-extrabold text-[#1E293B]">
          Laptop &amp; Tablets
        </h2>

        {/* 4 Interactive Tabs: Best Laptops | Desktop Pc | iPad & Tablets | Accessories */}
        <div className="mt-2 grid grid-cols-4 border-y border-slate-200 bg-white text-center">
          {[
            { id: 'best_laptops', label: 'Best Laptops' },
            { id: 'desktop_pc', label: 'Desktop Pc' },
            { id: 'ipad_tablets', label: 'iPad & Tablets' },
            { id: 'accessories', label: 'Accessories' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setLaptopTab(t.id as typeof laptopTab)}
              className={`py-2.5 text-[11px] sm:text-xs font-bold border-r last:border-r-0 border-slate-200 transition-colors cursor-pointer ${
                laptopTab === t.id
                  ? 'text-[#F26522] border-b-2 border-b-[#F26522] bg-orange-50/20'
                  : 'text-[#1E293B] hover:text-[#F26522]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Active Tab Banner + 2x2 Grid */}
        <div className="p-2 space-y-2">
          <Link to={laptopTabMedia[laptopTab].bannerLink} className="block rounded overflow-hidden">
            <SmartImage
              src={laptopTabMedia[laptopTab].banner}
              alt="Laptops & Tablets"
              brand="Charlie Mobile"
              category="laptops"
              className="w-full h-auto object-cover"
            />
          </Link>

          <div className="grid grid-cols-2 gap-2">
            {laptopTabMedia[laptopTab].grid.map((g) => (
              <Link key={g.alt} to={g.link} className="block rounded overflow-hidden">
                <SmartImage
                  src={g.img}
                  alt={g.alt}
                  brand={g.alt}
                  category="laptops"
                  className="w-full h-auto object-cover"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Product Slider with "See All < >" */}
        {renderProductRailWithControls(
          laptopProducts,
          '/products?category=laptops',
          laptopRailRef
        )}
      </section>

      {/* 7. CIRCULAR BRAND LOGO SCROLLER (00:05 - 00:11 in Video) */}
      <section className="max-w-7xl mx-auto py-3 px-2 sm:px-6 bg-[#E5E7EB]/70">
        <div className="relative flex items-center">
          <button
            type="button"
            onClick={() => scrollRail(brandRailRef, 'left')}
            aria-label="Previous brands"
            className="w-6 h-6 rounded-full bg-white shadow-xs flex items-center justify-center text-slate-600 shrink-0 z-10 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={brandRailRef}
            className="flex items-center gap-3 overflow-x-auto no-scrollbar px-2 py-1"
          >
            {circularBrandLogos.map((brand) => (
              <Link
                key={brand.name}
                to={brand.link}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center p-2 shrink-0 hover:border-[#F26522] transition-transform hover:scale-105"
              >
                <SmartImage
                  src={brand.img}
                  alt={brand.name}
                  brand={brand.name}
                  category="smartphones"
                  className="w-full h-full object-contain"
                />
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollRail(brandRailRef, 'right')}
            aria-label="Next brands"
            className="w-6 h-6 rounded-full bg-white shadow-xs flex items-center justify-center text-slate-600 shrink-0 z-10 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 8. TV & AUDIO SECTION (00:06 - 00:18 & 00:22 - 00:27 in Video) */}
      <section className="max-w-7xl mx-auto bg-white pt-3 shadow-2xs">
        <h2 className="text-center text-base sm:text-lg font-extrabold text-[#1E293B]">
          Tv &amp; Audio
        </h2>

        {/* 4 Interactive Tabs: All categories | Television | Audio | Entertainment */}
        <div className="mt-2 grid grid-cols-4 border-y border-slate-200 bg-white text-center">
          {[
            { id: 'all', label: 'All categories' },
            { id: 'television', label: 'Television' },
            { id: 'audio', label: 'Audio' },
            { id: 'entertainment', label: 'Entertainment' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTvTab(t.id as typeof tvTab)}
              className={`py-2.5 text-[11px] sm:text-xs font-bold border-r last:border-r-0 border-slate-200 transition-colors cursor-pointer ${
                tvTab === t.id
                  ? 'text-[#F26522] border-b-2 border-b-[#F26522] bg-orange-50/20'
                  : 'text-[#1E293B] hover:text-[#F26522]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Active Tab Banner + 2x2 Grid */}
        <div className="p-2 space-y-2">
          <Link to={tvTabMedia[tvTab].bannerLink} className="block rounded overflow-hidden">
            <SmartImage
              src={tvTabMedia[tvTab].banner}
              alt="TV & Audio"
              brand="Charlie Mobile"
              category="tv-audio"
              className="w-full h-auto object-cover"
            />
          </Link>

          <div className="grid grid-cols-2 gap-2">
            {tvTabMedia[tvTab].grid.map((g) => (
              <Link key={g.alt} to={g.link} className="block rounded overflow-hidden">
                <SmartImage
                  src={g.img}
                  alt={g.alt}
                  brand={g.alt}
                  category="tv-audio"
                  className="w-full h-auto object-cover"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Product Slider with "See All < >" */}
        {renderProductRailWithControls(tvProducts, '/products?category=tv-audio', tvRailRef)}
      </section>

      {/* 9. KITCHEN APPLIANCES SECTION (00:18 - 00:19 in Video) */}
      <section className="max-w-7xl mx-auto bg-white pt-3 shadow-2xs">
        <h2 className="text-center text-base sm:text-lg font-extrabold text-[#1E293B]">
          Kitchen Appliances
        </h2>

        {/* 4 Interactive Tabs: All Categories | Kitchen Grinders | Cookwares | Steamers & Cookers */}
        <div className="mt-2 grid grid-cols-4 border-y border-slate-200 bg-white text-center">
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'grinders', label: 'Kitchen Grinders' },
            { id: 'cookwares', label: 'Cookwares' },
            { id: 'steamers', label: 'Steamers & Cookers' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setKitchenTab(t.id as typeof kitchenTab)}
              className={`py-2.5 text-[10px] sm:text-xs font-bold border-r last:border-r-0 border-slate-200 transition-colors cursor-pointer ${
                kitchenTab === t.id
                  ? 'text-[#F26522] border-b-2 border-b-[#F26522] bg-orange-50/20'
                  : 'text-[#1E293B] hover:text-[#F26522]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Active Tab Banner + 2x2 Grid */}
        <div className="p-2 space-y-2">
          <Link to={kitchenTabMedia[kitchenTab].bannerLink} className="block rounded overflow-hidden">
            <SmartImage
              src={kitchenTabMedia[kitchenTab].banner}
              alt="Kitchen Appliances"
              brand="Charlie Mobile"
              category="kitchen-appliances"
              className="w-full h-auto object-cover"
            />
          </Link>

          <div className="grid grid-cols-2 gap-2">
            {kitchenTabMedia[kitchenTab].grid.map((g) => (
              <Link key={g.alt} to={g.link} className="block rounded overflow-hidden">
                <SmartImage
                  src={g.img}
                  alt={g.alt}
                  brand={g.alt}
                  category="kitchen-appliances"
                  className="w-full h-auto object-cover"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Product Slider with "See All < >" */}
        {renderProductRailWithControls(
          kitchenProducts,
          '/products?category=kitchen-appliances',
          kitchenRailRef
        )}
      </section>

      {/* 10. HOME APPLIANCES SECTION (00:19 - 00:20 in Video) */}
      <section className="max-w-7xl mx-auto bg-white pt-3 shadow-2xs">
        <h2 className="text-center text-base sm:text-lg font-extrabold text-[#1E293B]">
          Home Appliances
        </h2>

        {/* 4 Interactive Tabs: All Categories | Air Conditioner | Home Cleansers | Small Appliances */}
        <div className="mt-2 grid grid-cols-4 border-y border-slate-200 bg-white text-center">
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'ac', label: 'Air Conditioner' },
            { id: 'cleansers', label: 'Home Cleansers' },
            { id: 'small', label: 'Small Appliances' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setHomeAppTab(t.id as typeof homeAppTab)}
              className={`py-2.5 text-[10px] sm:text-xs font-bold border-r last:border-r-0 border-slate-200 transition-colors cursor-pointer ${
                homeAppTab === t.id
                  ? 'text-[#F26522] border-b-2 border-b-[#F26522] bg-orange-50/20'
                  : 'text-[#1E293B] hover:text-[#F26522]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Active Tab Banner + 2x2 Grid */}
        <div className="p-2 space-y-2">
          <Link to={homeAppTabMedia[homeAppTab].bannerLink} className="block rounded overflow-hidden">
            <SmartImage
              src={homeAppTabMedia[homeAppTab].banner}
              alt="Home Appliances"
              brand="Charlie Mobile"
              category="home-appliances"
              className="w-full h-auto object-cover"
            />
          </Link>

          <div className="grid grid-cols-2 gap-2">
            {homeAppTabMedia[homeAppTab].grid.map((g) => (
              <Link key={g.alt} to={g.link} className="block rounded overflow-hidden">
                <SmartImage
                  src={g.img}
                  alt={g.alt}
                  brand={g.alt}
                  category="home-appliances"
                  className="w-full h-auto object-cover"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Product Slider with "See All < >" */}
        {renderProductRailWithControls(
          homeAppProducts,
          '/products?category=home-appliances',
          homeRailRef
        )}
      </section>

      {/* 11. SMART TECHNOLOGY SECTION (01:38 - 01:39 in Video) */}
      <section className="max-w-7xl mx-auto bg-white pt-2 shadow-2xs">
        <div className="p-2">
          <Link to="/products?category=smartwatches" className="block rounded overflow-hidden">
            <SmartImage
              src="https://img-prd-pim.poorvika.com/pageimg/Smart-Accessories-Mob-M-A-2026.webp"
              alt="Smart Technology"
              brand="Smart Technology"
              category="smartwatches"
              className="w-full h-auto object-cover"
            />
          </Link>
        </div>

        {renderProductRailWithControls(
          smartTechProducts,
          '/products?category=smartwatches',
          smartTechRailRef
        )}
      </section>

      {/* 12. PERSONAL CARE SECTION (01:39 - 01:40 in Video) */}
      <section className="max-w-7xl mx-auto bg-white pt-3 shadow-2xs">
        <h2 className="text-center text-base sm:text-lg font-extrabold text-[#1E293B]">
          Personal Care
        </h2>

        {/* 2 Interactive Tabs: Trending Products | Personal Care */}
        <div className="mt-2 grid grid-cols-2 border-y border-slate-200 bg-white text-center">
          <button
            type="button"
            onClick={() => setPersonalCareTab('trending')}
            className={`py-2.5 text-xs font-bold border-r border-slate-200 transition-colors cursor-pointer ${
              personalCareTab === 'trending'
                ? 'text-[#F26522] border-b-2 border-b-[#F26522] bg-orange-50/20'
                : 'text-[#1E293B]'
            }`}
          >
            Trending Products
          </button>
          <button
            type="button"
            onClick={() => setPersonalCareTab('personal_care')}
            className={`py-2.5 text-xs font-bold transition-colors cursor-pointer ${
              personalCareTab === 'personal_care'
                ? 'text-[#F26522] border-b-2 border-b-[#F26522] bg-orange-50/20'
                : 'text-[#1E293B]'
            }`}
          >
            Personal Care
          </button>
        </div>

        <div className="p-2 space-y-2">
          {personalCareTab === 'trending' ? (
            <Link to="/products?category=personal-care" className="block rounded overflow-hidden">
              <SmartImage
                src="https://img-prd-pim.poorvika.com/pageimg/Personal-care-home-page-mob.webp"
                alt="Personal Care"
                brand="Personal Care"
                category="personal-care"
                className="w-full h-auto object-cover"
              />
            </Link>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  img: 'https://img-prd-pim.poorvika.com/pageimg/ Hair-Dryers-Personal-Care-Mobile-View.webp',
                  link: '/products?category=personal-care',
                  alt: 'Hair Dryers',
                },
                {
                  img: 'https://img-prd-pim.poorvika.com/pageimg/Hair-Straighteners-Personal-Care-Mobile-View.webp',
                  link: '/products?category=personal-care',
                  alt: 'Hair Straighteners',
                },
                {
                  img: 'https://img-prd-pim.poorvika.com/pageimg/Hair-Styler-Personal-Care-Mobile-View.webp',
                  link: '/products?category=personal-care',
                  alt: 'Hair Styler',
                },
                {
                  img: 'https://img-prd-pim.poorvika.com/pageimg/Trimmers-Personal-Care-Mobile-View.webp',
                  link: '/products?category=personal-care',
                  alt: 'Trimmers',
                },
              ].map((g) => (
                <Link key={g.alt} to={g.link} className="block rounded overflow-hidden">
                  <SmartImage
                    src={g.img}
                    alt={g.alt}
                    brand={g.alt}
                    category="personal-care"
                    className="w-full h-auto object-cover"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>

        {renderProductRailWithControls(
          personalCareProducts,
          '/products?category=personal-care',
          personalCareRailRef
        )}
      </section>

      {/* 13. SEO INFORMATIONAL BLOCK (01:40 - 01:42 in Video) */}
      <section className="max-w-7xl mx-auto bg-white p-4 sm:p-6 text-[#1E293B] space-y-3 border-t border-slate-200">
        <h2 className="text-sm sm:text-base font-extrabold leading-snug">
          Charlie Mobiles – Your Trusted Destination for Mobiles, Electronics, Gadgets &amp; Everyday Essentials
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Charlie Mobiles &amp; Accessories is your trusted multi-brand retail destination for smartphones, laptops, tablets, smart TVs, home appliances, kitchen essentials, gaming consoles, and personal care gadgets. Whether you shop online or visit our showroom, enjoy 100% genuine sealed products, instant store pickup, and easy No-Cost EMI options.
        </p>

        <h3 className="text-xs sm:text-sm font-extrabold pt-1">
          Top Categories Available at Charlie Mobiles
        </h3>
        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>
            <strong className="text-[#1E293B]">1. Mobiles &amp; Accessories:</strong> Explore the latest 5G smartphones from Apple iPhone, Samsung Galaxy, Vivo, Oppo, OnePlus, Realme, Redmi, and Nothing along with original fast chargers, power banks, TWS earbuds, and protective cases.
          </p>
          <p>
            <strong className="text-[#1E293B]">2. Laptops, Tablets &amp; Computers:</strong> Shop Apple MacBooks, iPads, HP Victus Gaming Laptops, Acer Aspire, Dell, Lenovo, and Asus laptops for work, study, and gaming.
          </p>
          <p>
            <strong className="text-[#1E293B]">3. Smart TVs, Audio &amp; Gaming Entertainment:</strong> Upgrade your living room with 4K QLED, OLED &amp; QNED Smart TVs, Dolby Atmos Soundbars, Sony PlayStation 5 Consoles, PS VR2 controllers, and Asus ROG Ally handhelds.
          </p>
          <p>
            <strong className="text-[#1E293B]">4. Home, Kitchen &amp; Personal Care Appliances:</strong> Discover 5-Star Inverter Air Conditioners, Washing Machines, Refrigerators, Air Fryers, Chimneys, Dyson Airwrap Stylers, and Philips grooming appliances.
          </p>
        </div>
      </section>
    </div>
  );
};
