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
    glow: "from-emerald-500/20 to-emerald-500/0",
    hoverBorder: "group-hover:border-emerald-500/15",
    iconGlow: "group-hover:shadow-emerald-500/20",
    dotColor: "bg-emerald-400",
    lineColor: "from-emerald-500/40 via-emerald-500/20 to-transparent",
  },
  purple: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
    glow: "from-purple-500/20 to-purple-500/0",
    hoverBorder: "group-hover:border-purple-500/15",
    iconGlow: "group-hover:shadow-purple-500/20",
    dotColor: "bg-purple-400",
    lineColor: "from-purple-500/40 via-purple-500/20 to-transparent",
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

        <RevealGroup className="relative space-y-4" staggerDelay={0.15}>
          {/* Vertical connection line */}
          <div className="absolute left-[2.1rem] sm:left-[2.6rem] top-10 bottom-10 w-px hidden md:block">
            <motion.div
              className="h-full w-full bg-gradient-to-b from-emerald-500/30 via-purple-500/20 to-emerald-500/30"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "top" }}
            />
          </div>

          {steps.map((step, i) => {
            const colors = accentColors[step.accent];
            return (
              <RevealItem key={i}>
                <motion.div
                  className={`group relative rounded-2xl border border-white/[0.08] ${colors.hoverBorder} bg-[#0D0D18]/90 backdrop-blur-sm hover:bg-[#0F0F1A]/95 transition-all duration-500 overflow-hidden`}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Top edge glow on hover */}
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r ${colors.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  {/* Corner dot decorations */}
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-40 transition-opacity duration-500">
                    <div className="w-1 h-1 rounded-full bg-white/30" />
                    <div className="w-1 h-1 rounded-full bg-white/20" />
                    <div className="w-1 h-1 rounded-full bg-white/10" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Left — content */}
                    <div className="p-8 sm:p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-5">
                        {/* Step number dot (connects to vertical line) */}
                        <motion.div
                          className={`relative w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center border border-white/[0.08] ${colors.iconGlow} group-hover:shadow-lg transition-shadow duration-500`}
                          whileHover={{ scale: 1.05, rotate: 3 }}
                        >
                          <step.icon className={`h-5 w-5 ${colors.text}`} />
                          {/* Pulse ring */}
                          <motion.div
                            className={`absolute inset-0 rounded-xl border ${colors.border}`}
                            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                          />
                        </motion.div>
                        <div className="flex items-center gap-3">
                          <div className={`text-xs font-mono ${colors.text} opacity-50 tracking-wider`}>
                            STEP {step.number}
                          </div>
                          {i < steps.length - 1 && (
                            <div className="hidden sm:block w-8 h-px bg-gradient-to-r from-white/10 to-transparent" />
                          )}
                        </div>
                      </div>

                      <h3 className="font-display text-2xl sm:text-3xl font-800 text-white mb-1 group-hover:text-white transition-colors">
                        {step.title}
                      </h3>
                      <p className={`text-sm ${colors.text} opacity-60 font-display font-500 mb-4`}>
                        {step.subtitle}
                      </p>
                      <p className="text-[15px] text-gray-500 leading-relaxed max-w-sm group-hover:text-gray-400 transition-colors duration-500">
                        {step.body}
                      </p>

                      {/* Duration indicator */}
                      <div className="mt-6 flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${colors.dotColor} animate-pulse`} />
                        <span className="text-[11px] font-mono text-gray-600">
                          {i === 0 ? "~10 seconds" : i === 1 ? "~60 seconds" : "~2 seconds"}
                        </span>
                      </div>
                    </div>

                    {/* Right — visual */}
                    <div className="relative p-6 sm:p-8 flex items-center justify-center border-t md:border-t-0 md:border-l border-white/[0.08] bg-white/[0.06] group-hover:bg-white/[0.04] transition-colors duration-500">
                      {/* Subtle dot grid in visual area */}
                      <div className="absolute inset-0 dot-pattern opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500" />
                      <div className="relative z-10">{step.visual}</div>
                    </div>
                  </div>
                </motion.div>
              </RevealItem>
            );
          })}
        </RevealGroup>

        {/* Bottom tagline */}
        <Reveal>
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-sm text-gray-600 font-display">
              Total time: <span className="text-emerald-400/80 font-600">~72 seconds</span> from idea to live storefront
            </p>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

/* ========== STEP VISUALS ========== */

function DescribeVisual() {
  return (
    <div className="w-full max-w-sm">
      <div className="rounded-xl border border-white/[0.06] bg-[#06060A]/90 backdrop-blur-sm p-4 font-mono text-sm shadow-lg shadow-black/20">
        <div className="flex items-center gap-2 text-gray-600 text-xs mb-3">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-white/10" />
            <div className="w-2 h-2 rounded-full bg-white/10" />
            <div className="w-2 h-2 rounded-full bg-white/10" />
          </div>
          <span className="ml-1">paygent create</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-emerald-400/60 mt-0.5">{">"}</span>
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
        {/* Cursor blink */}
        <motion.div
          className="mt-2 w-2 h-4 bg-emerald-400/40 rounded-sm"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
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
      <div className="rounded-xl border border-purple-500/10 bg-[#06060A]/90 backdrop-blur-sm p-4 shadow-lg shadow-black/20">
        <div className="flex items-center gap-2 mb-4">
          <motion.div
            animate={{ rotate: [0, 180, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-4 w-4 text-purple-400" />
          </motion.div>
          <span className="text-xs font-display font-600 text-purple-400">
            Generating storefront...
          </span>
          <motion.span
            className="ml-auto text-[10px] font-mono text-purple-400/50"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            47s
          </motion.span>
        </div>
        <div className="space-y-2.5">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.3, repeat: Infinity, repeatDelay: 5, duration: 0.4 }}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] transition-colors ${
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
              {item.done && (
                <span className="ml-auto text-[10px] font-mono text-gray-700">done</span>
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
      <div className="rounded-xl border border-emerald-500/10 bg-[#06060A]/90 backdrop-blur-sm p-4 shadow-lg shadow-black/20">
        {/* Transaction feed */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-display font-600 text-gray-600">
            Recent payments
          </span>
          <motion.div
            className="flex items-center gap-1.5"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-mono text-emerald-400/70">live</span>
          </motion.div>
        </div>
        <div className="space-y-2">
          {[
            { amount: "200", token: "USDC", time: "2s ago", product: "Portrait" },
            { amount: "5.2", token: "SOL", time: "14s ago", product: "Wedding" },
            { amount: "1500", token: "USDC", time: "1m ago", product: "Commercial" },
          ].map((tx, i) => (
            <motion.div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.04] transition-colors"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15, repeat: Infinity, repeatDelay: 8, duration: 0.4 }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/10">
                  <span className="text-emerald-400 text-xs">↓</span>
                </div>
                <div>
                  <div className="text-xs text-gray-300 font-500">{tx.product}</div>
                  <div className="text-[10px] text-gray-600">{tx.time}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono text-emerald-400 font-600">
                  +{tx.amount}
                </div>
                <div className="text-[10px] text-gray-600">{tx.token}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-white/[0.08] flex items-center justify-between">
          <motion.div
            className="text-[10px] text-emerald-400/50 font-mono flex items-center gap-1.5"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-1 h-1 rounded-full bg-emerald-400" />
            wallet connected
          </motion.div>
          <span className="text-[10px] font-mono text-gray-600">direct to you</span>
        </div>
      </div>
    </div>
  );
}
