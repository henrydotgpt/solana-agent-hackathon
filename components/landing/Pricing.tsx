"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionGlow } from "@/components/ui/gradient-mesh";
import { ArrowRight, Check, X } from "lucide-react";

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

const comparison = [
  { feature: "Setup time", paygent: "60 seconds", stripe: "Hours/days", paygentWins: true },
  { feature: "Transaction fee", paygent: "0.75%", stripe: "2.9% + 30¢", paygentWins: true },
  { feature: "Settlement", paygent: "~2 seconds", stripe: "2-7 days", paygentWins: true },
  { feature: "Monthly fee", paygent: "Free", stripe: "Free", paygentWins: false },
  { feature: "Developer needed", paygent: "No", stripe: "Yes", paygentWins: true },
  { feature: "Chargebacks", paygent: "None", stripe: "Yes + fees", paygentWins: true },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-28 sm:py-36 relative overflow-hidden">
      <div className="section-divider absolute top-0 inset-x-0" />
      <SectionGlow color="green" position="center" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          {/* Left — The price + comparison */}
          <div>
            <Reveal>
              <p className="text-xs font-display font-600 uppercase tracking-[0.2em] text-emerald-400/60 mb-5">
                Pricing
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-800 tracking-tight leading-tight mb-6">
                Simple pricing.
                <br />
                <span className="text-gray-600">No surprises.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.15}>
              {/* Giant price display */}
              <div className="mb-10 relative">
                <div className="absolute -inset-8 bg-emerald-500/[0.04] rounded-3xl blur-3xl pointer-events-none" />
                <div className="relative">
                  <div className="flex items-baseline">
                    <span className="font-display text-8xl sm:text-9xl font-800 text-white leading-none">
                      0.75
                    </span>
                    <span className="font-display text-3xl font-700 text-gray-600 ml-1">
                      %
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-2 font-display">
                    per transaction · that&apos;s it
                  </div>
                </div>
              </div>

              <Link href="/create">
                <Button
                  variant="gradient"
                  size="lg"
                  className="gap-2.5 group font-display font-600 text-base px-8"
                >
                  Start for free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </Reveal>

            {/* Comparison table */}
            <Reveal delay={0.3}>
              <div className="mt-14">
                <div className="text-xs font-display font-600 uppercase tracking-wider text-gray-600 mb-4">
                  Paygent vs Stripe
                </div>
                <div className="rounded-xl border border-white/[0.08] overflow-hidden">
                  <div className="grid grid-cols-3 gap-0 text-[11px] font-display font-600 uppercase tracking-wider text-gray-600 bg-white/[0.04] px-4 py-3 border-b border-white/[0.08]">
                    <div>Feature</div>
                    <div className="text-emerald-400/70">Paygent</div>
                    <div>Stripe</div>
                  </div>
                  {comparison.map((row, i) => (
                    <div
                      key={row.feature}
                      className="grid grid-cols-3 gap-0 text-sm px-4 py-3 border-b border-white/[0.08] last:border-0"
                    >
                      <div className="text-gray-500">{row.feature}</div>
                      <div className={row.paygentWins ? "text-emerald-400 font-500" : "text-gray-400"}>
                        {row.paygent}
                      </div>
                      <div className="text-gray-600">{row.stripe}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right — Features included */}
          <Reveal delay={0.1}>
            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-white/[0.06] bg-[#0D0D18]/90 p-7 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-xs font-display font-600 uppercase tracking-[0.15em] text-gray-500">
                    Everything included
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-[10px] font-display font-600 text-emerald-400">
                    FREE
                  </div>
                </div>

                <div className="space-y-0">
                  {included.map((item, i) => (
                    <motion.div
                      key={item}
                      className="flex items-center gap-3.5 py-3.5 border-b border-white/[0.08] last:border-0"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                    >
                      <div className="flex items-center justify-center w-5 h-5 rounded-md bg-emerald-500/10">
                        <Check className="h-3 w-3 text-emerald-400" />
                      </div>
                      <span className="text-[15px] text-gray-300">{item}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-white/[0.06]">
                  <p className="text-sm text-gray-500">
                    <span className="text-white font-display font-600">
                      No hidden fees.
                    </span>{" "}
                    No monthly charges. No setup costs. You only pay when your
                    customers pay you.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
