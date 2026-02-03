import { NextRequest, NextResponse } from "next/server";
import { PublicKey, Keypair } from "@solana/web3.js";
import {
  buildSOLPaymentTransaction,
  buildUSDCPaymentTransaction,
  calculateFees,
} from "@/lib/solana/fees";
import { getStorefront, recordPayment } from "@/lib/store";
import { isValidSolanaAddress } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * GET /api/pay — Return transaction request metadata (Solana Pay spec)
 * Used by wallets to display payment info before signing
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const productId = searchParams.get("product");

  if (!slug) {
    return NextResponse.json({ label: "Paygent", icon: "" });
  }

  const storefront = getStorefront(slug);
  if (!storefront) {
    return NextResponse.json({ label: "Paygent", icon: "" });
  }

  const product = storefront.products.find((p) => p.id === productId);

  return NextResponse.json({
    label: storefront.businessName,
    icon: `${process.env.NEXT_PUBLIC_APP_URL || "https://paygent.app"}/solana-logo.svg`,
    ...(product && {
      message: `Payment for ${product.name} — ${product.price} ${product.currency}`,
    }),
  });
}

/**
 * POST /api/pay — Build and return the payment transaction
 * Solana Pay transaction request: wallet POSTs { account }, we return { transaction, message }
 */
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const productId = searchParams.get("product");
    const currency = (searchParams.get("currency") || "SOL").toUpperCase();

    const body = await request.json();
    const payerAddress = body.account;

    // Validate payer
    if (!payerAddress || !isValidSolanaAddress(payerAddress)) {
      return NextResponse.json(
        { error: "Invalid payer account" },
        { status: 400 }
      );
    }

    // Get storefront
    if (!slug) {
      return NextResponse.json(
        { error: "Storefront slug required" },
        { status: 400 }
      );
    }

    const storefront = getStorefront(slug);
    if (!storefront) {
      return NextResponse.json(
        { error: "Storefront not found" },
        { status: 404 }
      );
    }

    // Get product
    const product = productId
      ? storefront.products.find((p) => p.id === productId)
      : null;

    if (productId && !product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const amount = product ? product.price : 0;
    if (amount <= 0) {
      return NextResponse.json(
        { error: "Invalid payment amount" },
        { status: 400 }
      );
    }

    const payer = new PublicKey(payerAddress);
    const merchant = new PublicKey(storefront.walletAddress);
    const reference = Keypair.generate().publicKey;
    const memo = `paygent:${slug}:${productId || "custom"}`;

    let result;

    if (currency === "USDC") {
      result = await buildUSDCPaymentTransaction({
        payer,
        merchant,
        amount,
        reference,
        memo,
      });
    } else {
      result = await buildSOLPaymentTransaction({
        payer,
        merchant,
        amount,
        reference,
        memo,
      });
    }

    const { transaction, fees } = result;

    // Record pending payment
    recordPayment({
      id: `pay_${reference.toBase58().slice(0, 16)}`,
      storefrontSlug: slug,
      productId: productId || "custom",
      amount: fees.totalAmount,
      currency: currency as "SOL" | "USDC",
      reference: reference.toBase58(),
      status: "pending",
      payer: payerAddress,
      createdAt: Date.now(),
    });

    // Serialize transaction
    const serialized = transaction
      .serialize({ requireAllSignatures: false })
      .toString("base64");

    return NextResponse.json({
      transaction: serialized,
      message: `Payment for ${product?.name || "custom"} — ${fees.merchantAmount} ${currency} to merchant${
        fees.feeAmount > 0
          ? ` + ${fees.feeAmount} ${currency} platform fee`
          : ""
      }`,
    });
  } catch (error: any) {
    console.error("Payment transaction build error:", error?.message, error?.stack?.split("\n").slice(0, 5).join("\n"));
    return NextResponse.json(
      { 
        error: error.message || "Failed to build transaction",
        detail: process.env.NODE_ENV === "development" ? error.stack?.split("\n").slice(0, 3) : undefined,
      },
      { status: 500 }
    );
  }
}
