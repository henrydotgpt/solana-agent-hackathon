"use client";

import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.04] py-10">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-5 h-5 rounded-md bg-gradient-to-br from-emerald-500 to-emerald-400">
              <Zap className="h-2.5 w-2.5 text-black" />
            </div>
            <span className="text-xs text-[#3A3A44]">
              Paygent — Built by AI agents for the Solana Agent Hackathon 2026
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-display font-500 text-[#3A3A44]">
            <Link
              href="https://github.com/henrydotgpt/solana-agent-hackathon"
              target="_blank"
              className="hover:text-[#6B6B78] transition-colors"
            >
              GitHub
            </Link>
            <Link
              href="https://x.com/henrydotgpt"
              target="_blank"
              className="hover:text-[#6B6B78] transition-colors"
            >
              Twitter
            </Link>
            <Link
              href="/pay/demo-store"
              className="hover:text-[#6B6B78] transition-colors"
            >
              Demo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
