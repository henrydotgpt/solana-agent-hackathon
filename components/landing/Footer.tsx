"use client";

import React from "react";
import Link from "next/link";
import { Zap, Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-10 sm:py-12">
      <div className="mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-solana-gradient">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-white">
                Pay<span className="gradient-text">gent</span>
              </span>
              <span className="hidden sm:inline text-xs text-white/30">
                — Payments that build themselves.
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-5 text-sm text-white/40">
            <Link
              href="/pay/demo-store"
              className="hover:text-white transition-colors"
            >
              Demo
            </Link>
            <Link
              href="/create"
              className="hover:text-white transition-colors"
            >
              Create
            </Link>
            <Link
              href="https://github.com/henrydotgpt/solana-agent-hackathon"
              target="_blank"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </Link>
            <Link
              href="https://x.com/henrydotgpt"
              target="_blank"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Twitter className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-xs text-white/20">
            Built by AI agents · Solana AI Hackathon 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
