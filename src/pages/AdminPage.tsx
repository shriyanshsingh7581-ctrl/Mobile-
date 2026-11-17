import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
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
  Gift,
  Image as ImageIcon,
  KeyRound,
  Layers,
  LayoutGrid,
  Lock,
  LogOut,
  MessageCircle,
  MoreHorizontal,
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
  Sparkles,
  Star,
  Trash2,
  Upload,
  Video,
  X,
} from 'lucide-react';
import { formatINR, useStore } from '../context/StoreContext';
import {
  BlogPostItem,
  CategoryItem,
  CelebrityReelItem,
  ColorVariant,
  Coupon,
  HeroBanner,
  Order,
  Product,
  ShowroomPhoto,
  TestimonialItem,
  VisualCardItem,
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
    celebrityReels,
    shopByNotes,
    shopByOccasions,
    testimonials,
    blogPosts,
    rewardLeads,
    notifyMeRequests,
    coupons,
    orders,
    supportChats,
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
    saveCelebrityReel,
    deleteCelebrityReel,
    reorderCelebrityReels,
    saveShopByNotes,
    saveShopByOccasions,
    saveTestimonials,
    saveBlogPosts,
    saveCoupon,
    deleteCoupon,
    updateOrderStatus,
    updateStoreSettings,
    updateHomepageSections,
    resetCatalogToDefaults,
    sendAdminChatReply,
    deleteSupportChat,
    refreshSupportChats,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    | 'products'
    | 'reels'
    | 'banners'
    | 'editorial'
    | 'categories'
    | 'coupons'
    | 'orders'
    | 'chats'
    | 'settings'
    | 'homepage'
    | 'dashboard'
  >('products');

  // Mobile Navigation & Live AI Chats Monitor State
  const [showMobileMoreSheet, setShowMobileMoreSheet] = useState(false);
  const [mobileChatView, setMobileChatView] = useState<'list' | 'thread'>('list');
  const [selectedChatUserId, setSelectedChatUserId] = useState<string>('');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [adminReplyInput, setAdminReplyInput] = useState('');

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
  const [newColorHex, setNewColorHex] = useState('#B5893D');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');

  // Video Reel ("Loved By Celebrities") Form State
  const [editingReelId, setEditingReelId] = useState<string | null>(null);
  const [reelTitle, setReelTitle] = useState('');
  const [reelCelebrity, setReelCelebrity] = useState('');
  const [reelVideoUrl, setReelVideoUrl] = useState('');
  const [reelPosterUrl, setReelPosterUrl] = useState('');
  const [reelProductId, setReelProductId] = useState(products[0]?.id || '');

  // Category Form State
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catOrder, setCatOrder] = useState(categories.length + 1);
  const [catBadge, setCatBadge] = useState('');
  const [catImage, setCatImage] = useState('');

  // Banner Form State (Photo & Video)
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSub, setBannerSub] = useState('');
  const [bannerTag, setBannerTag] = useState('ROYAL LUXURY SERIES');
  const [bannerCtaText, setBannerCtaText] = useState('SHOP NOW');
  const [bannerCtaLink, setBannerCtaLink] = useState('/products');
  const [bannerSecCtaText, setBannerSecCtaText] = useState('EXPLORE');
  const [bannerSecCtaLink, setBannerSecCtaLink] = useState('/offers');
  const [bannerAccent, setBannerAccent] = useState('#B5893D');
  const [bannerImage, setBannerImage] = useState('');
  const [bannerMediaType, setBannerMediaType] = useState<'image' | 'video'>('image');
  const [bannerVideoUrl, setBannerVideoUrl] = useState('');

  // Editorial Forms: Notes, Occasions, Testimonials, Blogs
  const [noteTitle, setNoteTitle] = useState('');
  const [noteSub, setNoteSub] = useState('');
  const [noteImage, setNoteImage] = useState('');
  const [noteLink, setNoteLink] = useState('/products');

  const [occTitle, setOccTitle] = useState('');
  const [occSub, setOccSub] = useState('');
  const [occImage, setOccImage] = useState('');
  const [occLink, setOccLink] = useState('/products');

  const [testName, setTestName] = useState('');
  const [testRole, setTestRole] = useState('Verified Buyer');
  const [testQuote, setTestQuote] = useState('');
  const [testProduct, setTestProduct] = useState('');
  const [testAvatar, setTestAvatar] = useState('');

  const [blogTitle, setBlogTitle] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogImage, setBlogImage] = useState('');
  const [blogCta, setBlogCta] = useState('Find Your Style');
  const [blogLink, setBlogLink] = useState('/products');

  // Coupon Form State
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

  useEffect(() => {
    if (activeTab !== 'chats') return;
    refreshSupportChats();
    const timer = setInterval(() => {
      refreshSupportChats();
    }, 3500);
    return () => clearInterval(timer);
  }, [activeTab]);

  useEffect(() => {
    if (!selectedChatUserId && supportChats.length > 0) {
      setSelectedChatUserId(supportChats[0].userId);
    }
  }, [supportChats, selectedChatUserId]);

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

  const toggleProductOutOfStock = async (p: Product) => {
    const nextStock = p.stock > 0 ? 0 : 15;
    await saveProduct({ ...p, stock: nextStock });
    setInlineDrafts((prev) => {
      const next = { ...prev };
      delete next[p.id];
      return next;
    });
    showToast(
      nextStock === 0
        ? `${p.name} set to Out of Stock (🔔 NOTIFY ME enabled)`
        : `${p.name} restocked (${nextStock} in stock)`
    );
  };

  const startNewProduct = () => {
    const defaultImg = generateProductStudioSvg({
      title: 'New Luxury Edition',
      brand: 'Apple',
      category: 'smartphones',
      primaryHex: '#1A1A1A',
      secondaryHex: '#B5893D',
    });
    setEditingProduct({
      id: `prod_${Date.now()}`,
      name: '',
      brand: 'Apple',
      category: 'smartphones',
      goldTagline: '5G FLAGSHIP / CAMERA / TITANIUM',
      bestsellerTab: 'HIM',
      price: 49999,
      mrp: 54999,
      storagePriceStep: 10000,
      stock: 15,
      description:
        'Brand-new sealed flagship edition with official manufacturer warranty at Charlie Mobile & Accessories.',
      mainImage: defaultImg,
      gallery: [defaultImg],
      videoUrl: '',
      colors: [
        { name: 'Desert Titanium', hex: '#B5893D' },
        { name: 'Obsidian Black', hex: '#1A1A1A' },
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
      rating: 4.9,
      reviewCount: 42,
      warranty: '1 Year Official Brand Warranty',
      exchangeBonus: 4000,
      emiStartingAt: 2083,
      specs: {
        Display: '6.7-inch 120Hz Super Retina / AMOLED Display',
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

  const handleSingleMediaUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onResult: (url: string, mediaType: 'image' | 'video') => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await uploadMediaToCloudinary(file);
      onResult(res.url, res.mediaType);
      showToast(`Uploaded ${res.mediaType} to Cloudinary (${cloudinaryInfo.cloudName})`);
    } catch (err) {
      console.error(err);
      showToast('Failed to upload media');
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
      { name: newColorName.trim(), hex: newColorHex || '#1A1A1A' },
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

  // Celebrity Reel Submit
  const handleSaveReelForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reelVideoUrl.trim()) {
      showToast('Please upload or paste a vertical MP4 video URL');
      return;
    }
    const newReel: CelebrityReelItem = {
      id: editingReelId || `reel_${Date.now()}`,
      title: reelTitle.trim() || 'Luxury Spotlight Reel',
      celebrityName: reelCelebrity.trim() || 'Celebrity Pick',
      videoUrl: reelVideoUrl.trim(),
      posterUrl: reelPosterUrl.trim() || undefined,
      linkedProductId: reelProductId || products[0]?.id || '',
      enabled: true,
      order: editingReelId
        ? celebrityReels.find((r) => r.id === editingReelId)?.order || celebrityReels.length + 1
        : celebrityReels.length + 1,
    };
    saveCelebrityReel(newReel);
    setEditingReelId(null);
    setReelTitle('');
    setReelCelebrity('');
    setReelVideoUrl('');
    setReelPosterUrl('');
  };

  const startEditReel = (reel: CelebrityReelItem) => {
    setEditingReelId(reel.id);
    setReelTitle(reel.title);
    setReelCelebrity(reel.celebrityName || '');
    setReelVideoUrl(reel.videoUrl);
    setReelPosterUrl(reel.posterUrl || '');
    setReelProductId(reel.linkedProductId);
  };

  const handleMoveReelOrder = async (index: number, direction: 'up' | 'down') => {
    const sorted = [...celebrityReels].sort((a, b) => a.order - b.order);
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;
    const [moved] = sorted.splice(index, 1);
    sorted.splice(targetIdx, 0, moved);
    const reindexed = sorted.map((r, idx) => ({ ...r, order: idx + 1 }));
    await reorderCelebrityReels(reindexed);
  };

  // Category Submit
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
      tag: bannerTag.trim() || 'ROYAL LUXURY SERIES',
      ctaText: bannerCtaText.trim() || 'SHOP NOW',
      ctaLink: bannerCtaLink.trim() || '/products',
      secondaryCtaText: bannerSecCtaText.trim() || 'EXPLORE',
      secondaryCtaLink: bannerSecCtaLink.trim() || '/offers',
      mediaType: resolvedIsVideo ? 'video' : 'image',
      videoUrl: resolvedIsVideo ? (bannerVideoUrl.trim() || bannerImage.trim()) : undefined,
      image: bannerImage.trim() || fallbackSvg,
      accentColor: bannerAccent || '#B5893D',
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
    setBannerTag(b.tag || 'ROYAL LUXURY SERIES');
    setBannerCtaText(b.ctaText);
    setBannerCtaLink(b.ctaLink);
    setBannerSecCtaText(b.secondaryCtaText || 'EXPLORE');
    setBannerSecCtaLink(b.secondaryCtaLink || '/offers');
    setBannerAccent(b.accentColor || '#B5893D');
    setBannerImage(b.image);
    const isVid = b.mediaType === 'video' || isVideoUrl(b.videoUrl) || isVideoUrl(b.image);
    setBannerMediaType(isVid ? 'video' : 'image');
    setBannerVideoUrl(b.videoUrl || (isVid ? b.image : ''));
  };

  // Editorial: Notes, Occasions, Testimonials, Blogs handlers
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;
    const item: VisualCardItem = {
      id: `note_${Date.now()}`,
      title: noteTitle.trim(),
      subtitle: noteSub.trim() || 'Signature Note',
      image:
        noteImage.trim() ||
        'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=600&q=85',
      link: noteLink.trim() || '/products',
    };
    saveShopByNotes([...shopByNotes, item]);
    setNoteTitle('');
    setNoteSub('');
    setNoteImage('');
  };

  const handleDeleteNote = (id: string) => {
    saveShopByNotes(shopByNotes.filter((n) => n.id !== id));
  };

  const handleAddOccasion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!occTitle.trim()) return;
    const item: VisualCardItem = {
      id: `occ_${Date.now()}`,
      title: occTitle.trim().toUpperCase(),
      subtitle: occSub.trim() || 'Curated Collection',
      image:
        occImage.trim() ||
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=85',
      link: occLink.trim() || '/products',
    };
    saveShopByOccasions([...shopByOccasions, item]);
    setOccTitle('');
    setOccSub('');
    setOccImage('');
  };

  const handleDeleteOccasion = (id: string) => {
    saveShopByOccasions(shopByOccasions.filter((o) => o.id !== id));
  };

  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim() || !testQuote.trim()) return;
    const item: TestimonialItem = {
      id: `test_${Date.now()}`,
      authorName: testName.trim(),
      authorRole: testRole.trim() || 'Verified Buyer',
      rating: 5,
      quote: testQuote.trim(),
      avatarUrl:
        testAvatar.trim() ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    };
    saveTestimonials([...testimonials, item]);
    setTestName('');
    setTestQuote('');
    setTestProduct('');
    setTestAvatar('');
  };

  const handleDeleteTestimonial = (id: string) => {
    saveTestimonials(testimonials.filter((t) => t.id !== id));
  };

  const handleAddBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim()) return;
    const item: BlogPostItem = {
      id: `blog_${Date.now()}`,
      title: blogTitle.trim(),
      excerpt: blogExcerpt.trim() || 'Discover our latest luxury guide and editorial.',
      image:
        blogImage.trim() ||
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=85',
      ctaText: blogCta.trim() || 'Find Your Style',
      link: blogLink.trim() || '/products',
    };
    saveBlogPosts([...blogPosts, item]);
    setBlogTitle('');
    setBlogExcerpt('');
    setBlogImage('');
  };

  const handleDeleteBlog = (id: string) => {
    saveBlogPosts(blogPosts.filter((b) => b.id !== id));
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
      showToast('Royal Luxury Admin Console Unlocked');
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
      <div className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#2A1810] border border-[#B5893D]/40 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-28 h-16 mx-auto bg-white p-2 flex items-center justify-center border border-[#B5893D]">
              <img
                src={storeSettings.logoUrl || '/charlie-logo.png'}
                alt="Charlie Mobiles & Accessories"
                className="h-full w-auto object-contain"
              />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#B5893D]/20 text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em]">
              <Lock className="w-3.5 h-3.5" />
              <span>ROYAL LUXURY ADMIN CONSOLE</span>
            </div>
            <h1 className="font-serif-luxury text-xl sm:text-2xl font-bold uppercase tracking-[0.08em] text-white">
              Store Owner Login
            </h1>
            <p className="text-xs text-[#E5E0D8]/80">
              Enter your Admin Password to manage products, video reels, luxury banners, and orders.
            </p>
          </div>

          <form onSubmit={handleUnlockSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
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
                  className="w-full h-11 pl-4 pr-11 bg-[#1A1A1A] border border-[#B5893D]/50 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37] select-text"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordText((v) => !v)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-3 text-white/60 hover:text-white cursor-pointer"
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
              className="w-full h-11 bg-[#B5893D] hover:bg-[#9E742F] text-white text-xs font-bold uppercase tracking-[0.18em] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock Admin Panel</span>
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
            <span>Owner: charliegedekar@gmail.com</span>
            <Link to="/" className="text-[#D4AF37] font-bold hover:underline">
              ← Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sortedReels = [...celebrityReels].sort((a, b) => a.order - b.order);

  const adminTabs: {
    id: typeof activeTab;
    label: string;
    shortLabel: string;
    badge?: number;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'products',
      label: `Products & Stock (${products.length})`,
      shortLabel: 'Products',
      badge: products.length,
      icon: Package,
    },
    {
      id: 'orders',
      label: `Orders & Leads (${orders.length + rewardLeads.length + notifyMeRequests.length})`,
      shortLabel: 'Orders',
      badge: orders.length + rewardLeads.length + notifyMeRequests.length,
      icon: ShoppingBag,
    },
    {
      id: 'chats',
      label: `Live AI Chats (${supportChats.length})`,
      shortLabel: 'AI Chats',
      badge: supportChats.length,
      icon: MessageCircle,
    },
    {
      id: 'reels',
      label: `Celebrity Video Reels (${celebrityReels.length})`,
      shortLabel: 'Reels',
      badge: celebrityReels.length,
      icon: Video,
    },
    {
      id: 'banners',
      label: `Hero & Luxury Banners (${banners.length})`,
      shortLabel: 'Banners',
      badge: banners.length,
      icon: ImageIcon,
    },
    {
      id: 'editorial',
      label: 'Notes, Occasions, Reviews & Blogs',
      shortLabel: 'Editorial',
      icon: Sparkles,
    },
    {
      id: 'categories',
      label: `Categories (${categories.length})`,
      shortLabel: 'Categories',
      badge: categories.length,
      icon: LayoutGrid,
    },
    {
      id: 'coupons',
      label: `Coupons (${coupons.length})`,
      shortLabel: 'Coupons',
      badge: coupons.length,
      icon: Percent,
    },
    {
      id: 'settings',
      label: 'Store & Brand Video Settings',
      shortLabel: 'Settings',
      icon: Settings,
    },
    {
      id: 'homepage',
      label: 'Homepage Sections',
      shortLabel: 'Homepage',
      icon: Layers,
    },
    {
      id: 'dashboard',
      label: 'Analytics',
      shortLabel: 'Analytics',
      icon: BarChart3,
    },
  ];

  const activeTabMeta = adminTabs.find((t) => t.id === activeTab) || adminTabs[0];
  const primaryMobileTabIds: (typeof activeTab)[] = ['products', 'orders', 'chats', 'reels'];
  const isMoreTabActive = !primaryMobileTabIds.includes(activeTab);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A] select-text overflow-x-hidden pb-24 md:pb-10">
      {/* Standalone Top Luxury Admin Header */}
      <header className="sticky top-0 z-40 bg-[#2A1810] text-white border-b border-[#B5893D]/40 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="h-9 sm:h-10 px-1.5 sm:px-2 bg-white border border-[#B5893D] flex items-center justify-center shrink-0">
              <img
                src={storeSettings.logoUrl || '/charlie-logo.png'}
                alt="Charlie Mobiles"
                className="h-6 sm:h-8 w-auto object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-serif-luxury text-xs sm:text-lg font-bold tracking-[0.06em] sm:tracking-[0.08em] text-[#D4AF37] truncate">
                  <span className="sm:hidden">CHARLIE ADMIN</span>
                  <span className="hidden sm:inline">CHARLIE LUXURY — ADMIN CONSOLE</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 bg-[#B5893D]/25 text-[#F3E5AB] text-[10px] font-bold shrink-0">
                  <CloudUpload className="w-3 h-3" />
                  Cloudinary: {cloudinaryInfo.cloudName}
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-white/70 truncate">
                Full Storefront, Video Reels, Banners, Stock &amp; Store Control
              </p>
              <p className="md:hidden text-[10px] text-white/75 font-semibold uppercase tracking-wider truncate">
                {activeTabMeta.shortLabel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {!user ? (
              <button
                type="button"
                onClick={loginWithGoogle}
                title="Cloud Sync Sign-In"
                className="min-h-[40px] sm:h-9 px-2.5 sm:px-3 bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-[#D4AF37]" />
                <span className="hidden lg:inline">Cloud Sync Sign-In</span>
              </button>
            ) : (
              <span className="hidden lg:inline-block text-xs text-[#D4AF37] font-semibold px-2.5 py-1 bg-white/5">
                {isAdmin ? `Synced: ${user.email}` : user.email}
              </span>
            )}

            <button
              type="button"
              onClick={() => setShowChangePassModal(true)}
              title="Change Admin Password"
              aria-label="Change Admin Password"
              className="hidden sm:flex h-9 px-3 bg-white/10 hover:bg-white/15 text-white text-xs font-bold items-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Password</span>
            </button>

            <button
              type="button"
              onClick={handleLockAdmin}
              title="Lock Admin Console"
              aria-label="Lock Admin Console"
              className="min-h-[40px] sm:h-9 px-2.5 sm:px-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Lock</span>
            </button>

            <Link
              to="/"
              className="min-h-[40px] sm:h-9 px-2.5 sm:px-3.5 bg-[#B5893D] hover:bg-[#9E742F] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1 whitespace-nowrap"
            >
              <span>Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Change Admin Password Modal */}
      {showChangePassModal && (
        <div className="fixed inset-0 z-50 bg-black/65 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-sm bg-white border-t-2 sm:border border-[#B5893D] rounded-t-2xl sm:rounded-none p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#B5893D]" />
                <h3 className="font-serif-luxury text-base font-bold uppercase text-[#1A1A1A]">
                  Change Admin Password
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowChangePassModal(false)}
                className="w-9 h-9 bg-[#FAF7F2] flex items-center justify-center text-[#1A1A1A] cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewPassword} className="space-y-3 text-sm sm:text-xs">
              <div>
                <label className="block font-bold text-[#1A1A1A] mb-1">
                  New Admin Password *
                </label>
                <input
                  type="password"
                  required
                  value={newPassInput}
                  onChange={(e) => setNewPassInput(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full h-11 sm:h-10 px-3 border border-[#D4CFC7] focus:outline-none focus:border-[#B5893D]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#1A1A1A] mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassInput}
                  onChange={(e) => setConfirmPassInput(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full h-11 sm:h-10 px-3 border border-[#D4CFC7] focus:outline-none focus:border-[#B5893D]"
                />
              </div>
              <button
                type="submit"
                className="w-full h-11 sm:h-10 bg-[#B5893D] hover:bg-[#9E742F] text-white font-bold uppercase tracking-wider cursor-pointer"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 sm:top-20 left-3 right-3 sm:left-auto sm:right-4 z-50 sm:max-w-sm bg-[#2A1810] text-white border border-[#B5893D] px-4 py-2.5 shadow-xl text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <span className="line-clamp-2">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-7 space-y-4 sm:space-y-6">
        {/* Desktop Luxury Admin Navigation Bar */}
        <div className="hidden md:flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {adminTabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[42px] px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer transition-colors border ${
                  active
                    ? 'bg-[#B5893D] text-white border-[#B5893D]'
                    : 'bg-white border-[#E5E0D8] text-[#1A1A1A] hover:border-[#B5893D]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* =====================================================================
            TAB 1: PRODUCTS, GOLD TAGLINES, BESTSELLER TABS & STOCK / NOTIFY ME
        ===================================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Top Toolbar */}
            <div className="bg-white border border-[#E5E0D8] p-3.5 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h2 className="font-serif-luxury text-base sm:text-xl font-bold uppercase tracking-[0.06em] sm:tracking-[0.08em] text-[#1A1A1A]">
                  Catalog &amp; Stock Manager
                </h2>
                <p className="text-[11px] sm:text-xs text-[#666666] mt-0.5">
                  Edit Price, MRP, Stock, or toggle &ldquo;🔔 NOTIFY ME&rdquo; in 1 tap.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2">
                <div className="relative sm:w-60">
                  <Search className="w-4 h-4 text-[#666666] absolute left-3 top-3.5 sm:top-3" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search product, brand..."
                    className="w-full h-11 sm:h-10 pl-9 pr-3 border border-[#D4CFC7] text-sm sm:text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 sm:flex items-center gap-2">
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="h-11 sm:h-10 px-2.5 sm:px-3 border border-[#D4CFC7] bg-white text-xs font-bold truncate"
                  >
                    <option value="all">All ({products.length})</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={startNewProduct}
                    className="h-11 sm:h-10 px-3 sm:px-4 bg-[#B5893D] hover:bg-[#9E742F] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Full Product Editor Drawer / Mobile Full-Screen Sheet */}
            {editingProduct && (
              <div className="fixed inset-0 z-50 bg-black/55 md:static md:z-auto md:bg-transparent flex flex-col justify-end md:block">
                <form
                  onSubmit={handleSaveProductSubmit}
                  className="bg-white border-t-2 md:border-2 border-[#B5893D] w-full max-h-[92vh] md:max-h-none overflow-y-auto md:overflow-visible p-4 sm:p-6 space-y-4 sm:space-y-5 text-sm sm:text-xs shadow-2xl md:shadow-lg rounded-t-2xl md:rounded-none"
                >
                  <div className="sticky top-0 z-10 bg-white -mx-4 px-4 py-2.5 sm:mx-0 sm:px-0 sm:py-0 sm:static flex items-center justify-between border-b border-[#E5E0D8] pb-3">
                    <div className="min-w-0 pr-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B5893D] block">
                        PRODUCT &amp; MEDIA EDITOR
                      </span>
                      <h3 className="font-serif-luxury text-base sm:text-xl font-bold text-[#1A1A1A] truncate">
                        {products.some((p) => p.id === editingProduct.id)
                          ? `Edit: ${editingProduct.name}`
                          : 'Create New Product'}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="min-h-[40px] px-3 bg-[#FAF7F2] hover:bg-rose-50 text-rose-600 font-bold flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <X className="w-4 h-4" />
                      <span>Close</span>
                    </button>
                  </div>

                {/* Basic Identity, Gold Tagline, Bestseller Tab & Pricing Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block font-bold mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, name: e.target.value })
                      }
                      placeholder="e.g. Apple iPhone 16 Pro Max — Royal Edition"
                      className="w-full h-10 px-3 border border-[#D4CFC7] font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-[#B5893D]">
                      Gold Note / Tagline (Above Title)
                    </label>
                    <input
                      type="text"
                      value={editingProduct.goldTagline || ''}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, goldTagline: e.target.value })
                      }
                      placeholder="e.g. 5G FLAGSHIP / CAMERA / TITANIUM"
                      className="w-full h-10 px-3 border border-[#B5893D] font-semibold uppercase"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-[#B5893D]">
                      Bestseller Filter Tab
                    </label>
                    <select
                      value={editingProduct.bestsellerTab || 'ALL'}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, bestsellerTab: e.target.value })
                      }
                      className="w-full h-10 px-3 border border-[#B5893D] bg-white font-bold"
                    >
                      <option value="ALL">ALL</option>
                      <option value="HIM">HIM</option>
                      <option value="HER">HER</option>
                      <option value="ATTAR / PRO">ATTAR / PRO</option>
                      <option value="GIFTING">GIFTING</option>
                    </select>
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
                      className="w-full h-10 px-3 border border-[#D4CFC7]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">Category *</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, category: e.target.value })
                      }
                      className="w-full h-10 px-3 border border-[#D4CFC7] bg-white font-semibold"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name} ({c.slug})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-[#B5893D]">
                      Selling Price (₹ INR) *
                    </label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                      }
                      className="w-full h-10 px-3 border-2 border-[#B5893D] font-extrabold text-sm tabular-nums"
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
                      className="w-full h-10 px-3 border border-[#D4CFC7] font-bold tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">
                      Stock Quantity (0 = 🔔 NOTIFY ME) *
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="number"
                        required
                        value={editingProduct.stock}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                        }
                        className="w-full h-10 px-3 border border-[#D4CFC7] font-bold tabular-nums"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setEditingProduct({
                            ...editingProduct,
                            stock: editingProduct.stock > 0 ? 0 : 15,
                          })
                        }
                        className={`px-3 h-10 font-bold whitespace-nowrap cursor-pointer ${
                          editingProduct.stock <= 0
                            ? 'bg-emerald-600 text-white'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {editingProduct.stock <= 0 ? 'Set In Stock' : 'Set 🔔 Notify Me'}
                      </button>
                    </div>
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
                      className="w-full h-10 px-3 border border-[#D4CFC7] tabular-nums"
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
                      className="w-full h-10 px-3 border border-[#D4CFC7] tabular-nums"
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
                      className="w-full h-10 px-3 border border-[#D4CFC7]"
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
                    className="w-full p-3 border border-[#D4CFC7]"
                  />
                </div>

                {/* Cloudinary Main Image, Gallery & Product Video Manager */}
                <div className="p-4 bg-[#FAF7F2] border border-[#B5893D]/40 space-y-3">
                  <label className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                    <CloudUpload className="w-4 h-4 text-[#B5893D]" />
                    <span>
                      Cloudinary Product Photo, Gallery &amp; Product Video Upload (Cloud:{' '}
                      {cloudinaryInfo.cloudName})
                    </span>
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="text"
                        value={editingProduct.mainImage}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, mainImage: e.target.value })
                        }
                        placeholder="Main Image URL or upload"
                        className="flex-1 min-w-[170px] h-11 sm:h-10 px-3 bg-white border border-[#D4CFC7]"
                      />
                      <label className="h-11 sm:h-10 px-3.5 bg-[#B5893D] hover:bg-[#9E742F] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImage ? 'Uploading...' : 'Main Photo'}</span>
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
                      <label className="h-11 sm:h-10 px-3.5 bg-[#1A1A1A] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Gallery</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleGalleryUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Product Video Upload */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                      <input
                        type="text"
                        value={editingProduct.videoUrl || ''}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, videoUrl: e.target.value })
                        }
                        placeholder="Optional Product Video (.mp4 URL)"
                        className="flex-1 min-w-[170px] h-11 sm:h-10 px-3 bg-white border border-[#D4CFC7]"
                      />
                      <label className="h-11 sm:h-10 px-3.5 bg-[#2A1810] text-[#D4AF37] text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0">
                        <Film className="w-3.5 h-3.5" />
                        <span>{uploadingImage ? 'Uploading...' : 'Upload Video'}</span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) =>
                            handleSingleMediaUpload(e, (url) =>
                              setEditingProduct({ ...editingProduct, videoUrl: url })
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Gallery Thumbnails Preview */}
                  {editingProduct.gallery && editingProduct.gallery.length > 0 && (
                    <div className="flex items-center gap-2.5 overflow-x-auto pt-2">
                      {editingProduct.gallery.map((imgUrl, gIdx) => (
                        <div
                          key={`${imgUrl}-${gIdx}`}
                          className="relative w-16 h-16 bg-white border border-[#D4CFC7] p-1 shrink-0"
                        >
                          <SmartImage
                            src={imgUrl}
                            alt="Gallery"
                            className="w-full h-full object-contain"
                          />
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

                {/* Color Variants & Specs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#FAF7F2] border border-[#E5E0D8] space-y-3">
                    <label className="block font-bold text-[#1A1A1A]">
                      Color Variants ({editingProduct.colors.length})
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {editingProduct.colors.map((c, idx) => (
                        <div
                          key={`${c.name}-${idx}`}
                          className="px-3 py-1.5 bg-white border border-[#D4CFC7] flex items-center gap-2"
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
                        className="flex-1 min-w-[150px] h-10 px-3 bg-white border border-[#D4CFC7]"
                      />
                      <input
                        type="color"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        className="h-10 w-12 bg-white border border-[#D4CFC7] p-1 cursor-pointer shrink-0"
                      />
                      <button
                        type="button"
                        onClick={handleAddColorVariant}
                        className="h-10 px-3.5 bg-[#1A1A1A] text-white text-xs font-bold cursor-pointer shrink-0"
                      >
                        + Add Color
                      </button>
                    </div>
                  </div>

                  {/* Homepage Placement Flags */}
                  <div className="p-4 bg-[#FAF7F2] border border-[#E5E0D8] space-y-3">
                    <label className="block font-bold text-[#1A1A1A]">
                      Homepage Section Placement
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {[
                        { key: 'isBestSeller', label: 'Our Bestsellers' },
                        { key: 'isFeatured', label: "Ranveer's Favourite" },
                        { key: 'isNewRelease', label: 'New Arrivals' },
                        { key: 'isFlagship', label: 'Luxury Series / Pro' },
                        { key: 'is5G', label: '5G Ready' },
                      ].map((flag) => (
                        <label
                          key={flag.key}
                          className="px-3 py-2 bg-white border border-[#D4CFC7] flex items-center gap-2 font-bold cursor-pointer"
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
                  </div>
                </div>

                {/* Technical Specifications Editor */}
                <div className="p-4 bg-[#FAF7F2] border border-[#E5E0D8] space-y-3">
                  <label className="block font-bold text-[#1A1A1A]">
                    Specifications / Key Notes
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {Object.entries(editingProduct.specs || {}).map(([key, val]) => (
                      <div
                        key={key}
                        className="p-2 bg-white border border-[#D4CFC7] flex items-center gap-2"
                      >
                        <span className="font-bold text-[#666666] min-w-[90px]">{key}:</span>
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
                          className="flex-1 h-8 px-2 border border-[#E5E0D8] font-semibold"
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
                      placeholder="Spec Name"
                      className="h-9 px-3 bg-white border border-[#D4CFC7]"
                    />
                    <input
                      type="text"
                      value={newSpecVal}
                      onChange={(e) => setNewSpecVal(e.target.value)}
                      placeholder="Spec Value"
                      className="flex-1 h-9 px-3 bg-white border border-[#D4CFC7]"
                    />
                    <button
                      type="button"
                      onClick={handleAddSpecField}
                      className="h-9 px-3.5 bg-[#1A1A1A] text-white font-bold cursor-pointer"
                    >
                      + Add Spec
                    </button>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-white/95 backdrop-blur-xs -mx-4 px-4 py-3 sm:mx-0 sm:px-0 sm:py-0 sm:static border-t border-[#E5E0D8] sm:border-t-0 flex items-center gap-2.5 pt-3">
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none h-11 px-6 bg-[#B5893D] hover:bg-[#9E742F] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Product</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="h-11 px-5 bg-[#FAF7F2] border border-[#D4CFC7] text-[#1A1A1A] text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
              </div>
            )}

            {/* Mobile Touch Card View (below md) */}
            <div className="md:hidden space-y-3">
              {filteredProducts.map((p) => {
                const draft = getDraftForProduct(p);
                const isDirty = Boolean(inlineDrafts[p.id]);
                const isOut = p.stock <= 0;
                return (
                  <div
                    key={p.id}
                    className="bg-white border border-[#E5E0D8] p-3.5 space-y-3 shadow-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 bg-[#F5F5F5] border border-[#E5E0D8] p-1 shrink-0">
                        <SmartImage src={p.mainImage} alt={p.name} brand={p.brand} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B5893D] truncate">
                            {p.goldTagline || p.brand}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 shrink-0 border ${
                              isOut
                                ? 'bg-amber-50 border-[#B5893D] text-[#1A1A1A]'
                                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            }`}
                          >
                            {isOut ? 'Sold Out' : 'Active'}
                          </span>
                        </div>
                        <p className="font-bold text-sm text-[#1A1A1A] line-clamp-2 leading-snug mt-0.5">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-[#666666] mt-0.5">
                          {p.bestsellerTab || 'ALL'} · {p.category}
                        </p>
                      </div>
                    </div>

                    {/* 3-Column Touch Inputs: Price, MRP, Stock */}
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-[#666666] uppercase mb-1">
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          value={draft.price}
                          onChange={(e) =>
                            updateInlineDraft(p, 'price', Number(e.target.value))
                          }
                          className="w-full h-11 px-2.5 border border-[#D4CFC7] focus:border-[#B5893D] font-bold text-sm text-[#1A1A1A] tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#666666] uppercase mb-1">
                          MRP (₹)
                        </label>
                        <input
                          type="number"
                          value={draft.mrp}
                          onChange={(e) =>
                            updateInlineDraft(p, 'mrp', Number(e.target.value))
                          }
                          className="w-full h-11 px-2.5 border border-[#D4CFC7] text-[#666666] font-bold text-sm tabular-nums"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#666666] uppercase mb-1">
                          Stock
                        </label>
                        <input
                          type="number"
                          value={draft.stock}
                          onChange={(e) =>
                            updateInlineDraft(p, 'stock', Number(e.target.value))
                          }
                          className="w-full h-11 px-2.5 border border-[#D4CFC7] font-bold text-sm tabular-nums"
                        />
                      </div>
                    </div>

                    {/* Touch Action Row */}
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => toggleProductOutOfStock(p)}
                        className={`col-span-2 min-h-[44px] px-2 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer border ${
                          isOut
                            ? 'bg-amber-50 border-[#B5893D] text-[#1A1A1A]'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        }`}
                      >
                        <Bell className="w-3.5 h-3.5 text-[#B5893D] shrink-0" />
                        <span className="truncate">{isOut ? 'Restock' : 'Set Notify'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => saveInlineProductRow(p)}
                        className={`min-h-[44px] px-2 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                          isDirty
                            ? 'bg-[#B5893D] text-white'
                            : 'bg-[#FAF7F2] border border-[#D4CFC7] text-[#1A1A1A]'
                        }`}
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>

                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(p)}
                          aria-label="Full edit product"
                          className="flex-1 min-h-[44px] bg-[#2A1810] text-[#D4AF37] font-bold flex items-center justify-center cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProduct(p.id)}
                          aria-label="Delete product"
                          className="min-h-[44px] w-11 bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (md and above) */}
            <div className="hidden md:block bg-white border border-[#E5E0D8] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF7F2] border-b border-[#E5E0D8] text-[#666666] uppercase tracking-wider text-[11px]">
                      <th className="p-3.5 font-bold">Product &amp; Gold Tagline</th>
                      <th className="p-3.5 font-bold">Selling Price (₹)</th>
                      <th className="p-3.5 font-bold">Original MRP (₹)</th>
                      <th className="p-3.5 font-bold">Stock</th>
                      <th className="p-3.5 font-bold">Availability / 🔔 Notify Me</th>
                      <th className="p-3.5 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E0D8]">
                    {filteredProducts.map((p) => {
                      const draft = getDraftForProduct(p);
                      const isDirty = Boolean(inlineDrafts[p.id]);
                      const isOut = p.stock <= 0;
                      return (
                        <tr key={p.id} className="hover:bg-[#FAF7F2]/60">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3 min-w-[230px]">
                              <div className="w-12 h-12 bg-[#F5F5F5] border border-[#E5E0D8] p-1 shrink-0">
                                <SmartImage src={p.mainImage} alt={p.name} brand={p.brand} />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#B5893D]">
                                  {p.goldTagline || p.brand}
                                </p>
                                <p className="font-bold text-[#1A1A1A] line-clamp-1">{p.name}</p>
                                <p className="text-[11px] text-[#666666]">
                                  Tab: {p.bestsellerTab || 'ALL'} · {p.category}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="p-2.5">
                            <input
                              type="number"
                              value={draft.price}
                              onChange={(e) =>
                                updateInlineDraft(p, 'price', Number(e.target.value))
                              }
                              className="w-28 h-9 px-2.5 border border-[#D4CFC7] focus:border-[#B5893D] font-bold text-[#1A1A1A] tabular-nums"
                            />
                          </td>

                          <td className="p-2.5">
                            <input
                              type="number"
                              value={draft.mrp}
                              onChange={(e) =>
                                updateInlineDraft(p, 'mrp', Number(e.target.value))
                              }
                              className="w-28 h-9 px-2.5 border border-[#D4CFC7] text-[#666666] font-bold tabular-nums"
                            />
                          </td>

                          <td className="p-2.5">
                            <input
                              type="number"
                              value={draft.stock}
                              onChange={(e) =>
                                updateInlineDraft(p, 'stock', Number(e.target.value))
                              }
                              className="w-20 h-9 px-2.5 border border-[#D4CFC7] font-bold tabular-nums"
                            />
                          </td>

                          <td className="p-2.5">
                            <button
                              type="button"
                              onClick={() => toggleProductOutOfStock(p)}
                              className={`h-9 px-3 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer border ${
                                isOut
                                  ? 'bg-amber-50 border-[#B5893D] text-[#1A1A1A]'
                                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                              }`}
                            >
                              <Bell className="w-3.5 h-3.5 text-[#B5893D]" />
                              <span>{isOut ? '🔔 NOTIFY ME (Sold Out)' : 'In Stock (Active)'}</span>
                            </button>
                          </td>

                          <td className="p-3.5 text-right whitespace-nowrap space-x-1.5">
                            <button
                              type="button"
                              onClick={() => saveInlineProductRow(p)}
                              className={`h-9 px-3 font-bold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                                isDirty
                                  ? 'bg-[#B5893D] text-white'
                                  : 'bg-[#FAF7F2] border border-[#D4CFC7] text-[#666666]'
                              }`}
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProduct(p);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="h-9 px-3 bg-[#2A1810] text-[#D4AF37] font-bold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Full Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteProduct(p.id)}
                              className="h-9 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 inline-flex items-center cursor-pointer"
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
            TAB 2: SHOPPABLE VIDEO REELS MANAGER ("LOVED BY CELEBRITIES" 00:00-00:11)
        ===================================================================== */}
        {activeTab === 'reels' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <form
              onSubmit={handleSaveReelForm}
              className="lg:col-span-5 bg-white border border-[#E5E0D8] p-5 space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B5893D]">
                    9:16 VERTICAL SHOPPABLE REELS
                  </span>
                  <h2 className="font-serif-luxury text-lg font-bold text-[#1A1A1A]">
                    {editingReelId ? 'Edit Celebrity Video Reel' : 'Add New Celebrity Video Reel'}
                  </h2>
                </div>
                {editingReelId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingReelId(null);
                      setReelTitle('');
                      setReelCelebrity('');
                      setReelVideoUrl('');
                      setReelPosterUrl('');
                    }}
                    className="text-rose-600 font-bold cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div>
                <label className="block font-bold mb-1">Celebrity Name / Creator Handle *</label>
                <input
                  type="text"
                  required
                  value={reelCelebrity}
                  onChange={(e) => setReelCelebrity(e.target.value)}
                  placeholder="e.g. Ranveer's Pick / Royal Tech Unboxed"
                  className="w-full h-10 px-3 border border-[#D4CFC7]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Reel Title / Caption *</label>
                <input
                  type="text"
                  required
                  value={reelTitle}
                  onChange={(e) => setReelTitle(e.target.value)}
                  placeholder="e.g. iPhone 16 Pro Max Desert Titanium Spotlight"
                  className="w-full h-10 px-3 border border-[#D4CFC7]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-[#B5893D]">
                  Link Product to Reel (Displays Mini Product Bar Below Video) *
                </label>
                <select
                  value={reelProductId}
                  onChange={(e) => setReelProductId(e.target.value)}
                  className="w-full h-10 px-3 border-2 border-[#B5893D] bg-white font-bold"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {formatINR(p.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3.5 bg-[#FAF7F2] border border-[#E5E0D8] space-y-2.5">
                <label className="block font-bold">
                  Vertical Video (.mp4 / .webm) — Upload or Paste URL *
                </label>
                <input
                  type="text"
                  required
                  value={reelVideoUrl}
                  onChange={(e) => setReelVideoUrl(e.target.value)}
                  placeholder="Paste .mp4 video URL or upload below"
                  className="w-full h-9 px-3 bg-white border border-[#D4CFC7]"
                />
                <input
                  type="text"
                  value={reelPosterUrl}
                  onChange={(e) => setReelPosterUrl(e.target.value)}
                  placeholder="Optional Cover Thumbnail Image URL"
                  className="w-full h-9 px-3 bg-white border border-[#D4CFC7]"
                />
                <label className="w-full h-10 bg-[#2A1810] hover:bg-[#1A1A1A] text-[#D4AF37] font-bold flex items-center justify-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>
                    {uploadingImage
                      ? 'Uploading Video to Cloudinary...'
                      : 'Upload Vertical Video (.MP4) from Device'}
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) =>
                      handleSingleMediaUpload(e, (url) => {
                        setReelVideoUrl(url);
                      })
                    }
                    className="hidden"
                  />
                </label>

                {reelVideoUrl && (
                  <div className="pt-2">
                    <p className="text-[10px] font-bold text-[#666666] mb-1">Live 9:16 Preview:</p>
                    <div className="w-36 aspect-[9/16] bg-[#1A1A1A] overflow-hidden border border-[#B5893D]">
                      <video
                        src={reelVideoUrl}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-[#B5893D] hover:bg-[#9E742F] text-white font-bold uppercase tracking-wider cursor-pointer"
              >
                {editingReelId ? 'Save Reel Changes' : 'Publish Shoppable Video Reel'}
              </button>
            </form>

            <div className="lg:col-span-7 space-y-3">
              <div className="bg-white border border-[#E5E0D8] p-4">
                <h3 className="font-serif-luxury text-base font-bold uppercase tracking-[0.08em] text-[#1A1A1A]">
                  Active &ldquo;LOVED BY CELEBRITIES&rdquo; Video Reels ({sortedReels.length})
                </h3>
                <p className="text-xs text-[#666666]">
                  All active reels auto-play inline in a 9:16 carousel with a linked 1-click Add-to-Cart product bar underneath.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sortedReels.map((reel, idx) => {
                  const linkedProduct =
                    products.find((p) => p.id === reel.linkedProductId) || products[0];
                  return (
                    <div
                      key={reel.id}
                      className="bg-white border border-[#E5E0D8] p-3.5 flex gap-3.5 text-xs"
                    >
                      <div className="w-24 aspect-[9/16] bg-[#1A1A1A] shrink-0 overflow-hidden relative border border-[#D4CFC7]">
                        <video
                          src={reel.videoUrl}
                          poster={reel.posterUrl}
                          className="w-full h-full object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B5893D]">
                            #{idx + 1} · {reel.celebrityName}
                          </span>
                          <p className="font-bold text-sm text-[#1A1A1A] line-clamp-1">
                            {reel.title}
                          </p>
                          {linkedProduct && (
                            <div className="mt-2 p-2 bg-[#FAF7F2] border border-[#E5E0D8] flex items-center gap-2">
                              <div className="w-8 h-8 bg-white p-0.5 shrink-0">
                                <SmartImage
                                  src={linkedProduct.mainImage}
                                  alt={linkedProduct.name}
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold text-[#1A1A1A] truncate">
                                  {linkedProduct.name}
                                </p>
                                <p className="text-[10px] font-bold text-[#B5893D]">
                                  {formatINR(linkedProduct.price)}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 pt-3">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveReelOrder(idx, 'up')}
                            aria-label="Move reel up"
                            className="min-h-[38px] min-w-[38px] p-2 bg-[#FAF7F2] border border-[#D4CFC7] disabled:opacity-35 cursor-pointer flex items-center justify-center"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === sortedReels.length - 1}
                            onClick={() => handleMoveReelOrder(idx, 'down')}
                            aria-label="Move reel down"
                            className="min-h-[38px] min-w-[38px] p-2 bg-[#FAF7F2] border border-[#D4CFC7] disabled:opacity-35 cursor-pointer flex items-center justify-center"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => startEditReel(reel)}
                            className="min-h-[38px] px-3 py-1.5 bg-[#2A1810] text-[#D4AF37] font-bold cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => saveCelebrityReel({ ...reel, enabled: !reel.enabled })}
                            className={`min-h-[38px] px-3 py-1.5 font-bold cursor-pointer ${
                              reel.enabled
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {reel.enabled ? 'Active' : 'Hidden'}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteCelebrityReel(reel.id)}
                            aria-label="Delete reel"
                            className="min-h-[38px] min-w-[38px] p-2 bg-rose-50 text-rose-600 cursor-pointer flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 3: HERO BANNERS, MEGA-MENU & LUXURY GIFTING BANNERS
        ===================================================================== */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            {/* Banner Auto-Slide Timer Bar (Default: 5 Seconds) */}
            <div className="bg-white border border-[#E5E0D8] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#FAF7F2] border border-[#B5893D] text-[#B5893D] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-base font-bold uppercase text-[#1A1A1A]">
                    Hero Banner Auto-Slide Speed (Currently: {storeSettings.bannerIntervalSeconds || 5} Seconds)
                  </h3>
                  <p className="text-[#666666] mt-0.5">
                    Homepage Hero Banners (Photos &amp; Videos) automatically transition every{' '}
                    <span className="font-bold text-[#1A1A1A]">
                      {storeSettings.bannerIntervalSeconds || 5} seconds
                    </span>
                    .
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
                      className={`h-9 px-3.5 font-bold cursor-pointer transition-colors ${
                        isCurrent
                          ? 'bg-[#B5893D] text-white'
                          : 'bg-[#FAF7F2] border border-[#D4CFC7] text-[#1A1A1A]'
                      }`}
                    >
                      {sec}s {sec === 5 ? '(Default)' : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <form
                onSubmit={handleSaveBannerForm}
                className="lg:col-span-5 bg-white border border-[#E5E0D8] p-5 space-y-3.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-serif-luxury text-lg font-bold uppercase text-[#1A1A1A]">
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

                <div>
                  <label className="block font-bold mb-1.5">Select Banner Media Type *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBannerMediaType('image')}
                      className={`h-10 font-bold flex items-center justify-center gap-2 border cursor-pointer ${
                        bannerMediaType === 'image'
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-[#FAF7F2] text-[#1A1A1A] border-[#D4CFC7]'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Photo Banner</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBannerMediaType('video')}
                      className={`h-10 font-bold flex items-center justify-center gap-2 border cursor-pointer ${
                        bannerMediaType === 'video'
                          ? 'bg-[#B5893D] text-white border-[#B5893D]'
                          : 'bg-[#FAF7F2] text-[#1A1A1A] border-[#D4CFC7]'
                      }`}
                    >
                      <Film className="w-4 h-4" />
                      <span>Video Banner</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">Gold Tagline Above Headline</label>
                  <input
                    type="text"
                    value={bannerTag}
                    onChange={(e) => setBannerTag(e.target.value)}
                    placeholder="ROYAL LUXURY SERIES"
                    className="w-full h-9 px-3 border border-[#D4CFC7]"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Main Banner Headline *</label>
                  <input
                    type="text"
                    required
                    value={bannerTitle}
                    onChange={(e) => setBannerTitle(e.target.value)}
                    placeholder="e.g. THE TITANIUM FLAGSHIP COLLECTION"
                    className="w-full h-10 px-3 border border-[#D4CFC7] font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Subheadline</label>
                  <textarea
                    rows={2}
                    value={bannerSub}
                    onChange={(e) => setBannerSub(e.target.value)}
                    className="w-full p-3 border border-[#D4CFC7]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold mb-1">CTA Button Text</label>
                    <input
                      type="text"
                      value={bannerCtaText}
                      onChange={(e) => setBannerCtaText(e.target.value)}
                      className="w-full h-9 px-3 border border-[#D4CFC7]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">CTA Link</label>
                    <input
                      type="text"
                      value={bannerCtaLink}
                      onChange={(e) => setBannerCtaLink(e.target.value)}
                      className="w-full h-9 px-3 border border-[#D4CFC7]"
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-[#FAF7F2] border border-[#E5E0D8] space-y-2.5">
                  <label className="block font-bold">
                    {bannerMediaType === 'video'
                      ? 'Upload Video or Paste Video URL (.mp4)'
                      : 'Upload Photo or Paste Image URL'}
                  </label>

                  {bannerMediaType === 'video' ? (
                    <>
                      <input
                        type="text"
                        value={bannerVideoUrl}
                        onChange={(e) => setBannerVideoUrl(e.target.value)}
                        placeholder="Paste MP4 Video URL or Upload below"
                        className="w-full h-9 px-3 bg-white border border-[#D4CFC7]"
                      />
                      <input
                        type="text"
                        value={bannerImage}
                        onChange={(e) => setBannerImage(e.target.value)}
                        placeholder="Optional Poster Image URL"
                        className="w-full h-9 px-3 bg-white border border-[#D4CFC7]"
                      />
                    </>
                  ) : (
                    <input
                      type="text"
                      value={bannerImage}
                      onChange={(e) => setBannerImage(e.target.value)}
                      placeholder="Paste Image URL or Upload below"
                      className="w-full h-9 px-3 bg-white border border-[#D4CFC7]"
                    />
                  )}

                  <label className="w-full h-10 bg-[#2A1810] text-[#D4AF37] font-bold flex items-center justify-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
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
                </div>

                <button
                  type="submit"
                  className="w-full h-10 bg-[#B5893D] hover:bg-[#9E742F] text-white font-bold uppercase tracking-wider cursor-pointer"
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
                      className="bg-white border border-[#E5E0D8] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-28 h-20 bg-[#1A1A1A] shrink-0 relative overflow-hidden flex items-center justify-center border border-[#D4CFC7]">
                          {isVid ? (
                            <>
                              <video
                                src={b.videoUrl || b.image}
                                className="w-full h-full object-cover"
                                autoPlay
                                muted
                                loop
                                playsInline
                              />
                              <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#B5893D] text-white text-[9px] font-bold flex items-center gap-0.5">
                                <Play className="w-2.5 h-2.5 fill-white" /> VIDEO
                              </span>
                            </>
                          ) : (
                            <>
                              <SmartImage
                                src={b.image}
                                alt={b.title}
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/70 text-white text-[9px] font-bold">
                                PHOTO
                              </span>
                            </>
                          )}
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[#B5893D] uppercase tracking-wider">
                            #{idx + 1} · {b.tag}
                          </span>
                          <p className="font-serif-luxury font-bold text-base text-[#1A1A1A]">
                            {b.title}
                          </p>
                          <p className="text-[#666666] line-clamp-1 mt-0.5">{b.subtitle}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveBannerOrder(idx, 'up')}
                          aria-label="Move banner up"
                          className="min-h-[40px] min-w-[40px] p-2 bg-[#FAF7F2] border border-[#D4CFC7] disabled:opacity-35 cursor-pointer flex items-center justify-center"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === banners.length - 1}
                          onClick={() => handleMoveBannerOrder(idx, 'down')}
                          aria-label="Move banner down"
                          className="min-h-[40px] min-w-[40px] p-2 bg-[#FAF7F2] border border-[#D4CFC7] disabled:opacity-35 cursor-pointer flex items-center justify-center"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => startEditBanner(b)}
                          className="min-h-[40px] px-3.5 py-2 bg-[#2A1810] text-[#D4AF37] font-bold cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => saveBanner({ ...b, enabled: !b.enabled })}
                          className={`min-h-[40px] px-3.5 py-2 font-bold cursor-pointer ${
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
                          aria-label="Delete banner"
                          className="min-h-[40px] min-w-[40px] p-2 bg-rose-50 text-rose-600 cursor-pointer flex items-center justify-center"
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
            TAB 4: EDITORIAL MANAGER (NOTES, OCCASIONS, TESTIMONIALS & BLOGS)
        ===================================================================== */}
        {activeTab === 'editorial' && (
          <div className="space-y-8 text-xs">
            {/* 1. SHOP BY NOTES */}
            <div className="bg-white border border-[#E5E0D8] p-5 space-y-4">
              <h2 className="font-serif-luxury text-lg font-bold uppercase tracking-[0.08em] text-[#1A1A1A]">
                1. &ldquo;SHOP BY NOTES / SIGNATURE STYLES&rdquo; Cards ({shopByNotes.length})
              </h2>
              <form
                onSubmit={handleAddNote}
                className="grid grid-cols-1 sm:grid-cols-5 gap-3 bg-[#FAF7F2] p-3.5 border border-[#E5E0D8]"
              >
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Card Title (e.g. Titanium Series)"
                  className="h-9 px-3 bg-white border border-[#D4CFC7]"
                />
                <input
                  type="text"
                  value={noteSub}
                  onChange={(e) => setNoteSub(e.target.value)}
                  placeholder="Subtitle (e.g. Aerospace Finish)"
                  className="h-9 px-3 bg-white border border-[#D4CFC7]"
                />
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={noteImage}
                    onChange={(e) => setNoteImage(e.target.value)}
                    placeholder="Image URL"
                    className="flex-1 h-9 px-3 bg-white border border-[#D4CFC7]"
                  />
                  <label className="h-9 px-2.5 bg-[#1A1A1A] text-white flex items-center cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSingleImageUpload(e, setNoteImage)}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={noteLink}
                  onChange={(e) => setNoteLink(e.target.value)}
                  placeholder="Link (/products)"
                  className="h-9 px-3 bg-white border border-[#D4CFC7]"
                />
                <button
                  type="submit"
                  className="h-9 bg-[#B5893D] text-white font-bold uppercase cursor-pointer"
                >
                  + Add Note Card
                </button>
              </form>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {shopByNotes.map((item) => (
                  <div key={item.id} className="border border-[#E5E0D8] p-2.5 space-y-2">
                    <div className="aspect-[4/3] bg-[#F5F5F5] overflow-hidden">
                      <SmartImage
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-bold text-[#1A1A1A]">{item.title}</p>
                    <p className="text-[11px] text-[#666666]">{item.subtitle}</p>
                    <button
                      type="button"
                      onClick={() => handleDeleteNote(item.id)}
                      className="text-rose-600 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. SHOP BY OCCASIONS */}
            <div className="bg-white border border-[#E5E0D8] p-5 space-y-4">
              <h2 className="font-serif-luxury text-lg font-bold uppercase tracking-[0.08em] text-[#1A1A1A]">
                2. &ldquo;SHOP BY OCCASIONS&rdquo; Cards ({shopByOccasions.length})
              </h2>
              <form
                onSubmit={handleAddOccasion}
                className="grid grid-cols-1 sm:grid-cols-5 gap-3 bg-[#FAF7F2] p-3.5 border border-[#E5E0D8]"
              >
                <input
                  type="text"
                  required
                  value={occTitle}
                  onChange={(e) => setOccTitle(e.target.value)}
                  placeholder="Occasion Title (e.g. EXECUTIVE SUITE)"
                  className="h-9 px-3 bg-white border border-[#D4CFC7]"
                />
                <input
                  type="text"
                  value={occSub}
                  onChange={(e) => setOccSub(e.target.value)}
                  placeholder="Subtitle"
                  className="h-9 px-3 bg-white border border-[#D4CFC7]"
                />
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={occImage}
                    onChange={(e) => setOccImage(e.target.value)}
                    placeholder="Image URL"
                    className="flex-1 h-9 px-3 bg-white border border-[#D4CFC7]"
                  />
                  <label className="h-9 px-2.5 bg-[#1A1A1A] text-white flex items-center cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSingleImageUpload(e, setOccImage)}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={occLink}
                  onChange={(e) => setOccLink(e.target.value)}
                  placeholder="Link (/products)"
                  className="h-9 px-3 bg-white border border-[#D4CFC7]"
                />
                <button
                  type="submit"
                  className="h-9 bg-[#B5893D] text-white font-bold uppercase cursor-pointer"
                >
                  + Add Occasion
                </button>
              </form>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {shopByOccasions.map((item) => (
                  <div key={item.id} className="border border-[#E5E0D8] p-2.5 space-y-2">
                    <div className="aspect-[4/3] bg-[#F5F5F5] overflow-hidden">
                      <SmartImage
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-bold text-[#1A1A1A]">{item.title}</p>
                    <p className="text-[11px] text-[#666666]">{item.subtitle}</p>
                    <button
                      type="button"
                      onClick={() => handleDeleteOccasion(item.id)}
                      className="text-rose-600 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. CUSTOMER TESTIMONIALS ("FROM OUR LOVED ONES") */}
            <div className="bg-white border border-[#E5E0D8] p-5 space-y-4">
              <h2 className="font-serif-luxury text-lg font-bold uppercase tracking-[0.08em] text-[#1A1A1A]">
                3. &ldquo;FROM OUR LOVED ONES&rdquo; Gold-Bordered Reviews ({testimonials.length})
              </h2>
              <form
                onSubmit={handleAddTestimonial}
                className="grid grid-cols-1 sm:grid-cols-5 gap-3 bg-[#FAF7F2] p-3.5 border border-[#E5E0D8]"
              >
                <input
                  type="text"
                  required
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="Customer Name *"
                  className="h-9 px-3 bg-white border border-[#D4CFC7]"
                />
                <input
                  type="text"
                  value={testRole}
                  onChange={(e) => setTestRole(e.target.value)}
                  placeholder="City / Role (e.g. Mumbai)"
                  className="h-9 px-3 bg-white border border-[#D4CFC7]"
                />
                <input
                  type="text"
                  required
                  value={testQuote}
                  onChange={(e) => setTestQuote(e.target.value)}
                  placeholder="Review Quote *"
                  className="h-9 px-3 bg-white border border-[#D4CFC7]"
                />
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={testAvatar}
                    onChange={(e) => setTestAvatar(e.target.value)}
                    placeholder="Customer Photo URL"
                    className="flex-1 h-9 px-3 bg-white border border-[#D4CFC7]"
                  />
                  <label className="h-9 px-2.5 bg-[#1A1A1A] text-white flex items-center cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSingleImageUpload(e, setTestAvatar)}
                      className="hidden"
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  className="h-9 bg-[#B5893D] text-white font-bold uppercase cursor-pointer"
                >
                  + Add Review
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {testimonials.map((t) => (
                  <div key={t.id} className="border-2 border-[#B5893D] p-3.5 space-y-2 bg-[#FAF7F2]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1A1A1A]">{t.authorName}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteTestimonial(t.id)}
                        className="text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[#666666] italic">&ldquo;{t.quote}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. BLOGS */}
            <div className="bg-white border border-[#E5E0D8] p-5 space-y-4">
              <h2 className="font-serif-luxury text-lg font-bold uppercase tracking-[0.08em] text-[#1A1A1A]">
                4. &ldquo;BLOGS&rdquo; Editorial Cards ({blogPosts.length})
              </h2>
              <form
                onSubmit={handleAddBlog}
                className="grid grid-cols-1 sm:grid-cols-5 gap-3 bg-[#FAF7F2] p-3.5 border border-[#E5E0D8]"
              >
                <input
                  type="text"
                  required
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  placeholder="Blog Title *"
                  className="h-9 px-3 bg-white border border-[#D4CFC7]"
                />
                <input
                  type="text"
                  value={blogExcerpt}
                  onChange={(e) => setBlogExcerpt(e.target.value)}
                  placeholder="Short Excerpt"
                  className="h-9 px-3 bg-white border border-[#D4CFC7]"
                />
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={blogImage}
                    onChange={(e) => setBlogImage(e.target.value)}
                    placeholder="Blog Cover Image URL"
                    className="flex-1 h-9 px-3 bg-white border border-[#D4CFC7]"
                  />
                  <label className="h-9 px-2.5 bg-[#1A1A1A] text-white flex items-center cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSingleImageUpload(e, setBlogImage)}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={blogCta}
                  onChange={(e) => setBlogCta(e.target.value)}
                  placeholder="Button Text (Find Your Style)"
                  className="h-9 px-3 bg-white border border-[#D4CFC7]"
                />
                <button
                  type="submit"
                  className="h-9 bg-[#B5893D] text-white font-bold uppercase cursor-pointer"
                >
                  + Add Blog Card
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {blogPosts.map((b) => (
                  <div key={b.id} className="border border-[#E5E0D8] p-3 space-y-2">
                    <div className="aspect-[16/10] bg-[#F5F5F5] overflow-hidden">
                      <SmartImage
                        src={b.image}
                        alt={b.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-bold text-[#1A1A1A]">{b.title}</p>
                    <button
                      type="button"
                      onClick={() => handleDeleteBlog(b.id)}
                      className="text-rose-600 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove Blog
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 5: CATEGORY MANAGEMENT
        ===================================================================== */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <form
              onSubmit={handleSaveCategoryForm}
              className="lg:col-span-4 bg-white border border-[#E5E0D8] p-5 space-y-3.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-serif-luxury text-lg font-bold text-[#1A1A1A]">
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
                  className="w-full h-10 px-3 border border-[#D4CFC7]"
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
                    className="w-full h-10 px-3 border border-[#D4CFC7]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={catOrder}
                    onChange={(e) => setCatOrder(Number(e.target.value))}
                    className="w-full h-10 px-3 border border-[#D4CFC7]"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-[#FAF7F2] border border-[#E5E0D8] space-y-2">
                <label className="block font-bold">Category Image (Cloudinary Upload)</label>
                <input
                  type="text"
                  value={catImage}
                  onChange={(e) => setCatImage(e.target.value)}
                  placeholder="Paste URL or Upload below"
                  className="w-full h-9 px-3 bg-white border border-[#D4CFC7]"
                />
                <label className="w-full h-9 bg-[#1A1A1A] text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer">
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
                className="w-full h-10 bg-[#B5893D] text-white font-bold uppercase tracking-wider cursor-pointer"
              >
                {editingCategoryId ? 'Update Category' : 'Create Category'}
              </button>
            </form>

            <div className="lg:col-span-8 bg-white border border-[#E5E0D8] p-5">
              <h2 className="font-serif-luxury text-lg font-bold text-[#1A1A1A] mb-3">
                All Store Categories ({categories.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-3 border border-[#E5E0D8] flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-10 h-10 bg-[#F5F5F5] p-1 shrink-0 border border-[#E5E0D8]">
                        <SmartImage src={cat.image} alt={cat.name} />
                      </div>
                      <div className="truncate">
                        <p className="font-bold text-[#1A1A1A] truncate">{cat.name}</p>
                        <p className="text-[10px] text-[#666666]">
                          /{cat.slug} · #{cat.order}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEditCategory(cat)}
                        aria-label={`Edit ${cat.name}`}
                        className="min-h-[38px] min-w-[38px] p-2 bg-[#FAF7F2] text-[#B5893D] flex items-center justify-center cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCategory(cat.id)}
                        aria-label={`Delete ${cat.name}`}
                        className="min-h-[38px] min-w-[38px] p-2 bg-rose-50 text-rose-600 flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 6: ORDERS, REWARDS POPUP LEADS & "🔔 NOTIFY ME" WAITLIST
        ===================================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4 sm:space-y-6 text-xs">
            {/* 1. Customer Orders */}
            <div className="bg-white border border-[#E5E0D8] p-4 sm:p-5 space-y-4">
              <h2 className="font-serif-luxury text-base sm:text-lg font-bold uppercase tracking-[0.08em] text-[#1A1A1A]">
                1. Customer Orders &amp; Payment Status ({orders.length})
              </h2>
              {orders.length === 0 ? (
                <p className="text-[#666666] py-4">
                  No customer orders placed yet. Orders placed via Checkout appear here in real time.
                </p>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 sm:p-4 border border-[#E5E0D8] bg-[#FAF7F2] flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 sm:gap-4"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-[#1A1A1A] tabular-nums">
                            Order #{ord.id}
                          </span>
                          <span className="text-[11px] text-[#666666]">
                            · {new Date(ord.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="font-bold text-[#1A1A1A] break-words">
                          {ord.customerName} · {ord.customerPhone}
                        </p>
                        {ord.customerEmail && (
                          <p className="text-[11px] text-[#666666] break-all">
                            {ord.customerEmail}
                          </p>
                        )}
                        <p className="text-[#666666] break-words">
                          Address / Pickup: {ord.shippingAddress}
                        </p>
                        <p className="font-semibold text-[#B5893D] break-words">
                          Items: {ord.itemsSummary}
                        </p>
                        <p className="font-extrabold text-sm text-[#1A1A1A] tabular-nums">
                          Total: {formatINR(ord.totalAmount)} ({ord.paymentMethod.toUpperCase()} —{' '}
                          {ord.paymentStatus})
                        </p>
                      </div>

                      <div className="space-y-2 shrink-0">
                        <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-1.5">
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
                              className={`min-h-[40px] sm:min-h-[34px] px-2.5 sm:px-3 py-1.5 text-[11px] font-bold capitalize cursor-pointer ${
                                ord.status === st
                                  ? 'bg-[#B5893D] text-white'
                                  : 'bg-white border border-[#D4CFC7] text-[#1A1A1A]'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. "🔔 NOTIFY ME" Out-of-Stock Waitlist Requests */}
            <div className="bg-white border border-[#E5E0D8] p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#B5893D]" />
                <h2 className="font-serif-luxury text-lg font-bold uppercase tracking-[0.08em] text-[#1A1A1A]">
                  2. &ldquo;🔔 NOTIFY ME&rdquo; Out-of-Stock Waitlist Requests ({notifyMeRequests.length})
                </h2>
              </div>
              {notifyMeRequests.length === 0 ? (
                <p className="text-[#666666]">
                  When customers click &ldquo;🔔 NOTIFY ME&rdquo; on an out-of-stock product, their contact details appear here.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {notifyMeRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-3.5 bg-[#FAF7F2] border border-[#E5E0D8] space-y-1.5"
                    >
                      <p className="font-bold text-[#1A1A1A]">{req.productName}</p>
                      <p className="text-[#B5893D] font-semibold">
                        Contact: {req.customerContact}
                      </p>
                      <p className="text-[10px] text-[#666666]">
                        Requested: {new Date(req.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Luxury Rewards Popup Leads */}
            <div className="bg-white border border-[#E5E0D8] p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#B5893D]" />
                <h2 className="font-serif-luxury text-lg font-bold uppercase tracking-[0.08em] text-[#1A1A1A]">
                  3. Luxury Rewards Popup Signups ({rewardLeads.length})
                </h2>
              </div>
              {rewardLeads.length === 0 ? (
                <p className="text-[#666666]">
                  Customer mobile numbers, emails, and birthdays submitted in the Rewards Popup appear here.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {rewardLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3.5 bg-[#FAF7F2] border border-[#E5E0D8] space-y-1"
                    >
                      <p className="font-bold text-[#1A1A1A]">Phone: {lead.phone}</p>
                      {lead.email && <p className="text-[#666666]">Email: {lead.email}</p>}
                      {lead.birthday && <p className="text-[#666666]">DOB: {lead.birthday}</p>}
                      <p className="text-[10px] text-[#B5893D] font-bold">
                        Joined: {new Date(lead.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 7: COUPONS & OFFERS MANAGER
        ===================================================================== */}
        {activeTab === 'coupons' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <form
              onSubmit={handleSaveCouponForm}
              className="lg:col-span-4 bg-white border border-[#E5E0D8] p-5 space-y-3.5 text-xs"
            >
              <h2 className="font-serif-luxury text-lg font-bold text-[#1A1A1A]">
                Create or Update Coupon Code
              </h2>
              <div>
                <label className="block font-bold mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. ROYAL10"
                  className="w-full h-10 px-3 border border-[#D4CFC7] font-mono font-bold uppercase"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Offer Title *</label>
                <input
                  type="text"
                  required
                  value={couponTitle}
                  onChange={(e) => setCouponTitle(e.target.value)}
                  placeholder="e.g. Flat ₹2,000 Instant Privilege Discount"
                  className="w-full h-10 px-3 border border-[#D4CFC7]"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Description</label>
                <input
                  type="text"
                  value={couponDesc}
                  onChange={(e) => setCouponDesc(e.target.value)}
                  className="w-full h-10 px-3 border border-[#D4CFC7]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold mb-1">Discount Type</label>
                  <select
                    value={couponType}
                    onChange={(e) => setCouponType(e.target.value as 'flat' | 'percentage')}
                    className="w-full h-10 px-3 border border-[#D4CFC7] bg-white"
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
                    className="w-full h-10 px-3 border border-[#D4CFC7]"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full h-10 bg-[#B5893D] text-white font-bold uppercase tracking-wider cursor-pointer"
              >
                Save Coupon Offer
              </button>
            </form>

            <div className="lg:col-span-8 space-y-3">
              {coupons.map((c) => (
                <div
                  key={c.code}
                  className="bg-white border border-[#E5E0D8] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-[#2A1810] text-[#D4AF37] font-mono font-bold">
                        {c.code}
                      </span>
                      <span className="font-bold text-sm text-[#1A1A1A]">{c.title}</span>
                    </div>
                    <p className="text-[#666666] mt-1">{c.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => saveCoupon({ ...c, active: !c.active })}
                      className={`min-h-[40px] px-3.5 py-2 font-bold cursor-pointer ${
                        c.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {c.active ? 'Active' : 'Disabled'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCoupon(c.code)}
                      aria-label={`Delete ${c.code}`}
                      className="min-h-[40px] min-w-[40px] p-2 bg-rose-50 text-rose-600 flex items-center justify-center cursor-pointer"
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
            TAB 8: STORE SETTINGS, BRAND STORY VIDEO, MEGA-MENU & REWARDS POPUP
        ===================================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <form
              onSubmit={handleSaveSettingsSubmit}
              className="bg-white border border-[#E5E0D8] p-5 sm:p-6 space-y-6 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D8] pb-3.5">
                <div>
                  <h2 className="font-serif-luxury text-base sm:text-xl font-bold uppercase text-[#1A1A1A]">
                    Store Details, Brand Video &amp; Popup Settings
                  </h2>
                  <p className="text-[11px] sm:text-xs text-[#666666] mt-0.5">
                    Control luxury banners, video, logo, WhatsApp number, and popups.
                  </p>
                </div>
                <button
                  type="submit"
                  className="h-11 sm:h-10 px-5 bg-[#B5893D] text-white font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </button>
              </div>

              {/* 1. "LET US WALK YOU THROUGH" Full-Width Brand Story Video */}
              <div className="p-4 bg-[#FAF7F2] border border-[#B5893D]/50 space-y-3">
                <h3 className="font-serif-luxury text-base font-bold uppercase text-[#1A1A1A] flex items-center gap-2">
                  <Film className="w-4 h-4 text-[#B5893D]" />
                  <span>
                    1. &ldquo;LET US WALK YOU THROUGH&rdquo; Full-Width Brand Story Video (Above Footer)
                  </span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Section Heading</label>
                    <input
                      type="text"
                      value={settingsForm.brandStoryTitle || 'LET US WALK YOU THROUGH'}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, brandStoryTitle: e.target.value })
                      }
                      className="w-full h-10 px-3 bg-white border border-[#D4CFC7]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Brand Story Video URL (.mp4)</label>
                    <input
                      type="text"
                      value={settingsForm.brandStoryVideoUrl || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, brandStoryVideoUrl: e.target.value })
                      }
                      placeholder="Paste .mp4 video URL or upload"
                      className="w-full h-10 px-3 bg-white border border-[#D4CFC7]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Upload Brand Video (Cloudinary)</label>
                    <label className="w-full h-10 bg-[#2A1810] text-[#D4AF37] font-bold flex items-center justify-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Brand Video (.MP4)'}</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                          handleSingleMediaUpload(e, (url) =>
                            setSettingsForm((prev) => ({ ...prev, brandStoryVideoUrl: url }))
                          )
                        }
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* 2. "DISCOVER LUXURY GIFTING" Banner & Mega-Menu Promo Banner */}
              <div className="p-4 bg-[#FAF7F2] border border-[#E5E0D8] space-y-3">
                <h3 className="font-serif-luxury text-base font-bold uppercase text-[#1A1A1A]">
                  2. &ldquo;DISCOVER Luxury Gifting&rdquo; Banner &amp; Hamburger Drawer Promo Card
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Luxury Gifting Banner Title</label>
                    <input
                      type="text"
                      value={settingsForm.luxuryGiftingBannerTitle || 'DISCOVER Luxury Gifting'}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          luxuryGiftingBannerTitle: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3 bg-white border border-[#D4CFC7]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Luxury Gifting Image</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={settingsForm.luxuryGiftingBannerImage || ''}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            luxuryGiftingBannerImage: e.target.value,
                          })
                        }
                        className="flex-1 h-10 px-3 bg-white border border-[#D4CFC7]"
                      />
                      <label className="h-10 px-3 bg-[#1A1A1A] text-white flex items-center cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleSingleImageUpload(e, (url) =>
                              setSettingsForm((prev) => ({
                                ...prev,
                                luxuryGiftingBannerImage: url,
                              }))
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Mega-Menu Promo Title</label>
                    <input
                      type="text"
                      value={settingsForm.megaMenuBannerTitle || 'Too Cool For ORDINARY'}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, megaMenuBannerTitle: e.target.value })
                      }
                      className="w-full h-10 px-3 bg-white border border-[#D4CFC7]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Mega-Menu Promo Image</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={settingsForm.megaMenuBannerUrl || ''}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, megaMenuBannerUrl: e.target.value })
                        }
                        className="flex-1 h-10 px-3 bg-white border border-[#D4CFC7]"
                      />
                      <label className="h-10 px-3 bg-[#1A1A1A] text-white flex items-center cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleSingleImageUpload(e, (url) =>
                              setSettingsForm((prev) => ({ ...prev, megaMenuBannerUrl: url }))
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Split Luxury Rewards Popup Settings */}
              <div className="p-4 bg-[#FAF7F2] border border-[#E5E0D8] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-luxury text-base font-bold uppercase text-[#1A1A1A]">
                    3. Split Luxury Rewards Popup Modal (00:02 in Video)
                  </h3>
                  <label className="flex items-center gap-2 font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsForm.rewardPopupEnabled !== false}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          rewardPopupEnabled: e.target.checked,
                        })
                      }
                    />
                    <span>Enable Rewards Popup</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Popup Headline</label>
                    <input
                      type="text"
                      value={settingsForm.rewardPopupTitle || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, rewardPopupTitle: e.target.value })
                      }
                      className="w-full h-10 px-3 bg-white border border-[#D4CFC7]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Reward Coupon Code</label>
                    <input
                      type="text"
                      value={settingsForm.rewardCouponCode || 'ROYAL10'}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, rewardCouponCode: e.target.value })
                      }
                      className="w-full h-10 px-3 bg-white border border-[#D4CFC7] font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Popup Left Image</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={settingsForm.rewardPopupImage || ''}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, rewardPopupImage: e.target.value })
                        }
                        className="flex-1 h-10 px-3 bg-white border border-[#D4CFC7]"
                      />
                      <label className="h-10 px-3 bg-[#1A1A1A] text-white flex items-center cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleSingleImageUpload(e, (url) =>
                              setSettingsForm((prev) => ({ ...prev, rewardPopupImage: url }))
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Store Identity, Logo, Announcement Bar & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1 text-[#B5893D]">
                    Top Announcement Bar Text (00:31 in Video)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.announcementText}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, announcementText: e.target.value })
                    }
                    className="w-full h-10 px-3 border border-[#B5893D] font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Website Brand Logo</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={settingsForm.logoUrl || '/charlie-logo.png'}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, logoUrl: e.target.value })
                      }
                      className="flex-1 h-10 px-3 border border-[#D4CFC7]"
                    />
                    <label className="h-10 px-3 bg-[#1A1A1A] text-white flex items-center cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
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
                <div>
                  <label className="block font-bold mb-1">Official Brand Name</label>
                  <input
                    type="text"
                    value={settingsForm.storeName}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, storeName: e.target.value })
                    }
                    className="w-full h-10 px-3 border border-[#D4CFC7]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">WhatsApp Ordering Number</label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })
                    }
                    className="w-full h-10 px-3 border border-[#D4CFC7]"
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
                    className="w-full h-10 px-3 border border-[#D4CFC7]"
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
                    className="w-full h-10 px-3 border border-[#D4CFC7]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Merchant UPI ID</label>
                  <input
                    type="text"
                    value={settingsForm.upiId}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, upiId: e.target.value })
                    }
                    className="w-full h-10 px-3 border border-[#D4CFC7]"
                  />
                </div>
              </div>

              {/* Cloudinary Configuration Box */}
              <div className="p-4 bg-[#FAF7F2] border border-[#E5E0D8] grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#1A1A1A] mb-1">
                    Cloudinary Cloud Name *
                  </label>
                  <input
                    type="text"
                    value={cloudNameInput}
                    onChange={(e) => setCloudNameInput(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#D4CFC7] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1A1A1A] mb-1">
                    Cloudinary Upload Preset (Unsigned) *
                  </label>
                  <input
                    type="text"
                    value={uploadPresetInput}
                    onChange={(e) => setUploadPresetInput(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#D4CFC7] font-mono font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="h-11 px-6 bg-[#B5893D] hover:bg-[#9E742F] text-white font-bold uppercase tracking-wider cursor-pointer"
              >
                Save All Store &amp; Luxury Theme Settings
              </button>
            </form>
          </div>
        )}

        {/* =====================================================================
            TAB 9: HOMEPAGE SECTIONS & CATALOG RESET
        ===================================================================== */}
        {activeTab === 'homepage' && (
          <div className="bg-white border border-[#E5E0D8] p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D8] pb-4">
              <div>
                <h2 className="font-serif-luxury text-lg font-bold uppercase text-[#1A1A1A]">
                  Customize Homepage Section Titles &amp; Visibility
                </h2>
                <p className="text-xs text-[#666666]">
                  Rename any luxury homepage section heading or toggle sections on/off.
                </p>
              </div>
              <button
                type="button"
                onClick={resetCatalogToDefaults}
                className="h-9 px-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 self-start cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Default Luxury Catalog &amp; Reels</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {homepageSections.map((sec, idx) => (
                <div
                  key={sec.id}
                  className="p-3.5 border border-[#E5E0D8] flex items-center justify-between gap-3"
                >
                  <input
                    type="text"
                    value={sec.title}
                    onChange={(e) => {
                      const updated = [...homepageSections];
                      updated[idx] = { ...sec, title: e.target.value };
                      updateHomepageSections(updated);
                    }}
                    className="flex-1 h-9 px-3 bg-[#FAF7F2] font-bold text-[#1A1A1A]"
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
            TAB 10: ANALYTICS & INVENTORY OVERVIEW
        ===================================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <div className="bg-white border border-[#E5E0D8] p-4">
                <span className="text-xs text-[#666666] font-medium">Total Products</span>
                <p className="text-2xl font-extrabold text-[#1A1A1A] mt-1 tabular-nums">
                  {products.length}
                </p>
              </div>
              <div className="bg-white border border-[#E5E0D8] p-4">
                <span className="text-xs text-[#666666] font-medium">Celebrity Reels</span>
                <p className="text-2xl font-extrabold text-[#B5893D] mt-1 tabular-nums">
                  {celebrityReels.length}
                </p>
              </div>
              <div className="bg-white border border-[#E5E0D8] p-4">
                <span className="text-xs text-[#666666] font-medium">Total Orders</span>
                <p className="text-2xl font-extrabold text-[#1A1A1A] mt-1 tabular-nums">
                  {orders.length}
                </p>
              </div>
              <div className="bg-white border border-[#E5E0D8] p-4">
                <span className="text-xs text-[#666666] font-medium">Notify Me Waitlist</span>
                <p className="text-2xl font-extrabold text-[#1A1A1A] mt-1 tabular-nums">
                  {notifyMeRequests.length}
                </p>
              </div>
              <div className="bg-white border border-[#E5E0D8] p-4 col-span-2 lg:col-span-1">
                <span className="text-xs text-[#666666] font-medium">Total Revenue</span>
                <p className="text-2xl font-extrabold text-[#B5893D] mt-1 tabular-nums">
                  {formatINR(totalRevenue)}
                </p>
              </div>
            </div>
          </div>
        )}
        {/* =====================================================================
            TAB 11: LIVE AI CHATS MONITOR (GROQ + FIREBASE REAL-TIME SYNC)
        ===================================================================== */}
        {activeTab === 'chats' && (
          <div className="space-y-4">
            <div className="bg-white border border-[#E5E0D8] p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-serif-luxury text-base sm:text-xl font-bold uppercase tracking-[0.06em] sm:tracking-[0.08em] text-[#1A1A1A]">
                  Live AI Chats Monitor
                </h2>
                <p className="text-[11px] sm:text-xs text-[#666666] mt-0.5">
                  Customer queries &amp; Groq AI replies synced under{' '}
                  <code className="bg-[#FAF7F2] px-1.5 py-0.5 text-[#B5893D] font-mono">
                    /support_chats/{'{userId}'}
                  </code>
                </p>
              </div>
              <button
                type="button"
                onClick={() => refreshSupportChats()}
                className="min-h-[40px] sm:h-9 px-4 bg-[#FAF7F2] hover:bg-[#B5893D] hover:text-white border border-[#D4CFC7] text-xs font-bold uppercase tracking-wider cursor-pointer self-start"
              >
                Refresh Feed
              </button>
            </div>

            {supportChats.length === 0 ? (
              <div className="bg-white border border-[#E5E0D8] p-8 sm:p-12 text-center space-y-2">
                <MessageCircle className="w-8 h-8 text-[#B5893D] mx-auto" />
                <p className="text-sm font-bold text-[#1A1A1A]">No Active Customer AI Chats Yet</p>
                <p className="text-xs text-[#666666] max-w-md mx-auto">
                  When customers message the AI Chatbot on any Product Page or Storefront, their full conversation and Groq AI replies appear here in real time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left Pane: Active Customer Sessions (hidden on mobile when viewing a thread) */}
                <div
                  className={`${
                    mobileChatView === 'thread' ? 'hidden lg:flex' : 'flex'
                  } lg:col-span-4 bg-white border border-[#E5E0D8] flex-col max-h-[65vh] lg:max-h-[600px]`}
                >
                  <div className="p-3 border-b border-[#E5E0D8]">
                    <div className="relative">
                      <Search className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
                      <input
                        type="text"
                        value={chatSearchQuery}
                        onChange={(e) => setChatSearchQuery(e.target.value)}
                        placeholder="Search user, phone or message..."
                        className="w-full h-10 pl-9 pr-3 bg-[#FAF7F2] border border-[#E5E0D8] text-sm sm:text-xs focus:outline-none focus:border-[#B5893D]"
                      />
                    </div>
                  </div>
                  <div className="divide-y divide-[#F0ECE1] overflow-y-auto flex-1">
                    {supportChats
                      .filter((s) => {
                        const q = chatSearchQuery.trim().toLowerCase();
                        if (!q) return true;
                        return (
                          s.customerName.toLowerCase().includes(q) ||
                          (s.customerPhone || '').toLowerCase().includes(q) ||
                          s.lastMessage.toLowerCase().includes(q) ||
                          (s.productName || '').toLowerCase().includes(q)
                        );
                      })
                      .map((session) => {
                        const isSelected = session.userId === selectedChatUserId;
                        return (
                          <button
                            key={session.userId}
                            type="button"
                            onClick={() => {
                              setSelectedChatUserId(session.userId);
                              setMobileChatView('thread');
                            }}
                            className={`w-full text-left p-3.5 min-h-[64px] transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#FAF7F2] border-l-4 border-[#B5893D]'
                                : 'hover:bg-[#FAF7F2]/60'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm sm:text-xs font-bold text-[#1A1A1A] truncate">
                                {session.customerName}
                              </span>
                              <span className="text-[10px] text-[#8C8C8C] shrink-0 tabular-nums">
                                {new Date(session.updatedAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            {(session.customerPhone || session.productName) && (
                              <p className="text-[11px] sm:text-[10px] font-semibold text-[#B5893D] truncate mt-0.5">
                                {session.customerPhone || session.productName}
                              </p>
                            )}
                            <p className="text-xs sm:text-[11px] text-[#666666] line-clamp-1 mt-1">
                              {session.lastSender === 'assistant'
                                ? 'AI: '
                                : session.lastSender === 'admin'
                                ? 'You: '
                                : 'Customer: '}
                              {session.lastMessage}
                            </p>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Right Pane: Live Conversation Thread */}
                {(() => {
                  const activeSession =
                    supportChats.find((s) => s.userId === selectedChatUserId) || supportChats[0];
                  if (!activeSession) return null;
                  return (
                    <div
                      className={`${
                        mobileChatView === 'list' ? 'hidden lg:flex' : 'flex'
                      } lg:col-span-8 bg-white border border-[#E5E0D8] flex-col h-[70vh] lg:h-[600px]`}
                    >
                      <div className="px-3 sm:px-4 py-3 border-b border-[#E5E0D8] bg-[#FAF7F2] flex items-center justify-between gap-2 sm:gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <button
                            type="button"
                            onClick={() => setMobileChatView('list')}
                            aria-label="Back to chat list"
                            className="lg:hidden min-h-[40px] min-w-[40px] px-2 bg-white border border-[#D4CFC7] text-[#1A1A1A] flex items-center justify-center cursor-pointer shrink-0"
                          >
                            <ArrowLeft className="w-4 h-4" />
                          </button>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                              <h3 className="text-sm font-bold text-[#1A1A1A] truncate">
                                {activeSession.customerName}
                              </h3>
                              <span className="text-[10px] px-2 py-0.5 bg-white border border-[#E5E0D8] font-mono text-[#666666] shrink-0">
                                {activeSession.messages.length}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#666666] truncate">
                              {activeSession.customerPhone || activeSession.userId}
                              {activeSession.productName
                                ? ` · ${activeSession.productName}`
                                : ''}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => deleteSupportChat(activeSession.userId)}
                          className="min-h-[38px] sm:h-8 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Clear</span>
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3 bg-white">
                        {activeSession.messages.map((m) => {
                          const isCustomer = m.sender === 'user';
                          const isAdminReply = m.sender === 'admin';
                          return (
                            <div
                              key={m.id}
                              className={`flex flex-col ${
                                isCustomer ? 'items-start' : 'items-end'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1 text-[10px] text-[#8C8C8C]">
                                <span className="font-bold uppercase tracking-wider text-[#1A1A1A]">
                                  {isCustomer
                                    ? activeSession.customerName
                                    : isAdminReply
                                    ? 'Admin Concierge'
                                    : 'Groq AI'}
                                </span>
                                <span className="tabular-nums">
                                  {new Date(m.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                              <div
                                className={`max-w-[85%] sm:max-w-[80%] px-3.5 py-2.5 text-sm sm:text-xs leading-relaxed whitespace-pre-wrap ${
                                  isCustomer
                                    ? 'bg-[#F5F5F5] text-[#1A1A1A] border border-[#E5E0D8]'
                                    : isAdminReply
                                    ? 'bg-[#B5893D] text-white'
                                    : 'bg-[#2A1810] text-[#F4D993]'
                                }`}
                              >
                                {m.text}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (!adminReplyInput.trim()) return;
                          await sendAdminChatReply(activeSession.userId, adminReplyInput);
                          setAdminReplyInput('');
                        }}
                        className="p-2.5 sm:p-3 border-t border-[#E5E0D8] bg-[#FAF7F2] flex items-center gap-2"
                      >
                        <input
                          type="text"
                          value={adminReplyInput}
                          onChange={(e) => setAdminReplyInput(e.target.value)}
                          placeholder="Reply as Store Concierge..."
                          className="flex-1 h-11 sm:h-10 px-3 bg-white border border-[#D4CFC7] text-sm sm:text-xs focus:outline-none focus:border-[#B5893D]"
                        />
                        <button
                          type="submit"
                          className="h-11 sm:h-10 px-4 bg-[#1A1A1A] hover:bg-[#B5893D] text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors shrink-0"
                        >
                          Send
                        </button>
                      </form>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* =====================================================================
          MOBILE BOTTOM THUMB-ZONE NAVIGATION BAR (md:hidden)
      ===================================================================== */}
      <nav
        aria-label="Mobile Admin Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#2A1810] text-white border-t border-[#B5893D]/40 shadow-[0_-4px_20px_rgba(0,0,0,0.18)]"
      >
        <div className="grid grid-cols-5 h-[62px]">
          {primaryMobileTabIds.map((tabId) => {
            const tab = adminTabs.find((t) => t.id === tabId)!;
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowMobileMoreSheet(false);
                }}
                className={`relative flex flex-col items-center justify-center gap-1 min-h-[44px] cursor-pointer transition-colors ${
                  active ? 'text-[#D4AF37]' : 'text-white/70 hover:text-white'
                }`}
              >
                {active && (
                  <span className="absolute top-0 inset-x-3 h-0.5 bg-[#D4AF37]" />
                )}
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {typeof tab.badge === 'number' && tab.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 bg-[#B5893D] text-white text-[9px] font-bold flex items-center justify-center rounded-full tabular-nums">
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold tracking-wide leading-none">
                  {tab.shortLabel}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setShowMobileMoreSheet((v) => !v)}
            className={`relative flex flex-col items-center justify-center gap-1 min-h-[44px] cursor-pointer transition-colors ${
              isMoreTabActive || showMobileMoreSheet
                ? 'text-[#D4AF37]'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {isMoreTabActive && (
              <span className="absolute top-0 inset-x-3 h-0.5 bg-[#D4AF37]" />
            )}
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] font-bold tracking-wide leading-none">
              More
            </span>
          </button>
        </div>
      </nav>

      {/* =====================================================================
          MOBILE "MORE TOOLS" BOTTOM SHEET DRAWER (md:hidden)
      ===================================================================== */}
      {showMobileMoreSheet && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 flex items-end justify-center"
          onClick={() => setShowMobileMoreSheet(false)}
        >
          <div
            className="w-full max-h-[82vh] bg-white border-t-2 border-[#B5893D] rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle + Sheet Header */}
            <div className="pt-2.5 pb-3 px-4 border-b border-[#E5E0D8] bg-[#FAF7F2]">
              <div className="w-10 h-1 bg-[#D4CFC7] rounded-full mx-auto mb-3" />
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B5893D]">
                    ADMIN WORKSPACE
                  </span>
                  <h3 className="font-serif-luxury text-base font-bold uppercase text-[#1A1A1A]">
                    All Storefront Tools
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMobileMoreSheet(false)}
                  aria-label="Close menu"
                  className="min-h-[40px] min-w-[40px] bg-white border border-[#E5E0D8] flex items-center justify-center text-[#1A1A1A] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* All 11 Tabs + Security Controls */}
            <div className="overflow-y-auto p-3 space-y-1.5">
              {adminTabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      setShowMobileMoreSheet(false);
                    }}
                    className={`w-full min-h-[48px] px-3.5 py-2.5 flex items-center justify-between gap-3 text-left text-xs font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#B5893D] text-white border-[#B5893D]'
                        : 'bg-white border-[#E5E0D8] text-[#1A1A1A]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-[#B5893D]'}`} />
                      <span className="truncate">{tab.label}</span>
                    </div>
                    {typeof tab.badge === 'number' && (
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold tabular-nums shrink-0 ${
                          active
                            ? 'bg-white/20 text-white'
                            : 'bg-[#FAF7F2] text-[#666666] border border-[#E5E0D8]'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="pt-2 border-t border-[#E5E0D8] grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowMobileMoreSheet(false);
                    setShowChangePassModal(true);
                  }}
                  className="min-h-[44px] px-3 bg-[#FAF7F2] border border-[#D4CFC7] text-[#1A1A1A] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-[#B5893D]" />
                  <span>Password</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMobileMoreSheet(false);
                    handleLockAdmin();
                  }}
                  className="min-h-[44px] px-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Lock Console</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
