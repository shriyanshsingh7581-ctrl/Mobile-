import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  ADMIN_EMAIL,
  OperationType,
  auth,
  db,
  handleFirestoreError,
  isAuthorizedAdminEmail,
  signInWithGoogle,
  signOutUser,
} from '../lib/firebase';
import {
  INITIAL_BANNERS,
  INITIAL_BLOG_POSTS,
  INITIAL_CATEGORIES,
  INITIAL_CELEBRITY_REELS,
  INITIAL_COUPONS,
  INITIAL_HOMEPAGE_SECTIONS,
  INITIAL_PRODUCTS,
  INITIAL_SHOP_BY_NOTES,
  INITIAL_SHOP_BY_OCCASIONS,
  INITIAL_STORE_SETTINGS,
  INITIAL_TESTIMONIALS,
} from '../data/initialCatalog';
import {
  BlogPostItem,
  CartItem,
  CategoryItem,
  CelebrityReelItem,
  Coupon,
  HeroBanner,
  HomepageSectionConfig,
  MobileUserSession,
  NotifyMeRequestItem,
  Order,
  Product,
  RewardLeadItem,
  StoreSettings,
  SupportChatMessage,
  SupportChatSession,
  TestimonialItem,
  VisualCardItem,
} from '../types/store';

interface StoreContextValue {
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  products: Product[];
  categories: CategoryItem[];
  banners: HeroBanner[];
  celebrityReels: CelebrityReelItem[];
  shopByNotes: VisualCardItem[];
  shopByOccasions: VisualCardItem[];
  testimonials: TestimonialItem[];
  blogPosts: BlogPostItem[];
  rewardLeads: RewardLeadItem[];
  notifyMeRequests: NotifyMeRequestItem[];
  coupons: Coupon[];
  orders: Order[];
  storeSettings: StoreSettings;
  homepageSections: HomepageSectionConfig[];
  cart: CartItem[];
  savedForLater: CartItem[];
  wishlist: string[];
  recentSearches: string[];
  appliedCoupon: Coupon | null;
  selectedCity: string;
  toastMessage: string | null;
  activeNotifyModalProduct: Product | null;
  setActiveNotifyModalProduct: (product: Product | null) => void;
  rewardModalOpen: boolean;
  setRewardModalOpen: (open: boolean) => void;
  loginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  chatbotOpen: boolean;
  setChatbotOpen: (open: boolean) => void;
  mobileUser: MobileUserSession | null;
  supportChats: SupportChatSession[];
  activeChatUserId: string;
  chatLoading: boolean;
  setSelectedCity: (city: string) => void;
  showToast: (msg: string) => void;
  loginWithGoogle: () => Promise<void>;
  signInWithMobileNumber: (phone: string, notifyOffers: boolean) => Promise<void>;
  logout: () => Promise<void>;
  addProductReview: (
    productId: string,
    review: { author: string; rating: number; comment: string }
  ) => void;
  sendSupportChatMessage: (params: { text: string; product?: Product | null }) => Promise<void>;
  sendAdminChatReply: (chatUserId: string, text: string) => Promise<void>;
  deleteSupportChat: (chatUserId: string) => Promise<void>;
  refreshSupportChats: () => Promise<void>;
  addToCart: (
    product: Product,
    quantity?: number,
    color?: string,
    ram?: string,
    storage?: string
  ) => void;
  updateCartQuantity: (productId: string, variantKey: string, delta: number) => void;
  removeFromCart: (productId: string, variantKey: string) => void;
  moveToSavedForLater: (item: CartItem) => void;
  moveToCartFromSaved: (item: CartItem) => void;
  removeSavedItem: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;
  placeOrder: (
    orderInput: Omit<Order, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => Promise<Order>;
  // Admin Actions
  saveProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  saveCategory: (category: CategoryItem) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  saveBanner: (banner: HeroBanner) => Promise<void>;
  deleteBanner: (bannerId: string) => Promise<void>;
  reorderBanners: (nextBanners: HeroBanner[]) => void;
  saveCelebrityReel: (reel: CelebrityReelItem) => void;
  deleteCelebrityReel: (reelId: string) => void;
  reorderCelebrityReels: (nextReels: CelebrityReelItem[]) => void;
  saveShopByNotes: (items: VisualCardItem[]) => void;
  saveShopByOccasions: (items: VisualCardItem[]) => void;
  saveTestimonials: (items: TestimonialItem[]) => void;
  saveBlogPosts: (items: BlogPostItem[]) => void;
  submitRewardLead: (lead: Omit<RewardLeadItem, 'id' | 'createdAt'>) => void;
  deleteRewardLead: (id: string) => void;
  submitNotifyMeRequest: (req: Omit<NotifyMeRequestItem, 'id' | 'createdAt'>) => void;
  deleteNotifyMeRequest: (id: string) => void;
  updateOrderStatus: (
    orderId: string,
    status: Order['status'],
    paymentStatus?: Order['paymentStatus']
  ) => Promise<void>;
  updateStoreSettings: (settings: StoreSettings) => Promise<void>;
  updateHomepageSections: (sections: HomepageSectionConfig[]) => void;
  saveCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  resetCatalogToDefaults: () => void;
  openWhatsAppEnquiry: (params: {
    productName?: string;
    productId?: string;
    price?: number;
    variant?: string;
    quantity?: number;
    orderId?: string;
    customerName?: string;
    customerPhone?: string;
    shippingAddress?: string;
    deliveryMethod?: string;
    paymentMethod?: string;
    customMessage?: string;
  }) => void;
  sendOrderViaWhatsApp: (order: Order) => void;
  sendCartOrderViaWhatsApp: (customerInfo?: {
    customerName?: string;
    customerPhone?: string;
    shippingAddress?: string;
    deliveryMethod?: string;
    paymentMethod?: string;
  }) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function getVariantKey(item: {
  productId: string;
  selectedColor: string;
  selectedRam: string;
  selectedStorage: string;
}): string {
  return `${item.productId}__${item.selectedColor}__${item.selectedRam}__${item.selectedStorage}`;
}

const STORAGE_KEYS = {
  CART: 'charlie_luxury_cart_v6',
  SAVED: 'charlie_luxury_saved_v6',
  WISHLIST: 'charlie_luxury_wishlist_v6',
  SEARCHES: 'charlie_luxury_searches_v6',
  PRODUCTS: 'charlie_luxury_products_v6',
  CATEGORIES: 'charlie_luxury_categories_v6',
  BANNERS: 'charlie_luxury_banners_v6',
  REELS: 'charlie_luxury_reels_v6',
  NOTES: 'charlie_luxury_notes_v6',
  OCCASIONS: 'charlie_luxury_occasions_v6',
  TESTIMONIALS: 'charlie_luxury_testimonials_v6',
  BLOGS: 'charlie_luxury_blogs_v6',
  REWARD_LEADS: 'charlie_luxury_reward_leads_v6',
  NOTIFY_REQUESTS: 'charlie_luxury_notify_requests_v6',
  SETTINGS: 'charlie_luxury_settings_v6',
  SECTIONS: 'charlie_luxury_sections_v6',
  COUPONS: 'charlie_luxury_coupons_v6',
  ORDERS: 'charlie_luxury_orders_v6',
  CITY: 'charlie_luxury_city_v6',
  MOBILE_USER: 'charlie_luxury_mobile_user_v1',
  SUPPORT_CHATS: 'charlie_luxury_support_chats_v1',
  GUEST_CHAT_ID: 'charlie_luxury_guest_chat_id_v1',
};

function loadLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const [products, setProducts] = useState<Product[]>(() =>
    loadLocal(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS)
  );
  const [categories, setCategories] = useState<CategoryItem[]>(() =>
    loadLocal(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES)
  );
  const [banners, setBanners] = useState<HeroBanner[]>(() =>
    loadLocal(STORAGE_KEYS.BANNERS, INITIAL_BANNERS)
  );
  const [celebrityReels, setCelebrityReels] = useState<CelebrityReelItem[]>(() =>
    loadLocal(STORAGE_KEYS.REELS, INITIAL_CELEBRITY_REELS)
  );
  const [shopByNotes, setShopByNotes] = useState<VisualCardItem[]>(() =>
    loadLocal(STORAGE_KEYS.NOTES, INITIAL_SHOP_BY_NOTES)
  );
  const [shopByOccasions, setShopByOccasions] = useState<VisualCardItem[]>(() =>
    loadLocal(STORAGE_KEYS.OCCASIONS, INITIAL_SHOP_BY_OCCASIONS)
  );
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(() =>
    loadLocal(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS)
  );
  const [blogPosts, setBlogPosts] = useState<BlogPostItem[]>(() =>
    loadLocal(STORAGE_KEYS.BLOGS, INITIAL_BLOG_POSTS)
  );
  const [rewardLeads, setRewardLeads] = useState<RewardLeadItem[]>(() =>
    loadLocal(STORAGE_KEYS.REWARD_LEADS, [])
  );
  const [notifyMeRequests, setNotifyMeRequests] = useState<NotifyMeRequestItem[]>(() =>
    loadLocal(STORAGE_KEYS.NOTIFY_REQUESTS, [])
  );
  const [coupons, setCoupons] = useState<Coupon[]>(() =>
    loadLocal(STORAGE_KEYS.COUPONS, INITIAL_COUPONS)
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    loadLocal(STORAGE_KEYS.ORDERS, [])
  );
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() =>
    loadLocal(STORAGE_KEYS.SETTINGS, INITIAL_STORE_SETTINGS)
  );
  const [homepageSections, setHomepageSections] = useState<HomepageSectionConfig[]>(() =>
    loadLocal(STORAGE_KEYS.SECTIONS, INITIAL_HOMEPAGE_SECTIONS)
  );

  const [cart, setCart] = useState<CartItem[]>(() => loadLocal(STORAGE_KEYS.CART, []));
  const [savedForLater, setSavedForLater] = useState<CartItem[]>(() =>
    loadLocal(STORAGE_KEYS.SAVED, [])
  );
  const [wishlist, setWishlist] = useState<string[]>(() =>
    loadLocal(STORAGE_KEYS.WISHLIST, ['prod_realme_narzo_100_lite', 'prod_samsung_galaxy_a08'])
  );
  const [recentSearches, setRecentSearches] = useState<string[]>(() =>
    loadLocal(STORAGE_KEYS.SEARCHES, ['Sony PlayStation 5', 'Vivo V80 5G', 'iPhone 17 Pro Max', 'HP Victus Gaming'])
  );
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [selectedCity, setSelectedCityState] = useState<string>(() =>
    loadLocal(STORAGE_KEYS.CITY, 'RAIPUR')
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeNotifyModalProduct, setActiveNotifyModalProduct] = useState<Product | null>(null);
  const [rewardModalOpen, setRewardModalOpen] = useState<boolean>(false);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [chatbotOpen, setChatbotOpen] = useState<boolean>(false);
  const [mobileUser, setMobileUser] = useState<MobileUserSession | null>(() =>
    loadLocal<MobileUserSession | null>(STORAGE_KEYS.MOBILE_USER, null)
  );
  const [supportChats, setSupportChats] = useState<SupportChatSession[]>(() =>
    loadLocal<SupportChatSession[]>(STORAGE_KEYS.SUPPORT_CHATS, [])
  );
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  const [guestChatId] = useState<string>(() => {
    try {
      const existing = localStorage.getItem(STORAGE_KEYS.GUEST_CHAT_ID);
      if (existing) return existing;
      const created = `guest_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
      localStorage.setItem(STORAGE_KEYS.GUEST_CHAT_ID, created);
      return created;
    } catch {
      return `guest_${Date.now().toString(36)}`;
    }
  });

  const activeChatUserId = user?.uid || (mobileUser?.phone ? `mobile_${mobileUser.phone}` : guestChatId);

  const isAdmin = useMemo(() => {
    if (!user) return false;
    return isAuthorizedAdminEmail(user.email) || user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const setSelectedCity = (city: string) => {
    setSelectedCityState(city);
    localStorage.setItem(STORAGE_KEYS.CITY, JSON.stringify(city));
    showToast(`Delivery location updated to ${city}`);
  };

  // Persist local state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(savedForLater));
  }, [savedForLater]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SEARCHES, JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REELS, JSON.stringify(celebrityReels));
  }, [celebrityReels]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(shopByNotes));
  }, [shopByNotes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OCCASIONS, JSON.stringify(shopByOccasions));
  }, [shopByOccasions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(blogPosts));
  }, [blogPosts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REWARD_LEADS, JSON.stringify(rewardLeads));
  }, [rewardLeads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFY_REQUESTS, JSON.stringify(notifyMeRequests));
  }, [notifyMeRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(storeSettings));
  }, [storeSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(homepageSections));
  }, [homepageSections]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (mobileUser) {
      localStorage.setItem(STORAGE_KEYS.MOBILE_USER, JSON.stringify(mobileUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.MOBILE_USER);
    }
  }, [mobileUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUPPORT_CHATS, JSON.stringify(supportChats));
  }, [supportChats]);

  // Cross-tab BroadcastChannel sync + server REST polling for instant live guest/admin AI chat monitoring
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel('charlie_support_chats_sync');
    channel.onmessage = (event) => {
      if (event.data && Array.isArray(event.data.sessions)) {
        setSupportChats(event.data.sessions);
      }
    };
    return () => channel.close();
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // Sync Firestore Orders for authenticated user or admin
  useEffect(() => {
    if (!authReady || !user) return;
    const ordersPath = 'orders';
    const q = isAdmin
      ? query(collection(db, ordersPath))
      : query(collection(db, ordersPath), where('userId', '==', user.uid));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteOrders: Order[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              userId: String(data.userId || ''),
              customerName: String(data.customerName || ''),
              customerPhone: String(data.customerPhone || ''),
              customerEmail: String(data.customerEmail || ''),
              shippingAddress: String(data.shippingAddress || ''),
              deliveryMethod: (data.deliveryMethod || 'store_pickup') as Order['deliveryMethod'],
              paymentMethod: (data.paymentMethod || 'cod') as Order['paymentMethod'],
              paymentStatus: (data.paymentStatus || 'cod_due') as Order['paymentStatus'],
              status: (data.status || 'pending') as Order['status'],
              items: [],
              itemsSummary: String(data.itemsSummary || ''),
              subtotal: Number(data.subtotal || 0),
              discount: Number(data.discount || 0),
              deliveryFee: Number(data.deliveryFee || 0),
              totalAmount: Number(data.totalAmount || 0),
              createdAt: data.createdAt?.toDate
                ? data.createdAt.toDate().toISOString()
                : String(data.createdAt || new Date().toISOString()),
              updatedAt: data.updatedAt?.toDate
                ? data.updatedAt.toDate().toISOString()
                : String(data.updatedAt || new Date().toISOString()),
            };
          });
          setOrders((prev) => {
            const map = new Map<string, Order>();
            prev.forEach((o) => map.set(o.id, o));
            remoteOrders.forEach((ro) => {
              const existingLocal = map.get(ro.id);
              map.set(ro.id, {
                ...ro,
                items: existingLocal?.items || [],
              });
            });
            return Array.from(map.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, ordersPath);
      }
    );

    return () => unsub();
  }, [authReady, user, isAdmin]);

  // Sync Firestore Live AI Support Chats (for verified user or admin)
  useEffect(() => {
    if (!authReady || !user) return;
    const chatsQuery = isAdmin
      ? query(collection(db, 'support_chats'))
      : query(collection(db, 'support_chats'), where('userId', '==', user.uid));

    const messageUnsubs = new Map<string, () => void>();

    const unsubSessions = onSnapshot(
      chatsQuery,
      (snapshot) => {
        snapshot.docs.forEach((sessionDoc) => {
          const d = sessionDoc.data();
          const chatId = sessionDoc.id;

          setSupportChats((prev) => {
            const existing = prev.find((s) => s.userId === chatId);
            const mergedSession: SupportChatSession = {
              userId: chatId,
              customerName: String(d.customerName || existing?.customerName || 'Shopper'),
              customerPhone: String(d.customerPhone || existing?.customerPhone || ''),
              customerEmail: String(d.customerEmail || existing?.customerEmail || ''),
              productId: String(d.productId || existing?.productId || ''),
              productName: String(d.productName || existing?.productName || ''),
              lastMessage: String(d.lastMessage || existing?.lastMessage || ''),
              lastSender: (d.lastSender || existing?.lastSender || 'user') as SupportChatSession['lastSender'],
              messageCount: Number(d.messageCount || existing?.messageCount || 0),
              updatedAt: d.updatedAt?.toDate
                ? d.updatedAt.toDate().toISOString()
                : String(d.updatedAt || existing?.updatedAt || new Date().toISOString()),
              messages: existing?.messages || [],
            };
            const others = prev.filter((s) => s.userId !== chatId);
            return [mergedSession, ...others].sort(
              (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
          });

          if (!messageUnsubs.has(chatId)) {
            const msgQuery = query(
              collection(db, 'support_chats', chatId, 'messages'),
              orderBy('timestamp', 'asc')
            );
            const msgUnsub = onSnapshot(
              msgQuery,
              (msgSnap) => {
                const remoteMessages: SupportChatMessage[] = msgSnap.docs.map((m) => {
                  const md = m.data();
                  return {
                    id: String(md.id || m.id),
                    sender: (md.sender || 'user') as SupportChatMessage['sender'],
                    text: String(md.text || ''),
                    productId: String(md.productId || ''),
                    productName: String(md.productName || ''),
                    timestamp: md.timestamp?.toDate
                      ? md.timestamp.toDate().toISOString()
                      : String(md.timestamp || new Date().toISOString()),
                  };
                });
                if (remoteMessages.length > 0) {
                  setSupportChats((prev) =>
                    prev.map((s) => {
                      if (s.userId !== chatId) return s;
                      const map = new Map<string, SupportChatMessage>();
                      s.messages.forEach((m) => map.set(m.id, m));
                      remoteMessages.forEach((rm) => map.set(rm.id, rm));
                      const mergedMsgs = Array.from(map.values()).sort(
                        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                      );
                      return { ...s, messages: mergedMsgs, messageCount: mergedMsgs.length };
                    })
                  );
                }
              },
              (err) => {
                console.warn('Support chat message sync notice:', err.message);
              }
            );
            messageUnsubs.set(chatId, msgUnsub);
          }
        });
      },
      (err) => {
        console.warn('Support chat session sync notice:', err.message);
      }
    );

    return () => {
      unsubSessions();
      messageUnsubs.forEach((fn) => fn());
      messageUnsubs.clear();
    };
  }, [authReady, user, isAdmin]);

  const refreshSupportChats = async () => {
    try {
      const res = await fetch('/api/support-chats');
      if (!res.ok) return;
      const data = (await res.json()) as { sessions?: SupportChatSession[] };
      if (Array.isArray(data.sessions) && data.sessions.length > 0) {
        setSupportChats((prev) => {
          const map = new Map<string, SupportChatSession>();
          prev.forEach((s) => map.set(s.userId, s));
          data.sessions!.forEach((rs) => {
            const existing = map.get(rs.userId);
            if (!existing) {
              map.set(rs.userId, rs);
            } else {
              const msgMap = new Map<string, SupportChatMessage>();
              existing.messages.forEach((m) => msgMap.set(m.id, m));
              rs.messages.forEach((m) => msgMap.set(m.id, m));
              const mergedMsgs = Array.from(msgMap.values()).sort(
                (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
              );
              map.set(rs.userId, {
                ...existing,
                ...rs,
                messages: mergedMsgs,
                messageCount: mergedMsgs.length,
              });
            }
          });
          return Array.from(map.values()).sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        });
      }
    } catch {
      // Ignore offline/static hosting 404
    }
  };

  const loginWithGoogle = async () => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      showToast('You appear to be offline. Please check your internet connection and try again.');
      return;
    }
    try {
      const result = await signInWithGoogle();
      if (result.user) {
        const u = result.user;
        const userRef = doc(db, 'users', u.uid);
        try {
          await setDoc(
            userRef,
            {
              uid: u.uid,
              displayName: (u.displayName || 'Charlie Customer').slice(0, 120),
              email: (u.email || '').slice(0, 160),
              phone: (mobileUser?.phone || u.phoneNumber || '').slice(0, 24),
              savedAddress: '',
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${u.uid}`);
        }
        showToast(`Welcome back, ${u.displayName || u.email}!`);
      }
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || '';
      console.warn('Google sign-in interrupted:', code || err);
      if (code === 'auth/network-request-failed') {
        showToast(
          'Network error connecting to Google Sign-In. Allow popups/third-party cookies or check your connection.'
        );
      } else if (code === 'auth/popup-blocked') {
        showToast('Sign-in popup was blocked by your browser. Please allow popups and try again.');
      } else if (code === 'auth/unauthorized-domain') {
        showToast('This domain is not authorized for Google Sign-In. Add it in Firebase Auth settings.');
      } else {
        showToast('Sign-in popup was closed or cancelled.');
      }
    }
  };

  const signInWithMobileNumber = async (phone: string, notifyOffers: boolean) => {
    const digits = phone.replace(/[^0-9]/g, '').slice(-10);
    if (digits.length < 10) {
      showToast('Please enter a valid 10-digit mobile number.');
      return;
    }
    const formattedPhone = `+91 ${digits}`;
    const session: MobileUserSession = {
      phone: digits,
      name: user?.displayName || `Member ${digits.slice(-4)}`,
      notifyOffers,
      signedInAt: new Date().toISOString(),
    };
    setMobileUser(session);

    if (notifyOffers) {
      setRewardLeads((prev) => {
        if (prev.some((l) => l.phone === formattedPhone)) return prev;
        return [
          {
            id: `lead_${Date.now()}`,
            phone: formattedPhone,
            email: user?.email || '',
            birthday: '',
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ];
      });
    }

    if (user && user.emailVerified) {
      try {
        await setDoc(
          doc(db, 'users', user.uid),
          {
            uid: user.uid,
            displayName: (user.displayName || `Member ${digits.slice(-4)}`).slice(0, 120),
            email: (user.email || '').slice(0, 160),
            phone: formattedPhone.slice(0, 24),
            savedAddress: '',
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err) {
        console.warn('Could not sync mobile number to user profile:', err);
      }
    }

    setLoginModalOpen(false);
    showToast(`Signed in with ${formattedPhone}! Exclusive deals unlocked.`);
  };

  const logout = async () => {
    await signOutUser();
    setMobileUser(null);
    showToast('Signed out of your Charlie Mobile account.');
  };

  const addProductReview = (
    productId: string,
    review: { author: string; rating: number; comment: string }
  ) => {
    const nowDate = new Date().toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
    const newReview = {
      id: `rev_${Date.now()}`,
      author: review.author.trim() || 'Anonymous',
      rating: Math.max(1, Math.min(5, review.rating)),
      date: nowDate,
      comment: review.comment.trim(),
      verifiedBuyer: true,
    };
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const existingReviews = p.reviews || [];
        const updatedReviews = [newReview, ...existingReviews];
        const nextCount = (p.reviewCount || existingReviews.length || 44) + 1;
        const avg =
          updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length;
        return {
          ...p,
          reviews: updatedReviews,
          reviewCount: nextCount,
          rating: Number(((p.rating * 0.7) + avg * 0.3).toFixed(2)),
        };
      })
    );
    showToast('Thank you! Your verified review has been published.');
  };

  const persistSupportChatMessage = async (
    chatUserId: string,
    msg: SupportChatMessage,
    meta: {
      customerName: string;
      customerPhone?: string;
      customerEmail?: string;
      productId?: string;
      productName?: string;
    }
  ) => {
    let updatedList: SupportChatSession[] = [];
    setSupportChats((prev) => {
      const existing = prev.find((s) => s.userId === chatUserId);
      const prevMessages = existing?.messages || [];
      const nextMessages = prevMessages.some((m) => m.id === msg.id)
        ? prevMessages
        : [...prevMessages, msg];
      const nextSession: SupportChatSession = {
        userId: chatUserId,
        customerName: meta.customerName || existing?.customerName || 'Shopper',
        customerPhone: meta.customerPhone || existing?.customerPhone || '',
        customerEmail: meta.customerEmail || existing?.customerEmail || '',
        productId: meta.productId || existing?.productId || '',
        productName: meta.productName || existing?.productName || '',
        lastMessage: msg.text.slice(0, 500),
        lastSender: msg.sender,
        messageCount: nextMessages.length,
        updatedAt: msg.timestamp,
        messages: nextMessages,
      };
      updatedList = [nextSession, ...prev.filter((s) => s.userId !== chatUserId)].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      if (typeof BroadcastChannel !== 'undefined') {
        try {
          const ch = new BroadcastChannel('charlie_support_chats_sync');
          ch.postMessage({ sessions: updatedList });
          ch.close();
        } catch {
          // ignore
        }
      }
      return updatedList;
    });

    // Server live store sync
    fetch('/api/support-chats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: chatUserId,
        customerName: meta.customerName,
        customerPhone: meta.customerPhone,
        customerEmail: meta.customerEmail,
        productId: meta.productId,
        productName: meta.productName,
        message: msg,
      }),
    }).catch(() => {
      // Ignore if static build without backend server
    });

    // Firestore real-time sync under /support_chats/{userId}
    if (user && user.emailVerified && (user.uid === chatUserId || isAdmin)) {
      const cleanSessionId = chatUserId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
      const cleanMsgId = msg.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
      try {
        await setDoc(doc(db, 'support_chats', cleanSessionId), {
          userId: cleanSessionId,
          customerName: (meta.customerName || 'Shopper').slice(0, 120),
          customerPhone: (meta.customerPhone || '').slice(0, 24),
          customerEmail: (meta.customerEmail || '').slice(0, 160),
          productId: (meta.productId || '').slice(0, 128),
          productName: (meta.productName || '').slice(0, 180),
          lastMessage: msg.text.slice(0, 500),
          lastSender: msg.sender,
          messageCount: updatedList.find((s) => s.userId === chatUserId)?.messageCount || 1,
          updatedAt: serverTimestamp(),
        });
        await setDoc(doc(db, 'support_chats', cleanSessionId, 'messages', cleanMsgId), {
          id: cleanMsgId,
          sender: msg.sender,
          text: msg.text.slice(0, 2000),
          productId: (msg.productId || '').slice(0, 128),
          productName: (msg.productName || '').slice(0, 180),
          timestamp: serverTimestamp(),
        });
      } catch (err) {
        console.warn('Firestore chat sync warning:', err);
      }
    }
  };

  const sendSupportChatMessage = async ({
    text,
    product,
  }: {
    text: string;
    product?: Product | null;
  }) => {
    const cleanText = text.trim();
    if (!cleanText || chatLoading) return;

    const chatUserId = activeChatUserId;
    const customerName =
      user?.displayName ||
      (mobileUser?.phone ? `Member +91 ${mobileUser.phone}` : 'Guest Shopper');
    const customerPhone = mobileUser?.phone ? `+91 ${mobileUser.phone}` : user?.phoneNumber || '';
    const customerEmail = user?.email || '';

    const userMsg: SupportChatMessage = {
      id: `msg_u_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      sender: 'user',
      text: cleanText,
      productId: product?.id || '',
      productName: product?.name || '',
      timestamp: new Date().toISOString(),
    };

    const meta = {
      customerName,
      customerPhone,
      customerEmail,
      productId: product?.id || '',
      productName: product?.name || '',
    };

    await persistSupportChatMessage(chatUserId, userMsg, meta);
    setChatLoading(true);

    try {
      const currentSession = supportChats.find((s) => s.userId === chatUserId);
      const historyTurns = [
        ...(currentSession?.messages || []).map((m) => ({
          role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
          content: m.text,
        })),
        { role: 'user' as const, content: cleanText },
      ].slice(-10);

      const catalogSummary = products
        .slice(0, 8)
        .map((p) => `${p.name} (${formatINR(p.price)})`)
        .join(', ');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyTurns,
          productContext: product
            ? {
                id: product.id,
                name: product.name,
                brand: product.brand,
                category: product.category,
                price: product.price,
                mrp: product.mrp,
                warranty: product.warranty,
                exchangeBonus: product.exchangeBonus,
                emiStartingAt: product.emiStartingAt,
                description: product.description,
                specs: product.specs,
              }
            : null,
          storeContext: {
            storeName: storeSettings.storeName,
            whatsappNumber: storeSettings.whatsappNumber,
            address: storeSettings.address,
            coupons: coupons.filter((c) => c.active).map((c) => ({ code: c.code, title: c.title })),
            catalogSummary,
          },
        }),
      });

      let replyText = '';
      if (response.ok) {
        const data = (await response.json()) as { reply?: string };
        replyText = data.reply?.trim() || '';
      }

      if (!replyText) {
        replyText = product
          ? `Thank you for asking about ${product.name}! It is available at ${formatINR(
              product.price
            )} (5% Extra Off on Prepaid Orders + up to ${formatINR(
              product.exchangeBonus
            )} exchange bonus). Tap "Order on WhatsApp" or reply here if you need EMI or delivery timing details.`
          : `Welcome to ${storeSettings.storeName}! You can enjoy 5% extra savings on prepaid orders, 100% genuine GST billing, and zero-cost EMI. Let me know which smartphone or accessory you are exploring!`;
      }

      const botMsg: SupportChatMessage = {
        id: `msg_b_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        sender: 'assistant',
        text: replyText,
        productId: product?.id || '',
        productName: product?.name || '',
        timestamp: new Date().toISOString(),
      };

      await persistSupportChatMessage(chatUserId, botMsg, meta);
    } catch {
      const fallbackMsg: SupportChatMessage = {
        id: `msg_b_${Date.now()}`,
        sender: 'assistant',
        text: `Thank you for your question! Please message our Charlie Mobile Concierge on WhatsApp (${storeSettings.whatsappNumber}) or try again in a moment for instant AI assistance.`,
        productId: product?.id || '',
        productName: product?.name || '',
        timestamp: new Date().toISOString(),
      };
      await persistSupportChatMessage(chatUserId, fallbackMsg, meta);
    } finally {
      setChatLoading(false);
    }
  };

  const sendAdminChatReply = async (chatUserId: string, text: string) => {
    const cleanText = text.trim();
    if (!cleanText) return;
    const existing = supportChats.find((s) => s.userId === chatUserId);
    const adminMsg: SupportChatMessage = {
      id: `msg_a_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      sender: 'admin',
      text: cleanText,
      productId: existing?.productId || '',
      productName: existing?.productName || '',
      timestamp: new Date().toISOString(),
    };
    await persistSupportChatMessage(chatUserId, adminMsg, {
      customerName: existing?.customerName || 'Shopper',
      customerPhone: existing?.customerPhone,
      customerEmail: existing?.customerEmail,
      productId: existing?.productId,
      productName: existing?.productName,
    });
    showToast('Concierge reply sent to customer');
  };

  const deleteSupportChat = async (chatUserId: string) => {
    setSupportChats((prev) => prev.filter((s) => s.userId !== chatUserId));
    if (user && isAdmin) {
      try {
        await deleteDoc(doc(db, 'support_chats', chatUserId));
      } catch {
        // ignore if local-only
      }
    }
    showToast('Chat thread removed');
  };

  const addToCart = (
    product: Product,
    quantity = 1,
    color?: string,
    ram?: string,
    storage?: string
  ) => {
    const selectedColor = color || product.colors[0]?.name || 'Standard';
    const selectedRam = ram || product.ramOptions[0] || 'Standard';
    const selectedStorage = storage || product.storageOptions[0] || 'Standard';

    // Calculate storage price bump if non-base storage is chosen
    const storageIndex = Math.max(0, product.storageOptions.indexOf(selectedStorage));
    const stepAmount = product.storagePriceStep !== undefined ? product.storagePriceStep : 10000;
    const unitPrice = product.price + storageIndex * stepAmount;

    setCart((prev) => {
      const targetKey = getVariantKey({
        productId: product.id,
        selectedColor,
        selectedRam,
        selectedStorage,
      });
      const existingIdx = prev.findIndex((item) => getVariantKey(item) === targetKey);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity,
        };
        return updated;
      }
      return [
        ...prev,
        {
          productId: product.id,
          product,
          quantity,
          selectedColor,
          selectedRam,
          selectedStorage,
          unitPrice,
        },
      ];
    });
    showToast(`Added ${product.name} (${selectedColor}) to Cart`);
  };

  const updateCartQuantity = (productId: string, variantKey: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (getVariantKey(item) !== variantKey && item.productId !== productId) return item;
          const nextQty = item.quantity + delta;
          return nextQty > 0 ? { ...item, quantity: nextQty } : null;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string, variantKey: string) => {
    setCart((prev) =>
      prev.filter((item) => getVariantKey(item) !== variantKey && item.productId !== productId)
    );
    showToast('Item removed from cart');
  };

  const moveToSavedForLater = (item: CartItem) => {
    const key = getVariantKey(item);
    setCart((prev) => prev.filter((i) => getVariantKey(i) !== key));
    setSavedForLater((prev) => {
      if (prev.some((i) => getVariantKey(i) === key)) return prev;
      return [...prev, item];
    });
    showToast('Saved for later');
  };

  const moveToCartFromSaved = (item: CartItem) => {
    const key = getVariantKey(item);
    setSavedForLater((prev) => prev.filter((i) => getVariantKey(i) !== key));
    addToCart(item.product, item.quantity, item.selectedColor, item.selectedRam, item.selectedStorage);
  };

  const removeSavedItem = (productId: string) => {
    setSavedForLater((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      showToast(exists ? 'Removed from Wishlist' : 'Saved to Wishlist');
      return next;
    });
  };

  const applyCouponCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === clean && c.active);
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    if (subtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `Minimum order of ${formatINR(found.minOrderAmount)} required for ${found.code}.`,
      };
    }
    setAppliedCoupon(found);
    showToast(`Coupon ${found.code} applied!`);
    return { success: true, message: `${found.title} applied!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  const addRecentSearch = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    setRecentSearches((prev) => [clean, ...prev.filter((t) => t.toLowerCase() !== clean.toLowerCase())].slice(0, 8));
  };

  const clearRecentSearches = () => setRecentSearches([]);

  const placeOrder = async (
    orderInput: Omit<Order, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<Order> => {
    const id = `ORD-${Date.now().toString().slice(-6)}`;
    const nowIso = new Date().toISOString();
    const newOrder: Order = {
      ...orderInput,
      id,
      userId: user?.uid || 'guest_customer',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    setOrders((prev) => [newOrder, ...prev]);

    if (user && user.emailVerified) {
      const orderRef = doc(db, 'orders', id);
      try {
        await setDoc(orderRef, {
          userId: user.uid,
          customerName: newOrder.customerName.slice(0, 120),
          customerPhone: newOrder.customerPhone.slice(0, 24),
          customerEmail: (newOrder.customerEmail || user.email || '').slice(0, 160),
          shippingAddress: newOrder.shippingAddress.slice(0, 500),
          deliveryMethod: newOrder.deliveryMethod,
          paymentMethod: newOrder.paymentMethod,
          paymentStatus: newOrder.paymentStatus,
          status: 'pending',
          itemsSummary: newOrder.itemsSummary.slice(0, 2000),
          subtotal: Math.max(0, newOrder.subtotal),
          discount: Math.max(0, newOrder.discount),
          deliveryFee: Math.max(0, newOrder.deliveryFee),
          totalAmount: Math.max(0, newOrder.totalAmount),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `orders/${id}`);
      }
    }

    clearCart();
    return newOrder;
  };

  // Admin CRUD operations (local + Firestore sync when admin is logged in)
  const saveProduct = async (product: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      return exists ? prev.map((p) => (p.id === product.id ? product : p)) : [product, ...prev];
    });

    if (user && isAdmin) {
      const cleanId = product.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
      try {
        await setDoc(doc(db, 'products', cleanId), {
          name: product.name.slice(0, 160),
          brand: product.brand.slice(0, 60),
          category: product.category.slice(0, 60),
          price: Math.max(0, Number(product.price)),
          mrp: Math.max(Number(product.price), Number(product.mrp)),
          stock: Math.max(0, Number(product.stock)),
          description: (product.description || '').slice(0, 2000),
          mainImage: (product.mainImage || 'default').slice(0, 1000),
          is5G: Boolean(product.is5G),
          isBestSeller: Boolean(product.isBestSeller),
          isFeatured: Boolean(product.isFeatured),
          isNewRelease: Boolean(product.isNewRelease),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `products/${cleanId}`);
      }
    }
    showToast(`Saved product: ${product.name}`);
  };

  const deleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (user && isAdmin) {
      try {
        await deleteDoc(doc(db, 'products', productId));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `products/${productId}`);
      }
    }
    showToast('Product deleted');
  };

  const saveCategory = async (category: CategoryItem) => {
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === category.id);
      const next = exists ? prev.map((c) => (c.id === category.id ? category : c)) : [...prev, category];
      return next.sort((a, b) => a.order - b.order);
    });
    if (user && isAdmin) {
      const cleanId = category.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
      try {
        await setDoc(doc(db, 'categories', cleanId), {
          name: category.name.slice(0, 80),
          slug: category.slug.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 80),
          image: (category.image || '').slice(0, 1000),
          order: Math.max(0, Number(category.order)),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `categories/${cleanId}`);
      }
    }
    showToast(`Saved category: ${category.name}`);
  };

  const deleteCategory = async (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    if (user && isAdmin) {
      try {
        await deleteDoc(doc(db, 'categories', categoryId));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `categories/${categoryId}`);
      }
    }
    showToast('Category removed');
  };

  const saveBanner = async (banner: HeroBanner) => {
    setBanners((prev) => {
      const exists = prev.some((b) => b.id === banner.id);
      return exists ? prev.map((b) => (b.id === banner.id ? banner : b)) : [banner, ...prev];
    });
    if (user && isAdmin) {
      const cleanId = banner.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
      try {
        await setDoc(doc(db, 'banners', cleanId), {
          title: banner.title.slice(0, 140),
          subtitle: (banner.subtitle || '').slice(0, 240),
          ctaText: (banner.ctaText || 'Shop Now').slice(0, 60),
          ctaLink: (banner.ctaLink || '/products').slice(0, 200),
          image: (banner.image || '').slice(0, 1000),
          enabled: Boolean(banner.enabled),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `banners/${cleanId}`);
      }
    }
    showToast('Promotional banner saved');
  };

  const deleteBanner = async (bannerId: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== bannerId));
    if (user && isAdmin) {
      try {
        await deleteDoc(doc(db, 'banners', bannerId));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `banners/${bannerId}`);
      }
    }
    showToast('Banner deleted');
  };

  const reorderBanners = async (orderedBanners: HeroBanner[]) => {
    const normalized = orderedBanners.map((b, idx) => ({ ...b, order: idx + 1 }));
    setBanners(normalized);
    showToast('Banner order updated');
  };

  const updateOrderStatus = async (
    orderId: string,
    status: Order['status'],
    paymentStatus?: Order['paymentStatus']
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              paymentStatus: paymentStatus || o.paymentStatus,
              updatedAt: new Date().toISOString(),
            }
          : o
      )
    );
    if (user && isAdmin) {
      try {
        await updateDoc(doc(db, 'orders', orderId), {
          status,
          ...(paymentStatus ? { paymentStatus } : {}),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        // Order might be guest/local-only if not in Firestore
        console.warn('Local order status updated:', err);
      }
    }
    showToast(`Order ${orderId} marked as ${status.toUpperCase()}`);
  };

  const updateStoreSettings = async (settings: StoreSettings) => {
    setStoreSettings(settings);
    if (user && isAdmin) {
      try {
        await setDoc(doc(db, 'settings', 'main'), {
          storeName: settings.storeName.slice(0, 120),
          address: (settings.address || '').slice(0, 400),
          phone: (settings.phone || '').slice(0, 30),
          whatsappNumber: (settings.whatsappNumber || '').slice(0, 30),
          email: (settings.email || '').slice(0, 160),
          openingHours: (settings.openingHours || '').slice(0, 160),
          mapLink: (settings.mapLink || '').slice(0, 500),
          announcementText: (settings.announcementText || '').slice(0, 240),
          codEnabled: Boolean(settings.codEnabled),
          upiId: (settings.upiId || '').slice(0, 120),
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'settings/main');
      }
    }
    showToast('Store settings updated');
  };

  const updateHomepageSections = (sections: HomepageSectionConfig[]) => {
    setHomepageSections([...sections].sort((a, b) => a.order - b.order));
    showToast('Homepage layout customized');
  };

  const saveCoupon = (coupon: Coupon) => {
    setCoupons((prev) => {
      const exists = prev.some((c) => c.code === coupon.code);
      return exists ? prev.map((c) => (c.code === coupon.code ? coupon : c)) : [coupon, ...prev];
    });
    showToast(`Saved coupon ${coupon.code}`);
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    showToast(`Deleted coupon ${code}`);
  };

  const saveCelebrityReel = (reel: CelebrityReelItem) => {
    setCelebrityReels((prev) => {
      const exists = prev.some((r) => r.id === reel.id);
      const next = exists ? prev.map((r) => (r.id === reel.id ? reel : r)) : [reel, ...prev];
      return next.map((r, i) => ({ ...r, order: i + 1 }));
    });
    showToast('Celebrity video reel saved');
  };

  const deleteCelebrityReel = (reelId: string) => {
    setCelebrityReels((prev) => prev.filter((r) => r.id !== reelId));
    showToast('Video reel removed');
  };

  const reorderCelebrityReels = (nextReels: CelebrityReelItem[]) => {
    setCelebrityReels(nextReels.map((r, i) => ({ ...r, order: i + 1 })));
    showToast('Video reels order updated');
  };

  const saveShopByNotes = (items: VisualCardItem[]) => {
    setShopByNotes(items);
    showToast('Shop by Notes updated');
  };

  const saveShopByOccasions = (items: VisualCardItem[]) => {
    setShopByOccasions(items);
    showToast('Shop by Occasions updated');
  };

  const saveTestimonials = (items: TestimonialItem[]) => {
    setTestimonials(items);
    showToast('Customer testimonials updated');
  };

  const saveBlogPosts = (items: BlogPostItem[]) => {
    setBlogPosts(items);
    showToast('Editorial blog posts updated');
  };

  const submitRewardLead = (lead: Omit<RewardLeadItem, 'id' | 'createdAt'>) => {
    const newLead: RewardLeadItem = {
      ...lead,
      id: `lead_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setRewardLeads((prev) => [newLead, ...prev]);
    const rewardCode = storeSettings.rewardCouponCode || 'ROYAL500';
    showToast(`Reward Unlocked! Use code ${rewardCode} at checkout.`);
  };

  const deleteRewardLead = (id: string) => {
    setRewardLeads((prev) => prev.filter((l) => l.id !== id));
    showToast('Lead entry deleted');
  };

  const submitNotifyMeRequest = (req: Omit<NotifyMeRequestItem, 'id' | 'createdAt'>) => {
    const newReq: NotifyMeRequestItem = {
      ...req,
      id: `notify_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setNotifyMeRequests((prev) => [newReq, ...prev]);
    showToast(`We'll notify you as soon as ${req.productName} is back in stock!`);
  };

  const deleteNotifyMeRequest = (id: string) => {
    setNotifyMeRequests((prev) => prev.filter((r) => r.id !== id));
    showToast('Notification request removed');
  };

  const resetCatalogToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setBanners(INITIAL_BANNERS);
    setCelebrityReels(INITIAL_CELEBRITY_REELS);
    setShopByNotes(INITIAL_SHOP_BY_NOTES);
    setShopByOccasions(INITIAL_SHOP_BY_OCCASIONS);
    setTestimonials(INITIAL_TESTIMONIALS);
    setBlogPosts(INITIAL_BLOG_POSTS);
    setCoupons(INITIAL_COUPONS);
    setStoreSettings(INITIAL_STORE_SETTINGS);
    setHomepageSections(INITIAL_HOMEPAGE_SECTIONS);
    showToast('Restored default Royal Luxury catalog & settings');
  };

  const launchWhatsAppUrl = (messageLines: string[]) => {
    const encoded = encodeURIComponent(messageLines.join('\n'));
    const rawNumber = (storeSettings.whatsappNumber || '918818850488').replace(/[^0-9]/g, '');
    const cleanPhone = rawNumber.length === 10 ? `91${rawNumber}` : rawNumber;
    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;

    const a = document.createElement('a');
    a.href = waUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const openWhatsAppEnquiry = (params: {
    productName?: string;
    productId?: string;
    price?: number;
    variant?: string;
    quantity?: number;
    orderId?: string;
    customerName?: string;
    customerPhone?: string;
    shippingAddress?: string;
    deliveryMethod?: string;
    paymentMethod?: string;
    customMessage?: string;
  }) => {
    const lines: string[] = [
      `🛍️ *WHATSAPP ORDER — ${storeSettings.businessName}*`,
      `--------------------------------`,
    ];

    if (params.productName) {
      const qty = params.quantity || 1;
      const unitPrice = params.price || 0;
      const total = unitPrice * qty;
      lines.push(`📱 *Product:* ${params.productName}`);
      if (params.variant) lines.push(`🎨 *Variant:* ${params.variant}`);
      lines.push(`🔢 *Quantity:* ${qty}`);
      if (unitPrice > 0) {
        lines.push(`💰 *Unit Price:* ${formatINR(unitPrice)}`);
        lines.push(`💵 *Total Payable:* *${formatINR(total)}*`);
      }
      if (params.orderId) {
        lines.push(`📋 *Order ID:* #${params.orderId}`);
      }
      if (params.customerName) {
        lines.push(`--------------------------------`);
        lines.push(`👤 *Customer Name:* ${params.customerName}`);
        if (params.customerPhone) lines.push(`📞 *Mobile:* ${params.customerPhone}`);
        if (params.deliveryMethod) lines.push(`🚚 *Delivery Mode:* ${params.deliveryMethod}`);
        if (params.shippingAddress) lines.push(`📍 *Address:* ${params.shippingAddress}`);
        if (params.paymentMethod) lines.push(`💳 *Payment Mode:* ${params.paymentMethod}`);
      }
      if (params.productId && typeof window !== 'undefined') {
        lines.push(`🔗 *Product Link:* ${window.location.origin}/product/${params.productId}`);
      }
      lines.push(`--------------------------------`);
      lines.push(`Please confirm my order and share delivery/pickup details.`);
    } else if (params.orderId) {
      const foundOrder = orders.find((o) => o.id === params.orderId);
      if (foundOrder) {
        sendOrderViaWhatsApp(foundOrder);
        return;
      }
      lines.push(`📋 *Order ID:* #${params.orderId}`);
      lines.push(`Please share the status and delivery update for my order.`);
    } else if (params.customMessage) {
      lines.push(params.customMessage);
    } else {
      lines.push(`Hello *${storeSettings.businessName}*, I would like to place an order.`);
      lines.push(`📍 *Selected City:* ${selectedCity}`);
    }

    launchWhatsAppUrl(lines);
  };

  const sendOrderViaWhatsApp = (order: Order) => {
    const deliveryLabel =
      order.deliveryMethod === 'store_pickup'
        ? 'Store Pickup at Showroom'
        : order.deliveryMethod === 'local_delivery'
        ? 'Same-Day Local Delivery'
        : 'Courier Home Delivery';

    const paymentLabel =
      order.paymentMethod === 'cod'
        ? 'Cash / UPI on Delivery (Pay at Pickup/Doorstep)'
        : order.paymentMethod === 'upi'
        ? `Direct UPI Transfer${order.upiReference ? ` (Ref: ${order.upiReference})` : ''}`
        : 'Online Payment / EMI';

    const lines: string[] = [
      `🛍️ *NEW ORDER — ${storeSettings.businessName}*`,
      `📋 *Order ID:* #${order.id}`,
      `📅 *Date:* ${new Date(order.createdAt).toLocaleString('en-IN')}`,
      `--------------------------------`,
      `👤 *Customer Details:*`,
      `• *Name:* ${order.customerName}`,
      `• *Mobile:* ${order.customerPhone}`,
      ...(order.customerEmail ? [`• *Email:* ${order.customerEmail}`] : []),
      `• *Delivery Mode:* ${deliveryLabel}`,
      `• *Address:* ${order.shippingAddress}`,
      `• *Payment Mode:* ${paymentLabel}`,
      `--------------------------------`,
      `📦 *Ordered Items:*`,
    ];

    if (order.items && order.items.length > 0) {
      order.items.forEach((item, idx) => {
        lines.push(
          `${idx + 1}. *${item.name}* (${item.variant}) × ${item.quantity} = *${formatINR(
            item.price * item.quantity
          )}*`
        );
      });
    } else {
      lines.push(`• ${order.itemsSummary}`);
    }

    lines.push(`--------------------------------`);
    lines.push(`💰 *Bill Summary:*`);
    lines.push(`• Subtotal: ${formatINR(order.subtotal)}`);
    if (order.discount > 0) {
      lines.push(`• Coupon Discount: -${formatINR(order.discount)}`);
    }
    lines.push(
      `• Delivery Charge: ${order.deliveryFee === 0 ? 'FREE' : formatINR(order.deliveryFee)}`
    );
    lines.push(`💵 *TOTAL PAYABLE: ${formatINR(order.totalAmount)}*`);
    lines.push(`--------------------------------`);
    lines.push(`Please confirm my Order *#${order.id}*. Thank you!`);

    launchWhatsAppUrl(lines);
  };

  const sendCartOrderViaWhatsApp = (customerInfo?: {
    customerName?: string;
    customerPhone?: string;
    shippingAddress?: string;
    deliveryMethod?: string;
    paymentMethod?: string;
  }) => {
    if (cart.length === 0) {
      showToast('Your cart is empty! Add products first.');
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    let couponDiscount = 0;
    if (appliedCoupon && subtotal >= appliedCoupon.minOrderAmount) {
      if (appliedCoupon.discountType === 'flat') {
        couponDiscount = appliedCoupon.discountValue;
      } else {
        couponDiscount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
        if (appliedCoupon.maxDiscount) {
          couponDiscount = Math.min(couponDiscount, appliedCoupon.maxDiscount);
        }
      }
    }
    const finalTotal = Math.max(0, subtotal - couponDiscount);

    const lines: string[] = [
      `🛍️ *CART ORDER — ${storeSettings.businessName}*`,
      `--------------------------------`,
      `📦 *Items to Order (${cart.reduce((s, i) => s + i.quantity, 0)}):*`,
    ];

    cart.forEach((item, idx) => {
      const variant = [
        item.selectedColor,
        item.selectedRam !== 'Standard' ? item.selectedRam : null,
        item.selectedStorage !== 'Standard' ? item.selectedStorage : null,
      ]
        .filter(Boolean)
        .join(', ');
      lines.push(
        `${idx + 1}. *${item.product.name}* (${variant}) × ${item.quantity} = *${formatINR(
          item.unitPrice * item.quantity
        )}*`
      );
    });

    lines.push(`--------------------------------`);
    lines.push(`💰 *Order Summary:*`);
    lines.push(`• Subtotal: ${formatINR(subtotal)}`);
    if (couponDiscount > 0 && appliedCoupon) {
      lines.push(`• Coupon (${appliedCoupon.code}): -${formatINR(couponDiscount)}`);
    }
    lines.push(`• Delivery / Pickup: FREE`);
    lines.push(`💵 *TOTAL PAYABLE: ${formatINR(finalTotal)}*`);

    if (customerInfo?.customerName || customerInfo?.customerPhone || customerInfo?.shippingAddress) {
      lines.push(`--------------------------------`);
      lines.push(`👤 *Customer Details:*`);
      if (customerInfo.customerName) lines.push(`• *Name:* ${customerInfo.customerName}`);
      if (customerInfo.customerPhone) lines.push(`• *Mobile:* ${customerInfo.customerPhone}`);
      if (customerInfo.deliveryMethod) lines.push(`• *Delivery Mode:* ${customerInfo.deliveryMethod}`);
      if (customerInfo.shippingAddress) lines.push(`• *Address:* ${customerInfo.shippingAddress}`);
      if (customerInfo.paymentMethod) lines.push(`• *Payment Mode:* ${customerInfo.paymentMethod}`);
    } else {
      lines.push(`📍 *City:* ${selectedCity}`);
    }

    lines.push(`--------------------------------`);
    lines.push(`Please confirm my order and share payment/delivery details!`);

    launchWhatsAppUrl(lines);
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        authReady,
        isAdmin,
        products,
        categories,
        banners,
        celebrityReels,
        shopByNotes,
        shopByOccasions,
        testimonials,
        blogPosts,
        rewardLeads,
        notifyMeRequests,
        coupons,
        orders,
        storeSettings,
        homepageSections,
        cart,
        savedForLater,
        wishlist,
        recentSearches,
        appliedCoupon,
        selectedCity,
        toastMessage,
        activeNotifyModalProduct,
        setActiveNotifyModalProduct,
        rewardModalOpen,
        setRewardModalOpen,
        loginModalOpen,
        setLoginModalOpen,
        chatbotOpen,
        setChatbotOpen,
        mobileUser,
        supportChats,
        activeChatUserId,
        chatLoading,
        setSelectedCity,
        showToast,
        loginWithGoogle,
        signInWithMobileNumber,
        logout,
        addProductReview,
        sendSupportChatMessage,
        sendAdminChatReply,
        deleteSupportChat,
        refreshSupportChats,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        moveToSavedForLater,
        moveToCartFromSaved,
        removeSavedItem,
        clearCart,
        toggleWishlist,
        applyCouponCode,
        removeCoupon,
        addRecentSearch,
        clearRecentSearches,
        placeOrder,
        saveProduct,
        deleteProduct,
        saveCategory,
        deleteCategory,
        saveBanner,
        deleteBanner,
        reorderBanners,
        saveCelebrityReel,
        deleteCelebrityReel,
        reorderCelebrityReels,
        saveShopByNotes,
        saveShopByOccasions,
        saveTestimonials,
        saveBlogPosts,
        submitRewardLead,
        deleteRewardLead,
        submitNotifyMeRequest,
        deleteNotifyMeRequest,
        updateOrderStatus,
        updateStoreSettings,
        updateHomepageSections,
        saveCoupon,
        deleteCoupon,
        resetCatalogToDefaults,
        openWhatsAppEnquiry,
        sendOrderViaWhatsApp,
        sendCartOrderViaWhatsApp,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
