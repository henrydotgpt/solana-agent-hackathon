/**
 * Solana Memo Program instruction builder
 */

import { PublicKey, TransactionInstruction } from "@solana/web3.js";

const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);

/**
 * Create a memo instruction
 */
export function createMemoInstruction(
  memo: string,
  signer: PublicKey
): TransactionInstruction {
  return new TransactionInstruction({
    programId: MEMO_PROGRAM_ID,
    keys: [{ pubkey: signer, isSigner: true, isWritable: false }],
    data: Buffer.from(memo, "utf-8"),
  });
}
