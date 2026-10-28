import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
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
  signInWithGoogle,
  signOutUser,
} from '../lib/firebase';
import {
  INITIAL_BANNERS,
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_HOMEPAGE_SECTIONS,
  INITIAL_PRODUCTS,
  INITIAL_STORE_SETTINGS,
} from '../data/initialCatalog';
import {
  CartItem,
  CategoryItem,
  Coupon,
  HeroBanner,
  HomepageSectionConfig,
  Order,
  Product,
  StoreSettings,
} from '../types/store';

interface StoreContextValue {
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  products: Product[];
  categories: CategoryItem[];
  banners: HeroBanner[];
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
  setSelectedCity: (city: string) => void;
  showToast: (msg: string) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
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
    price?: number;
    variant?: string;
    quantity?: number;
    orderId?: string;
    customMessage?: string;
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
  CART: 'charlie_mobile_cart_v1',
  SAVED: 'charlie_mobile_saved_v1',
  WISHLIST: 'charlie_mobile_wishlist_v1',
  SEARCHES: 'charlie_mobile_searches_v1',
  PRODUCTS: 'charlie_mobile_products_v1',
  CATEGORIES: 'charlie_mobile_categories_v1',
  BANNERS: 'charlie_mobile_banners_v1',
  SETTINGS: 'charlie_mobile_settings_v1',
  SECTIONS: 'charlie_mobile_sections_v1',
  COUPONS: 'charlie_mobile_coupons_v1',
  ORDERS: 'charlie_mobile_orders_v1',
  CITY: 'charlie_mobile_city_v1',
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
    loadLocal(STORAGE_KEYS.WISHLIST, ['prod_iphone_16_pro_max', 'prod_vivo_x200_pro'])
  );
  const [recentSearches, setRecentSearches] = useState<string[]>(() =>
    loadLocal(STORAGE_KEYS.SEARCHES, ['iPhone 16 Pro Max', '5G Smartphones', 'Vivo X200 Pro', '100W GaN Charger'])
  );
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [selectedCity, setSelectedCityState] = useState<string>(() =>
    loadLocal(STORAGE_KEYS.CITY, 'Main Showroom')
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isAdmin = useMemo(() => {
    if (!user) return false;
    return user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
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

  const loginWithGoogle = async () => {
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
              phone: (u.phoneNumber || '').slice(0, 24),
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
    } catch (err) {
      console.error('Sign in failed:', err);
      showToast('Sign-in popup was closed or cancelled.');
    }
  };

  const logout = async () => {
    await signOutUser();
    showToast('Signed out of your Charlie Mobile account.');
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

  const resetCatalogToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setBanners(INITIAL_BANNERS);
    setCoupons(INITIAL_COUPONS);
    setStoreSettings(INITIAL_STORE_SETTINGS);
    setHomepageSections(INITIAL_HOMEPAGE_SECTIONS);
    showToast('Restored default Charlie Mobile catalog & settings');
  };

  const openWhatsAppEnquiry = (params: {
    productName?: string;
    price?: number;
    variant?: string;
    quantity?: number;
    orderId?: string;
    customMessage?: string;
  }) => {
    const lines: string[] = [`Hello *${storeSettings.businessName}*,`];
    if (params.productName) {
      lines.push(`I would like to enquire about purchasing:`);
      lines.push(`• *Product:* ${params.productName}`);
      if (params.variant) lines.push(`• *Variant:* ${params.variant}`);
      if (params.price) lines.push(`• *Listed Price:* ${formatINR(params.price)}`);
      if (params.quantity) lines.push(`• *Quantity:* ${params.quantity}`);
    } else if (params.orderId) {
      lines.push(`I would like an update regarding my Order *#${params.orderId}*.`);
    } else if (params.customMessage) {
      lines.push(params.customMessage);
    } else {
      lines.push(`I have an enquiry regarding smartphones and current offers at Charlie Mobile.`);
    }
    lines.push(`Please share availability and best store offer.`);

    const encoded = encodeURIComponent(lines.join('\n'));
    const cleanPhone = (storeSettings.whatsappNumber || '').replace(/[^0-9]/g, '');
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

  return (
    <StoreContext.Provider
      value={{
        user,
        authReady,
        isAdmin,
        products,
        categories,
        banners,
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
        setSelectedCity,
        showToast,
        loginWithGoogle,
        logout,
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
        updateOrderStatus,
        updateStoreSettings,
        updateHomepageSections,
        saveCoupon,
        deleteCoupon,
        resetCatalogToDefaults,
        openWhatsAppEnquiry,
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
