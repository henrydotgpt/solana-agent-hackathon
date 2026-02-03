import { PublicKey } from "@solana/web3.js";

// Network
export const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
export const SOLANA_RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
  (SOLANA_NETWORK === "mainnet-beta"
    ? "https://api.mainnet-beta.solana.com"
    : "https://api.devnet.solana.com");

// Jupiter API
export const JUPITER_API_URL = "https://quote-api.jup.ag/v6";

// Token mints
export const USDC_MINT = new PublicKey(
  SOLANA_NETWORK === "mainnet-beta"
    ? "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" // Mainnet USDC
    : "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"  // Devnet USDC
);

export const SOL_MINT = new PublicKey(
  "So11111111111111111111111111111111111111112"
);

// App metadata
export const APP_NAME = "Paygent";
export const APP_DESCRIPTION =
  "The AI payment agent. Describe your business, get a complete Solana payment storefront. No code. No crypto knowledge needed.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Supported tokens
export const SUPPORTED_TOKENS = [
  {
    symbol: "SOL",
    name: "Solana",
    mint: SOL_MINT.toBase58(),
    decimals: 9,
    icon: "◎",
    color: "#9945FF",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    mint: USDC_MINT.toBase58(),
    decimals: 6,
    icon: "$",
    color: "#2775CA",
  },
] as const;

// Design
export const GRADIENT = {
  primary: "linear-gradient(135deg, #9945FF 0%, #14F195 100%)",
  subtle: "linear-gradient(135deg, rgba(153, 69, 255, 0.1) 0%, rgba(20, 241, 149, 0.1) 100%)",
  text: "linear-gradient(135deg, #9945FF 0%, #14F195 100%)",
};
