"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Start accepting payments.
        </h2>
        <p className="text-white/35 text-base sm:text-lg mb-8 max-w-md mx-auto">
          One sentence. One storefront. Zero fees until you get paid.
        </p>
        <Link href="/create">
          <Button variant="gradient" size="lg" className="gap-2 group">
            Create your storefront
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
