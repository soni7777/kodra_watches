import { list } from "@vercel/blob";

function monthKey(page) {
  const d = new Date();
  const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  return `_analytics/${ym}-${page}.json`;
}

export async function readCount(page) {
  try {
    const key = monthKey(page);
    const { blobs } = await list({ prefix: "_analytics/", limit: 200 });
    const blob = blobs.find((b) => b.pathname === key);
    if (!blob) return 0;
    const res = await fetch(blob.url, { cache: "no-store" });
    const data = await res.json();
    return data.count ?? 0;
  } catch {
    return 0;
  }
}
