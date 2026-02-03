import type { PublicKey } from "@solana/web3.js";

/**
 * A product or service offered on a storefront
 */
export interface StorefrontProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: "SOL" | "USDC";
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
 * Complete storefront configuration
 */
export interface Storefront {
  slug: string;
  businessName: string;
  businessDescription: string;
  walletAddress: string;
  products: StorefrontProduct[];
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
  walletAddress: string;
  products: Omit<StorefrontProduct, "id">[];
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
