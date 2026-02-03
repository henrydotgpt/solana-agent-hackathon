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
  tagline?: string;
  logo?: string;
  walletAddress: string;
  products: Array<{
    name: string;
    description: string;
    price: number;
    currency: "SOL" | "USDC";
    image?: string;
  }>;
  links?: import("./types").StorefrontLinks;
  autoConvertToUSDC?: boolean;
}): Storefront {
  const slug = generateSlug(params.businessName);
  const theme = pickTheme(params.businessDescription);

  const storefront: Storefront = {
    slug,
    businessName: params.businessName,
    businessDescription: params.businessDescription,
    tagline: params.tagline,
    logo: params.logo,
    walletAddress: params.walletAddress,
    products: params.products.map((p) => ({
      ...p,
      id: generateProductId(),
    })),
    links: params.links,
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

  // Calculate fees collected (0.75% of confirmed payments)
  const feeBps = parseInt(process.env.PAYGENT_FEE_BPS || "75", 10);
  const feesSOL = (totalSOL * feeBps) / 10000;
  const feesUSDC = (totalUSDC * feeBps) / 10000;

  return {
    totalPayments: storePayments.length,
    confirmedPayments: confirmed.length,
    pendingPayments: storePayments.filter((p) => p.status === "pending").length,
    totalSOL,
    totalUSDC,
    feesSOL,
    feesUSDC,
    feeBps,
    merchantSOL: totalSOL - feesSOL,
    merchantUSDC: totalUSDC - feesUSDC,
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

// Demo 1: Coffee shop (lifestyle/retail)
const demoStorefront: Storefront = {
  slug: "demo-store",
  businessName: "Sol Brew Coffee",
  businessDescription:
    "Premium specialty coffee roasted in small batches. Pay with crypto, skip the middleman. Direct from roaster to your cup.",
  tagline: "Wake up to web3 ☕",
  logo: "https://api.dicebear.com/7.x/shapes/svg?seed=solbrew&backgroundColor=9945FF",
  walletAddress: "11111111111111111111111111111111",
  links: {
    website: "https://example.com",
    twitter: "https://x.com/paygent",
    instagram: "https://instagram.com/paygent",
  },
  products: [
    {
      id: "prod_demo_1",
      name: "Ethiopian Single Origin",
      description: "Bright & fruity — 250g whole bean bag",
      price: 0.08,
      currency: "SOL",
      image: "",
    },
    {
      id: "prod_demo_2",
      name: "Monthly Subscription Box",
      description: "3 bags of rotating seasonal blends delivered monthly",
      price: 0.5,
      currency: "SOL",
      image: "",
    },
    {
      id: "prod_demo_3",
      name: "Gift Card — $25",
      description: "Send a coffee gift to anyone with a Solana wallet",
      price: 25,
      currency: "USDC",
      image: "",
    },
  ],
  theme: { accentColor: "#D97706", style: "bold" },
  createdAt: Date.now() - 86400000 * 3,
  acceptedTokens: ["SOL", "USDC"],
  autoConvertToUSDC: true,
};
storefronts.set("demo-store", demoStorefront);

// Demo 2: Freelance dev agency
const agencyStore: Storefront = {
  slug: "web3-studio",
  businessName: "Nexus Web3 Studio",
  businessDescription:
    "Full-stack Solana development. Smart contracts, dApps, and DeFi integrations. Ship faster with battle-tested builders.",
  tagline: "Build different.",
  logo: "https://api.dicebear.com/7.x/shapes/svg?seed=nexusweb3&backgroundColor=3B82F6",
  walletAddress: "11111111111111111111111111111111",
  links: {
    website: "https://example.com",
    twitter: "https://x.com/paygent",
    telegram: "https://t.me/paygent",
    discord: "https://discord.gg/paygent",
  },
  products: [
    {
      id: "prod_agency_1",
      name: "Smart Contract Audit",
      description: "Comprehensive security review of your Solana program (up to 2K lines)",
      price: 5,
      currency: "SOL",
    },
    {
      id: "prod_agency_2",
      name: "dApp MVP Sprint",
      description: "2-week sprint: full-stack dApp from spec to deployed",
      price: 25,
      currency: "SOL",
    },
    {
      id: "prod_agency_3",
      name: "1-Hour Strategy Call",
      description: "Architecture review, tech stack advice, or roadmap planning",
      price: 50,
      currency: "USDC",
    },
  ],
  theme: { accentColor: "#3B82F6", style: "minimal" },
  createdAt: Date.now() - 86400000 * 7,
  acceptedTokens: ["SOL", "USDC"],
  autoConvertToUSDC: false,
};
storefronts.set("web3-studio", agencyStore);

// Demo 3: Digital creator / educator
const creatorStore: Storefront = {
  slug: "crypto-academy",
  businessName: "Solana Academy",
  businessDescription:
    "Learn Solana development from zero to deployed. Self-paced courses, live workshops, and 1-on-1 mentoring for aspiring web3 builders.",
  tagline: "From zero to Solana dev 🚀",
  logo: "https://api.dicebear.com/7.x/shapes/svg?seed=solanacademy&backgroundColor=14F195",
  walletAddress: "11111111111111111111111111111111",
  links: {
    website: "https://example.com",
    twitter: "https://x.com/paygent",
    discord: "https://discord.gg/paygent",
    email: "hello@example.com",
  },
  products: [
    {
      id: "prod_edu_1",
      name: "Solana 101 Course",
      description: "8-module self-paced course with projects and quizzes",
      price: 0.5,
      currency: "SOL",
    },
    {
      id: "prod_edu_2",
      name: "Live Workshop Pass",
      description: "Access to next live building session (2 hours, recorded)",
      price: 0.15,
      currency: "SOL",
    },
    {
      id: "prod_edu_3",
      name: "1-on-1 Mentoring (4 sessions)",
      description: "Monthly package: four 45-minute mentoring sessions via Zoom",
      price: 200,
      currency: "USDC",
    },
    {
      id: "prod_edu_4",
      name: "Community Access — Annual",
      description: "Private Discord, weekly office hours, project reviews",
      price: 75,
      currency: "USDC",
    },
  ],
  theme: { accentColor: "#14F195", style: "elegant" },
  createdAt: Date.now() - 86400000 * 14,
  acceptedTokens: ["SOL", "USDC"],
  autoConvertToUSDC: true,
};
storefronts.set("crypto-academy", creatorStore);

// Seed demo payments for all demo stores
const demoPayments: PaymentRecord[] = [
  // Sol Brew Coffee payments
  {
    id: "pay_demo_1",
    storefrontSlug: "demo-store",
    productId: "prod_demo_1",
    amount: 0.08,
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
    amount: 0.5,
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
    amount: 25,
    currency: "USDC",
    reference: "DemoRef3333333333333333333333333333333333333",
    status: "pending",
    createdAt: Date.now() - 300000,
  },
  // Nexus Web3 Studio payments
  {
    id: "pay_agency_1",
    storefrontSlug: "web3-studio",
    productId: "prod_agency_3",
    amount: 50,
    currency: "USDC",
    reference: "DemoRef4444444444444444444444444444444444444",
    status: "confirmed",
    signature: "3xBbPiJxUnHzSxGspuhpqLDx6wiyjNtZAMdL1VZHirK",
    payer: "9WzDXwBbz1nJqMTz7mEP26F4Ye5rSXG7TnvCjbfYNVUx",
    createdAt: Date.now() - 172800000,
    confirmedAt: Date.now() - 172790000,
  },
  {
    id: "pay_agency_2",
    storefrontSlug: "web3-studio",
    productId: "prod_agency_1",
    amount: 5,
    currency: "SOL",
    reference: "DemoRef5555555555555555555555555555555555555",
    status: "confirmed",
    signature: "2kFpLsYxGkJxyscszYEp35KHN8vvw3svAuLKTzXwCFL",
    payer: "HN7cABqLq46Es1jh92dQQisAi5YqpXLqeM8UPFLwhE3k",
    createdAt: Date.now() - 86400000,
    confirmedAt: Date.now() - 86390000,
  },
  // Solana Academy payments
  {
    id: "pay_edu_1",
    storefrontSlug: "crypto-academy",
    productId: "prod_edu_1",
    amount: 0.5,
    currency: "SOL",
    reference: "DemoRef6666666666666666666666666666666666666",
    status: "confirmed",
    signature: "7yKmRwZvG8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d",
    payer: "DRpbCBMxVnDK7maPM5tGv6MvB3v1sRMC86PZ8okm21hy",
    createdAt: Date.now() - 43200000,
    confirmedAt: Date.now() - 43190000,
  },
  {
    id: "pay_edu_2",
    storefrontSlug: "crypto-academy",
    productId: "prod_edu_2",
    amount: 0.15,
    currency: "SOL",
    reference: "DemoRef7777777777777777777777777777777777777",
    status: "confirmed",
    signature: "9xFkLmYeHdPqNJdTREpY1vzqKqZKvdpKuc147dw2N9d",
    payer: "3kzJxcPjWnMTvz7mEP26F4Ye5rSXG7TnvCjbfYNVUx",
    createdAt: Date.now() - 14400000,
    confirmedAt: Date.now() - 14390000,
  },
];
demoPayments.forEach((p) => payments.set(p.id, p));

// Seed demo notifications
// Notifications for Sol Brew Coffee
addNotification("demo-store", {
  id: "notif_demo_1",
  type: "payment_received",
  title: "Payment Received! 💰",
  message: "0.08 SOL from 7EcD...FLtV for Ethiopian Single Origin",
  signature: "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d",
  timestamp: Date.now() - 3590000,
  read: false,
});
addNotification("demo-store", {
  id: "notif_demo_2",
  type: "payment_received",
  title: "Payment Received! 💰",
  message: "0.5 SOL from Gh9Z...tKJr for Monthly Subscription Box",
  signature: "4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZAMdL1VZHirK",
  timestamp: Date.now() - 7190000,
  read: true,
});
addNotification("demo-store", {
  id: "notif_demo_created",
  type: "storefront_created",
  title: "Storefront Created! 🚀",
  message: "Sol Brew Coffee is live with 3 products.",
  timestamp: Date.now() - 86400000 * 3,
  read: true,
});

// Notifications for Nexus Web3 Studio
addNotification("web3-studio", {
  id: "notif_agency_1",
  type: "payment_received",
  title: "Payment Received! 💰",
  message: "50 USDC from 9WzD...VUx for Strategy Call",
  signature: "3xBbPiJxUnHzSxGspuhpqLDx6wiyjNtZAMdL1VZHirK",
  timestamp: Date.now() - 172790000,
  read: true,
});
addNotification("web3-studio", {
  id: "notif_agency_2",
  type: "payment_received",
  title: "Payment Received! 💰",
  message: "5 SOL from HN7c...E3k for Smart Contract Audit",
  signature: "2kFpLsYxGkJxyscszYEp35KHN8vvw3svAuLKTzXwCFL",
  timestamp: Date.now() - 86390000,
  read: false,
});

// Notifications for Solana Academy
addNotification("crypto-academy", {
  id: "notif_edu_1",
  type: "payment_received",
  title: "New Enrollment! 🎓",
  message: "0.5 SOL from DRpb...21hy for Solana 101 Course",
  signature: "7yKmRwZvG8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d",
  timestamp: Date.now() - 43190000,
  read: false,
});
addNotification("crypto-academy", {
  id: "notif_edu_2",
  type: "payment_received",
  title: "Workshop Pass Sold! 🎟️",
  message: "0.15 SOL from 3kzJ...VUx for Live Workshop Pass",
  signature: "9xFkLmYeHdPqNJdTREpY1vzqKqZKvdpKuc147dw2N9d",
  timestamp: Date.now() - 14390000,
  read: false,
});
