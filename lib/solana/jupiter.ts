import { Connection, PublicKey, VersionedTransaction } from "@solana/web3.js";
import { JUPITER_API_URL, USDC_MINT, SOL_MINT } from "../constants";
import { getConnection } from "./pay";

/**
 * Jupiter swap quote
 */
export interface SwapQuote {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  priceImpactPct: string;
  routePlan: Array<{
    swapInfo: {
      ammKey: string;
      label: string;
      inputMint: string;
      outputMint: string;
      inAmount: string;
      outAmount: string;
      feeAmount: string;
      feeMint: string;
    };
    percent: number;
  }>;
}

/**
 * Get a swap quote from Jupiter
 */
export async function getSwapQuote(
  inputMint: string,
  outputMint: string,
  amount: number, // In base units (lamports for SOL, smallest unit for SPL)
  slippageBps = 50 // 0.5% default slippage
): Promise<SwapQuote | null> {
  try {
    const url = new URL(`${JUPITER_API_URL}/quote`);
    url.searchParams.set("inputMint", inputMint);
    url.searchParams.set("outputMint", outputMint);
    url.searchParams.set("amount", Math.round(amount).toString());
    url.searchParams.set("slippageBps", slippageBps.toString());

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error("Jupiter quote error:", await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Jupiter quote fetch failed:", error);
    return null;
  }
}

/**
 * Get a swap transaction from Jupiter
 */
export async function getSwapTransaction(
  quoteResponse: SwapQuote,
  userPublicKey: PublicKey
): Promise<VersionedTransaction | null> {
  try {
    const response = await fetch(`${JUPITER_API_URL}/swap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey: userPublicKey.toBase58(),
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true,
        prioritizationFeeLamports: "auto",
      }),
    });

    if (!response.ok) {
      console.error("Jupiter swap error:", await response.text());
      return null;
    }

    const { swapTransaction } = await response.json();

    // Deserialize the transaction
    const transactionBuf = Buffer.from(swapTransaction, "base64");
    return VersionedTransaction.deserialize(transactionBuf);
  } catch (error) {
    console.error("Jupiter swap transaction failed:", error);
    return null;
  }
}

/**
 * Get SOL → USDC conversion rate
 */
export async function getSOLtoUSDCRate(): Promise<number | null> {
  try {
    // Quote 1 SOL → USDC
    const quote = await getSwapQuote(
      SOL_MINT.toBase58(),
      USDC_MINT.toBase58(),
      1e9 // 1 SOL in lamports
    );

    if (!quote) return null;

    // USDC has 6 decimals
    return Number(quote.outAmount) / 1e6;
  } catch {
    return null;
  }
}

/**
 * Auto-convert received SOL to USDC via Jupiter
 */
export async function createAutoConvertTransaction(
  userPublicKey: PublicKey,
  solAmount: number // In SOL (not lamports)
): Promise<VersionedTransaction | null> {
  const lamports = Math.round(solAmount * 1e9);

  const quote = await getSwapQuote(
    SOL_MINT.toBase58(),
    USDC_MINT.toBase58(),
    lamports,
    100 // 1% slippage for auto-convert
  );

  if (!quote) return null;

  return getSwapTransaction(quote, userPublicKey);
}
