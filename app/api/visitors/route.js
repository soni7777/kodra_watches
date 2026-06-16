import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

function monthKey() {
  const d = new Date();
  return `_analytics/visitors-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}.json`;
}

async function readCount(token) {
  try {
    const { blobs } = await list({ prefix: "_analytics/visitors", token, limit: 12 });
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
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return NextResponse.json({ count: 0 });
  const count = await readCount(token);
  return NextResponse.json({ count });
}

export async function POST() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return NextResponse.json({ count: 0 });

  const count = await readCount(token);
  const newCount = count + 1;

  await put(monthKey(), JSON.stringify({ count: newCount }), {
    access: "public",
    token,
    addRandomSuffix: false,
  });

  return NextResponse.json({ count: newCount });
}
