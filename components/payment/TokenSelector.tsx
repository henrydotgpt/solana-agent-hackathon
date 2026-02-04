"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SUPPORTED_TOKENS, type TokenSymbol } from "@/lib/constants";
import { ChevronDown, ArrowRightLeft, TrendingUp, Loader2 } from "lucide-react";

interface TokenRate {
  symbol: string;
  usdPrice: number;
  conversionRate: number | null; // how many of this token = product price in base currency
  conversionAmount: number | null;
}

interface TokenSelectorProps {
  selectedToken: string;
  onSelectToken: (symbol: string) => void;
  productPrice: number;
  productCurrency: "SOL" | "USDC";
  accentColor?: string;
}

export function TokenSelector({
  selectedToken,
  onSelectToken,
  productPrice,
  productCurrency,
  accentColor = "#14F195",
}: TokenSelectorProps) {
  const [open, setOpen] = useState(false);
  const [rates, setRates] = useState<Record<string, TokenRate>>({});
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch all token rates
  useEffect(() => {
    async function fetchRates() {
      try {
        const ids = SUPPORTED_TOKENS.map((t) => t.coingeckoId).join(",");
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
        );
        const data = await res.json();

        const newRates: Record<string, TokenRate> = {};

        // Get base currency USD price
        const baseToken = SUPPORTED_TOKENS.find(
          (t) => t.symbol === productCurrency
        );
        const baseUsdPrice =
          baseToken && data[baseToken.coingeckoId]
            ? data[baseToken.coingeckoId].usd
            : productCurrency === "USDC"
            ? 1
            : null;

        const productUsdValue = baseUsdPrice
          ? productPrice * baseUsdPrice
          : null;

        for (const token of SUPPORTED_TOKENS) {
          const usdPrice = data[token.coingeckoId]?.usd || 0;
          let conversionRate: number | null = null;
          let conversionAmount: number | null = null;

          if (productUsdValue && usdPrice > 0) {
            conversionAmount = productUsdValue / usdPrice;
            conversionRate = usdPrice;
          }

          // For the base currency, amount equals the product price
          if (token.symbol === productCurrency) {
            conversionAmount = productPrice;
          }

          newRates[token.symbol] = {
            symbol: token.symbol,
            usdPrice,
            conversionRate,
            conversionAmount,
          };
        }

        setRates(newRates);
      } catch (err) {
        console.error("Failed to fetch token rates:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRates();
    const interval = setInterval(fetchRates, 30000);
    return () => clearInterval(interval);
  }, [productPrice, productCurrency]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentToken = SUPPORTED_TOKENS.find((t) => t.symbol === selectedToken);
  const currentRate = rates[selectedToken];

  const formatAmount = useCallback((amount: number | null | undefined, symbol: string) => {
    if (amount == null) return "—";
    if (symbol === "BONK") return amount.toLocaleString(undefined, { maximumFractionDigits: 0 });
    if (amount < 0.001) return amount.toExponential(2);
    if (amount < 1) return amount.toFixed(4);
    if (amount < 100) return amount.toFixed(3);
    return amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Selected token button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          {/* Token icon */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{
              background: `${currentToken?.color || "#666"}15`,
              color: currentToken?.color || "#666",
              border: `1px solid ${currentToken?.color || "#666"}25`,
            }}
          >
            {currentToken?.icon || "?"}
          </div>

          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">
                {currentToken?.symbol || selectedToken}
              </span>
              {selectedToken !== productCurrency && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-gray-500 border border-white/[0.06]">
                  via Jupiter
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600">
              {loading ? (
                "Loading rates..."
              ) : currentRate?.conversionAmount != null ? (
                <>
                  {formatAmount(currentRate.conversionAmount, selectedToken)}{" "}
                  {selectedToken}
                  {selectedToken !== productCurrency && (
                    <span className="text-gray-700">
                      {" "}
                      → {productPrice} {productCurrency}
                    </span>
                  )}
                </>
              ) : (
                currentToken?.name
              )}
            </p>
          </div>
        </div>

        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border border-white/[0.06] bg-[#0C0C14] shadow-2xl shadow-black/40 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-2.5 border-b border-white/[0.04]">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="h-3 w-3 text-gray-600" />
                <span className="text-[11px] font-medium text-gray-500">
                  Pay with any token — Jupiter auto-converts
                </span>
              </div>
            </div>

            {/* Token list */}
            <div className="py-1 max-h-[280px] overflow-y-auto scrollbar-thin">
              {SUPPORTED_TOKENS.map((token) => {
                const rate = rates[token.symbol];
                const isSelected = token.symbol === selectedToken;
                const isBase = token.symbol === productCurrency;

                return (
                  <button
                    key={token.symbol}
                    onClick={() => {
                      onSelectToken(token.symbol);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-150 ${
                      isSelected
                        ? "bg-white/[0.04]"
                        : "hover:bg-white/[0.03]"
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{
                        background: `${token.color}15`,
                        color: token.color,
                        border: `1px solid ${token.color}${isSelected ? "40" : "20"}`,
                      }}
                    >
                      {token.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            isSelected ? "text-white" : "text-gray-300"
                          }`}
                        >
                          {token.symbol}
                        </span>
                        {isBase && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                            BASE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-600 truncate">
                        {token.name}
                      </p>
                    </div>

                    {/* Rate + amount */}
                    <div className="text-right flex-shrink-0">
                      {loading ? (
                        <Loader2 className="h-3 w-3 animate-spin text-gray-600" />
                      ) : rate?.conversionAmount != null ? (
                        <>
                          <p
                            className={`text-sm font-mono ${
                              isSelected ? "text-white" : "text-gray-400"
                            }`}
                          >
                            {formatAmount(rate.conversionAmount, token.symbol)}
                          </p>
                          {rate.usdPrice > 0 && (
                            <p className="text-[10px] text-gray-700 font-mono">
                              ${rate.usdPrice < 0.01
                                ? rate.usdPrice.toExponential(1)
                                : rate.usdPrice.toFixed(2)}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-xs text-gray-700">—</p>
                      )}
                    </div>

                    {/* Selected indicator */}
                    {isSelected && (
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: accentColor }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-white/[0.04]">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-3 w-3 text-gray-700" />
                <span className="text-[10px] text-gray-700">
                  Rates via CoinGecko • Swaps via Jupiter V6
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
