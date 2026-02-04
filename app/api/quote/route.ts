import { NextRequest, NextResponse } from "next/server";
import { getSwapQuote } from "@/lib/solana/jupiter";
import { SOL_MINT, USDC_MINT, SOLANA_NETWORK, SUPPORTED_TOKENS } from "@/lib/constants";
import type { ApiResponse, TokenQuote } from "@/lib/types";

export const dynamic = "force-dynamic";

// In-memory cache for CoinGecko rates (60s TTL)
let rateCache: { data: Record<string, number>; ts: number } | null = null;
const CACHE_TTL = 60_000;

/**
 * Fetch all supported token prices from CoinGecko
 */
async function getTokenPrices(): Promise<Record<string, number>> {
  if (rateCache && Date.now() - rateCache.ts < CACHE_TTL) {
    return rateCache.data;
  }

  try {
    const ids = SUPPORTED_TOKENS.map((t) => t.coingeckoId).join(",");
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
      { next: { revalidate: 60 } }
    );
    const raw = await res.json();

    const prices: Record<string, number> = {};
    for (const token of SUPPORTED_TOKENS) {
      if (raw[token.coingeckoId]?.usd) {
        prices[token.symbol] = raw[token.coingeckoId].usd;
      }
    }
    // USDC is always $1 fallback
    if (!prices["USDC"]) prices["USDC"] = 1;

    rateCache = { data: prices, ts: Date.now() };
    return prices;
  } catch {
    return rateCache?.data || { USDC: 1 };
  }
}

/**
 * Fallback: fetch SOL price from CoinGecko (works on devnet where Jupiter doesn't)
 */
async function getFallbackSOLPrice(): Promise<number | null> {
  const prices = await getTokenPrices();
  return prices["SOL"] ?? null;
}

/**
 * GET /api/quote — Get Jupiter swap quote
 * Query params: amount (in SOL), inputMint, outputMint
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<TokenQuote>>> {
  try {
    const { searchParams } = new URL(request.url);

    // Multi-token rates endpoint
    if (searchParams.get("tokens") === "true") {
      return handleTokensRequest(request) as any;
    }

    const amountStr = searchParams.get("amount");
    const direction = searchParams.get("direction") || "sol-to-usdc";

    if (!amountStr) {
      return NextResponse.json(
        { success: false, error: "Amount is required" },
        { status: 400 }
      );
    }

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid amount" },
        { status: 400 }
      );
    }

    let inputMint: string;
    let outputMint: string;
    let baseAmount: number;
    let inputDecimals: number;
    let outputDecimals: number;

    if (direction === "sol-to-usdc") {
      inputMint = SOL_MINT.toBase58();
      outputMint = USDC_MINT.toBase58();
      baseAmount = amount * 1e9; // SOL has 9 decimals
      inputDecimals = 9;
      outputDecimals = 6;
    } else if (direction === "usdc-to-sol") {
      inputMint = USDC_MINT.toBase58();
      outputMint = SOL_MINT.toBase58();
      baseAmount = amount * 1e6; // USDC has 6 decimals
      inputDecimals = 6;
      outputDecimals = 9;
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid direction. Use sol-to-usdc or usdc-to-sol" },
        { status: 400 }
      );
    }

    const quote = await getSwapQuote(inputMint, outputMint, baseAmount);

    if (quote) {
      const inputAmount = Number(quote.inAmount) / Math.pow(10, inputDecimals);
      const outputAmount = Number(quote.outAmount) / Math.pow(10, outputDecimals);

      const tokenQuote: TokenQuote = {
        inputToken: direction === "sol-to-usdc" ? "SOL" : "USDC",
        outputToken: direction === "sol-to-usdc" ? "USDC" : "SOL",
        inputAmount,
        outputAmount,
        rate: outputAmount / inputAmount,
        priceImpact: quote.priceImpactPct,
      };

      return NextResponse.json({ success: true, data: tokenQuote });
    }

    // Fallback: Jupiter doesn't work on devnet — use CoinGecko price
    const solPrice = await getFallbackSOLPrice();
    if (solPrice) {
      const tokenQuote: TokenQuote =
        direction === "sol-to-usdc"
          ? {
              inputToken: "SOL",
              outputToken: "USDC",
              inputAmount: amount,
              outputAmount: amount * solPrice,
              rate: solPrice,
              priceImpact: "0",
            }
          : {
              inputToken: "USDC",
              outputToken: "SOL",
              inputAmount: amount,
              outputAmount: amount / solPrice,
              rate: 1 / solPrice,
              priceImpact: "0",
            };

      return NextResponse.json({ success: true, data: tokenQuote });
    }

    return NextResponse.json(
      { success: false, error: "Failed to get quote" },
      { status: 502 }
    );
  } catch (error) {
    console.error("Quote error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch quote" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/quote?tokens=true — Get all supported token prices + conversion rates
 * Optional: &base=SOL&amount=1 — conversion amounts for a specific product
 */
async function handleTokensRequest(
  request: NextRequest
): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const base = searchParams.get("base") || "SOL";
    const amount = parseFloat(searchParams.get("amount") || "1");

    const prices = await getTokenPrices();
    const basePrice = prices[base] || prices["SOL"] || 1;
    const productUsdValue = amount * basePrice;

    const tokens = SUPPORTED_TOKENS.map((token) => {
      const usdPrice = prices[token.symbol] || 0;
      return {
        symbol: token.symbol,
        name: token.name,
        icon: token.icon,
        color: token.color,
        usdPrice,
        conversionAmount:
          token.symbol === base
            ? amount
            : usdPrice > 0
            ? productUsdValue / usdPrice
            : null,
      };
    });

    return NextResponse.json({
      success: true,
      data: { base, amount, tokens, updatedAt: Date.now() },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch token prices" },
      { status: 500 }
    );
  }
}

/**
 * Simple rate endpoint
 * GET /api/quote?rate=true — Get current SOL/USDC rate
 */
