/**
 * Helius webhook integration for real-time payment monitoring
 *
 * Helius sends POST requests to our webhook endpoint when transactions
 * matching our watched addresses are confirmed on-chain.
 */

import { SOLANA_NETWORK } from "../constants";

const HELIUS_API_URL = "https://api.helius.xyz/v0";

export interface HeliusWebhookEvent {
  accountData: Array<{
    account: string;
    nativeBalanceChange: number;
    tokenBalanceChanges: Array<{
      mint: string;
      rawTokenAmount: {
        decimals: number;
        tokenAmount: string;
      };
      tokenAccount: string;
      userAccount: string;
    }>;
  }>;
  description: string;
  events: Record<string, unknown>;
  fee: number;
  feePayer: string;
  nativeTransfers: Array<{
    amount: number;
    fromUserAccount: string;
    toUserAccount: string;
  }>;
  signature: string;
  slot: number;
  source: string;
  timestamp: number;
  tokenTransfers: Array<{
    fromTokenAccount: string;
    fromUserAccount: string;
    mint: string;
    toTokenAccount: string;
    toUserAccount: string;
    tokenAmount: number;
    tokenStandard: string;
  }>;
  type: string;
}

export interface ParsedPaymentEvent {
  signature: string;
  timestamp: number;
  type: "sol_transfer" | "token_transfer";
  from: string;
  to: string;
  amount: number;
  mint?: string;
  slot: number;
}

/**
 * Parse a Helius webhook event into our payment format
 */
export function parseHeliusEvent(
  event: HeliusWebhookEvent,
  watchedAddress: string
): ParsedPaymentEvent | null {
  // Check native SOL transfers
  for (const transfer of event.nativeTransfers || []) {
    if (
      transfer.toUserAccount === watchedAddress &&
      transfer.amount > 0
    ) {
      return {
        signature: event.signature,
        timestamp: event.timestamp,
        type: "sol_transfer",
        from: transfer.fromUserAccount,
        to: transfer.toUserAccount,
        amount: transfer.amount / 1e9, // Convert lamports to SOL
        slot: event.slot,
      };
    }
  }

  // Check SPL token transfers
  for (const transfer of event.tokenTransfers || []) {
    if (
      transfer.toUserAccount === watchedAddress &&
      transfer.tokenAmount > 0
    ) {
      return {
        signature: event.signature,
        timestamp: event.timestamp,
        type: "token_transfer",
        from: transfer.fromUserAccount,
        to: transfer.toUserAccount,
        amount: transfer.tokenAmount,
        mint: transfer.mint,
        slot: event.slot,
      };
    }
  }

  return null;
}

/**
 * Register a webhook with Helius to watch an address
 */
export async function registerWebhook(
  walletAddress: string,
  webhookUrl: string
): Promise<{ webhookId: string } | null> {
  const apiKey = process.env.HELIUS_API_KEY;
  if (!apiKey) {
    console.warn("HELIUS_API_KEY not set — webhook registration skipped");
    return null;
  }

  try {
    const response = await fetch(
      `${HELIUS_API_URL}/webhooks?api-key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookURL: webhookUrl,
          transactionTypes: ["TRANSFER", "SWAP"],
          accountAddresses: [walletAddress],
          webhookType: "enhanced",
          txnStatus: "success",
        }),
      }
    );

    if (!response.ok) {
      console.error("Helius webhook registration failed:", await response.text());
      return null;
    }

    const data = await response.json();
    return { webhookId: data.webhookID };
  } catch (error) {
    console.error("Helius webhook registration error:", error);
    return null;
  }
}

/**
 * Verify the Helius webhook signature (if secret is configured)
 */
export function verifyWebhookSignature(
  body: string,
  signature: string | null
): boolean {
  const secret = process.env.HELIUS_WEBHOOK_SECRET;

  // If no secret configured, skip verification (dev mode)
  if (!secret) return true;
  if (!signature) return false;

  // Helius uses HMAC-SHA256
  const crypto = require("crypto");
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSig)
  );
}
