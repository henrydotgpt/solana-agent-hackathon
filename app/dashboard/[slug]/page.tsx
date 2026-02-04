"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Storefront, PaymentRecord } from "@/lib/types";
import type { Notification } from "@/lib/store";
import { truncateAddress, formatCurrency } from "@/lib/utils";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
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
  Users,
  ShoppingBag,
  Activity,
  Timer,
} from "lucide-react";

interface ProductStat {
  name: string;
  count: number;
  revenueSOL: number;
  revenueUSDC: number;
}

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
    productStats: ProductStat[];
    uniquePayers: number;
    avgConfirmMs: number;
    conversionRate: number;
  };
  notifications: Notification[];
  unreadCount: number;
}

const CHART_COLORS = ["#14F195", "#9945FF", "#4FC3F7", "#FFB020", "#FF6B9D", "#8B5CF6"];

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
  const [chartTab, setChartTab] = useState<"revenue" | "volume">("revenue");

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

  // Compute chart data
  const chartData = useMemo(() => {
    if (!data) return [];
    const payments = data.stats.recentPayments;
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" });
      const dateLabel = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
        date: dateLabel,
        revenue: Math.round(revenue * 100) / 100,
        payments: dayPayments.length,
      };
    });
  }, [data, solPrice]);

  // Loading skeleton
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 rounded-2xl bg-white/[0.03] border border-white/[0.04]" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="lg:col-span-2 h-80 rounded-2xl bg-white/[0.03] border border-white/[0.04]" />
              <div className="h-80 rounded-2xl bg-white/[0.03] border border-white/[0.04]" />
            </div>
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
  const avgTransactionUSD = stats.confirmedPayments > 0 ? totalUSD / stats.confirmedPayments : 0;
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
            <span className="text-sm font-display font-600 text-white">Analytics</span>
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
                        <div className="p-8 text-center text-sm text-gray-600">No notifications yet</div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-3.5 border-b border-white/[0.03] last:border-0 ${!notif.read ? "bg-emerald-500/[0.03]" : ""}`}
                          >
                            <div className="flex items-start gap-2.5">
                              <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!notif.read ? "bg-emerald-400" : "bg-transparent"}`} />
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
              <img src={storefront.logo} alt={storefront.businessName} className="h-14 w-14 rounded-2xl object-cover ring-1 ring-white/[0.06]" />
            ) : (
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ring-white/[0.06]"
                style={{ background: `linear-gradient(135deg, ${storefront.theme.accentColor}, ${storefront.theme.accentColor}88)` }}
              >
                <span className="text-xl font-bold text-white">{storefront.businessName.charAt(0).toUpperCase()}</span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-display font-800 text-white">{storefront.businessName}</h1>
              <p className="text-sm text-gray-600 font-mono">
                {storefront.products.length} products · {truncateAddress(storefront.walletAddress, 6)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {solPrice && (
              <span className="text-xs font-mono text-gray-600 px-3 py-1.5 rounded-lg border border-white/[0.04] bg-white/[0.02]">
                ◎ 1 SOL ≈ ${solPrice.toFixed(2)}
              </span>
            )}
            <button
              onClick={() => handleCopy(payLink, "link")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] text-sm text-gray-400 hover:text-white transition-all"
            >
              {copied === "link" ? <><Check className="h-3.5 w-3.5 text-emerald-400" /> Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy Link</>}
            </button>
          </div>
        </motion.div>

        {/* ─── Stats Grid (6 cards) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6"
        >
          <StatCard icon={DollarSign} label="Revenue" value={`$${merchantUSD.toFixed(2)}`} sub={`${stats.merchantSOL.toFixed(4)} SOL + ${stats.merchantUSDC.toFixed(2)} USDC`} color="#14F195" />
          <StatCard icon={TrendingUp} label="Total Processed" value={`$${totalUSD.toFixed(2)}`} sub={`${stats.confirmedPayments} confirmed`} color="#9945FF" />
          <StatCard icon={ShoppingBag} label="Avg Transaction" value={`$${avgTransactionUSD.toFixed(2)}`} sub={`per payment`} color="#4FC3F7" />
          <StatCard icon={Users} label="Unique Payers" value={stats.uniquePayers.toString()} sub={`${stats.confirmedPayments} total txns`} color="#FFB020" />
          <StatCard icon={Activity} label="Conversion" value={`${(stats.conversionRate * 100).toFixed(0)}%`} sub={`${stats.confirmedPayments}/${stats.totalPayments} payments`} color="#FF6B9D" />
          <StatCard icon={Timer} label="Avg Confirm" value={stats.avgConfirmMs > 0 ? `${(stats.avgConfirmMs / 1000).toFixed(1)}s` : "—"} sub="on-chain finality" color="#8B5CF6" />
        </motion.div>

        {/* ─── Charts Row ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6">
          {/* Revenue / Volume chart (2/3 width) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 rounded-2xl border border-white/[0.04] bg-[#0A0A10]/80 backdrop-blur-sm p-6"
          >
            {/* Chart tabs */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-display font-700 text-white">Performance</h3>
                <p className="text-xs text-gray-600 mt-0.5">Last 7 days</p>
              </div>
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <button
                  onClick={() => setChartTab("revenue")}
                  className={`px-3 py-1 rounded-md text-[11px] font-display font-500 transition-all ${
                    chartTab === "revenue"
                      ? "bg-white/[0.06] text-white border border-white/[0.08]"
                      : "text-gray-600 hover:text-gray-400"
                  }`}
                >
                  Revenue
                </button>
                <button
                  onClick={() => setChartTab("volume")}
                  className={`px-3 py-1 rounded-md text-[11px] font-display font-500 transition-all ${
                    chartTab === "volume"
                      ? "bg-white/[0.06] text-white border border-white/[0.08]"
                      : "text-gray-600 hover:text-gray-400"
                  }`}
                >
                  Volume
                </button>
              </div>
            </div>

            {chartTab === "revenue" ? (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14F195" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#14F195" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#444", fontSize: 11, fontFamily: "monospace" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#444", fontSize: 11, fontFamily: "monospace" }} tickFormatter={(v) => `$${v}`} />
                  <RechartsTooltip content={<CustomTooltip type="revenue" />} />
                  <Area type="monotone" dataKey="revenue" stroke="#14F195" strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ r: 3, fill: "#14F195", stroke: "#0A0A10", strokeWidth: 2 }} activeDot={{ r: 5, fill: "#14F195", stroke: "#0A0A10", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData} barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#444", fontSize: 11, fontFamily: "monospace" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#444", fontSize: 11, fontFamily: "monospace" }} allowDecimals={false} />
                  <RechartsTooltip content={<CustomTooltip type="volume" />} />
                  <Bar dataKey="payments" radius={[6, 6, 0, 0]} maxBarSize={40}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={`rgba(153, 69, 255, ${0.4 + (i / chartData.length) * 0.6})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Top Products (1/3 width) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-white/[0.04] bg-[#0A0A10]/80 backdrop-blur-sm p-6"
          >
            <div className="mb-5">
              <h3 className="text-base font-display font-700 text-white">Top Products</h3>
              <p className="text-xs text-gray-600 mt-0.5">By number of sales</p>
            </div>

            {stats.productStats.length === 0 ? (
              <div className="py-12 text-center">
                <ShoppingBag className="h-8 w-8 text-gray-800 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No sales data yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.productStats.map((product, i) => {
                  const productUSD = product.revenueSOL * (solPrice || 0) + product.revenueUSDC;
                  const maxCount = stats.productStats[0]?.count || 1;
                  const barWidth = (product.count / maxCount) * 100;

                  return (
                    <div key={i} className="group">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-gray-300 font-500 truncate max-w-[140px]">
                          {product.name}
                        </span>
                        <span className="text-xs text-gray-500 font-mono flex-shrink-0 ml-2">
                          {product.count} sale{product.count !== 1 ? "s" : ""}
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="relative h-7 rounded-lg bg-white/[0.02] border border-white/[0.03] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${barWidth}%` }}
                          transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                          className="absolute inset-y-0 left-0 rounded-lg"
                          style={{
                            background: `linear-gradient(90deg, ${CHART_COLORS[i % CHART_COLORS.length]}20, ${CHART_COLORS[i % CHART_COLORS.length]}40)`,
                            borderRight: `2px solid ${CHART_COLORS[i % CHART_COLORS.length]}60`,
                          }}
                        />
                        <div className="relative flex items-center justify-between h-full px-3">
                          <span className="text-[11px] font-mono text-gray-500">
                            {product.revenueSOL > 0 ? `${product.revenueSOL.toFixed(2)} SOL` : ""}
                            {product.revenueSOL > 0 && product.revenueUSDC > 0 ? " + " : ""}
                            {product.revenueUSDC > 0 ? `${product.revenueUSDC.toFixed(0)} USDC` : ""}
                          </span>
                          <span className="text-[11px] font-mono font-600" style={{ color: CHART_COLORS[i % CHART_COLORS.length] }}>
                            ${productUSD.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* ─── Quick Actions + Payments Table ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-6">
          {/* Side panel — share + embed */}
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
                <p className="font-mono text-[11px] text-emerald-400/80 break-all leading-relaxed">{payLink}</p>
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
                <span className="text-sm font-display font-600 text-white">Embed</span>
              </div>
              <pre className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] mb-3 overflow-x-auto">
                <code className="text-[10px] text-gray-500 font-mono leading-relaxed">{widgetCode}</code>
              </pre>
              <button
                onClick={() => handleCopy(widgetCode, "widget")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] text-sm text-gray-400 hover:text-white transition-all"
              >
                {copied === "widget" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied === "widget" ? "Copied!" : "Copy Code"}
              </button>
            </div>

            {/* Fee summary */}
            <div className="rounded-2xl border border-white/[0.04] bg-[#0A0A10]/80 backdrop-blur-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <ArrowRightLeft className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-display font-600 text-white">Fees</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform fee</span>
                  <span className="font-mono text-gray-400">{(stats.feeBps / 100).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fees collected</span>
                  <span className="font-mono text-gray-400">${feesUSD.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/[0.04] pt-2 flex justify-between font-500">
                  <span className="text-gray-400">You keep</span>
                  <span className="font-mono text-emerald-400">{((1 - stats.feeBps / 10000) * 100).toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent payments table (3/4 width) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-3 rounded-2xl border border-white/[0.04] bg-[#0A0A10]/80 backdrop-blur-sm overflow-hidden"
          >
            <div className="p-6 border-b border-white/[0.04]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-display font-700 text-white">Recent Payments</h3>
                  <p className="text-xs text-gray-600 mt-0.5">Real-time tracking via Helius webhooks</p>
                </div>
                <Badge variant="outline" className="gap-1.5 border-white/[0.06] text-gray-500 text-[10px]">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Auto-refresh 10s
                </Badge>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {stats.recentPayments.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/[0.04] mb-4">
                    <ArrowRightLeft className="h-7 w-7 text-gray-700" />
                  </div>
                  <p className="text-gray-400 font-display font-500">No payments yet</p>
                  <p className="text-sm text-gray-600 mt-1">Share your storefront link to start receiving payments</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {/* Desktop header */}
                  <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-[11px] font-600 text-gray-600 uppercase tracking-wider font-display">
                    <div className="col-span-2">Status</div>
                    <div className="col-span-3">From</div>
                    <div className="col-span-2">Amount</div>
                    <div className="col-span-2">USD Value</div>
                    <div className="col-span-3">Time</div>
                  </div>

                  {stats.recentPayments.map((payment, i) => {
                    const paymentUSD = payment.currency === "USDC" ? payment.amount : payment.amount * (solPrice || 0);
                    return (
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
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                            }`}>
                              {payment.status === "confirmed" ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                              {payment.status}
                            </span>
                          </div>
                          <div className="col-span-3 font-mono text-xs text-gray-500">
                            {payment.payer ? truncateAddress(payment.payer, 6) : "—"}
                          </div>
                          <div className="col-span-2 font-display font-600 text-white text-sm">
                            {payment.amount} <span className="text-xs text-gray-600">{payment.currency}</span>
                          </div>
                          <div className="col-span-2 font-mono text-xs text-gray-500">
                            ${paymentUSD.toFixed(2)}
                          </div>
                          <div className="col-span-3 flex items-center justify-between">
                            <span className="text-xs text-gray-600 font-mono">{formatTimeAgo(payment.createdAt)}</span>
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
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                            }`}>
                              {payment.status === "confirmed" ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                              {payment.status}
                            </span>
                            <span className="text-xs text-gray-600 font-mono">{formatTimeAgo(payment.createdAt)}</span>
                          </div>
                          <div className="flex items-baseline justify-between">
                            <span className="font-display font-600 text-white">
                              {payment.amount} <span className="text-xs text-gray-500">{payment.currency}</span>
                              <span className="text-xs text-gray-600 ml-2">(${paymentUSD.toFixed(2)})</span>
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
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
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
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/[0.04] bg-[#0A0A10]/80 backdrop-blur-sm hover:border-white/[0.08] transition-all duration-300 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${color}12`, border: `1px solid ${color}20` }}
          >
            <Icon className="h-3.5 w-3.5" style={{ color }} />
          </div>
          <p className="text-[11px] text-gray-600 font-display font-500">{label}</p>
        </div>
        <p className="text-xl font-display font-800 text-white tracking-tight">{value}</p>
        <p className="text-[10px] text-gray-700 mt-1 font-mono">{sub}</p>
      </div>
    </div>
  );
}

/* ─── Custom Tooltip ─────────────────── */

function CustomTooltip({ active, payload, label, type }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0C0C14] p-3 shadow-2xl shadow-black/40">
      <p className="text-[11px] text-gray-500 font-mono mb-1">{label}</p>
      {type === "revenue" ? (
        <p className="text-sm font-display font-700 text-emerald-400">
          ${Number(payload[0]?.value || 0).toFixed(2)}
        </p>
      ) : (
        <p className="text-sm font-display font-700 text-purple-400">
          {payload[0]?.value || 0} payment{(payload[0]?.value || 0) !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}

/* ─── Time Formatter ─────────────────── */

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
