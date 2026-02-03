"use client";

import React from "react";

const comparisons = [
  { name: "Stripe", fee: "2.9% + 30¢", annual: "$3,516", bar: 85 },
  { name: "PayPal", fee: "3.49%", annual: "$4,188", bar: 100 },
  { name: "Square", fee: "2.6%", annual: "$3,156", bar: 75 },
  { name: "Paygent", fee: "0.75%", annual: "$900", bar: 22, highlight: true },
];

export function Problem() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — copy */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-5">
              You&apos;re overpaying
              <br />
              for payments.
            </h2>

            <p className="text-white/45 leading-relaxed mb-6 max-w-md">
              Traditional processors charge 2-3% plus per-transaction fees,
              require developer setup, and hold your funds for days. You&apos;re
              paying for infrastructure designed for Fortune 500 companies.
            </p>

            <div className="rounded-xl border border-solana-green/20 bg-solana-green/[0.03] px-5 py-4 inline-block">
              <div className="text-xs text-solana-green/70 uppercase tracking-wider font-medium mb-1">
                Annual savings at $10K/month
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-solana-green">
                $2,616
              </div>
            </div>
          </div>

          {/* Right — visual comparison */}
          <div className="space-y-4">
            <div className="text-xs text-white/25 uppercase tracking-wider mb-5">
              Annual cost on $10K/month volume
            </div>

            {comparisons.map((item) => (
              <div key={item.name} className="group">
                <div className="flex items-baseline justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${
                        item.highlight ? "text-white" : "text-white/50"
                      }`}
                    >
                      {item.name}
                    </span>
                    <span className="text-xs text-white/20">{item.fee}</span>
                  </div>
                  <span
                    className={`text-sm font-mono ${
                      item.highlight
                        ? "text-solana-green font-semibold"
                        : "text-white/35"
                    }`}
                  >
                    {item.annual}/yr
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      item.highlight
                        ? "bg-solana-green"
                        : "bg-white/[0.12]"
                    }`}
                    style={{ width: `${item.bar}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
