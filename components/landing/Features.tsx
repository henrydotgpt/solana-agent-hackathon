"use client";

import React from "react";
import {
  Bot,
  QrCode,
  Shield,
  ArrowRightLeft,
  Bell,
  FileCheck,
} from "lucide-react";

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-14 sm:mb-20 max-w-lg">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">
            Built for how you
            <br />
            actually work.
          </h2>
          <p className="text-white/40 leading-relaxed">
            Everything a business needs to accept crypto payments. Nothing it
            doesn&apos;t.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04] rounded-2xl overflow-hidden border border-white/[0.06]">
          <BentoCard
            icon={Bot}
            title="AI-generated storefronts"
            description="Describe your business. Get product pages, checkout flow, QR codes, and payment links — in under 60 seconds."
            className="sm:col-span-2 lg:col-span-2"
            large
          />
          <BentoCard
            icon={Shield}
            title="Non-custodial"
            description="We never touch your money. Direct wallet-to-wallet payments."
          />
          <BentoCard
            icon={QrCode}
            title="Payment links & QR"
            description="Share via WhatsApp, email, social — or scan in person. Works everywhere."
          />
          <BentoCard
            icon={ArrowRightLeft}
            title="Auto-convert"
            description="Any token → USDC via Jupiter. Stable revenue, zero volatility."
          />
          <BentoCard
            icon={Bell}
            title="Real-time alerts"
            description="Webhooks, email, or Telegram the moment you get paid."
          />
          <BentoCard
            icon={FileCheck}
            title="On-chain receipts"
            description="Verifiable, tax-ready, dispute-proof. Every transaction on the blockchain."
            className="sm:col-span-2 lg:col-span-2"
          />
          <BentoCard
            icon={ArrowRightLeft}
            title="Multi-currency"
            description="Accept SOL, USDC, USDT, and any SPL token. Customers pay how they want."
          />
        </div>
      </div>
    </section>
  );
}

function BentoCard({
  icon: Icon,
  title,
  description,
  className = "",
  large,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  className?: string;
  large?: boolean;
}) {
  return (
    <div
      className={`group bg-[#0a0a0a] p-6 sm:p-7 hover:bg-white/[0.02] transition-colors ${className}`}
    >
      <Icon
        className={`${
          large ? "h-6 w-6" : "h-5 w-5"
        } text-white/25 group-hover:text-solana-green transition-colors mb-4`}
      />
      <h3
        className={`font-semibold text-white mb-1.5 ${
          large ? "text-lg" : "text-base"
        }`}
      >
        {title}
      </h3>
      <p
        className={`text-white/35 leading-relaxed ${
          large ? "text-[15px] max-w-md" : "text-sm"
        }`}
      >
        {description}
      </p>
    </div>
  );
}
