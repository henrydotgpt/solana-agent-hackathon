"use client";

import React from "react";
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
  { type: "success" as const, text: "Build complete. 6,000+ lines. 42 files.", delay: 500 },
  { type: "command" as const, text: "paygent deploy --network=devnet", delay: 800 },
  { type: "success" as const, text: "Deployed → paygent.app ✨", delay: 0 },
];

const techStack = [
  { name: "Next.js 14", role: "Framework" },
  { name: "Solana Pay", role: "Payments" },
  { name: "Jupiter", role: "Swaps" },
  { name: "Helius", role: "Webhooks" },
  { name: "OpenClaw", role: "Agent runtime" },
  { name: "Claude", role: "AI backbone" },
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
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass text-xs tracking-wide mb-6">
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

            {/* Tech stack grid */}
            <Reveal delay={0.3}>
              <div className="text-xs font-display font-600 uppercase tracking-wider text-gray-600 mb-3">
                Tech stack
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {techStack.map((tech) => (
                  <div
                    key={tech.name}
                    className="px-3 py-2.5 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="text-sm font-display font-600 text-gray-300">
                      {tech.name}
                    </div>
                    <div className="text-[10px] text-gray-600 mt-0.5">
                      {tech.role}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
