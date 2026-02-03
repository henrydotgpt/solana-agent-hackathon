# Paygent — AI Payment Agent for Solana

> Tell it about your business. Get a complete payment storefront in minutes.

**Paygent** is an autonomous AI agent that builds complete Solana payment storefronts for businesses. No code. No crypto knowledge. Just describe your business and start accepting payments.

## What It Does

1. **Describe your business** — "I'm a freelance designer charging $500/project"
2. **AI builds your storefront** — layout, products, pricing, payment QR codes
3. **Deploy and get paid** — live payment page with Solana Pay, auto-conversion to USDC

## Features

- 🤖 **AI-Powered** — Conversational business intake, autonomous storefront generation
- 💳 **Solana Pay** — QR code payments, transaction verification, payment links
- 🔄 **Auto-Convert** — Receive SOL, auto-swap to USDC via Jupiter
- 📊 **Payment Dashboard** — Track transactions, generate invoices
- 🔔 **Real-time Notifications** — Helius webhooks for instant payment alerts
- 📱 **Mobile-First** — Responsive, works on any device
- 🔒 **Non-Custodial** — Users connect their own wallets. We never touch your funds.

## Tech Stack

- **Frontend:** Next.js 14, Tailwind CSS, shadcn/ui, Framer Motion
- **Payments:** Solana Pay SDK, Jupiter V6 API
- **Monitoring:** Helius Webhooks
- **Wallets:** Phantom, Solflare (via wallet-adapter)
- **Chain:** Solana (devnet / mainnet)

## Built By Agents

Paygent was built entirely by AI agents as part of the [Colosseum Agent Hackathon](https://colosseum.com/agent-hackathon) (Feb 2-12, 2026).

- **Sentai** — Commander & orchestrator
- **Claudius** — Primary builder
- **Mimir** — Research & QA

Powered by [OpenClaw](https://openclaw.ai) multi-agent infrastructure.

## Getting Started

```bash
# Clone
git clone https://github.com/henrydotgpt/solana-agent-hackathon.git
cd solana-agent-hackathon

# Install
npm install

# Configure
cp .env.example .env
# Add your RPC URL and API keys

# Run
npm run dev
```

## Environment Variables

```
NEXT_PUBLIC_SOLANA_RPC_URL=       # Solana RPC endpoint
NEXT_PUBLIC_SOLANA_NETWORK=       # devnet or mainnet-beta
HELIUS_API_KEY=                   # Helius webhook API key
NEXT_PUBLIC_JUPITER_API_URL=      # Jupiter V6 API endpoint
```

## Security

- All secrets in environment variables, never in code
- Non-custodial — wallet-adapter signing only
- Input validation on all user inputs
- CORS and CSP headers configured
- See [SECURITY.md](./SECURITY.md) for full protocol

## License

MIT
