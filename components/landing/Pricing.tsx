"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { ArrowRight, Check } from "lucide-react";

const included = [
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
    <section id="pricing" className="py-24 sm:py-32 relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left — the price */}
          <div>
            <Reveal>
              <p className="text-xs font-display font-600 uppercase tracking-[0.2em] text-emerald-400/60 mb-5">
                Pricing
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-800 tracking-tight leading-tight mb-5">
                Simple pricing.
                <br />
                <span className="text-[#3A3A44]">No surprises.</span>
              </h2>
              <p className="text-lg text-[#6B6B78] leading-relaxed mb-10 max-w-md">
                No monthly fees. No setup costs. No minimums. You only pay when
                your customers pay you.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              {/* Price display */}
              <div className="mb-10">
                <div className="flex items-baseline">
                  <span className="font-display text-7xl sm:text-8xl font-800 text-white">
                    0.75
                  </span>
                  <span className="font-display text-3xl font-700 text-[#3A3A44] ml-1">
                    %
                  </span>
                </div>
                <div className="text-sm text-[#5A5A66] mt-1 font-display">
                  per transaction · that&apos;s it
                </div>
              </div>

              <Link href="/create">
                <Button
                  variant="gradient"
                  size="lg"
                  className="gap-2.5 group font-display font-600"
                >
                  Start for free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
            </Reveal>
          </div>

          {/* Right — included features */}
          <Reveal delay={0.1}>
            <div className="rounded-2xl glass p-7 sm:p-8">
              <div className="text-xs font-display font-600 uppercase tracking-[0.15em] text-[#5A5A66] mb-6">
                Everything included
              </div>

              <div className="space-y-0">
                {included.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3.5 py-3.5 border-b border-white/[0.04] last:border-0"
                  >
                    <div className="flex items-center justify-center w-5 h-5 rounded-md bg-emerald-500/10">
                      <Check className="h-3 w-3 text-emerald-400" />
                    </div>
                    <span className="text-[15px] text-[#B0B0BC]">{item}</span>
                  </div>
                ))}
              </div>

              {/* Comparison callout */}
              <div className="mt-6 pt-5 border-t border-white/[0.06]">
                <p className="text-sm text-[#6B6B78]">
                  <span className="text-white font-display font-600">
                    4× cheaper than Stripe.
                  </span>{" "}
                  On $10K/month volume, you save $2,616/year. Instant
                  settlement. No developer required.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
