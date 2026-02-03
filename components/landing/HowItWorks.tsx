"use client";

import React from "react";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 border-y border-white/[0.04]">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-14 sm:mb-20 max-w-lg">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">
            Three steps.
            <br />
            <span className="text-white/40">One sentence to start.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <Step
            number="01"
            title="Describe your business"
            description="Tell Paygent what you sell, your pricing, and how you want to get paid. That's it — one sentence is enough."
            example={`"I'm a freelance designer in Dubai. I charge $500 per project and offer three packages."`}
          />
          <Step
            number="02"
            title="We build everything"
            description="Product pages, checkout flow, QR codes, payment links. Your storefront goes live instantly — hosted, branded, ready."
          />
          <Step
            number="03"
            title="Share and get paid"
            description="Send your Paygent link to clients. They pay in USDC or SOL. Funds land in your wallet within seconds."
          />
        </div>
      </div>
    </section>
  );
}

function Step({
  number,
  title,
  description,
  example,
}: {
  number: string;
  title: string;
  description: string;
  example?: string;
}) {
  return (
    <div>
      <div className="text-xs font-mono text-white/15 mb-4">{number}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-[15px] text-white/40 leading-relaxed">
        {description}
      </p>
      {example && (
        <div className="mt-4 px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
          <p className="text-sm text-white/30 italic">{example}</p>
        </div>
      )}
    </div>
  );
}
