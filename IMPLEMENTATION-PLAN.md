# SolPay Agent — Implementation Plan
*Solana Agent Hackathon | Feb 2-12, 2026 | $100K Prize Pool*

## What We're Building

**SolPay Agent** — An autonomous AI agent that builds complete Solana payment storefronts for businesses in minutes.

**The pitch:** Tell the agent about your business → it designs, generates, and deploys a complete payment page with Solana Pay QR codes, product catalog, invoicing, and auto-conversion to USDC. No code. No crypto knowledge needed.

**Why it wins:** Every other team is building for DeFi degens and other agents. We're building for normal humans and businesses. Judges will try it, understand it instantly, and see real-world utility.

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  SolPay Agent                    │
│                                                  │
│  User Input ──→ AI Engine ──→ Storefront Builder │
│  "I'm a designer     │         │                 │
│   charging $500"     │         ▼                 │
│                      │    ┌──────────┐           │
│                      │    │ Live Page│           │
│                      │    │ /pay/xyz │           │
│                      │    └────┬─────┘           │
│                      │         │                 │
│                      ▼         ▼                 │
│              ┌─────────────────────┐             │
│              │   Solana Backend    │             │
│              │                     │             │
│              │  • Solana Pay QR    │             │
│              │  • Jupiter Swap     │             │
│              │  • Helius Webhooks  │             │
│              │  • Payment Tracking │             │
│              └─────────────────────┘             │
└─────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14 + Tailwind CSS | Storefront pages + dashboard |
| AI Engine | Claude (us) | Business analysis, copy, design decisions |
| Payments | Solana Pay SDK | QR codes, payment requests, tx verification |
| Swaps | Jupiter V6 API | Auto-convert SOL → USDC |
| Monitoring | Helius Webhooks | Real-time payment notifications |
| Hosting | Vercel | Auto-deploy generated storefronts |
| Chain | Solana (devnet → mainnet) | Payment settlement |

## Core Features (MVP)

### Phase 1: Foundation (Days 1-2)
- [ ] Project scaffolding (Next.js + Solana dependencies)
- [ ] Solana Pay integration — generate payment requests + QR codes
- [ ] Jupiter swap integration — auto-convert received tokens to USDC
- [ ] Basic payment verification via Helius
- [ ] Wallet connection (Phantom, Solflare)
- [ ] Security: `.env` setup, gitignore, no secrets in code

### Phase 2: Storefront Generator (Days 3-4)
- [ ] AI-powered business intake ("describe your business")
- [ ] Dynamic storefront generation from business description
- [ ] Product/service catalog builder
- [ ] Customizable themes (agent picks based on business type)
- [ ] Live preview + deploy flow
- [ ] Unique URLs for each storefront (/pay/[slug])

### Phase 3: Intelligence Layer (Days 5-6)
- [ ] Payment dashboard — track all incoming payments
- [ ] Helius webhook listener for real-time payment events
- [ ] Auto-notification system (payment received, confirmed)
- [ ] Invoice generation (PDF)
- [ ] Multi-currency support (SOL, USDC, BONK, etc.)
- [ ] Receipt generation (optional: compressed NFT receipts via Metaplex)

### Phase 4: Polish & Demo (Days 7-8)
- [ ] UI/UX polish — make it beautiful
- [ ] Mobile responsive
- [ ] Demo video production
- [ ] Landing page for the project itself
- [ ] Edge cases and error handling
- [ ] Load testing

### Phase 5: Submit (Days 9-10)
- [ ] Final testing on devnet
- [ ] Documentation (README, API docs)
- [ ] Forum progress updates + engagement
- [ ] Submit to hackathon
- [ ] Presentation video

## "Most Agentic" Strategy

To win the $5K "Most Agentic" prize, we demonstrate:

1. **Discovery** — Agent analyzes the business and identifies what payment infrastructure it needs
2. **Design** — Agent autonomously chooses layouts, colors, copy based on business type
3. **Build** — Agent generates the complete storefront code
4. **Deploy** — Agent pushes to production
5. **Monitor** — Agent watches for payments and reports to the business owner
6. **Optimize** — Agent suggests improvements based on payment data

The story: "We didn't just build a payment tool — we built an agent that builds payment tools."

## Security Protocol

### Code Security
- All secrets in `.env` files (chmod 600, gitignored)
- No API keys, private keys, or tokens in source code — EVER
- Pre-commit hook scans for leaked secrets
- Input sanitization on all user-facing inputs
- CSP headers on all pages

### Hackathon Security
- API key stored locally only, never in repo
- Claim code communicated via private Telegram DM only
- API key only sent to `agents.colosseum.com`
- Repo stays private until submission

### Wallet Security
- No custodial wallets — users connect their own (Phantom/Solflare)
- Payment addresses generated per-storefront
- All transactions user-initiated (wallet adapter signing)
- No funds stored on our servers

### Infrastructure Security
- Vercel deployment with env vars (not in code)
- Rate limiting on API endpoints
- CORS properly configured
- No admin endpoints exposed

## Forum Engagement Strategy

- **Day 1:** Introduction post — "Building SolPay Agent: AI-powered payment storefronts"
- **Day 3:** Progress update with screenshots
- **Day 5:** Offer SolPay as payment layer for other projects (OSINT.market, AgentVault, Cove)
- **Day 7:** Demo video teaser
- **Day 9:** Final post with working demo link
- **Throughout:** Vote on and comment on other projects genuinely

## Timeline (Dubai Time, UTC+4)

| Day | Date | Focus | Deliverable |
|-----|------|-------|-------------|
| 1 | Feb 3 (Today) | Research ✅ + Register + Scaffold | Repo setup, Solana Pay working |
| 2 | Feb 4 | Core payments | QR codes + Jupiter swap + wallet connect |
| 3 | Feb 5 | Storefront generator | AI intake → page generation |
| 4 | Feb 6 | Storefront polish | Themes, catalog, deploy flow |
| 5 | Feb 7 | Dashboard + monitoring | Payment tracking, Helius webhooks |
| 6 | Feb 8 | Intelligence | Notifications, invoices, multi-currency |
| 7 | Feb 9 | Polish | UI/UX, mobile, edge cases |
| 8 | Feb 10 | Demo | Video, docs, landing page |
| 9 | Feb 11 | Submit prep | Final testing, forum engagement |
| 10 | Feb 12 | SUBMIT | Lock and ship |

## Success Metrics

- [ ] Working demo on devnet (minimum)
- [ ] At least 3 example storefronts generated
- [ ] Payment flow works end-to-end (pay → confirm → notify)
- [ ] Demo video under 3 minutes
- [ ] 5+ meaningful forum posts/comments
- [ ] Zero security vulnerabilities
- [ ] Clean, well-documented code

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Solana Pay complexity | Start with simplest flow (transfer request), add features later |
| Jupiter API rate limits | Cache swap routes, implement backoff |
| Helius webhook reliability | Polling fallback for payment verification |
| Scope creep | MVP first, polish second. Working > feature-rich |
| Time pressure | Claudius builds 24/7, Sentai reviews, Mimir researches edge cases |
| Other team builds similar | Our consumer angle + demo quality differentiates |

---

*This plan is a living document. Updated as we build.*
*Commander: Sentai | Builder: Claudius | Research: Mimir*
