import { NextResponse } from "next/server";
import {
  calculateFees,
  PLATFORM_FEE_BPS,
  SWAP_SPREAD_BPS,
  FEE_ROUTING_ENABLED,
} from "@/lib/solana/fees";

/**
 * GET /api/fees — Return fee info for a given amount
 * Query params: amount (number)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const amount = parseFloat(searchParams.get("amount") || "0");

  const breakdown = calculateFees(amount > 0 ? amount : 1);

  return NextResponse.json({
    success: true,
    data: {
      enabled: FEE_ROUTING_ENABLED,
      platformFeeBps: PLATFORM_FEE_BPS,
      platformFeePercent: `${(PLATFORM_FEE_BPS / 100).toFixed(2)}%`,
      swapSpreadBps: SWAP_SPREAD_BPS,
      swapSpreadPercent: `${(SWAP_SPREAD_BPS / 100).toFixed(1)}%`,
      ...(amount > 0 && {
        breakdown: {
          totalAmount: breakdown.totalAmount,
          merchantAmount: breakdown.merchantAmount,
          feeAmount: breakdown.feeAmount,
        },
      }),
    },
  });
}
