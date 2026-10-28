export interface ColorVariant {
  name: string;
  hex: string;
  image?: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBuyer: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  mrp: number;
  stock: number;
  description: string;
  mainImage: string;
  gallery: string[];
  colors: ColorVariant[];
  ramOptions: string[];
  storageOptions: string[];
  os: 'iOS' | 'Android' | 'WearOS' | 'Accessory' | 'iPadOS';
  is5G: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  isNewRelease: boolean;
  isFlagship?: boolean;
  isBestCamera?: boolean;
  isMidRange?: boolean;
  rating: number;
  reviewCount: number;
  warranty: string;
  exchangeBonus: number;
  emiStartingAt: number;
  storagePriceStep?: number;
  specs: Record<string, string>;
  reviews?: ProductReview[];
  updatedAt?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  order: number;
  badge?: string;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  image: string;
  accentColor: string;
  enabled: boolean;
  campaignEnd?: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedRam: string;
  selectedStorage: string;
  unitPrice: number;
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  discountType: 'flat' | 'percentage';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  active: boolean;
}

export interface OrderItemRecord {
  productId: string;
  name: string;
  variant: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  city?: string;
  state?: string;
  pinCode?: string;
  deliveryMethod: 'store_pickup' | 'local_delivery' | 'shipping';
  paymentMethod: 'upi' | 'cod' | 'online';
  paymentStatus: 'pending_verification' | 'cod_due' | 'paid' | 'failed';
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItemRecord[];
  itemsSummary: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;
  upiReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShowroomPhoto {
  title: string;
  caption: string;
  src: string;
}

export interface StoreSettings {
  storeName: string;
  businessName: string;
  tagline: string;
  address: string;
  city: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  openingHours: string;
  mapLink: string;
  announcementText: string;
  bankOfferTitle?: string;
  bankOfferSubtitle?: string;
  exchangeMaxBonus?: number;
  emiStartingPrice?: number;
  codEnabled: boolean;
  onlinePaymentEnabled: boolean;
  storePickupEnabled: boolean;
  localDeliveryEnabled: boolean;
  shippingEnabled: boolean;
  upiId: string;
  cloudinaryCloudName?: string;
  cloudinaryUploadPreset?: string;
  showroomPhotos?: ShowroomPhoto[];
  instagramUrl?: string;
  facebookUrl?: string;
}

export interface HomepageSectionConfig {
  id: string;
  title: string;
  subtitle?: string;
  enabled: boolean;
  order: number;
}
