"use client";

import React from "react";

export function Problem() {
  return (
    <section className="py-20 sm:py-28 relative">
      <div className="mx-auto px-4 sm:px-6 max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-8">
            Payment processors{" "}
            <span className="gradient-text">weren&apos;t built for you.</span>
          </h2>

          <div className="space-y-5 text-base sm:text-lg text-white/50 leading-relaxed">
            <p>
              Stripe takes{" "}
              <span className="text-white font-semibold">2.9% + 30¢</span>.
              PayPal takes{" "}
              <span className="text-white font-semibold">3.49%</span>. Square
              takes <span className="text-white font-semibold">2.6%</span>.
              You&apos;re paying thousands per year in fees for infrastructure
              designed for Fortune 500 companies.
            </p>

            <p>
              Paygent charges{" "}
              <span className="gradient-text font-bold text-xl sm:text-2xl">
                0.75%
              </span>
              . Flat. That&apos;s it.
            </p>
          </div>

          {/* Savings callout */}
          <div className="mt-10 sm:mt-14 rounded-2xl border border-solana-green/20 bg-solana-green/[0.03] p-6 sm:p-8">
            <p className="text-xs sm:text-sm text-solana-green font-medium uppercase tracking-wider mb-2">
              For a business doing $10,000/month
            </p>
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-1.5">
              $217/month saved.
            </p>
            <p className="text-white/40 text-sm sm:text-base">
              Every month. Forever.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
