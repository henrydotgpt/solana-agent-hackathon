"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Wand2, Rocket, DollarSign } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    number: "01",
    title: "Describe Your Business",
    description:
      "Tell our AI agent what you do, what you sell, and how much you charge. Just talk to it like a friend.",
    color: "text-solana-purple",
    bg: "bg-solana-purple/10",
    border: "border-solana-purple/20",
  },
  {
    icon: Wand2,
    number: "02",
    title: "AI Builds Your Storefront",
    description:
      "The agent designs your payment page — picks the perfect layout, writes the copy, sets up Solana Pay QR codes.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
  },
  {
    icon: Rocket,
    number: "03",
    title: "Go Live Instantly",
    description:
      "Your storefront gets a unique URL. Share it anywhere — social media, email, in person. It just works.",
    color: "text-solana-green",
    bg: "bg-solana-green/10",
    border: "border-solana-green/20",
  },
  {
    icon: DollarSign,
    number: "04",
    title: "Get Paid in USDC",
    description:
      "Customers scan QR codes and pay with any Solana token. Jupiter auto-converts everything to USDC for you.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 relative"
    >
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Four steps to
            <br />
            <span className="gradient-text">start getting paid</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            No coding. No blockchain knowledge. Just describe your business and
            let the AI do the rest.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="mx-auto max-w-3xl">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative flex gap-6 pb-12 last:pb-0"
            >
              {/* Connecting line */}
              {i < steps.length - 1 && (
                <div className="absolute left-6 top-14 w-px h-[calc(100%-3.5rem)] bg-gradient-to-b from-border to-transparent" />
              )}

              {/* Icon */}
              <div
                className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${step.bg} border ${step.border}`}
              >
                <step.icon className={`h-5 w-5 ${step.color}`} />
              </div>

              {/* Content */}
              <div className="pt-0.5">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`text-xs font-mono font-bold ${step.color} opacity-60`}
                  >
                    {step.number}
                  </span>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
