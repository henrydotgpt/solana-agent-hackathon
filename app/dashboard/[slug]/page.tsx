"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Storefront, PaymentRecord } from "@/lib/types";
import type { Notification } from "@/lib/store";
import { truncateAddress, formatCurrency } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Zap,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Clock,
  Check,
  Bell,
  ExternalLink,
  Copy,
  RefreshCw,
  AlertCircle,
  ArrowRightLeft,
  Code2,
  Share2,
} from "lucide-react";

interface DashboardData {
  storefront: Storefront;
  stats: {
    totalPayments: number;
    confirmedPayments: number;
    pendingPayments: number;
    totalSOL: number;
    totalUSDC: number;
    feesSOL: number;
    feesUSDC: number;
    feeBps: number;
    merchantSOL: number;
    merchantUSDC: number;
    recentPayments: PaymentRecord[];
  };
  notifications: Notification[];
  unreadCount: number;
}

export default function DashboardPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showNotifs, setShowNotifs] = useState(false);

  const fetchDashboard = useCallback(
    async (showRefresh = false) => {
      if (showRefresh) setRefreshing(true);
      try {
        const res = await fetch(`/api/dashboard/${slug}`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError(json.error || "Failed to load dashboard");
        }
      } catch {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [slug]
  );

  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch("/api/quote?amount=1&direction=sol-to-usdc");
        const json = await res.json();
        if (json.success) setSolPrice(json.data.rate);
      } catch {}
    }
    fetchRate();
    const interval = setInterval(fetchRate, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(() => fetchDashboard(), 10000);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  // Loading state with skeleton
  if (loading) {
    return (
      <main className="min-h-screen bg-[#08080C]">
        <div className="border-b border-white/[0.04] h-14 bg-[#0A0A10]/80 backdrop-blur-xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-white/[0.04]" />
              <div className="space-y-2">
                <div className="h-6 w-48 rounded bg-white/[0.04]" />
                <div className="h-4 w-32 rounded bg-white/[0.03]" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 rounded-2xl bg-white/[0.03] border border-white/[0.04]" />
              ))}
            </div>
            <div className="h-64 rounded-2xl bg-white/[0.03] border border-white/[0.04]" />
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <main className="min-h-screen bg-[#08080C] flex items-center justify-center">
        <div className="max-w-md w-full mx-4 rounded-2xl border border-white/[0.06] bg-[#0A0A10]/80 backdrop-blur-xl p-8 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 mb-4">
            <AlertCircle className="h-7 w-7 text-red-400" />
          </div>
          <h2 className="text-xl font-display font-700 text-white mb-2">Dashboard Not Found</h2>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <Link href="/">
            <Button variant="gradient">Back to Paygent</Button>
          </Link>
        </div>
      </main>
    );
  }

  const { storefront, stats, notifications, unreadCount } = data;
  const totalUSD = stats.totalSOL * (solPrice || 0) + stats.totalUSDC;
  const merchantUSD = stats.merchantSOL * (solPrice || 0) + stats.merchantUSDC;
  const feesUSD = stats.feesSOL * (solPrice || 0) + stats.feesUSDC;
  const payLink = typeof window !== "undefined" ? `${window.location.origin}/pay/${storefront.slug}` : `/pay/${storefront.slug}`;
  const widgetCode = `<script src="${typeof window !== "undefined" ? window.location.origin : ""}/api/widget/${storefront.slug}"></script>`;

  return (
    <main className="min-h-screen bg-[#08080C]">
      {/* Header bar */}
      <div className="border-b border-white/[0.04] bg-[#0A0A10]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
          <Link
            href={`/pay/${storefront.slug}`}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">View Storefront</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-display font-600 text-white">Dashboard</span>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.04] transition-all"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-black">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifs && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-white/[0.06] bg-[#0C0C14] backdrop-blur-xl shadow-2xl shadow-black/40 z-50"
                  >
                    <div className="p-4 border-b border-white/[0.04]">
                      <h4 className="text-sm font-display font-600 text-white">Notifications</h4>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-sm text-gray-600">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-3.5 border-b border-white/[0.03] last:border-0 ${
                              !notif.read ? "bg-emerald-500/[0.03]" : ""
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <div
                                className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                                  !notif.read ? "bg-emerald-400" : "bg-transparent"
                                }`}
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-500 text-gray-300">{notif.title}</p>
                                <p className="text-xs text-gray-600 mt-0.5">{notif.message}</p>
                                <p className="text-[10px] text-gray-700 mt-1 font-mono">
                                  {new Date(notif.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => fetchDashboard(true)}
              disabled={refreshing}
              className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.04] transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Storefront header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            {storefront.logo ? (
              <img
                src={storefront.logo}
                alt={storefront.businessName}
                className="h-14 w-14 rounded-2xl object-cover ring-1 ring-white/[0.06]"
              />
            ) : (
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ring-white/[0.06]"
                style={{
                  background: `linear-gradient(135deg, ${storefront.theme.accentColor}, ${storefront.theme.accentColor}88)`,
                }}
              >
                <span className="text-xl font-bold text-white">
                  {storefront.businessName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-display font-800 text-white">{storefront.businessName}</h1>
              <p className="text-sm text-gray-600 font-mono">
                {storefront.products.length} products · {truncateAddress(storefront.walletAddress, 6)}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleCopy(payLink, "link")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] text-sm text-gray-400 hover:text-white transition-all"
          >
            {copied === "link" ? (
              <><Check className="h-3.5 w-3.5 text-emerald-400" /> Copied!</>
            ) : (
              <><Copy className="h-3.5 w-3.5" /> Copy Link</>
            )}
          </button>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8"
        >
          <StatCard
            icon={DollarSign}
            label="Your Revenue"
            value={`$${merchantUSD.toFixed(2)}`}
            sub={`${stats.merchantSOL.toFixed(4)} SOL + ${stats.merchantUSDC.toFixed(2)} USDC`}
            accentColor="#14F195"
          />
          <StatCard
            icon={TrendingUp}
            label="Total Processed"
            value={`$${totalUSD.toFixed(2)}`}
            sub={`${stats.confirmedPayments} confirmed`}
            accentColor="#9945FF"
          />
          <StatCard
            icon={Clock}
            label="Pending"
            value={stats.pendingPayments.toString()}
            sub="awaiting confirmation"
            accentColor="#FFB020"
          />
          <StatCard
            icon={ArrowRightLeft}
            label={`Platform Fee (${(stats.feeBps / 100).toFixed(2)}%)`}
            value={`$${feesUSD.toFixed(2)}`}
            sub={`${stats.feesSOL.toFixed(4)} SOL + ${stats.feesUSDC.toFixed(2)} USDC`}
            accentColor="#4FC3F7"
          />
        </motion.div>

        {/* Revenue Chart + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2 rounded-2xl border border-white/[0.04] bg-[#0A0A10]/80 backdrop-blur-sm p-6"
          >
            <div className="mb-4">
              <h3 className="text-base font-display font-700 text-white">Revenue Over Time</h3>
              <p className="text-xs text-gray-600 mt-0.5">Payment volume (last 7 days)</p>
            </div>
            <RevenueChart payments={stats.recentPayments} solPrice={solPrice} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            {/* Share card */}
            <div className="rounded-2xl border border-white/[0.04] bg-[#0A0A10]/80 backdrop-blur-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Share2 className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-display font-600 text-white">Share</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] mb-3">
                <p className="font-mono text-[11px] text-emerald-400/80 break-all leading-relaxed">
                  {payLink}
                </p>
              </div>
              <button
                onClick={() => handleCopy(payLink, "share")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] text-sm text-gray-400 hover:text-white transition-all"
              >
                {copied === "share" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied === "share" ? "Copied!" : "Copy Link"}
              </button>
            </div>

            {/* Embed Widget card */}
            <div className="rounded-2xl border border-white/[0.04] bg-[#0A0A10]/80 backdrop-blur-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Code2 className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-display font-600 text-white">Embed Widget</span>
                <span className="ml-auto text-[10px] font-mono text-gray-700 px-2 py-0.5 rounded-full border border-white/[0.06] bg-white/[0.02]">
                  1 line
                </span>
              </div>
              <pre className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] mb-3 overflow-x-auto">
                <code className="text-[10px] text-gray-500 font-mono leading-relaxed">
                  {widgetCode}
                </code>
              </pre>
              <button
                onClick={() => handleCopy(widgetCode, "widget")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] text-sm text-gray-400 hover:text-white transition-all"
              >
                {copied === "widget" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied === "widget" ? "Copied!" : "Copy Embed Code"}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Recent payments */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-white/[0.04] bg-[#0A0A10]/80 backdrop-blur-sm overflow-hidden"
        >
          <div className="p-6 border-b border-white/[0.04]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-display font-700 text-white">Recent Payments</h3>
                <p className="text-xs text-gray-600 mt-0.5">Real-time tracking via Helius webhooks</p>
              </div>
              {solPrice && (
                <span className="text-xs font-mono text-gray-600 px-3 py-1 rounded-full border border-white/[0.04] bg-white/[0.02]">
                  ◎ 1 SOL ≈ ${solPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {stats.recentPayments.length === 0 && stats.pendingPayments === 0 ? (
              <div className="py-16 text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/[0.04] mb-4">
                  <ArrowRightLeft className="h-7 w-7 text-gray-700" />
                </div>
                <p className="text-gray-400 font-display font-500">No payments yet</p>
                <p className="text-sm text-gray-600 mt-1">
                  Share your storefront link to start receiving payments
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {/* Desktop header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-[11px] font-600 text-gray-600 uppercase tracking-wider font-display">
                  <div className="col-span-2">Status</div>
                  <div className="col-span-3">From</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-2">Currency</div>
                  <div className="col-span-3">Time</div>
                </div>

                {stats.recentPayments.map((payment, i) => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 * i }}
                  >
                    {/* Desktop row */}
                    <div className="hidden md:grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-xl hover:bg-white/[0.02] transition-colors group">
                      <div className="col-span-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-500 ${
                          payment.status === "confirmed"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                            : "bg-white/[0.03] text-gray-500 border border-white/[0.06]"
                        }`}>
                          {payment.status === "confirmed" ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                          {payment.status}
                        </span>
                      </div>
                      <div className="col-span-3 font-mono text-xs text-gray-500">
                        {payment.payer ? truncateAddress(payment.payer, 6) : "—"}
                      </div>
                      <div className="col-span-2 font-display font-600 text-white text-sm">
                        {payment.amount}
                      </div>
                      <div className="col-span-2">
                        <span className="text-xs font-mono text-gray-500 px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.04]">
                          {payment.currency}
                        </span>
                      </div>
                      <div className="col-span-3 flex items-center justify-between">
                        <span className="text-xs text-gray-600 font-mono">
                          {formatTimeAgo(payment.createdAt)}
                        </span>
                        {payment.signature && (
                          <a
                            href={`https://explorer.solana.com/tx/${payment.signature}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 hover:text-emerald-400"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Mobile card */}
                    <div className="md:hidden rounded-xl border border-white/[0.04] bg-white/[0.01] p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-500 ${
                          payment.status === "confirmed"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                            : "bg-white/[0.03] text-gray-500 border border-white/[0.06]"
                        }`}>
                          {payment.status === "confirmed" ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          {payment.status}
                        </span>
                        <span className="text-xs text-gray-600 font-mono">
                          {formatTimeAgo(payment.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="font-display font-600 text-white">
                          {payment.amount} <span className="text-xs text-gray-500">{payment.currency}</span>
                        </span>
                        <span className="font-mono text-[11px] text-gray-600">
                          {payment.payer ? truncateAddress(payment.payer, 4) : "—"}
                        </span>
                      </div>
                      {payment.signature && (
                        <a
                          href={`https://explorer.solana.com/tx/${payment.signature}?cluster=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-emerald-400/70 flex items-center gap-1 hover:text-emerald-400 transition-colors"
                        >
                          View on explorer <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}

/* ─── Stat Card ──────────────────────── */

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accentColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  accentColor: string;
}) {
  return (
    <motion.div
      className="group rounded-2xl border border-white/[0.04] bg-[#0A0A10]/80 backdrop-blur-sm hover:border-white/[0.08] transition-all duration-500 overflow-hidden"
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-600 font-display font-500 mb-1.5">{label}</p>
            <p className="text-2xl font-display font-800 text-white tracking-tight">{value}</p>
            <p className="text-[11px] text-gray-600 mt-1.5 font-mono">{sub}</p>
          </div>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.04] group-hover:border-white/[0.08] transition-all"
            style={{ backgroundColor: `${accentColor}10` }}
          >
            <Icon className="h-5 w-5" style={{ color: accentColor }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/* ─── Revenue Chart ──────────────────── */

function RevenueChart({
  payments,
  solPrice,
}: {
  payments: PaymentRecord[];
  solPrice: number | null;
}) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" });
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const dayEnd = dayStart + 86400000;

    const dayPayments = payments.filter(
      (p) => p.createdAt >= dayStart && p.createdAt < dayEnd && p.status === "confirmed"
    );

    let revenue = 0;
    for (const p of dayPayments) {
      if (p.currency === "USDC") revenue += p.amount;
      else revenue += p.amount * (solPrice || 0);
    }

    return {
      day: dayLabel,
      revenue: Math.round(revenue * 100) / 100,
      payments: dayPayments.length,
    };
  });

  const hasData = days.some((d) => d.revenue > 0);
  const chartData = hasData
    ? days
    : days.map((d, i) => ({
        ...d,
        revenue: [12, 28, 19, 45, 38, 52, 41][i],
        payments: [2, 4, 3, 6, 5, 7, 5][i],
      }));

  return (
    <div>
      {!hasData && (
        <p className="text-[11px] text-gray-700 mb-3 italic font-mono">
          Sample data — real payments will appear here
        </p>
      )}
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14F195" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#14F195" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#444", fontSize: 11, fontFamily: "monospace" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#444", fontSize: 11, fontFamily: "monospace" }}
            tickFormatter={(v) => `$${v}`}
          />
          <RechartsTooltip
            contentStyle={{
              background: "#0C0C14",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "12px",
              fontSize: "12px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
            labelStyle={{ color: "#666", fontFamily: "monospace" }}
            formatter={(value: any) => [`$${Number(value || 0).toFixed(2)}`, "Revenue"]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#14F195"
            strokeWidth={2}
            fill="url(#revenueGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
