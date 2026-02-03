/**
 * In-memory storefront store
 * Will be replaced with database persistence later
 */

import type { Storefront, PaymentRecord } from "./types";

/**
 * Notification for storefront owners
 */
export interface Notification {
  id: string;
  type: "payment_received" | "payment_failed" | "storefront_created";
  title: string;
  message: string;
  signature?: string;
  timestamp: number;
  read: boolean;
}

// In-memory storage
const storefronts = new Map<string, Storefront>();
const payments = new Map<string, PaymentRecord>();
const notifications = new Map<string, Notification[]>(); // keyed by storefront slug

/**
 * Generate a URL-safe slug from a business name
 */
function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40)
    .replace(/-$/, "");

  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}

/**
 * Generate a unique product ID
 */
function generateProductId(): string {
  return `prod_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Create a new storefront
 */
export function createStorefront(params: {
  businessName: string;
  businessDescription: string;
  walletAddress: string;
  products: Array<{
    name: string;
    description: string;
    price: number;
    currency: "SOL" | "USDC";
  }>;
  autoConvertToUSDC?: boolean;
}): Storefront {
  const slug = generateSlug(params.businessName);
  const theme = pickTheme(params.businessDescription);

  const storefront: Storefront = {
    slug,
    businessName: params.businessName,
    businessDescription: params.businessDescription,
    walletAddress: params.walletAddress,
    products: params.products.map((p) => ({
      ...p,
      id: generateProductId(),
    })),
    theme,
    createdAt: Date.now(),
    acceptedTokens: ["SOL", "USDC"],
    autoConvertToUSDC: params.autoConvertToUSDC ?? true,
  };

  storefronts.set(slug, storefront);

  // Add creation notification
  addNotification(slug, {
    id: `notif_created_${slug}`,
    type: "storefront_created",
    title: "Storefront Created! 🚀",
    message: `${params.businessName} is live with ${params.products.length} product${params.products.length !== 1 ? "s" : ""}.`,
    timestamp: Date.now(),
    read: false,
  });

  return storefront;
}

/**
 * Get a storefront by slug
 */
export function getStorefront(slug: string): Storefront | null {
  return storefronts.get(slug) ?? null;
}

/**
 * Get storefronts by wallet address
 */
export function getStorefrontByWallet(walletAddress: string): Storefront[] {
  return Array.from(storefronts.values()).filter(
    (s) => s.walletAddress === walletAddress
  );
}

/**
 * List all storefronts
 */
export function listStorefronts(): Storefront[] {
  return Array.from(storefronts.values()).sort(
    (a, b) => b.createdAt - a.createdAt
  );
}

// ─── Payments ────────────────────────────────────────────

/**
 * Record a payment
 */
export function recordPayment(payment: PaymentRecord): void {
  payments.set(payment.id, payment);
}

/**
 * Update payment status
 */
export function updatePayment(
  id: string,
  update: Partial<PaymentRecord>
): PaymentRecord | null {
  const existing = payments.get(id);
  if (!existing) return null;

  const updated = { ...existing, ...update };
  payments.set(id, updated);
  return updated;
}

/**
 * Get payments for a storefront
 */
export function getPayments(storefrontSlug: string): PaymentRecord[] {
  return Array.from(payments.values())
    .filter((p) => p.storefrontSlug === storefrontSlug)
    .sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Get payment stats for a storefront
 */
export function getPaymentStats(storefrontSlug: string) {
  const storePayments = getPayments(storefrontSlug);
  const confirmed = storePayments.filter((p) => p.status === "confirmed");

  const totalSOL = confirmed
    .filter((p) => p.currency === "SOL")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalUSDC = confirmed
    .filter((p) => p.currency === "USDC")
    .reduce((sum, p) => sum + p.amount, 0);

  return {
    totalPayments: storePayments.length,
    confirmedPayments: confirmed.length,
    pendingPayments: storePayments.filter((p) => p.status === "pending").length,
    totalSOL,
    totalUSDC,
    recentPayments: confirmed.slice(0, 10),
  };
}

// ─── Notifications ───────────────────────────────────────

/**
 * Add a notification for a storefront
 */
export function addNotification(
  storefrontSlug: string,
  notification: Notification
): void {
  const existing = notifications.get(storefrontSlug) || [];
  existing.unshift(notification); // newest first
  // Keep max 50 notifications per storefront
  if (existing.length > 50) existing.pop();
  notifications.set(storefrontSlug, existing);
}

/**
 * Get notifications for a storefront
 */
export function getNotifications(storefrontSlug: string): Notification[] {
  return notifications.get(storefrontSlug) || [];
}

/**
 * Mark notification as read
 */
export function markNotificationRead(
  storefrontSlug: string,
  notificationId: string
): void {
  const existing = notifications.get(storefrontSlug);
  if (!existing) return;

  const notif = existing.find((n) => n.id === notificationId);
  if (notif) notif.read = true;
}

/**
 * Get unread notification count
 */
export function getUnreadCount(storefrontSlug: string): number {
  return (notifications.get(storefrontSlug) || []).filter((n) => !n.read)
    .length;
}

// ─── Theme Picker ────────────────────────────────────────

/**
 * Pick a theme based on business description keywords
 */
function pickTheme(description: string): Storefront["theme"] {
  const desc = description.toLowerCase();

  if (
    desc.includes("luxury") ||
    desc.includes("premium") ||
    desc.includes("boutique") ||
    desc.includes("jewelry")
  ) {
    return { accentColor: "#D4AF37", style: "elegant" };
  }

  if (
    desc.includes("tech") ||
    desc.includes("software") ||
    desc.includes("saas") ||
    desc.includes("developer")
  ) {
    return { accentColor: "#9945FF", style: "minimal" };
  }

  if (
    desc.includes("food") ||
    desc.includes("cafe") ||
    desc.includes("restaurant") ||
    desc.includes("bakery")
  ) {
    return { accentColor: "#FF6B35", style: "playful" };
  }

  if (
    desc.includes("fitness") ||
    desc.includes("sport") ||
    desc.includes("gym") ||
    desc.includes("coach")
  ) {
    return { accentColor: "#14F195", style: "bold" };
  }

  if (
    desc.includes("art") ||
    desc.includes("design") ||
    desc.includes("creative") ||
    desc.includes("photo")
  ) {
    return { accentColor: "#FF69B4", style: "bold" };
  }

  if (
    desc.includes("consult") ||
    desc.includes("advisor") ||
    desc.includes("coach") ||
    desc.includes("mentor")
  ) {
    return { accentColor: "#4FC3F7", style: "minimal" };
  }

  return { accentColor: "#9945FF", style: "minimal" };
}

// ─── Demo Data ───────────────────────────────────────────

// Seed a demo storefront
const demoStorefront: Storefront = {
  slug: "demo-store",
  businessName: "Paygent Demo Store",
  businessDescription:
    "A demo storefront showing what Paygent can build for your business. Try scanning a QR code!",
  walletAddress: "11111111111111111111111111111111",
  products: [
    {
      id: "prod_demo_1",
      name: "Basic Consultation",
      description: "30-minute strategy session via video call",
      price: 0.1,
      currency: "SOL",
    },
    {
      id: "prod_demo_2",
      name: "Premium Package",
      description: "Full service with deliverables and follow-up",
      price: 1.0,
      currency: "SOL",
    },
    {
      id: "prod_demo_3",
      name: "Quick Task",
      description: "One-off task completion within 24 hours",
      price: 5,
      currency: "USDC",
    },
  ],
  theme: { accentColor: "#9945FF", style: "minimal" },
  createdAt: Date.now(),
  acceptedTokens: ["SOL", "USDC"],
  autoConvertToUSDC: true,
};
storefronts.set("demo-store", demoStorefront);

// Seed demo payments for the dashboard
const demoPayments: PaymentRecord[] = [
  {
    id: "pay_demo_1",
    storefrontSlug: "demo-store",
    productId: "prod_demo_1",
    amount: 0.1,
    currency: "SOL",
    reference: "DemoRef1111111111111111111111111111111111111",
    status: "confirmed",
    signature: "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d",
    payer: "7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV",
    createdAt: Date.now() - 3600000,
    confirmedAt: Date.now() - 3590000,
  },
  {
    id: "pay_demo_2",
    storefrontSlug: "demo-store",
    productId: "prod_demo_2",
    amount: 1.0,
    currency: "SOL",
    reference: "DemoRef2222222222222222222222222222222222222",
    status: "confirmed",
    signature: "4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZAMdL1VZHirK",
    payer: "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr",
    createdAt: Date.now() - 7200000,
    confirmedAt: Date.now() - 7190000,
  },
  {
    id: "pay_demo_3",
    storefrontSlug: "demo-store",
    productId: "prod_demo_3",
    amount: 5,
    currency: "USDC",
    reference: "DemoRef3333333333333333333333333333333333333",
    status: "pending",
    createdAt: Date.now() - 300000,
  },
];
demoPayments.forEach((p) => payments.set(p.id, p));

// Seed demo notifications
addNotification("demo-store", {
  id: "notif_demo_1",
  type: "payment_received",
  title: "Payment Received! 💰",
  message: "0.1 SOL from 7EcD...FLtV",
  signature: "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d",
  timestamp: Date.now() - 3590000,
  read: false,
});
addNotification("demo-store", {
  id: "notif_demo_2",
  type: "payment_received",
  title: "Payment Received! 💰",
  message: "1.0 SOL from Gh9Z...tKJr",
  signature: "4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZAMdL1VZHirK",
  timestamp: Date.now() - 7190000,
  read: true,
});
addNotification("demo-store", {
  id: "notif_demo_created",
  type: "storefront_created",
  title: "Storefront Created! 🚀",
  message: "Paygent Demo Store is live with 3 products.",
  timestamp: Date.now() - 86400000,
  read: true,
});
