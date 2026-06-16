import { list } from "@vercel/blob";

// Server-only: returns all uploaded images for a brand (matched by slug
// prefix), most recent first. Returns an empty array if there is no token
// configured or no images have been uploaded yet.
export async function getBrandImages(slug) {
  try {
    const { blobs } = await list({ prefix: slug, limit: 1000 });
    return blobs
      .slice()
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  } catch {
    return [];
  }
}

// Server-only: returns the URL of the most recently uploaded image for a
// brand, or null if none exists yet.
export async function getBrandCoverImage(slug) {
  const images = await getBrandImages(slug);
  return images[0]?.url ?? null;
}
