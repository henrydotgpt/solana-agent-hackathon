"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Shield,
  Clock,
  Percent,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background orbs — pure CSS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-solana-purple/20 rounded-full blur-[120px] animate-pulse-orb" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-solana-green/15 rounded-full blur-[120px] animate-pulse-orb-alt" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-bold tracking-tight leading-[0.95] mb-6 animate-fade-in-up delay-100">
          Payments infrastructure
          <br />
          <span className="gradient-text">for the AI era.</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground mb-4 leading-relaxed animate-fade-in-up delay-200">
          Describe your business. Get a complete payment storefront — hosted,
          live, and accepting money in seconds.{" "}
          <span className="text-foreground font-medium">
            No code. No crypto knowledge. Just revenue.
          </span>
        </p>

        {/* Pricing line */}
        <p className="text-sm text-muted-foreground/80 mb-10 animate-fade-in-up delay-250">
          0.75% per transaction. No monthly fees. No minimums.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
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
        </div>

        {/* Trust bar */}
        <div className="mt-16 inline-flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm px-8 py-4 animate-fade-in-up delay-400">
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
        </div>
      </div>
    </section>
  );
}
