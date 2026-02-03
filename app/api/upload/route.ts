import { NextRequest, NextResponse } from "next/server";
import { imageStore, generateImageId } from "@/lib/image-store";

/**
 * POST /api/upload — Upload an image (base64 or multipart)
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let imageData: string;
    let mimeType: string;
    let filename: string;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File;

      if (!file) {
        return NextResponse.json(
          { success: false, error: "No file provided" },
          { status: 400 }
        );
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { success: false, error: "Only image files are allowed" },
          { status: 400 }
        );
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: "Image must be under 5MB" },
          { status: 400 }
        );
      }

      const buffer = await file.arrayBuffer();
      imageData = Buffer.from(buffer).toString("base64");
      mimeType = file.type;
      filename = file.name;
    } else {
      // JSON body with base64 data
      const body = await request.json();
      if (!body.data) {
        return NextResponse.json(
          { success: false, error: "No image data provided" },
          { status: 400 }
        );
      }

      // Handle data URI or raw base64
      if (body.data.startsWith("data:")) {
        const match = body.data.match(/^data:(image\/[^;]+);base64,(.+)$/);
        if (!match) {
          return NextResponse.json(
            { success: false, error: "Invalid image data URI" },
            { status: 400 }
          );
        }
        mimeType = match[1];
        imageData = match[2];
      } else {
        imageData = body.data;
        mimeType = body.contentType || "image/png";
      }
      filename = body.filename || "upload.png";

      // Validate size (~5MB in base64 is ~6.7MB string)
      if (imageData.length > 7 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: "Image must be under 5MB" },
          { status: 400 }
        );
      }
    }

    const id = generateImageId();
    imageStore.set(id, { data: imageData, contentType: mimeType, filename });

    // Build the URL for serving this image
    const url = `/api/upload/${id}`;

    return NextResponse.json({
      success: true,
      data: { id, url, filename },
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 }
    );
  }
}

