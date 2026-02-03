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
  Store,
  AlertCircle,
  ArrowRightLeft,
  Users,
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
  const [copied, setCopied] = useState(false);
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

  // Fetch SOL price
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

  // Initial fetch + auto-refresh every 10s
  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(() => fetchDashboard(), 10000);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  const handleCopyLink = async () => {
    if (!data) return;
    await navigator.clipboard.writeText(
      `${window.location.origin}/pay/${data.storefront.slug}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen">
        <div className="border-b border-border/40 h-14" />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 rounded bg-muted/50" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 rounded-xl bg-muted/30" />
              ))}
            </div>
            <div className="h-64 rounded-xl bg-muted/20" />
          </div>
        </div>
      </main>
    );
  }

  // Error
  if (error || !data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Dashboard Not Found</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link href="/">
              <Button variant="gradient">Back to Paygent</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const { storefront, stats, notifications, unreadCount } = data;
  const totalUSD =
    stats.totalSOL * (solPrice || 0) + stats.totalUSDC;
  const merchantUSD =
    stats.merchantSOL * (solPrice || 0) + stats.merchantUSDC;
  const feesUSD =
    stats.feesSOL * (solPrice || 0) + stats.feesUSDC;

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link
            href={`/pay/${storefront.slug}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            View Storefront
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-solana-gradient">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold">Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setShowNotifs(!showNotifs)}
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-solana-green text-[10px] font-bold text-black">
                    {unreadCount}
                  </span>
                )}
              </Button>

              {/* Notification dropdown */}
              <AnimatePresence>
                {showNotifs && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border/50 bg-card shadow-xl z-50"
                  >
                    <div className="p-3 border-b border-border/50">
                      <h4 className="text-sm font-semibold">Notifications</h4>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-muted-foreground">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-3 border-b border-border/30 last:border-0 ${
                              !notif.read ? "bg-solana-purple/5" : ""
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <div
                                className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${
                                  !notif.read
                                    ? "bg-solana-green"
                                    : "bg-transparent"
                                }`}
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-medium">
                                  {notif.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {notif.message}
                                </p>
                                <p className="text-xs text-muted-foreground/60 mt-1">
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

            <Button
              variant="ghost"
              size="icon"
              onClick={() => fetchDashboard(true)}
              disabled={refreshing}
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Storefront header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${storefront.theme.accentColor}, ${storefront.theme.accentColor}88)`,
              }}
            >
              <Store className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{storefront.businessName}</h1>
              <p className="text-sm text-muted-foreground">
                {storefront.products.length} products •{" "}
                {truncateAddress(storefront.walletAddress, 6)}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleCopyLink}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-solana-green" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy Storefront Link
              </>
            )}
          </Button>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatCard
            icon={DollarSign}
            label="Your Revenue"
            value={`$${merchantUSD.toFixed(2)}`}
            sub={`${stats.merchantSOL.toFixed(4)} SOL + ${stats.merchantUSDC.toFixed(2)} USDC`}
            color="#14F195"
          />
          <StatCard
            icon={TrendingUp}
            label="Total Processed"
            value={`$${totalUSD.toFixed(2)}`}
            sub={`${stats.confirmedPayments} confirmed payments`}
            color="#9945FF"
          />
          <StatCard
            icon={Clock}
            label="Pending"
            value={stats.pendingPayments.toString()}
            sub="awaiting confirmation"
            color="#FFB020"
          />
          <StatCard
            icon={ArrowRightLeft}
            label={`Platform Fee (${(stats.feeBps / 100).toFixed(2)}%)`}
            value={`$${feesUSD.toFixed(2)}`}
            sub={`${stats.feesSOL.toFixed(4)} SOL + ${stats.feesUSDC.toFixed(2)} USDC`}
            color="#4FC3F7"
          />
        </motion.div>

        {/* Recent payments table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Recent Payments</CardTitle>
                  <CardDescription>
                    Real-time payment tracking via Helius webhooks
                  </CardDescription>
                </div>
                {solPrice && (
                  <Badge variant="outline" className="font-mono text-xs">
                    ◎ 1 SOL ≈ ${solPrice.toFixed(2)}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {stats.recentPayments.length === 0 &&
              stats.pendingPayments === 0 ? (
                <div className="py-12 text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
                    <ArrowRightLeft className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    No payments yet
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Share your storefront link to start receiving payments
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Table header */}
                  <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <div className="col-span-2">Status</div>
                    <div className="col-span-3">From</div>
                    <div className="col-span-2">Amount</div>
                    <div className="col-span-2">Currency</div>
                    <div className="col-span-3">Time</div>
                  </div>

                  {/* Payment rows */}
                  {stats.recentPayments.map((payment, i) => (
                    <motion.div
                      key={payment.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className="grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-lg hover:bg-muted/30 transition-colors group"
                    >
                      {/* Status */}
                      <div className="col-span-2">
                        <Badge
                          variant={
                            payment.status === "confirmed"
                              ? "success"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {payment.status === "confirmed" ? (
                            <Check className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {payment.status}
                        </Badge>
                      </div>

                      {/* From */}
                      <div className="col-span-3 font-mono text-xs text-muted-foreground">
                        {payment.payer
                          ? truncateAddress(payment.payer, 6)
                          : "—"}
                      </div>

                      {/* Amount */}
                      <div className="col-span-2 font-semibold text-sm">
                        {payment.amount}
                      </div>

                      {/* Currency */}
                      <div className="col-span-2">
                        <Badge variant="outline" className="text-xs">
                          {payment.currency}
                        </Badge>
                      </div>

                      {/* Time */}
                      <div className="col-span-3 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(payment.createdAt)}
                        </span>
                        {payment.signature && (
                          <a
                            href={`https://explorer.solana.com/tx/${payment.signature}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-solana-purple-light" />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}

// ─── Helper Components ──────────────────────────────────

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
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{sub}</p>
          </div>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
