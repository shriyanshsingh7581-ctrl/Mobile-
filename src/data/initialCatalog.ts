import {
  CategoryItem,
  Coupon,
  HeroBanner,
  HomepageSectionConfig,
  Product,
  StoreSettings,
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
    generateProductStudioSvg({
      title,
      brand,
      category,
      primaryHex,
      secondaryHex,
      angle: 'side_profile',
    }),
  ];
  return [...valid, ...fallbacks].slice(0, 5);
}

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat_smartphones',
    name: 'Mobiles',
    slug: 'smartphones',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/Mobile-Mobile-and-Accessories-2026.webp',
    order: 1,
    badge: '5G Ready',
  },
  {
    id: 'cat_iphone',
    name: 'iPhone',
    slug: 'iphone',
    image:
      'https://img-prd-pim.poorvika.com/product/Apple-iPhone-17-Pro-Max-Cosmic-Orange-2tB-front-back-view.png',
    order: 2,
    badge: 'Authorized',
  },
  {
    id: 'cat_samsung',
    name: 'Samsung',
    slug: 'samsung',
    image:
      'https://img-prd-pim.poorvika.com/product/Samsung-galaxy-s26-ultra-5g-cobalt-violet-16gb-1Tb-Front-Back-View.webp',
    order: 3,
    badge: 'Galaxy AI',
  },
  {
    id: 'cat_vivo',
    name: 'Vivo',
    slug: 'vivo',
    image:
      'https://img-prd-pim.poorvika.com/product/Vivo-V80-5G-Horizon-Blue-8GB-512GB-front-back-view.webp',
    order: 4,
    badge: 'ZEISS Optics',
  },
  {
    id: 'cat_oppo',
    name: 'Oppo',
    slug: 'oppo',
    image:
      'https://img-prd-pim.poorvika.com/product/Oppo-find-x10-pro-max-5g-titanium-grey-12gb-512gb-Front-Back-View.webp',
    order: 5,
  },
  {
    id: 'cat_realme',
    name: 'Realme',
    slug: 'realme',
    image:
      'https://img-prd-pim.poorvika.com/product/Realme-16-5g-air-black-12gb-256gb-Front-Back-View.webp',
    order: 6,
  },
  {
    id: 'cat_redmi',
    name: 'Redmi / MI',
    slug: 'redmi',
    image:
      'https://img-prd-pim.poorvika.com/product/Redmi-Note-17-Pro-Max-5G-Matcha-Green-12GB-256GB-frontview.webp',
    order: 7,
  },
  {
    id: 'cat_oneplus',
    name: 'OnePlus',
    slug: 'oneplus',
    image:
      'https://img-prd-pim.poorvika.com/product/oneplus-13-5g-arctic-dawn-512gb-16gb-ram-front-back-view-01.png',
    order: 8,
  },
  {
    id: 'cat_nothing',
    name: 'Nothing',
    slug: 'nothing',
    image:
      'https://img-prd-pim.poorvika.com/product/Nothing-phone-4b-5g-blue-8gb-256gb-Front-Back-View.webp',
    order: 9,
  },
  {
    id: 'cat_pixel',
    name: 'Google Pixel',
    slug: 'pixel',
    image:
      'https://img-prd-pim.poorvika.com/product/Google-pixel-11-5g-hibiscus-12gb-256gb-Front-Back-View.webp',
    order: 10,
  },
  {
    id: 'cat_tablets',
    name: 'iPads & Tablets',
    slug: 'tablets',
    image:
      'https://img-prd-pim.poorvika.com/product/Apple-ipad-air-with-apple-m4-chip-11-inch-wifi-purple-256gb-Front-Back-View.webp',
    order: 11,
  },
  {
    id: 'cat_smartwatches',
    name: 'Smartwatches',
    slug: 'smartwatches',
    image:
      'https://img-prd-pim.poorvika.com/product/Boat-Wave-Sigma-3-Curv-Smartwatch-Active-Black-front-view.webp',
    order: 12,
  },
  {
    id: 'cat_earbuds',
    name: 'Audio & Buds',
    slug: 'earbuds',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/True-Wireless-Mobile-and-Accessories-2026.webp',
    order: 13,
  },
  {
    id: 'cat_chargers',
    name: 'Chargers',
    slug: 'chargers',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/Chargers-Mobile-and-Accessories-2026.webp',
    order: 14,
  },
  {
    id: 'cat_power_banks',
    name: 'Power Banks',
    slug: 'power-banks',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/Power-Bank-Mobile-and-Accessories-2026.webp',
    order: 15,
  },
  {
    id: 'cat_accessories',
    name: 'Cases & Glass',
    slug: 'mobile-accessories',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/Case-Covers-Mobile-and-Accessories-2026.webp',
    order: 16,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Apple iPhone 17 Pro Max
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
      FrontCamera: '24MP TrueDepth Auto-Focus Camera',
      Battery: 'All-Day 35 Hr Video Playback, MagSafe + 40W Fast USB-C',
      Connectivity: '5G (sub-6 GHz), Wi-Fi 7, Bluetooth 5.4, Dual eSIM / Nano SIM',
    },
  },

  // 2. Apple iPhone 17
  {
    id: 'prod_iphone_17_sage',
    name: 'Apple iPhone 17 ( Sage, 512GB )',
    brand: 'Apple',
    category: 'iphone',
    price: 124900,
    mrp: 129900,
    stock: 16,
    description:
      'Apple iPhone 17 featuring Apple Intelligence, Action Button, Camera Control, 48MP Fusion camera with 2x optical-quality Telephoto, and aerospace-grade aluminum enclosure.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Apple-iPhone-17-Sage-512GB-front-back-view.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Apple-iPhone-17-Sage-512GB-front-back-view.webp',
        'https://img-prd-pim.poorvika.com/product/Apple-iPhone-17-Lavender-512GB-front-back-view.webp',
      ],
      'iPhone 17',
      'Apple',
      'iphone',
      '#65A30D',
      '#A855F7'
    ),
    colors: [
      { name: 'Sage', hex: '#84CC16' },
      { name: 'Lavender', hex: '#C084FC' },
      { name: 'Black', hex: '#18181B' },
    ],
    ramOptions: ['8GB'],
    storageOptions: ['128GB', '256GB', '512GB'],
    os: 'iOS',
    is5G: true,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    isFlagship: true,
    isBestCamera: true,
    rating: 4.9,
    reviewCount: 214,
    warranty: '1 Year Apple India Official Warranty',
    exchangeBonus: 7000,
    emiStartingAt: 5204,
    specs: {
      Display: '6.3-inch Super Retina XDR OLED Display',
      Processor: 'Apple A19 Bionic Chip with 16-Core Neural Engine',
      Camera: '48MP Fusion Camera + 12MP Ultra Wide',
      FrontCamera: '18MP TrueDepth Front Camera',
      Battery: 'Up to 27 Hours Video Playback, MagSafe Wireless Charging',
      SIM: 'Dual SIM (Nano-SIM and eSIM)',
    },
  },

  // 3. Apple iPhone 16 (Teal, 128GB)
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
      'https://img-prd-pim.poorvika.com/product/Apple-iphone-16-teal-128gb-Panel-View-view.webp',
      'https://img-prd-pim.poorvika.com/product/Apple-iphone-16-ultramarine-128gb-Front-Back-View-view-view.webp',
    ],
    colors: [
      { name: 'Teal', hex: '#0D9488' },
      { name: 'Ultramarine', hex: '#3B82F6' },
      { name: 'Pink', hex: '#EC4899' },
      { name: 'Black', hex: '#1E293B' },
    ],
    ramOptions: ['8GB'],
    storageOptions: ['128GB', '256GB', '512GB'],
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
      Display: '6.1-inch Super Retina XDR OLED (2556×1179)',
      Processor: 'Apple A18 Hexa-Core Processor',
      Camera: '48MP Fusion + 12MP Ultra Wide with Macro Photography',
      FrontCamera: '12MP TrueDepth Camera with Face ID',
      SIM: 'Dual SIM (Nano + eSIM), 5G Ready',
      Protection: 'IP68 Water & Dust Resistant, Ceramic Shield',
    },
  },

  // 4. Samsung Galaxy S26 Ultra 5G
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
      Display: '6.9-inch QHD+ Dynamic AMOLED 2X, 120Hz, 2600 nits Anti-Reflective',
      Processor: 'Qualcomm Snapdragon 8 Elite for Galaxy',
      Camera: '200MP OIS Main + 50MP 5x Periscope + 50MP Ultra Wide + 10MP 3x',
      Battery: '5000mAh with 45W Super Fast Charging 2.0',
      Features: 'Built-in Bluetooth S-Pen, Galaxy AI, Gorilla Armor 2',
    },
  },

  // 5. Samsung Galaxy Z Fold8 Ultra 5G
  {
    id: 'prod_samsung_z_fold8_ultra',
    name: 'Samsung Galaxy Z Fold8 Ultra 5G ( Violet Shadow, 16GB-1TB )',
    brand: 'Samsung',
    category: 'samsung',
    price: 239999,
    mrp: 259999,
    stock: 6,
    description:
      'Ultra-thin foldable powerhouse with 8.0-inch Dynamic AMOLED 2X Infinity Flex main screen, 200MP ProVisual Engine camera, FlexHinge armor, and Galaxy AI multitasking.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Samsung-galaxy-z-fold8-ultra-5g-violet-shadow-16gb-1tb-Front-Back-View.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Samsung-galaxy-z-fold8-ultra-5g-violet-shadow-16gb-1tb-Front-Back-View.webp',
        'https://img-prd-pim.poorvika.com/product/Samsung-galaxy-z-fold8-ultra-5g-cream-12gb-512gb-Front-Back-Fold-View.webp',
        'https://img-prd-pim.poorvika.com/product/Samsung-galaxy-z-fold8-5g-lavender-16gb-1tb-Front-Back-View.webp',
      ],
      'Galaxy Z Fold8 Ultra 5G',
      'Samsung',
      'samsung',
      '#5B21B6',
      '#F8FAFC'
    ),
    colors: [
      { name: 'Violet Shadow', hex: '#5B21B6' },
      { name: 'Cream', hex: '#FEF3C7' },
      { name: 'Lavender', hex: '#C084FC' },
    ],
    ramOptions: ['12GB', '16GB'],
    storageOptions: ['512GB', '1TB'],
    os: 'Android',
    is5G: true,
    isBestSeller: false,
    isFeatured: true,
    isNewRelease: true,
    isFlagship: true,
    isBestCamera: true,
    rating: 4.9,
    reviewCount: 94,
    warranty: '1 Year Samsung India Official Warranty',
    exchangeBonus: 12000,
    emiStartingAt: 9999,
    specs: {
      Display: '8.0-inch QXGA+ Foldable Dynamic AMOLED 2X + 6.5-inch Cover Screen',
      Processor: 'Snapdragon 8 Elite for Galaxy Octa-Core',
      Camera: '200MP Wide + 12MP Ultra Wide + 10MP 3x Telephoto',
      Battery: '4600mAh Dual Battery with Fast Wireless Charging 2.0',
      Durability: 'IP48 Water & Dust Resistance, Armor Aluminum Frame',
    },
  },

  // 6. Samsung Galaxy S26 FE 5G
  {
    id: 'prod_samsung_s26_fe',
    name: 'Samsung Galaxy S26 FE 5G ( Blueberry, 8GB-256GB )',
    brand: 'Samsung',
    category: 'samsung',
    price: 79999,
    mrp: 109999,
    stock: 18,
    description:
      'Galaxy AI flagship experience in an iconic Fan Edition design. Features 50MP Nightography Triple Camera with 3x Optical Zoom, 120Hz Dynamic AMOLED 2X, and IP68 durability.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Samsung-Galaxy-S26-FE-5G-Blueberry-8GB-256GB-front-view.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Samsung-Galaxy-S26-FE-5G-Blueberry-8GB-256GB-front-view.webp',
        'https://img-prd-pim.poorvika.com/product/Samsung-Galaxy-S26-FE-5G-Graphite-8GB-256GB-front-view.webp',
      ],
      'Galaxy S26 FE 5G',
      'Samsung',
      'samsung',
      '#2563EB',
      '#1E293B'
    ),
    colors: [
      { name: 'Blueberry', hex: '#3B82F6' },
      { name: 'Graphite', hex: '#334155' },
    ],
    ramOptions: ['8GB'],
    storageOptions: ['128GB', '256GB'],
    os: 'Android',
    is5G: true,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    isFlagship: true,
    isBestCamera: true,
    rating: 4.8,
    reviewCount: 162,
    warranty: '1 Year Samsung India Official Warranty',
    exchangeBonus: 6000,
    emiStartingAt: 3333,
    specs: {
      Display: '6.7-inch FHD+ Dynamic AMOLED 2X, 120Hz Vision Booster',
      Processor: 'Samsung Exynos Deca-Core with Galaxy AI NPU',
      Camera: '50MP OIS Main + 12MP Ultra Wide + 8MP 3x Optical Telephoto',
      Battery: '4700mAh Battery, 25W Fast Charging',
    },
  },

  // 7. Samsung Galaxy S25 FE 5G
  {
    id: 'prod_samsung_s25_fe',
    name: 'Samsung Galaxy S25 FE 5G ( Navy, 8GB-256GB )',
    brand: 'Samsung',
    category: 'samsung',
    price: 58999,
    mrp: 65999,
    stock: 20,
    description:
      'Samsung Galaxy S25 FE 5G with Circle to Search, Live Translate, ProVisual Engine 50MP OIS camera, Gorilla Glass Victus+, and 7 generations of OS upgrades.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Samsung-galaxy-s25-fe-5g-navy-8gb-256gb-Front-Back-View.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Samsung-galaxy-s25-fe-5g-navy-8gb-256gb-Front-Back-View.webp',
        'https://img-prd-pim.poorvika.com/product/Samsung-galaxy-s25-fe-5g-jetblack-8gb-256gb-Front-Back-View.webp',
        'https://img-prd-pim.poorvika.com/product/Samsung-galaxy-s25-fe-5g-white-8gb-256gb-Front-Back-View.webp',
      ],
      'Galaxy S25 FE 5G',
      'Samsung',
      'samsung',
      '#1E3A8A',
      '#0F172A'
    ),
    colors: [
      { name: 'Navy', hex: '#1E3A8A' },
      { name: 'Jetblack', hex: '#090D16' },
      { name: 'White', hex: '#F8FAFC' },
    ],
    ramOptions: ['8GB'],
    storageOptions: ['128GB', '256GB'],
    os: 'Android',
    is5G: true,
    isBestSeller: true,
    isFeatured: false,
    isNewRelease: false,
    isFlagship: true,
    isBestCamera: true,
    rating: 4.8,
    reviewCount: 205,
    warranty: '1 Year Samsung India Official Warranty',
    exchangeBonus: 5000,
    emiStartingAt: 2458,
    specs: {
      Display: '6.7-inch Dynamic AMOLED 2X, 120Hz',
      Processor: 'Samsung Exynos 2400e 4nm Processor',
      Camera: '50MP OIS + 12MP Ultra Wide + 8MP 3x Telephoto',
      Battery: '4700mAh with Super Fast Charging',
    },
  },

  // 8. Vivo V80 5G
  {
    id: 'prod_vivo_v80_5g',
    name: 'Vivo V80 5G ( Horizon Blue, 8GB-512GB )',
    brand: 'Vivo',
    category: 'vivo',
    price: 74999,
    mrp: 79999,
    stock: 15,
    description:
      'Vivo V80 5G co-engineered with ZEISS Optics, featuring Studio-Quality Aura Light Portrait, 50MP Eye AF Group Selfie camera, and ultra-slim 3D curved AMOLED display.',
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
    rating: 4.8,
    reviewCount: 178,
    warranty: '1 Year Vivo India Official Warranty',
    exchangeBonus: 6000,
    emiStartingAt: 3125,
    specs: {
      Display: '6.78-inch 1.5K Ultra-Clear Curved AMOLED, 120Hz, 4500 nits',
      Processor: 'MediaTek Dimensity Flagship 4nm 5G Chipset',
      Camera: '50MP ZEISS OIS Main + 50MP ZEISS Telephoto Portrait + 50MP Wide',
      FrontCamera: '50MP ZEISS Group Selfie with Auto-Focus',
      Battery: '6000mAh BlueVolt Battery with 90W FlashCharge',
    },
  },

  // 9. Vivo X Fold6 5G
  {
    id: 'prod_vivo_x_fold6',
    name: 'Vivo X Fold6 5G ( Nebula Teal, 12GB-512GB )',
    brand: 'Vivo',
    category: 'vivo',
    price: 219999,
    mrp: 259999,
    stock: 5,
    description:
      'Ultra-light carbon-fiber hinge foldable smartphone with ZEISS T* Coating Master Camera system, Dual 120Hz E7 LTPO displays, and 5800mAh Silicon-Anode battery.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Vivo-x-fold6-5g-nebula-teal-12gb-512gb-Fold-View.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Vivo-x-fold6-5g-nebula-teal-12gb-512gb-Fold-View.webp',
        'https://img-prd-pim.poorvika.com/product/Vivo-x-fold6-5g-prism-black-12gb-512gb-Fold-View.webp',
      ],
      'Vivo X Fold6 5G',
      'Vivo',
      'vivo',
      '#0F766E',
      '#18181B'
    ),
    colors: [
      { name: 'Nebula Teal', hex: '#0F766E' },
      { name: 'Prism Black', hex: '#18181B' },
    ],
    ramOptions: ['12GB', '16GB'],
    storageOptions: ['512GB', '1TB'],
    os: 'Android',
    is5G: true,
    isBestSeller: false,
    isFeatured: true,
    isNewRelease: true,
    isFlagship: true,
    isBestCamera: true,
    rating: 4.9,
    reviewCount: 64,
    warranty: '1 Year Vivo India Official Warranty',
    exchangeBonus: 12000,
    emiStartingAt: 9166,
    specs: {
      Display: '8.03-inch 2K+ E7 AMOLED Foldable + 6.53-inch Cover Display',
      Processor: 'Qualcomm Snapdragon 8 Elite + Vivo V3+ Imaging Chip',
      Camera: '50MP VCS Bionic Main + 64MP ZEISS Periscope + 50MP Ultra Wide',
      Battery: '5800mAh Semi-Solid Battery, 100W Dual-Cell FlashCharge',
    },
  },

  // 10. Oppo Find X10 Pro Max 5G
  {
    id: 'prod_oppo_find_x10_pro_max',
    name: 'Oppo Find X10 Pro Max 5G ( Titanium Grey, 12GB-512GB )',
    brand: 'Oppo',
    category: 'oppo',
    price: 199999,
    mrp: 239999,
    stock: 7,
    description:
      'Hasselblad Master Quad-Camera System with Dual Periscope Telephoto lenses, AI Telescope Zoom, Dolby Vision 4K 60fps across all focal lengths, and Silicon-Carbon 6000mAh battery.',
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
    isBestSeller: false,
    isFeatured: true,
    isNewRelease: true,
    isFlagship: true,
    isBestCamera: true,
    rating: 4.9,
    reviewCount: 86,
    warranty: '1 Year Oppo India Official Warranty',
    exchangeBonus: 10000,
    emiStartingAt: 8333,
    specs: {
      Display: '6.82-inch Infinite View Quad-Curved ProXDR LTPO OLED, 120Hz',
      Processor: 'MediaTek Dimensity 9400+ Flagship 3nm SoC',
      Camera: '50MP LYT-808 + Dual 50MP Hasselblad Periscope Telephoto + 50MP Wide',
      Battery: '6000mAh Silicon-Carbon with 80W SUPERVOOC + 50W AIRVOOC',
    },
  },

  // 11. Oppo Reno 16c 5G
  {
    id: 'prod_oppo_reno_16c',
    name: 'Oppo Reno 16c 5G ( Starry White, 8GB-128GB )',
    brand: 'Oppo',
    category: 'oppo',
    price: 52999,
    mrp: 74999,
    stock: 24,
    description:
      'The AI Portrait Expert with AI Livephoto, AI Eraser 2.0, 50MP Sony OIS Portrait Camera, Aerospace-grade Aluminum Frame, and IP69 Water & High-Pressure Jet Resistance.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Oppo-reno-16c-5g-starry-white-8gb-128gb-Front-Back-View.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Oppo-reno-16c-5g-starry-white-8gb-128gb-Front-Back-View.webp',
        'https://img-prd-pim.poorvika.com/product/Oppo-reno-16c-5g-twilight-violet-8gb-256gb-Front-Back-View.webp',
      ],
      'Oppo Reno 16c 5G',
      'Oppo',
      'oppo',
      '#E2E8F0',
      '#7C3AED'
    ),
    colors: [
      { name: 'Starry White', hex: '#F1F5F9' },
      { name: 'Twilight Violet', hex: '#7C3AED' },
    ],
    ramOptions: ['8GB', '12GB'],
    storageOptions: ['128GB', '256GB'],
    os: 'Android',
    is5G: true,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    isMidRange: true,
    isBestCamera: true,
    rating: 4.8,
    reviewCount: 241,
    warranty: '1 Year Oppo India Official Warranty',
    exchangeBonus: 4000,
    emiStartingAt: 2208,
    specs: {
      Display: '6.7-inch 120Hz Smart Adaptive OLED Display',
      Processor: 'MediaTek Dimensity 8350 5G AI SoC',
      Camera: '50MP Sony OIS Main + 50MP Telephoto Portrait + 8MP Ultra Wide',
      FrontCamera: '50MP AF Ultra-Clear Selfie Camera',
      Battery: '5600mAh with 80W SUPERVOOC Flash Charge',
    },
  },

  // 12. OnePlus 13 5G
  {
    id: 'prod_oneplus_13_5g',
    name: 'OnePlus 13 5G ( Arctic Dawn, 16GB-512GB )',
    brand: 'OnePlus',
    category: 'oneplus',
    price: 76999,
    mrp: 79999,
    stock: 19,
    description:
      'OnePlus 13 5G powered by Snapdragon 8 Elite, 5th-Gen Hasselblad Camera for Mobile, 2K 120Hz ProXDR Display with DisplayMate A++, and a massive 6000mAh Glacier Battery.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/oneplus-13-5g-arctic-dawn-512gb-16gb-ram-front-back-view-01.png',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/oneplus-13-5g-arctic-dawn-512gb-16gb-ram-front-back-view-01.png',
        'https://img-prd-pim.poorvika.com/product/oneplus-13-5g-arctic-dawn-256gb-12gb-ram-front-back-view-01.png',
      ],
      'OnePlus 13 5G',
      'OnePlus',
      'oneplus',
      '#E2E8F0',
      '#2563EB'
    ),
    colors: [
      { name: 'Arctic Dawn', hex: '#F1F5F9' },
      { name: 'Midnight Ocean', hex: '#1E3A8A' },
      { name: 'Black Eclipse', hex: '#18181B' },
    ],
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
      Display: '6.82-inch 2K 120Hz ProXDR LTPO 4.1 AMOLED with Aqua Touch 2.0',
      Processor: 'Qualcomm Snapdragon 8 Elite (4.32GHz)',
      Camera: '50MP Sony LYT-808 OIS + 50MP 3x Triprism Telephoto + 50MP Ultra Wide',
      Battery: '6000mAh Silicon NanoStack, 100W SUPERVOOC + 50W AIRVOOC',
      Protection: 'IP68 & IP69 Water and Dust Resistance',
    },
  },

  // 13. OnePlus N6x 5G
  {
    id: 'prod_oneplus_n6x_5g',
    name: 'OnePlus N6x 5G ( Ice Blue, 4GB-128GB )',
    brand: 'OnePlus',
    category: 'oneplus',
    price: 22999,
    mrp: 28999,
    stock: 28,
    description:
      'Fast and smooth OnePlus OxygenOS experience with 120Hz High-Brightness Display, 50MP AI Dual Camera, 300% Ultra Volume Mode, and SuperVOOC endurance.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Oneplus-n6x-5g-ice-blue-4gb-128gb-Front-Back-View.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Oneplus-n6x-5g-ice-blue-4gb-128gb-Front-Back-View.webp',
        'https://img-prd-pim.poorvika.com/product/Oneplus-n6x-5g-burgundy-red-4gb-128gb-Front-Back-View.webp',
      ],
      'OnePlus N6x 5G',
      'OnePlus',
      'oneplus',
      '#38BDF8',
      '#991B1B'
    ),
    colors: [
      { name: 'Ice Blue', hex: '#38BDF8' },
      { name: 'Burgundy Red', hex: '#991B1B' },
    ],
    ramOptions: ['4GB', '8GB'],
    storageOptions: ['64GB', '128GB'],
    os: 'Android',
    is5G: true,
    isBestSeller: true,
    isFeatured: false,
    isNewRelease: true,
    isMidRange: true,
    rating: 4.6,
    reviewCount: 147,
    warranty: '1 Year OnePlus India Official Warranty',
    exchangeBonus: 2500,
    emiStartingAt: 958,
    specs: {
      Display: '6.67-inch 120Hz Punch-Hole Display',
      Processor: 'MediaTek Dimensity 6300 5G Octa-Core',
      Camera: '50MP AI Main Camera + 2MP Depth Sensor',
      Battery: '5100mAh Battery with 45W SUPERVOOC Fast Charge',
    },
  },

  // 14. Redmi Note 17 Pro Max 5G
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
        'https://img-prd-pim.poorvika.com/product/Redmi-Note-17-Pro-Max-5G-Stealth-Black-12GB-256GB-front-viee.webp',
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
      { name: 'Stealth Black', hex: '#18181B' },
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
      Display: '6.67-inch 1.5K 3D Curved AMOLED, 120Hz, 3000 nits Peak',
      Processor: 'Qualcomm Snapdragon 7s Gen 3 Octa-Core 5G',
      Camera: '200MP OIS HP3 Flagship Sensor + 50MP Telephoto + 8MP Ultra Wide',
      Battery: '6200mAh Solid-State Silicon-Carbon, 120W HyperCharge',
    },
  },

  // 15. Redmi 17 5G
  {
    id: 'prod_redmi_17_5g',
    name: 'Redmi 17 5G ( Endless Blue, 8GB-128GB )',
    brand: 'Redmi',
    category: 'redmi',
    price: 26999,
    mrp: 41999,
    stock: 35,
    description:
      'All-rounder 5G smartphone with Crystal Glass design, 108MP Pro-Grade Dual Camera, 120Hz AdaptiveSync FHD+ display, and 5160mAh marathon battery.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Redmi-17-5g-endless-blue-8gb-128gb-Front-Back-View.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Redmi-17-5g-endless-blue-8gb-128gb-Front-Back-View.webp',
        'https://img-prd-pim.poorvika.com/product/Redmi-17-5g-absolute-black-8gb-128gb-Front-Back-View.webp',
      ],
      'Redmi 17 5G',
      'Redmi',
      'redmi',
      '#0284C7',
      '#0F172A'
    ),
    colors: [
      { name: 'Endless Blue', hex: '#0284C7' },
      { name: 'Absolute Black', hex: '#0F172A' },
    ],
    ramOptions: ['6GB', '8GB'],
    storageOptions: ['128GB', '256GB'],
    os: 'Android',
    is5G: true,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    isMidRange: true,
    rating: 4.7,
    reviewCount: 419,
    warranty: '1 Year Xiaomi India Official Warranty',
    exchangeBonus: 2500,
    emiStartingAt: 1125,
    specs: {
      Display: '6.79-inch FHD+ 120Hz AdaptiveSync Display with Wet Touch',
      Processor: 'Qualcomm Snapdragon 4 Gen 2 AE 5G',
      Camera: '108MP 3x In-Sensor Zoom Main + 2MP Macro, 13MP Selfie',
      Battery: '5160mAh Battery with 33W Fast Charger in-box',
    },
  },

  // 16. Realme 16 5G
  {
    id: 'prod_realme_16_5g',
    name: 'Realme 16 5G ( Air Black, 12GB-256GB )',
    brand: 'Realme',
    category: 'realme',
    price: 47999,
    mrp: 49999,
    stock: 17,
    description:
      'Realme 16 5G with Sony LYT-701 OIS Portrait Camera, AI HyperRAW Algorithm, 120Hz Ultra-Smooth Curved Vision Display, and 80W Ultra Charge.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Realme-16-5g-air-black-12gb-256gb-Front-Back-View.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Realme-16-5g-air-black-12gb-256gb-Front-Back-View.webp',
        'https://img-prd-pim.poorvika.com/product/Realme-16-5g-air-white-12gb-256gb-Front-Back-View.webp',
      ],
      'Realme 16 5G',
      'Realme',
      'realme',
      '#18181B',
      '#F8FAFC'
    ),
    colors: [
      { name: 'Air Black', hex: '#18181B' },
      { name: 'Air White', hex: '#F8FAFC' },
    ],
    ramOptions: ['8GB', '12GB'],
    storageOptions: ['128GB', '256GB'],
    os: 'Android',
    is5G: true,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    isMidRange: true,
    isBestCamera: true,
    rating: 4.7,
    reviewCount: 194,
    warranty: '1 Year Realme India Official Warranty',
    exchangeBonus: 4000,
    emiStartingAt: 1999,
    specs: {
      Display: '6.7-inch 120Hz Curved Vision OLED Display, 2000 nits',
      Processor: 'Snapdragon 7s Gen 2 5G 4nm Chipset',
      Camera: '50MP Sony LYT-701 OIS + 50MP Periscope Portrait + 8MP Ultra Wide',
      Battery: '5200mAh Battery with 80W SUPERVOOC Charge',
    },
  },

  // 17. Realme Narzo 100 Lite 5G
  {
    id: 'prod_realme_narzo_100_lite',
    name: 'Realme Narzo 100 Lite 5G ( Thunder Black, 6GB-128GB )',
    brand: 'Realme',
    category: 'realme',
    price: 23999,
    mrp: 31999,
    stock: 29,
    description:
      'High-speed 5G gaming and entertainment smartphone with 120Hz Eye-Comfort Display, MediaTek Dimensity 5G processor, and 5000mAh massive battery.',
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
      '#94A3B8'
    ),
    colors: [
      { name: 'Thunder Black', hex: '#18181B' },
      { name: 'Skyline Silver', hex: '#94A3B8' },
    ],
    ramOptions: ['6GB', '8GB'],
    storageOptions: ['128GB'],
    os: 'Android',
    is5G: true,
    isBestSeller: false,
    isFeatured: false,
    isNewRelease: true,
    isMidRange: true,
    rating: 4.6,
    reviewCount: 118,
    warranty: '1 Year Realme India Official Warranty',
    exchangeBonus: 2000,
    emiStartingAt: 999,
    specs: {
      Display: '6.67-inch 120Hz Ultra Smooth Display',
      Processor: 'MediaTek Dimensity 6300 5G Processor',
      Camera: '50MP AI Primary Camera + Flicker Sensor',
      Battery: '5000mAh with 33W SUPERVOOC Charge',
    },
  },

  // 18. Nothing Phone (4b) 5G
  {
    id: 'prod_nothing_phone_4b',
    name: 'Nothing Phone (4b) 5G ( Blue, 8GB-256GB )',
    brand: 'Nothing',
    category: 'nothing',
    price: 40999,
    mrp: 59999,
    stock: 16,
    description:
      'Iconic transparent design with interactive Glyph Interface, Nothing OS 3.0, Dual 50MP OIS Camera system, and 120Hz flexible AMOLED display with symmetrical bezels.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Nothing-phone-4b-5g-blue-8gb-256gb-Front-Back-View.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Nothing-phone-4b-5g-blue-8gb-256gb-Front-Back-View.webp',
        'https://img-prd-pim.poorvika.com/product/Nothing-phone-4b-5g-white-8gb-256gb-Front-Back-View.webp',
        'https://img-prd-pim.poorvika.com/product/Nothing-phone-4b-5g-black-8gb-256gb-Front-Back-Side-View.webp',
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
      { name: 'Black', hex: '#18181B' },
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
      Display: '6.77-inch Flexible AMOLED, 120Hz Adaptive, 3000 nits',
      Processor: 'Qualcomm Snapdragon 7s Gen 3 Custom Edition',
      Camera: '50MP OIS Main + 50MP Periscope Telephoto + 8MP Ultra Wide',
      FrontCamera: '32MP In-Display Selfie Camera',
      Battery: '5000mAh with 50W Fast Charging + Glyph Timer & Notifications',
    },
  },

  // 19. Google Pixel 11 5G
  {
    id: 'prod_google_pixel_11',
    name: 'Google Pixel 11 5G ( Hibiscus, 12GB-256GB )',
    brand: 'Google',
    category: 'pixel',
    price: 89999,
    mrp: 94999,
    stock: 11,
    description:
      'Engineered by Google with the Tensor G5 chip, Gemini Nano AI built-in, Best Take, Magic Editor, Actua OLED display, and 7 years of Pixel Drop & OS updates.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Google-pixel-11-5g-hibiscus-12gb-256gb-Front-Back-View.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Google-pixel-11-5g-hibiscus-12gb-256gb-Front-Back-View.webp',
        'https://img-prd-pim.poorvika.com/product/Google-pixel-11-5g-pistachio-12gb-256gb-Front-Back-View.webp',
        'https://img-prd-pim.poorvika.com/product/Google-pixel-11-pro-fold-5g-olive-16gb-512gb-Front-Left-View.webp',
      ],
      'Google Pixel 11 5G',
      'Google',
      'pixel',
      '#E11D48',
      '#84CC16'
    ),
    colors: [
      { name: 'Hibiscus', hex: '#E11D48' },
      { name: 'Pistachio', hex: '#84CC16' },
      { name: 'Obsidian', hex: '#18181B' },
    ],
    ramOptions: ['12GB'],
    storageOptions: ['128GB', '256GB'],
    os: 'Android',
    is5G: true,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    isFlagship: true,
    isBestCamera: true,
    rating: 4.9,
    reviewCount: 158,
    warranty: '1 Year Google India Official Warranty',
    exchangeBonus: 8000,
    emiStartingAt: 3750,
    specs: {
      Display: '6.3-inch Actua OLED Display, 120Hz, 2700 nits Peak Brightness',
      Processor: 'Google Tensor G5 + Titan M2 Security Coprocessor',
      Camera: '50MP Octa PD Wide + 48MP Quad PD Ultra Wide with Macro Focus',
      Battery: '4700mAh 24+ Hour Battery, Fast Wireless & Battery Share',
    },
  },

  // 20. Samsung Galaxy A08
  {
    id: 'prod_samsung_galaxy_a08',
    name: 'Samsung Galaxy A08 ( Silver, 4GB-64GB )',
    brand: 'Samsung',
    category: 'samsung',
    price: 13499,
    mrp: 18499,
    stock: 40,
    description:
      'Reliable everyday Samsung Galaxy smartphone with 50MP High-Resolution Dual Camera, 6.7-inch PLS LCD display, Knox Vault security, and 5000mAh 2-day battery.',
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
      '#94A3B8',
      '#10B981'
    ),
    colors: [
      { name: 'Silver', hex: '#94A3B8' },
      { name: 'Green', hex: '#10B981' },
    ],
    ramOptions: ['4GB', '6GB'],
    storageOptions: ['64GB', '128GB'],
    os: 'Android',
    is5G: false,
    isBestSeller: true,
    isFeatured: false,
    isNewRelease: true,
    rating: 4.5,
    reviewCount: 230,
    warranty: '1 Year Samsung India Official Warranty',
    exchangeBonus: 1500,
    emiStartingAt: 649,
    specs: {
      Display: '6.7-inch HD+ 90Hz Infinity-U Display',
      Processor: 'MediaTek Helio G85 Octa-Core Processor',
      Camera: '50MP Main + 2MP Depth Sensor, 8MP Front Camera',
      Battery: '5000mAh with 25W Type-C Fast Charging Support',
    },
  },

  // 21. Apple iPad Air M4 11-Inch
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
        'https://img-prd-pim.poorvika.com/product/Apple-ipad-air-with-apple-m4-chip-11-inch-wifi-blue-256gb-Front-Back-View.webp',
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
      { name: 'Blue', hex: '#3B82F6' },
    ],
    ramOptions: ['8GB'],
    storageOptions: ['128GB', '256GB', '512GB'],
    os: 'iOS',
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
      Display: '11-inch Liquid Retina Display with True Tone & Anti-Reflective Coating',
      Processor: 'Apple M4 Chip with 16-Core Neural Engine',
      Camera: '12MP Wide Rear Camera + 12MP Landscape Center Stage Front Camera',
      Compatibility: 'Works with Apple Pencil Pro and Magic Keyboard',
    },
  },

  // 22. Apple AirPods Pro 3rd Gen
  {
    id: 'prod_apple_airpods_pro_3',
    name: 'Apple AirPods Pro 3rd Gen With MagSafe USB-C Charging Case ( White )',
    brand: 'Apple',
    category: 'earbuds',
    price: 23900,
    mrp: 25900,
    stock: 25,
    description:
      'Up to 2x more Active Noise Cancellation, Adaptive Audio, Personalized Spatial Audio with dynamic head tracking, Conversation Awareness, and IP54 dust/sweat/water resistant MagSafe USB-C case.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Apple-airpods-pro-3rd-gen-with-magsafe-usb-c-charging-case-white-Front-View.png',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Apple-airpods-pro-3rd-gen-with-magsafe-usb-c-charging-case-white-Front-View.png',
        'https://img-prd-pim.poorvika.com/product/Apple-AirPods-5-front-view.png',
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
      AudioChip: 'Apple H2 Headphone Chip + U1 Chip in MagSafe Case',
      NoiseControl: 'Pro-Level Active Noise Cancellation & Adaptive Transparency',
      Battery: 'Up to 6 Hours Listening Time (30 Hours with MagSafe USB-C Case)',
      Protection: 'IP54 Dust, Sweat, and Water Resistant',
    },
  },

  // 23. Apple AirPods 5
  {
    id: 'prod_apple_airpods_5',
    name: 'Apple AirPods 5 With Wireless Charging Case ( White )',
    brand: 'Apple',
    category: 'earbuds',
    price: 16900,
    mrp: 17900,
    stock: 30,
    description:
      'Redesigned for exceptional all-day comfort with Active Noise Cancellation in an open-ear design, Voice Isolation, Personalized Spatial Audio, and USB-C Wireless Charging Case.',
    mainImage: 'https://img-prd-pim.poorvika.com/product/Apple-AirPods-5-front-view.png',
    gallery: buildPoorvikaGallery(
      ['https://img-prd-pim.poorvika.com/product/Apple-AirPods-5-front-view.png'],
      'Apple AirPods 5',
      'Apple',
      'earbuds',
      '#F8FAFC',
      '#38BDF8'
    ),
    colors: [{ name: 'White', hex: '#F8FAFC' }],
    ramOptions: ['Standard'],
    storageOptions: ['Standard'],
    os: 'Accessory',
    is5G: false,
    isBestSeller: true,
    isFeatured: false,
    isNewRelease: true,
    rating: 4.8,
    reviewCount: 195,
    warranty: '1 Year Apple India Official Warranty',
    exchangeBonus: 0,
    emiStartingAt: 704,
    specs: {
      Chip: 'Apple H2 Chip with Voice Isolation',
      Features: 'Active Noise Cancellation, Adaptive EQ, Siri Interactions',
      Battery: 'Up to 30 Hours Total Listening Time with Case',
    },
  },

  // 24. Urban Q8 Ai ANC Wireless Earbuds
  {
    id: 'prod_urban_q8_anc_earbuds',
    name: 'Urban Q8 Ai ANC Wireless Earbuds ( Electric Blue )',
    brand: 'Urban',
    category: 'earbuds',
    price: 1499,
    mrp: 4999,
    stock: 45,
    description:
      'True Wireless Earbuds with 32dB Active Noise Cancellation, Quad-Mic AI Environmental Noise Cancellation for crystal-clear calls, 45ms Low Latency Gaming Mode, and 50Hr total playback.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Urban-q8-ai-anc-wireless-earbuds-blue-Front-Right-View.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Urban-q8-ai-anc-wireless-earbuds-blue-Front-Right-View.webp',
        'https://img-prd-pim.poorvika.com/product/Urban-q6-enc-wireless-earbuds-starlight-white-Front-View.webp',
      ],
      'Urban Q8 Ai ANC Buds',
      'Urban',
      'earbuds',
      '#2563EB',
      '#F8FAFC'
    ),
    colors: [
      { name: 'Electric Blue', hex: '#2563EB' },
      { name: 'Starlight White', hex: '#F8FAFC' },
    ],
    ramOptions: ['Standard'],
    storageOptions: ['Standard'],
    os: 'Accessory',
    is5G: false,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    rating: 4.6,
    reviewCount: 284,
    warranty: '1 Year Manufacturer Warranty',
    exchangeBonus: 0,
    emiStartingAt: 199,
    specs: {
      Drivers: '13mm Titanium Dynamic Bass Drivers',
      NoiseControl: 'AI ANC + Quad-Mic ENC Clear Calls',
      Battery: 'Up to 50 Hours Total Playback with Type-C Fast Charge',
      Bluetooth: 'Bluetooth v5.4 Instant Auto-Pair',
    },
  },

  // 25. Noise Airwave Neckband Bluetooth Headset
  {
    id: 'prod_noise_airwave_neckband',
    name: 'Noise Airwave Neckband Bluetooth Headset ( Midnight Blue )',
    brand: 'Noise',
    category: 'earbuds',
    price: 999,
    mrp: 2499,
    stock: 50,
    description:
      'Ergonomic wireless neckband with 50-hour playtime, Instacharge (10 min charge = 10 hours play), 3 EQ modes, Dual-Device Pairing, and IPX5 sweat resistance.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/noise-airwave-neckband-bluetooth-headset-midnight-blue-front-view.png',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/noise-airwave-neckband-bluetooth-headset-midnight-blue-front-view.png',
        'https://img-prd-pim.poorvika.com/product/noise-airwave-neckband-bluetooth-headset-black-front-view.png',
      ],
      'Noise Airwave Neckband',
      'Noise',
      'earbuds',
      '#1E3A8A',
      '#18181B'
    ),
    colors: [
      { name: 'Midnight Blue', hex: '#1E3A8A' },
      { name: 'Black', hex: '#18181B' },
    ],
    ramOptions: ['Standard'],
    storageOptions: ['Standard'],
    os: 'Accessory',
    is5G: false,
    isBestSeller: true,
    isFeatured: false,
    isNewRelease: false,
    rating: 4.5,
    reviewCount: 340,
    warranty: '1 Year Noise India Warranty',
    exchangeBonus: 0,
    emiStartingAt: 199,
    specs: {
      Driver: '10mm High-Fidelity Dynamic Driver',
      Playtime: 'Up to 50 Hours Playback with Instacharge',
      Features: 'Environmental Noise Cancellation, Low-Latency Mode, IPX5',
    },
  },

  // 26. Apple USB-C Power Adapter 20W
  {
    id: 'prod_apple_20w_adapter',
    name: 'Apple USB-C Power Adapter 20W 2025, MUVR3HN/A ( White )',
    brand: 'Apple',
    category: 'chargers',
    price: 1889,
    mrp: 2190,
    stock: 60,
    description:
      'Original Apple 20W USB-C Power Adapter offers fast, efficient charging at home, in the office, or on the go. Fast-charges iPhone 16 / 17 from 0 to 50% in around 30 minutes.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Apple-usb-c-power-adapter-20w-2025-muvr3hn-a-white-Full-View.png',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Apple-usb-c-power-adapter-20w-2025-muvr3hn-a-white-Full-View.png',
        'https://img-prd-pim.poorvika.com/product/Apple-USB-Power-Adapter-20W.png',
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
      ModelCode: 'MUVR3HN/A / MHJD3HN/A Genuine Seal Pack',
      Compatibility: 'iPhone 8 to iPhone 17 Pro Max, iPad Pro/Air, AirPods',
    },
  },

  // 27. Xiaomi Power Bank 20000mAh 165W
  {
    id: 'prod_xiaomi_powerbank_20000',
    name: 'Xiaomi Power Bank 20000 165W ( Space Grey )',
    brand: 'Xiaomi',
    category: 'power-banks',
    price: 5499,
    mrp: 10999,
    stock: 22,
    description:
      'High-output 20000mAh power bank with 165W Max dual-port fast charging, built-in braided USB-C cable, smart color digital power display, and airline-safe multi-layer protection.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Xiaomi-power-bank-20000-165w-space-grey-Front-View.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Xiaomi-power-bank-20000-165w-space-grey-Front-View.webp',
        'https://img-prd-pim.poorvika.com/product/Xiaomi-Magnetic-10000mAh-45W-Power-Bank-Black-front-view.webp',
      ],
      'Xiaomi 20000mAh 165W',
      'Xiaomi',
      'power-banks',
      '#475569',
      '#18181B'
    ),
    colors: [
      { name: 'Space Grey', hex: '#475569' },
      { name: 'Black', hex: '#18181B' },
    ],
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
      MaxOutput: '165W Combined (120W Integrated Type-C + 45W Port)',
      Display: 'Smart Color Digital Battery Percentage & Output Screen',
    },
  },

  // 28. Swiss Military Electra 10000mAh Power Bank
  {
    id: 'prod_swiss_military_10k_pb',
    name: 'Swiss Military Electra 10K/A QC PD 10000 mAh Power Bank ( Black )',
    brand: 'Swiss Military',
    category: 'power-banks',
    price: 999,
    mrp: 4790,
    stock: 48,
    description:
      'Pocket-friendly 10000mAh Quick Charge & Power Delivery 22.5W fast charging power bank with dual USB output, Type-C PD input/output, and LED charge indicator.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Swiss-military-electra-10k-a-qc-pd-10000-mah-power-bank-black-Front-View.png',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Swiss-military-electra-10k-a-qc-pd-10000-mah-power-bank-black-Front-View.png',
      ],
      'Swiss Military 10000mAh PB',
      'Swiss Military',
      'power-banks',
      '#18181B',
      '#EF4444'
    ),
    colors: [{ name: 'Black', hex: '#18181B' }],
    ramOptions: ['Standard'],
    storageOptions: ['10000mAh'],
    os: 'Accessory',
    is5G: false,
    isBestSeller: true,
    isFeatured: false,
    isNewRelease: false,
    rating: 4.6,
    reviewCount: 290,
    warranty: '1 Year Manufacturer Warranty',
    exchangeBonus: 0,
    emiStartingAt: 199,
    specs: {
      Capacity: '10000mAh Li-Polymer Battery',
      FastCharge: '22.5W QC 3.0 + USB-C PD Output',
      Safety: 'Over-Voltage & Short-Circuit Protection',
    },
  },

  // 29. Boat Wave Sigma 3 Curv Smartwatch
  {
    id: 'prod_boat_wave_sigma_3',
    name: 'Boat Wave Sigma 3 Curv Smartwatch ( Active Black )',
    brand: 'Boat',
    category: 'smartwatches',
    price: 1999,
    mrp: 5999,
    stock: 34,
    description:
      '2.01-inch 3D Curved HD Display smartwatch with Single-Chip Bluetooth Calling, Turn-by-Turn Map Navigation, Crest+ OS, Emergency SOS, and 700+ Active Sports Modes.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Boat-Wave-Sigma-3-Curv-Smartwatch-Active-Black-front-view.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Boat-Wave-Sigma-3-Curv-Smartwatch-Active-Black-front-view.webp',
        'https://img-prd-pim.poorvika.com/product/Hapipola-neo-ultra-smartwatch-black-Front-Right-View.webp',
      ],
      'Boat Wave Sigma 3 Curv',
      'Boat',
      'smartwatches',
      '#18181B',
      '#EF4444'
    ),
    colors: [{ name: 'Active Black', hex: '#18181B' }],
    ramOptions: ['Standard'],
    storageOptions: ['Standard'],
    os: 'Accessory',
    is5G: false,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    rating: 4.7,
    reviewCount: 375,
    warranty: '1 Year Boat India Official Warranty',
    exchangeBonus: 0,
    emiStartingAt: 199,
    specs: {
      Display: '2.01-inch Curved HD Display, 550 nits Brightness',
      Calling: 'Bluetooth v5.3 HD Calling with Dial Pad & Contacts',
      Health: '24x7 Heart Rate, SpO2, Sleep & Stress Monitoring, IP67',
    },
  },

  // 30. Privacy Tempered Glass For iPhone 17 Pro Max
  {
    id: 'prod_privacy_tempered_glass',
    name: 'Privacy Tempered Glass For Apple iPhone 17 Pro Max ( Black )',
    brand: 'Cool-Touch',
    category: 'mobile-accessories',
    price: 1299,
    mrp: 2499,
    stock: 80,
    description:
      '9H Hardness 28-Degree Anti-Spy Privacy Tempered Glass with Auto-Dust Alignment Frame, Oleophobic Anti-Fingerprint Coating, and edge-to-edge impact protection.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Privacy-tempered-glass-for-apple-iphone-17-pro-max-black-Front-View.png',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Privacy-tempered-glass-for-apple-iphone-17-pro-max-black-Front-View.png',
        'https://img-prd-pim.poorvika.com/product/Privacy-tempered-glass-for-apple-iphone-17-pro-black-Front-View.png',
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
      Coating: 'Hydrophobic & Oleophobic Anti-Smudge Layer',
    },
  },

  // 31. Apple TechWoven Case With MagSafe
  {
    id: 'prod_apple_magsafe_case',
    name: 'Apple TechWoven Case With MagSafe ( Chambray Blue )',
    brand: 'Apple',
    category: 'mobile-accessories',
    price: 4900,
    mrp: 6900,
    stock: 32,
    description:
      'Designed by Apple with durable micro-twill woven finish, built-in N52 MagSafe magnet array for effortless wireless charging, and machined anodized aluminum buttons.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Apple-TechWoven-Case-With-MagSafe-For-iPhone-18-Pro-Max-Chambray-Blue-side-view.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Apple-TechWoven-Case-With-MagSafe-For-iPhone-18-Pro-Max-Chambray-Blue-side-view.webp',
        'https://img-prd-pim.poorvika.com/product/Apple-TechWoven-Case-With-MagSafe-For-iPhone-18-Pro-Max-Black-formt-view.webp',
        'https://img-prd-pim.poorvika.com/product/Apple-TechWoven-Case-With-MagSafe-For-iPhone-18-Pro-Max-Olive-side-view.webp',
      ],
      'Apple TechWoven MagSafe Case',
      'Apple',
      'mobile-accessories',
      '#3B82F6',
      '#18181B'
    ),
    colors: [
      { name: 'Chambray Blue', hex: '#3B82F6' },
      { name: 'Black', hex: '#18181B' },
      { name: 'Olive', hex: '#4D7C0F' },
    ],
    ramOptions: ['Standard'],
    storageOptions: ['Standard'],
    os: 'Accessory',
    is5G: false,
    isBestSeller: true,
    isFeatured: true,
    isNewRelease: true,
    rating: 4.8,
    reviewCount: 148,
    warranty: '1 Year Apple Warranty',
    exchangeBonus: 0,
    emiStartingAt: 299,
    specs: {
      Material: 'Premium TechWoven Micro-Twill + Recycled Post-Consumer Frame',
      Magnets: 'Integrated MagSafe & Qi2 Fast Wireless Charging Ring',
      Protection: 'Raised Camera Lip & Microfiber Inner Lining',
    },
  },

  // 32. Yarr Braided 60W Type-C to Type-C Cable
  {
    id: 'prod_yarr_braided_60w_cable',
    name: 'Yarr Braided YR777 60W Type C to Type C Cable ( Black )',
    brand: 'Yarr',
    category: 'chargers',
    price: 399,
    mrp: 599,
    stock: 95,
    description:
      'Heavy-duty Kevlar-braided 60W USB-C to USB-C PD Fast Charging & Data Sync cable tested for 15,000+ bends. Compatible with iPhone 15/16/17, Samsung, iPad, and MacBook.',
    mainImage:
      'https://img-prd-pim.poorvika.com/product/Yarr-braided-yr777-60w-type-c-to-type-c-cable-black-Front-View.webp',
    gallery: buildPoorvikaGallery(
      [
        'https://img-prd-pim.poorvika.com/product/Yarr-braided-yr777-60w-type-c-to-type-c-cable-black-Front-View.webp',
        'https://img-prd-pim.poorvika.com/product/Yarr-braided-yr888-60w-usb-to-type-c-cable-white-Front-View.webp',
      ],
      'Yarr 60W Braided Type-C Cable',
      'Yarr',
      'chargers',
      '#18181B',
      '#F8FAFC'
    ),
    colors: [
      { name: 'Black', hex: '#18181B' },
      { name: 'White', hex: '#F8FAFC' },
    ],
    ramOptions: ['Standard'],
    storageOptions: ['1.2 Meter'],
    os: 'Accessory',
    is5G: false,
    isBestSeller: true,
    isFeatured: false,
    isNewRelease: false,
    rating: 4.7,
    reviewCount: 410,
    warranty: '6 Months Replacement Warranty',
    exchangeBonus: 0,
    emiStartingAt: 199,
    specs: {
      Power: '60W (20V/3A) Power Delivery Fast Charge',
      DataTransfer: '480Mbps High-Speed Sync',
      Jacket: 'Tangle-Free Nylon Braided Armor',
    },
  },
];

export const INITIAL_BANNERS: HeroBanner[] = [
  {
    id: 'banner_samsung_s26_series',
    title: 'Samsung Galaxy S26 Ultra 5G · Galaxy AI is Here',
    subtitle:
      'Get up to ₹12,000 Instant Exchange Bonus + 24 Months No-Cost EMI at Charlie Mobile & Accessories.',
    tag: 'POORVIKA STYLE MEGA LAUNCH',
    ctaText: 'Buy Galaxy S26 Ultra',
    ctaLink: '/product/prod_samsung_s26_ultra',
    secondaryCtaText: 'View All Samsung',
    secondaryCtaLink: '/products?category=samsung',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/Samsung-Galaxy-S26-Series-galaxy-AI-phones-W1.webp',
    accentColor: '#F26522',
    enabled: true,
  },
  {
    id: 'banner_iphone_17_pro',
    title: 'Apple iPhone 17 Pro Max · Cosmic Orange Titanium',
    subtitle:
      'Available in Ready Stock at Charlie Mobile. Instant HDFC/ICICI Cashback + Easy Zero Down-Payment EMI.',
    tag: 'APPLE AUTHORIZED DEAL',
    ctaText: 'Shop iPhone 17 Series',
    ctaLink: '/product/prod_iphone_17_pro_max',
    secondaryCtaText: 'Explore Apple Store',
    secondaryCtaLink: '/products?category=iphone',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/iPhone17-Pro-Available-Now-WB-View4.webp',
    accentColor: '#F26522',
    enabled: true,
  },
  {
    id: 'banner_oppo_find_x9',
    title: 'Oppo Find & Reno 5G Series · 10% Instant Cashback',
    subtitle:
      'Experience Hasselblad Portrait Photography with Zero Down-Payment & Free Assured Gifts in-store.',
    tag: 'FESTIVAL CASHBACK FEST',
    ctaText: 'Shop Oppo 5G',
    ctaLink: '/products?category=oppo',
    secondaryCtaText: 'Check Exchange Deals',
    secondaryCtaLink: '/offers',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/Oppo-Find-X9-Series-Available-Now-10-Instant-Cashback-Web-02.webp',
    accentColor: '#F26522',
    enabled: true,
  },
  {
    id: 'banner_redmi_17_5g',
    title: 'Redmi Note 17 Pro Max & Redmi 17 5G Available Now',
    subtitle:
      '200MP OIS SuperNote starting with Easy EMI from ₹1,125/month at Charlie Mobile & Accessories.',
    tag: 'BEST SELLING 5G',
    ctaText: 'Shop Redmi 5G',
    ctaLink: '/products?category=redmi',
    secondaryCtaText: 'Locate Showroom',
    secondaryCtaLink: '/store',
    image:
      'https://img-prd-pim.poorvika.com/pageimg/REDMI-17-5G-Available-Now-W.webp',
    accentColor: '#F26522',
    enabled: true,
  },
];

export const INITIAL_COUPONS: Coupon[] = [
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
    title: '₹3,000 Off Flagship Phones',
    description:
      'Applicable on iPhone 17/16 Series, Galaxy S26 Ultra, Vivo V80 & OnePlus 13.',
    discountType: 'flat',
    discountValue: 3000,
    minOrderAmount: 65000,
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
  storeName: 'CHARLIE MOBILE',
  businessName: 'CHARLIE MOBILE & ACCESSORIES',
  tagline:
    'India’s Trusted Multi-Brand Smartphone, Gadget & Accessories Retail Store',
  address: 'Main Retail Showroom · Charlie Mobile & Accessories',
  city: 'Main Retail Hub',
  phone: '+91 8818850488',
  whatsappNumber: '918818850488',
  email: 'charliegedekar@gmail.com',
  openingHours: 'Mon – Sun: 10:00 AM – 9:30 PM',
  mapLink: 'https://maps.google.com',
  announcementText:
    'Poorvika-Style Mega Mobile Fest · Call/WhatsApp 8818850488 · 2-Hr Express Delivery & Store Pickup',
  bankOfferTitle:
    'Up to ₹10,000 Instant Bank Cashback & Zero Down-Payment EMI',
  bankOfferSubtitle:
    'HDFC · ICICI · SBI · Axis · Bajaj Finserv · IDFC First · Home Credit',
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
  instagramUrl: '',
  facebookUrl: '',
};

export const INITIAL_HOMEPAGE_SECTIONS: HomepageSectionConfig[] = [
  { id: 'shop_by_categories', title: 'Shop by Categories', enabled: true, order: 1 },
  { id: 'trending_categories', title: 'Trending Categories', enabled: true, order: 2 },
  { id: 'best_selling', title: 'Best Selling Smartphones', enabled: true, order: 3 },
  { id: 'top_brands', title: 'Shop By Mobile Brands', enabled: true, order: 4 },
  { id: 'latest_5g', title: '5G Smartphones', enabled: true, order: 5 },
  { id: 'shop_by_budget', title: 'Shop Mobile By Budget', enabled: true, order: 6 },
  { id: 'featured_categories', title: 'Featured Categories & Audio Comfort', enabled: true, order: 7 },
  { id: 'new_releases', title: 'New Releases', enabled: true, order: 8 },
  { id: 'accessories_by_brand', title: 'Shop Accessories By Brands', enabled: true, order: 9 },
  { id: 'flagship_smartphones', title: 'Flagship Smartphones', enabled: true, order: 10 },
  { id: 'best_camera', title: 'Best Camera Smartphones', enabled: true, order: 11 },
  { id: 'best_midrange', title: 'Best Budget & Mid-Range Smartphones', enabled: true, order: 12 },
  { id: 'mobile_accessories', title: 'Chargers, Power Banks, Cases & Screen Protectors', enabled: true, order: 13 },
  { id: 'smartwatches_wearables', title: 'Smartwatches & iPads', enabled: true, order: 14 },
  { id: 'exchange_emi_offers', title: 'Exchange & No-Cost EMI Offers', enabled: true, order: 15 },
  { id: 'store_experience', title: 'Visit Charlie Mobile & Accessories', enabled: true, order: 16 },
];
