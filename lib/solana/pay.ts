import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  getMint,
} from "@solana/spl-token";
import BigNumber from "bignumber.js";
import { SOLANA_RPC_URL, USDC_MINT, SOLANA_NETWORK } from "../constants";

// Re-export for convenience
export { encodeURL, createQR } from "@solana/pay";

/**
 * Payment request configuration
 */
export interface PaymentRequest {
  recipient: PublicKey;
  amount: BigNumber;
  label?: string;
  message?: string;
  memo?: string;
  splToken?: PublicKey;
  reference?: PublicKey;
}

/**
 * Payment status
 */
export type PaymentStatus =
  | "pending"
  | "confirmed"
  | "validated"
  | "failed"
  | "expired";

/**
 * Create a Solana connection
 */
export function getConnection(): Connection {
  return new Connection(SOLANA_RPC_URL, "confirmed");
}

/**
 * Generate a unique reference for tracking a payment
 */
export function generateReference(): PublicKey {
  const { Keypair } = require("@solana/web3.js");
  return Keypair.generate().publicKey;
}

/**
 * Build a Solana Pay URL for a transfer request
 */
export function buildPaymentURL(request: PaymentRequest): string {
  const { recipient, amount, label, message, memo, splToken, reference } =
    request;

  const url = new URL(`solana:${recipient.toBase58()}`);

  url.searchParams.set("amount", amount.toString());

  if (splToken) {
    url.searchParams.set("spl-token", splToken.toBase58());
  }
  if (reference) {
    url.searchParams.set("reference", reference.toBase58());
  }
  if (label) {
    url.searchParams.set("label", encodeURIComponent(label));
  }
  if (message) {
    url.searchParams.set("message", encodeURIComponent(message));
  }
  if (memo) {
    url.searchParams.set("memo", encodeURIComponent(memo));
  }

  return url.toString();
}

/**
 * Create a SOL transfer transaction
 */
export async function createSOLTransfer(
  sender: PublicKey,
  recipient: PublicKey,
  amount: number,
  reference?: PublicKey
): Promise<Transaction> {
  const connection = getConnection();
  const transaction = new Transaction();

  const transferInstruction = SystemProgram.transfer({
    fromPubkey: sender,
    toPubkey: recipient,
    lamports: Math.round(amount * LAMPORTS_PER_SOL),
  });

  // Add reference key for tracking
  if (reference) {
    transferInstruction.keys.push({
      pubkey: reference,
      isSigner: false,
      isWritable: false,
    });
  }

  transaction.add(transferInstruction);

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.lastValidBlockHeight = lastValidBlockHeight;
  transaction.feePayer = sender;

  return transaction;
}

/**
 * Create a SPL token transfer transaction (e.g., USDC)
 */
export async function createTokenTransfer(
  sender: PublicKey,
  recipient: PublicKey,
  mint: PublicKey,
  amount: number,
  reference?: PublicKey
): Promise<Transaction> {
  const connection = getConnection();
  const transaction = new Transaction();

  // Get token accounts
  const senderATA = await getAssociatedTokenAddress(mint, sender);
  const recipientATA = await getAssociatedTokenAddress(mint, recipient);

  // Get mint info for decimals
  const mintInfo = await getMint(connection, mint);

  const transferInstruction = createTransferCheckedInstruction(
    senderATA,
    mint,
    recipientATA,
    sender,
    Math.round(amount * Math.pow(10, mintInfo.decimals)),
    mintInfo.decimals
  );

  // Add reference key for tracking
  if (reference) {
    transferInstruction.keys.push({
      pubkey: reference,
      isSigner: false,
      isWritable: false,
    });
  }

  transaction.add(transferInstruction);

  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.lastValidBlockHeight = lastValidBlockHeight;
  transaction.feePayer = sender;

  return transaction;
}

/**
 * Verify a payment was made by checking for the reference on-chain
 */
export async function verifyPayment(
  reference: PublicKey,
  recipient: PublicKey,
  amount: BigNumber,
  splToken?: PublicKey
): Promise<{ verified: boolean; signature?: string }> {
  const connection = getConnection();

  try {
    // Find transactions with this reference
    const signatures = await connection.getSignaturesForAddress(reference, {
      limit: 1,
    });

    if (signatures.length === 0) {
      return { verified: false };
    }

    const signature = signatures[0].signature;

    // Get the transaction details
    const tx = await connection.getTransaction(signature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    });

    if (!tx) {
      return { verified: false };
    }

    // Basic verification — transaction exists and was confirmed
    // In production, verify exact amount and recipient
    return { verified: true, signature };
  } catch {
    return { verified: false };
  }
}

/**
 * Get SOL balance for an address
 */
export async function getSOLBalance(address: PublicKey): Promise<number> {
  const connection = getConnection();
  const balance = await connection.getBalance(address);
  return balance / LAMPORTS_PER_SOL;
}

/**
 * Get the explorer URL for a transaction
 */
export function getExplorerURL(signature: string): string {
  const cluster = SOLANA_NETWORK === "mainnet-beta" ? "" : `?cluster=${SOLANA_NETWORK}`;
  return `https://explorer.solana.com/tx/${signature}${cluster}`;
}
