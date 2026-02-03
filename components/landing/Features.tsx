"use client";

import React from "react";
import { motion } from "framer-motion";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { SectionGlow } from "@/components/ui/gradient-mesh";
import {
  Bot,
  QrCode,
  Shield,
  ArrowRightLeft,
  Bell,
  BarChart3,
  Zap,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI storefronts",
    description: "Describe your business → get a complete storefront. Product pages, checkout, branding — all generated in seconds.",
    span: "col-span-1 sm:col-span-2",
    visual: <AIVisual />,
  },
  {
    icon: Shield,
    title: "Non-custodial",
    description: "We never touch your funds. Direct wallet-to-wallet. Always.",
    span: "col-span-1",
  },
  {
    icon: QrCode,
    title: "QR & pay links",
    description: "Share via WhatsApp, email, or scan in-person. Works everywhere.",
    span: "col-span-1",
  },
  {
    icon: ArrowRightLeft,
    title: "Auto-convert",
    description: "Customer pays in any token → you receive USDC. Zero volatility risk.",
    span: "col-span-1",
  },
  {
    icon: Bell,
    title: "Real-time alerts",
    description: "Instant notifications via webhook, email, or Telegram when you get paid.",
    span: "col-span-1",
  },
  {
    icon: BarChart3,
    title: "Merchant dashboard",
    description: "Track every payment, view analytics, manage products, and download on-chain receipts from one clean dashboard.",
    span: "col-span-1 sm:col-span-2",
    visual: <DashboardVisual />,
  },
  {
    icon: Zap,
    title: "~2s settlement",
    description: "Solana finality in seconds. No 3-day holds, no chargebacks.",
    span: "col-span-1",
  },
  {
    icon: Globe,
    title: "Global by default",
    description: "Accept payments from anywhere. No borders, no bank accounts required.",
    span: "col-span-1",
  },
];

export function Features() {
  return (
    <section id="features" className="py-28 sm:py-36 relative overflow-hidden">
      <div className="section-divider absolute top-0 inset-x-0" />
      <SectionGlow color="blue" position="center" size="lg" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-display font-600 uppercase tracking-[0.2em] text-blue-400/60 mb-5">
              Features
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-800 tracking-tight leading-tight mb-4">
              Everything you need.
              <br />
              <span className="text-gray-600">Nothing you don&apos;t.</span>
            </h2>
          </div>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" staggerDelay={0.06}>
          {features.map((f, i) => (
            <RevealItem key={i} className={f.span}>
              <FeatureCard {...f} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  visual,
  span,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  visual?: React.ReactNode;
  span: string;
}) {
  const isLarge = span.includes("col-span-2");

  return (
    <div className="group h-full rounded-2xl border border-white/[0.04] bg-[#0A0A10]/60 hover:border-white/[0.08] hover:bg-[#0A0A10]/80 transition-all duration-500 overflow-hidden">
      <div className={isLarge ? "grid sm:grid-cols-2 gap-0 h-full" : "h-full"}>
        <div className="p-6 sm:p-7 flex flex-col">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.03] group-hover:bg-white/[0.06] border border-white/[0.04] transition-all mb-5">
            <Icon className="h-5 w-5 text-gray-500 group-hover:text-emerald-400 transition-colors duration-300" />
          </div>

          <h3 className="font-display text-lg font-700 text-white mb-1.5">
            {title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            {description}
          </p>
        </div>

        {visual && isLarge && (
          <div className="relative border-t sm:border-t-0 sm:border-l border-white/[0.04] bg-white/[0.01] flex items-center justify-center p-6 overflow-hidden">
            {visual}
          </div>
        )}
      </div>
    </div>
  );
}

/* ========== FEATURE VISUALS ========== */

function AIVisual() {
  return (
    <div className="w-full max-w-xs">
      <div className="space-y-2 font-mono text-[11px]">
        <motion.div
          className="flex items-center gap-2 text-gray-600"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <span className="text-emerald-400/50">→</span>
          Parsing business description...
        </motion.div>
        <div className="flex items-center gap-2 text-gray-500">
          <span className="text-emerald-400">✓</span>
          3 products detected
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <span className="text-emerald-400">✓</span>
          Checkout flow generated
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <span className="text-emerald-400">✓</span>
          QR codes created
        </div>
        <div className="flex items-center gap-2 text-emerald-400/80">
          <span>⚡</span>
          Storefront live at /pay/dubai-studio
        </div>
      </div>
    </div>
  );
}

function DashboardVisual() {
  const bars = [65, 45, 80, 55, 90, 70, 85];

  return (
    <div className="w-full max-w-xs">
      <div className="flex items-end gap-1.5 h-20">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t-sm bg-gradient-to-t from-emerald-500/30 to-emerald-400/10"
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between mt-3 text-[10px] text-gray-600 font-mono">
        <span>Mon</span>
        <span>Sun</span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <div className="text-xs font-display font-600 text-white">$4,280</div>
        <div className="text-[10px] text-emerald-400">↑ 24%</div>
      </div>
    </div>
  );
}
