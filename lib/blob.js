import { list } from "@vercel/blob";

// Server-only: returns the URL of the most recently uploaded image for a
// brand (matched by slug prefix), or null if none exists yet.
export async function getBrandCoverImage(slug) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;

  try {
    const { blobs } = await list({ prefix: slug, token, limit: 100 });
    if (blobs.length === 0) return null;

    const latest = blobs.reduce((a, b) =>
      new Date(a.uploadedAt) > new Date(b.uploadedAt) ? a : b
    );
    return latest.url;
  } catch {
    return null;
  }
}
