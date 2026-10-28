# CHARLIE MOBILE & ACCESSORIES — Premium Mobile E-Commerce PWA

A mobile-first, production-ready e-commerce web application and installable Progressive Web App (PWA) built for **CHARLIE MOBILE & ACCESSORIES**.

## Key Features
- **Mobile-First Shopping Experience**: Sticky header, bottom navigation bar (`Home | Categories | Offers | Wishlist | Account`), smooth carousels, bottom-sheet filters on mobile, and sticky PDP purchase bar.
- **Complete 10-Screen Architecture**:
  1. **Homepage**: Editable promotional announcement bar, hero banner carousel, shop by category, trending categories, best-selling smartphones, latest 5G smartphones, shop by budget, top brands, flagship/camera/mid-range collections, accessories, smartwatches, exchange/EMI offers, and store info.
  2. **Category Browsing (`/categories`)**: Visual grid for Smartphones, iPhone, Samsung, Vivo, Oppo, Realme, Redmi, OnePlus, Motorola, iQOO, Poco, Tablets, Smartwatches, Earbuds, Chargers, Power Banks, and Mobile Accessories.
  3. **Product Listing (`/products`)**: Dynamic filtering (Brand, Price, RAM, Storage, Color, 5G, OS, Availability) via mobile bottom sheet & desktop sidebar, plus sorting.
  4. **Product Detail (`/product/:id`)**: Multi-angle studio gallery with zoom, live variant switching (Color, RAM, Storage), specifications, EMI & exchange calculator, WhatsApp direct product enquiry, and sticky mobile purchase bar.
  5. **Live Search (`/search`)**: Instant search across products, brands, and categories with recent/popular tags.
  6. **Shopping Cart (`/cart`)**: Persistent cart (`localStorage` + Firebase sync), coupon codes, save for later, and price breakdown.
  7. **Secure Checkout (`/checkout`)**: Store Pickup, Local Delivery, or Shipping; UPI, Cash on Delivery, or Online Payment gateway verification without fake payment simulation.
  8. **Customer Account (`/account`)**: Firebase Google Sign-In, profile management, order history, saved addresses, and wishlist.
  9. **Promotional Offers (`/offers`)**: Exchange bonus calculator, No-Cost EMI plans, brand deals, and copyable coupon codes.
  10. **Store Locator (`/store`)**: Physical CHARLIE MOBILE & ACCESSORIES showroom gallery, configurable address, opening hours, directions, and WhatsApp contact.
- **Full Admin Dashboard (`/admin`)**: Protected admin panel for managing Products, Categories, Hero Banners, Customer Orders, Store Settings, and Cloudinary image uploads.

## Deployment on Vercel
1. Run `npm install`
2. Configure environment variables (`VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`) if using custom Cloudinary uploads.
3. Build with `npm run build`
4. `vercel.json` is pre-configured with SPA rewrites (`/(.*) -> /index.html`).
