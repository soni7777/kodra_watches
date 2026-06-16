import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

function monthKey() {
  const d = new Date();
  return `_analytics/visitors-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}.json`;
}

async function readCount() {
  try {
    const { blobs } = await list({ prefix: "_analytics/visitors", limit: 12 });
    const key = monthKey();
    const blob = blobs.find((b) => b.pathname === key);
    if (!blob) return 0;
    const res = await fetch(blob.url, { cache: "no-store" });
    const data = await res.json();
    return data.count ?? 0;
  } catch {
    return 0;
  }
}

export async function GET() {
  const count = await readCount();
  return NextResponse.json({ count });
}

export async function POST() {
  const count = await readCount();
  const newCount = count + 1;

  await put(monthKey(), JSON.stringify({ count: newCount }), {
    access: "public",
    addRandomSuffix: false,
  });

  return NextResponse.json({ count: newCount });
}
