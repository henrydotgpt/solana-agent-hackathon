import { NextRequest, NextResponse } from "next/server";
import { createStorefront, listStorefronts } from "@/lib/store";
import { isValidSolanaAddress, sanitizeInput } from "@/lib/utils";
import type { ApiResponse, Storefront, CreateStorefrontRequest } from "@/lib/types";

/**
 * POST /api/storefront — Create a new storefront
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Storefront>>> {
  try {
    const body: CreateStorefrontRequest = await request.json();

    // Validate required fields
    if (!body.businessName?.trim()) {
      return NextResponse.json(
        { success: false, error: "Business name is required" },
        { status: 400 }
      );
    }

    if (!body.walletAddress?.trim()) {
      return NextResponse.json(
        { success: false, error: "Wallet address is required" },
        { status: 400 }
      );
    }

    if (!isValidSolanaAddress(body.walletAddress)) {
      return NextResponse.json(
        { success: false, error: "Invalid Solana wallet address" },
        { status: 400 }
      );
    }

    if (!body.products?.length) {
      return NextResponse.json(
        { success: false, error: "At least one product is required" },
        { status: 400 }
      );
    }

    // Validate products
    for (const product of body.products) {
      if (!product.name?.trim()) {
        return NextResponse.json(
          { success: false, error: "All products must have a name" },
          { status: 400 }
        );
      }
      if (typeof product.price !== "number" || product.price <= 0) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid price for product "${product.name}"`,
          },
          { status: 400 }
        );
      }
    }

    // Sanitize inputs
    const storefront = createStorefront({
      businessName: sanitizeInput(body.businessName.trim()),
      businessDescription: sanitizeInput(
        (body.businessDescription || "").trim()
      ),
      walletAddress: body.walletAddress.trim(),
      products: body.products.map((p) => ({
        name: sanitizeInput(p.name.trim()),
        description: sanitizeInput((p.description || "").trim()),
        price: p.price,
        currency: p.currency === "USDC" ? "USDC" : "SOL",
      })),
      autoConvertToUSDC: body.autoConvertToUSDC,
    });

    return NextResponse.json({ success: true, data: storefront });
  } catch (error) {
    console.error("Create storefront error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create storefront" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/storefront — List all storefronts
 */
export async function GET(): Promise<
  NextResponse<ApiResponse<Storefront[]>>
> {
  const storefronts = listStorefronts();
  return NextResponse.json({ success: true, data: storefronts });
}
