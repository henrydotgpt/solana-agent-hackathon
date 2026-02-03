import { NextRequest, NextResponse } from "next/server";
import { getStorefront } from "@/lib/store";
import type { ApiResponse, Storefront } from "@/lib/types";

/**
 * GET /api/storefront/[slug] — Get a specific storefront
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
): Promise<NextResponse<ApiResponse<Storefront>>> {
  const storefront = getStorefront(params.slug);

  if (!storefront) {
    return NextResponse.json(
      { success: false, error: "Storefront not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: storefront });
}
