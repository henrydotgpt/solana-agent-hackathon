import { NextRequest, NextResponse } from "next/server";
import {
  parseHeliusEvent,
  verifyWebhookSignature,
  type HeliusWebhookEvent,
} from "@/lib/solana/helius";
import {
  getStorefrontByWallet,
  recordPayment,
  addNotification,
} from "@/lib/store";
import { truncateAddress } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * POST /api/webhooks/helius — Receive payment events from Helius
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    // Verify webhook signature
    const signature = request.headers.get("x-helius-signature");
    if (!verifyWebhookSignature(body, signature)) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    const events: HeliusWebhookEvent[] = JSON.parse(body);

    let processed = 0;

    for (const event of events) {
      // Find which storefront this payment belongs to
      const storefronts = getStorefrontByWallet(event.nativeTransfers?.[0]?.toUserAccount || "");

      for (const storefront of storefronts) {
        const parsed = parseHeliusEvent(event, storefront.walletAddress);

        if (parsed) {
          // Record the payment
          recordPayment({
            id: `pay_${parsed.signature.slice(0, 16)}`,
            storefrontSlug: storefront.slug,
            productId: "unknown", // Will match via reference in production
            amount: parsed.amount,
            currency: parsed.type === "sol_transfer" ? "SOL" : "USDC",
            reference: parsed.signature,
            status: "confirmed",
            signature: parsed.signature,
            payer: parsed.from,
            createdAt: parsed.timestamp * 1000,
            confirmedAt: Date.now(),
          });

          // Add notification for the storefront owner
          addNotification(storefront.slug, {
            id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            type: "payment_received",
            title: "Payment Received! 💰",
            message: `${parsed.amount} ${
              parsed.type === "sol_transfer" ? "SOL" : "tokens"
            } from ${truncateAddress(parsed.from)}`,
            signature: parsed.signature,
            timestamp: Date.now(),
            read: false,
          });

          processed++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      processed,
    });
  } catch (error) {
    console.error("Helius webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
