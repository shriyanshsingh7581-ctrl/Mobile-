/**
 * Firestore Security Rules Verification Suite — Dirty Dozen Payloads
 */
export interface SecurityTestPayload {
  id: number;
  name: string;
  collection: string;
  docId: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  auth: { uid: string; email?: string; email_verified?: boolean } | null;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED';
}

export const dirtyDozenTests: SecurityTestPayload[] = [
  {
    id: 1,
    name: 'Unauthenticated Product Creation',
    collection: 'products',
    docId: 'prod_1',
    operation: 'create',
    auth: null,
    payload: { name: 'Fake Phone', price: 100 },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Non-Admin Product Price Tampering',
    collection: 'products',
    docId: 'prod_1',
    operation: 'update',
    auth: { uid: 'user_1', email: 'buyer@example.com', email_verified: true },
    payload: { price: 1 },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Shadow Field Injection on Order',
    collection: 'orders',
    docId: 'ord_1',
    operation: 'create',
    auth: { uid: 'user_1', email: 'buyer@example.com', email_verified: true },
    payload: { userId: 'user_1', isAdminApproved: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Order Identity Spoofing',
    collection: 'orders',
    docId: 'ord_1',
    operation: 'create',
    auth: { uid: 'user_A', email: 'a@example.com', email_verified: true },
    payload: { userId: 'user_B' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Blanket Order List Scraping',
    collection: 'orders',
    docId: '*',
    operation: 'list',
    auth: { uid: 'user_A', email: 'a@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'PII Leak on User Profile',
    collection: 'users',
    docId: 'user_B',
    operation: 'get',
    auth: { uid: 'user_A', email: 'a@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Terminal State Mutation',
    collection: 'orders',
    docId: 'ord_delivered',
    operation: 'update',
    auth: { uid: 'user_A', email: 'a@example.com', email_verified: true },
    payload: { status: 'cancelled' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Order Status Escalation by Customer',
    collection: 'orders',
    docId: 'ord_1',
    operation: 'update',
    auth: { uid: 'user_A', email: 'a@example.com', email_verified: true },
    payload: { status: 'delivered' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Client Timestamp Forgery',
    collection: 'orders',
    docId: 'ord_1',
    operation: 'create',
    auth: { uid: 'user_A', email: 'a@example.com', email_verified: true },
    payload: { userId: 'user_A', createdAt: '2020-01-01T00:00:00Z' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'ID Poisoning Attack',
    collection: 'orders',
    docId: 'invalid$id#with!special*chars',
    operation: 'create',
    auth: { uid: 'user_A', email: 'a@example.com', email_verified: true },
    payload: { userId: 'user_A' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Value Poisoning (Denial of Wallet)',
    collection: 'orders',
    docId: 'ord_1',
    operation: 'create',
    auth: { uid: 'user_A', email: 'a@example.com', email_verified: true },
    payload: { userId: 'user_A', shippingAddress: 'A'.repeat(2000) },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Unverified Email Admin Spoof',
    collection: 'products',
    docId: 'prod_1',
    operation: 'delete',
    auth: { uid: 'spoof_admin', email: 'shriyanshsingh7581@gmail.com', email_verified: false },
    expectedResult: 'PERMISSION_DENIED',
  },
];
