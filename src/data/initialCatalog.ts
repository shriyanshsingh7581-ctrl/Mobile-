import {
  BlogPostItem,
  CategoryItem,
  CelebrityReelItem,
  Coupon,
  HeroBanner,
  HomepageSectionConfig,
  Product,
  StoreSettings,
  TestimonialItem,
  VisualCardItem,
} from '../types/store';
import { generateProductStudioSvg } from '../utils/productVisuals';

function buildPoorvikaGallery(
  primaryUrls: string[],
  title: string,
  brand: string,
  category: string,
  primaryHex: string,
  secondaryHex: string
): string[] {
  const valid = primaryUrls.filter(Boolean);
  const fallbacks = [
    generateProductStudioSvg({
      title,
      brand,
      category,
      primaryHex,
      secondaryHex,
      angle: 'front_display',
    }),
    generateProductStudioSvg({
      title,
      brand,
      category,
      primaryHex,
      secondaryHex,
      angle: 'back_camera',
    }),
  ];
  return [...valid, ...fallbacks].slice(0, 5);
}

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat_offers',
    name: 'Offer Zone',
    slug: 'offers',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/poorvikas-diwali-offers-soon-m.webp',
    order: 1,
    badge: 'Coming Soon',
  },
  {
    id: 'cat_smartphones',
    name: 'Mobiles & Accessories',
    slug: 'smartphones',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/Mobiles-Accessories-Home-page-Mob.webp',
    order: 2,
    badge: '5G Ready',
  },
  {
    id: 'cat_tablets',
    name: 'Laptops & Tablets',
    slug: 'tablets',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/Laptops-tablets-Home-page-Mob.webp',
    order: 3,
  },
  {
    id: 'cat_tv_audio',
    name: 'Tv & Audio',
    slug: 'tv-audio',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/TV-Audio-Home-page-Mob.webp',
    order: 4,
  },
  {
    id: 'cat_kitchen',
    name: 'Kitchen Appliances',
    slug: 'kitchen-appliances',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/Kitchen-appliances-Home-page-Mob.webp',
    order: 5,
  },
  {
    id: 'cat_home_appliances',
    name: 'Home Appliances',
    slug: 'home-appliances',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/Home-Appliances-Mob-web.webp',
    order: 6,
  },
  {
    id: 'cat_smartwatches',
    name: 'Smart Technology',
    slug: 'smartwatches',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/Smart-Technology-Home-page-Mob.webp',
    order: 7,
  },
  {
    id: 'cat_personal_care',
    name: 'Personal & Health Care',
    slug: 'personal-care',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/Personal-health-care-Home-page-Mob.webp',
    order: 8,
  },
  {
    id: 'cat_iphone',
    name: 'iPhones',
    slug: 'iphone',
    image:
      'https://img-prd-pim.poorvika.com/product/Apple-iPhone-17-Pro-Max-Cosmic-Orange-2tB-front-back-view.png',
    order: 9,
  },
  {
    id: 'cat_samsung',
    name: 'Samsung',
    slug: 'samsung',
    image:
      'https://img-prd-pim.poorvika.com/product/Samsung-galaxy-s26-ultra-5g-cobalt-violet-16gb-1Tb-Front-Back-View.webp',
    order: 10,
  },
  {
    id: 'cat_vivo',
    name: 'Vivo',
    slug: 'vivo',
    image:
      'https://img-prd-pim.poorvika.com/product/Vivo-V80-5G-Horizon-Blue-8GB-512GB-front-back-view.webp',
    order: 11,
  },
  {
    id: 'cat_oppo',
    name: 'Oppo',
    slug: 'oppo',
    image:
      'https://img-prd-pim.poorvika.com/product/Oppo-find-x10-pro-max-5g-titanium-grey-12gb-512gb-Front-Back-View.webp',
    order: 12,
  },
  {
    id: 'cat_accessories',
    name: 'Mobile Accessories',
    slug: 'mobile-accessories',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/Case-Covers-Mobile-and-Accessories-2026.webp',
    order: 13,
  },
  {
    id: 'cat_gaming',
    name: 'Entertainment & Gaming',
    slug: 'entertainment',
    image:
      'https://img-prd-pim.poorvika.com/product/Sony-playstation-5-slim-digital-e-chassi-cfi-2116b01y-white-Full-View.webp',
    order: 14,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  // === MOBILES & ACCESSORIES (FIRST TWO EXACTLY AS IN VIDEO 00:04 & 01:33) ===
  {
    id: 'prod_realme_narzo_100_lite',
    name: 'Realme Narzo 100 Lite 5G ( Thunder Black, 4GB-64GB )',
    brand: 'Realme',
    category: 'realme',
    price: 18999,
    mrp: 24999,
    stock: 29,
    description:
      'Realme Narzo 100 Lite 5G with 120Hz Eye-Comfort Display, MediaTek Dimensity 6300 5G processor, 50MP AI camera, and 5000mAh massive battery.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Realme-Narzo-100-Lite-5G-Thunder-Black-6GB-128GB-front-view.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Realme-Narzo-100-Lite-5G-Thunder-Black-6GB-128GB-front-view.webp',
        'https://img-prd-pim.poorvika.com/product/Realme-c100i-skyline-silver-4gb-64gb-Front-Back-View.webp',
      ],
      'Realme Narzo 100 Lite 5G',
      'Realme',
      'realme',
      '#18181B',
      '#14B8A6'
    ),
    colors: [
      { name: 'Thunder Black', hex: '#18181B' },
      { name: 'Skyline Silver', hex: '#94A3B8' },
    ],
    ramOptions: ['4GB', '6GB'],
    storageOptions: ['64GB', '128GB'],
    os: 'Android',
    is5G: true,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    isMidRange: true,
    rating: 4.7,
    reviewCount: 218,
    warranty: '1 Year Realme India Official Warranty',
    exchangeBonus: 2000,
    emiStartingAt: 899,
    specs: {
      Display: '6.67-inch 120Hz Ultra Smooth Display',
      Processor: 'MediaTek Dimensity 6300 5G Processor',
      Camera: '50MP AI Primary Camera + Flicker Sensor',
      Battery: '5000mAh with 33W SUPERVOOC Charge',
    },
  },
  {
    id: 'prod_samsung_galaxy_a08',
    name: 'Samsung Galaxy A08 ( Dark Blue, 4GB-64GB )',
    brand: 'Samsung',
    category: 'samsung',
    price: 18499,
    mrp: 26999,
    stock: 40,
    description:
      'Reliable everyday Samsung Galaxy A08 smartphone with 50MP High-Resolution Dual Camera, 6.7-inch PLS LCD display, Knox Vault security, and 5000mAh 2-day battery.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Samsung-Galaxy-A08-Silver-4GB-64GB-front-view.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Samsung-Galaxy-A08-Silver-4GB-64GB-front-view.webp',
        'https://img-prd-pim.poorvika.com/product/Samsung-Galaxy-A08-Green-4GB-64GB-front-view.webp',
      ],
      'Samsung Galaxy A08',
      'Samsung',
      'samsung',
      '#1E3A8A',
      '#10B981'
    ),
    colors: [
      { name: 'Dark Blue', hex: '#1E3A8A' },
      { name: 'Silver', hex: '#94A3B8' },
      { name: 'Green', hex: '#10B981' },
    ],
    ramOptions: ['4GB', '6GB'],
    storageOptions: ['64GB', '128GB'],
    os: 'Android',
    is5G: true,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    rating: 4.6,
    reviewCount: 230,
    warranty: '1 Year Samsung India Official Warranty',
    exchangeBonus: 2000,
    emiStartingAt: 849,
    specs: {
      Display: '6.7-inch HD+ 90Hz Infinity-U Display',
      Processor: 'MediaTek Helio G85 Octa-Core Processor',
      Camera: '50MP Main + 2MP Depth Sensor, 8MP Front Camera',
      Battery: '5000mAh with 25W Type-C Fast Charging Support',
    },
  },
  {
    id: 'prod_vivo_v80_5g',
    name: 'Vivo V80 5G ( Horizon Blue, 8GB-512GB )',
    brand: 'Vivo',
    category: 'vivo',
    price: 74999,
    mrp: 79999,
    stock: 15,
    description:
      'Vivo V80 5G co-engineered with ZEISS Optics, featuring ZEISS Portrait So Pro, Studio-Quality Aura Light, 50MP Eye AF Group Selfie camera, and ultra-slim 3D curved AMOLED display.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Vivo-V80-5G-Horizon-Blue-8GB-512GB-front-back-view.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Vivo-V80-5G-Horizon-Blue-8GB-512GB-front-back-view.webp',
        'https://img-prd-pim.poorvika.com/product/Vivo-V80-5G-Sunrise-Anthem-8GB-512GB-front-back-view.webp',
        'https://img-prd-pim.poorvika.com/product/Vivo-V80-5G-Stellar-Black-8GB-512GB-front-back-view.webp',
      ],
      'Vivo V80 5G',
      'Vivo',
      'vivo',
      '#0284C7',
      '#EA580C'
    ),
    colors: [
      { name: 'Horizon Blue', hex: '#0284C7' },
      { name: 'Sunrise Anthem', hex: '#EA580C' },
      { name: 'Stellar Black', hex: '#18181B' },
    ],
    ramOptions: ['8GB', '12GB'],
    storageOptions: ['256GB', '512GB'],
    os: 'Android',
    is5G: true,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    isFlagship: true,
    isBestCamera: true,
    rating: 4.9,
    reviewCount: 278,
    warranty: '1 Year Vivo India Official Warranty',
    exchangeBonus: 6000,
    emiStartingAt: 2625,
    specs: {
      Display: '6.78-inch 1.5K Ultra-Clear Curved AMOLED, 120Hz',
      Processor: 'MediaTek Dimensity Flagship 4nm 5G Chipset',
      Camera: '50MP ZEISS OIS Main + 50MP ZEISS Telephoto Portrait + 50MP Wide',
      FrontCamera: '50MP ZEISS Group Selfie with Auto-Focus',
      Battery: '6000mAh BlueVolt Battery with 90W FlashCharge',
    },
  },
  {
    id: 'prod_oppo_find_x10_pro_max',
    name: 'Oppo Find X10 Pro Max 5G ( Titanium Grey, 12GB-512GB )',
    brand: 'Oppo',
    category: 'oppo',
    price: 199999,
    mrp: 239999,
    stock: 7,
    description:
      'Oppo Find X10 Series co-engineered with Hasselblad — 200MP Camera, True to the Moment. Dual Periscope Telephoto lenses, AI Telescope Zoom, and Silicon-Carbon 6000mAh battery.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Oppo-find-x10-pro-max-5g-titanium-grey-12gb-512gb-Front-Back-View.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Oppo-find-x10-pro-max-5g-titanium-grey-12gb-512gb-Front-Back-View.webp',
        'https://img-prd-pim.poorvika.com/product/Oppo-find-x10-5g-mist-grey-12gb-512gb-Front-Back-View.webp',
      ],
      'Oppo Find X10 Pro Max',
      'Oppo',
      'oppo',
      '#475569',
      '#0284C7'
    ),
    colors: [
      { name: 'Titanium Grey', hex: '#475569' },
      { name: 'Mist Grey', hex: '#94A3B8' },
    ],
    ramOptions: ['12GB', '16GB'],
    storageOptions: ['512GB'],
    os: 'Android',
    is5G: true,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    isFlagship: true,
    isBestCamera: true,
    rating: 4.9,
    reviewCount: 186,
    warranty: '1 Year Oppo India Official Warranty',
    exchangeBonus: 10000,
    emiStartingAt: 8333,
    specs: {
      Display: '6.82-inch Infinite View Quad-Curved ProXDR LTPO OLED, 120Hz',
      Processor: 'MediaTek Dimensity 9400+ Flagship 3nm SoC',
      Camera: '200MP Hasselblad Periscope Telephoto + 50MP LYT-808 + 50MP Wide',
      Battery: '6000mAh Silicon-Carbon with 80W SUPERVOOC + 50W AIRVOOC',
    },
  },
  {
    id: 'prod_iphone_17_pro_max',
    name: 'Apple iPhone 17 Pro Max ( Cosmic Orange, 2TB )',
    brand: 'Apple',
    category: 'iphone',
    price: 229900,
    mrp: 239900,
    stock: 10,
    description:
      'Apple iPhone 17 Pro Max with Grade 5 Titanium unibody, 6.9-inch Super Retina XDR ProMotion display, A19 Pro chip, 48MP Pro Fusion Triple Camera system, and 4K 120fps Dolby Vision.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Apple-iPhone-17-Pro-Max-Cosmic-Orange-2tB-front-back-view.png',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Apple-iPhone-17-Pro-Max-Cosmic-Orange-2tB-front-back-view.png',
        'https://img-prd-pim.poorvika.com/product/Apple-iPhone-17-Pro-Max-Deep-Blue-2tB-front-back-view.png',
        'https://img-prd-pim.poorvika.com/product/Apple-iPhone-17-Pro-Max-Silver-2tb-front-back-vieww.png',
      ],
      'iPhone 17 Pro Max',
      'Apple',
      'iphone',
      '#EA580C',
      '#1E293B'
    ),
    colors: [
      { name: 'Cosmic Orange', hex: '#EA580C' },
      { name: 'Deep Blue', hex: '#1E3A8A' },
      { name: 'Silver', hex: '#E2E8F0' },
    ],
    ramOptions: ['12GB'],
    storageOptions: ['256GB', '512GB', '1TB', '2TB'],
    os: 'iOS',
    is5G: true,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    isFlagship: true,
    isBestCamera: true,
    rating: 4.9,
    reviewCount: 318,
    warranty: '1 Year Apple India Official Warranty',
    exchangeBonus: 10000,
    emiStartingAt: 9579,
    specs: {
      Display: '6.9-inch Super Retina XDR OLED, 120Hz ProMotion',
      Processor: 'Apple A19 Pro Hexa-Core Neural Engine',
      Camera: '48MP Fusion + 48MP Ultra Wide + 48MP 5x Tetraprism Telephoto',
      Battery: 'All-Day 35 Hr Video Playback, MagSafe + 40W Fast USB-C',
    },
  },
  {
    id: 'prod_samsung_s26_ultra',
    name: 'Samsung Galaxy S26 Ultra 5G ( Cobalt Violet, 12GB-512GB )',
    brand: 'Samsung',
    category: 'samsung',
    price: 164999,
    mrp: 174999,
    stock: 12,
    description:
      'Samsung Galaxy S26 Ultra 5G with Titanium Armor frame, built-in S-Pen, Galaxy AI Live Translate & Note Assist, 200MP Quad Telephoto Camera, and Snapdragon 8 Elite for Galaxy.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Samsung-galaxy-s26-ultra-5g-cobalt-violet-12gb-512gb-Front-Back-View.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Samsung-galaxy-s26-ultra-5g-cobalt-violet-12gb-512gb-Front-Back-View.webp',
        'https://img-prd-pim.poorvika.com/product/Samsung-galaxy-s26-ultra-5g-white-12gb-512gb-Front-Back-View.webp',
        'https://img-prd-pim.poorvika.com/product/Samsung-galaxy-s26-ultra-5g-black-12gb-512gb-Front-Back-View.webp',
      ],
      'Galaxy S26 Ultra 5G',
      'Samsung',
      'samsung',
      '#6D28D9',
      '#1E293B'
    ),
    colors: [
      { name: 'Cobalt Violet', hex: '#6D28D9' },
      { name: 'White', hex: '#F8FAFC' },
      { name: 'Black', hex: '#0F172A' },
    ],
    ramOptions: ['12GB', '16GB'],
    storageOptions: ['256GB', '512GB', '1TB'],
    os: 'Android',
    is5G: true,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    isFlagship: true,
    isBestCamera: true,
    rating: 4.9,
    reviewCount: 289,
    warranty: '1 Year Samsung India Official Warranty',
    exchangeBonus: 10000,
    emiStartingAt: 6875,
    specs: {
      Display: '6.9-inch QHD+ Dynamic AMOLED 2X, 120Hz',
      Processor: 'Qualcomm Snapdragon 8 Elite for Galaxy',
      Camera: '200MP OIS Main + 50MP 5x Periscope + 50MP Ultra Wide',
      Battery: '5000mAh with 45W Super Fast Charging 2.0',
    },
  },
  {
    id: 'prod_iphone_16_teal',
    name: 'Apple iPhone 16 ( Teal, 128GB )',
    brand: 'Apple',
    category: 'iphone',
    price: 79900,
    mrp: 89900,
    stock: 22,
    description:
      'Apple iPhone 16 built for Apple Intelligence with the A18 chip, Camera Control button, 48MP Fusion camera, Ceramic Shield front, and vibrant color-infused back glass.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Apple-iphone-16-teal-128gb-Front-Back-View-view.webp',
    gallery: [
      'https://img-prd-pim.poorvika.com/product/Apple-iphone-16-teal-128gb-Front-Back-View-view.webp',
      'https://img-prd-pim.poorvika.com/product/Apple-iphone-16-teal-128gb-Back-Left-View-view.webp',
      'https://img-prd-pim.poorvika.com/product/Apple-iphone-16-teal-128gb-Bottom-View-view.webp',
      'https://img-prd-pim.poorvika.com/product/Apple-iphone-16-ultramarine-128gb-Front-Back-View-view-view.webp',
    ],
    colors: [
      { name: 'Teal', hex: '#0D9488' },
      { name: 'Ultramarine', hex: '#3B82F6' },
      { name: 'Pink', hex: '#EC4899' },
    ],
    ramOptions: ['8GB'],
    storageOptions: ['128GB', '256GB'],
    os: 'iOS',
    is5G: true,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: false,
    isFlagship: true,
    isBestCamera: true,
    rating: 4.9,
    reviewCount: 540,
    warranty: '1 Year Apple India Official Warranty',
    exchangeBonus: 6000,
    emiStartingAt: 3329,
    specs: {
      Display: '6.1-inch Super Retina XDR OLED',
      Processor: 'Apple A18 Hexa-Core Processor',
      Camera: '48MP Fusion + 12MP Ultra Wide',
    },
  },
  {
    id: 'prod_oneplus_13_5g',
    name: 'OnePlus 13 5G ( Arctic Dawn, 16GB-512GB )',
    brand: 'OnePlus',
    category: 'oneplus',
    price: 76999,
    mrp: 79999,
    stock: 19,
    description:
      'OnePlus 13 5G powered by Snapdragon 8 Elite, 5th-Gen Hasselblad Camera for Mobile, 2K 120Hz ProXDR Display, and a massive 6000mAh Glacier Battery.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/oneplus-13-5g-arctic-dawn-512gb-16gb-ram-front-back-view-01.png',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/oneplus-13-5g-arctic-dawn-512gb-16gb-ram-front-back-view-01.png',
      ],
      'OnePlus 13 5G',
      'OnePlus',
      'oneplus',
      '#E2E8F0',
      '#2563EB'
    ),
    colors: [{ name: 'Arctic Dawn', hex: '#F1F5F9' }],
    ramOptions: ['12GB', '16GB'],
    storageOptions: ['256GB', '512GB'],
    os: 'Android',
    is5G: true,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    isFlagship: true,
    isBestCamera: true,
    rating: 4.9,
    reviewCount: 382,
    warranty: '1 Year OnePlus India Official Warranty',
    exchangeBonus: 7000,
    emiStartingAt: 3208,
    specs: {
      Display: '6.82-inch 2K 120Hz ProXDR LTPO 4.1 AMOLED',
      Processor: 'Qualcomm Snapdragon 8 Elite',
      Camera: '50MP Sony LYT-808 OIS + 50MP 3x Triprism Telephoto',
      Battery: '6000mAh Silicon NanoStack, 100W SUPERVOOC',
    },
  },
  {
    id: 'prod_redmi_note_17_pro_max',
    name: 'Redmi Note 17 Pro Max 5G ( Matcha Green, 12GB-256GB )',
    brand: 'Redmi',
    category: 'redmi',
    price: 55999,
    mrp: 74999,
    stock: 21,
    description:
      '200MP OIS SuperNote with 1.5K Curved AMOLED Display, Corning Gorilla Glass Victus 2, IP68 dust/water protection, and 120W HyperCharge.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Redmi-Note-17-Pro-Max-5G-Matcha-Green-12GB-256GB-frontview.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Redmi-Note-17-Pro-Max-5G-Matcha-Green-12GB-256GB-frontview.webp',
        'https://img-prd-pim.poorvika.com/product/Redmi-Note-17-Pro-Max-5G-Secret-Sunrise-12GB-256GB-front-view.webp',
      ],
      'Redmi Note 17 Pro Max 5G',
      'Redmi',
      'redmi',
      '#65A30D',
      '#EC4899'
    ),
    colors: [
      { name: 'Matcha Green', hex: '#84CC16' },
      { name: 'Secret Sunrise', hex: '#F472B6' },
    ],
    ramOptions: ['8GB', '12GB'],
    storageOptions: ['256GB', '512GB'],
    os: 'Android',
    is5G: true,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    isMidRange: true,
    isBestCamera: true,
    rating: 4.8,
    reviewCount: 312,
    warranty: '1 Year Xiaomi India Official Warranty',
    exchangeBonus: 5000,
    emiStartingAt: 2333,
    specs: {
      Display: '6.67-inch 1.5K 3D Curved AMOLED, 120Hz',
      Processor: 'Qualcomm Snapdragon 7s Gen 3 Octa-Core 5G',
      Camera: '200MP OIS HP3 Flagship Sensor + 50MP Telephoto',
      Battery: '6200mAh Battery, 120W HyperCharge',
    },
  },
  {
    id: 'prod_nothing_phone_4b',
    name: 'Nothing Phone (4b) 5G ( Blue, 8GB-256GB )',
    brand: 'Nothing',
    category: 'nothing',
    price: 40999,
    mrp: 59999,
    stock: 16,
    description:
      'Iconic transparent design with interactive Glyph Interface, Nothing OS 3.0, Dual 50MP OIS Camera system, and 120Hz flexible AMOLED display.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Nothing-phone-4b-5g-blue-8gb-256gb-Front-Back-View.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Nothing-phone-4b-5g-blue-8gb-256gb-Front-Back-View.webp',
        'https://img-prd-pim.poorvika.com/product/Nothing-phone-4b-5g-white-8gb-256gb-Front-Back-View.webp',
      ],
      'Nothing Phone (4b) 5G',
      'Nothing',
      'nothing',
      '#1D4ED8',
      '#F8FAFC'
    ),
    colors: [
      { name: 'Blue', hex: '#1D4ED8' },
      { name: 'White', hex: '#F8FAFC' },
    ],
    ramOptions: ['8GB', '12GB'],
    storageOptions: ['128GB', '256GB'],
    os: 'Android',
    is5G: true,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    isMidRange: true,
    rating: 4.8,
    reviewCount: 276,
    warranty: '1 Year Nothing India Official Warranty',
    exchangeBonus: 4000,
    emiStartingAt: 1708,
    specs: {
      Display: '6.77-inch Flexible AMOLED, 120Hz Adaptive',
      Processor: 'Qualcomm Snapdragon 7s Gen 3 Custom Edition',
      Camera: '50MP OIS Main + 50MP Periscope Telephoto',
    },
  },

  // === LAPTOP & TABLETS (EXACTLY AS IN VIDEO 00:05 & 01:35) ===
  {
    id: 'prod_hp_victus_gaming',
    name: 'HP Victus Gaming Intel Core i7 13th Gen Laptop ( Performance Blue, 16GB-512GB )',
    brand: 'HP',
    category: 'tablets',
    price: 149990,
    mrp: 187950,
    stock: 8,
    description:
      'HP Victus Gaming Intel Core i7 13th Gen Windows 11 Home Laptop with NVIDIA GeForce RTX Graphics, 144Hz FHD IPS Anti-Glare Gaming Display, B&O Audio, and OMEN Tempest Cooling.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/HP-victus-gaming-intel-core-i7-12th-gen-windows-11-home-laptop-15-fa1415tx-performance-blue-16gb-512gb-Front-View-view.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/HP-victus-gaming-intel-core-i7-12th-gen-windows-11-home-laptop-15-fa1415tx-performance-blue-16gb-512gb-Front-View-view.webp',
        'https://img-prd-pim.poorvika.com/product/HP-victus-gaming-intel-core-i5-14th-gen-windows-11-home-laptop-15-fa2624tx-mica-silver-12gb-512gb-Front-View.webp',
      ],
      'HP Victus Gaming Laptop',
      'HP',
      'tablets',
      '#1E3A8A',
      '#0F172A'
    ),
    colors: [
      { name: 'Performance Blue', hex: '#1E3A8A' },
      { name: 'Mica Silver', hex: '#64748B' },
    ],
    ramOptions: ['16GB'],
    storageOptions: ['512GB', '1TB'],
    os: 'Accessory',
    is5G: false,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    isFlagship: true,
    rating: 4.8,
    reviewCount: 142,
    warranty: '1 Year HP India Onsite Warranty',
    exchangeBonus: 8000,
    emiStartingAt: 6250,
    specs: {
      Display: '15.6-inch FHD (1920x1080) 144Hz 9ms IPS Micro-Edge',
      Processor: '13th Gen Intel Core i7-13620H Processor',
      Graphics: 'NVIDIA GeForce RTX 4060 8GB GDDR6 Dedicated',
      Memory: '16GB DDR4 RAM, 512GB PCIe Gen4 NVMe TLC M.2 SSD',
    },
  },
  {
    id: 'prod_acer_aspire_3',
    name: 'Acer Aspire 3 A325-53 13th Gen Intel Laptop ( Silver, 8GB-512GB )',
    brand: 'Acer',
    category: 'tablets',
    price: 48990,
    mrp: 99999,
    stock: 15,
    description:
      'Slim and featherlight Acer Aspire 3 A325-53 powered by 13th Gen Intel Core processor, Windows 11 Home, MS Office Home & Student, Full HD ComfyView display, and Wi-Fi 6.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Acer-aspire-3-a325-53-13th-gen-intel-core-i3-1305u-windows-11-home-laptop-un-34ysi-01x-silver-8gb-500gb-Front-View-view.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Acer-aspire-3-a325-53-13th-gen-intel-core-i3-1305u-windows-11-home-laptop-un-34ysi-01x-silver-8gb-500gb-Front-View-view.webp',
        'https://img-prd-pim.poorvika.com/product/Acer-aspire-3-a325-53-13th-gen-intel-core-i5-1334u-un-34ysi-01t-windows-11-home-laptop-silver-8gb-512gb-Front-View.webp',
      ],
      'Acer Aspire 3 A325-53',
      'Acer',
      'tablets',
      '#94A3B8',
      '#334155'
    ),
    colors: [{ name: 'Silver', hex: '#94A3B8' }],
    ramOptions: ['8GB', '16GB'],
    storageOptions: ['512GB'],
    os: 'Accessory',
    is5G: false,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    rating: 4.7,
    reviewCount: 198,
    warranty: '1 Year Acer India Official Warranty',
    exchangeBonus: 4000,
    emiStartingAt: 2041,
    specs: {
      Display: '15.6-inch Full HD (1920x1080) Acer ComfyView LED',
      Processor: 'Intel Core 13th Gen Turbo Boost Processor',
      Storage: '512GB PCIe Gen4 NVMe SSD + 8GB Dual-Channel RAM',
      OS: 'Windows 11 Home 64-bit',
    },
  },
  {
    id: 'prod_apple_ipad_air_m4',
    name: 'Apple iPad Air With Apple M4 Chip 11 Inch, WiFi ( Purple, 256GB )',
    brand: 'Apple',
    category: 'tablets',
    price: 94900,
    mrp: 101900,
    stock: 9,
    description:
      'Supercharged by the Apple M4 chip. Features a stunning 11-inch Liquid Retina display with P3 wide color, Landscape 12MP Center Stage camera, and Apple Pencil Pro support.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Apple-ipad-air-with-apple-m4-chip-11-inch-wifi-purple-256gb-Front-Back-View.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Apple-ipad-air-with-apple-m4-chip-11-inch-wifi-purple-256gb-Front-Back-View.webp',
        'https://img-prd-pim.poorvika.com/product/Apple-ipad-air-with-apple-m4-chip-11-inch-wifi-starlight-256gb-Front-Back-View.webp',
      ],
      'iPad Air M4 11"',
      'Apple',
      'tablets',
      '#A855F7',
      '#3B82F6'
    ),
    colors: [
      { name: 'Purple', hex: '#A855F7' },
      { name: 'Starlight', hex: '#E5E7EB' },
    ],
    ramOptions: ['8GB'],
    storageOptions: ['128GB', '256GB', '512GB'],
    os: 'iPadOS',
    is5G: false,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    isFlagship: true,
    rating: 4.9,
    reviewCount: 112,
    warranty: '1 Year Apple India Official Warranty',
    exchangeBonus: 5000,
    emiStartingAt: 3954,
    specs: {
      Display: '11-inch Liquid Retina Display with True Tone',
      Processor: 'Apple M4 Chip with 16-Core Neural Engine',
      Camera: '12MP Wide Rear + 12MP Landscape Center Stage Front',
    },
  },

  // === TV & AUDIO + GAMING CONSOLES (EXACTLY AS IN VIDEO 00:07, 00:18, 00:28-00:55) ===
  {
    id: 'prod_samsung_neo_qled_75',
    name: 'Samsung 4K Ultra HD Neo QLED Smart TV ( 75 inch )',
    brand: 'Samsung',
    category: 'tv-audio',
    price: 192990,
    mrp: 219900,
    stock: 6,
    description:
      'Samsung 75-inch 4K Ultra HD Neo QLED Smart TV QA75QN80HAUXXL with NQ4 AI Gen2 Processor, Quantum Matrix Technology, Dolby Atmos, Motion Xcelerator 120Hz, and Tizen OS.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Samsung-4K-Ultra-HD-Neo-QLED-Smart-TV-QA75QN80HAUXXL-75-inch-front-view.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Samsung-4K-Ultra-HD-Neo-QLED-Smart-TV-QA75QN80HAUXXL-75-inch-front-view.webp',
        'https://img-prd-pim.poorvika.com/product/Samsung-4K-Ultra-HD-Micro-RGB-Smart-TV-2026-R85H-MRA55R85HAULXL-55-inch-front-view.webp',
      ],
      'Samsung 75" Neo QLED TV',
      'Samsung',
      'tv-audio',
      '#0284C7',
      '#0F172A'
    ),
    colors: [{ name: '75 inch', hex: '#0F172A' }],
    ramOptions: ['Standard'],
    storageOptions: ['75 inch'],
    os: 'Accessory',
    is5G: false,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    isFlagship: true,
    rating: 4.9,
    reviewCount: 84,
    warranty: '2 Years Samsung India Comprehensive Warranty',
    exchangeBonus: 10000,
    emiStartingAt: 8041,
    specs: {
      Display: '75-inch 4K Ultra HD (3840x2160) Neo QLED Quantum Matrix',
      Processor: 'NQ4 AI Gen2 4K Upscaling Processor',
      Audio: 'Dolby Atmos Object Tracking Sound (OTS Lite)',
      SmartTV: 'Samsung Tizen OS with Built-in IoT SmartThings Hub',
    },
  },
  {
    id: 'prod_lg_qned_55',
    name: 'LG QNED AI 4K Ultra HD MiniLED Smart TV ( 55 inch )',
    brand: 'LG',
    category: 'tv-audio',
    price: 60990,
    mrp: 95990,
    stock: 11,
    description:
      'LG QNED AI 4K Ultra HD MiniLED Smart TV 55QNED70BLA with Alpha 8 AI Processor 4K, Quantum Dot NanoCell color technology, Precision Dimming, Filmmaker Mode, and webOS 25.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/LG-qned-ai-4k-ultra-hd-miniled-smart-tv-qned70-2026-55qned70bla-55-inch-Front-View.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/LG-qned-ai-4k-ultra-hd-miniled-smart-tv-qned70-2026-55qned70bla-55-inch-Front-View.webp',
      ],
      'LG 55" QNED AI 4K TV',
      'LG',
      'tv-audio',
      '#E11D48',
      '#0F172A'
    ),
    colors: [{ name: '55 inch', hex: '#0F172A' }],
    ramOptions: ['Standard'],
    storageOptions: ['55 inch', '43 inch'],
    os: 'Accessory',
    is5G: false,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    rating: 4.8,
    reviewCount: 152,
    warranty: '1 Year LG India Official Warranty',
    exchangeBonus: 5000,
    emiStartingAt: 2541,
    specs: {
      Display: '55-inch 4K Ultra HD QNED Quantum Dot NanoCell Display',
      Processor: 'Alpha 8 AI Processor 4K with AI Super Upscaling',
      Audio: 'AI Sound Pro (Virtual 9.1.2 Up-mix) & Dolby Digital',
      SmartTV: 'webOS with Magic Remote Included',
    },
  },
  {
    id: 'prod_sony_ps5_digital',
    name: 'Sony PlayStation 5 Slim Digital E Chassi ( White )',
    brand: 'Sony',
    category: 'entertainment',
    price: 64990,
    mrp: 64990,
    stock: 9,
    description:
      'Play Like Never Before with the Sony PlayStation 5 Slim Digital Edition (CFI-2116B01Y). Experience lightning-fast loading with an ultra-high-speed 1TB SSD, haptic feedback, adaptive triggers, and 3D Audio.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Sony-playstation-5-slim-digital-e-chassi-cfi-2116b01y-white-Full-View.webp',
    gallery: [
      'https://img-prd-pim.poorvika.com/product/Sony-playstation-5-slim-digital-e-chassi-cfi-2116b01y-white-Full-View.webp',
      'https://img-prd-pim.poorvika.com/product/Sony-playstation-5-slim-standard-e-chassi-cfi-2216a01y-white-Full-View.webp',
    ],
    colors: [{ name: 'White', hex: '#F8FAFC' }],
    ramOptions: ['16GB GDDR6'],
    storageOptions: ['1TB SSD'],
    os: 'Accessory',
    is5G: false,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    isFlagship: true,
    rating: 4.9,
    reviewCount: 320,
    warranty: '1 Year Sony India Official Warranty',
    exchangeBonus: 0,
    emiStartingAt: 2708,
    specs: {
      Storage: '1TB Custom Ultra-High-Speed NVMe SSD',
      VideoOutput: '4K 120Hz TV Support, VRR (HDMI 2.1), Ray Tracing',
      Controller: 'DualSense Wireless Controller Included in Box',
      Audio: 'Tempest 3D AudioTech Engine',
    },
  },
  {
    id: 'prod_sony_ps5_standard',
    name: 'Sony PlayStation 5 Slim Standard Disc Edition ( White )',
    brand: 'Sony',
    category: 'entertainment',
    price: 69990,
    mrp: 69990,
    stock: 7,
    description:
      'Sony PlayStation 5 Slim Standard Disc Edition (CFI-2116A01Y) with Ultra HD Blu-ray Disc Drive, 1TB custom SSD, Ray Tracing, 4K 120fps gaming, and DualSense Wireless Controller.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Sony-playstation-5-slim-standard-e-chassi-cfi-2216a01y-white-Full-View.webp',
    gallery: [
      'https://img-prd-pim.poorvika.com/product/Sony-playstation-5-slim-standard-e-chassi-cfi-2216a01y-white-Full-View.webp',
      'https://img-prd-pim.poorvika.com/product/Sony-playstation-5-slim-digital-e-chassi-cfi-2116b01y-white-Full-View.webp',
    ],
    colors: [{ name: 'White', hex: '#F8FAFC' }],
    ramOptions: ['16GB GDDR6'],
    storageOptions: ['1TB SSD'],
    os: 'Accessory',
    is5G: false,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    isFlagship: true,
    rating: 4.9,
    reviewCount: 285,
    warranty: '1 Year Sony India Official Warranty',
    exchangeBonus: 0,
    emiStartingAt: 2916,
    specs: {
      DiscDrive: 'Ultra HD Blu-ray Disc Drive Included',
      Storage: '1TB Custom High-Speed SSD',
      Controller: 'DualSense Haptic Feedback Controller',
    },
  },
  {
    id: 'prod_asus_rog_xbox_ally',
    name: 'Asus ROG Xbox Ally Handheld Gaming Console ( Gardenia White )',
    brand: 'Asus',
    category: 'entertainment',
    price: 58490,
    mrp: 83990,
    stock: 10,
    description:
      'Asus ROG Ally RC73YA Handheld Gaming Console with AMD Ryzen Z1 Extreme processor, 7-inch 120Hz FHD FreeSync Premium touchscreen, ROG Zero Gravity thermal system, and Windows 11.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Asus-rog-xbox-ally-handheld-gaming-console-rc73ya-nh010w-gardenia-white-Front-View.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Asus-rog-xbox-ally-handheld-gaming-console-rc73ya-nh010w-gardenia-white-Front-View.webp',
      ],
      'Asus ROG Ally Handheld',
      'Asus',
      'entertainment',
      '#F8FAFC',
      '#18181B'
    ),
    colors: [{ name: 'Gardenia White', hex: '#F8FAFC' }],
    ramOptions: ['16GB LPDDR5'],
    storageOptions: ['512GB SSD'],
    os: 'Accessory',
    is5G: false,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    rating: 4.8,
    reviewCount: 94,
    warranty: '1 Year Asus India Official Warranty',
    exchangeBonus: 0,
    emiStartingAt: 2437,
    specs: {
      Display: '7-inch FHD (1920x1080) 120Hz 500nits Gorilla Glass Victus Touch',
      Processor: 'AMD Ryzen Z1 Extreme 8-Core / 16-Thread',
      Audio: 'Dual Front-Firing Smart Amp Speakers with Dolby Atmos',
    },
  },
  {
    id: 'prod_sony_ps_vr2_controller',
    name: 'Sony PlayStation VR 2 Controller ( White )',
    brand: 'Sony',
    category: 'entertainment',
    price: 44999,
    mrp: 44999,
    stock: 4,
    description:
      'Sony PlayStation VR2 headset and Sense controller system with 4K HDR OLED displays (2000x2040 per eye), 110-degree field of view, eye tracking, headset feedback, and finger touch detection.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Sony-playstation-5-wireless-type-c-vr-2-controller-white-Box-View.png',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Sony-playstation-5-wireless-type-c-vr-2-controller-white-Box-View.png',
      ],
      'Sony PlayStation VR2',
      'Sony',
      'entertainment',
      '#F8FAFC',
      '#2563EB'
    ),
    colors: [{ name: 'White', hex: '#F8FAFC' }],
    ramOptions: ['Standard'],
    storageOptions: ['Product Code: 50317'],
    os: 'Accessory',
    is5G: false,
    isBestSeller: false,
    isFeatured: true,
    isNewRelease: true,
    rating: 4.8,
    reviewCount: 68,
    warranty: '1 Year Sony India Official Warranty',
    exchangeBonus: 0,
    emiStartingAt: 1875,
    specs: {
      Display: 'Dual 2000x2040 OLED 4K HDR at up to 120fps',
      Sensors: '6-Axis Motion Sensing + 4 IR Cameras for Eye Tracking',
      Controllers: 'PlayStation VR2 Sense Controllers with Haptic Feedback',
    },
  },

  // === KITCHEN APPLIANCES (EXACTLY AS IN VIDEO 00:19 & 01:37) ===
  {
    id: 'prod_haier_air_fryer',
    name: 'Haier HAF-D503B 1500W Air Fryer ( Black, 5L )',
    brand: 'Haier',
    category: 'kitchen-appliances',
    price: 6299,
    mrp: 12990,
    stock: 25,
    description:
      'Haier HAF-D503B 1500W 5-Litre Digital Air Fryer with 360-degree Rapid Hot Air Circulation, up to 90% less oil cooking, 8 preset touch menus, and non-stick dishwasher-safe basket.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Haier-haf-d503b-1500w-air-fryer-black-5l-Front-View-Image.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Haier-haf-d503b-1500w-air-fryer-black-5l-Front-View-Image.webp',
      ],
      'Haier 1500W 5L Air Fryer',
      'Haier',
      'kitchen-appliances',
      '#18181B',
      '#F59E0B'
    ),
    colors: [{ name: 'Black, 5L', hex: '#18181B' }],
    ramOptions: ['Standard'],
    storageOptions: ['5L'],
    os: 'Accessory',
    is5G: false,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    rating: 4.8,
    reviewCount: 214,
    warranty: '2 Years Haier Comprehensive Warranty',
    exchangeBonus: 0,
    emiStartingAt: 349,
    specs: {
      Capacity: '5 Litres Family Size Pan',
      Power: '1500W High-Efficiency Heating Element',
      Temperature: '80°C to 200°C Digital Touch Control',
    },
  },
  {
    id: 'prod_preethi_chimney_alcor',
    name: 'Preethi Chimney Alcor With Aluminium Duct ( 210 Plus )',
    brand: 'Preethi',
    category: 'kitchen-appliances',
    price: 23045,
    mrp: 31829,
    stock: 12,
    description:
      'Preethi Alcor 60cm Filterless Auto-Clean Kitchen Chimney with Gesture Motion Control, 1200 m³/hr suction power, metallic oil collector tray, and dual LED lamps.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Preethi-chimney-alcor-with-aluminium-duct-kh317-black-Front-View.png',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Preethi-chimney-alcor-with-aluminium-duct-kh317-black-Front-View.png',
        'https://img-prd-pim.poorvika.com/product/Preethi-chimney-alcor-with-aluminium-duct-kh-311-black-Front-Left-View.png',
      ],
      'Preethi Chimney Alcor',
      'Preethi',
      'kitchen-appliances',
      '#18181B',
      '#64748B'
    ),
    colors: [{ name: '210 Plus', hex: '#18181B' }],
    ramOptions: ['Standard'],
    storageOptions: ['210 Plus'],
    os: 'Accessory',
    is5G: false,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: false,
    rating: 4.7,
    reviewCount: 89,
    warranty: '1 Year Comprehensive + 5 Years Motor Warranty',
    exchangeBonus: 0,
    emiStartingAt: 960,
    specs: {
      Suction: '1200 m³/hr Heavy-Duty Suction',
      Control: 'Touch + Wave Motion Sensor Control',
      Technology: 'Thermal Auto-Clean with Oil Collector',
    },
  },

  // === HOME APPLIANCES (EXACTLY AS IN VIDEO 00:20) ===
  {
    id: 'prod_lg_8kg_washing_machine',
    name: 'LG 8.0Kg Fully Automatic Washing Machine ( Middle Black )',
    brand: 'LG',
    category: 'home-appliances',
    price: 20990,
    mrp: 24990,
    stock: 14,
    description:
      'LG 8.0Kg 5-Star Fully Automatic Washing Machine with Smart Inverter Technology, TurboDrum, Steam Hygiene Wash, Auto Pre-Wash, and Smart Diagnosis.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Lg-8-0kg-fully-automatic-front-load-washing-machine-inverter-direct-drive-fhb1208z2m-middle-black-Front-View.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Lg-8-0kg-fully-automatic-front-load-washing-machine-inverter-direct-drive-fhb1208z2m-middle-black-Front-View.webp',
      ],
      'LG 8.0Kg Washing Machine',
      'LG',
      'home-appliances',
      '#18181B',
      '#64748B'
    ),
    colors: [{ name: 'Middle Black', hex: '#18181B' }],
    ramOptions: ['Standard'],
    storageOptions: ['8.0Kg'],
    os: 'Accessory',
    is5G: false,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    rating: 4.8,
    reviewCount: 245,
    warranty: '2 Years Product + 10 Years Motor Warranty',
    exchangeBonus: 2500,
    emiStartingAt: 875,
    specs: {
      Capacity: '8.0 Kg Fully Automatic',
      EnergyRating: '5 Star BEE Energy Efficiency',
      Motor: 'Smart Inverter Direct Drive Motor',
    },
  },
  {
    id: 'prod_daikin_15ton_ac',
    name: 'Daikin 1.5 Ton 5 Star Inverter Split AC ( 1.5 Ton, 5 Star )',
    brand: 'Daikin',
    category: 'home-appliances',
    price: 53350,
    mrp: 65800,
    stock: 18,
    description:
      'Daikin 1.5 Ton 5 Star Inverter Split AC (FTKU50XV16MKB 2026) with Dew Clean Technology, PM 2.5 Filter, Triple Display, 3D Coanda Airflow, and 100% Copper Condenser.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Daikin-1.5-Ton-5-Star-Inverter-Split-AC-FTKU50XV16MKB-2026-1.5-Ton-5-Star-front-view.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Daikin-1.5-Ton-5-Star-Inverter-Split-AC-FTKU50XV16MKB-2026-1.5-Ton-5-Star-front-view.webp',
      ],
      'Daikin 1.5 Ton 5 Star AC',
      'Daikin',
      'home-appliances',
      '#F8FAFC',
      '#0284C7'
    ),
    colors: [{ name: '1.5 Ton, 5 Star', hex: '#F8FAFC' }],
    ramOptions: ['Standard'],
    storageOptions: ['1.5 Ton, 5 Star'],
    os: 'Accessory',
    is5G: false,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    rating: 4.9,
    reviewCount: 312,
    warranty: '1 Year Product + 5 Years PCB + 10 Years Compressor',
    exchangeBonus: 4000,
    emiStartingAt: 2223,
    specs: {
      Capacity: '1.5 Ton 5 Star Neo Swing Inverter Compressor',
      Condenser: '100% Copper Coil with Anti-Corrosion Treatment',
      AirPurification: 'PM 2.5 Filter + Dew Clean Auto-Clean',
    },
  },

  // === SMART TECHNOLOGY / WEARABLES (EXACTLY AS IN VIDEO 01:38 – 01:39) ===
  {
    id: 'prod_apple_watch_series_12',
    name: 'Apple Watch Series 12 GPS + Cellular ( Dark Bronze, 42 mm )',
    brand: 'Apple',
    category: 'smartwatches',
    price: 56900,
    mrp: 56900,
    stock: 14,
    description:
      'Apple Watch Series 12 with Wide-Angle Always-On Retina OLED display, S11 SiP chip with Double Tap gesture, ECG & Blood Oxygen apps, Sleep Apnea notifications, and 50m water resistance.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Apple-Watch-Series-12-GPS-Cellular-Ceramic-Case-with-Navy-Blue-Sport-Band-SM-Night-Blue-42-mm-side-view-view-v.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Apple-Watch-Series-12-GPS-Cellular-Ceramic-Case-with-Navy-Blue-Sport-Band-SM-Night-Blue-42-mm-side-view-view-v.webp',
        'https://img-prd-pim.poorvika.com/product/Apple-Watch-Series-12-GPS-Cellular-Ceramic-Case-with-Navy-Blue-Sport-Band-SM-Night-Blue-42-mm-side-view-view.webp',
      ],
      'Apple Watch Series 12',
      'Apple',
      'smartwatches',
      '#78350F',
      '#1E3A8A'
    ),
    colors: [
      { name: 'Dark Bronze, 42 mm', hex: '#78350F' },
      { name: 'Night Blue, 46 mm', hex: '#1E3A8A' },
    ],
    ramOptions: ['Standard'],
    storageOptions: ['42 mm', '46 mm'],
    os: 'WearOS',
    is5G: false,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    isFlagship: true,
    rating: 4.9,
    reviewCount: 184,
    warranty: '1 Year Apple India Official Warranty',
    exchangeBonus: 0,
    emiStartingAt: 2370,
    specs: {
      Display: 'Wide-Angle Always-On LTPO3 OLED Retina Display, 2000 nits',
      Health: 'ECG App, Blood Oxygen, Vitals App, Wrist Temperature',
      Durability: '50m Water Resistant & IP6X Dust Resistant',
    },
  },
  {
    id: 'prod_hapipola_aura_watch',
    name: 'Hapipola Aura Smartwatch ( Black )',
    brand: 'HapiPola',
    category: 'smartwatches',
    price: 1699,
    mrp: 6999,
    stock: 42,
    description:
      'Hapipola Aura Bluetooth Calling Smartwatch with 3D Curved AMOLED Display, Functional Crown, AI Voice Assistant, 100+ Sports Modes, SpO2 & Heart Rate monitoring.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Hapipola-aura-smartwatch-black-Front-Right-View.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Hapipola-aura-smartwatch-black-Front-Right-View.webp',
        'https://img-prd-pim.poorvika.com/product/Boat-Wave-Sigma-3-Curv-Smartwatch-Active-Black-front-view.webp',
      ],
      'Hapipola Aura Smartwatch',
      'HapiPola',
      'smartwatches',
      '#18181B',
      '#2563EB'
    ),
    colors: [{ name: 'Black', hex: '#18181B' }],
    ramOptions: ['Standard'],
    storageOptions: ['Standard'],
    os: 'WearOS',
    is5G: false,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    rating: 4.6,
    reviewCount: 310,
    warranty: '1 Year Manufacturer Warranty',
    exchangeBonus: 0,
    emiStartingAt: 199,
    specs: {
      Display: '1.96-inch Curved HD Display with Always-On Dial',
      Calling: 'Single-Chip Bluetooth v5.3 Calling with Built-in Mic & Speaker',
      Health: '24x7 Heart Rate, SpO2, Sleep Tracker, IP68 Waterproof',
    },
  },

  // === PERSONAL CARE (EXACTLY AS IN VIDEO 01:40) ===
  {
    id: 'prod_dyson_airwrap_id',
    name: 'Dyson Airwrap iD Multi-styler HS08 ( Vinca Blue / Topaz Orange )',
    brand: 'Dyson',
    category: 'personal-care',
    price: 45900,
    mrp: 49900,
    stock: 8,
    description:
      'Dyson Airwrap iD Multi-styler and Dryer with Bluetooth wireless technology to connect to the MyDyson app for personalized i.d. curl sequences using Coanda airflow and no extreme heat.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Dyson-airwrap-id-hs08-hair-straightener-prussian-blue-copper-Front-View.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Dyson-airwrap-id-hs08-hair-straightener-prussian-blue-copper-Front-View.webp',
        'https://img-prd-pim.poorvika.com/product/Dyson-Airwrap-ID-Multi-styler-HS08-Ceramic-Pink-Rose-Gold-back-view-front-bottom-view.webp',
      ],
      'Dyson Airwrap iD Multi-styler',
      'Dyson',
      'personal-care',
      '#1D4ED8',
      '#EA580C'
    ),
    colors: [
      { name: 'Vinca Blue / Topaz Orange', hex: '#1D4ED8' },
      { name: 'Ceramic Pink / Rose Gold', hex: '#F472B6' },
    ],
    ramOptions: ['Standard'],
    storageOptions: ['6 Attachments'],
    os: 'Accessory',
    is5G: false,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    isFlagship: true,
    rating: 4.9,
    reviewCount: 165,
    warranty: '2 Years Dyson India Official Warranty',
    exchangeBonus: 0,
    emiStartingAt: 1912,
    specs: {
      Motor: 'Dyson Digital Motor V9 spinning at up to 110,000rpm',
      Technology: 'Bluetooth Enabled i.d. Curl + Enhanced Coanda Airflow',
      HeatControl: 'Intelligent Heat Control measures airflow 40 times/sec',
    },
  },
  {
    id: 'prod_philips_bhh730_brush',
    name: 'Philips BHH730/60 Heated Straightening Brush ( Black )',
    brand: 'Philips',
    category: 'personal-care',
    price: 3299,
    mrp: 3695,
    stock: 30,
    description:
      'Philips Heated Straightening Brush with Keratin-infused ceramic coating, ThermoProtect technology, triple bristle design, and 2 temperature settings (170°C & 200°C) for naturally straight hair in 5 minutes.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Philips-BHH73000-Heated-Straightening-Brush-0.png',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Philips-BHH73000-Heated-Straightening-Brush-0.png',
      ],
      'Philips BHH730/60 Brush',
      'Philips',
      'personal-care',
      '#18181B',
      '#EC4899'
    ),
    colors: [{ name: 'Black', hex: '#18181B' }],
    ramOptions: ['Standard'],
    storageOptions: ['Standard'],
    os: 'Accessory',
    is5G: false,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: false,
    rating: 4.7,
    reviewCount: 412,
    warranty: '2 Years Philips India Worldwide Guarantee',
    exchangeBonus: 0,
    emiStartingAt: 199,
    specs: {
      Coating: 'Tourmaline Ceramic with Keratin Infusion',
      Technology: 'ThermoProtect Constant Temperature Prevention',
      HeatUpTime: 'Ready to use in 50 Seconds',
    },
  },

  // === AUDIO, CHARGERS, POWER BANKS & MOBILE ACCESSORIES ===
  {
    id: 'prod_apple_airpods_pro_3',
    name: 'Apple AirPods Pro 3rd Gen With MagSafe USB-C Case ( White )',
    brand: 'Apple',
    category: 'earbuds',
    price: 23900,
    mrp: 25900,
    stock: 25,
    description:
      'Up to 2x more Active Noise Cancellation, Adaptive Audio, Personalized Spatial Audio, and IP54 dust/sweat/water resistant MagSafe USB-C case.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Apple-airpods-pro-3rd-gen-with-magsafe-usb-c-charging-case-white-Front-View.png',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Apple-airpods-pro-3rd-gen-with-magsafe-usb-c-charging-case-white-Front-View.png',
      ],
      'AirPods Pro 3rd Gen',
      'Apple',
      'earbuds',
      '#F8FAFC',
      '#2563EB'
    ),
    colors: [{ name: 'White', hex: '#F8FAFC' }],
    ramOptions: ['Standard'],
    storageOptions: ['Standard'],
    os: 'Accessory',
    is5G: false,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    rating: 4.9,
    reviewCount: 412,
    warranty: '1 Year Apple India Official Warranty',
    exchangeBonus: 0,
    emiStartingAt: 996,
    specs: {
      AudioChip: 'Apple H2 Headphone Chip',
      NoiseControl: 'Pro-Level Active Noise Cancellation & Transparency',
      Battery: 'Up to 30 Hours with MagSafe USB-C Case',
    },
  },
  {
    id: 'prod_apple_20w_adapter',
    name: 'Apple USB-C Power Adapter 20W 2025, MUVR3HN/A ( White )',
    brand: 'Apple',
    category: 'chargers',
    price: 1889,
    mrp: 2190,
    stock: 60,
    description:
      'Original Apple 20W USB-C Power Adapter offers fast, efficient charging at home, in the office, or on the go.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Apple-usb-c-power-adapter-20w-2025-muvr3hn-a-white-Full-View.png',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Apple-usb-c-power-adapter-20w-2025-muvr3hn-a-white-Full-View.png',
      ],
      'Apple 20W USB-C Adapter',
      'Apple',
      'chargers',
      '#F8FAFC',
      '#94A3B8'
    ),
    colors: [{ name: 'White', hex: '#F8FAFC' }],
    ramOptions: ['Standard'],
    storageOptions: ['Standard'],
    os: 'Accessory',
    is5G: false,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: false,
    rating: 4.9,
    reviewCount: 820,
    warranty: '1 Year Apple India Official Warranty',
    exchangeBonus: 0,
    emiStartingAt: 199,
    specs: {
      Output: '20W USB-C Power Delivery (PD 3.0)',
      Compatibility: 'iPhone 8 to iPhone 17 Pro Max, iPad Pro/Air, AirPods',
    },
  },
  {
    id: 'prod_xiaomi_powerbank_20000',
    name: 'Xiaomi Power Bank 20000 165W ( Space Grey )',
    brand: 'Xiaomi',
    category: 'power-banks',
    price: 5499,
    mrp: 10999,
    stock: 22,
    description:
      'High-output 20000mAh power bank with 165W Max dual-port fast charging, built-in braided USB-C cable, and smart color digital display.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Xiaomi-power-bank-20000-165w-space-grey-Front-View.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Xiaomi-power-bank-20000-165w-space-grey-Front-View.webp',
      ],
      'Xiaomi 20000mAh 165W',
      'Xiaomi',
      'power-banks',
      '#475569',
      '#18181B'
    ),
    colors: [{ name: 'Space Grey', hex: '#475569' }],
    ramOptions: ['Standard'],
    storageOptions: ['20000mAh'],
    os: 'Accessory',
    is5G: false,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    rating: 4.8,
    reviewCount: 164,
    warranty: '1 Year Xiaomi India Warranty',
    exchangeBonus: 0,
    emiStartingAt: 299,
    specs: {
      Capacity: '20000mAh High-Density Lithium-Ion',
      MaxOutput: '165W Combined Fast Charge',
    },
  },
  {
    id: 'prod_privacy_tempered_glass',
    name: 'Privacy Tempered Glass For Apple iPhone 17 Pro Max ( Black )',
    brand: 'Cool-Touch',
    category: 'mobile-accessories',
    price: 1299,
    mrp: 2499,
    stock: 80,
    description:
      '9H Hardness 28-Degree Anti-Spy Privacy Tempered Glass with Auto-Dust Alignment Frame and Oleophobic Coating.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Privacy-tempered-glass-for-apple-iphone-17-pro-max-black-Front-View.png',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Privacy-tempered-glass-for-apple-iphone-17-pro-max-black-Front-View.png',
      ],
      '9H Privacy Tempered Glass',
      'Cool-Touch',
      'mobile-accessories',
      '#18181B',
      '#3B82F6'
    ),
    colors: [{ name: 'Black', hex: '#18181B' }],
    ramOptions: ['Standard'],
    storageOptions: ['Standard'],
    os: 'Accessory',
    is5G: false,
    isBestSeller: true,
    isFeatured: false,
    isNewRelease: true,
    rating: 4.7,
    reviewCount: 215,
    warranty: 'In-Store Free Installation at Charlie Mobile',
    exchangeBonus: 0,
    emiStartingAt: 199,
    specs: {
      Hardness: '9H Japanese Asahi Tempered Glass',
      Privacy: '28° Two-Way Anti-Peep Privacy Filter',
    },
  },
  {
    id: 'prod_luxury_collector_edition',
    name: 'Signature Gold Collector Gift Edition — Limited Vault',
    brand: 'Charlie Luxury',
    category: 'mobile-accessories',
    price: 970,
    mrp: 1299,
    stock: 0,
    goldTagline: 'BESPOKE / ARTISANAL / LIMITED VAULT',
    bestsellerTab: 'GIFTING',
    description:
      'Limited collector edition gift box crafted in metallic gold finish. Currently sold out — tap Notify Me to reserve the next batch.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Apple-iPhone-17-Pro-Max-Cosmic-Orange-2tB-front-back-view.png',
    gallery: [
      'https://img-prd-pim.poorvika.com/product/Apple-iPhone-17-Pro-Max-Cosmic-Orange-2tB-front-back-view.png',
    ],
    colors: [{ name: 'Royal Gold', hex: '#B5893D' }],
    ramOptions: ['Standard'],
    storageOptions: ['Collector Box'],
    os: 'Accessory',
    is5G: false,
    isBestSeller: false,
    isFeatured: true,
    isNewRelease: true,
    rating: 4.9,
    reviewCount: 64,
    warranty: '1 Year Official Warranty',
    exchangeBonus: 0,
    emiStartingAt: 199,
    specs: {
      Edition: 'Limited Royal Gold Gift Box',
      Packaging: 'Signature Embossed Presentation Case',
    },
  },
];

// Exact Hero Carousel Slides shown in the Video (00:31 - 00:35)
export const INITIAL_BANNERS: HeroBanner[] = [
  {
    id: 'banner_too_cool_ordinary',
    title: 'Too Cool For ORDINARY',
    subtitle: 'Signature Flagship Collection · Crafted for those who command presence',
    tag: 'ROYAL EDITION',
    ctaText: 'SHOP NOW',
    ctaLink: '/products',
    secondaryCtaText: 'EXPLORE GIFTING',
    secondaryCtaLink: '/offers',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/vivo-v80-zeiss-portrait-so-pro-Available-now-M.webp',
    mediaType: 'image',
    order: 1,
    accentColor: '#B5893D',
    enabled: true,
  },
  {
    id: 'banner_oppo_find_x10',
    title: 'Artistry Meets Flagship Precision',
    subtitle: '200MP Hasselblad Master Edition · Exclusive Royal Privileges & Instant Exchange',
    tag: 'SIGNATURE SERIES',
    ctaText: 'SHOP NOW',
    ctaLink: '/product/prod_oppo_find_x10_pro_max',
    secondaryCtaText: 'Explore Collection',
    secondaryCtaLink: '/products?category=oppo',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/Oppo-Find-X10-Series-Pre-Book-Now-M.webp',
    mediaType: 'image',
    order: 2,
    accentColor: '#B5893D',
    enabled: true,
  },
  {
    id: 'banner_iphone_duo',
    title: 'The Titanium Reserve Collection',
    subtitle: 'Experience iPhone 17 Pro Max & Signature Accessories with Bespoke Concierge Delivery',
    tag: 'LUXURY RESERVE',
    ctaText: 'SHOP NOW',
    ctaLink: '/products?category=iphone',
    secondaryCtaText: 'Explore Offers',
    secondaryCtaLink: '/offers',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/pre-book-apple-iphone-duo-in-poorvika-mobv-1.webp',
    mediaType: 'image',
    order: 3,
    accentColor: '#B5893D',
    enabled: true,
  },
];

// Auto-playing Vertical 9:16 Video Reels ("LOVED BY CELEBRITIES" — 00:00 - 00:11)
export const INITIAL_CELEBRITY_REELS: CelebrityReelItem[] = [
  {
    id: 'reel_1',
    title: 'iPhone 17 Pro Max Cosmic Titanium — Royal Unboxing',
    celebrityName: 'Aarav Khanna · Style Icon',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-taking-pictures-with-her-smartphone-41871-large.mp4',
    posterUrl:
      'https://img-prd-pim.poorvika.com/product/Apple-iPhone-17-Pro-Max-Cosmic-Orange-2tB-front-back-view.png',
    linkedProductId: 'prod_iphone_17_pro_max',
    enabled: true,
    order: 1,
  },
  {
    id: 'reel_2',
    title: 'Vivo V80 5G ZEISS Portrait — Red Carpet Favourite',
    celebrityName: 'Kabir & Mira · Celebrity Couple',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-modern-smartphone-42619-large.mp4',
    posterUrl:
      'https://img-prd-pim.poorvika.com/product/Vivo-V80-5G-Horizon-Blue-8GB-512GB-front-back-view.webp',
    linkedProductId: 'prod_vivo_v80_5g',
    enabled: true,
    order: 2,
  },
  {
    id: 'reel_3',
    title: 'Samsung Galaxy S26 Ultra Titanium — Executive Choice',
    celebrityName: 'Vikramaditya Roy · Entrepreneur',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-using-his-smartphone-42621-large.mp4',
    posterUrl:
      'https://img-prd-pim.poorvika.com/product/Samsung-galaxy-s26-ultra-5g-cobalt-violet-16gb-1Tb-Front-Back-View.webp',
    linkedProductId: 'prod_samsung_s26_ultra',
    enabled: true,
    order: 3,
  },
  {
    id: 'reel_4',
    title: 'Oppo Find X10 Pro Max — Studio Signature Look',
    celebrityName: 'Rohan Mehra · Fashion Director',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-listening-to-music-with-wireless-earphones-41566-large.mp4',
    posterUrl:
      'https://img-prd-pim.poorvika.com/product/Oppo-find-x10-pro-max-5g-titanium-grey-12gb-512gb-Front-Back-View.webp',
    linkedProductId: 'prod_oppo_find_x10_pro_max',
    enabled: true,
    order: 4,
  },
  {
    id: 'reel_5',
    title: 'Realme Narzo 100 Lite 5G — Everyday Luxury Performance',
    celebrityName: 'Zoya Siddiqui · Creator',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-taking-a-selfie-with-her-phone-39873-large.mp4',
    posterUrl:
      'https://img-prd-pim.poorvika.com/product/Realme-Narzo-100-Lite-5G-Thunder-Black-6GB-128GB-front-view.webp',
    linkedProductId: 'prod_realme_narzo_100_lite',
    enabled: true,
    order: 5,
  },
];

// "SHOP BY NOTES / HIGHLIGHTS" (00:12 - 00:13 in Video)
export const INITIAL_SHOP_BY_NOTES: VisualCardItem[] = [
  {
    id: 'note_titanium',
    title: 'Titanium Craft',
    subtitle: 'Deep, Opulent, Timeless',
    image:
      'https://img-prd-pim.poorvika.com/product/Apple-iPhone-17-Pro-Max-Cosmic-Orange-2tB-front-back-view.png',
    link: '/products?category=iphone',
  },
  {
    id: 'note_zeiss',
    title: 'Cinema Optics',
    subtitle: 'Elegant, Soft, Romantic',
    image:
      'https://img-prd-pim.poorvika.com/product/Vivo-V80-5G-Horizon-Blue-8GB-512GB-front-back-view.webp',
    link: '/products?category=vivo',
  },
  {
    id: 'note_ultra_speed',
    title: 'Hyper 5G Core',
    subtitle: 'Zesty, Vibrant, Playful',
    image:
      'https://img-prd-pim.poorvika.com/product/Samsung-galaxy-s26-ultra-5g-cobalt-violet-16gb-1Tb-Front-Back-View.webp',
    link: '/products?category=samsung',
  },
  {
    id: 'note_acoustic',
    title: 'Pure Acoustics',
    subtitle: 'Delicate, Creamy, Sensual',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/TV-Audio-Home-page-Mob.webp',
    link: '/products?category=tv-audio',
  },
];

// "SHOP BY OCCASIONS" (00:13 - 00:14 in Video)
export const INITIAL_SHOP_BY_OCCASIONS: VisualCardItem[] = [
  {
    id: 'occ_office',
    title: 'Executive Office',
    subtitle: 'Clean, Confident',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/Laptops-tablets-Home-page-Mob.webp',
    link: '/products?category=tablets',
  },
  {
    id: 'occ_date',
    title: 'Evening Gala',
    subtitle: 'Intimate, Unforgettable',
    image:
      'https://img-prd-pim.poorvika.com/product/Apple-iPhone-17-Pro-Max-Cosmic-Orange-2tB-front-back-view.png',
    link: '/products?category=iphone',
  },
  {
    id: 'occ_everyday',
    title: 'Everyday Wear',
    subtitle: 'Light, Refined',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/Smart-Technology-Home-page-Mob.webp',
    link: '/products?category=smartwatches',
  },
  {
    id: 'occ_party',
    title: 'Celebration & Gifting',
    subtitle: 'Confident, Magnetic',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/Mobiles-Accessories-Home-page-Mob.webp',
    link: '/offers',
  },
];

// "FROM OUR LOVED ONES" Testimonials (00:14 - 00:16 in Video)
export const INITIAL_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test_1',
    quote:
      'I like things that feel effortless yet premium, and this hits right in smooth, balanced, and something you can rely on anytime.',
    authorName: 'Ranveer Singh',
    authorRole: 'Actor, Brand Ambassador',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    rating: 5,
  },
  {
    id: 'test_2',
    quote:
      'It is understated yet distinctive, something that complements your presence without overpowering it, which is what truly makes it stand out.',
    authorName: 'Saif Ali Khan',
    authorRole: 'Actor, Luxury Connoisseur',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
    rating: 5,
  },
  {
    id: 'test_3',
    quote:
      'Been using this regularly and honestly, it just feels right, easy, smooth, and something that people actually notice without trying too hard.',
    authorName: 'Munawar Faruqui',
    authorRole: 'Comedian, Entertainer',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    rating: 5,
  },
];

// "BLOGS" Editorial Cards (00:15 - 00:24 in Video)
export const INITIAL_BLOG_POSTS: BlogPostItem[] = [
  {
    id: 'blog_1',
    title: 'How To Choose The Perfect Flagship Companion For Yourself Online',
    excerpt: 'A curated guide to selecting titanium finishes, optics, and luxury editions.',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/pre-book-apple-iphone-duo-in-poorvika-mobv-1.webp',
    ctaText: 'Explore Guide',
    link: '/products?category=iphone',
  },
  {
    id: 'blog_2',
    title: 'How To Style Luxury Wearables Like Royalty: The Complete Guide',
    excerpt: 'Master the art of pairing gold & titanium smartwatches with formal and evening attire.',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/Oppo-Find-X10-Series-Pre-Book-Now-M.webp',
    ctaText: 'Explore Guide',
    link: '/products?category=smartwatches',
  },
  {
    id: 'blog_3',
    title: 'Top 5 Signature Gift Sets For Every Milestone Occasion',
    excerpt: 'Unforgettable luxury unboxing experiences crafted for weddings, anniversaries, and corporate gifting.',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/vivo-v80-zeiss-portrait-so-pro-Available-now-M.webp',
    ctaText: 'Explore Guide',
    link: '/offers',
  },
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'ROYAL500',
    title: '₹500 Exclusive Welcome Reward',
    description: 'Instant privilege discount unlocked via our Royal Rewards Club.',
    discountType: 'flat',
    discountValue: 500,
    minOrderAmount: 1999,
    active: true,
  },
  {
    code: 'CHARLIE1500',
    title: 'Flat ₹1,500 Instant Discount',
    description: 'Valid on all 5G Smartphones above ₹25,000.',
    discountType: 'flat',
    discountValue: 1500,
    minOrderAmount: 25000,
    active: true,
  },
  {
    code: 'FLAGSHIP3000',
    title: '₹3,000 Off Flagship Phones & TVs',
    description:
      'Applicable on iPhone 17/16 Series, Galaxy S26 Ultra, Vivo V80 & Smart TVs.',
    discountType: 'flat',
    discountValue: 3000,
    minOrderAmount: 60000,
    active: true,
  },
  {
    code: 'ACCESSORY10',
    title: '10% Off Genuine Accessories & Audio',
    description:
      'Save 10% (up to ₹1,000) on Chargers, Power Banks, Earbuds & Cases.',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 999,
    maxDiscount: 1000,
    active: true,
  },
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: 'CHARLIE MOBILES',
  businessName: 'CHARLIE MOBILES & ACCESSORIES',
  tagline: 'Royal Luxury Edition · Flagship Smartphones, Gift Sets & Signature Tech',
  logoUrl: '/charlie-logo.png',
  bannerIntervalSeconds: 5,
  festiveStripBannerUrl:
    'https://img-prd-pim.poorvika.com/pageimg/Festive-Deals-Offers-2027-M.webp',
  festiveStripBannerLink: '/offers',
  seasonalDealsTitle: 'DISCOVER Luxury Gifting',
  seasonalDealsSubtitle: 'Premium Collection For Every Occasion.',
  seasonalMainBannerUrl:
    'https://img-prd-pim.poorvika.com/pageimg/pre-book-apple-iphone-duo-in-poorvika-mobv-1.webp',
  megaMenuCards: [
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
  ],
  megaMenuBannerUrl:
    'https://img-prd-pim.poorvika.com/pageimg/vivo-v80-zeiss-portrait-so-pro-Available-now-M.webp',
  megaMenuBannerTitle: 'Too Cool For ORDINARY',
  megaMenuBannerSubtitle: 'Signature Collection',
  megaMenuBannerLink: '/products',
  luxuryGiftingBannerTitle: 'Luxury Gifting',
  luxuryGiftingBannerSubtitle: 'Premium Collection For Every Occasion.',
  luxuryGiftingBannerImage:
    'https://img-prd-pim.poorvika.com/product/Apple-iPhone-17-Pro-Max-Cosmic-Orange-2tB-front-back-view.png',
  luxuryGiftingBannerLink: '/offers',
  brandStoryTitle: 'LET US WALK YOU THROUGH',
  brandStoryVideoUrl:
    'https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-modern-smartphone-42619-large.mp4',
  brandStoryPosterUrl:
    'https://img-prd-pim.poorvika.com/pageimg/pre-book-apple-iphone-duo-in-poorvika-mobv-1.webp',
  rewardPopupEnabled: true,
  rewardPopupTitle: 'Unlock Your Exclusive Royal Rewards',
  rewardPopupSubtitle: 'Get Special Offers & Instant Privilege Rewards',
  rewardPopupImage:
    'https://img-prd-pim.poorvika.com/product/Apple-iPhone-17-Pro-Max-Cosmic-Orange-2tB-front-back-view.png',
  rewardCouponCode: 'ROYAL500',
  bestsellerTabs: ['ALL', 'HIM', 'HER', 'ATTAR / PRO', 'GIFTING'],
  featuredFavouritesTitle: "RANVEER'S FAVOURITE",
  address: 'Main Flagship Showroom · Charlie Mobiles & Accessories, Raipur',
  city: 'RAIPUR',
  phone: '+91 8818850488',
  whatsappNumber: '918818850488',
  email: 'charliegedekar@gmail.com',
  openingHours: 'Monday to Friday / 10am to 6pm',
  mapLink: 'https://maps.google.com',
  announcementText: '❤ Look Good. Feel Royal. Shop Bestsellers ❤',
  bankOfferTitle: 'With Easy EMI from ₹2,625/month* + 10% Instant Cashback',
  bankOfferSubtitle: 'Bajaj Finserv · HDFC Bank · Home Credit · ICICI · SBI · Axis',
  exchangeMaxBonus: 12000,
  emiStartingPrice: 649,
  codEnabled: true,
  onlinePaymentEnabled: true,
  storePickupEnabled: true,
  localDeliveryEnabled: true,
  shippingEnabled: true,
  upiId: '8818850488@ybl',
  cloudinaryCloudName: 'dxeuzdwkz',
  cloudinaryUploadPreset: 'charliemobile',
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com',
  youtubeUrl: 'https://youtube.com',
};

export const INITIAL_HOMEPAGE_SECTIONS: HomepageSectionConfig[] = [
  { id: 'our_bestsellers', title: 'OUR BESTSELLERS', enabled: true, order: 1 },
  { id: 'loved_by_celebrities', title: 'LOVED BY CELEBRITIES', enabled: true, order: 2 },
  { id: 'visual_categories', title: 'SIGNATURE COLLECTIONS', enabled: true, order: 3 },
  { id: 'luxury_gifting', title: 'DISCOVER LUXURY GIFTING', enabled: true, order: 4 },
  { id: 'shop_by_notes', title: 'SHOP BY NOTES', enabled: true, order: 5 },
  { id: 'featured_favourites', title: "RANVEER'S FAVOURITE", enabled: true, order: 6 },
  { id: 'shop_by_occasions', title: 'SHOP BY OCCASIONS', enabled: true, order: 7 },
  { id: 'new_arrivals', title: 'NEW ARRIVALS', enabled: true, order: 8 },
  { id: 'from_our_loved_ones', title: 'FROM OUR LOVED ONES', enabled: true, order: 9 },
  { id: 'blogs_section', title: 'BLOGS', enabled: true, order: 10 },
  { id: 'walk_you_through', title: 'LET US WALK YOU THROUGH', enabled: true, order: 11 },
];

