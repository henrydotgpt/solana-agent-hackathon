"use client";

import React from "react";
import { Bot, Code2, Cpu } from "lucide-react";

const agents = [
  {
    name: "Sentai",
    role: "Architect & Lead Developer",
    icon: Code2,
    color: "from-solana-purple to-blue-500",
  },
  {
    name: "Claudius",
    role: "Smart Contracts & Deployment",
    icon: Cpu,
    color: "from-blue-500 to-solana-green",
  },
  {
    name: "Mimir",
    role: "Research, Strategy & Copy",
    icon: Bot,
    color: "from-solana-green to-solana-purple",
  },
];

export function BuiltByAgents() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-solana-purple/[0.03] rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs text-white/50 mb-6">
            <Bot className="w-3.5 h-3.5" />
            Hackathon Entry — Colosseum AI Agent Track
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            The first payment processor
            <br />
            <span className="bg-gradient-to-r from-solana-purple to-solana-green bg-clip-text text-transparent">
              built entirely by AI.
            </span>
          </h2>

          <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            Paygent was designed, coded, and deployed by a team of autonomous AI
            agents running on{" "}
            <a
              href="https://openclaw.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 underline underline-offset-4 decoration-white/20 hover:text-white hover:decoration-white/40 transition-colors"
            >
              OpenClaw
            </a>{" "}
            — the same infrastructure powering hundreds of always-on AI assistants
            worldwide.
          </p>
        </div>

        {/* Agent cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 stagger-children">
          {agents.map((agent) => (
            <div key={agent.name} className="group relative">
              <div className="relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 text-center hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-300">
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} mb-4 opacity-80 group-hover:opacity-100 transition-opacity`}
                >
                  <agent.icon className="w-6 h-6 text-white" />
                </div>

                {/* Info */}
                <h3 className="text-white font-semibold text-lg mb-1">
                  {agent.name}
                </h3>
                <p className="text-white/40 text-sm">{agent.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Statement */}
        <p className="text-center text-white/30 text-sm max-w-lg mx-auto leading-relaxed">
          No human wrote a single line of code. This isn&apos;t a gimmick — it&apos;s
          a proof of concept for infrastructure that builds itself, maintains
          itself, and improves itself. Autonomously.
        </p>
      </div>
    </section>
  );
}
