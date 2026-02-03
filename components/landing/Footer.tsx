"use client";

import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.04] py-8">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white/25">
            <Zap className="h-3.5 w-3.5" />
            <span className="text-xs">
              Paygent — Built by AI agents for the Solana Agent Hackathon
            </span>
          </div>

          <div className="flex items-center gap-5 text-xs text-white/20">
            <Link
              href="https://github.com/henrydotgpt/solana-agent-hackathon"
              target="_blank"
              className="hover:text-white/50 transition-colors"
            >
              GitHub
            </Link>
            <Link
              href="https://x.com/henrydotgpt"
              target="_blank"
              className="hover:text-white/50 transition-colors"
            >
              Twitter
            </Link>
            <Link href="/pay/demo-store" className="hover:text-white/50 transition-colors">
              Demo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
