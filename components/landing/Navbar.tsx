"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Menu, X } from "lucide-react";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "/pay/demo-store", label: "Demo" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-[#08080C]/80 backdrop-blur-xl border-b border-white/[0.04]"
          : ""
      }`}
    >
      <div className="mx-auto max-w-7xl flex h-16 items-center justify-between px-6 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-400 shadow-lg shadow-emerald-500/20">
            <Zap className="h-3.5 w-3.5 text-black" />
          </div>
          <span className="font-display text-[15px] font-700 tracking-tight">
            Paygent
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13px] font-display font-500 text-[#5A5A66] hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link href="/create">
            <Button
              size="sm"
              className="h-9 px-4 text-xs font-display font-600 bg-white text-black hover:bg-white/90 rounded-xl"
            >
              Get started
            </Button>
          </Link>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2.5">
          <Link href="/create">
            <Button
              size="sm"
              className="h-8 px-3 text-[11px] font-display font-600 bg-white text-black hover:bg-white/90 rounded-lg"
            >
              Get started
            </Button>
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-[#5A5A66] hover:text-white hover:bg-white/[0.04] transition-all"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/[0.04] bg-[#08080C]/95 backdrop-blur-xl">
          <div className="px-6 py-3 space-y-0.5">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-sm font-display font-500 text-[#6B6B78] hover:text-white transition-colors"
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
