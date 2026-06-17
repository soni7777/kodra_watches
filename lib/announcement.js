import { put, list } from "@vercel/blob";

export async function getAnnouncement() {
  try {
    const { blobs } = await list({ prefix: "announcement.json", limit: 1 });
    if (!blobs.length) return null;
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function saveAnnouncement(text, active) {
  await put("announcement.json", JSON.stringify({ text, active }), {
    access: "public",
    addRandomSuffix: false,
  });
}
