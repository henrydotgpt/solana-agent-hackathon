"use client";

import React from "react";
import { Check, X, Zap } from "lucide-react";

const processors = [
  {
    name: "Stripe",
    fee: "$29.30",
    annual: "$3,516",
    settlement: "2-7 days",
    setup: "Developer required",
    highlight: false,
  },
  {
    name: "PayPal",
    fee: "$34.90",
    annual: "$4,188",
    settlement: "1-3 days",
    setup: "Manual config",
    highlight: false,
  },
  {
    name: "Square",
    fee: "$26.30",
    annual: "$3,156",
    settlement: "1-2 days",
    setup: "Hardware needed",
    highlight: false,
  },
  {
    name: "Paygent",
    fee: "$7.50",
    annual: "$900",
    settlement: "Instant",
    setup: "One sentence",
    highlight: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-28 relative">
      <div className="mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Section header */}
        <div className="text-center mb-14 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Stop overpaying{" "}
            <span className="gradient-text">for payments.</span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Fee comparison on $1,000 in transactions
          </p>
        </div>

        {/* Desktop comparison table */}
        <div className="mx-auto max-w-4xl hidden md:block">
          <div className="rounded-2xl border border-white/[0.06] overflow-hidden bg-white/[0.01]">
            {/* Header row */}
            <div className="grid grid-cols-5 text-xs uppercase tracking-wider font-medium text-white/30 bg-white/[0.02]">
              <div className="px-6 py-4">Processor</div>
              <div className="px-6 py-4">Fee on $1,000</div>
              <div className="px-6 py-4">Annual ($10K/mo)</div>
              <div className="px-6 py-4">Settlement</div>
              <div className="px-6 py-4">Setup</div>
            </div>

            {/* Data rows */}
            {processors.map((proc) => (
              <div
                key={proc.name}
                className={`grid grid-cols-5 border-t transition-colors ${
                  proc.highlight
                    ? "border-solana-green/20 bg-solana-green/[0.04]"
                    : "border-white/[0.04] hover:bg-white/[0.02]"
                }`}
              >
                <div className="px-6 py-4 font-semibold text-white flex items-center gap-2.5">
                  {proc.highlight && (
                    <span className="flex h-2 w-2 rounded-full bg-solana-green shadow-lg shadow-solana-green/50" />
                  )}
                  {proc.name}
                </div>
                <div
                  className={`px-6 py-4 font-mono text-sm ${
                    proc.highlight
                      ? "text-solana-green font-bold"
                      : "text-white/50"
                  }`}
                >
                  {proc.fee}
                </div>
                <div
                  className={`px-6 py-4 font-mono text-sm ${
                    proc.highlight
                      ? "text-solana-green font-bold"
                      : "text-white/50"
                  }`}
                >
                  {proc.annual}
                </div>
                <div
                  className={`px-6 py-4 text-sm ${
                    proc.highlight
                      ? "text-solana-green font-medium"
                      : "text-white/50"
                  }`}
                >
                  {proc.settlement}
                </div>
                <div
                  className={`px-6 py-4 text-sm ${
                    proc.highlight
                      ? "text-solana-green font-medium"
                      : "text-white/50"
                  }`}
                >
                  {proc.setup}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile comparison cards */}
        <div className="md:hidden space-y-3 max-w-sm mx-auto">
          {processors.map((proc) => (
            <div
              key={proc.name}
              className={`relative rounded-2xl border p-5 transition-all ${
                proc.highlight
                  ? "border-solana-green/30 bg-solana-green/[0.04] shadow-lg shadow-solana-green/10"
                  : "border-white/[0.06] bg-white/[0.02]"
              }`}
            >
              {/* Recommended badge */}
              {proc.highlight && (
                <div className="absolute -top-3 left-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-solana-green text-black text-xs font-bold">
                  <Zap className="h-3 w-3" />
                  Best value
                </div>
              )}

              {/* Card header */}
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`font-bold text-lg ${
                    proc.highlight ? "text-white" : "text-white/70"
                  }`}
                >
                  {proc.name}
                </h3>
                <span
                  className={`font-mono text-xl font-bold ${
                    proc.highlight ? "text-solana-green" : "text-white/40"
                  }`}
                >
                  {proc.fee}
                </span>
              </div>

              {/* Card details */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Annual cost</span>
                  <span
                    className={`font-mono ${
                      proc.highlight
                        ? "text-solana-green font-semibold"
                        : "text-white/60"
                    }`}
                  >
                    {proc.annual}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Settlement</span>
                  <span
                    className={`flex items-center gap-1.5 ${
                      proc.highlight
                        ? "text-solana-green font-semibold"
                        : "text-white/60"
                    }`}
                  >
                    {proc.highlight && (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    {proc.settlement}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Setup</span>
                  <span
                    className={`${
                      proc.highlight
                        ? "text-solana-green font-semibold"
                        : "text-white/60"
                    }`}
                  >
                    {proc.setup}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Savings callout */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-solana-green/20 bg-solana-green/[0.06]">
            <Check className="h-4 w-4 text-solana-green" />
            <span className="text-sm">
              <span className="font-bold text-solana-green">
                Save $2,600+/year
              </span>
              <span className="text-white/50 ml-1.5">
                — that&apos;s not optimization, that&apos;s a different business model
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
