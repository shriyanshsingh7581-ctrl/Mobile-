# Security Specification — CHARLIE MOBILE & ACCESSORIES

## 1. Data Invariants
1. **Default Deny**: All unmatched paths in Firestore are denied for read and write.
2. **Admin Authorization (`isAdmin`)**: Only verified authenticated users whose email matches the bootstrapped store owner (`shriyanshsingh7581@gmail.com` with `email_verified == true`) or whose UID exists in `/admins/{uid}` have administrative privileges.
3. **Catalog Integrity (`products`, `categories`, `banners`, `settings`)**: Publicly readable by shoppers, but strictly writable (`create`, `update`, `delete`) ONLY by `isAdmin()` with strict schema validation (`hasAll`, `hasOnly`, string length bounds, and server timestamp `request.time`).
4. **Order Isolation & Integrity (`orders`)**:
   - Creation requires an authenticated verified user (`isSignedIn() && isVerified()`), `incoming().userId == request.auth.uid`, valid ID format, strict key allowlist, bounded string lengths, positive totals, initial status `'pending'`, and `createdAt == request.time && updatedAt == request.time`.
   - Read (`get`, `list`) is strictly restricted to `resource.data.userId == request.auth.uid || isAdmin()`. Blanket `isSignedIn()` reads are forbidden.
   - Updates are locked once `resource.data.status` reaches terminal states (`'delivered'` or `'cancelled'`) unless `isAdmin()`. Owners may only cancel their own `'pending'` order (`status == 'cancelled'`, `updatedAt == request.time`). Admins may update order status and payment status.
5. **PII Isolation (`users`)**:
   - `/users/{userId}` contains PII (`email`, `phone`, `savedAddress`).
   - Read and write access is strictly isolated to `request.auth.uid == userId` (with `incoming().uid == userId`) or `isAdmin()`.

## 2. The "Dirty Dozen" Payloads
1. **Unauthenticated Product Creation**: `auth = null` attempting `create` on `/products/prod_1`.
2. **Non-Admin Product Price Tampering**: Regular signed-in user attempting `update` on `/products/prod_1` with `{ price: 1 }`.
3. **Shadow Field Injection on Order**: Authenticated user creating `/orders/ord_1` with an extra field `{ isAdminApproved: true }`.
4. **Order Identity Spoofing**: Authenticated user `user_A` creating `/orders/ord_1` with `userId: "user_B"`.
5. **Blanket Order List Scraping**: Authenticated user `user_A` querying `/orders` without `where('userId', '==', 'user_A')`.
6. **PII Leak on User Profile**: Authenticated user `user_A` attempting `get` on `/users/user_B`.
7. **Terminal State Mutation**: User `user_A` attempting to update `/orders/ord_delivered` after `status == 'delivered'`.
8. **Order Status Escalation by Customer**: Customer `user_A` attempting to update their own order status from `'pending'` to `'delivered'`.
9. **Client Timestamp Forgery**: Customer creating `/orders/ord_1` with a past or future `createdAt` instead of `request.time`.
10. **ID Poisoning Attack**: Creating a document with a 500-character or special-character document ID.
11. **Value Poisoning (Denial of Wallet)**: Sending a 10,000-character string into `shippingAddress` (exceeding max 500 chars).
12. **Unverified Email Admin Spoof**: Attempting admin write with `email == 'shriyanshsingh7581@gmail.com'` but `email_verified == false`.
