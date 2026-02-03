"use client";

import React from "react";
import { Reveal } from "@/components/ui/reveal";

const competitors = [
  { name: "PayPal", fee: "3.49%", cost: "$4,188", width: "100%" },
  { name: "Stripe", fee: "2.9% + 30¢", cost: "$3,516", width: "84%" },
  { name: "Square", fee: "2.6%", cost: "$3,156", width: "75%" },
];

export function Problem() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left — comparison bars */}
          <div className="order-2 lg:order-1">
            <Reveal>
              <div className="space-y-6">
                {/* Competitors */}
                {competitors.map((c, i) => (
                  <div key={c.name}>
                    <div className="flex items-baseline justify-between mb-2">
                      <div className="flex items-baseline gap-3">
                        <span className="text-sm font-display font-600 text-[#8A8A96]">
                          {c.name}
                        </span>
                        <span className="text-xs text-[#3A3A44]">{c.fee}</span>
                      </div>
                      <span className="text-sm font-mono text-[#5A5A66]">
                        {c.cost}<span className="text-[#3A3A44]">/yr</span>
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-white/[0.04] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-red-500/40 to-red-400/20 transition-all duration-1000"
                        style={{ width: c.width }}
                      />
                    </div>
                  </div>
                ))}

                {/* Paygent */}
                <div className="pt-4 border-t border-white/[0.06]">
                  <div className="flex items-baseline justify-between mb-2">
                    <div className="flex items-baseline gap-3">
                      <span className="text-sm font-display font-700 text-white">
                        Paygent
                      </span>
                      <span className="text-xs text-emerald-400/60">0.75%</span>
                    </div>
                    <span className="text-sm font-mono text-emerald-400 font-600">
                      $900<span className="text-emerald-400/40">/yr</span>
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-lg shadow-emerald-500/20 transition-all duration-1000"
                      style={{ width: "22%" }}
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right — copy */}
          <div className="order-1 lg:order-2">
            <Reveal>
              <p className="text-xs font-display font-600 uppercase tracking-[0.2em] text-emerald-400/60 mb-5">
                The problem
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-800 tracking-tight leading-tight mb-5">
                You&apos;re overpaying
                <br />
                for payments.
              </h2>
              <p className="text-lg text-[#6B6B78] leading-relaxed mb-8 max-w-md">
                Traditional processors charge 2-3% plus fixed fees, require
                developer setup, and hold your money for days.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="rounded-2xl glass p-6 inline-block">
                <div className="text-xs text-emerald-400/50 uppercase tracking-wider font-display font-600 mb-1.5">
                  Annual savings at $10K/month
                </div>
                <div className="font-display text-4xl font-800 gradient-text">
                  $2,616
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
