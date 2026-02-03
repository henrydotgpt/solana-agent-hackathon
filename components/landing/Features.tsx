"use client";

import React from "react";
import { Reveal } from "@/components/ui/reveal";
import {
  Bot,
  QrCode,
  Shield,
  ArrowRightLeft,
  Bell,
  FileCheck,
  Coins,
  BarChart3,
} from "lucide-react";

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <Reveal>
          <p className="text-xs font-display font-600 uppercase tracking-[0.2em] text-emerald-400/60 mb-5">
            Features
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-800 tracking-tight leading-tight mb-4 max-w-lg">
            Built for how you
            <br />
            actually work.
          </h2>
          <p className="text-lg text-[#6B6B78] max-w-md mb-16">
            Everything a business needs to accept crypto payments. Nothing it
            doesn&apos;t.
          </p>
        </Reveal>

        {/* Bento grid — asymmetric */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Large — 2 cols */}
          <Reveal className="sm:col-span-2">
            <FeatureCard
              icon={Bot}
              title="AI-generated storefronts"
              description="Describe your business. Get product pages, checkout flow, QR codes, and payment links — generated and deployed in under 60 seconds."
              large
            />
          </Reveal>

          <Reveal delay={0.1}>
            <FeatureCard
              icon={Shield}
              title="Non-custodial"
              description="We never touch your money. Direct wallet-to-wallet, always."
            />
          </Reveal>

          <Reveal delay={0.2}>
            <FeatureCard
              icon={QrCode}
              title="QR & pay links"
              description="Share via WhatsApp, email, social — or scan in person."
            />
          </Reveal>

          <Reveal delay={0.1}>
            <FeatureCard
              icon={ArrowRightLeft}
              title="Auto-convert"
              description="Any token → USDC via Jupiter. Stable revenue, zero volatility."
            />
          </Reveal>

          <Reveal delay={0.2}>
            <FeatureCard
              icon={Bell}
              title="Real-time alerts"
              description="Webhooks, email, or Telegram — know instantly when you're paid."
            />
          </Reveal>

          {/* Large — 2 cols */}
          <Reveal delay={0.15} className="sm:col-span-2">
            <FeatureCard
              icon={BarChart3}
              title="Merchant dashboard"
              description="Track every payment, view analytics, manage products, and download on-chain receipts — all from one dashboard built for clarity."
              large
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  large,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  large?: boolean;
}) {
  return (
    <div
      className={`h-full rounded-2xl glass p-6 sm:p-7 group hover:bg-white/[0.04] transition-all duration-300 ${
        large ? "sm:p-8" : ""
      }`}
    >
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.04] group-hover:bg-emerald-500/10 transition-colors mb-4">
        <Icon className="h-5 w-5 text-[#5A5A66] group-hover:text-emerald-400 transition-colors" />
      </div>

      <h3
        className={`font-display font-700 text-white mb-1.5 ${
          large ? "text-lg" : "text-base"
        }`}
      >
        {title}
      </h3>
      <p
        className={`text-[#6B6B78] leading-relaxed ${
          large ? "text-[15px] max-w-md" : "text-sm"
        }`}
      >
        {description}
      </p>
    </div>
  );
}
