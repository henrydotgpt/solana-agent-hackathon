"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 sm:py-28 relative">
      <div className="mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="relative rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-8 sm:p-12 md:p-16 text-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-solana-gradient opacity-[0.03]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] h-[200px] sm:h-[300px] bg-solana-purple/10 rounded-full blur-[80px] sm:blur-[100px]" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Your storefront is{" "}
              <span className="gradient-text">one sentence away.</span>
            </h2>
            <p className="mx-auto max-w-xl text-base sm:text-lg text-white/40 mb-8">
              Describe your business. We&apos;ll build the rest.
            </p>
            <Link href="/create">
              <Button
                variant="gradient"
                size="lg"
                className="gap-2 group"
              >
                Create your storefront
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <p className="mt-4 text-sm text-white/30">
              Free to set up. 0.75% per transaction. No hidden fees.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
