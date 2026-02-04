# Paygent — Devnet Payment Testing Guide

## Prerequisites

1. **Phantom wallet** on your phone (iOS or Android)
2. Switch Phantom to **devnet**: Settings → Developer Settings → Change Network → Devnet
3. **Get devnet SOL**: In Phantom, tap your SOL balance → "Request Airdrop" (or use https://faucet.solana.com)

## Test 1: View Demo Storefront

1. Open: **https://paygent-solana.vercel.app/pay/demo-store**
2. ✅ Should see "Sol Brew Coffee" with 3 products
3. ✅ SOL price should show (e.g., "◎ 1 SOL ≈ $XX.XX")
4. ✅ Trust badges: Non-Custodial, Auto-Convert to USDC, Instant Settlement

## Test 2: QR Code Payment (THE critical test)

1. On **desktop**, open: https://paygent-solana.vercel.app/pay/demo-store
2. Click **"Ethiopian Single Origin"** (0.08 SOL) → payment modal opens
3. QR code should appear with Solana logo in center
4. **On your phone**, open Phantom → tap the scan icon (top right)
5. Scan the QR code
6. Phantom should show:
   - Label: "Sol Brew Coffee"
   - Transaction details with the payment amount
   - Fee breakdown (merchant receives ~0.0794 SOL + ~0.0006 SOL platform fee)
7. **Approve the transaction**
8. Modal should update to "Payment Confirmed! ✅" with explorer link
9. Click the explorer link → verify transaction on Solana Explorer (devnet)

## Test 3: Payment Link (mobile)

1. On the payment modal, click **"Copy Payment Link"**
2. Open the copied link in Phantom's built-in browser
3. Should trigger a payment prompt directly

## Test 4: Dashboard

1. Open: **https://paygent-solana.vercel.app/dashboard/demo-store**
2. ✅ Should see payment stats (total payments, revenue)
3. ✅ Recent payments table with seeded demo data
4. ✅ Notification bell with unread count
5. After a successful Test 2 payment: dashboard should show the new payment (auto-refreshes every 10s)

## Test 5: Create Flow

1. Open: **https://paygent-solana.vercel.app/create**
2. Chat with the AI agent — describe a business:
   > "I'm a personal trainer in Dubai. I offer 3 packages: single session $50, 5-pack $200, monthly unlimited $400"
3. Agent should parse products, ask for your Solana wallet address
4. Paste your Phantom devnet address
5. Agent creates the storefront → redirects to your live `/pay/[slug]` page
6. ⚠️ **Note:** Created storefronts may not persist between page reloads (in-memory store on serverless). Demo-store always works.

## Test 6: Multi-Currency Toggle

1. On any product payment modal, look for "Pay with: SOL / USDC" toggle
2. Switch between SOL and USDC
3. QR code should regenerate for the selected currency
4. ⚠️ **USDC on devnet** requires you to have devnet USDC tokens (mint: `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`). SOL is easier to test.

## Troubleshooting

| Issue | Fix |
|---|---|
| Phantom doesn't scan QR | Make sure Phantom is on **devnet**. The transaction request URL points to our API. |
| "Transaction failed" | Check you have enough devnet SOL (need ~0.1 SOL for the payment + gas) |
| Modal doesn't update to "Confirmed" | Payment verification polls on-chain every 3s. Wait 10-15s. Check Solana Explorer. |
| Storefront not found after creating | Serverless cold start — in-memory store reset. Use demo-store for reliable testing. |
| SOL price shows as null | CoinGecko API may be rate-limited. Refresh the page. |

## What to Report

After testing, let me know:
- [ ] QR scan worked in Phantom? (Y/N)
- [ ] Transaction approved and confirmed? (Y/N)
- [ ] Modal showed "Payment Confirmed"? (Y/N)
- [ ] Dashboard updated with new payment? (Y/N)
- [ ] Any errors or weird behavior?

This is the #1 priority — proving the end-to-end payment flow works on devnet.
