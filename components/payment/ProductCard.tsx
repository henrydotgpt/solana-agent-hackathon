"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { StorefrontProduct } from "@/lib/types";
import { QrCode, Sparkles } from "lucide-react";

interface ProductCardProps {
  product: StorefrontProduct;
  accentColor: string;
  solPrice: number | null;
  onSelect: (product: StorefrontProduct) => void;
}

export function ProductCard({
  product,
  accentColor,
  solPrice,
  onSelect,
}: ProductCardProps) {
  const usdValue =
    product.currency === "SOL" && solPrice
      ? (product.price * solPrice).toFixed(2)
      : product.currency === "USDC"
      ? product.price.toFixed(2)
      : null;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative h-full"
    >
      {/* Hover glow */}
      <div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
        style={{ background: `linear-gradient(135deg, ${accentColor}20, transparent, ${accentColor}10)` }}
      />

      <div className="relative h-full rounded-2xl border border-white/[0.06] bg-[#0A0A10]/80 backdrop-blur-xl overflow-hidden flex flex-col group-hover:border-white/[0.12] transition-all duration-300">
        {/* Top accent + icon area */}
        {product.image ? (
          <div className="relative h-44 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A10] via-transparent to-transparent" />
          </div>
        ) : (
          <div className="relative h-28 overflow-hidden">
            {/* Gradient background */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${accentColor}15 0%, transparent 60%)`,
              }}
            />
            {/* Decorative dots */}
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: `radial-gradient(${accentColor}20 1px, transparent 1px)`,
              backgroundSize: "16px 16px",
            }} />
            {/* Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}25, ${accentColor}10)`,
                  boxShadow: `0 4px 20px ${accentColor}15`,
                }}
              >
                <Sparkles className="h-6 w-6" style={{ color: accentColor }} />
              </div>
            </div>
            {/* Bottom fade */}
            <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-[#0A0A10] to-transparent" />
          </div>
        )}

        <div className="p-5 flex flex-col flex-1">
          {/* Name + currency badge */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-[15px] font-semibold leading-tight text-white group-hover:text-white transition-colors">
              {product.name}
            </h3>
            <Badge
              className="text-[10px] flex-shrink-0 font-mono border"
              style={{
                borderColor: `${accentColor}30`,
                color: accentColor,
                background: `${accentColor}08`,
              }}
            >
              {product.currency}
            </Badge>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-gray-500 mb-4 flex-1 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Price */}
          <div className="mb-5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight text-white">
                {product.price}
              </span>
              <span className="text-sm text-gray-500 font-medium">
                {product.currency}
              </span>
            </div>
            {usdValue && (
              <p className="text-xs text-gray-600 mt-0.5">
                ≈ ${usdValue} USD
              </p>
            )}
          </div>

          {/* Pay button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(product)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-black transition-all duration-200"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
              boxShadow: `0 2px 12px ${accentColor}30`,
            }}
          >
            <QrCode className="h-4 w-4" />
            Pay Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
