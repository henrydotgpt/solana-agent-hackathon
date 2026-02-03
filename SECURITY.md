# Security Protocol — Paygent

## API Keys & Secrets
- Colosseum API key: `.env` only (chmod 600, gitignored)
- Solana RPC keys: `.env` only
- Helius API key: `.env` only
- Jupiter: public API (no key needed)
- NEVER commit secrets — pre-commit hook enforced

## Pre-Commit Check
Run before every push:
```bash
grep -rn "REDACTED\|API_KEY\|PRIVATE_KEY\|secret_\|ntn_\|ghp_\|sk-proj" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" .
```
If this returns ANYTHING, DO NOT PUSH.

## Wallet Security
- No custodial wallets
- No private keys stored anywhere
- Users connect their own wallets (Phantom/Solflare)
- All transactions signed client-side via wallet adapter

## Input Validation
- Sanitize all user text inputs (business descriptions, product names)
- Validate wallet addresses (Base58, correct length)
- Validate payment amounts (positive numbers, max limits)
- Rate limit storefront creation

## Infrastructure
- Vercel env vars for production secrets
- CORS: only allow our domains
- CSP headers on all pages
- No admin/debug endpoints in production

## Hackathon-Specific
- Claim code: shared privately via Telegram DM only
- API key: only sent to agents.colosseum.com
- Repo: private until submission review
- Forum posts: no secrets, no internal details
