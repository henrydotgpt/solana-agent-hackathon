"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Shield,
  Zap,
  Clock,
  Percent,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-solana-purple/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-solana-green/15 rounded-full blur-[120px]"
        />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Headline */}
        <motion.h1
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-bold tracking-tight leading-[0.95] mb-6"
        >
          Payments infrastructure
          <br />
          <span className="gradient-text">for the AI era.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground mb-4 leading-relaxed"
        >
          Describe your business. Get a complete payment storefront — hosted,
          live, and accepting money in seconds.{" "}
          <span className="text-foreground font-medium">
            No code. No crypto knowledge. Just revenue.
          </span>
        </motion.p>

        {/* Pricing line */}
        <motion.p
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-sm text-muted-foreground/80 mb-10"
        >
          0.75% per transaction. No monthly fees. No minimums.
        </motion.p>

        {/* CTA */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/create">
            <Button variant="gradient" size="xl" className="gap-2 group">
              Start accepting payments
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/pay/demo-store">
            <Button variant="outline" size="xl">
              See demo storefront
            </Button>
          </Link>
        </motion.div>

        {/* Trust bar */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 inline-flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm px-8 py-4"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-solana-green" />
            <span>Non-custodial — your funds, your wallet</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border/60" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Percent className="h-4 w-4 text-solana-purple-light" />
            <span>0.75% flat fee</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border/60" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-solana-green">◎</span>
            <span>Built on Solana</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border/60" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-yellow-500" />
            <span>Live in 60 seconds</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
