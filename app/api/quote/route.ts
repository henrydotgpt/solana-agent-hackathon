import { NextRequest, NextResponse } from "next/server";
import { getSwapQuote } from "@/lib/solana/jupiter";
import { SOL_MINT, USDC_MINT } from "@/lib/constants";
import type { ApiResponse, TokenQuote } from "@/lib/types";

export const dynamic = "force-dynamic";

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

    if (!quote) {
      return NextResponse.json(
        { success: false, error: "Failed to get quote from Jupiter" },
        { status: 502 }
      );
    }

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
