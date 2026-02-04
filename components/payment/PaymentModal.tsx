"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { PublicKey, Keypair } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Storefront, StorefrontProduct } from "@/lib/types";
import { buildPaymentURL, verifyPayment } from "@/lib/solana/pay";
import { USDC_MINT } from "@/lib/constants";
import { truncateAddress } from "@/lib/utils";
import {
  X,
  Check,
  Clock,
  ExternalLink,
  Copy,
  ArrowRightLeft,
  Info,
} from "lucide-react";

interface PaymentModalProps {
  product: StorefrontProduct;
  storefront: Storefront;
  solPrice: number | null;
  onClose: () => void;
}

type PaymentStatus = "pending" | "confirmed";

interface FeeInfo {
  enabled: boolean;
  platformFeePercent: string;
  platformFeeBps: number;
  breakdown?: {
    totalAmount: number;
    merchantAmount: number;
    feeAmount: number;
  };
}

export function PaymentModal({
  product,
  storefront,
  solPrice,
  onClose,
}: PaymentModalProps) {
  const [status, setStatus] = useState<PaymentStatus>("pending");
  const [signature, setSignature] = useState<string | null>(null);
  const [payToken, setPayToken] = useState<"SOL" | "USDC">(product.currency);
  const [copied, setCopied] = useState(false);
  const [feeInfo, setFeeInfo] = useState<FeeInfo | null>(null);

  // Generate a unique reference for this payment
  const reference = useMemo(() => Keypair.generate().publicKey, []);

  // Fetch fee info
  useEffect(() => {
    async function fetchFees() {
      try {
        const res = await fetch(`/api/fees?amount=${product.price}`);
        const data = await res.json();
        if (data.success) setFeeInfo(data.data);
      } catch {}
    }
    fetchFees();
  }, [product.price]);

  // Build Solana Pay URL — transaction request format
  // Passes the client-side reference so we can verify the payment locally
  const paymentURL = useMemo(() => {
    const appUrl = typeof window !== "undefined" ? window.location.origin : "";
    const txRequestUrl = `${appUrl}/api/pay?slug=${storefront.slug}&product=${product.id}&currency=${payToken}&reference=${reference.toBase58()}`;

    // solana:<url> format for transaction requests
    return `solana:${encodeURIComponent(txRequestUrl)}`;
  }, [storefront.slug, product.id, payToken, reference]);

  // Also build a simple transfer URL as fallback (for wallets that don't support tx requests)
  const fallbackURL = useMemo(() => {
    const recipient = new PublicKey(storefront.walletAddress);
    const amount = new BigNumber(product.price);

    return buildPaymentURL({
      recipient,
      amount,
      label: storefront.businessName,
      message: `Payment for ${product.name}`,
      memo: `paygent:${storefront.slug}:${product.id}`,
      splToken: payToken === "USDC" ? USDC_MINT : undefined,
      reference,
    });
  }, [storefront, product, payToken, reference]);

  // Poll for payment verification
  useEffect(() => {
    if (status === "confirmed") return;

    const interval = setInterval(async () => {
      try {
        const result = await verifyPayment(
          reference,
          new PublicKey(storefront.walletAddress),
          new BigNumber(product.price),
          payToken === "USDC" ? USDC_MINT : undefined
        );

        if (result.verified && result.signature) {
          setStatus("confirmed");
          setSignature(result.signature);
          clearInterval(interval);
        }
      } catch {}
    }, 3000);

    return () => clearInterval(interval);
  }, [reference, storefront.walletAddress, product.price, payToken, status]);

  const handleCopyURL = useCallback(async () => {
    await navigator.clipboard.writeText(fallbackURL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [fallbackURL]);

  const displayUSD =
    payToken === "SOL" && solPrice
      ? `≈ $${(product.price * solPrice).toFixed(2)}`
      : payToken === "USDC"
      ? `= $${product.price.toFixed(2)}`
      : null;

  const feeBreakdown = feeInfo?.breakdown;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative w-full max-w-md rounded-2xl border border-border/50 bg-card shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/50">
          <div>
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-muted-foreground">
              {storefront.businessName}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {status === "confirmed" ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-solana-green/10 mb-4">
                <Check className="h-10 w-10 text-solana-green" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Payment Confirmed!</h3>
              <p className="text-muted-foreground mb-6">
                {product.price} {payToken} sent to{" "}
                {truncateAddress(storefront.walletAddress)}
              </p>
              {signature && (
                <a
                  href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-solana-purple-light hover:text-solana-purple transition-colors"
                >
                  View Transaction
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </motion.div>
          ) : (
            <>
              {/* Token selector */}
              {storefront.acceptedTokens.length > 1 && (
                <div className="flex items-center justify-center gap-2 mb-5">
                  <span className="text-xs text-muted-foreground mr-1">
                    Pay with:
                  </span>
                  {storefront.acceptedTokens.map((token) => (
                    <Button
                      key={token}
                      variant={payToken === token ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPayToken(token)}
                      className={`text-xs h-8 ${
                        payToken === token
                          ? "bg-solana-gradient text-white"
                          : ""
                      }`}
                    >
                      {token === "SOL" ? "◎" : "$"} {token}
                    </Button>
                  ))}
                </div>
              )}

              {/* Auto-convert notice */}
              {storefront.autoConvertToUSDC && payToken === "SOL" && (
                <div className="flex items-center justify-center gap-1.5 mb-4 text-xs text-muted-foreground">
                  <ArrowRightLeft className="h-3 w-3" />
                  Merchant receives USDC via Jupiter auto-convert
                </div>
              )}

              {/* QR Code */}
              <div className="flex justify-center mb-5">
                <div className="qr-container">
                  <QRCodeSVG
                    value={paymentURL}
                    size={220}
                    level="M"
                    bgColor="#FFFFFF"
                    fgColor="#1A1A2E"
                    imageSettings={{
                      src: "/solana-logo.svg",
                      height: 28,
                      width: 28,
                      excavate: true,
                    }}
                  />
                </div>
              </div>

              {/* Amount + fee breakdown */}
              <div className="text-center mb-4">
                <p className="text-3xl font-bold">
                  {payToken === "SOL" ? "◎" : "$"} {product.price}
                  <span className="text-lg text-muted-foreground ml-2">
                    {payToken}
                  </span>
                </p>
                {displayUSD && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {displayUSD}
                  </p>
                )}
              </div>

              {/* Fee disclosure */}
              {feeInfo?.enabled && feeBreakdown && feeBreakdown.feeAmount > 0 && (
                <div className="mb-5 mx-auto max-w-xs rounded-lg border border-border/40 bg-muted/30 p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Info className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">
                      Payment breakdown
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Merchant receives</span>
                      <span className="font-mono">
                        {feeBreakdown.merchantAmount} {payToken}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Platform fee ({feeInfo.platformFeePercent})
                      </span>
                      <span className="font-mono">
                        {feeBreakdown.feeAmount} {payToken}
                      </span>
                    </div>
                    <div className="border-t border-border/40 pt-1 flex justify-between font-medium">
                      <span>Total</span>
                      <span className="font-mono">
                        {feeBreakdown.totalAmount} {payToken}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="flex items-center justify-center gap-2 mb-5">
                <Badge variant="outline" className="gap-1.5">
                  <Clock className="h-3 w-3 animate-pulse" />
                  Waiting for payment...
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyURL}
                  className="gap-2 w-full"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-solana-green" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy Payment Link
                    </>
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Scan QR code with Phantom, Solflare, or any Solana wallet
                </p>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
