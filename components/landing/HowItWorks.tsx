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
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Three sentences.{" "}
            <span className="gradient-text">One storefront.</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="mx-auto max-w-2xl">
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative flex gap-6 pb-14 last:pb-0"
            >
              {/* Connecting line */}
              {i < steps.length - 1 && (
                <div className="absolute left-6 top-14 w-px h-[calc(100%-3.5rem)] bg-gradient-to-b from-border to-transparent" />
              )}

              {/* Icon */}
              <div
                className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${step.bg} border ${step.border}`}
              >
                <step.icon className={`h-5 w-5 ${step.color}`} />
              </div>

              {/* Content */}
              <div className="pt-0.5">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`text-xs font-mono font-bold ${step.color} opacity-60`}
                  >
                    {step.number}
                  </span>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                </div>

                {step.quote && (
                  <div className="rounded-xl bg-muted/40 border border-border/40 px-5 py-4 mt-2">
                    <p className="text-sm text-muted-foreground italic leading-relaxed">
                      {step.quote}
                    </p>
                  </div>
                )}

                {step.description && (
                  <p className="text-muted-foreground leading-relaxed mt-1">
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
