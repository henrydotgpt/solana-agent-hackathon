"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  ArrowLeft,
  Copy,
  Check,
  Code2,
  Terminal,
  BookOpen,
  Plug,
  Webhook,
} from "lucide-react";

const endpoints = [
  {
    method: "POST",
    path: "/api/storefront",
    title: "Create Storefront",
    description: "Create a new payment storefront with AI-generated theme and products.",
    body: `{
  "businessName": "My Coffee Shop",
  "businessDescription": "Premium specialty coffee",
  "tagline": "Wake up to web3",
  "logo": "https://example.com/logo.png",
  "walletAddress": "YOUR_SOLANA_WALLET",
  "products": [
    {
      "name": "Ethiopian Blend",
      "description": "250g whole bean",
      "price": 0.08,
      "currency": "SOL"
    }
  ],
  "links": {
    "website": "https://example.com",
    "twitter": "https://x.com/you"
  }
}`,
    response: `{
  "success": true,
  "data": {
    "slug": "my-coffee-shop-a1b2",
    "businessName": "My Coffee Shop",
    "walletAddress": "YOUR_SOLANA_WALLET",
    "products": [...],
    "theme": { "accentColor": "#D97706", "style": "bold" },
    "createdAt": 1707000000000
  }
}`,
  },
  {
    method: "GET",
    path: "/api/storefront/:slug",
    title: "Get Storefront",
    description: "Retrieve storefront details including products, theme, and branding.",
    response: `{
  "success": true,
  "data": {
    "slug": "my-coffee-shop-a1b2",
    "businessName": "My Coffee Shop",
    "tagline": "Wake up to web3",
    "logo": "https://example.com/logo.png",
    "products": [...],
    "links": { "website": "...", "twitter": "..." },
    "theme": { "accentColor": "#D97706", "style": "bold" }
  }
}`,
  },
  {
    method: "POST",
    path: "/api/pay",
    title: "Create Payment",
    description: "Generate a Solana Pay transaction for a specific product. Returns a reference key for tracking.",
    body: `{
  "storefrontSlug": "my-coffee-shop-a1b2",
  "productId": "prod_abc123",
  "currency": "SOL"
}`,
    response: `{
  "success": true,
  "data": {
    "paymentId": "pay_xyz789",
    "reference": "BASE58_PUBLIC_KEY",
    "amount": 0.08,
    "currency": "SOL",
    "recipient": "MERCHANT_WALLET",
    "memo": "Paygent:my-coffee-shop-a1b2:prod_abc123"
  }
}`,
  },
  {
    method: "GET",
    path: "/api/quote",
    title: "Get Token Quote",
    description: "Get a real-time SOL↔USDC quote via Jupiter aggregator.",
    response: `// GET /api/quote?amount=1&direction=sol-to-usdc
{
  "success": true,
  "data": {
    "inputToken": "SOL",
    "outputToken": "USDC",
    "inputAmount": 1,
    "outputAmount": 178.42,
    "rate": 178.42,
    "priceImpact": "0.01%"
  }
}`,
  },
  {
    method: "GET",
    path: "/api/dashboard/:slug",
    title: "Get Dashboard",
    description: "Retrieve merchant analytics — payment stats, revenue breakdown, notifications.",
    response: `{
  "success": true,
  "data": {
    "storefront": {...},
    "stats": {
      "totalPayments": 12,
      "confirmedPayments": 10,
      "pendingPayments": 2,
      "totalSOL": 3.45,
      "totalUSDC": 250.00,
      "feesSOL": 0.026,
      "feesUSDC": 1.88,
      "merchantSOL": 3.424,
      "merchantUSDC": 248.12,
      "recentPayments": [...]
    },
    "notifications": [...],
    "unreadCount": 3
  }
}`,
  },
  {
    method: "GET",
    path: "/api/fees",
    title: "Get Fee Schedule",
    description: "Returns current platform fee structure.",
    response: `{
  "success": true,
  "data": {
    "platformFeeBps": 75,
    "platformFeePercent": "0.75%",
    "swapSpreadBps": 20,
    "swapSpreadPercent": "0.20%",
    "totalMaxBps": 95,
    "totalMaxPercent": "0.95%",
    "comparison": {
      "stripe": "2.90%",
      "paygent": "0.75%",
      "savings": "74%"
    }
  }
}`,
  },
  {
    method: "POST",
    path: "/api/webhooks/helius",
    title: "Payment Webhook",
    description: "Helius webhook endpoint for real-time payment confirmations. Automatically matches transactions to pending payments.",
    body: `// Sent by Helius when a transaction is confirmed
[{
  "signature": "TX_SIGNATURE",
  "type": "TRANSFER",
  "nativeTransfers": [...],
  "tokenTransfers": [...]
}]`,
    response: `{ "received": true }`,
  },
];

const widgetCode = `<!-- Add to any website -->
<script src="https://paygent-app.vercel.app/api/widget/YOUR-STORE-SLUG"></script>

<!-- Or target a specific element -->
<div data-paygent data-paygent-text="Buy Now with SOL"></div>
<script src="https://paygent-app.vercel.app/api/widget/YOUR-STORE-SLUG"></script>

<!-- Listen for payment events -->
<script>
  window.addEventListener('paygent:payment', (e) => {
    console.log('Payment complete!', e.detail);
  });
</script>`;

const methodColors: Record<string, string> = {
  GET: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  POST: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  PUT: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  DELETE: "text-red-400 bg-red-500/10 border-red-500/20",
};

export default function DocsPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Paygent
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-solana-gradient">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold">API Docs</span>
          </div>
          <Link href="/create">
            <Button variant="gradient" size="sm">
              Get Started
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <Badge className="mb-4 bg-solana-purple/10 text-solana-purple-light border-solana-purple/20">
            <BookOpen className="h-3 w-3 mr-1" />
            Developer Documentation
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Paygent API
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Accept Solana payments on any website with a few lines of code.
            REST API + embeddable widget + real-time webhooks.
          </p>
        </motion.div>

        {/* Quick Start */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Terminal className="h-5 w-5 text-solana-green" />
            Quick Start
          </h2>
          <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30 bg-muted/30">
              <span className="text-xs font-medium text-muted-foreground">
                Create a storefront in one API call
              </span>
              <button
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                onClick={() =>
                  copyToClipboard(
                    `curl -X POST https://paygent-app.vercel.app/api/storefront \\
  -H "Content-Type: application/json" \\
  -d '{
    "businessName": "My Store",
    "businessDescription": "Digital goods marketplace",
    "walletAddress": "YOUR_SOLANA_WALLET",
    "products": [{ "name": "Item", "description": "Cool thing", "price": 0.1, "currency": "SOL" }]
  }'`,
                    "quickstart"
                  )
                }
              >
                {copied === "quickstart" ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                {copied === "quickstart" ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-muted-foreground">
                <span className="text-emerald-400">curl</span> -X POST
                https://paygent-app.vercel.app/api/storefront \{"\n"}
                {"  "}-H{" "}
                <span className="text-amber-300">
                  &quot;Content-Type: application/json&quot;
                </span>{" "}
                \{"\n"}
                {"  "}-d{" "}
                <span className="text-amber-300">
                  {`'{"businessName":"My Store","walletAddress":"YOUR_WALLET","products":[...]}'`}
                </span>
              </code>
            </pre>
          </div>
        </motion.section>

        {/* Embeddable Widget */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Plug className="h-5 w-5 text-blue-400" />
            Embeddable Widget
          </h2>
          <p className="text-muted-foreground mb-4">
            Add a Solana Pay button to any website with a single script tag.
            The widget opens a modal with your storefront — no redirect needed.
          </p>
          <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30 bg-muted/30">
              <span className="text-xs font-medium text-muted-foreground">
                HTML
              </span>
              <button
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                onClick={() => copyToClipboard(widgetCode, "widget")}
              >
                {copied === "widget" ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                {copied === "widget" ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-muted-foreground whitespace-pre">
                {widgetCode}
              </code>
            </pre>
          </div>
        </motion.section>

        {/* Endpoints */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Code2 className="h-5 w-5 text-solana-purple-light" />
            API Endpoints
          </h2>
          <p className="text-muted-foreground mb-8">
            Base URL:{" "}
            <code className="px-2 py-0.5 rounded-md bg-muted/50 text-sm font-mono">
              https://paygent-app.vercel.app
            </code>
          </p>

          <div className="space-y-8">
            {endpoints.map((ep, i) => (
              <motion.div
                key={ep.path}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="rounded-xl border border-border/50 overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-border/30 bg-card/50">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${
                      methodColors[ep.method]
                    }`}
                  >
                    {ep.method}
                  </span>
                  <code className="text-sm font-mono font-medium">
                    {ep.path}
                  </code>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-semibold mb-1">{ep.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {ep.description}
                    </p>
                  </div>

                  {ep.body && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Request Body
                        </span>
                        <button
                          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                          onClick={() =>
                            copyToClipboard(ep.body!, `body-${i}`)
                          }
                        >
                          {copied === `body-${i}` ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                      <pre className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs overflow-x-auto">
                        <code className="text-muted-foreground">
                          {ep.body}
                        </code>
                      </pre>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Response
                      </span>
                      <button
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                        onClick={() =>
                          copyToClipboard(ep.response, `resp-${i}`)
                        }
                      >
                        {copied === `resp-${i}` ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                    <pre className="rounded-lg bg-muted/30 border border-border/30 p-3 text-xs overflow-x-auto">
                      <code className="text-muted-foreground">
                        {ep.response}
                      </code>
                    </pre>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Webhooks */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Webhook className="h-5 w-5 text-amber-400" />
            Real-Time Webhooks
          </h2>
          <div className="rounded-xl border border-border/50 bg-card/50 p-6">
            <p className="text-muted-foreground mb-4">
              Paygent uses <strong>Helius</strong> for real-time on-chain event monitoring.
              When a payment is detected, the system:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Matches the transaction reference to a pending payment</li>
              <li>Calculates and routes the platform fee (0.75%)</li>
              <li>Updates payment status to <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs font-mono">confirmed</code></li>
              <li>Triggers merchant notification in the dashboard</li>
              <li>Emits <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs font-mono">paygent:payment-complete</code> event via the widget</li>
            </ol>
            <div className="mt-6 p-4 rounded-lg bg-solana-green/5 border border-solana-green/20">
              <p className="text-sm">
                <strong className="text-solana-green">Zero-latency confirmations:</strong>{" "}
                Helius processes transactions within ~400ms of on-chain finality.
              </p>
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-center py-12 border-t border-border/40"
        >
          <h2 className="text-2xl font-bold mb-3">Ready to accept crypto?</h2>
          <p className="text-muted-foreground mb-6">
            Create your storefront in 60 seconds. No code required.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/create">
              <Button variant="gradient" size="lg" className="gap-2">
                <Zap className="h-4 w-4" />
                Create Storefront
              </Button>
            </Link>
            <a
              href="https://github.com/henrydotgpt/solana-agent-hackathon"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="gap-2">
                <Code2 className="h-4 w-4" />
                View Source
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
