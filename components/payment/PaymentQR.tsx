"use client";

import React, { useMemo, useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { motion, AnimatePresence } from "framer-motion";
import { buildPaymentURL, generateReference, verifyPayment } from "@/lib/solana/pay";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, AlertCircle, Loader2 } from "lucide-react";

interface PaymentQRProps {
  recipient: string;
  amount: number;
  label?: string;
  message?: string;
  token?: "SOL" | "USDC";
  splTokenMint?: string;
  onPaymentVerified?: (signature: string) => void;
  size?: number;
}

export function PaymentQR({
  recipient,
  amount,
  label,
  message,
  token = "SOL",
  splTokenMint,
  onPaymentVerified,
  size = 280,
}: PaymentQRProps) {
  const [status, setStatus] = useState<"pending" | "checking" | "confirmed" | "failed">("pending");
  const [signature, setSignature] = useState<string | null>(null);

  const reference = useMemo(() => generateReference(), []);

  const paymentURL = useMemo(() => {
    const recipientPubkey = new PublicKey(recipient);
    const payAmount = new BigNumber(amount);

    return buildPaymentURL({
      recipient: recipientPubkey,
      amount: payAmount,
      label,
      message,
      splToken: splTokenMint ? new PublicKey(splTokenMint) : undefined,
      reference,
    });
  }, [recipient, amount, label, message, splTokenMint, reference]);

  // Poll for payment confirmation
  useEffect(() => {
    if (status === "confirmed") return;

    const interval = setInterval(async () => {
      try {
        setStatus("checking");
        const result = await verifyPayment(
          reference,
          new PublicKey(recipient),
          new BigNumber(amount),
          splTokenMint ? new PublicKey(splTokenMint) : undefined
        );

        if (result.verified && result.signature) {
          setStatus("confirmed");
          setSignature(result.signature);
          onPaymentVerified?.(result.signature);
          clearInterval(interval);
        } else {
          setStatus("pending");
        }
      } catch {
        setStatus("pending");
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [reference, recipient, amount, splTokenMint, status, onPaymentVerified]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* QR Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="qr-container relative"
      >
        <AnimatePresence mode="wait">
          {status === "confirmed" ? (
            <motion.div
              key="confirmed"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center"
              style={{ width: size, height: size }}
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-solana-green/20">
                <Check className="h-10 w-10 text-solana-green" />
              </div>
              <p className="mt-4 text-lg font-semibold text-gray-900">
                Payment Confirmed!
              </p>
            </motion.div>
          ) : (
            <motion.div key="qr">
              <QRCodeSVG
                value={paymentURL}
                size={size}
                level="M"
                bgColor="#FFFFFF"
                fgColor="#1A1A2E"
                imageSettings={{
                  src: "/solana-logo.svg",
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status overlay */}
        {status === "checking" && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-2xl">
            <Loader2 className="h-8 w-8 animate-spin text-solana-purple" />
          </div>
        )}
      </motion.div>

      {/* Status badge */}
      <AnimatePresence mode="wait">
        {status === "pending" && (
          <Badge variant="outline" className="gap-1.5">
            <Clock className="h-3 w-3" />
            Waiting for payment...
          </Badge>
        )}
        {status === "confirmed" && (
          <Badge variant="success" className="gap-1.5">
            <Check className="h-3 w-3" />
            Payment confirmed
          </Badge>
        )}
        {status === "failed" && (
          <Badge variant="destructive" className="gap-1.5">
            <AlertCircle className="h-3 w-3" />
            Payment failed
          </Badge>
        )}
      </AnimatePresence>

      {/* Amount display */}
      <div className="text-center">
        <p className="text-2xl font-bold text-foreground">
          {amount} {token}
        </p>
        {label && (
          <p className="text-sm text-muted-foreground mt-1">{label}</p>
        )}
      </div>

      {/* Transaction link */}
      {signature && (
        <a
          href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-solana-purple hover:text-solana-purple-light transition-colors underline underline-offset-2"
        >
          View on Explorer →
        </a>
      )}
    </div>
  );
}
