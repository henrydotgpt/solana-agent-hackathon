---
name: paygent
description: AI-powered payment agent for Solana. Create storefronts, accept SOL/USDC payments, 0.75% fees, instant settlement. One-sentence setup.
metadata:
  openclaw:
    emoji: "💳"
    homepage: "https://paygent-solana.vercel.app"
---

# Paygent 💳

**AI Payment Agent for Solana**

*Describe your business in one sentence. Get a live payment page.*

## What is Paygent?

An autonomous AI that builds complete payment storefronts for businesses:
- **0.75% fees** (vs Stripe's 2.9% + 30¢)
- **~2 second settlement** (vs 3-5 business days)
- **Non-custodial** — funds go directly to your wallet

## Quick Start

### Create a Store (Conversational)

```bash
curl -X POST https://paygent-solana.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I sell handmade candles in three scents"}'
```

The AI generates your storefront, products, QR codes, and branding automatically.

## API Endpoints

Base URL: `https://paygent-solana.vercel.app/api`

### Store Management

#### Create/Update Storefront
```bash
POST /api/storefront
{
  "name": "My Coffee Shop",
  "description": "Single-origin beans",
  "wallet": "YOUR_SOLANA_WALLET",
  "products": [
    {"name": "Light Roast", "price": 15, "currency": "USDC"}
  ]
}
```

#### Get Store Info
```bash
GET /api/storefront/{store_id}
```

### Payments

#### Get Payment Quote
```bash
POST /api/quote
{
  "amount": 15,
  "currency": "USDC",
  "paymentToken": "SOL"
}
```

Returns Jupiter quote for token conversion if needed.

#### Generate Payment Link
```bash
POST /api/pay
{
  "store_id": "abc123",
  "product_id": "prod_xyz",
  "amount": 15
}
```

Returns Solana Pay QR code and payment URL.

### Widget

#### Get Embeddable Widget
```bash
GET /api/widget/{store_id}
```

Returns `<script>` tag to embed "Pay with Solana" button on any website.

### Webhooks

Configure Helius webhooks for real-time payment notifications:

```bash
POST /api/webhooks/configure
{
  "wallet": "YOUR_WALLET",
  "callback_url": "https://your-app.com/payment-received"
}
```

## Features

| Feature | Description |
|---------|-------------|
| 🤖 AI Builder | Conversational storefront setup |
| 💳 Solana Pay | QR code payments, instant verification |
| 🔌 Widget | One-line embed for any website |
| 📊 Dashboard | Revenue charts, payment tracking |
| 🔄 Multi-Token | SOL, USDC, any SPL via Jupiter |
| 🔔 Webhooks | Sub-second payment confirmations |

## Use Cases for Agents

- **E-commerce agent** — Set up payment collection for products
- **Service agent** — Accept payments for completed tasks
- **Subscription agent** — Recurring payment pages
- **Tip jar** — Simple donation collection

## Links

- **Live App:** https://paygent-solana.vercel.app
- **API Docs:** https://paygent-solana.vercel.app/docs
- **GitHub:** https://github.com/henrydotgpt/solana-agent-hackathon
- **Demo Stores:** https://paygent-solana.vercel.app/explore

---

*"Accept payments at 0.75%. Settle in 2 seconds. Set up in 60."* 💳
