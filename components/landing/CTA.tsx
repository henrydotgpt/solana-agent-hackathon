"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      {/* Gradient mesh */}
      <div className="absolute inset-0 gradient-mesh opacity-50" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <Reveal>
          <div className="rounded-3xl glass p-10 sm:p-16 text-center relative overflow-hidden">
            {/* Inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-emerald-500/[0.06] rounded-full blur-[80px]" />

            <div className="relative">
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-800 tracking-tight mb-5">
                Start accepting payments.
              </h2>
              <p className="text-lg text-[#6B6B78] mb-8 max-w-md mx-auto">
                One sentence. One storefront. Zero fees until you get paid.
              </p>
              <Link href="/create">
                <Button
                  variant="gradient"
                  size="lg"
                  className="gap-2.5 group font-display font-600"
                >
                  Create your storefront
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <p className="mt-5 text-sm text-[#3A3A44]">
                Free to set up · 0.75% per transaction · No hidden fees
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
