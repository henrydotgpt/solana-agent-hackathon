"use client";

import React from "react";
import { MessageSquare, Wand2, DollarSign } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    number: "01",
    title: "Tell us about your business.",
    description: null,
    quote:
      '"I\'m a freelance designer in Dubai. I charge $500 per project and offer three packages."',
    color: "text-solana-purple",
    bg: "bg-solana-purple/10",
    border: "border-solana-purple/20",
    iconBg: "from-solana-purple to-blue-500",
  },
  {
    icon: Wand2,
    number: "02",
    title: "Paygent builds everything.",
    description:
      "Product pages. Checkout flow. QR codes. Payment links. Hosted and live — in under 60 seconds.",
    quote: null,
    color: "text-solana-green",
    bg: "bg-solana-green/10",
    border: "border-solana-green/20",
    iconBg: "from-solana-green to-emerald-500",
  },
  {
    icon: DollarSign,
    number: "03",
    title: "Share your link. Get paid.",
    description:
      "Send your Paygent link to clients. They pay in USDC or SOL. Funds land directly in your wallet. Instantly.",
    quote: null,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
    iconBg: "from-yellow-400 to-orange-500",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 relative">
      <div className="mx-auto px-4 sm:px-6 max-w-3xl">
        {/* Section header */}
        <div className="text-center mb-14 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Three sentences.{" "}
            <span className="gradient-text">One storefront.</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="mx-auto max-w-xl">
          {steps.map((step, i) => (
            <div key={i} className="relative flex gap-5 pb-12 last:pb-0">
              {/* Connecting line */}
              {i < steps.length - 1 && (
                <div className="absolute left-6 top-14 w-px h-[calc(100%-3.5rem)] bg-gradient-to-b from-white/[0.08] to-transparent" />
              )}

              {/* Icon */}
              <div
                className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${step.iconBg} shadow-lg`}
              >
                <step.icon className="h-5 w-5 text-white" />
              </div>

              {/* Content */}
              <div className="pt-0.5 flex-1">
                <div className="flex items-baseline gap-3 mb-2">
                  <span
                    className={`text-xs font-mono font-bold ${step.color} opacity-50`}
                  >
                    {step.number}
                  </span>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">
                    {step.title}
                  </h3>
                </div>

                {step.quote && (
                  <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3 mt-2">
                    <p className="text-sm text-white/40 italic leading-relaxed">
                      {step.quote}
                    </p>
                  </div>
                )}

                {step.description && (
                  <p className="text-white/50 leading-relaxed mt-1 text-[15px]">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
