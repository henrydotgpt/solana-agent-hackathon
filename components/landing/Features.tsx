"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bot,
  QrCode,
  ArrowRightLeft,
  Palette,
  BarChart3,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Setup",
    description:
      "Describe your business in plain English. Our agent analyzes your needs and builds the perfect payment page.",
    gradient: "from-solana-purple to-blue-500",
  },
  {
    icon: QrCode,
    title: "Solana Pay QR Codes",
    description:
      "Every product or service gets a unique QR code. Customers scan and pay instantly from any Solana wallet.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: ArrowRightLeft,
    title: "Auto-Convert to USDC",
    description:
      "Accept any Solana token. Jupiter automatically swaps incoming payments to USDC, so you always get stable value.",
    gradient: "from-cyan-500 to-solana-green",
  },
  {
    icon: Palette,
    title: "Beautiful Storefronts",
    description:
      "AI picks the perfect design for your business type — colors, layout, copy, everything. Professional and ready to share.",
    gradient: "from-solana-green to-emerald-500",
  },
  {
    icon: BarChart3,
    title: "Payment Dashboard",
    description:
      "Track every payment in real-time. See who paid, when, and how much. Export for your accounting.",
    gradient: "from-emerald-500 to-solana-purple",
  },
  {
    icon: Shield,
    title: "Non-Custodial",
    description:
      "Your keys, your money. Payments go directly to your wallet. We never hold or touch your funds.",
    gradient: "from-solana-purple to-pink-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Features() {
  return (
    <section id="features" className="py-24 relative">
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
            Everything you need to
            <br />
            <span className="gradient-text">accept crypto payments</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            From QR code generation to auto-conversion — the AI handles it all.
            You focus on your business.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="h-full group hover:border-border hover:bg-card/80 cursor-default">
                <CardContent className="p-6">
                  {/* Icon */}
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
