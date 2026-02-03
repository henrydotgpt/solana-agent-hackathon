"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  },
  {
    icon: QrCode,
    title: "Payment links & QR codes",
    description:
      "Share a link or scan a code. Works everywhere — WhatsApp, email, in person, social media.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "Non-custodial",
    description:
      "We never touch your money. Payments flow directly from customer to your wallet. Your keys, your funds.",
    gradient: "from-cyan-500 to-solana-green",
  },
  {
    icon: ArrowRightLeft,
    title: "Auto-convert",
    description:
      "Receive SOL or any token → auto-swap to USDC via Jupiter. Stable revenue, zero volatility risk.",
    gradient: "from-solana-green to-emerald-500",
  },
  {
    icon: Bell,
    title: "Real-time notifications",
    description:
      "Know the moment you get paid. Webhooks, email, or Telegram — your choice.",
    gradient: "from-emerald-500 to-solana-purple",
  },
  {
    icon: FileCheck,
    title: "On-chain receipts",
    description:
      "Every payment generates a verifiable on-chain record. Tax-ready. Dispute-proof. Permanent.",
    gradient: "from-solana-purple to-pink-500",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Everything you need.
            <br />
            <span className="gradient-text">Nothing you don&apos;t.</span>
          </h2>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto stagger-children">
          {features.map((feature, i) => (
            <div key={i}>
              <Card className="h-full group hover:border-border hover:bg-card/80 cursor-default transition-colors duration-200">
                <CardContent className="p-6">
                  {/* Icon */}
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
