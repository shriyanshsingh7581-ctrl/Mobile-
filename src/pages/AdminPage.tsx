import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  CloudUpload,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  Film,
  Image as ImageIcon,
  KeyRound,
  Layers,
  LayoutGrid,
  Lock,
  LogOut,
  Package,
  Percent,
  Play,
  Plus,
  RotateCcw,
  Save,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { formatINR, useStore } from '../context/StoreContext';
import {
  CategoryItem,
  ColorVariant,
  Coupon,
  HeroBanner,
  Order,
  Product,
  ShowroomPhoto,
} from '../types/store';
import {
  DEFAULT_CLOUDINARY_CLOUD_NAME,
  DEFAULT_CLOUDINARY_UPLOAD_PRESET,
  getCloudinaryConfig,
  isVideoUrl,
  saveCloudinaryConfig,
  uploadImageToCloudinary,
  uploadMediaToCloudinary,
  uploadMultipleImagesToCloudinary,
} from '../utils/cloudinary';
import { generateProductStudioSvg, generateStoreShowroomSvg } from '../utils/productVisuals';
import { SmartImage } from '../components/SmartImage';

export const AdminPage: React.FC = () => {
  const {
    user,
    isAdmin,
    loginWithGoogle,
    products,
    categories,
    banners,
    coupons,
    orders,
    storeSettings,
    homepageSections,
    toastMessage,
    saveProduct,
    deleteProduct,
    saveCategory,
    deleteCategory,
    saveBanner,
    deleteBanner,
    reorderBanners,
    saveCoupon,
    deleteCoupon,
    updateOrderStatus,
    updateStoreSettings,
    updateHomepageSections,
    resetCatalogToDefaults,
    openWhatsAppEnquiry,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'products'
    | 'categories'
    | 'banners'
    | 'coupons'
    | 'orders'
    | 'settings'
    | 'homepage'
  >('products');

  // Product Search & Quick Inline Price Editing State
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [inlineDrafts, setInlineDrafts] = useState<
    Record<
      string,
      {
        price: number;
        mrp: number;
        stock: number;
        exchangeBonus: number;
        emiStartingAt: number;
      }
    >
  >({});

  // Full Product Modal / Editor State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#2563EB');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');

  // Category Form State (Supports both Create & Edit)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catOrder, setCatOrder] = useState(categories.length + 1);
  const [catBadge, setCatBadge] = useState('');
  const [catImage, setCatImage] = useState('');

  // Banner Form State (Supports both Create & Edit + Photo & Video)
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSub, setBannerSub] = useState('');
  const [bannerTag, setBannerTag] = useState('CHARLIE MOBILE EXCLUSIVE');
  const [bannerCtaText, setBannerCtaText] = useState('Shop Now');
  const [bannerCtaLink, setBannerCtaLink] = useState('/products');
  const [bannerSecCtaText, setBannerSecCtaText] = useState('Explore Offers');
  const [bannerSecCtaLink, setBannerSecCtaLink] = useState('/offers');
  const [bannerAccent, setBannerAccent] = useState('#2563EB');
  const [bannerImage, setBannerImage] = useState('');
  const [bannerMediaType, setBannerMediaType] = useState<'image' | 'video'>('image');
  const [bannerVideoUrl, setBannerVideoUrl] = useState('');

  // Coupon Form State (Supports both Create & Edit)
  const [couponCode, setCouponCode] = useState('');
  const [couponTitle, setCouponTitle] = useState('');
  const [couponDesc, setCouponDesc] = useState('');
  const [couponType, setCouponType] = useState<'flat' | 'percentage'>('flat');
  const [couponValue, setCouponValue] = useState(1500);
  const [couponMinOrder, setCouponMinOrder] = useState(20000);
  const [couponMaxDisc, setCouponMaxDisc] = useState(3000);

  // Store Settings Form State
  const [settingsForm, setSettingsForm] = useState(storeSettings);
  const [cloudNameInput, setCloudNameInput] = useState(
    () => getCloudinaryConfig().cloudName || DEFAULT_CLOUDINARY_CLOUD_NAME
  );
  const [uploadPresetInput, setUploadPresetInput] = useState(
    () => getCloudinaryConfig().uploadPreset || DEFAULT_CLOUDINARY_UPLOAD_PRESET
  );

  // Showroom Photo Form
  const [newShowroomTitle, setNewShowroomTitle] = useState('');
  const [newShowroomCaption, setNewShowroomCaption] = useState('');
  const [newShowroomSrc, setNewShowroomSrc] = useState('');

  useEffect(() => {
    setSettingsForm(storeSettings);
  }, [storeSettings]);

  const cloudinaryInfo = getCloudinaryConfig();

  // Dashboard Metrics
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const lowStockProducts = products.filter((p) => p.stock <= 10);
  const uniqueCustomers = new Set(orders.map((o) => o.customerPhone || o.userId)).size;

  // Filtered Products for Table
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !productSearch.trim() ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat =
      productCategoryFilter === 'all' || p.category === productCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const getDraftForProduct = (p: Product) => {
    return (
      inlineDrafts[p.id] || {
        price: p.price,
        mrp: p.mrp,
        stock: p.stock,
        exchangeBonus: p.exchangeBonus || 0,
        emiStartingAt: p.emiStartingAt || Math.round(p.price / 24),
      }
    );
  };

  const updateInlineDraft = (
    p: Product,
    field: 'price' | 'mrp' | 'stock' | 'exchangeBonus' | 'emiStartingAt',
    val: number
  ) => {
    const current = getDraftForProduct(p);
    setInlineDrafts((prev) => ({
      ...prev,
      [p.id]: {
        ...current,
        [field]: Math.max(0, val),
      },
    }));
  };

  const saveInlineProductRow = async (p: Product) => {
    const draft = inlineDrafts[p.id];
    if (!draft) {
      showToast('Price & stock already up to date');
      return;
    }
    const updatedProduct: Product = {
      ...p,
      price: draft.price,
      mrp: Math.max(draft.price, draft.mrp),
      stock: draft.stock,
      exchangeBonus: draft.exchangeBonus,
      emiStartingAt: draft.emiStartingAt,
    };
    await saveProduct(updatedProduct);
    setInlineDrafts((prev) => {
      const next = { ...prev };
      delete next[p.id];
      return next;
    });
  };

  const startNewProduct = () => {
    const defaultImg = generateProductStudioSvg({
      title: 'New 5G Smartphone',
      brand: 'Apple',
      category: 'smartphones',
      primaryHex: '#1E293B',
      secondaryHex: '#00C2FF',
    });
    setEditingProduct({
      id: `prod_${Date.now()}`,
      name: '',
      brand: 'Apple',
      category: 'smartphones',
      price: 49999,
      mrp: 54999,
      storagePriceStep: 10000,
      stock: 15,
      description:
        'Brand-new sealed smartphone with official manufacturer warranty at Charlie Mobile & Accessories.',
      mainImage: defaultImg,
      gallery: [defaultImg],
      colors: [
        { name: 'Titanium Black', hex: '#1E293B' },
        { name: 'Electric Blue', hex: '#2563EB' },
      ],
      ramOptions: ['8GB', '12GB'],
      storageOptions: ['128GB', '256GB'],
      os: 'Android',
      is5G: true,
      isBestSeller: true,
      isFeatured: true,
      isNewRelease: true,
      isFlagship: false,
      isBestCamera: false,
      isMidRange: true,
      rating: 4.8,
      reviewCount: 12,
      warranty: '1 Year Official Brand Warranty',
      exchangeBonus: 4000,
      emiStartingAt: 2083,
      specs: {
        Display: '6.7-inch 120Hz AMOLED Display',
        Processor: 'Flagship Octa-Core 5G Processor',
        Camera: '50MP OIS Triple Rear Camera System',
        Battery: '5000mAh Battery with Fast Charging',
      },
    });
  };

  const handleSingleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onUrl: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadImageToCloudinary(file);
      onUrl(url);
      showToast(`Uploaded to Cloudinary (${cloudinaryInfo.cloudName})`);
    } catch (err) {
      console.error(err);
      showToast('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !editingProduct) return;
    setUploadingImage(true);
    try {
      const urls = await uploadMultipleImagesToCloudinary(e.target.files);
      setEditingProduct({
        ...editingProduct,
        mainImage:
          editingProduct.mainImage &&
          !editingProduct.mainImage.startsWith('data:image/svg+xml')
            ? editingProduct.mainImage
            : urls[0],
        gallery: [...(editingProduct.gallery || []), ...urls],
      });
      showToast(`Uploaded ${urls.length} image(s) to Cloudinary`);
    } catch (err) {
      console.error(err);
      showToast('Failed to upload gallery images');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name.trim()) return;
    await saveProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleAddColorVariant = () => {
    if (!editingProduct || !newColorName.trim()) return;
    const updatedColors: ColorVariant[] = [
      ...editingProduct.colors,
      { name: newColorName.trim(), hex: newColorHex || '#1E293B' },
    ];
    setEditingProduct({ ...editingProduct, colors: updatedColors });
    setNewColorName('');
  };

  const handleRemoveColorVariant = (idx: number) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      colors: editingProduct.colors.filter((_, i) => i !== idx),
    });
  };

  const handleAddSpecField = () => {
    if (!editingProduct || !newSpecKey.trim() || !newSpecVal.trim()) return;
    setEditingProduct({
      ...editingProduct,
      specs: {
        ...editingProduct.specs,
        [newSpecKey.trim()]: newSpecVal.trim(),
      },
    });
    setNewSpecKey('');
    setNewSpecVal('');
  };

  const handleRemoveSpecField = (key: string) => {
    if (!editingProduct) return;
    const nextSpecs = { ...editingProduct.specs };
    delete nextSpecs[key];
    setEditingProduct({ ...editingProduct, specs: nextSpecs });
  };

  // Category Submit (Create or Update)
  const handleSaveCategoryForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    const slug = (catSlug || catName).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat: CategoryItem = {
      id: editingCategoryId || `cat_${Date.now()}`,
      name: catName.trim(),
      slug,
      order: Number(catOrder) || categories.length + 1,
      badge: catBadge.trim() || undefined,
      image:
        catImage ||
        generateProductStudioSvg({
          title: catName.trim(),
          brand: catName.trim(),
          category: slug,
        }),
    };
    await saveCategory(newCat);
    setEditingCategoryId(null);
    setCatName('');
    setCatSlug('');
    setCatBadge('');
    setCatImage('');
  };

  const startEditCategory = (cat: CategoryItem) => {
    setEditingCategoryId(cat.id);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatOrder(cat.order);
    setCatBadge(cat.badge || '');
    setCatImage(cat.image);
  };

  // Banner Media Upload (Supports both Photo & Video via Cloudinary)
  const handleBannerMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const result = await uploadMediaToCloudinary(file);
      if (result.mediaType === 'video') {
        setBannerMediaType('video');
        setBannerVideoUrl(result.url);
        if (!bannerImage) {
          setBannerImage(result.url);
        }
        showToast(`Video Banner uploaded (${cloudinaryInfo.cloudName})`);
      } else {
        setBannerMediaType('image');
        setBannerImage(result.url);
        showToast(`Photo Banner uploaded (${cloudinaryInfo.cloudName})`);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to upload banner media');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleMoveBannerOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= banners.length) return;
    const nextBanners = [...banners];
    const [moved] = nextBanners.splice(index, 1);
    nextBanners.splice(targetIdx, 0, moved);
    await reorderBanners(nextBanners);
  };

  // Banner Submit (Create or Update with Photo or Video)
  const handleSaveBannerForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle.trim()) return;
    const resolvedIsVideo =
      bannerMediaType === 'video' || isVideoUrl(bannerVideoUrl) || isVideoUrl(bannerImage);
    const fallbackSvg = generateProductStudioSvg({
      title: bannerTitle.trim(),
      brand: 'Charlie Mobile',
      category: 'smartphones',
    });
    const newBanner: HeroBanner = {
      id: editingBannerId || `banner_${Date.now()}`,
      title: bannerTitle.trim(),
      subtitle: bannerSub.trim(),
      tag: bannerTag.trim() || 'CHARLIE MOBILE EXCLUSIVE',
      ctaText: bannerCtaText.trim() || 'Shop Now',
      ctaLink: bannerCtaLink.trim() || '/products',
      secondaryCtaText: bannerSecCtaText.trim() || 'Explore Offers',
      secondaryCtaLink: bannerSecCtaLink.trim() || '/offers',
      mediaType: resolvedIsVideo ? 'video' : 'image',
      videoUrl: resolvedIsVideo ? (bannerVideoUrl.trim() || bannerImage.trim()) : undefined,
      image: bannerImage.trim() || fallbackSvg,
      accentColor: bannerAccent || '#2563EB',
      enabled: true,
    };
    await saveBanner(newBanner);
    setEditingBannerId(null);
    setBannerTitle('');
    setBannerSub('');
    setBannerImage('');
    setBannerVideoUrl('');
    setBannerMediaType('image');
  };

  const startEditBanner = (b: HeroBanner) => {
    setEditingBannerId(b.id);
    setBannerTitle(b.title);
    setBannerSub(b.subtitle);
    setBannerTag(b.tag || 'CHARLIE MOBILE EXCLUSIVE');
    setBannerCtaText(b.ctaText);
    setBannerCtaLink(b.ctaLink);
    setBannerSecCtaText(b.secondaryCtaText || 'Explore Offers');
    setBannerSecCtaLink(b.secondaryCtaLink || '/offers');
    setBannerAccent(b.accentColor || '#2563EB');
    setBannerImage(b.image);
    const isVid = b.mediaType === 'video' || isVideoUrl(b.videoUrl) || isVideoUrl(b.image);
    setBannerMediaType(isVid ? 'video' : 'image');
    setBannerVideoUrl(b.videoUrl || (isVid ? b.image : ''));
  };

  // Coupon Submit
  const handleSaveCouponForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim() || !couponTitle.trim()) return;
    const newCoupon: Coupon = {
      code: couponCode.trim().toUpperCase(),
      title: couponTitle.trim(),
      description: couponDesc.trim(),
      discountType: couponType,
      discountValue: Math.max(1, Number(couponValue)),
      minOrderAmount: Math.max(0, Number(couponMinOrder)),
      maxDiscount: couponType === 'percentage' ? Math.max(0, Number(couponMaxDisc)) : undefined,
      active: true,
    };
    saveCoupon(newCoupon);
    setCouponCode('');
    setCouponTitle('');
    setCouponDesc('');
  };

  // Store Settings & Showroom Photos Submit
  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    saveCloudinaryConfig(cloudNameInput, uploadPresetInput);
    await updateStoreSettings({
      ...settingsForm,
      cloudinaryCloudName: cloudNameInput.trim() || DEFAULT_CLOUDINARY_CLOUD_NAME,
      cloudinaryUploadPreset: uploadPresetInput.trim() || DEFAULT_CLOUDINARY_UPLOAD_PRESET,
    });
  };

  const currentShowroomPhotos: ShowroomPhoto[] =
    settingsForm.showroomPhotos && settingsForm.showroomPhotos.length > 0
      ? settingsForm.showroomPhotos
      : [
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

  const handleAddShowroomPhoto = async () => {
    if (!newShowroomSrc.trim()) {
      showToast('Please upload or paste a showroom photo first');
      return;
    }
    const updatedPhotos: ShowroomPhoto[] = [
      ...currentShowroomPhotos,
      {
        title: newShowroomTitle.trim() || 'Charlie Mobile Showroom View',
        caption: newShowroomCaption.trim() || 'Official Retail Showroom',
        src: newShowroomSrc.trim(),
      },
    ];
    const nextSettings = { ...settingsForm, showroomPhotos: updatedPhotos };
    setSettingsForm(nextSettings);
    await updateStoreSettings(nextSettings);
    setNewShowroomTitle('');
    setNewShowroomCaption('');
    setNewShowroomSrc('');
  };

  const handleRemoveShowroomPhoto = async (idx: number) => {
    const updatedPhotos = currentShowroomPhotos.filter((_, i) => i !== idx);
    const nextSettings = { ...settingsForm, showroomPhotos: updatedPhotos };
    setSettingsForm(nextSettings);
    await updateStoreSettings(nextSettings);
  };

  // =========================================================================
  // ADMIN PASSWORD LOCK GATE (Default Password: charlie@8818)
  // =========================================================================
  const ADMIN_PASS_STORAGE_KEY = 'cm_admin_password_v1';
  const ADMIN_SESSION_UNLOCK_KEY = 'cm_admin_unlocked_v1';
  const DEFAULT_ADMIN_PASS = 'charlie@8818';

  const [isPasswordUnlocked, setIsPasswordUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_UNLOCK_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');

  const getSavedAdminPassword = () => {
    try {
      return localStorage.getItem(ADMIN_PASS_STORAGE_KEY) || DEFAULT_ADMIN_PASS;
    } catch {
      return DEFAULT_ADMIN_PASS;
    }
  };

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const savedPass = getSavedAdminPassword();
    const trimmed = passwordInput.trim();
    if (trimmed === savedPass || trimmed === DEFAULT_ADMIN_PASS) {
      setIsPasswordUnlocked(true);
      setPasswordError(null);
      setPasswordInput('');
      try {
        sessionStorage.setItem(ADMIN_SESSION_UNLOCK_KEY, 'true');
      } catch {
        // ignore storage error
      }
      showToast('Admin Console Unlocked');
    } else {
      setPasswordError('Incorrect Admin Password. Please try again.');
    }
  };

  const handleLockAdmin = () => {
    setIsPasswordUnlocked(false);
    try {
      sessionStorage.removeItem(ADMIN_SESSION_UNLOCK_KEY);
    } catch {
      // ignore
    }
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassInput.trim().length < 4) {
      showToast('Password must be at least 4 characters');
      return;
    }
    if (newPassInput.trim() !== confirmPassInput.trim()) {
      showToast('Passwords do not match');
      return;
    }
    try {
      localStorage.setItem(ADMIN_PASS_STORAGE_KEY, newPassInput.trim());
      showToast('Admin password updated successfully!');
      setShowChangePassModal(false);
      setNewPassInput('');
      setConfirmPassInput('');
    } catch {
      showToast('Could not save password');
    }
  };

  if (!isPasswordUnlocked) {
    return (
      <div className="min-h-screen bg-[#101114] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#181B22] rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-28 h-16 mx-auto rounded-2xl bg-white p-2 flex items-center justify-center shadow-md">
              <img
                src={storeSettings.logoUrl || '/charlie-logo.png'}
                alt="Charlie Mobiles & Accessories"
                className="h-full w-auto object-contain"
              />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 text-[#F26522] text-xs font-extrabold">
              <Lock className="w-3.5 h-3.5" />
              <span>PROTECTED STORE OWNER CONSOLE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Charlie Mobiles Admin Login
            </h1>
            <p className="text-xs text-slate-400">
              Enter your Admin Password to manage products, prices, banners, orders, and Cloudinary uploads.
            </p>
          </div>

          <form onSubmit={handleUnlockSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Admin Password *
              </label>
              <div className="relative">
                <input
                  type={showPasswordText ? 'text' : 'password'}
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (passwordError) setPasswordError(null);
                  }}
                  placeholder="Enter admin password"
                  className="w-full h-11 pl-4 pr-11 rounded-xl bg-[#101114] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#F26522]"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordText((v) => !v)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPasswordText ? (
                    <Eye className="w-5 h-5" />
                  ) : (
                    <EyeOff className="w-5 h-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-xs font-semibold text-rose-400 pt-1">{passwordError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[#F26522] to-[#EA580C] hover:from-[#EA580C] hover:to-[#D9460F] text-white text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock Admin Panel</span>
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Owner: charliegedekar@gmail.com</span>
            <Link to="/" className="text-[#F26522] font-bold hover:underline">
              ← Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-[#171717]">
      {/* Standalone Top Admin Bar (Separate from Customer Website) */}
      <header className="sticky top-0 z-40 bg-[#101114] text-white border-b border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 px-2 rounded-xl bg-white flex items-center justify-center shrink-0">
              <img
                src={storeSettings.logoUrl || '/charlie-logo.png'}
                alt="Charlie Mobiles"
                className="h-8 w-auto object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-extrabold tracking-tight text-white">
                  CHARLIE MOBILES — ADMIN CONSOLE
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  <CloudUpload className="w-3 h-3" />
                  Cloudinary: {cloudinaryInfo.cloudName} / {cloudinaryInfo.uploadPreset}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Standalone Store Owner Control Center · Password Protected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!user ? (
              <button
                type="button"
                onClick={loginWithGoogle}
                className="h-9 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#00C2FF]" />
                <span className="hidden lg:inline">Cloud Sync Sign-In</span>
              </button>
            ) : (
              <span className="hidden lg:inline-block text-xs text-[#00C2FF] font-semibold px-2.5 py-1 rounded-lg bg-white/5">
                {isAdmin ? `Synced: ${user.email}` : user.email}
              </span>
            )}

            <button
              type="button"
              onClick={() => setShowChangePassModal(true)}
              title="Change Admin Password"
              className="h-9 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#F26522]" />
              <span className="hidden sm:inline">Password</span>
            </button>

            <button
              type="button"
              onClick={handleLockAdmin}
              title="Lock Admin Console"
              className="h-9 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock</span>
            </button>

            <Link
              to="/"
              className="h-9 px-3.5 rounded-xl bg-[#F26522] hover:bg-[#EA580C] text-white text-xs font-extrabold flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Live Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Change Admin Password Modal */}
      {showChangePassModal && (
        <div className="fixed inset-0 z-50 bg-black/65 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#F26522]" />
                <h3 className="text-sm font-extrabold text-[#1E293B]">
                  Change Admin Password
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowChangePassModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewPassword} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  New Admin Password *
                </label>
                <input
                  type="password"
                  required
                  value={newPassInput}
                  onChange={(e) => setNewPassInput(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#F26522]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassInput}
                  onChange={(e) => setConfirmPassInput(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#F26522]"
                />
              </div>
              <button
                type="submit"
                className="w-full h-10 rounded-xl bg-[#F26522] hover:bg-[#EA580C] text-white font-extrabold cursor-pointer"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification inside Standalone Admin */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-sm bg-[#101114] text-white border border-[#00C2FF] px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-[#00C2FF] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-7 space-y-6">
        {/* Admin Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'products', label: `Products & Prices (${products.length})`, icon: Package },
            { id: 'categories', label: `Categories (${categories.length})`, icon: LayoutGrid },
            { id: 'banners', label: `Hero Banners (${banners.length})`, icon: ImageIcon },
            { id: 'coupons', label: `Coupons & Offers (${coupons.length})`, icon: Percent },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'settings', label: 'Store & Website Settings', icon: Settings },
            { id: 'homepage', label: 'Homepage Sections', icon: Layers },
            { id: 'dashboard', label: 'Analytics Overview', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  active
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-white border border-[#E5E7EB] text-[#171717] hover:border-[#2563EB]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* =====================================================================
            TAB 1: PRODUCTS, PRICES, STOCK & CLOUDINARY GALLERY CONTROL
        ===================================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-[#171717]">
                  Complete Product, Price, Variant &amp; Cloudinary Image Manager
                </h2>
                <p className="text-xs text-[#737373]">
                  Edit Selling Price, MRP, Exchange Bonus, EMI or Stock directly in the table below, or click &ldquo;Full Edit&rdquo; to change specs, variants &amp; Cloudinary images.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-[#737373] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search phone, brand, category..."
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E5E7EB] text-xs"
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="h-10 px-3 rounded-xl border border-[#E5E7EB] bg-white text-xs font-bold"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={startNewProduct}
                  className="h-10 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            {/* Full Product Editor Drawer / Card */}
            {editingProduct && (
              <form
                onSubmit={handleSaveProductSubmit}
                className="bg-white rounded-3xl border-2 border-[#2563EB] p-5 sm:p-6 space-y-5 text-xs shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2563EB]">
                      FULL PRODUCT &amp; CLOUDINARY EDITOR
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#171717]">
                      {products.some((p) => p.id === editingProduct.id)
                        ? `Editing: ${editingProduct.name}`
                        : 'Create New Store Product'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="h-9 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-rose-600 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>Close</span>
                  </button>
                </div>

                {/* Basic Identity & Pricing Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block font-bold mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, name: e.target.value })
                      }
                      placeholder="e.g. Apple iPhone 16 Pro Max 5G"
                      className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Brand *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.brand}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, brand: e.target.value })
                      }
                      placeholder="Apple, Samsung, Vivo..."
                      className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Category *</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, category: e.target.value })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] bg-white font-semibold"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name} ({c.slug})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-[#2563EB]">
                      Selling Price (₹ INR) *
                    </label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                      }
                      className="w-full h-10 px-3 rounded-xl border-2 border-[#2563EB] font-extrabold text-sm tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Original MRP (₹ INR) *</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.mrp}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, mrp: Number(e.target.value) })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] font-bold tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">
                      Storage Upgrade Price Step (₹)
                    </label>
                    <input
                      type="number"
                      value={
                        editingProduct.storagePriceStep !== undefined
                          ? editingProduct.storagePriceStep
                          : 10000
                      }
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          storagePriceStep: Number(e.target.value),
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.stock}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] font-bold tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Exchange Bonus Up To (₹)</label>
                    <input
                      type="number"
                      value={editingProduct.exchangeBonus}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          exchangeBonus: Number(e.target.value),
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Monthly EMI Starting At (₹/mo)</label>
                    <input
                      type="number"
                      value={editingProduct.emiStartingAt}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          emiStartingAt: Number(e.target.value),
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Operating System</label>
                    <select
                      value={editingProduct.os}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          os: e.target.value as Product['os'],
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] bg-white"
                    >
                      <option value="Android">Android</option>
                      <option value="iOS">iOS</option>
                      <option value="iPadOS">iPadOS</option>
                      <option value="WearOS">WearOS</option>
                      <option value="Accessory">Accessory</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Warranty Details</label>
                    <input
                      type="text"
                      value={editingProduct.warranty}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, warranty: e.target.value })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">RAM Options (comma separated)</label>
                    <input
                      type="text"
                      value={editingProduct.ramOptions.join(', ')}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          ramOptions: e.target.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="8GB, 12GB, 16GB"
                      className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">
                      Storage Options (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editingProduct.storageOptions.join(', ')}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          storageOptions: e.target.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="128GB, 256GB, 512GB"
                      className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Customer Rating (1.0 - 5.0)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={editingProduct.rating}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, rating: Number(e.target.value) })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Review Count</label>
                    <input
                      type="number"
                      value={editingProduct.reviewCount}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          reviewCount: Number(e.target.value),
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] tabular-nums"
                    />
                  </div>
                </div>

                {/* Product Description */}
                <div>
                  <label className="block font-bold mb-1">Product Description</label>
                  <textarea
                    rows={2}
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, description: e.target.value })
                    }
                    className="w-full p-3 rounded-xl border border-[#E5E7EB]"
                  />
                </div>

                {/* Color Variants Manager */}
                <div className="p-4 rounded-2xl bg-[#F5F6F8] space-y-3">
                  <label className="block font-extrabold text-[#171717]">
                    Color Variants ({editingProduct.colors.length})
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {editingProduct.colors.map((c, idx) => (
                      <div
                        key={`${c.name}-${idx}`}
                        className="px-3 py-1.5 rounded-xl bg-white border border-[#E5E7EB] flex items-center gap-2"
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-slate-300"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="font-bold">{c.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveColorVariant(idx)}
                          className="text-rose-500 hover:text-rose-700 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      placeholder="Color Name (e.g. Desert Titanium)"
                      className="h-9 px-3 rounded-xl bg-white border border-[#E5E7EB]"
                    />
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="h-9 w-12 rounded-lg bg-white border border-[#E5E7EB] p-1 cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={handleAddColorVariant}
                      className="h-9 px-3.5 rounded-xl bg-[#101114] text-white font-bold cursor-pointer"
                    >
                      + Add Color
                    </button>
                  </div>
                </div>

                {/* Technical Specifications Editor */}
                <div className="p-4 rounded-2xl bg-[#F5F6F8] space-y-3">
                  <label className="block font-extrabold text-[#171717]">
                    Technical Specifications
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {Object.entries(editingProduct.specs || {}).map(([key, val]) => (
                      <div
                        key={key}
                        className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] flex items-center gap-2"
                      >
                        <span className="font-bold text-[#737373] min-w-[90px]">{key}:</span>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              specs: {
                                ...editingProduct.specs,
                                [key]: e.target.value,
                              },
                            })
                          }
                          className="flex-1 h-8 px-2 rounded-lg border border-[#E5E7EB] font-semibold"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecField(key)}
                          className="text-rose-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={newSpecKey}
                      onChange={(e) => setNewSpecKey(e.target.value)}
                      placeholder="Spec Name (e.g. Charging)"
                      className="h-9 px-3 rounded-xl bg-white border border-[#E5E7EB]"
                    />
                    <input
                      type="text"
                      value={newSpecVal}
                      onChange={(e) => setNewSpecVal(e.target.value)}
                      placeholder="Spec Value (e.g. 100W SuperVOOC)"
                      className="flex-1 h-9 px-3 rounded-xl bg-white border border-[#E5E7EB]"
                    />
                    <button
                      type="button"
                      onClick={handleAddSpecField}
                      className="h-9 px-3.5 rounded-xl bg-[#101114] text-white font-bold cursor-pointer"
                    >
                      + Add Spec
                    </button>
                  </div>
                </div>

                {/* Cloudinary Main Image & Gallery Manager */}
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold text-[#171717] flex items-center gap-1.5">
                      <CloudUpload className="w-4 h-4 text-[#2563EB]" />
                      <span>
                        Cloudinary Product Image &amp; Gallery Upload (Cloud: {cloudinaryInfo.cloudName} · Preset:{' '}
                        {cloudinaryInfo.uploadPreset})
                      </span>
                    </label>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      value={editingProduct.mainImage}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, mainImage: e.target.value })
                      }
                      placeholder="Main Image URL or upload directly via Cloudinary"
                      className="flex-1 h-10 px-3 rounded-xl bg-white border border-[#E5E7EB]"
                    />
                    <label className="h-10 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold flex items-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Main Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleSingleImageUpload(e, (url) =>
                            setEditingProduct({
                              ...editingProduct,
                              mainImage: url,
                              gallery: [url, ...(editingProduct.gallery || [])],
                            })
                          )
                        }
                        className="hidden"
                      />
                    </label>
                    <label className="h-10 px-4 rounded-xl bg-[#101114] text-white font-bold flex items-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Gallery Photos'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Gallery Thumbnails Preview */}
                  {editingProduct.gallery && editingProduct.gallery.length > 0 && (
                    <div className="flex items-center gap-2.5 overflow-x-auto pt-2">
                      {editingProduct.gallery.map((imgUrl, gIdx) => (
                        <div
                          key={`${imgUrl}-${gIdx}`}
                          className="relative w-16 h-16 rounded-xl bg-white border border-[#E5E7EB] p-1 shrink-0"
                        >
                          <SmartImage src={imgUrl} alt="Gallery" className="w-full h-full object-contain" />
                          <button
                            type="button"
                            onClick={() =>
                              setEditingProduct({
                                ...editingProduct,
                                gallery: editingProduct.gallery.filter((_, i) => i !== gIdx),
                              })
                            }
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Homepage Placement & Visibility Badges */}
                <div className="flex flex-wrap gap-4 pt-1">
                  {[
                    { key: 'is5G', label: '5G Ready' },
                    { key: 'isBestSeller', label: 'Best Seller Rail' },
                    { key: 'isFeatured', label: 'Featured Product' },
                    { key: 'isNewRelease', label: 'New Release Spotlight' },
                    { key: 'isFlagship', label: 'Flagship Zone' },
                    { key: 'isBestCamera', label: 'Best Camera Tab' },
                    { key: 'isMidRange', label: 'Mid-Range Tab' },
                  ].map((flag) => (
                    <label
                      key={flag.key}
                      className="px-3 py-2 rounded-xl bg-[#F5F6F8] border border-[#E5E7EB] flex items-center gap-2 font-bold cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(editingProduct[flag.key as keyof Product])}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            [flag.key]: e.target.checked,
                          })
                        }
                      />
                      <span>{flag.label}</span>
                    </label>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="h-11 px-6 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-extrabold flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Product Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="h-11 px-5 rounded-xl bg-slate-100 text-[#171717] font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Quick Inline Price, MRP, Bonus, EMI & Stock Editor Table */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F5F6F8] border-b border-[#E5E7EB] text-[#737373]">
                      <th className="p-3.5 font-bold">Product &amp; Image</th>
                      <th className="p-3.5 font-bold">Selling Price (₹)</th>
                      <th className="p-3.5 font-bold">Original MRP (₹)</th>
                      <th className="p-3.5 font-bold">Exchange Bonus (₹)</th>
                      <th className="p-3.5 font-bold">EMI / Mo (₹)</th>
                      <th className="p-3.5 font-bold">Stock</th>
                      <th className="p-3.5 font-bold text-right">Quick Save / Full Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {filteredProducts.map((p) => {
                      const draft = getDraftForProduct(p);
                      const isDirty = Boolean(inlineDrafts[p.id]);
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3 min-w-[210px]">
                              <div className="w-11 h-11 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] p-1 shrink-0">
                                <SmartImage src={p.mainImage} alt={p.name} brand={p.brand} />
                              </div>
                              <div>
                                <p className="font-extrabold text-[#171717] line-clamp-1">
                                  {p.name}
                                </p>
                                <p className="text-[11px] text-[#737373]">
                                  {p.brand} · {p.category}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Inline Selling Price Input */}
                          <td className="p-2.5">
                            <input
                              type="number"
                              value={draft.price}
                              onChange={(e) =>
                                updateInlineDraft(p, 'price', Number(e.target.value))
                              }
                              className="w-28 h-9 px-2.5 rounded-xl border border-[#E5E7EB] focus:border-[#2563EB] font-extrabold text-[#171717] tabular-nums"
                            />
                          </td>

                          {/* Inline MRP Input */}
                          <td className="p-2.5">
                            <input
                              type="number"
                              value={draft.mrp}
                              onChange={(e) =>
                                updateInlineDraft(p, 'mrp', Number(e.target.value))
                              }
                              className="w-28 h-9 px-2.5 rounded-xl border border-[#E5E7EB] text-[#737373] font-bold tabular-nums"
                            />
                          </td>

                          {/* Inline Exchange Bonus Input */}
                          <td className="p-2.5">
                            <input
                              type="number"
                              value={draft.exchangeBonus}
                              onChange={(e) =>
                                updateInlineDraft(p, 'exchangeBonus', Number(e.target.value))
                              }
                              className="w-24 h-9 px-2.5 rounded-xl border border-[#E5E7EB] text-emerald-700 font-bold tabular-nums"
                            />
                          </td>

                          {/* Inline EMI Input */}
                          <td className="p-2.5">
                            <input
                              type="number"
                              value={draft.emiStartingAt}
                              onChange={(e) =>
                                updateInlineDraft(p, 'emiStartingAt', Number(e.target.value))
                              }
                              className="w-24 h-9 px-2.5 rounded-xl border border-[#E5E7EB] text-[#2563EB] font-bold tabular-nums"
                            />
                          </td>

                          {/* Inline Stock Input */}
                          <td className="p-2.5">
                            <input
                              type="number"
                              value={draft.stock}
                              onChange={(e) =>
                                updateInlineDraft(p, 'stock', Number(e.target.value))
                              }
                              className="w-20 h-9 px-2.5 rounded-xl border border-[#E5E7EB] font-bold tabular-nums"
                            />
                          </td>

                          <td className="p-3.5 text-right whitespace-nowrap space-x-1.5">
                            <button
                              type="button"
                              onClick={() => saveInlineProductRow(p)}
                              className={`h-9 px-3 rounded-xl font-bold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                                isDirty
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-slate-100 text-[#737373] hover:bg-slate-200'
                              }`}
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save Price</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProduct(p);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="h-9 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563EB] font-bold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Full Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteProduct(p.id)}
                              className="h-9 px-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 inline-flex items-center cursor-pointer"
                              aria-label="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 2: CATEGORY MANAGEMENT (CREATE + EDIT + CLOUDINARY UPLOAD)
        ===================================================================== */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <form
              onSubmit={handleSaveCategoryForm}
              className="lg:col-span-4 bg-white rounded-3xl border border-[#E5E7EB] p-5 space-y-3.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-[#171717]">
                  {editingCategoryId ? 'Edit Category' : 'Add New Category'}
                </h2>
                {editingCategoryId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategoryId(null);
                      setCatName('');
                      setCatSlug('');
                      setCatBadge('');
                      setCatImage('');
                    }}
                    className="text-rose-600 font-bold cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div>
                <label className="block font-bold mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. 5G Smartphones"
                  className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold mb-1">Slug</label>
                  <input
                    type="text"
                    value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value)}
                    placeholder="smartphones"
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={catOrder}
                    onChange={(e) => setCatOrder(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Highlight Tag / Badge (Optional)</label>
                <input
                  type="text"
                  value={catBadge}
                  onChange={(e) => setCatBadge(e.target.value)}
                  placeholder="e.g. Hot, New, Up to 40% Off"
                  className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F5F6F8] space-y-2">
                <label className="block font-bold">
                  Category Icon / Image (Cloudinary Upload)
                </label>
                <input
                  type="text"
                  value={catImage}
                  onChange={(e) => setCatImage(e.target.value)}
                  placeholder="Paste URL or Upload below"
                  className="w-full h-9 px-3 rounded-xl bg-white border border-[#E5E7EB]"
                />
                <label className="w-full h-9 rounded-xl bg-[#101114] text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingImage ? 'Uploading...' : 'Upload via Cloudinary'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleSingleImageUpload(e, setCatImage)}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                type="submit"
                className="w-full h-10 rounded-xl bg-[#2563EB] text-white font-extrabold cursor-pointer"
              >
                {editingCategoryId ? 'Update Category' : 'Create Category'}
              </button>
            </form>

            <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E5E7EB] p-5">
              <h2 className="text-base font-extrabold text-[#171717] mb-3">
                All Store Categories ({categories.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-3 rounded-2xl border border-[#E5E7EB] flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] p-1 shrink-0 border border-[#E5E7EB]">
                        <SmartImage src={cat.image} alt={cat.name} />
                      </div>
                      <div className="truncate">
                        <p className="font-extrabold text-[#171717] truncate">{cat.name}</p>
                        <p className="text-[10px] text-[#737373]">
                          /{cat.slug} · Order #{cat.order}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEditCategory(cat)}
                        className="p-1.5 rounded-lg bg-blue-50 text-[#2563EB] cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCategory(cat.id)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 3: HERO BANNERS MANAGEMENT (PHOTO + VIDEO + 5-SEC AUTO-SLIDE)
        ===================================================================== */}
        {activeTab === 'banners' && (
          <div className="space-y-5">
            {/* Banner Auto-Slide Timer Bar (Default: 5 Seconds) */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#F26522] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#171717]">
                    Hero Banner Auto-Change Timer (Currently: {storeSettings.bannerIntervalSeconds || 5} Seconds)
                  </h3>
                  <p className="text-[#737373] mt-0.5">
                    Homepage banners (Photos &amp; Videos) automatically slide every{' '}
                    <span className="font-bold text-[#171717]">
                      {storeSettings.bannerIntervalSeconds || 5} seconds
                    </span>
                    . Change the timer speed anytime below.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {[3, 5, 7, 10].map((sec) => {
                  const isCurrent = (storeSettings.bannerIntervalSeconds || 5) === sec;
                  return (
                    <button
                      key={sec}
                      type="button"
                      onClick={() =>
                        updateStoreSettings({
                          ...storeSettings,
                          bannerIntervalSeconds: sec,
                        })
                      }
                      className={`h-9 px-3.5 rounded-xl font-extrabold cursor-pointer transition-colors ${
                        isCurrent
                          ? 'bg-[#F26522] text-white shadow-xs'
                          : 'bg-[#F5F6F8] border border-[#E5E7EB] text-[#171717] hover:border-[#F26522]'
                      }`}
                    >
                      {sec}s {sec === 5 ? '(Default)' : ''}
                    </button>
                  );
                })}
                <div className="flex items-center gap-1.5 bg-[#F5F6F8] border border-[#E5E7EB] rounded-xl px-2.5 h-9">
                  <span className="text-[11px] font-bold text-[#737373]">Custom (sec):</span>
                  <input
                    type="number"
                    min={2}
                    max={60}
                    value={storeSettings.bannerIntervalSeconds || 5}
                    onChange={(e) =>
                      updateStoreSettings({
                        ...storeSettings,
                        bannerIntervalSeconds: Math.max(2, Number(e.target.value) || 5),
                      })
                    }
                    className="w-12 text-center font-extrabold text-[#171717] bg-transparent focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <form
                onSubmit={handleSaveBannerForm}
                className="lg:col-span-5 bg-white rounded-3xl border border-[#E5E7EB] p-5 space-y-3.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-[#171717]">
                    {editingBannerId ? 'Edit Hero Banner' : 'Add Photo / Video Hero Banner'}
                  </h2>
                  {editingBannerId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingBannerId(null);
                        setBannerTitle('');
                        setBannerSub('');
                        setBannerImage('');
                        setBannerVideoUrl('');
                        setBannerMediaType('image');
                      }}
                      className="text-rose-600 font-bold cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                {/* Media Type Toggle: Photo vs Video Banner */}
                <div>
                  <label className="block font-bold mb-1.5">Select Banner Media Type *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBannerMediaType('image')}
                      className={`h-10 rounded-xl font-extrabold flex items-center justify-center gap-2 border cursor-pointer transition-colors ${
                        bannerMediaType === 'image'
                          ? 'bg-[#2563EB] text-white border-[#2563EB]'
                          : 'bg-[#F5F6F8] text-[#171717] border-[#E5E7EB]'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Photo Banner</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBannerMediaType('video')}
                      className={`h-10 rounded-xl font-extrabold flex items-center justify-center gap-2 border cursor-pointer transition-colors ${
                        bannerMediaType === 'video'
                          ? 'bg-[#F26522] text-white border-[#F26522]'
                          : 'bg-[#F5F6F8] text-[#171717] border-[#E5E7EB]'
                      }`}
                    >
                      <Film className="w-4 h-4" />
                      <span>Video Banner</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">Campaign Kicker Tag</label>
                  <input
                    type="text"
                    value={bannerTag}
                    onChange={(e) => setBannerTag(e.target.value)}
                    placeholder="CHARLIE MOBILE EXCLUSIVE"
                    className="w-full h-9 px-3 rounded-xl border border-[#E5E7EB]"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Main Banner Headline *</label>
                  <input
                    type="text"
                    required
                    value={bannerTitle}
                    onChange={(e) => setBannerTitle(e.target.value)}
                    placeholder="e.g. Your Next Smartphone Awaits"
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Subheadline</label>
                  <textarea
                    rows={2}
                    value={bannerSub}
                    onChange={(e) => setBannerSub(e.target.value)}
                    placeholder="Up to ₹9,000 instant exchange bonus..."
                    className="w-full p-3 rounded-xl border border-[#E5E7EB]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold mb-1">Primary CTA Button</label>
                    <input
                      type="text"
                      value={bannerCtaText}
                      onChange={(e) => setBannerCtaText(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-[#E5E7EB]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Primary CTA Link</label>
                    <input
                      type="text"
                      value={bannerCtaLink}
                      onChange={(e) => setBannerCtaLink(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-[#E5E7EB]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold mb-1">Secondary CTA Text</label>
                    <input
                      type="text"
                      value={bannerSecCtaText}
                      onChange={(e) => setBannerSecCtaText(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-[#E5E7EB]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Secondary CTA Link</label>
                    <input
                      type="text"
                      value={bannerSecCtaLink}
                      onChange={(e) => setBannerSecCtaLink(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-[#E5E7EB]"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F5F6F8] space-y-2.5">
                  <label className="block font-bold">
                    {bannerMediaType === 'video'
                      ? `Upload Video or Paste Video URL (MP4 / WebM — Cloudinary: ${cloudinaryInfo.cloudName})`
                      : `Upload Photo or Paste Image URL (Cloudinary: ${cloudinaryInfo.cloudName})`}
                  </label>

                  {bannerMediaType === 'video' ? (
                    <>
                      <input
                        type="text"
                        value={bannerVideoUrl}
                        onChange={(e) => setBannerVideoUrl(e.target.value)}
                        placeholder="Paste MP4 / Video URL or Upload Video below"
                        className="w-full h-9 px-3 rounded-xl bg-white border border-[#E5E7EB]"
                      />
                      <input
                        type="text"
                        value={bannerImage}
                        onChange={(e) => setBannerImage(e.target.value)}
                        placeholder="Optional Fallback Poster Image URL"
                        className="w-full h-9 px-3 rounded-xl bg-white border border-[#E5E7EB]"
                      />
                    </>
                  ) : (
                    <input
                      type="text"
                      value={bannerImage}
                      onChange={(e) => setBannerImage(e.target.value)}
                      placeholder="Paste Image URL or Upload Photo/Video below"
                      className="w-full h-9 px-3 rounded-xl bg-white border border-[#E5E7EB]"
                    />
                  )}

                  <label className="w-full h-10 rounded-xl bg-[#101114] hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-[#F26522]" />
                    <span>
                      {uploadingImage
                        ? 'Uploading to Cloudinary...'
                        : 'Upload Photo or Video from Device'}
                    </span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleBannerMediaUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Live Preview inside Form */}
                  {(bannerVideoUrl || bannerImage) && (
                    <div className="pt-1">
                      <p className="text-[10px] font-bold text-[#737373] mb-1">Live Banner Preview:</p>
                      <div className="w-full h-32 rounded-xl bg-[#101114] overflow-hidden flex items-center justify-center border border-[#E5E7EB]">
                        {bannerMediaType === 'video' || isVideoUrl(bannerVideoUrl || bannerImage) ? (
                          <video
                            src={bannerVideoUrl || bannerImage}
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                            controls
                          />
                        ) : (
                          <SmartImage
                            src={bannerImage}
                            alt="Preview"
                            className="w-full h-full object-contain"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full h-10 rounded-xl bg-[#2563EB] text-white font-extrabold cursor-pointer"
                >
                  {editingBannerId ? 'Save Banner Changes' : 'Publish Hero Banner'}
                </button>
              </form>

              <div className="lg:col-span-7 space-y-3">
                {banners.map((b, idx) => {
                  const isVid =
                    b.mediaType === 'video' || isVideoUrl(b.videoUrl) || isVideoUrl(b.image);
                  return (
                    <div
                      key={b.id}
                      className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-24 h-20 rounded-xl bg-[#101114] p-1 shrink-0 relative overflow-hidden flex items-center justify-center">
                          {isVid ? (
                            <>
                              <video
                                src={b.videoUrl || b.image}
                                className="w-full h-full object-cover rounded-lg"
                                autoPlay
                                muted
                                loop
                                playsInline
                              />
                              <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#F26522] text-white text-[9px] font-extrabold flex items-center gap-0.5">
                                <Play className="w-2.5 h-2.5 fill-white" /> VIDEO
                              </span>
                            </>
                          ) : (
                            <>
                              <SmartImage src={b.image} alt={b.title} />
                              <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-extrabold">
                                PHOTO
                              </span>
                            </>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-extrabold text-[#2563EB] uppercase">
                              #{idx + 1} · {b.tag}
                            </span>
                          </div>
                          <p className="font-extrabold text-sm text-[#171717]">{b.title}</p>
                          <p className="text-[#737373] line-clamp-2 mt-0.5">{b.subtitle}</p>
                          <span className="inline-block mt-1 text-[11px] font-bold text-[#171717]">
                            CTA: {b.ctaText} ({b.ctaLink})
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveBannerOrder(idx, 'up')}
                          title="Move Banner Up"
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 disabled:opacity-35 cursor-pointer"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === banners.length - 1}
                          onClick={() => handleMoveBannerOrder(idx, 'down')}
                          title="Move Banner Down"
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 disabled:opacity-35 cursor-pointer"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => startEditBanner(b)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#2563EB] font-bold cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => saveBanner({ ...b, enabled: !b.enabled })}
                          className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                            b.enabled
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {b.enabled ? 'Active' : 'Hidden'}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteBanner(b.id)}
                          className="p-2 rounded-lg bg-rose-50 text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 4: COUPONS & OFFERS MANAGER
        ===================================================================== */}
        {activeTab === 'coupons' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <form
              onSubmit={handleSaveCouponForm}
              className="lg:col-span-4 bg-white rounded-3xl border border-[#E5E7EB] p-5 space-y-3.5 text-xs"
            >
              <h2 className="text-base font-extrabold text-[#171717]">
                Create or Update Coupon Code
              </h2>
              <div>
                <label className="block font-bold mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. DIWALI2000"
                  className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] font-mono font-bold uppercase"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Offer Title *</label>
                <input
                  type="text"
                  required
                  value={couponTitle}
                  onChange={(e) => setCouponTitle(e.target.value)}
                  placeholder="e.g. Flat ₹2,000 Instant Discount"
                  className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Description</label>
                <input
                  type="text"
                  value={couponDesc}
                  onChange={(e) => setCouponDesc(e.target.value)}
                  placeholder="Valid on 5G Smartphones above ₹20,000"
                  className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold mb-1">Discount Type</label>
                  <select
                    value={couponType}
                    onChange={(e) =>
                      setCouponType(e.target.value as 'flat' | 'percentage')
                    }
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] bg-white"
                  >
                    <option value="flat">Flat Amount (₹)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">
                    {couponType === 'flat' ? 'Discount (₹)' : 'Discount (%)'}
                  </label>
                  <input
                    type="number"
                    required
                    value={couponValue}
                    onChange={(e) => setCouponValue(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    value={couponMinOrder}
                    onChange={(e) => setCouponMinOrder(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                  />
                </div>
                {couponType === 'percentage' && (
                  <div>
                    <label className="block font-bold mb-1">Max Cap (₹)</label>
                    <input
                      type="number"
                      value={couponMaxDisc}
                      onChange={(e) => setCouponMaxDisc(Number(e.target.value))}
                      className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                    />
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="w-full h-10 rounded-xl bg-[#2563EB] text-white font-extrabold cursor-pointer"
              >
                Save Coupon Offer
              </button>
            </form>

            <div className="lg:col-span-8 space-y-3">
              {coupons.map((c) => (
                <div
                  key={c.code}
                  className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-[#101114] text-[#00C2FF] font-mono font-extrabold">
                        {c.code}
                      </span>
                      <span className="font-extrabold text-sm text-[#171717]">{c.title}</span>
                    </div>
                    <p className="text-[#737373] mt-1">{c.description}</p>
                    <p className="text-[11px] font-bold text-[#2563EB] mt-1 tabular-nums">
                      Min Order: {formatINR(c.minOrderAmount)} · Value:{' '}
                      {c.discountType === 'flat'
                        ? formatINR(c.discountValue)
                        : `${c.discountValue}%`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setCouponCode(c.code);
                        setCouponTitle(c.title);
                        setCouponDesc(c.description);
                        setCouponType(c.discountType);
                        setCouponValue(c.discountValue);
                        setCouponMinOrder(c.minOrderAmount);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#2563EB] font-bold cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => saveCoupon({ ...c, active: !c.active })}
                      className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                        c.active
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {c.active ? 'Active' : 'Disabled'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCoupon(c.code)}
                      className="p-2 rounded-lg bg-rose-50 text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 5: ORDERS MANAGEMENT
        ===================================================================== */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-5 space-y-4">
            <h2 className="text-base font-extrabold text-[#171717]">
              Customer Orders &amp; Payment Status Management ({orders.length})
            </h2>
            {orders.length === 0 ? (
              <p className="text-xs text-[#737373] py-6">
                No customer orders placed yet. Orders placed via Checkout will appear here in real time.
              </p>
            ) : (
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl border border-[#E5E7EB] bg-[#F5F6F8] flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#171717]">
                          Order #{ord.id}
                        </span>
                        <span className="text-[#737373]">
                          · {new Date(ord.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="font-bold text-[#171717]">
                        Customer: {ord.customerName} · Phone: {ord.customerPhone} · Email:{' '}
                        {ord.customerEmail}
                      </p>
                      <p className="text-[#737373]">Address / Pickup: {ord.shippingAddress}</p>
                      <p className="font-semibold text-[#2563EB]">Items: {ord.itemsSummary}</p>
                      <p className="font-extrabold text-sm text-[#171717] tabular-nums">
                        Total: {formatINR(ord.totalAmount)} ({ord.paymentMethod.toUpperCase()} —{' '}
                        {ord.paymentStatus})
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {(
                          [
                            'pending',
                            'confirmed',
                            'processing',
                            'shipped',
                            'delivered',
                            'cancelled',
                          ] as Order['status'][]
                        ).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() =>
                              updateOrderStatus(
                                ord.id,
                                st,
                                st === 'delivered' ? 'paid' : ord.paymentStatus
                              )
                            }
                            className={`px-3 py-1.5 rounded-xl font-bold capitalize cursor-pointer ${
                              ord.status === st
                                ? 'bg-[#2563EB] text-white'
                                : 'bg-white border border-[#E5E7EB] text-[#171717]'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-[#737373]">Payment:</span>
                        {(
                          ['cod_due', 'pending_verification', 'paid', 'failed'] as Order['paymentStatus'][]
                        ).map((pst) => (
                          <button
                            key={pst}
                            type="button"
                            onClick={() => updateOrderStatus(ord.id, ord.status, pst)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase cursor-pointer ${
                              ord.paymentStatus === pst
                                ? 'bg-[#101114] text-[#00C2FF]'
                                : 'bg-white border border-[#E5E7EB] text-[#737373]'
                            }`}
                          >
                            {pst.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =====================================================================
            TAB 6: STORE & WEBSITE CONTENT SETTINGS + CLOUDINARY + SHOWROOM PHOTOS
        ===================================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <form
              onSubmit={handleSaveSettingsSubmit}
              className="bg-white rounded-3xl border border-[#E5E7EB] p-5 sm:p-6 space-y-5 text-xs"
            >
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#171717]">
                    Store Details, Website Copy, Offers &amp; Cloudinary Settings
                  </h2>
                  <p className="text-[#737373]">
                    Every detail below dynamically updates the Header, Homepage, Offers, Checkout, Store Locator, and Footer.
                  </p>
                </div>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-[#2563EB] text-white font-extrabold flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Settings</span>
                </button>
              </div>

              {/* Cloudinary Configuration Box */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold text-[#171717] mb-1">
                    Cloudinary Cloud Name *
                  </label>
                  <input
                    type="text"
                    value={cloudNameInput}
                    onChange={(e) => setCloudNameInput(e.target.value)}
                    placeholder="dxeuzdwkz"
                    className="w-full h-10 px-3 rounded-xl bg-white border border-[#E5E7EB] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-extrabold text-[#171717] mb-1">
                    Cloudinary Upload Preset (Unsigned) *
                  </label>
                  <input
                    type="text"
                    value={uploadPresetInput}
                    onChange={(e) => setUploadPresetInput(e.target.value)}
                    placeholder="charliemobile"
                    className="w-full h-10 px-3 rounded-xl bg-white border border-[#E5E7EB] font-mono font-bold"
                  />
                </div>
              </div>

              {/* Store Identity & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold mb-1">Official Brand Name</label>
                  <input
                    type="text"
                    value={settingsForm.storeName}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, storeName: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Full Business Name</label>
                  <input
                    type="text"
                    value={settingsForm.businessName}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, businessName: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Store Tagline</label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, tagline: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1">Physical Store Address</label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, address: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">City / Primary Hub</label>
                  <input
                    type="text"
                    value={settingsForm.city}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, city: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Store Phone Number</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, phone: e.target.value })
                    }
                    placeholder="e.g. +91 98XXXXXXXX"
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">
                    WhatsApp Business Number (with country code, e.g. 9198XXXXXXXX)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })
                    }
                    placeholder="e.g. 9198XXXXXXXX"
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Official Email</label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, email: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Opening Hours</label>
                  <input
                    type="text"
                    value={settingsForm.openingHours}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, openingHours: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Google Maps Direction Link</label>
                  <input
                    type="text"
                    value={settingsForm.mapLink}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, mapLink: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Merchant UPI ID (For Checkout)</label>
                  <input
                    type="text"
                    value={settingsForm.upiId}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, upiId: e.target.value })
                    }
                    placeholder="e.g. charliemobile@upi"
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Bank Cashback Strip Headline</label>
                  <input
                    type="text"
                    value={settingsForm.bankOfferTitle || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, bankOfferTitle: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Bank Cashback Partner Subtitle</label>
                  <input
                    type="text"
                    value={settingsForm.bankOfferSubtitle || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, bankOfferSubtitle: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Max Exchange Bonus Banner (₹)</label>
                  <input
                    type="number"
                    value={settingsForm.exchangeMaxBonus || 9000}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        exchangeMaxBonus: Number(e.target.value),
                      })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Starting Monthly EMI Banner (₹)</label>
                  <input
                    type="number"
                    value={settingsForm.emiStartingPrice || 699}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        emiStartingPrice: Number(e.target.value),
                      })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] tabular-nums"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1">Top Promotional Announcement Text</label>
                  <input
                    type="text"
                    value={settingsForm.announcementText}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, announcementText: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">
                    Hero Banner Auto-Slide Speed (Seconds)
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={60}
                    value={settingsForm.bannerIntervalSeconds || 5}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        bannerIntervalSeconds: Math.max(2, Number(e.target.value) || 5),
                      })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] tabular-nums font-bold"
                  />
                </div>
              </div>

              {/* Website Logo, Festive Strip Banner & Seasonal Deals Banners Control */}
              <div className="p-4 rounded-2xl bg-[#F5F6F8] border border-[#E5E7EB] space-y-4">
                <h3 className="text-sm font-extrabold text-[#171717]">
                  Website Logo, Festive Strip &amp; Promotional Banners Control
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-[#E5E7EB]">
                    <img
                      src={settingsForm.logoUrl || '/charlie-logo.png'}
                      alt="Current Store Logo"
                      className="h-12 w-auto object-contain shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-extrabold text-[#171717] text-xs">Active Store Logo</p>
                      <button
                        type="button"
                        onClick={() =>
                          setSettingsForm({ ...settingsForm, logoUrl: '/charlie-logo.png' })
                        }
                        className="text-[11px] font-bold text-[#F26522] hover:underline cursor-pointer mt-0.5"
                      >
                        Reset to Default CM Logo
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Website Logo URL</label>
                    <input
                      type="text"
                      value={settingsForm.logoUrl || '/charlie-logo.png'}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, logoUrl: e.target.value })
                      }
                      placeholder="/charlie-logo.png"
                      className="w-full h-10 px-3 rounded-xl bg-white border border-[#E5E7EB]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Upload Custom Logo (Cloudinary)</label>
                    <label className="w-full h-10 px-3 rounded-xl bg-[#101114] text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-[#F26522]" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload New Logo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleSingleImageUpload(e, (url) =>
                            setSettingsForm((prev) => ({ ...prev, logoUrl: url }))
                          )
                        }
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Top Festive Deals Strip Banner & Seasonal Deals Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t border-[#E5E7EB]">
                  <div>
                    <label className="block font-bold mb-1">Top Festive Strip Banner URL</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={settingsForm.festiveStripBannerUrl || ''}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            festiveStripBannerUrl: e.target.value,
                          })
                        }
                        placeholder="Image URL for top strip banner"
                        className="flex-1 h-10 px-3 rounded-xl bg-white border border-[#E5E7EB]"
                      />
                      <label className="h-10 px-3 rounded-xl bg-[#101114] text-white font-bold flex items-center justify-center cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleSingleImageUpload(e, (url) =>
                              setSettingsForm((prev) => ({
                                ...prev,
                                festiveStripBannerUrl: url,
                              }))
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Top Festive Strip Click Link</label>
                    <input
                      type="text"
                      value={settingsForm.festiveStripBannerLink || '/offers'}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          festiveStripBannerLink: e.target.value,
                        })
                      }
                      placeholder="/offers"
                      className="w-full h-10 px-3 rounded-xl bg-white border border-[#E5E7EB]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Seasonal Deals Main Banner</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={settingsForm.seasonalMainBannerUrl || ''}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            seasonalMainBannerUrl: e.target.value,
                          })
                        }
                        placeholder="Image URL for seasonal deals banner"
                        className="flex-1 h-10 px-3 rounded-xl bg-white border border-[#E5E7EB]"
                      />
                      <label className="h-10 px-3 rounded-xl bg-[#101114] text-white font-bold flex items-center justify-center cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleSingleImageUpload(e, (url) =>
                              setSettingsForm((prev) => ({
                                ...prev,
                                seasonalMainBannerUrl: url,
                              }))
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Seasonal Deals Section Heading</label>
                    <input
                      type="text"
                      value={settingsForm.seasonalDealsTitle || 'Monsoon Appliance Deals'}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          seasonalDealsTitle: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl bg-white border border-[#E5E7EB]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold mb-1">Seasonal Deals Subtitle</label>
                    <input
                      type="text"
                      value={settingsForm.seasonalDealsSubtitle || ''}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          seasonalDealsSubtitle: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl bg-white border border-[#E5E7EB]"
                    />
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#E5E7EB]">
                  <div>
                    <label className="block font-bold mb-1">Instagram Profile Link</label>
                    <input
                      type="text"
                      value={settingsForm.instagramUrl || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })
                      }
                      placeholder="https://instagram.com/..."
                      className="w-full h-10 px-3 rounded-xl bg-white border border-[#E5E7EB]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Facebook Page Link</label>
                    <input
                      type="text"
                      value={settingsForm.facebookUrl || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })
                      }
                      placeholder="https://facebook.com/..."
                      className="w-full h-10 px-3 rounded-xl bg-white border border-[#E5E7EB]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">YouTube Channel Link</label>
                    <input
                      type="text"
                      value={settingsForm.youtubeUrl || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, youtubeUrl: e.target.value })
                      }
                      placeholder="https://youtube.com/..."
                      className="w-full h-10 px-3 rounded-xl bg-white border border-[#E5E7EB]"
                    />
                  </div>
                </div>
              </div>

              {/* Checkout & Fulfillment Toggles */}
              <div className="pt-2 flex flex-wrap gap-4">
                {[
                  { key: 'codEnabled', label: 'Cash on Delivery / Pay at Store' },
                  { key: 'onlinePaymentEnabled', label: 'UPI / Online Payment' },
                  { key: 'storePickupEnabled', label: 'Express Store Pickup' },
                  { key: 'localDeliveryEnabled', label: '2-Hour Local Delivery' },
                  { key: 'shippingEnabled', label: 'All-India Courier Shipping' },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="px-3.5 py-2 rounded-xl bg-[#F5F6F8] border border-[#E5E7EB] flex items-center gap-2 font-bold cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(settingsForm[item.key as keyof typeof settingsForm])}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          [item.key]: e.target.checked,
                        })
                      }
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>

              <button
                type="submit"
                className="h-11 px-6 rounded-xl bg-[#2563EB] text-white font-extrabold cursor-pointer"
              >
                Save Store &amp; Website Settings
              </button>
            </form>

            {/* Physical Showroom Photographs Manager (Cloudinary Upload) */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-5 sm:p-6 space-y-4 text-xs">
              <h3 className="text-base font-extrabold text-[#171717]">
                Physical Showroom Photos (Displayed on Homepage &amp; Store Locator)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {currentShowroomPhotos.map((photo, idx) => (
                  <div
                    key={`${photo.title}-${idx}`}
                    className="p-3 rounded-2xl border border-[#E5E7EB] space-y-2"
                  >
                    <div className="aspect-video rounded-xl bg-[#101114] overflow-hidden">
                      <img
                        src={photo.src}
                        alt={photo.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="font-extrabold text-[#171717] line-clamp-1">{photo.title}</p>
                    <p className="text-[#737373] line-clamp-1">{photo.caption}</p>
                    <button
                      type="button"
                      onClick={() => handleRemoveShowroomPhoto(idx)}
                      className="text-rose-600 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Photo</span>
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F6F8] grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="block font-bold mb-1">Photo Title</label>
                  <input
                    type="text"
                    value={newShowroomTitle}
                    onChange={(e) => setNewShowroomTitle(e.target.value)}
                    placeholder="Storefront / Counter"
                    className="w-full h-9 px-3 rounded-xl bg-white border border-[#E5E7EB]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Caption</label>
                  <input
                    type="text"
                    value={newShowroomCaption}
                    onChange={(e) => setNewShowroomCaption(e.target.value)}
                    placeholder="Charlie Mobile Showroom"
                    className="w-full h-9 px-3 rounded-xl bg-white border border-[#E5E7EB]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Upload via Cloudinary</label>
                  <label className="w-full h-9 px-3 rounded-xl bg-[#101114] text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : 'Choose Store Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSingleImageUpload(e, setNewShowroomSrc)}
                      className="hidden"
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleAddShowroomPhoto}
                  className="h-9 px-4 rounded-xl bg-[#2563EB] text-white font-extrabold cursor-pointer"
                >
                  + Add Showroom Photo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 7: HOMEPAGE SECTIONS & CATALOG RESET
        ===================================================================== */}
        {activeTab === 'homepage' && (
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E7EB] pb-4">
              <div>
                <h2 className="text-base font-extrabold text-[#171717]">
                  Customize Homepage Section Titles &amp; Visibility
                </h2>
                <p className="text-xs text-[#737373]">
                  Rename any homepage section heading or toggle sections on/off.
                </p>
              </div>
              <button
                type="button"
                onClick={resetCatalogToDefaults}
                className="h-9 px-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 self-start cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Default Catalog &amp; Settings</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {homepageSections.map((sec, idx) => (
                <div
                  key={sec.id}
                  className="p-3.5 rounded-2xl border border-[#E5E7EB] flex items-center justify-between gap-3"
                >
                  <input
                    type="text"
                    value={sec.title}
                    onChange={(e) => {
                      const updated = [...homepageSections];
                      updated[idx] = { ...sec, title: e.target.value };
                      updateHomepageSections(updated);
                    }}
                    className="flex-1 h-9 px-3 rounded-xl bg-[#F5F6F8] font-bold text-[#171717]"
                  />
                  <label className="flex items-center gap-1.5 font-semibold cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={sec.enabled}
                      onChange={(e) => {
                        const updated = [...homepageSections];
                        updated[idx] = { ...sec, enabled: e.target.checked };
                        updateHomepageSections(updated);
                      }}
                    />
                    <span>Visible</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 8: ANALYTICS & INVENTORY OVERVIEW
        ===================================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4">
                <span className="text-xs text-[#737373] font-medium">Total Products</span>
                <p className="text-2xl font-extrabold text-[#171717] mt-1 tabular-nums">
                  {products.length}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4">
                <span className="text-xs text-[#737373] font-medium">Total Orders</span>
                <p className="text-2xl font-extrabold text-[#171717] mt-1 tabular-nums">
                  {orders.length}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4">
                <span className="text-xs text-[#737373] font-medium">Pending Orders</span>
                <p className="text-2xl font-extrabold text-amber-600 mt-1 tabular-nums">
                  {pendingOrders.length}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4">
                <span className="text-xs text-[#737373] font-medium">Total Customers</span>
                <p className="text-2xl font-extrabold text-[#171717] mt-1 tabular-nums">
                  {uniqueCustomers}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 col-span-2 lg:col-span-1">
                <span className="text-xs text-[#737373] font-medium">Total Revenue</span>
                <p className="text-2xl font-extrabold text-[#2563EB] mt-1 tabular-nums">
                  {formatINR(totalRevenue)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-[#E5E7EB] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-[#171717]">Recent Orders</h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-[#2563EB] flex items-center gap-1 cursor-pointer"
                  >
                    <span>Manage All</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {orders.length === 0 ? (
                  <p className="text-xs text-[#737373] py-4">
                    No customer orders placed yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {orders.slice(0, 5).map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3 rounded-xl bg-[#F5F6F8] flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-[#171717]">
                            #{ord.id} · {ord.customerName}
                          </p>
                          <p className="text-[#737373] truncate max-w-xs">{ord.itemsSummary}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-extrabold text-[#171717] tabular-nums">
                            {formatINR(ord.totalAmount)}
                          </p>
                          <span className="uppercase text-[10px] font-bold text-[#2563EB]">
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-3xl border border-[#E5E7EB] p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h2 className="text-base font-extrabold text-[#171717]">
                    Low Stock Inventory ({lowStockProducts.length})
                  </h2>
                </div>
                <div className="space-y-2">
                  {lowStockProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl bg-[#F5F6F8] flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-[#171717]">{p.name}</p>
                        <p className="text-[#737373]">{p.brand}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-amber-700 tabular-nums">
                          {p.stock} left
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(p);
                            setActiveTab('products');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#101114] text-white font-bold cursor-pointer"
                        >
                          Edit Stock / Price
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
