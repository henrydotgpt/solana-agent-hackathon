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
    accentColor: "emerald",
  },
  {
    icon: Shield,
    title: "Non-custodial",
    description: "We never touch your funds. Direct wallet-to-wallet. Always.",
    span: "col-span-1",
    accentColor: "blue",
  },
  {
    icon: QrCode,
    title: "QR & pay links",
    description: "Share via WhatsApp, email, or scan in-person. Works everywhere.",
    span: "col-span-1",
    accentColor: "purple",
  },
  {
    icon: ArrowRightLeft,
    title: "Auto-convert",
    description: "Customer pays in any token → you receive USDC. Zero volatility risk.",
    span: "col-span-1",
    accentColor: "emerald",
  },
  {
    icon: Bell,
    title: "Real-time alerts",
    description: "Instant notifications via webhook, email, or Telegram when you get paid.",
    span: "col-span-1",
    accentColor: "amber",
  },
  {
    icon: BarChart3,
    title: "Merchant dashboard",
    description: "Track every payment, view analytics, manage products, and download on-chain receipts from one clean dashboard.",
    span: "col-span-1 sm:col-span-2",
    visual: <DashboardVisual />,
    accentColor: "emerald",
  },
  {
    icon: Zap,
    title: "~2s settlement",
    description: "Solana finality in seconds. No 3-day holds, no chargebacks.",
    span: "col-span-1",
    accentColor: "yellow",
  },
  {
    icon: Globe,
    title: "Global by default",
    description: "Accept payments from anywhere. No borders, no bank accounts required.",
    span: "col-span-1",
    accentColor: "blue",
  },
];

const accentMap: Record<string, { iconHover: string; glowColor: string; borderHover: string }> = {
  emerald: { iconHover: "group-hover:text-emerald-400", glowColor: "emerald-500", borderHover: "group-hover:border-emerald-500/10" },
  blue: { iconHover: "group-hover:text-blue-400", glowColor: "blue-500", borderHover: "group-hover:border-blue-500/10" },
  purple: { iconHover: "group-hover:text-purple-400", glowColor: "purple-500", borderHover: "group-hover:border-purple-500/10" },
  amber: { iconHover: "group-hover:text-amber-400", glowColor: "amber-500", borderHover: "group-hover:border-amber-500/10" },
  yellow: { iconHover: "group-hover:text-yellow-400", glowColor: "yellow-500", borderHover: "group-hover:border-yellow-500/10" },
};

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
              <FeatureCard {...f} index={i} />
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
  accentColor,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  visual?: React.ReactNode;
  span: string;
  accentColor: string;
  index: number;
}) {
  const isLarge = span.includes("col-span-2");
  const accent = accentMap[accentColor] || accentMap.emerald;

  return (
    <motion.div
      className={`group h-full rounded-2xl border border-white/[0.04] ${accent.borderHover} bg-[#0A0A10]/80 backdrop-blur-sm hover:bg-[#0C0C14]/90 transition-all duration-500 overflow-hidden relative`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
    >
      {/* Top edge glow */}
      <div className={`absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-${accent.glowColor}/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      {/* Subtle corner decoration */}
      <div className="absolute top-2.5 right-2.5 flex gap-0.5 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
        <div className="w-0.5 h-0.5 rounded-full bg-white" />
        <div className="w-0.5 h-0.5 rounded-full bg-white/60" />
      </div>

      <div className={isLarge ? "grid sm:grid-cols-2 gap-0 h-full" : "h-full"}>
        <div className="p-6 sm:p-7 flex flex-col">
          <motion.div
            className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white/[0.03] group-hover:bg-white/[0.06] border border-white/[0.04] group-hover:border-white/[0.08] transition-all duration-500 mb-5`}
            whileHover={{ scale: 1.05, rotate: 3 }}
          >
            <Icon className={`h-5 w-5 text-gray-500 ${accent.iconHover} transition-colors duration-300`} />
          </motion.div>

          <h3 className="font-display text-lg font-700 text-white mb-1.5 group-hover:text-white transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors duration-500">
            {description}
          </p>
        </div>

        {visual && isLarge && (
          <div className="relative border-t sm:border-t-0 sm:border-l border-white/[0.04] bg-white/[0.01] group-hover:bg-white/[0.02] flex items-center justify-center p-6 overflow-hidden transition-colors duration-500">
            <div className="absolute inset-0 dot-pattern opacity-[0.02] group-hover:opacity-[0.04] transition-opacity duration-500" />
            <div className="relative z-10">{visual}</div>
          </div>
        )}
      </div>
    </motion.div>
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
          <motion.span
            className="text-emerald-400/50"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            ⟳
          </motion.span>
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
        <motion.div
          className="flex items-center gap-2 text-emerald-400/80"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span>⚡</span>
          Storefront live at /pay/dubai-studio
        </motion.div>
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
            className="flex-1 rounded-t bg-gradient-to-t from-emerald-500/30 to-emerald-400/10 border-t border-emerald-400/20"
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
        <div className="text-sm font-display font-700 text-white">$4,280</div>
        <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-0.5">
          <span>↑</span> 24%
        </div>
        <div className="text-[10px] text-gray-600 font-mono ml-auto">this week</div>
      </div>
    </div>
  );
}
