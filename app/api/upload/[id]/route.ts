import { NextRequest, NextResponse } from "next/server";
import { imageStore } from "@/lib/image-store";

/**
 * GET /api/upload/[id] — Serve an uploaded image
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const image = imageStore.get(params.id);

  if (!image) {
    return new NextResponse("Not found", { status: 404 });
  }

  const buffer = Buffer.from(image.data, "base64");

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": image.contentType,
      "Content-Length": buffer.length.toString(),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
