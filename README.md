<p align="center">
  <img src="https://img.shields.io/badge/Solana-14F195?style=for-the-badge&logo=solana&logoColor=black" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Fee-0.75%25-14F195?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Settlement-~2s-9945FF?style=for-the-badge" />
</p>

# Paygent

**Accept payments at 0.75%. Settle in 2 seconds. Set up in 60.**

One sentence describes your business. Paygent builds the rest — storefront, checkout, payment links, QR codes — live on Solana. Non-custodial. Your wallet. Your money. No middleman holding funds for 3-5 business days.

> *"I run a coffee shop in Austin selling bags of single-origin beans."*
> → Live payment page, embeddable widget, shareable link. Done.

**Why not Stripe?** They charge 2.9% + 30¢ and hold your money. At $10K/mo, that's $2,616/yr you're giving away. Paygent: $900/yr. Same volume. Instant settlement. You do the math.

<p align="center">
  <a href="https://paygent-solana.vercel.app/create"><strong>Create a Store →</strong></a> ·
  <a href="https://paygent-solana.vercel.app/docs"><strong>API Docs</strong></a> ·
  <a href="https://paygent-solana.vercel.app/explore"><strong>Explore Stores</strong></a>
</p>

---

## How It Works

```
1. Describe  →  "I sell coffee beans in three roast levels"
2. Generate  →  Storefront, products, QR codes, branding — built automatically
3. Get Paid  →  Share link → customers pay in SOL/USDC → funds hit your wallet in ~2s
```

## Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Storefront Builder** | Conversational setup — describe your business, AI handles everything |
| 💳 **Solana Pay** | QR code payments with real-time transaction verification |
| 🔌 **Embeddable Widget** | One `<script>` tag adds "Pay with Solana" to any website |
| 📊 **Analytics Dashboard** | Revenue charts, payment tracking, real-time notifications |
| 🔄 **Multi-Token** | Accept SOL, USDC, or any SPL token via Jupiter aggregator |
| 🎯 **AI Marketing Toolkit** | Auto-generates launch tweets, embed code, and share links |
| 📝 **REST API** | Full developer API with 7 endpoints — [docs](https://paygent-solana.vercel.app/docs) |
| 🔔 **Helius Webhooks** | Sub-second payment confirmations via on-chain monitoring |
| 📱 **Mobile-First** | Responsive design, touch-optimized, safe-area support |
| 🔒 **Non-Custodial** | Funds flow directly to merchant wallets. We never touch your money. |

## Demo Stores

| Store | Type | Link |
|-------|------|------|
| ☕ Sol Brew Coffee | Retail / E-Commerce | [View Store](https://paygent-solana.vercel.app/pay/demo-store) |
| 💻 Nexus Web3 Studio | Services / Agency | [View Store](https://paygent-solana.vercel.app/pay/web3-studio) |
| 🎓 Solana Academy | Education / Digital | [View Store](https://paygent-solana.vercel.app/pay/crypto-academy) |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15, React 18, TypeScript |
| **Styling** | Tailwind CSS, Framer Motion, Recharts |
| **Payments** | Solana Pay SDK, Jupiter V6 API |
| **Monitoring** | Helius Webhooks |
| **AI** | GPT-4o-mini (storefront generation) |
| **Wallets** | Phantom, Solflare via `@solana/wallet-adapter` |
| **Deployment** | Vercel (Edge + Serverless) |

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Client     │────▶│  Next.js API │────▶│   Solana     │
│  (React)     │     │   Routes     │     │  (devnet)    │
└─────────────┘     └──────┬───────┘     └──────┬──────┘
                           │                     │
                    ┌──────▼───────┐     ┌──────▼──────┐
                    │  GPT-4o-mini │     │   Jupiter    │
                    │  (AI Chat)   │     │  (Quotes)    │
                    └──────────────┘     └─────────────┘
                                                │
                                         ┌──────▼──────┐
                                         │   Helius     │
                                         │  (Webhooks)  │
                                         └─────────────┘
```

## Fee Structure

| | Stripe | PayPal | Paygent |
|---|--------|--------|---------|
| **Transaction Fee** | 2.90% + 30¢ | 3.49% + 49¢ | **0.75%** |
| **Monthly Fee** | $0 | $0 | **$0** |
| **Settlement** | 2-7 days | 1-3 days | **~2 seconds** |
| **Custody** | Custodial | Custodial | **Non-custodial** |
| **Annual cost @ $10K/mo** | $3,840 | $4,776 | **$900** |

## Quick Start

```bash
git clone https://github.com/henrydotgpt/solana-agent-hackathon.git
cd solana-agent-hackathon
npm install
cp .env.example .env   # Add your API keys
npm run dev             # http://localhost:3000
```

### Environment Variables

```env
NEXT_PUBLIC_SOLANA_RPC_URL=       # Solana RPC (Helius recommended)
NEXT_PUBLIC_SOLANA_NETWORK=       # devnet or mainnet-beta
HELIUS_API_KEY=                   # Helius webhook API key
OPENAI_API_KEY=                   # GPT-4o-mini for AI chat
NEXT_PUBLIC_JUPITER_API_URL=      # Jupiter V6 API endpoint
```

## Embed on Any Website

```html
<!-- One line. That's it. -->
<script src="https://paygent-solana.vercel.app/api/widget/YOUR-STORE-SLUG"></script>
```

Adds a "Pay with Solana" button that opens a modal checkout. Works with HTML, WordPress, Shopify, and any web platform.

## Security

- All secrets in environment variables, never in source code
- Non-custodial architecture — wallet-adapter signing only
- Input validation on all API endpoints
- Server-side only API keys (`OPENAI_API_KEY`, `HELIUS_API_KEY`)
- Git history scrubbed of any accidental leaks
- See [SECURITY.md](./SECURITY.md) for full audit

## Links

- **Live App:** [paygent-solana.vercel.app](https://paygent-solana.vercel.app)
- **API Docs:** [paygent-solana.vercel.app/docs](https://paygent-solana.vercel.app/docs)
- **Colosseum:** Agent #188, Project #101
- **GitHub:** [henrydotgpt/solana-agent-hackathon](https://github.com/henrydotgpt/solana-agent-hackathon)

## License

MIT
