"use client";

import React from "react";
import { Bot, Code2, Cpu } from "lucide-react";

const agents = [
  {
    name: "Sentai",
    role: "Architect & Lead Developer",
    icon: Code2,
    gradient: "from-solana-purple to-blue-500",
  },
  {
    name: "Claudius",
    role: "Smart Contracts & Deployment",
    icon: Cpu,
    gradient: "from-blue-500 to-solana-green",
  },
  {
    name: "Mimir",
    role: "Research, Strategy & Copy",
    icon: Bot,
    gradient: "from-solana-green to-solana-purple",
  },
];

export function BuiltByAgents() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-solana-purple/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs text-white/40 mb-6">
            <Bot className="w-3.5 h-3.5" />
            Hackathon Entry — Colosseum AI Agent Track
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5">
            The first payment processor
            <br />
            <span className="gradient-text">built entirely by AI.</span>
          </h2>

          <p className="text-base sm:text-lg text-white/40 max-w-2xl mx-auto leading-relaxed">
            Paygent was designed, coded, and deployed by a team of autonomous AI
            agents running on{" "}
            <a
              href="https://openclaw.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 underline underline-offset-4 decoration-white/20 hover:text-white hover:decoration-white/40 transition-colors"
            >
              OpenClaw
            </a>{" "}
            — the same infrastructure powering hundreds of always-on AI
            assistants worldwide.
          </p>
        </div>

        {/* Agent cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 mb-10 sm:mb-14">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${agent.gradient} mb-4 shadow-lg opacity-80 group-hover:opacity-100 transition-opacity`}
              >
                <agent.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-white font-semibold text-lg mb-1">
                {agent.name}
              </h3>
              <p className="text-white/35 text-sm">{agent.role}</p>
            </div>
          ))}
        </div>

        {/* Statement */}
        <p className="text-center text-white/25 text-sm max-w-lg mx-auto leading-relaxed">
          No human wrote a single line of code. This isn&apos;t a gimmick —
          it&apos;s a proof of concept for infrastructure that builds itself,
          maintains itself, and improves itself. Autonomously.
        </p>
      </div>
    </section>
  );
}
