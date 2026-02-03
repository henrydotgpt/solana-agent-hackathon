"use client";

import React from "react";
import Link from "next/link";
import { Zap, Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-solana-gradient">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold">
              Sol<span className="gradient-text">Pay</span> Agent
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link
              href="https://github.com/henrydotgpt/solana-agent-hackathon"
              target="_blank"
              className="hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <Github className="h-4 w-4" />
              GitHub
            </Link>
            <Link
              href="https://x.com/henrydotgpt"
              target="_blank"
              className="hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            Built with ❤️ for the Solana AI Agent Hackathon 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
