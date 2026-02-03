"use client";

import React from "react";
import { Reveal } from "@/components/ui/reveal";
import { MessageSquare, Wand2, Wallet } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    number: "01",
    title: "Describe your business",
    body: "Tell Paygent what you sell, your pricing, and how you want to get paid. One sentence is enough.",
    example: '"I\'m a freelance designer in Dubai. I charge $500 per project and offer three packages."',
    accent: "emerald",
  },
  {
    icon: Wand2,
    number: "02",
    title: "We build everything",
    body: "Product pages, checkout flow, QR codes, payment links. Your storefront goes live instantly — hosted, branded, and ready to accept payments.",
    accent: "blue",
  },
  {
    icon: Wallet,
    number: "03",
    title: "Share and get paid",
    body: "Send your Paygent link to clients. They pay in USDC or SOL. Funds land directly in your wallet — in seconds, not days.",
    accent: "emerald",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 relative">
      {/* Section divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <Reveal>
          <p className="text-xs font-display font-600 uppercase tracking-[0.2em] text-blue-400/60 mb-5">
            How it works
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-800 tracking-tight leading-tight mb-4 max-w-lg">
            Three steps.
            <br />
            <span className="text-[#3A3A44]">One sentence to start.</span>
          </h2>
        </Reveal>

        <div className="mt-16 sm:mt-20 grid md:grid-cols-3 gap-px rounded-2xl overflow-hidden bg-white/[0.03]">
          {steps.map((step, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className="bg-[#0A0A10] p-7 sm:p-8 h-full group hover:bg-white/[0.02] transition-colors">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-5 ${
                  step.accent === "emerald"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-blue-500/10 text-blue-400"
                }`}>
                  <step.icon className="h-5 w-5" />
                </div>

                <div className="text-xs font-mono text-[#3A3A44] mb-3">
                  {step.number}
                </div>

                <h3 className="font-display text-lg font-700 text-white mb-2">
                  {step.title}
                </h3>

                <p className="text-sm text-[#6B6B78] leading-relaxed">
                  {step.body}
                </p>

                {step.example && (
                  <div className="mt-4 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <p className="text-xs text-[#5A5A66] italic leading-relaxed font-body">
                      {step.example}
                    </p>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
