"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-28 sm:pt-32 pb-16 sm:pb-24 overflow-hidden">
      {/* Subtle top glow — only one, not two competing orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-solana-purple/[0.07] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs text-white/40 mb-6">
              <span className="flex h-1.5 w-1.5 rounded-full bg-solana-green animate-pulse" />
              Now live on Solana devnet
            </div>

            <h1 className="text-[2.5rem] sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-5">
              Accept payments.
              <br />
              <span className="text-white/40">Skip the setup.</span>
            </h1>

            <p className="text-base sm:text-lg text-white/45 leading-relaxed mb-8 max-w-md">
              Describe your business in one sentence. Paygent generates a
              complete payment storefront — live and accepting money in under 60
              seconds. No code. No crypto knowledge.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/create">
                <Button
                  variant="gradient"
                  size="lg"
                  className="gap-2 group w-full sm:w-auto"
                >
                  Create storefront
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link href="/pay/demo-store">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white/50 hover:text-white hover:bg-white/[0.04] w-full sm:w-auto"
                >
                  View demo →
                </Button>
              </Link>
            </div>

            {/* Inline stats */}
            <div className="flex items-center gap-6 sm:gap-8 mt-10 pt-8 border-t border-white/[0.06]">
              <Stat value="0.75%" label="Flat fee" />
              <Stat value="~2s" label="Settlement" />
              <Stat value="$0" label="Monthly cost" />
            </div>
          </div>

          {/* Right — product preview */}
          <div className="relative">
            <ProductPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-xl sm:text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-white/30 mt-0.5">{label}</div>
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="relative">
      {/* Glow behind */}
      <div className="absolute -inset-4 bg-solana-purple/[0.06] rounded-3xl blur-2xl pointer-events-none" />

      {/* Browser chrome */}
      <div className="relative rounded-xl border border-white/[0.08] bg-[#0a0a0a] overflow-hidden shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          </div>
          <div className="flex-1 mx-8">
            <div className="h-5 rounded-md bg-white/[0.05] flex items-center justify-center">
              <span className="text-[10px] text-white/20 font-mono">
                paygent.app/pay/dubai-design-studio
              </span>
            </div>
          </div>
        </div>

        {/* Mock storefront content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Store header */}
          <div>
            <div className="text-xs text-white/25 uppercase tracking-widest mb-1">
              Storefront
            </div>
            <div className="text-lg font-semibold text-white">
              Dubai Design Studio
            </div>
            <div className="text-sm text-white/35 mt-0.5">
              Premium branding & web design
            </div>
          </div>

          {/* Product cards */}
          <div className="space-y-2.5">
            <MockProduct
              name="Brand Identity Package"
              price="500 USDC"
              active
            />
            <MockProduct name="Website Design" price="1,200 USDC" />
            <MockProduct name="Social Media Kit" price="300 USDC" />
          </div>

          {/* QR / Pay button area */}
          <div className="pt-3 border-t border-white/[0.06]">
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/25">Powered by Paygent</div>
              <div className="h-8 px-4 rounded-lg bg-solana-green/90 flex items-center">
                <span className="text-xs font-semibold text-black">
                  Pay with Solana
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MockProduct({
  name,
  price,
  active,
}: {
  name: string;
  price: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between p-3.5 rounded-lg border transition-colors ${
        active
          ? "border-solana-green/20 bg-solana-green/[0.04]"
          : "border-white/[0.06] bg-white/[0.02]"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-md ${
            active
              ? "bg-solana-green/20"
              : "bg-white/[0.04]"
          }`}
        />
        <span className="text-sm text-white/70">{name}</span>
      </div>
      <span
        className={`text-sm font-mono ${
          active ? "text-solana-green font-medium" : "text-white/40"
        }`}
      >
        {price}
      </span>
    </div>
  );
}
