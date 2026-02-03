"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WalletButton } from "@/components/payment/WalletButton";
import { ProductCard } from "@/components/payment/ProductCard";
import { PaymentModal } from "@/components/payment/PaymentModal";
import { StorefrontSkeleton } from "@/components/payment/StorefrontSkeleton";
import type { Storefront, StorefrontProduct, TokenQuote } from "@/lib/types";
import {
  Zap,
  ArrowRightLeft,
  ShieldCheck,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

export default function StorefrontPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [storefront, setStorefront] = useState<Storefront | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] =
    useState<StorefrontProduct | null>(null);
  const [solPrice, setSolPrice] = useState<number | null>(null);

  // Fetch storefront data
  useEffect(() => {
    async function fetchStorefront() {
      try {
        const res = await fetch(`/api/storefront/${slug}`);
        const data = await res.json();

        if (!data.success) {
          setError(data.error || "Storefront not found");
          return;
        }

        setStorefront(data.data);
      } catch {
        setError("Failed to load storefront");
      } finally {
        setLoading(false);
      }
    }

    fetchStorefront();
  }, [slug]);

  // Fetch SOL/USDC rate
  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch("/api/quote?amount=1&direction=sol-to-usdc");
        const data = await res.json();
        if (data.success) {
          setSolPrice(data.data.rate);
        }
      } catch {
        // Silently fail — rate is optional UI enhancement
      }
    }

    fetchRate();
    // Refresh every 30 seconds
    const interval = setInterval(fetchRate, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectProduct = useCallback((product: StorefrontProduct) => {
    setSelectedProduct(product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  // Loading state
  if (loading) {
    return <StorefrontSkeleton />;
  }

  // Error state
  if (error || !storefront) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-xl font-bold mb-2">Storefront Not Found</h2>
            <p className="text-muted-foreground mb-6">
              {error || "This storefront doesn't exist or has been removed."}
            </p>
            <Link href="/">
              <Button variant="gradient">Back to Paygent</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const accentColor = storefront.theme.accentColor;

  return (
    <main className="min-h-screen">
      {/* Top bar */}
      <div className="border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Powered by <strong>Paygent</strong></span>
            </Link>
          </div>
          <WalletButton />
        </div>
      </div>

      {/* Storefront header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-12 md:py-16"
      >
        <div className="container mx-auto px-4 text-center">
          {/* Business icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="inline-flex h-20 w-20 items-center justify-center rounded-2xl mb-6"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
            }}
          >
            <span className="text-3xl font-bold text-white">
              {storefront.businessName.charAt(0).toUpperCase()}
            </span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3">
            {storefront.businessName}
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground mb-6">
            {storefront.businessDescription}
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge variant="outline" className="gap-1.5">
              <ShieldCheck className="h-3 w-3 text-solana-green" />
              Non-Custodial
            </Badge>
            {storefront.autoConvertToUSDC && (
              <Badge variant="outline" className="gap-1.5">
                <ArrowRightLeft className="h-3 w-3 text-solana-purple-light" />
                Auto-Convert to USDC
              </Badge>
            )}
            <Badge variant="outline" className="gap-1.5">
              <Zap className="h-3 w-3 text-yellow-500" />
              Instant Settlement
            </Badge>
            {solPrice && (
              <Badge variant="outline" className="gap-1.5 font-mono text-xs">
                ◎ 1 SOL ≈ ${solPrice.toFixed(2)}
              </Badge>
            )}
          </div>
        </div>
      </motion.section>

      {/* Products grid */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {storefront.products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <ProductCard
                  product={product}
                  accentColor={accentColor}
                  solPrice={solPrice}
                  onSelect={handleSelectProduct}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer info */}
      <section className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Payments go directly to the merchant&apos;s wallet.{" "}
            <a
              href={`https://explorer.solana.com/address/${storefront.walletAddress}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-solana-purple-light hover:text-solana-purple transition-colors"
            >
              View on Explorer
              <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>
      </section>

      {/* Payment modal */}
      <AnimatePresence>
        {selectedProduct && (
          <PaymentModal
            product={selectedProduct}
            storefront={storefront}
            solPrice={solPrice}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
