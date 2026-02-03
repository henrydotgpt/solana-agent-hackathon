/**
 * In-memory image store
 * For production: use Vercel Blob, S3, or Cloudinary
 */
export const imageStore = new Map<string, { data: string; contentType: string; filename: string }>();

export function generateImageId(): string {
  return `img_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
}
