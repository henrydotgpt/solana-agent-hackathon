import { NextRequest, NextResponse } from "next/server";
import { getSwapQuote } from "@/lib/solana/jupiter";
import { SOL_MINT, USDC_MINT, SOLANA_NETWORK } from "@/lib/constants";
import type { ApiResponse, TokenQuote } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Fallback: fetch SOL price from CoinGecko (works on devnet where Jupiter doesn't)
 */
async function getFallbackSOLPrice(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    return data?.solana?.usd ?? null;
  } catch {
    return null;
  }
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
 * Simple rate endpoint
 * GET /api/quote?rate=true — Get current SOL/USDC rate
 */
