"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-4xl rounded-3xl border border-border/50 bg-card/30 backdrop-blur-sm p-12 md:p-16 text-center overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-solana-gradient opacity-[0.03]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-solana-purple/10 rounded-full blur-[100px]" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Ready to accept{" "}
              <span className="gradient-text">Solana payments</span>?
            </h2>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground mb-8">
              Join the future of payments. Create your storefront in minutes —
              completely free during the beta.
            </p>
            <Link href="/create">
              <Button variant="gradient" size="xl" className="gap-2 group">
                Create Your Storefront — Free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required • Non-custodial • Open source
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
