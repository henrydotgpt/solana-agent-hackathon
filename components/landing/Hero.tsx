"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Percent } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-solana-purple/20 rounded-full blur-[100px] sm:blur-[120px] animate-pulse-orb" />
        <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-solana-green/15 rounded-full blur-[100px] sm:blur-[120px] animate-pulse-orb-alt" />
      </div>

      <div className="mx-auto px-4 sm:px-6 text-center relative z-10 max-w-4xl">
        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6 animate-fade-in-up">
          Payments infrastructure
          <br />
          <span className="gradient-text">for the AI era.</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto max-w-xl text-base sm:text-lg md:text-xl text-white/50 mb-4 leading-relaxed animate-fade-in-up delay-100">
          Describe your business. Get a complete payment storefront — hosted,
          live, and accepting money in seconds.{" "}
          <span className="text-white font-medium">
            No code. No crypto knowledge. Just revenue.
          </span>
        </p>

        {/* Pricing line */}
        <p className="text-sm text-white/30 mb-8 sm:mb-10 animate-fade-in-up delay-150">
          0.75% per transaction. No monthly fees. No minimums.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-in-up delay-200">
          <Link href="/create" className="w-full sm:w-auto">
            <Button
              variant="gradient"
              size="lg"
              className="gap-2 group w-full sm:w-auto"
            >
              Start accepting payments
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/pay/demo-store" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.04]"
            >
              See demo storefront
            </Button>
          </Link>
        </div>

        {/* Trust bar */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 sm:flex sm:items-center sm:justify-center gap-3 sm:gap-0 animate-fade-in-up delay-300">
          <TrustItem
            icon={<Shield className="h-4 w-4 text-solana-green" />}
            text="Non-custodial"
          />
          <TrustDivider />
          <TrustItem
            icon={<Percent className="h-4 w-4 text-solana-purple-light" />}
            text="0.75% flat fee"
          />
          <TrustDivider />
          <TrustItem
            icon={<span className="text-solana-green text-sm font-bold">◎</span>}
            text="Built on Solana"
          />
          <TrustDivider />
          <TrustItem
            icon={<Clock className="h-4 w-4 text-yellow-500" />}
            text="Live in 60 seconds"
          />
        </div>
      </div>
    </section>
  );
}

function TrustItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-none bg-white/[0.03] sm:bg-transparent border border-white/[0.06] sm:border-0">
      {icon}
      <span className="text-xs sm:text-sm text-white/40">{text}</span>
    </div>
  );
}

function TrustDivider() {
  return (
    <div className="hidden sm:block w-px h-4 bg-white/[0.08] mx-4" />
  );
}
