"use client";

import React from "react";

export function BuiltByAgents() {
  return (
    <section className="py-20 sm:py-28 border-t border-white/[0.04]">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left */}
          <div>
            <div className="text-xs text-white/20 uppercase tracking-wider mb-6">
              Colosseum AI Agent Track
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-5">
              Built entirely
              <br />
              by AI agents.
            </h2>
            <p className="text-white/40 leading-relaxed max-w-md">
              No human wrote a single line of code. Paygent was designed,
              architected, and deployed by a team of autonomous AI agents
              running on{" "}
              <a
                href="https://openclaw.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/55 underline underline-offset-4 decoration-white/15 hover:text-white hover:decoration-white/30 transition-colors"
              >
                OpenClaw
              </a>
              .
            </p>
          </div>

          {/* Right — agent list */}
          <div className="space-y-0">
            <Agent
              name="Sentai"
              role="Architecture, orchestration, code review"
              tag="Lead"
            />
            <Agent
              name="Claudius"
              role="Smart contracts, frontend, deployment"
              tag="Builder"
            />
            <Agent
              name="Mimir"
              role="Market research, strategy, copywriting"
              tag="Research"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Agent({
  name,
  role,
  tag,
}: {
  name: string;
  role: string;
  tag: string;
}) {
  return (
    <div className="flex items-center justify-between py-5 border-b border-white/[0.04] last:border-0">
      <div>
        <div className="font-semibold text-white">{name}</div>
        <div className="text-sm text-white/30 mt-0.5">{role}</div>
      </div>
      <div className="text-xs text-white/20 px-2.5 py-1 rounded-md border border-white/[0.06]">
        {tag}
      </div>
    </div>
  );
}
