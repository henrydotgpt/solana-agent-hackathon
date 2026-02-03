"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
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
        {/* Badge */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Badge
            variant="outline"
            className="mb-6 gap-1.5 border-solana-purple/30 bg-solana-purple/5 px-4 py-1.5 text-solana-purple-light"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Powered by AI + Solana
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6"
        >
          Your business.
          <br />
          <span className="gradient-text">Paid in crypto.</span>
          <br />
          <span className="text-muted-foreground/60">In minutes.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed"
        >
          Describe your business to our AI agent. It builds a complete payment
          storefront with{" "}
          <span className="text-solana-purple-light font-medium">
            Solana Pay QR codes
          </span>
          , product catalogs, and{" "}
          <span className="text-solana-green font-medium">
            auto-conversion to USDC
          </span>
          . No code. No crypto knowledge needed.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/create">
            <Button variant="gradient" size="xl" className="gap-2 group">
              Create Your Storefront
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button variant="outline" size="xl" className="gap-2">
              See How It Works
            </Button>
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-solana-green" />
            <span>Instant Setup</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-solana-purple-light" />
            <span>Non-Custodial</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-solana-green">◎</span>
            <span>Powered by Solana</span>
          </div>
        </motion.div>

        {/* Hero visual — Storefront preview mockup */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 mx-auto max-w-4xl"
        >
          <div className="relative rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm p-1 glow-purple">
            <div className="rounded-xl bg-background/80 p-8">
              {/* Fake storefront preview */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <div className="ml-4 flex-1 h-6 rounded-md bg-muted/50 max-w-sm" />
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="col-span-2 space-y-4">
                  <div className="h-8 w-48 rounded-md bg-solana-gradient opacity-30" />
                  <div className="h-4 w-full rounded bg-muted/30" />
                  <div className="h-4 w-3/4 rounded bg-muted/20" />
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-24 rounded-lg bg-muted/20 border border-border/30"
                      />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-full aspect-square rounded-xl bg-white/90 p-4 flex items-center justify-center">
                    <div className="w-full h-full rounded-lg bg-gradient-to-br from-solana-purple/20 to-solana-green/20 grid grid-cols-4 grid-rows-4 gap-0.5 p-2">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-sm ${
                            Math.random() > 0.3
                              ? "bg-gray-800"
                              : "bg-transparent"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="h-10 w-full rounded-lg bg-solana-gradient opacity-40" />
                </div>
              </div>
            </div>
          </div>
          {/* Reflection effect */}
          <div className="mt-1 h-24 rounded-2xl bg-gradient-to-b from-card/10 to-transparent blur-sm" />
        </motion.div>
      </div>
    </section>
  );
}
