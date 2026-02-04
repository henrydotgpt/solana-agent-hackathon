"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Typewriter } from "@/components/ui/typewriter";
import { ArrowRight, Play } from "lucide-react";

const businesses = [
  "artisan coffee beans",
  "web design services",
  "handmade jewelry",
  "photography packages",
  "online courses",
  "fitness coaching",
  "NFT collections",
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Dot grid overlay */}
      <div className="absolute inset-0 dot-pattern opacity-40" />

      {/* Hero glow accents */}
      <div className="absolute top-[-200px] left-[-100px] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-emerald-500/[0.08] to-transparent blur-[120px]" />
      <div className="absolute top-[-100px] right-[-200px] w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-purple-500/[0.06] to-transparent blur-[120px]" />
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#06060A] to-transparent" />

      <motion.div
        className="relative z-10 mx-auto max-w-7xl w-full px-6 sm:px-8 pt-28 pb-20"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-6 items-center">
          {/* Left — copy */}
          <div className="lg:col-span-6">
            {/* Badge */}
            <motion.div variants={item}>
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass text-xs tracking-wide mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-emerald-400/80 font-medium">
                  Live on Solana devnet
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={item}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-800 tracking-tight leading-[1.05] mb-6"
            >
              Accept crypto
              <br />
              payments in
              <br />
              <span className="gradient-text">60 seconds.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={item}
              className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-lg mb-10"
            >
              Describe your business in one sentence. Get a complete payment
              storefront — live, hosted, and accepting money. No code. No setup.
              Just revenue.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 mb-14">
              <Link href="/create">
                <Button
                  variant="gradient"
                  size="lg"
                  className="gap-2.5 group w-full sm:w-auto font-display font-600 text-base px-8"
                >
                  Create storefront
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/pay/demo-store">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white/[0.08] text-gray-400 hover:text-white hover:border-white/[0.15] hover:bg-white/[0.04] font-display gap-2"
                >
                  <Play className="h-3.5 w-3.5" />
                  View live demo
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div variants={item} className="flex items-center gap-8 sm:gap-10">
              <StatItem value="0.75%" label="Transaction fee" />
              <div className="h-10 w-px bg-white/[0.06]" />
              <StatItem value="~2s" label="Settlement" />
              <div className="h-10 w-px bg-white/[0.06]" />
              <StatItem value="$0" label="Monthly cost" />
            </motion.div>
          </div>

          {/* Right — Interactive demo */}
          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProductDemo />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl sm:text-3xl font-800 text-white">
        {value}
      </div>
      <div className="text-[11px] text-gray-600 mt-0.5 uppercase tracking-wider font-medium">
        {label}
      </div>
    </div>
  );
}

function ProductDemo() {
  return (
    <div className="relative">
      {/* Glow behind card */}
      <div className="absolute -inset-4 bg-gradient-to-br from-emerald-500/[0.08] via-transparent to-purple-500/[0.06] rounded-3xl blur-2xl" />

      {/* Main card */}
      <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] bg-[#0A0A10]/90 backdrop-blur-xl shadow-2xl shadow-black/50">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08] bg-[#0A0A10]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]/80" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]/80" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]/80" />
          </div>
          <div className="flex-1 mx-3">
            <div className="h-7 rounded-lg bg-white/[0.04] flex items-center justify-center max-w-[300px] mx-auto px-3">
              <span className="text-[11px] text-gray-600 font-mono truncate">
                paygent.app/pay/your-store
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* AI Input */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-4">
            <div className="text-[11px] font-display font-600 text-gray-500 uppercase tracking-wider mb-2.5">
              Describe your business
            </div>
            <div className="text-[15px] text-gray-300 min-h-[24px]">
              I sell{" "}
              <Typewriter
                words={businesses}
                typingSpeed={70}
                deletingSpeed={35}
                pauseDuration={2200}
                className="text-emerald-400"
              />
            </div>
          </div>

          {/* Generated storefront preview */}
          <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.02] p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/20 to-purple-500/20 flex items-center justify-center">
                <span className="text-sm">☕</span>
              </div>
              <div>
                <div className="text-sm font-display font-600 text-white">
                  Your Store
                </div>
                <div className="text-[11px] text-gray-500">
                  Generated by Paygent AI
                </div>
              </div>
              <div className="ml-auto">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-[10px] font-display font-600 text-emerald-400">
                  <span className="w-1 h-1 rounded-full bg-emerald-400" />
                  LIVE
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <ProductRow name="Starter Package" price="49" highlight />
              <ProductRow name="Pro Package" price="149" />
              <ProductRow name="Enterprise" price="499" />
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between">
              <div className="text-[10px] text-gray-700 font-mono">
                Powered by Paygent
              </div>
              <div className="h-8 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-400 flex items-center shadow-lg shadow-emerald-500/20 cursor-default">
                <span className="text-xs font-display font-600 text-black">
                  Pay with SOL
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <motion.div
        className="absolute -top-3 -right-3 rounded-xl glass-strong px-3 py-2 shadow-xl"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <span className="text-[10px]">⚡</span>
          </div>
          <div>
            <div className="text-[10px] font-display font-600 text-white">Payment received</div>
            <div className="text-[9px] text-gray-500">49 USDC · 1.2s ago</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute -bottom-3 -left-3 rounded-xl glass-strong px-3 py-2 shadow-xl"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      >
        <div className="flex items-center gap-2">
          <div className="text-xs font-mono text-emerald-400 font-600">0.75%</div>
          <div className="text-[10px] text-gray-500">fee · non-custodial</div>
        </div>
      </motion.div>
    </div>
  );
}

function ProductRow({ name, price, highlight }: { name: string; price: string; highlight?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between p-2.5 rounded-lg transition-all ${
        highlight
          ? "bg-emerald-500/[0.06] border border-emerald-500/10"
          : "bg-white/[0.04] border border-transparent"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`w-6 h-6 rounded-md ${
            highlight ? "bg-emerald-500/15" : "bg-white/[0.04]"
          }`}
        />
        <span className="text-sm text-gray-300">{name}</span>
      </div>
      <span
        className={`text-sm font-mono font-500 ${
          highlight ? "text-emerald-400" : "text-gray-600"
        }`}
      >
        {price} <span className="text-[10px] opacity-60">USDC</span>
      </span>
    </div>
  );
}
