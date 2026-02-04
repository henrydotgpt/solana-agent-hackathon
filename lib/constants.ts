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

// Popular Solana token mints (mainnet)
export const BONK_MINT = new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263");
export const JTO_MINT = new PublicKey("jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL");
export const JUP_MINT = new PublicKey("JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN");
export const WIF_MINT = new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm");
export const PYTH_MINT = new PublicKey("HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3");

// Supported tokens — extended for multi-currency checkout
export const SUPPORTED_TOKENS = [
  {
    symbol: "SOL",
    name: "Solana",
    mint: SOL_MINT.toBase58(),
    decimals: 9,
    icon: "◎",
    color: "#9945FF",
    coingeckoId: "solana",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    mint: USDC_MINT.toBase58(),
    decimals: 6,
    icon: "$",
    color: "#2775CA",
    coingeckoId: "usd-coin",
  },
  {
    symbol: "BONK",
    name: "Bonk",
    mint: BONK_MINT.toBase58(),
    decimals: 5,
    icon: "🐕",
    color: "#F7A12C",
    coingeckoId: "bonk",
  },
  {
    symbol: "JUP",
    name: "Jupiter",
    mint: JUP_MINT.toBase58(),
    decimals: 6,
    icon: "♃",
    color: "#4ADE80",
    coingeckoId: "jupiter-exchange-solana",
  },
  {
    symbol: "JTO",
    name: "Jito",
    mint: JTO_MINT.toBase58(),
    decimals: 9,
    icon: "⚡",
    color: "#8B5CF6",
    coingeckoId: "jito-governance-token",
  },
  {
    symbol: "WIF",
    name: "dogwifhat",
    mint: WIF_MINT.toBase58(),
    decimals: 6,
    icon: "🐶",
    color: "#C4A77D",
    coingeckoId: "dogwifcoin",
  },
  {
    symbol: "PYTH",
    name: "Pyth Network",
    mint: PYTH_MINT.toBase58(),
    decimals: 6,
    icon: "◈",
    color: "#6366F1",
    coingeckoId: "pyth-network",
  },
] as const;

export type TokenSymbol = (typeof SUPPORTED_TOKENS)[number]["symbol"];

// Fees (client-safe — reads from NEXT_PUBLIC_ env vars)
export const PAYGENT_FEE_BPS = parseInt(
  process.env.NEXT_PUBLIC_PAYGENT_FEE_BPS || process.env.PAYGENT_FEE_BPS || "75",
  10
);
export const PAYGENT_FEE_PERCENT = `${(PAYGENT_FEE_BPS / 100).toFixed(2)}%`;
export const PAYGENT_FEE_WALLET =
  process.env.NEXT_PUBLIC_PAYGENT_FEE_WALLET || "";

// Design
export const GRADIENT = {
  primary: "linear-gradient(135deg, #9945FF 0%, #14F195 100%)",
  subtle: "linear-gradient(135deg, rgba(153, 69, 255, 0.1) 0%, rgba(20, 241, 149, 0.1) 100%)",
  text: "linear-gradient(135deg, #9945FF 0%, #14F195 100%)",
};
