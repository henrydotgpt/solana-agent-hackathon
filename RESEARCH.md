# Solana Agent Hackathon — Research Report
*Compiled by Mimir (Worker 2) — Feb 3, 2026*

## Hackathon Overview
- **Prize:** $100K USDC ($50K 1st / $30K 2nd / $15K 3rd / $5K Most Agentic)
- **Dates:** Feb 2-12, 2026 (9 days remaining)
- **Rule:** ALL code must be written by AI agents. Humans can't code.
- **Requirements:** Must integrate with Solana meaningfully
- **Judging:** Technical execution, creativity, real-world utility. Judges select winners; votes influence visibility.

## Forum Analysis — What's Already Being Built

### Top Projects by Score (Competition)
| Score | Agent | Project | Category |
|-------|-------|---------|----------|
| 14 | Bella | **AgentVault** — on-chain agent economy protocol (registry, escrow, reputation) | Infra |
| 12 | Jarvis | **Solana Agent SDK** — pure TypeScript library for ecosystem access | Infra |
| 10 | jeeves | **SolanaYield** — autonomous DeFi yield orchestrator | DeFi |
| 10 | Mereum | **AXIOM Protocol** — verifiable AI reasoning on Solana | Infra |
| 8 | Antigravity | **HALE** — forensic security / proofs of intent | Security |
| 5 | walt-openclaw | **TreasuryAgent** — natural language portfolio manager | DeFi |
| 5 | ruby-jarvis | **NEXUS Protocol** — multi-agent coordination infrastructure | Infra |
| 5 | Axiom | **AgentGuard** — security middleware for Solana agents | Security |
| 4 | AgentMedic | **AgentMedic** — autonomous doctor for agents | Infra |
| 4 | kai | **SAID Protocol** — agent identity & reputation | Identity |
| 4 | bobby | **Manna Protocol** — Liquity-style borrowing on Solana | DeFi |
| 3 | stakepilot | **StakePilot** — staking intelligence + MEV prediction | DeFi |
| 3 | sixela-v2 | **OSINT.market** — intelligence bounty marketplace | Market |
| 3 | unabotter | **Protocol Risk Oracle** — game theory security analysis | Security |
| 3 | ordo-seeker | **Ordo** — hierarchical multi-agent DeFi assistant | Consumer |
| 3 | motly | **Cove** — agent service marketplace with x402 | Payments |
| 3 | VBDeskBot | **VB Desk** — decentralized OTC sealed-bid auctions | DeFi |
| 3 | Youth | **REKT Shield** — 10-agent security swarm | Security |

### Key Patterns & Gaps

**Oversaturated categories (AVOID):**
- DeFi yield optimizers (SolanaYield, StakePilot, TreasuryAgent — 3+ projects)
- Agent infrastructure/registry (AgentVault, NEXUS, SAID — 3+ projects)
- Security middleware (AgentGuard, REKT Shield, HALE — 3+ projects)
- Natural language → transaction execution (TreasuryAgent, Ordo, claude-sonnet-builder — 3+ projects)
- SDKs and tooling (Jarvis SDK, AgentDEX — 2+ projects)

**Underserved categories (OPPORTUNITY):**
- **Consumer-facing apps** that non-crypto people would use
- **Real-world data → Solana** bridges (payments, commerce, physical world)
- **Content/creator economy** on Solana
- **Governance/DAO tooling** for agents
- **Cross-chain** agent operations
- **RWA (Real World Assets)** integration
- **Mobile-first** consumer apps (only Ordo targeting Solana Mobile)

### What Wins Hackathons (Pattern Analysis)
1. **Working demos** beat grand visions — judges try your product
2. **Novel categories** beat crowded ones — stand out, don't compete in a sea of yield optimizers
3. **Consumer appeal** — judges are humans who appreciate things they can personally use
4. **Live deployment** — devnet or mainnet, not just code in a repo
5. **Community engagement** — forum activity, integrations, votes all matter for visibility

## Solana Protocols & APIs Available

| Protocol | What It Does | API/SDK Quality |
|----------|-------------|-----------------|
| **Jupiter** | DEX aggregation, swaps, limit orders | Excellent (V6 API) |
| **Helius** | RPC, DAS API, enhanced transactions, webhooks | Excellent |
| **Pyth** | Price oracle feeds | Excellent |
| **Metaplex** | NFTs, compressed NFTs, token metadata | Good |
| **Jito** | MEV protection, liquid staking, tips | Good |
| **Solana Pay** | Payment requests, QR codes, transaction requests | Good |
| **Kamino** | Lending, leverage, vaults | Good |
| **Marinade** | Liquid staking | Good |
| **Drift** | Perps, spot, lending | Moderate |
| **Tensor** | NFT marketplace | Good API |
| **Sanctum** | LST hub, validator staking | Moderate |

## Our Unique Angle
- We are **OpenClaw agents** that build tools autonomously every night (henryhacks.com)
- We have **4 agents** running across Telegram & WhatsApp with real users
- We have **ad-creative-gen, image generation, content automation** skills
- We have a **human (Henry) who builds AI services for businesses** — real-world use case
- We can demonstrate **autonomous multi-agent coordination** naturally

---

## Top 3 Project Ideas (Ranked by Win Probability)

---

### 🥇 IDEA 1: SolPay Agent — AI-Powered Solana Payment Links for Small Businesses
**Win Probability: HIGH (8/10)**

**Problem:** Small businesses and freelancers want to accept crypto payments but it's too complex. Solana Pay exists but requires technical setup. Meanwhile, agents like us build tools for businesses daily — what if the agent could SET UP and MANAGE payment infrastructure for any business?

**Solution:** An autonomous agent that:
1. Takes a natural language business description ("I'm a freelance designer in Dubai charging $500/project")
2. Generates a complete Solana Pay storefront: payment links, QR codes, invoices, product catalog
3. Deploys it as a live webpage (like henryhacks.com tools)
4. Monitors payments, sends notifications, generates reports
5. Auto-converts received SOL/USDC to stablecoins via Jupiter if desired

**Solana Integration:**
- Solana Pay for payment requests + transaction verification
- Jupiter for auto-swaps (SOL → USDC)
- Helius webhooks for payment notifications
- On-chain payment receipts (compressed NFTs via Metaplex)

**Tech Stack:** Next.js storefront generator + Solana Pay SDK + Jupiter API + Helius webhooks

**Why This Wins:**
- **Consumer-facing** — judges can try it, non-crypto people understand it
- **Novel** — nobody in the hackathon is doing payments-for-normies
- **Demonstrates agency** — the agent builds and deploys entire storefronts autonomously
- **Real utility** — Henry literally sells AI services and could use this for madebylabs
- **"Most Agentic" angle** — agent doesn't just process payments, it BUILDS the entire payment infrastructure from scratch

**Complexity:** Medium (7-9 days feasible)

**Competitive Advantage:** Every other project serves agents or DeFi degens. This serves normal humans and businesses. That's the gap.

---

### 🥈 IDEA 2: AgentHire — On-Chain Freelance Marketplace Where Agents Do The Work
**Win Probability: HIGH (7.5/10)**

**Problem:** Freelance marketplaces (Fiverr, Upwork) are human-only. But AI agents can now do many freelance tasks (copywriting, image generation, code, research, data analysis). There's no marketplace where you post a job and an AI agent does it, with payment in crypto.

**Solution:** A Solana-native marketplace where:
1. Humans post jobs with USDC bounties (escrow on-chain)
2. AI agents bid on jobs with proposals
3. Agent completes work, submits deliverables
4. Human approves → escrow releases to agent wallet
5. Agent builds on-chain reputation (completed jobs, ratings, specialties)

**Solana Integration:**
- Anchor program for job escrow (PDAs for jobs, bids, completions)
- SPL token payments (USDC)
- On-chain reputation system
- Compressed NFT badges for completed milestones

**Tech Stack:** Anchor smart contract + Next.js frontend + REST API for agent integration

**Why This Wins:**
- **Fresh concept** — OSINT.market is close but research-only; AgentVault is infrastructure-only; this is the full consumer marketplace
- **We can demo it live** — our own agents (Sentai, Mimir) can complete jobs during the hackathon as proof
- **Strong "Most Agentic" case** — agents autonomously finding work, bidding, delivering, getting paid
- **Revenue model clear** — 5% platform fee on every job

**Complexity:** Medium-High (would need smart contract + frontend + API)

**Competitive Advantage:** Combines elements of AgentVault (escrow) + OSINT.market (bounties) but as a complete consumer product, not just infrastructure.

---

### 🥉 IDEA 3: SolBrand — AI Agent That Builds Complete Brand Kits on Solana
**Win Probability: MEDIUM-HIGH (7/10)**

**Problem:** Starting a brand or project requires logos, color palettes, social templates, a landing page, and increasingly, a token. This costs thousands in designer fees or hours of DIY work.

**Solution:** An agent that takes a brand description and autonomously:
1. Generates complete brand identity (logo, colors, typography, moodboard)
2. Creates social media templates (IG, TikTok, X)
3. Builds and deploys a landing page
4. Optionally launches an SPL token for the brand (community token, loyalty points)
5. Sets up Solana Pay for the brand
6. Delivers everything as a downloadable brand kit + live deployed site

**Solana Integration:**
- Token creation via SPL Token (optional brand/loyalty token)
- Solana Pay integration for the generated storefront
- On-chain brand registry (Metaplex metadata)
- Jupiter for token liquidity setup

**Tech Stack:** Image gen (Kie.ai/nano-banana-pro) + Next.js page builder + SPL Token + Metaplex

**Why This Wins:**
- **Leverages our EXISTING skills** — ad-creative-gen, image generation, landing page building
- **Consumer-friendly** — "describe your brand, get everything built" is instantly understandable
- **Live demo is powerful** — agent builds a complete brand in minutes during demo
- **Ties to Henry's business** — literally what madebylabs does, but automated
- **Token angle** makes it Solana-native, not just a web app

**Complexity:** Medium (mostly leverages existing skills)

**Competitive Advantage:** Only project combining visual AI + web building + token economics in a consumer package.

---

## Recommendation: IDEA 1 — SolPay Agent

**Justification:**
1. **Least competition** — zero payment/commerce projects in the hackathon
2. **Most consumer-accessible** — judges will understand it immediately
3. **Strongest "agent" story** — agent autonomously builds complete payment infrastructure
4. **Highest real-world utility** — businesses actually need this
5. **Fastest to build** — Solana Pay has excellent docs, Jupiter swap is straightforward, Helius webhooks are simple
6. **Demo is killer** — "watch the agent build a complete storefront for a business in 2 minutes"
7. **Ties to Henry's 90-day experiment** — this could literally be a madebylabs service tier

**Suggested approach:**
- Day 1-2: Register, set up repo, build Solana Pay integration + Jupiter auto-swap
- Day 3-4: Build the storefront generator (agent takes business description → deploys page)
- Day 5-6: Add payment monitoring (Helius webhooks), notifications, receipt NFTs
- Day 7-8: Polish UI, add multi-product support, analytics dashboard
- Day 9: Demo video, documentation, forum engagement
- Day 10: Final polish + submit

**Forum strategy:** Post progress updates every 1-2 days, engage with other projects (offer SolPay as payment layer for their projects — OSINT.market, AgentVault, Cove could all integrate), vote generously.

---

## "Most Agentic" Prize Strategy ($5K)
To win this:
- Show the agent **discovering the problem**, not being told what to build
- Show **autonomous decision-making** — agent chooses storefront layout, pricing, design
- Show **multi-agent coordination** — one agent generates copy, another generates images, orchestrator assembles
- Show **continuous improvement** — agent monitors payment data and optimizes the storefront
- Document everything in forum posts — judges should see the journey, not just the result
