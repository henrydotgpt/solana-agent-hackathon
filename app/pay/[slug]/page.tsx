"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WalletButton } from "@/components/payment/WalletButton";
import { ProductCard } from "@/components/payment/ProductCard";
import { PaymentModal } from "@/components/payment/PaymentModal";
import { StorefrontSkeleton } from "@/components/payment/StorefrontSkeleton";
import type { Storefront, StorefrontProduct } from "@/lib/types";
import {
  Zap,
  ArrowRightLeft,
  ShieldCheck,
  ExternalLink,
  AlertCircle,
  BarChart3,
  Globe,
  Mail,
} from "lucide-react";

// Social icons as simple components
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
    </svg>
  );
}

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  twitter: TwitterIcon,
  instagram: InstagramIcon,
  telegram: TelegramIcon,
  discord: DiscordIcon,
  website: Globe as any,
  email: Mail as any,
};

export default function StorefrontPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const isEmbed = searchParams.get("embed") === "1";

  const [storefront, setStorefront] = useState<Storefront | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<StorefrontProduct | null>(null);
  const [solPrice, setSolPrice] = useState<number | null>(null);

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

  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch("/api/quote?amount=1&direction=sol-to-usdc");
        const data = await res.json();
        if (data.success) setSolPrice(data.data.rate);
      } catch {}
    }
    fetchRate();
    const interval = setInterval(fetchRate, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectProduct = useCallback((product: StorefrontProduct) => {
    setSelectedProduct(product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  if (loading) return <StorefrontSkeleton />;

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
  const hasLinks = storefront.links && Object.values(storefront.links).some((v) =>
    typeof v === "string" ? !!v : Array.isArray(v) && v.length > 0
  );

  return (
    <main className={`min-h-screen ${isEmbed ? "bg-[#0c0c10]" : ""}`}>
      {/* Top bar — hidden in embed mode */}
      {!isEmbed && (
        <div className="border-b border-border/40 bg-background/60 backdrop-blur-xl">
          <div className="container mx-auto flex h-14 items-center justify-between px-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>
                Powered by <strong>Paygent</strong>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <Link href={`/dashboard/${slug}`}>
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                  <BarChart3 className="h-3.5 w-3.5" />
                  Dashboard
                </Button>
              </Link>
              <WalletButton />
            </div>
          </div>
        </div>
      )}

      {/* Storefront header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-12 md:py-16 relative overflow-hidden"
      >
        {/* Background accent glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] opacity-10 pointer-events-none"
          style={{ background: accentColor }}
        />

        <div className="container mx-auto px-4 text-center relative">
          {/* Logo or letter avatar */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="mb-6"
          >
            {storefront.logo ? (
              <div className="inline-block rounded-2xl overflow-hidden shadow-xl" style={{ boxShadow: `0 8px 40px ${accentColor}30` }}>
                <img
                  src={storefront.logo}
                  alt={storefront.businessName}
                  className="h-24 w-24 object-cover"
                  onError={(e) => {
                    // Fallback to letter avatar if image fails
                    (e.target as HTMLImageElement).style.display = "none";
                    (e.target as HTMLImageElement).parentElement!.innerHTML = `<div class="h-24 w-24 flex items-center justify-center text-3xl font-bold text-white" style="background: linear-gradient(135deg, ${accentColor}, ${accentColor}88)">${storefront.businessName.charAt(0).toUpperCase()}</div>`;
                  }}
                />
              </div>
            ) : (
              <div
                className="inline-flex h-24 w-24 items-center justify-center rounded-2xl shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
                  boxShadow: `0 8px 40px ${accentColor}30`,
                }}
              >
                <span className="text-3xl font-bold text-white">
                  {storefront.businessName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-2">
            {storefront.businessName}
          </h1>

          {storefront.tagline && (
            <p className="text-lg font-medium mb-3" style={{ color: accentColor }}>
              {storefront.tagline}
            </p>
          )}

          <p className="mx-auto max-w-xl text-lg text-muted-foreground mb-6">
            {storefront.businessDescription}
          </p>

          {/* Social / business links */}
          {hasLinks && (
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              {Object.entries(storefront.links || {}).map(([key, value]) => {
                if (!value || key === "custom") return null;
                const Icon = socialIcons[key] || Globe;
                const href = key === "email" ? `mailto:${value}` : value as string;
                return (
                  <a
                    key={key}
                    href={href}
                    target={key !== "email" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-all"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="capitalize">{key}</span>
                  </a>
                );
              })}
            </div>
          )}

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

      {/* Footer */}
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
