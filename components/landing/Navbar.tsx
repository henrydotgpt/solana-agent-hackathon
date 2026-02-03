"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl animate-fade-in-down">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-solana-gradient">
            <Zap className="h-4 w-4 text-white" />
            <div className="absolute inset-0 rounded-lg bg-solana-gradient opacity-0 blur-lg transition-opacity group-hover:opacity-50" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Pay<span className="gradient-text">gent</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#how-it-works"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="#features"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/pay/demo-store"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Demo
          </Link>
        </div>

        {/* CTA */}
        <Link href="/create">
          <Button variant="gradient" size="sm">
            Create Storefront
          </Button>
        </Link>
      </div>
    </nav>
  );
}
