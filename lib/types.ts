import type { PublicKey } from "@solana/web3.js";

/**
 * Base payment currencies (what merchants price in)
 */
export type BaseCurrency = "SOL" | "USDC";

/**
 * All supported payment tokens (what payers can use)
 */
export type PaymentToken = "SOL" | "USDC" | "BONK" | "JUP" | "JTO" | "WIF" | "PYTH";

/**
 * A product or service offered on a storefront
 */
export interface StorefrontProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: BaseCurrency;
  image?: string;
}

/**
 * Theme configuration for a storefront
 */
export interface StorefrontTheme {
  accentColor: string;
  style: "minimal" | "bold" | "elegant" | "playful";
}

/**
 * Business links for a storefront
 */
export interface StorefrontLinks {
  website?: string;
  twitter?: string;
  instagram?: string;
  telegram?: string;
  discord?: string;
  email?: string;
  custom?: Array<{ label: string; url: string }>;
}

/**
 * Complete storefront configuration
 */
export interface Storefront {
  slug: string;
  businessName: string;
  businessDescription: string;
  tagline?: string;
  logo?: string; // URL to logo image
  walletAddress: string;
  products: StorefrontProduct[];
  links?: StorefrontLinks;
  theme: StorefrontTheme;
  createdAt: number;
  acceptedTokens: ("SOL" | "USDC")[];
  autoConvertToUSDC: boolean;
}

/**
 * Payment record for tracking
 */
export interface PaymentRecord {
  id: string;
  storefrontSlug: string;
  productId: string;
  amount: number;
  currency: "SOL" | "USDC";
  reference: string; // Base58 public key used as reference
  status: "pending" | "confirmed" | "failed";
  signature?: string;
  payer?: string;
  createdAt: number;
  confirmedAt?: number;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Create storefront request
 */
export interface CreateStorefrontRequest {
  businessName: string;
  businessDescription: string;
  tagline?: string;
  logo?: string;
  walletAddress: string;
  products: Omit<StorefrontProduct, "id">[];
  links?: StorefrontLinks;
  autoConvertToUSDC?: boolean;
}

/**
 * Jupiter quote response (simplified)
 */
export interface TokenQuote {
  inputToken: string;
  outputToken: string;
  inputAmount: number;
  outputAmount: number;
  rate: number;
  priceImpact: string;
}
