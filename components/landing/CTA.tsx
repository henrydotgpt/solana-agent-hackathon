"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-28 sm:py-36 relative overflow-hidden">
      {/* Dramatic gradient backdrop */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-emerald-500/[0.06] via-purple-500/[0.03] to-transparent rounded-full blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <Reveal>
          <div className="relative rounded-3xl border border-white/[0.06] bg-[#0A0A10]/60 backdrop-blur-xl p-10 sm:p-16 lg:p-20 text-center overflow-hidden">
            {/* Inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-emerald-500/[0.05] rounded-full blur-[80px]" />
            <div className="absolute inset-0 dot-pattern opacity-20" />

            <div className="relative">
              <motion.h2
                className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-800 tracking-tight mb-6 leading-[1.1]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                Start accepting
                <br />
                <span className="gradient-text">payments today.</span>
              </motion.h2>

              <motion.p
                className="text-lg text-gray-500 mb-10 max-w-lg mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                One sentence. One storefront. Sixty seconds to your first payment.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row gap-3 justify-center"
              >
                <Link href="/create">
                  <Button
                    variant="gradient"
                    size="lg"
                    className="gap-2.5 group font-display font-600 text-base px-8"
                  >
                    Create your storefront
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/pay/demo-store">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/[0.08] text-gray-400 hover:text-white hover:border-white/[0.15] font-display"
                  >
                    View demo
                  </Button>
                </Link>
              </motion.div>

              <motion.p
                className="mt-6 text-sm text-gray-700"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Free to set up · 0.75% per transaction · No hidden fees
              </motion.p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
