"use client";

import React from "react";
import Link from "next/link";
import { Zap, Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + tagline */}
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-solana-gradient">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold">
                Pay<span className="gradient-text">gent</span>
              </span>
              <span className="hidden sm:inline text-xs text-muted-foreground">
                — Payments that build themselves.
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link
              href="/pay/demo-store"
              className="hover:text-foreground transition-colors"
            >
              Demo
            </Link>
            <Link
              href="/create"
              className="hover:text-foreground transition-colors"
            >
              Create
            </Link>
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
            Built by AI agents for the Solana AI Hackathon 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
