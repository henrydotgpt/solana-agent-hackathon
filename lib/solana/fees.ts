/**
 * Paygent fee routing — the revenue engine
 *
 * Every payment processed through Paygent splits:
 *   - Merchant receives (100% - fee)
 *   - Paygent treasury receives the fee
 *
 * Fee is transparent: shown to merchants at storefront creation
 * and to payers at checkout.
 */

import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Keypair,
} from "@solana/web3.js";
import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  getMint,
  createAssociatedTokenAccountInstruction,
  getAccount,
} from "@solana/spl-token";
import { SOLANA_RPC_URL, USDC_MINT } from "../constants";

// ─── Fee Configuration ──────────────────────────────────

/** Platform fee in basis points (1 bps = 0.01%) */
export const PLATFORM_FEE_BPS = parseInt(
  process.env.PAYGENT_FEE_BPS || process.env.NEXT_PUBLIC_PAYGENT_FEE_BPS || "75",
  10
);

/** Swap spread in basis points */
export const SWAP_SPREAD_BPS = parseInt(
  process.env.PAYGENT_SWAP_SPREAD_BPS || "20",
  10
);

/** Paygent treasury wallet address */
export const FEE_WALLET_ADDRESS =
  process.env.NEXT_PUBLIC_PAYGENT_FEE_WALLET || "";

/** Whether fee routing is enabled (requires a fee wallet) */
export const FEE_ROUTING_ENABLED =
  FEE_WALLET_ADDRESS.length > 0 && PLATFORM_FEE_BPS > 0;

// ─── Fee Calculations ───────────────────────────────────

export interface FeeBreakdown {
  /** Total amount the payer sends */
  totalAmount: number;
  /** Amount the merchant receives */
  merchantAmount: number;
  /** Amount Paygent treasury receives */
  feeAmount: number;
  /** Fee percentage as a human-readable string */
  feePercent: string;
  /** Fee in basis points */
  feeBps: number;
}

/**
 * Calculate the fee split for a payment
 *
 * @param amount — the listed price (what the merchant wants to receive)
 * @returns breakdown of the split
 */
export function calculateFees(amount: number): FeeBreakdown {
  if (!FEE_ROUTING_ENABLED || amount <= 0) {
    return {
      totalAmount: amount,
      merchantAmount: amount,
      feeAmount: 0,
      feePercent: "0%",
      feeBps: 0,
    };
  }

  // Fee is taken from the payment amount (merchant absorbs)
  // totalAmount = amount (what payer pays)
  // feeAmount = amount * (feeBps / 10000)
  // merchantAmount = amount - feeAmount
  const feeAmount = (amount * PLATFORM_FEE_BPS) / 10000;
  const merchantAmount = amount - feeAmount;

  return {
    totalAmount: amount,
    merchantAmount: roundToDecimals(merchantAmount, 9),
    feeAmount: roundToDecimals(feeAmount, 9),
    feePercent: `${(PLATFORM_FEE_BPS / 100).toFixed(2)}%`,
    feeBps: PLATFORM_FEE_BPS,
  };
}

/**
 * Calculate the effective Jupiter slippage including our swap spread
 */
export function getEffectiveSlippageBps(baseSlippageBps: number = 50): number {
  return baseSlippageBps + SWAP_SPREAD_BPS;
}

// ─── Transaction Builders ───────────────────────────────

/**
 * Build a SOL payment transaction with fee split
 *
 * Creates a transaction with 2 (or 1) transfer instructions:
 * 1. Merchant receives (amount - fee) SOL
 * 2. Paygent treasury receives fee SOL (if fee routing enabled)
 */
export async function buildSOLPaymentTransaction(params: {
  payer: PublicKey;
  merchant: PublicKey;
  amount: number; // In SOL
  reference?: PublicKey;
  memo?: string;
}): Promise<{ transaction: Transaction; fees: FeeBreakdown }> {
  const { payer, merchant, amount, reference, memo } = params;
  const connection = new Connection(SOLANA_RPC_URL, "confirmed");
  const transaction = new Transaction();
  const fees = calculateFees(amount);

  // Instruction 1: Transfer to merchant
  const merchantTransfer = SystemProgram.transfer({
    fromPubkey: payer,
    toPubkey: merchant,
    lamports: Math.round(fees.merchantAmount * LAMPORTS_PER_SOL),
  });

  // Add reference for payment tracking
  if (reference) {
    merchantTransfer.keys.push({
      pubkey: reference,
      isSigner: false,
      isWritable: false,
    });
  }

  transaction.add(merchantTransfer);

  // Instruction 2: Fee transfer to Paygent treasury (if enabled)
  if (FEE_ROUTING_ENABLED && fees.feeAmount > 0) {
    const feeWallet = new PublicKey(FEE_WALLET_ADDRESS);
    const feeTransfer = SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: feeWallet,
      lamports: Math.round(fees.feeAmount * LAMPORTS_PER_SOL),
    });

    transaction.add(feeTransfer);
  }

  // Add memo if provided
  if (memo) {
    const { createMemoInstruction } = await import("./memo");
    transaction.add(createMemoInstruction(memo, payer));
  }

  // Set recent blockhash and fee payer
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.lastValidBlockHeight = lastValidBlockHeight;
  transaction.feePayer = payer;

  return { transaction, fees };
}

/**
 * Build a USDC payment transaction with fee split
 */
export async function buildUSDCPaymentTransaction(params: {
  payer: PublicKey;
  merchant: PublicKey;
  amount: number; // In USDC
  reference?: PublicKey;
  memo?: string;
}): Promise<{ transaction: Transaction; fees: FeeBreakdown }> {
  const { payer, merchant, amount, reference, memo } = params;
  const connection = new Connection(SOLANA_RPC_URL, "confirmed");
  const transaction = new Transaction();
  const fees = calculateFees(amount);
  const mint = USDC_MINT;
  const mintInfo = await getMint(connection, mint);
  const decimals = mintInfo.decimals;

  // Get payer's token account
  const payerATA = await getAssociatedTokenAddress(mint, payer);

  // Get/create merchant's token account
  const merchantATA = await getAssociatedTokenAddress(mint, merchant);
  const merchantAccountExists = await tokenAccountExists(
    connection,
    merchantATA
  );
  if (!merchantAccountExists) {
    transaction.add(
      createAssociatedTokenAccountInstruction(payer, merchantATA, merchant, mint)
    );
  }

  // Instruction 1: Transfer to merchant
  const merchantTransfer = createTransferCheckedInstruction(
    payerATA,
    mint,
    merchantATA,
    payer,
    Math.round(fees.merchantAmount * Math.pow(10, decimals)),
    decimals
  );

  if (reference) {
    merchantTransfer.keys.push({
      pubkey: reference,
      isSigner: false,
      isWritable: false,
    });
  }

  transaction.add(merchantTransfer);

  // Instruction 2: Fee transfer to Paygent treasury (if enabled)
  if (FEE_ROUTING_ENABLED && fees.feeAmount > 0) {
    const feeWallet = new PublicKey(FEE_WALLET_ADDRESS);
    const feeATA = await getAssociatedTokenAddress(mint, feeWallet);

    const feeAccountExists = await tokenAccountExists(connection, feeATA);
    if (!feeAccountExists) {
      transaction.add(
        createAssociatedTokenAccountInstruction(payer, feeATA, feeWallet, mint)
      );
    }

    const feeTransfer = createTransferCheckedInstruction(
      payerATA,
      mint,
      feeATA,
      payer,
      Math.round(fees.feeAmount * Math.pow(10, decimals)),
      decimals
    );

    transaction.add(feeTransfer);
  }

  if (memo) {
    const { createMemoInstruction } = await import("./memo");
    transaction.add(createMemoInstruction(memo, payer));
  }

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.lastValidBlockHeight = lastValidBlockHeight;
  transaction.feePayer = payer;

  return { transaction, fees };
}

// ─── Helpers ────────────────────────────────────────────

async function tokenAccountExists(
  connection: Connection,
  address: PublicKey
): Promise<boolean> {
  try {
    await getAccount(connection, address);
    return true;
  } catch {
    return false;
  }
}

function roundToDecimals(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
