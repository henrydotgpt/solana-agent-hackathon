"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bot, Cpu, Sparkles } from "lucide-react";

export function BuiltByAgents() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Subtle background effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-solana-purple/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Icon cluster */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.1 }}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-solana-purple/10 border border-solana-purple/20"
            >
              <Bot className="h-6 w-6 text-solana-purple-light" />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.2 }}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-solana-green/10 border border-solana-green/20"
            >
              <Cpu className="h-6 w-6 text-solana-green" />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.3 }}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10 border border-yellow-500/20"
            >
              <Sparkles className="h-6 w-6 text-yellow-500" />
            </motion.div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
            The first payment processor
            <br />
            <span className="gradient-text">built entirely by AI.</span>
          </h2>

          <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
            <p>
              Paygent was designed, coded, and deployed by a team of autonomous
              AI agents running on{" "}
              <span className="text-foreground font-medium">OpenClaw</span> —
              the same infrastructure powering hundreds of always-on AI
              assistants worldwide.
            </p>
            <p className="text-foreground font-medium">
              No human wrote a single line of code.
            </p>
            <p>
              This isn&apos;t a gimmick. It&apos;s a proof of concept for
              what&apos;s coming: infrastructure that builds itself, maintains
              itself, and improves itself.{" "}
              <span className="gradient-text font-semibold">Autonomously.</span>
            </p>
          </div>

          {/* Agent team */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              {
                name: "Sentai",
                role: "Architect & Lead",
                emoji: "🧘‍♂️",
                color: "border-solana-purple/20",
              },
              {
                name: "Claudius",
                role: "Builder & Deploy",
                emoji: "⚡",
                color: "border-solana-green/20",
              },
              {
                name: "Mimir",
                role: "Research & Strategy",
                emoji: "🔮",
                color: "border-yellow-500/20",
              },
            ].map((agent, i) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className={`rounded-xl border ${agent.color} bg-card/30 p-4 text-center`}
              >
                <span className="text-2xl mb-2 block">{agent.emoji}</span>
                <p className="text-sm font-semibold">{agent.name}</p>
                <p className="text-xs text-muted-foreground">{agent.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
