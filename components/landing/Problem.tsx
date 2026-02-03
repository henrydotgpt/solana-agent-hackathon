"use client";

import React from "react";
import { motion } from "framer-motion";

export function Problem() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-8">
            Payment processors{" "}
            <span className="gradient-text">weren&apos;t built for you.</span>
          </h2>

          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Stripe takes{" "}
              <span className="text-foreground font-semibold">
                2.9% + 30¢
              </span>
              . PayPal takes{" "}
              <span className="text-foreground font-semibold">3.49%</span>.
              Square takes{" "}
              <span className="text-foreground font-semibold">2.6%</span>.
              You&apos;re paying thousands per year in fees for infrastructure
              designed for Fortune 500 companies.
            </p>

            <p>
              Paygent charges{" "}
              <span className="gradient-text font-bold text-xl">0.75%</span>.
              Flat. That&apos;s it.
            </p>
          </div>

          {/* Savings callout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 rounded-2xl border border-solana-green/20 bg-solana-green/[0.03] p-8"
          >
            <p className="text-sm text-solana-green font-medium uppercase tracking-wider mb-2">
              For a business doing $10,000/month
            </p>
            <p className="text-4xl sm:text-5xl font-bold gradient-text mb-2">
              $217/month saved.
            </p>
            <p className="text-muted-foreground">
              Every month. Forever.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
