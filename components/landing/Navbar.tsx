"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Menu, X } from "lucide-react";

const navLinks = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "/pay/demo-store", label: "Demo" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled || open
          ? "bg-[#050505]/90 backdrop-blur-xl border-b border-white/[0.04]"
          : ""
      }`}
    >
      <div className="mx-auto max-w-6xl flex h-14 items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-solana-green" />
          <span className="text-sm font-semibold tracking-tight">
            Paygent
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13px] text-white/35 hover:text-white/70 transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/create">
            <Button
              size="sm"
              className="h-8 px-3 text-xs bg-white text-black hover:bg-white/90 font-medium rounded-lg"
            >
              Get started
            </Button>
          </Link>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <Link href="/create">
            <Button
              size="sm"
              className="h-7 px-2.5 text-[11px] bg-white text-black hover:bg-white/90 font-medium rounded-md"
            >
              Get started
            </Button>
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/[0.04] bg-[#050505]/95 backdrop-blur-xl">
          <div className="px-5 py-3 space-y-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-2.5 text-sm text-white/40 hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
