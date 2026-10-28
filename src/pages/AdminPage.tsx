import React, { useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  Edit3,
  Image as ImageIcon,
  Layers,
  LayoutGrid,
  Package,
  Plus,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Upload,
} from 'lucide-react';
import { formatINR, useStore } from '../context/StoreContext';
import { CategoryItem, HeroBanner, Order, Product } from '../types/store';
import {
  getCloudinaryConfig,
  uploadImageToCloudinary,
  uploadMultipleImagesToCloudinary,
} from '../utils/cloudinary';
import { generateProductStudioSvg } from '../utils/productVisuals';
import { SmartImage } from '../components/SmartImage';

export const AdminPage: React.FC = () => {
  const {
    user,
    isAdmin,
    loginWithGoogle,
    products,
    categories,
    banners,
    orders,
    storeSettings,
    homepageSections,
    saveProduct,
    deleteProduct,
    saveCategory,
    deleteCategory,
    saveBanner,
    deleteBanner,
    updateOrderStatus,
    updateStoreSettings,
    updateHomepageSections,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'products' | 'categories' | 'banners' | 'orders' | 'settings' | 'homepage'
  >('dashboard');

  const [demoAdminUnlocked, setDemoAdminUnlocked] = useState(false);

  // Product Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Category Form State
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catOrder, setCatOrder] = useState(categories.length + 1);
  const [catImage, setCatImage] = useState('');

  // Banner Form State
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSub, setBannerSub] = useState('');
  const [bannerCtaText, setBannerCtaText] = useState('Shop Now');
  const [bannerCtaLink, setBannerCtaLink] = useState('/products');
  const [bannerImage, setBannerImage] = useState('');

  // Store Settings Form State
  const [settingsForm, setSettingsForm] = useState(storeSettings);

  const cloudinaryInfo = getCloudinaryConfig();

  const hasAccess = isAdmin || demoAdminUnlocked;

  if (!hasAccess) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#101114] text-[#00C2FF] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-[#171717]">
            CHARLIE MOBILE — Store Owner Admin
          </h1>
          <p className="text-xs text-[#737373] leading-relaxed">
            Sign in with the authorized store owner Google account (
            <strong>shriyanshsingh7581@gmail.com</strong>) to sync changes with Firebase Firestore, or enter Local Admin Mode to test product, banner, order, and store customization right now.
          </p>
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={loginWithGoogle}
              className="w-full h-11 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
            >
              Sign In with Store Owner Google Account
            </button>
            <button
              type="button"
              onClick={() => setDemoAdminUnlocked(true)}
              className="w-full h-11 rounded-xl bg-[#101114] hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
            >
              Open Admin Dashboard (Local / Preview Mode)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Metrics
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const lowStockProducts = products.filter((p) => p.stock <= 10);
  const uniqueCustomers = new Set(orders.map((o) => o.customerPhone || o.userId)).size;

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
      stock: 15,
      description: '',
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
      isBestSeller: false,
      isFeatured: true,
      isNewRelease: true,
      rating: 4.8,
      reviewCount: 1,
      warranty: '1 Year Official Brand Warranty',
      exchangeBonus: 4000,
      emiStartingAt: 2083,
      specs: {
        Display: '6.7-inch 120Hz AMOLED',
        Processor: 'Flagship Octa-Core 5G',
        Camera: '50MP OIS Triple Camera',
        Battery: '5000mAh Fast Charging',
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
      showToast('Image uploaded successfully');
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
        mainImage: editingProduct.mainImage || urls[0],
        gallery: [...(editingProduct.gallery || []), ...urls],
      });
      showToast(`Uploaded ${urls.length} gallery images`);
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

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    const slug = (catSlug || catName).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat: CategoryItem = {
      id: `cat_${Date.now()}`,
      name: catName.trim(),
      slug,
      order: Number(catOrder) || categories.length + 1,
      image:
        catImage ||
        generateProductStudioSvg({
          title: catName.trim(),
          brand: catName.trim(),
          category: slug,
        }),
    };
    await saveCategory(newCat);
    setCatName('');
    setCatSlug('');
    setCatImage('');
  };

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle.trim()) return;
    const newBanner: HeroBanner = {
      id: `banner_${Date.now()}`,
      title: bannerTitle.trim(),
      subtitle: bannerSub.trim(),
      tag: 'PROMOTIONAL CAMPAIGN',
      ctaText: bannerCtaText.trim() || 'Shop Now',
      ctaLink: bannerCtaLink.trim() || '/products',
      image:
        bannerImage ||
        generateProductStudioSvg({
          title: bannerTitle.trim(),
          brand: 'Charlie Mobile',
          category: 'smartphones',
        }),
      accentColor: '#2563EB',
      enabled: true,
    };
    await saveBanner(newBanner);
    setBannerTitle('');
    setBannerSub('');
    setBannerImage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-8 space-y-6">
      {/* Top Admin Header */}
      <div className="bg-[#101114] text-white rounded-3xl p-5 sm:p-6 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#00C2FF] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>
              {isAdmin
                ? `Authenticated Admin (${user?.email})`
                : 'Local Admin Management Mode'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold mt-0.5">
            CHARLIE MOBILE — Store Management Console
          </h1>
          <p className="text-xs text-slate-400">
            Manage Products, Categories, Hero Banners, Customer Orders, Cloudinary Uploads &amp; Store Settings
          </p>
        </div>

        <div className="text-xs text-right">
          <span className="inline-block px-3 py-1.5 rounded-xl bg-white/10 text-slate-200 font-semibold">
            Cloudinary:{' '}
            {cloudinaryInfo.isConfigured
              ? `Connected (${cloudinaryInfo.cloudName})`
              : 'Instant Local Studio Preview Active'}
          </span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'dashboard', label: 'Dashboard Overview', icon: BarChart3 },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'categories', label: `Categories (${categories.length})`, icon: LayoutGrid },
          { id: 'banners', label: `Banners (${banners.length})`, icon: ImageIcon },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'settings', label: 'Store Settings', icon: Settings },
          { id: 'homepage', label: 'Homepage Sections', icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                active
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-white border border-[#E5E7EB] text-[#171717] hover:border-[#2563EB]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DASHBOARD */}
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
            {/* Recent Orders */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-[#171717]">Recent Orders</h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#2563EB]"
                >
                  Manage All
                </button>
              </div>
              {orders.length === 0 ? (
                <p className="text-xs text-[#737373] py-4">
                  No customer orders placed yet. Orders placed via Checkout will appear here in real time.
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

            {/* Low Stock Alert */}
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
                        Restock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-[#171717]">
              Catalog Product Management
            </h2>
            <button
              type="button"
              onClick={startNewProduct}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Product Editor Form */}
          {editingProduct && (
            <form
              onSubmit={handleSaveProductSubmit}
              className="bg-white rounded-3xl border-2 border-[#2563EB] p-5 sm:p-6 space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                <h3 className="text-base font-extrabold text-[#171717]">
                  {products.some((p) => p.id === editingProduct.id)
                    ? `Edit Product: ${editingProduct.name}`
                    : 'Create New Product'}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="text-rose-600 font-bold cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block font-bold mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
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
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Selling Price (INR) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">MRP (INR) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.mrp}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, mrp: Number(e.target.value) })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
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
                        ramOptions: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Storage Options (comma separated)</label>
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
                    className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-[#E5E7EB]"
                />
              </div>

              {/* Cloudinary / Local Image Upload */}
              <div className="p-4 rounded-2xl bg-[#F5F6F8] space-y-3">
                <label className="block font-bold">
                  Product Main Image &amp; Gallery Upload (Cloudinary Supported)
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    value={editingProduct.mainImage}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, mainImage: e.target.value })
                    }
                    placeholder="Paste Image URL or Upload via Cloudinary"
                    className="flex-1 h-10 px-3 rounded-xl bg-white border border-[#E5E7EB]"
                  />
                  <label className="h-10 px-4 rounded-xl bg-[#101114] text-white font-bold flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Multiple Images'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Badges Checkboxes */}
              <div className="flex flex-wrap gap-5 pt-2">
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is5G}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, is5G: e.target.checked })
                    }
                  />
                  <span>5G Ready</span>
                </label>
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isBestSeller}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })
                    }
                  />
                  <span>Best Seller</span>
                </label>
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeatured}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })
                    }
                  />
                  <span>Featured Product</span>
                </label>
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isNewRelease}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, isNewRelease: e.target.checked })
                    }
                  />
                  <span>New Release</span>
                </label>
              </div>

              <button
                type="submit"
                className="h-11 px-6 rounded-xl bg-[#2563EB] text-white font-bold cursor-pointer"
              >
                Save Product
              </button>
            </form>
          )}

          {/* Product List Table */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F5F6F8] border-b border-[#E5E7EB] text-[#737373]">
                    <th className="p-3.5 font-bold">Product</th>
                    <th className="p-3.5 font-bold">Brand / Cat</th>
                    <th className="p-3.5 font-bold">Price / MRP</th>
                    <th className="p-3.5 font-bold">Stock</th>
                    <th className="p-3.5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3.5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#F8FAFC] p-1 shrink-0">
                          <SmartImage src={p.mainImage} alt={p.name} brand={p.brand} />
                        </div>
                        <span className="font-bold text-[#171717]">{p.name}</span>
                      </td>
                      <td className="p-3.5 text-[#737373]">
                        {p.brand} · {p.category}
                      </td>
                      <td className="p-3.5 tabular-nums">
                        <span className="font-extrabold text-[#171717]">
                          {formatINR(p.price)}
                        </span>{' '}
                        <span className="line-through text-[#737373]">{formatINR(p.mrp)}</span>
                      </td>
                      <td className="p-3.5 font-bold tabular-nums">{p.stock}</td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(p)}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-blue-50 text-[#2563EB] cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProduct(p.id)}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORY MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form
            onSubmit={handleAddCategory}
            className="lg:col-span-4 bg-white rounded-3xl border border-[#E5E7EB] p-5 space-y-3.5 text-xs"
          >
            <h2 className="text-base font-extrabold text-[#171717]">Add Category</h2>
            <div>
              <label className="block font-bold mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="e.g. Gaming Accessories"
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
            <div>
              <label className="block font-bold mb-1">Category Image Upload</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleSingleImageUpload(e, setCatImage)}
                className="w-full text-xs"
              />
            </div>
            <button
              type="submit"
              className="w-full h-10 rounded-xl bg-[#2563EB] text-white font-bold cursor-pointer"
            >
              Create Category
            </button>
          </form>

          <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E5E7EB] p-5">
            <h2 className="text-base font-extrabold text-[#171717] mb-3">
              Active Categories ({categories.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-3 rounded-2xl border border-[#E5E7EB] flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-9 h-9 rounded-lg bg-[#F8FAFC] p-1 shrink-0">
                      <SmartImage src={cat.image} alt={cat.name} />
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-[#171717] truncate">{cat.name}</p>
                      <p className="text-[10px] text-[#737373]">Order #{cat.order}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteCategory(cat.id)}
                    className="text-rose-600 p-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BANNER MANAGEMENT */}
      {activeTab === 'banners' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form
            onSubmit={handleAddBanner}
            className="lg:col-span-4 bg-white rounded-3xl border border-[#E5E7EB] p-5 space-y-3.5 text-xs"
          >
            <h2 className="text-base font-extrabold text-[#171717]">
              Add Promotional Hero Banner
            </h2>
            <div>
              <label className="block font-bold mb-1">Headline *</label>
              <input
                type="text"
                required
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                placeholder="e.g. Festive 5G Upgrade Sale"
                className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
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
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold mb-1">CTA Text</label>
                <input
                  type="text"
                  value={bannerCtaText}
                  onChange={(e) => setBannerCtaText(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-[#E5E7EB]"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">CTA Route</label>
                <input
                  type="text"
                  value={bannerCtaLink}
                  onChange={(e) => setBannerCtaLink(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-[#E5E7EB]"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold mb-1">Upload Banner Visual</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleSingleImageUpload(e, setBannerImage)}
                className="w-full text-xs"
              />
            </div>
            <button
              type="submit"
              className="w-full h-10 rounded-xl bg-[#2563EB] text-white font-bold cursor-pointer"
            >
              Publish Hero Banner
            </button>
          </form>

          <div className="lg:col-span-8 space-y-3">
            {banners.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-[#101114] p-1.5 shrink-0">
                    <SmartImage src={b.image} alt={b.title} />
                  </div>
                  <div>
                    <p className="font-extrabold text-sm text-[#171717]">{b.title}</p>
                    <p className="text-[#737373] line-clamp-1">{b.subtitle}</p>
                    <span className="text-[11px] font-bold text-[#2563EB]">
                      CTA: {b.ctaText} → {b.ctaLink}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => saveBanner({ ...b, enabled: !b.enabled })}
                    className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                      b.enabled
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {b.enabled ? 'Enabled' : 'Hidden'}
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
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: ORDER MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-5 space-y-4">
          <h2 className="text-base font-extrabold text-[#171717]">
            Customer Orders Management ({orders.length})
          </h2>
          {orders.length === 0 ? (
            <p className="text-xs text-[#737373] py-6">No orders recorded yet.</p>
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
                    <p className="text-[#737373]">Address: {ord.shippingAddress}</p>
                    <p className="font-semibold text-[#2563EB]">Items: {ord.itemsSummary}</p>
                    <p className="font-extrabold text-sm text-[#171717] tabular-nums">
                      Total: {formatINR(ord.totalAmount)} ({ord.paymentMethod.toUpperCase()} —{' '}
                      {ord.paymentStatus})
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
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
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: STORE SETTINGS */}
      {activeTab === 'settings' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateStoreSettings(settingsForm);
          }}
          className="bg-white rounded-3xl border border-[#E5E7EB] p-5 sm:p-6 space-y-4 text-xs"
        >
          <h2 className="text-base font-extrabold text-[#171717]">
            Configure Physical Store &amp; WhatsApp Settings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <label className="block font-bold mb-1">Merchant UPI ID (Optional)</label>
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
              <label className="block font-bold mb-1">Top Promotional Announcement Bar</label>
              <input
                type="text"
                value={settingsForm.announcementText}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, announcementText: e.target.value })
                }
                className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB]"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-5">
            <label className="flex items-center gap-2 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={settingsForm.codEnabled}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, codEnabled: e.target.checked })
                }
              />
              <span>Enable Cash on Delivery / Pay at Store</span>
            </label>
          </div>

          <button
            type="submit"
            className="h-11 px-6 rounded-xl bg-[#2563EB] text-white font-bold cursor-pointer"
          >
            Save Store Settings
          </button>
        </form>
      )}

      {/* TAB 7: HOMEPAGE CUSTOMIZATION */}
      {activeTab === 'homepage' && (
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-5 space-y-4">
          <h2 className="text-base font-extrabold text-[#171717]">
            Customize Homepage Sections &amp; Visibility
          </h2>
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
    </div>
  );
};
