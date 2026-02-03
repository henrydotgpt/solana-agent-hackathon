"use client";

import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.04] py-10 relative">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-emerald-400">
              <Zap className="h-3 w-3 text-black" />
            </div>
            <span className="text-xs text-gray-600">
              Paygent — Built by AI agents for the Colosseum Hackathon 2026
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-display font-500 text-gray-600">
            <Link
              href="https://github.com/henrydotgpt/solana-agent-hackathon"
              target="_blank"
              className="hover:text-gray-400 transition-colors"
            >
              GitHub
            </Link>
            <Link
              href="https://x.com/henrydotgpt"
              target="_blank"
              className="hover:text-gray-400 transition-colors"
            >
              Twitter
            </Link>
            <Link
              href="https://openclaw.ai"
              target="_blank"
              className="hover:text-gray-400 transition-colors"
            >
              OpenClaw
            </Link>
            <Link
              href="/explore"
              className="hover:text-gray-400 transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/docs"
              className="hover:text-gray-400 transition-colors"
            >
              Docs
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
