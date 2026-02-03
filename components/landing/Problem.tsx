"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";
import { SectionGlow } from "@/components/ui/gradient-mesh";

const competitors = [
  { name: "PayPal", fee: "3.49%", annual: 4188, color: "from-red-500/30 to-red-400/10", pct: 100 },
  { name: "Stripe", fee: "2.9% + 30¢", annual: 3516, color: "from-orange-500/25 to-orange-400/10", pct: 84 },
  { name: "Square", fee: "2.6%", annual: 3156, color: "from-yellow-500/20 to-yellow-400/10", pct: 75 },
  { name: "Shopify", fee: "2.4%", annual: 2880, color: "from-amber-500/20 to-amber-400/10", pct: 69 },
];

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export function Problem() {
  const barsRef = useRef<HTMLDivElement>(null);
  const barsInView = useInView(barsRef, { once: true, margin: "-50px" });

  return (
    <section className="py-28 sm:py-36 relative overflow-hidden">
      <div className="section-divider absolute top-0 inset-x-0" />
      <SectionGlow color="purple" position="right" size="lg" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left — Visual comparison */}
          <div ref={barsRef} className="order-2 lg:order-1">
            <div className="space-y-5">
              {competitors.map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, x: -30 }}
                  animate={barsInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <div className="flex items-baseline gap-3">
                      <span className="text-sm font-display font-500 text-gray-500">
                        {c.name}
                      </span>
                      <span className="text-xs text-gray-700 font-mono">{c.fee}</span>
                    </div>
                    <span className="text-sm font-mono text-gray-600">
                      ${c.annual.toLocaleString()}<span className="text-gray-700">/yr</span>
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/[0.03] overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${c.color}`}
                      initial={{ width: 0 }}
                      animate={barsInView ? { width: `${c.pct}%` } : { width: 0 }}
                      transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </motion.div>
              ))}

              {/* Paygent bar — green, glowing */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={barsInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="pt-5 mt-5 border-t border-white/[0.06]"
              >
                <div className="flex items-baseline justify-between mb-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-sm font-display font-700 text-white">
                      Paygent
                    </span>
                    <span className="text-xs text-emerald-400/60 font-mono">0.75%</span>
                  </div>
                  <span className="text-sm font-mono text-emerald-400 font-600">
                    $900<span className="text-emerald-400/40">/yr</span>
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-white/[0.03] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_20px_rgba(20,241,149,0.3)]"
                    initial={{ width: 0 }}
                    animate={barsInView ? { width: "22%" } : { width: 0 }}
                    transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right — Copy */}
          <div className="order-1 lg:order-2">
            <Reveal>
              <p className="text-xs font-display font-600 uppercase tracking-[0.2em] text-purple-400/70 mb-5">
                The problem
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-800 tracking-tight leading-tight mb-6">
                You&apos;re overpaying
                <br />
                <span className="text-gray-600">for payments.</span>
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-md">
                Traditional processors charge 2-3% plus fixed fees, require
                developer setup, and hold your money for days. You deserve better.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="rounded-2xl glass-strong p-6 gradient-border">
                <div className="text-xs text-emerald-400/60 uppercase tracking-wider font-display font-600 mb-2">
                  Your annual savings at $10K/mo
                </div>
                <div className="font-display text-5xl font-800 gradient-text">
                  $<AnimatedCounter value={2616} />
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  vs Stripe · instant settlement · no lock-in
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
