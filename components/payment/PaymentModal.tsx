"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { PublicKey, Keypair, Connection, Transaction } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import BigNumber from "bignumber.js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Storefront, StorefrontProduct } from "@/lib/types";
import { buildPaymentURL, verifyPayment } from "@/lib/solana/pay";
import { USDC_MINT, SOLANA_RPC_URL } from "@/lib/constants";
import { truncateAddress } from "@/lib/utils";
import {
  X,
  Check,
  Clock,
  ExternalLink,
  Copy,
  ArrowRightLeft,
  Info,
  Wallet,
  Loader2,
  Smartphone,
} from "lucide-react";

interface PaymentModalProps {
  product: StorefrontProduct;
  storefront: Storefront;
  solPrice: number | null;
  onClose: () => void;
}

type PaymentStatus = "pending" | "signing" | "confirming" | "confirmed" | "error";
type PayMethod = "wallet" | "qr";

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
  const { publicKey, signTransaction, connected } = useWallet();
  const { setVisible: setWalletModalVisible } = useWalletModal();

  const [status, setStatus] = useState<PaymentStatus>("pending");
  const [signature, setSignature] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [payToken, setPayToken] = useState<"SOL" | "USDC">(product.currency);
  const [payMethod, setPayMethod] = useState<PayMethod>(connected ? "wallet" : "qr");
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

  // Build Solana Pay URL for QR code
  const paymentURL = useMemo(() => {
    const appUrl = typeof window !== "undefined" ? window.location.origin : "";
    const txRequestUrl = `${appUrl}/api/pay?slug=${storefront.slug}&product=${product.id}&currency=${payToken}`;
    return `solana:${encodeURIComponent(txRequestUrl)}`;
  }, [storefront.slug, product.id, payToken]);

  // Fallback simple transfer URL
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

  // Direct wallet pay — the key flow for judges
  const handleWalletPay = useCallback(async () => {
    if (!publicKey || !signTransaction) {
      setWalletModalVisible(true);
      return;
    }

    setStatus("signing");
    setErrorMsg(null);

    try {
      // 1. Fetch the transaction from our API
      const res = await fetch(
        `/api/pay?slug=${storefront.slug}&product=${product.id}&currency=${payToken}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ account: publicKey.toBase58() }),
        }
      );

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to build transaction");
      }

      // 2. Deserialize the transaction
      const txBuffer = Buffer.from(data.transaction, "base64");
      const transaction = Transaction.from(txBuffer);

      // 3. Sign with wallet (Phantom popup)
      setStatus("signing");
      const signed = await signTransaction(transaction);

      // 4. Send to network
      setStatus("confirming");
      const connection = new Connection(SOLANA_RPC_URL, "confirmed");
      const sig = await connection.sendRawTransaction(signed.serialize(), {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      });

      // 5. Confirm
      await connection.confirmTransaction(sig, "confirmed");

      setSignature(sig);
      setStatus("confirmed");
    } catch (err: any) {
      console.error("Payment error:", err);
      if (err.message?.includes("User rejected")) {
        setStatus("pending");
      } else {
        setStatus("error");
        setErrorMsg(err.message || "Payment failed");
      }
    }
  }, [publicKey, signTransaction, storefront, product, payToken, setWalletModalVisible]);

  // Poll for QR-based payment verification
  useEffect(() => {
    if (status === "confirmed" || payMethod !== "qr") return;

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
  }, [reference, storefront.walletAddress, product.price, payToken, status, payMethod]);

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
        className="relative w-full max-w-md rounded-2xl border border-white/[0.06] bg-[#0C0C14] shadow-2xl shadow-black/40 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.04]">
          <div>
            <h3 className="font-display font-600 text-white">{product.name}</h3>
            <p className="text-sm text-gray-500">
              {storefront.businessName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.04] transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* ── Confirmed State ── */}
          {status === "confirmed" ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <motion.div
                className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
              >
                <Check className="h-10 w-10 text-emerald-400" />
              </motion.div>
              <h3 className="text-2xl font-display font-800 text-white mb-2">Payment Confirmed!</h3>
              <p className="text-gray-500 mb-6">
                {product.price} {payToken} sent to{" "}
                {truncateAddress(storefront.walletAddress)}
              </p>
              {signature && (
                <a
                  href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  View Transaction
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </motion.div>
          ) : status === "error" ? (
            /* ── Error State ── */
            <div className="text-center py-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 mb-4">
                <X className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-lg font-display font-700 text-white mb-2">Payment Failed</h3>
              <p className="text-sm text-gray-500 mb-4">{errorMsg || "Something went wrong"}</p>
              <Button
                onClick={() => { setStatus("pending"); setErrorMsg(null); }}
                variant="outline"
                className="border-white/[0.08]"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              {/* Token selector */}
              {storefront.acceptedTokens.length > 1 && (
                <div className="flex items-center justify-center gap-2 mb-5">
                  <span className="text-xs text-gray-600 mr-1">Pay with:</span>
                  {storefront.acceptedTokens.map((token) => (
                    <button
                      key={token}
                      onClick={() => setPayToken(token)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-display font-500 transition-all ${
                        payToken === token
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-white/[0.03] text-gray-500 border border-white/[0.06] hover:bg-white/[0.06]"
                      }`}
                    >
                      {token === "SOL" ? "◎" : "$"} {token}
                    </button>
                  ))}
                </div>
              )}

              {/* Auto-convert notice */}
              {storefront.autoConvertToUSDC && payToken === "SOL" && (
                <div className="flex items-center justify-center gap-1.5 mb-4 text-xs text-gray-600">
                  <ArrowRightLeft className="h-3 w-3" />
                  Merchant receives USDC via Jupiter auto-convert
                </div>
              )}

              {/* Amount display */}
              <div className="text-center mb-5">
                <p className="text-3xl font-display font-800 text-white">
                  {payToken === "SOL" ? "◎" : "$"} {product.price}
                  <span className="text-lg text-gray-500 ml-2">{payToken}</span>
                </p>
                {displayUSD && (
                  <p className="text-sm text-gray-600 mt-1">{displayUSD}</p>
                )}
              </div>

              {/* Fee disclosure */}
              {feeInfo?.enabled && feeBreakdown && feeBreakdown.feeAmount > 0 && (
                <div className="mb-5 mx-auto max-w-xs rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Info className="h-3 w-3 text-gray-600" />
                    <span className="text-xs font-display font-500 text-gray-500">Payment breakdown</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Merchant receives</span>
                      <span className="font-mono text-gray-400">{feeBreakdown.merchantAmount} {payToken}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform fee ({feeInfo.platformFeePercent})</span>
                      <span className="font-mono text-gray-400">{feeBreakdown.feeAmount} {payToken}</span>
                    </div>
                    <div className="border-t border-white/[0.04] pt-1 flex justify-between font-500">
                      <span className="text-gray-400">Total</span>
                      <span className="font-mono text-white">{feeBreakdown.totalAmount} {payToken}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Pay method tabs */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/[0.04] mb-5">
                <button
                  onClick={() => setPayMethod("wallet")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-display font-500 transition-all ${
                    payMethod === "wallet"
                      ? "bg-white/[0.06] text-white border border-white/[0.08]"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <Wallet className="h-3.5 w-3.5" />
                  Pay with Wallet
                </button>
                <button
                  onClick={() => setPayMethod("qr")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-display font-500 transition-all ${
                    payMethod === "qr"
                      ? "bg-white/[0.06] text-white border border-white/[0.08]"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  QR Code
                </button>
              </div>

              {payMethod === "wallet" ? (
                /* ── Wallet Pay ── */
                <div className="space-y-3">
                  {status === "signing" ? (
                    <div className="text-center py-6">
                      <Loader2 className="h-8 w-8 text-emerald-400 animate-spin mx-auto mb-3" />
                      <p className="text-sm text-gray-400 font-display">Approve in your wallet...</p>
                      <p className="text-xs text-gray-600 mt-1">Check your Phantom popup</p>
                    </div>
                  ) : status === "confirming" ? (
                    <div className="text-center py-6">
                      <Loader2 className="h-8 w-8 text-purple-400 animate-spin mx-auto mb-3" />
                      <p className="text-sm text-gray-400 font-display">Confirming on Solana...</p>
                      <p className="text-xs text-gray-600 mt-1">Usually ~2 seconds</p>
                    </div>
                  ) : connected ? (
                    <Button
                      onClick={handleWalletPay}
                      className="w-full h-12 gap-2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-display font-600 text-sm hover:from-emerald-400 hover:to-emerald-300 shadow-lg shadow-emerald-500/20 rounded-xl"
                    >
                      <Wallet className="h-4 w-4" />
                      Pay {product.price} {payToken}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setWalletModalVisible(true)}
                      className="w-full h-12 gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-display font-600 text-sm hover:from-purple-400 hover:to-blue-400 shadow-lg shadow-purple-500/20 rounded-xl"
                    >
                      <Wallet className="h-4 w-4" />
                      Connect Wallet to Pay
                    </Button>
                  )}
                  <p className="text-center text-[11px] text-gray-700">
                    Supports Phantom, Solflare, and other Solana wallets
                  </p>
                </div>
              ) : (
                /* ── QR Code Pay ── */
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <div className="p-3 rounded-2xl bg-white">
                      <QRCodeSVG
                        value={paymentURL}
                        size={200}
                        level="M"
                        bgColor="#FFFFFF"
                        fgColor="#1A1A2E"
                        imageSettings={{
                          src: "/solana-logo.svg",
                          height: 24,
                          width: 24,
                          excavate: true,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="outline" className="gap-1.5 border-white/[0.06] text-gray-500">
                      <Clock className="h-3 w-3 animate-pulse text-emerald-400" />
                      Waiting for payment...
                    </Badge>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyURL}
                    className="gap-2 w-full border-white/[0.06] text-gray-400"
                  >
                    {copied ? (
                      <><Check className="h-3.5 w-3.5 text-emerald-400" /> Copied!</>
                    ) : (
                      <><Copy className="h-3.5 w-3.5" /> Copy Payment Link</>
                    )}
                  </Button>
                  <p className="text-center text-[11px] text-gray-700">
                    Scan with Phantom, Solflare, or any Solana wallet
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
