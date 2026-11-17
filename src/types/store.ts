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
  videoUrl?: string;
  goldTagline?: string;
  bestsellerTab?: string;
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
  mediaType?: 'image' | 'video';
  videoUrl?: string;
  order?: number;
  accentColor: string;
  enabled: boolean;
  campaignEnd?: string;
}

export interface CelebrityReelItem {
  id: string;
  title: string;
  celebrityName?: string;
  videoUrl: string;
  posterUrl?: string;
  linkedProductId: string;
  enabled: boolean;
  order: number;
}

export interface VisualCardItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  avatarUrl: string;
  rating: number;
}

export interface BlogPostItem {
  id: string;
  title: string;
  excerpt?: string;
  image: string;
  ctaText: string;
  link: string;
}

export interface RewardLeadItem {
  id: string;
  phone: string;
  email: string;
  birthday: string;
  createdAt: string;
}

export interface NotifyMeRequestItem {
  id: string;
  productId: string;
  productName: string;
  customerContact: string;
  createdAt: string;
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
  mediaType?: 'image' | 'video';
}

export interface StoreSettings {
  storeName: string;
  businessName: string;
  tagline: string;
  logoUrl?: string;
  bannerIntervalSeconds?: number;
  festiveStripBannerUrl?: string;
  festiveStripBannerLink?: string;
  seasonalDealsTitle?: string;
  seasonalDealsSubtitle?: string;
  seasonalMainBannerUrl?: string;
  megaMenuCards?: VisualCardItem[];
  megaMenuBannerUrl?: string;
  megaMenuBannerTitle?: string;
  megaMenuBannerSubtitle?: string;
  megaMenuBannerLink?: string;
  luxuryGiftingBannerTitle?: string;
  luxuryGiftingBannerSubtitle?: string;
  luxuryGiftingBannerImage?: string;
  luxuryGiftingBannerLink?: string;
  brandStoryTitle?: string;
  brandStoryVideoUrl?: string;
  brandStoryPosterUrl?: string;
  rewardPopupEnabled?: boolean;
  rewardPopupTitle?: string;
  rewardPopupSubtitle?: string;
  rewardPopupImage?: string;
  rewardCouponCode?: string;
  bestsellerTabs?: string[];
  featuredFavouritesTitle?: string;
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
  youtubeUrl?: string;
}

export interface HomepageSectionConfig {
  id: string;
  title: string;
  subtitle?: string;
  enabled: boolean;
  order: number;
}

export interface SupportChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'admin';
  text: string;
  productId?: string;
  productName?: string;
  timestamp: string;
}

export interface SupportChatSession {
  userId: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  productId?: string;
  productName?: string;
  lastMessage: string;
  lastSender: 'user' | 'assistant' | 'admin';
  messageCount: number;
  updatedAt: string;
  messages: SupportChatMessage[];
}

export interface MobileUserSession {
  phone: string;
  name?: string;
  notifyOffers: boolean;
  signedInAt: string;
}
