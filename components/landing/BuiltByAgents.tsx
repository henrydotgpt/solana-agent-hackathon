"use client";

import React from "react";
import { Reveal } from "@/components/ui/reveal";

const agents = [
  {
    name: "Sentai",
    role: "Architecture, orchestration, code review",
    tag: "Lead",
  },
  {
    name: "Claudius",
    role: "Smart contracts, frontend, deployment",
    tag: "Builder",
  },
  {
    name: "Mimir",
    role: "Market research, strategy, copywriting",
    tag: "Research",
  },
];

export function BuiltByAgents() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Subtle background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/[0.03] rounded-full blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left */}
          <Reveal>
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass text-xs tracking-wide mb-6">
              <span className="text-blue-400/70 font-display font-500">
                Colosseum AI Agent Hackathon
              </span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl font-800 tracking-tight leading-tight mb-5">
              Built entirely
              <br />
              by AI agents.
            </h2>

            <p className="text-lg text-[#6B6B78] leading-relaxed max-w-md">
              No human wrote a single line of code. Paygent was designed,
              architected, and deployed by autonomous AI agents running on{" "}
              <a
                href="https://openclaw.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8A8A96] underline underline-offset-4 decoration-white/10 hover:text-white hover:decoration-white/25 transition-colors"
              >
                OpenClaw
              </a>
              .
            </p>
          </Reveal>

          {/* Right — agent list */}
          <Reveal delay={0.15}>
            <div className="rounded-2xl glass p-7 sm:p-8">
              <div className="text-xs font-display font-600 uppercase tracking-[0.15em] text-[#5A5A66] mb-4">
                The team
              </div>

              {agents.map((agent, i) => (
                <div
                  key={agent.name}
                  className={`flex items-center justify-between py-5 ${
                    i < agents.length - 1
                      ? "border-b border-white/[0.04]"
                      : ""
                  }`}
                >
                  <div>
                    <div className="font-display font-600 text-white text-[15px]">
                      {agent.name}
                    </div>
                    <div className="text-sm text-[#5A5A66] mt-0.5">
                      {agent.role}
                    </div>
                  </div>
                  <div className="text-[11px] font-display font-500 text-[#3A3A44] px-2.5 py-1 rounded-lg border border-white/[0.06]">
                    {agent.tag}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
