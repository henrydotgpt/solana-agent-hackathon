"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Hero background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#08080C]/95 via-[#08080C]/80 to-[#08080C]/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#08080C] via-transparent to-[#08080C]/60" />

      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 sm:px-8 pt-24 pb-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left — copy (7 cols) */}
          <div className="lg:col-span-7">
            {/* Badge */}
            <div className="animate-up inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass text-xs tracking-wide mb-8">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400/80 font-medium">Live on Solana devnet</span>
            </div>

            {/* Headline */}
            <h1 className="animate-up delay-1 font-display text-5xl sm:text-6xl md:text-7xl font-800 tracking-tight leading-[1.05] mb-6">
              Accept payments.
              <br />
              <span className="text-[#6B6B78]">Skip the setup.</span>
            </h1>

            {/* Subtitle */}
            <p className="animate-up delay-2 text-lg sm:text-xl text-[#8A8A96] leading-relaxed max-w-lg mb-10">
              Describe your business in one sentence. Get a complete payment
              storefront — live, hosted, and accepting money in under
              60&nbsp;seconds.
            </p>

            {/* CTA */}
            <div className="animate-up delay-3 flex flex-col sm:flex-row gap-3 mb-12">
              <Link href="/create">
                <Button
                  variant="gradient"
                  size="lg"
                  className="gap-2.5 group w-full sm:w-auto font-display font-600"
                >
                  Create storefront
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link href="/pay/demo-store">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white/[0.08] text-[#8A8A96] hover:text-white hover:bg-white/[0.04] font-display"
                >
                  View live demo
                </Button>
              </Link>
            </div>

            {/* Stats row */}
            <div className="animate-up delay-4 flex items-center gap-8 sm:gap-12">
              <Stat value="0.75%" label="Flat fee" />
              <div className="h-8 w-px bg-white/[0.06]" />
              <Stat value="~2s" label="Settlement" />
              <div className="h-8 w-px bg-white/[0.06]" />
              <Stat value="$0" label="Monthly cost" />
            </div>
          </div>

          {/* Right — product preview (5 cols) */}
          <div className="lg:col-span-5 animate-scale delay-3">
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
      <div className="font-display text-2xl sm:text-3xl font-700 text-white">
        {value}
      </div>
      <div className="text-xs text-[#5A5A66] mt-0.5 uppercase tracking-wider font-medium">
        {label}
      </div>
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="relative">
      {/* Glow */}
      <div className="absolute -inset-8 bg-emerald-500/[0.04] rounded-3xl blur-3xl pointer-events-none" />

      {/* Browser window */}
      <div className="relative rounded-2xl glass overflow-hidden shadow-2xl shadow-black/40">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.04]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 ml-3">
            <div className="h-6 rounded-lg bg-white/[0.04] flex items-center justify-center max-w-[280px] mx-auto">
              <span className="text-[11px] text-[#5A5A66] font-mono">
                paygent.app/pay/dubai-studio
              </span>
            </div>
          </div>
        </div>

        {/* Mock storefront */}
        <div className="p-5 sm:p-6 space-y-5 bg-[#0C0C12]">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/30 to-blue-500/30" />
              <div>
                <div className="text-sm font-display font-600 text-white">
                  Dubai Design Studio
                </div>
                <div className="text-[11px] text-[#5A5A66]">
                  Premium branding & web
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <MockProduct name="Brand Identity" price="500" active />
            <MockProduct name="Website Design" price="1,200" />
            <MockProduct name="Social Kit" price="300" />
          </div>

          <div className="pt-3 border-t border-white/[0.04]">
            <div className="flex items-center justify-between">
              <div className="text-[10px] text-[#3A3A44] tracking-wider uppercase">
                Powered by Paygent
              </div>
              <div className="h-9 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 flex items-center shadow-lg shadow-emerald-500/20">
                <span className="text-xs font-display font-600 text-black">
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
      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
        active
          ? "border-emerald-500/20 bg-emerald-500/[0.04]"
          : "border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.03]"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-7 h-7 rounded-lg ${
            active
              ? "bg-emerald-500/15"
              : "bg-white/[0.04]"
          }`}
        />
        <span className="text-sm text-[#C0C0CC]">{name}</span>
      </div>
      <span
        className={`text-sm font-mono font-500 ${
          active ? "text-emerald-400" : "text-[#5A5A66]"
        }`}
      >
        {price} <span className="text-[10px]">USDC</span>
      </span>
    </div>
  );
}
