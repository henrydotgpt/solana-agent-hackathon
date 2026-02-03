"use client";

import React from "react";
import { motion } from "framer-motion";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SectionGlow } from "@/components/ui/gradient-mesh";
import { MessageSquareText, Sparkles, Wallet2 } from "lucide-react";

const steps = [
  {
    icon: MessageSquareText,
    number: "01",
    title: "Describe",
    subtitle: "Tell us what you sell",
    body: "Type one sentence about your business. What you sell, who it's for, how much it costs.",
    visual: <DescribeVisual />,
    accent: "emerald" as const,
  },
  {
    icon: Sparkles,
    number: "02",
    title: "Generate",
    subtitle: "AI builds your store",
    body: "In under 60 seconds, Paygent creates product pages, checkout flow, QR codes, and payment links.",
    visual: <GenerateVisual />,
    accent: "purple" as const,
  },
  {
    icon: Wallet2,
    number: "03",
    title: "Get paid",
    subtitle: "Share and earn",
    body: "Share your link. Customers pay in USDC or SOL. Funds hit your wallet in ~2 seconds.",
    visual: <GetPaidVisual />,
    accent: "emerald" as const,
  },
];

const accentColors = {
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    glow: "shadow-emerald-500/10",
  },
  purple: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
    glow: "shadow-purple-500/10",
  },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 sm:py-36 relative overflow-hidden">
      <div className="section-divider absolute top-0 inset-x-0" />
      <SectionGlow color="green" position="left" size="md" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-20">
            <p className="text-xs font-display font-600 uppercase tracking-[0.2em] text-emerald-400/60 mb-5">
              How it works
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-800 tracking-tight leading-tight">
              Three steps to
              <br />
              <span className="gradient-text">your first payment.</span>
            </h2>
          </div>
        </Reveal>

        <RevealGroup className="space-y-6" staggerDelay={0.15}>
          {steps.map((step, i) => {
            const colors = accentColors[step.accent];
            return (
              <RevealItem key={i}>
                <div className="group relative rounded-2xl border border-white/[0.04] bg-[#0A0A10]/80 hover:border-white/[0.08] transition-all duration-500 overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Left — content */}
                    <div className="p-8 sm:p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-5">
                        <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                          <step.icon className={`h-5 w-5 ${colors.text}`} />
                        </div>
                        <div className="text-xs font-mono text-gray-700 tracking-wider">
                          STEP {step.number}
                        </div>
                      </div>

                      <h3 className="font-display text-2xl sm:text-3xl font-800 text-white mb-1">
                        {step.title}
                      </h3>
                      <p className={`text-sm ${colors.text} opacity-70 font-display font-500 mb-4`}>
                        {step.subtitle}
                      </p>
                      <p className="text-[15px] text-gray-500 leading-relaxed max-w-sm">
                        {step.body}
                      </p>
                    </div>

                    {/* Right — visual */}
                    <div className="relative p-6 sm:p-8 flex items-center justify-center border-t md:border-t-0 md:border-l border-white/[0.04] bg-white/[0.01]">
                      {step.visual}
                    </div>
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}

/* ========== STEP VISUALS ========== */

function DescribeVisual() {
  return (
    <div className="w-full max-w-sm">
      <div className="rounded-xl border border-white/[0.06] bg-[#06060A] p-4 font-mono text-sm">
        <div className="text-gray-600 text-xs mb-3">paygent create</div>
        <div className="flex items-start gap-2">
          <span className="text-emerald-400/60">{">"}</span>
          <div>
            <span className="text-gray-400">
              &quot;I run a photography studio in Dubai. I offer three packages —
            </span>
            <span className="text-emerald-400"> portrait $200</span>
            <span className="text-gray-400">, </span>
            <span className="text-emerald-400">wedding $800</span>
            <span className="text-gray-400">, </span>
            <span className="text-emerald-400">commercial $1500</span>
            <span className="text-gray-400">&quot;</span>
          </div>
        </div>
        <motion.div
          className="mt-3 h-px bg-gradient-to-r from-emerald-500/40 to-transparent"
          animate={{ scaleX: [0, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          style={{ transformOrigin: "left" }}
        />
      </div>
    </div>
  );
}

function GenerateVisual() {
  const items = [
    { label: "Product pages", done: true },
    { label: "Checkout flow", done: true },
    { label: "QR codes", done: true },
    { label: "Payment links", done: false },
  ];

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-xl border border-purple-500/10 bg-[#06060A] p-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-purple-400" />
          <span className="text-xs font-display font-600 text-purple-400">
            Generating storefront...
          </span>
        </div>
        <div className="space-y-2.5">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.3, repeat: Infinity, repeatDelay: 5, duration: 0.3 }}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] ${
                  item.done
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-white/[0.04] text-gray-600"
                }`}
              >
                {item.done ? "✓" : "·"}
              </div>
              <span className={`text-sm ${item.done ? "text-gray-300" : "text-gray-600"}`}>
                {item.label}
              </span>
              {!item.done && (
                <motion.div
                  className="ml-auto w-16 h-1.5 rounded-full bg-white/[0.04] overflow-hidden"
                >
                  <motion.div
                    className="h-full bg-purple-400/40 rounded-full"
                    animate={{ width: ["0%", "80%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GetPaidVisual() {
  return (
    <div className="w-full max-w-sm">
      <div className="rounded-xl border border-emerald-500/10 bg-[#06060A] p-4">
        {/* Transaction feed */}
        <div className="text-xs font-display font-600 text-gray-600 mb-3">
          Recent payments
        </div>
        <div className="space-y-2">
          {[
            { amount: "200", token: "USDC", time: "2s ago", product: "Portrait" },
            { amount: "5.2", token: "SOL", time: "14s ago", product: "Wedding" },
            { amount: "1500", token: "USDC", time: "1m ago", product: "Commercial" },
          ].map((tx, i) => (
            <motion.div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15, repeat: Infinity, repeatDelay: 8, duration: 0.4 }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center">
                  <span className="text-emerald-400 text-[10px]">↓</span>
                </div>
                <div>
                  <div className="text-xs text-gray-300 font-500">{tx.product}</div>
                  <div className="text-[10px] text-gray-600">{tx.time}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono text-emerald-400 font-500">
                  +{tx.amount}
                </div>
                <div className="text-[10px] text-gray-600">{tx.token}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-3 text-center text-[10px] text-emerald-400/50 font-mono"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ● wallet connected · funds direct to you
        </motion.div>
      </div>
    </div>
  );
}
