"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const features = [
  "AI-generated storefronts",
  "Unlimited products",
  "Payment links & QR codes",
  "Real-time notifications",
  "Auto-convert to USDC",
  "On-chain receipts",
  "Custom branding",
  "Merchant dashboard",
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left — copy */}
          <div className="lg:sticky lg:top-32">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-5">
              Simple pricing.
              <br />
              <span className="text-white/40">No surprises.</span>
            </h2>
            <p className="text-white/40 leading-relaxed mb-8 max-w-md">
              No monthly fees. No setup costs. No minimums. Pay only when you
              get paid.
            </p>

            {/* The price */}
            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl sm:text-6xl font-bold text-white">
                  0.75
                </span>
                <span className="text-2xl font-bold text-white/50">%</span>
              </div>
              <div className="text-sm text-white/30 mt-1">per transaction</div>
            </div>

            <Link href="/create">
              <Button
                variant="gradient"
                size="lg"
                className="gap-2 group"
              >
                Start for free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>

          {/* Right — what's included */}
          <div>
            <div className="text-xs text-white/20 uppercase tracking-wider mb-6">
              Everything included
            </div>
            <div className="space-y-0">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 py-3.5 border-b border-white/[0.04] last:border-0"
                >
                  <Check className="h-4 w-4 text-solana-green shrink-0" />
                  <span className="text-[15px] text-white/60">{feature}</span>
                </div>
              ))}
            </div>

            {/* Comparison note */}
            <div className="mt-8 px-5 py-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-sm text-white/50">
                <span className="text-white/70 font-medium">
                  4x cheaper than Stripe.
                </span>{" "}
                On $10K/month, you save $2,616/year. Instant settlement, not
                2-7 days. No developer required.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
