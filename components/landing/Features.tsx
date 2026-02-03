"use client";

import React from "react";
import {
  Bot,
  QrCode,
  Shield,
  ArrowRightLeft,
  Bell,
  FileCheck,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Instant storefronts",
    description:
      "AI generates your entire checkout experience from a text description. Products, pricing, branding — handled.",
    gradient: "from-solana-purple to-blue-500",
    glow: "group-hover:shadow-solana-purple/20",
  },
  {
    icon: QrCode,
    title: "Payment links & QR codes",
    description:
      "Share a link or scan a code. Works everywhere — WhatsApp, email, in person, social media.",
    gradient: "from-blue-500 to-cyan-500",
    glow: "group-hover:shadow-blue-500/20",
  },
  {
    icon: Shield,
    title: "Non-custodial",
    description:
      "We never touch your money. Payments flow directly from customer to your wallet. Your keys, your funds.",
    gradient: "from-cyan-500 to-solana-green",
    glow: "group-hover:shadow-cyan-500/20",
  },
  {
    icon: ArrowRightLeft,
    title: "Auto-convert",
    description:
      "Receive SOL or any token → auto-swap to USDC via Jupiter. Stable revenue, zero volatility risk.",
    gradient: "from-solana-green to-emerald-500",
    glow: "group-hover:shadow-solana-green/20",
  },
  {
    icon: Bell,
    title: "Real-time notifications",
    description:
      "Know the moment you get paid. Webhooks, email, or Telegram — your choice.",
    gradient: "from-emerald-500 to-solana-purple",
    glow: "group-hover:shadow-emerald-500/20",
  },
  {
    icon: FileCheck,
    title: "On-chain receipts",
    description:
      "Every payment generates a verifiable on-chain record. Tax-ready. Dispute-proof. Permanent.",
    gradient: "from-solana-purple to-pink-500",
    glow: "group-hover:shadow-solana-purple/20",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28 relative">
      <div className="mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Section header */}
        <div className="text-center mb-14 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Everything you need.
            <br />
            <span className="gradient-text">Nothing you don&apos;t.</span>
          </h2>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-7 hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300 hover:shadow-xl ${feature.glow}`}
            >
              {/* Icon container */}
              <div
                className={`mb-5 inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300`}
              >
                <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-[15px] text-white/50 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
