import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

function monthKey(page) {
  const d = new Date();
  const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  return `_analytics/${ym}-${page}.json`;
}

async function readCount(page) {
  try {
    const key = monthKey(page);
    const { blobs } = await list({ prefix: `_analytics/`, limit: 200 });
    const blob = blobs.find((b) => b.pathname === key);
    if (!blob) return 0;
    const res = await fetch(blob.url, { cache: "no-store" });
    const data = await res.json();
    return data.count ?? 0;
  } catch {
    return 0;
  }
}

export async function GET(request) {
  const page = new URL(request.url).searchParams.get("page") ?? "home";
  const count = await readCount(page);
  return NextResponse.json({ count });
}

export async function POST(request) {
  const page = new URL(request.url).searchParams.get("page") ?? "home";
  const count = await readCount(page);
  const newCount = count + 1;

  await put(monthKey(page), JSON.stringify({ count: newCount }), {
    access: "public",
    addRandomSuffix: false,
  });

  return NextResponse.json({ count: newCount });
}
