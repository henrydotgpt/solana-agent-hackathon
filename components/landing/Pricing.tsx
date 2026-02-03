"use client";

import React from "react";

const processors = [
  {
    name: "Stripe",
    fee: "$29.30",
    annual: "$3,516",
    settlement: "2-7 days",
    setup: "Developer required",
    custody: "They hold your money",
    highlight: false,
  },
  {
    name: "PayPal",
    fee: "$34.90",
    annual: "$4,188",
    settlement: "1-3 days",
    setup: "Manual config",
    custody: "They hold your money",
    highlight: false,
  },
  {
    name: "Square",
    fee: "$26.30",
    annual: "$3,156",
    settlement: "1-2 days",
    setup: "Hardware needed",
    custody: "They hold your money",
    highlight: false,
  },
  {
    name: "Paygent",
    fee: "$7.50",
    annual: "$900",
    settlement: "Instant",
    setup: "One sentence",
    custody: "Non-custodial",
    highlight: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Stop overpaying{" "}
            <span className="gradient-text">for payments.</span>
          </h2>
        </div>

        {/* Comparison table — desktop */}
        <div className="mx-auto max-w-4xl hidden md:block">
          <div className="rounded-2xl border border-border/50 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-5 bg-muted/30 text-xs uppercase tracking-wider font-medium text-muted-foreground">
              <div className="p-4">Processor</div>
              <div className="p-4">Fee on $1,000</div>
              <div className="p-4">Annual ($10K/mo)</div>
              <div className="p-4">Settlement</div>
              <div className="p-4">Setup</div>
            </div>

            {/* Rows */}
            {processors.map((proc) => (
              <div
                key={proc.name}
                className={`grid grid-cols-5 border-t border-border/30 ${
                  proc.highlight
                    ? "bg-solana-gradient-subtle"
                    : ""
                }`}
              >
                <div className="p-4 font-semibold flex items-center gap-2">
                  {proc.highlight && (
                    <span className="flex h-2 w-2 rounded-full bg-solana-green" />
                  )}
                  {proc.name}
                </div>
                <div
                  className={`p-4 font-mono text-sm ${
                    proc.highlight
                      ? "text-solana-green font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  {proc.fee}
                </div>
                <div
                  className={`p-4 font-mono text-sm ${
                    proc.highlight
                      ? "text-solana-green font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  {proc.annual}
                </div>
                <div
                  className={`p-4 text-sm ${
                    proc.highlight
                      ? "text-solana-green font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {proc.settlement}
                </div>
                <div
                  className={`p-4 text-sm ${
                    proc.highlight
                      ? "text-solana-green font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {proc.setup}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison cards — mobile */}
        <div className="md:hidden space-y-4 max-w-sm mx-auto">
          {processors.map((proc) => (
            <div
              key={proc.name}
              className={`rounded-xl border p-5 ${
                proc.highlight
                  ? "border-solana-green/30 bg-solana-gradient-subtle"
                  : "border-border/50 bg-card/50"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3
                  className={`font-semibold ${
                    proc.highlight ? "gradient-text" : ""
                  }`}
                >
                  {proc.name}
                </h3>
                <span
                  className={`font-mono text-sm font-bold ${
                    proc.highlight
                      ? "text-solana-green"
                      : "text-muted-foreground"
                  }`}
                >
                  {proc.fee}
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Annual ($10K/mo)</span>
                  <span className={proc.highlight ? "text-solana-green font-medium" : ""}>
                    {proc.annual}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Settlement</span>
                  <span className={proc.highlight ? "text-solana-green font-medium" : ""}>
                    {proc.settlement}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Setup</span>
                  <span className={proc.highlight ? "text-solana-green font-medium" : ""}>
                    {proc.setup}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Savings callout */}
        <p className="text-center mt-10 text-lg">
          <span className="font-bold gradient-text">
            You save $2,600+/year.
          </span>{" "}
          <span className="text-muted-foreground">
            That&apos;s not optimization. That&apos;s a different business
            model.
          </span>
        </p>
      </div>
    </section>
  );
}
