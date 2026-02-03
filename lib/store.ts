/**
 * In-memory storefront store
 * Will be replaced with database persistence later
 */

import type { Storefront, PaymentRecord } from "./types";

// In-memory storage
const storefronts = new Map<string, Storefront>();
const payments = new Map<string, PaymentRecord>();

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

  // Add random suffix to avoid collisions
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
  products: Array<{ name: string; description: string; price: number; currency: "SOL" | "USDC" }>;
  autoConvertToUSDC?: boolean;
}): Storefront {
  const slug = generateSlug(params.businessName);

  // Assign theme based on business type (simple heuristic)
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
  return storefront;
}

/**
 * Get a storefront by slug
 */
export function getStorefront(slug: string): Storefront | null {
  return storefronts.get(slug) ?? null;
}

/**
 * List all storefronts
 */
export function listStorefronts(): Storefront[] {
  return Array.from(storefronts.values()).sort(
    (a, b) => b.createdAt - a.createdAt
  );
}

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

  // Default: Solana purple, minimal
  return { accentColor: "#9945FF", style: "minimal" };
}

// Seed a demo storefront for testing
const demoStorefront: Storefront = {
  slug: "demo-store",
  businessName: "Paygent Demo Store",
  businessDescription:
    "A demo storefront showing what Paygent can build for your business.",
  walletAddress: "11111111111111111111111111111111", // System program (safe for demo)
  products: [
    {
      id: "prod_demo_1",
      name: "Basic Consultation",
      description: "30-minute strategy session",
      price: 0.1,
      currency: "SOL",
    },
    {
      id: "prod_demo_2",
      name: "Premium Package",
      description: "Full service with deliverables",
      price: 1.0,
      currency: "SOL",
    },
    {
      id: "prod_demo_3",
      name: "Quick Task",
      description: "One-off task completion",
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
