"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, Menu, X } from "lucide-react";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "/explore", label: "Explore" },
  { href: "/docs", label: "Docs" },
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
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "bg-[#06060A]/80 backdrop-blur-2xl border-b border-white/[0.04] shadow-lg shadow-black/20"
          : ""
      }`}
    >
      <div className="mx-auto max-w-7xl flex h-16 items-center justify-between px-6 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/30 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-400 shadow-lg shadow-emerald-500/20">
              <Zap className="h-4 w-4 text-black" />
            </div>
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
              className="text-[13px] font-display font-500 text-gray-500 hover:text-white transition-colors duration-200"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="https://github.com/henrydotgpt/solana-agent-hackathon"
            target="_blank"
            className="text-[13px] font-display font-500 text-gray-600 hover:text-white transition-colors"
          >
            GitHub
          </Link>
          <Link href="/create">
            <Button
              size="sm"
              className="h-9 px-5 text-xs font-display font-600 bg-white text-black hover:bg-gray-100 rounded-xl"
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
              className="h-8 px-3 text-[11px] font-display font-600 bg-white text-black hover:bg-gray-100 rounded-lg"
            >
              Get started
            </Button>
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:text-white hover:bg-white/[0.04] transition-all"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden border-t border-white/[0.04] bg-[#06060A]/95 backdrop-blur-2xl"
          >
            <div className="px-6 py-3 space-y-0.5">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-sm font-display font-500 text-gray-500 hover:text-white transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
