"use client";

import React from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";
import { AnimatedTerminal } from "@/components/ui/animated-terminal";
import { SectionGlow } from "@/components/ui/gradient-mesh";

const terminalLines = [
  { type: "command" as const, text: "paygent init --mode=autonomous", delay: 600 },
  { type: "info" as const, text: "Initializing agent squad...", delay: 400 },
  { type: "output" as const, text: "Sentai (lead)    → architecture, orchestration", delay: 200 },
  { type: "output" as const, text: "Claudius (build)  → frontend, smart contracts", delay: 200 },
  { type: "output" as const, text: "Mimir (research)  → market analysis, copywriting", delay: 400 },
  { type: "success" as const, text: "3 agents online. Zero humans coding.", delay: 600 },
  { type: "command" as const, text: "paygent build --target=production", delay: 600 },
  { type: "info" as const, text: "Scaffolding Next.js + Solana Pay...", delay: 300 },
  { type: "info" as const, text: "Generating payment routes...", delay: 300 },
  { type: "info" as const, text: "Building merchant dashboard...", delay: 300 },
  { type: "info" as const, text: "Setting up Jupiter auto-convert...", delay: 300 },
  { type: "info" as const, text: "Configuring Helius webhooks...", delay: 300 },
  { type: "success" as const, text: "Build complete. 7,000+ lines. 48 files.", delay: 500 },
  { type: "command" as const, text: "paygent deploy --network=devnet", delay: 800 },
  { type: "success" as const, text: "Deployed → paygent-solana.vercel.app ✨", delay: 0 },
];

const techStack = [
  { name: "Next.js 15", role: "Framework", icon: "⚡" },
  { name: "Solana Pay", role: "Payments", icon: "💳" },
  { name: "Jupiter V6", role: "Swaps", icon: "🔄" },
  { name: "Helius", role: "Webhooks", icon: "📡" },
  { name: "OpenClaw", role: "Agent runtime", icon: "🤖" },
  { name: "Claude", role: "AI backbone", icon: "🧠" },
];

const buildStats = [
  { label: "Lines of code", value: "7,000+", accent: "text-emerald-400" },
  { label: "Files", value: "48", accent: "text-blue-400" },
  { label: "Commits", value: "25+", accent: "text-purple-400" },
  { label: "Human code", value: "0", accent: "text-amber-400" },
];

export function BuiltByAgents() {
  return (
    <section className="py-28 sm:py-36 relative overflow-hidden">
      <div className="section-divider absolute top-0 inset-x-0" />
      <SectionGlow color="purple" position="left" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left — Animated terminal */}
          <Reveal direction="left">
            <AnimatedTerminal
              lines={terminalLines}
              typingSpeed={25}
              title="paygent — autonomous build"
              className="border border-white/[0.06] shadow-2xl shadow-black/40"
            />
          </Reveal>

          {/* Right — Story */}
          <div className="lg:sticky lg:top-24">
            <Reveal delay={0.15}>
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-purple-500/15 bg-purple-500/5 text-xs tracking-wide mb-6">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-purple-400"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-purple-400/70 font-display font-500">
                  Colosseum AI Agent Hackathon
                </span>
              </div>

              <h2 className="font-display text-4xl sm:text-5xl font-800 tracking-tight leading-tight mb-5">
                Built entirely
                <br />
                by{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-emerald-400">
                  AI agents.
                </span>
              </h2>

              <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-md">
                No human wrote a single line of code. Three autonomous agents —
                Sentai, Claudius, and Mimir — designed, built, and deployed Paygent
                from scratch on{" "}
                <a
                  href="https://openclaw.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 underline underline-offset-4 decoration-white/10 hover:text-white hover:decoration-white/25 transition-colors"
                >
                  OpenClaw
                </a>
                .
              </p>
            </Reveal>

            {/* Build stats */}
            <Reveal delay={0.25}>
              <div className="grid grid-cols-4 gap-2 mb-6">
                {buildStats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                  >
                    <div className={`text-lg font-display font-800 ${stat.accent}`}>
                      {stat.value}
                    </div>
                    <div className="text-[9px] text-gray-600 font-mono uppercase tracking-wider mt-0.5">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Reveal>

            {/* Tech stack grid */}
            <Reveal delay={0.35}>
              <div className="text-xs font-display font-600 uppercase tracking-wider text-gray-600 mb-3">
                Tech stack
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {techStack.map((tech, i) => (
                  <motion.div
                    key={tech.name}
                    className="group px-3 py-2.5 rounded-xl border border-white/[0.04] bg-[#0A0A10]/60 hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300"
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{tech.icon}</span>
                      <div>
                        <div className="text-sm font-display font-600 text-gray-300 group-hover:text-white transition-colors">
                          {tech.name}
                        </div>
                        <div className="text-[10px] text-gray-600 mt-0.5">
                          {tech.role}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
