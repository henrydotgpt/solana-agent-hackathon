import { NextRequest, NextResponse } from "next/server";
import {
  getStorefront,
  getPaymentStats,
  getNotifications,
  getUnreadCount,
} from "@/lib/store";

export const dynamic = "force-dynamic";

/**
 * GET /api/dashboard/[slug] — Get dashboard data for a storefront
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const storefront = getStorefront(params.slug);

  if (!storefront) {
    return NextResponse.json(
      { success: false, error: "Storefront not found" },
      { status: 404 }
    );
  }

  const stats = getPaymentStats(params.slug);
  const notifs = getNotifications(params.slug);
  const unreadCount = getUnreadCount(params.slug);

  return NextResponse.json({
    success: true,
    data: {
      storefront,
      stats,
      notifications: notifs.slice(0, 20),
      unreadCount,
    },
  });
}
