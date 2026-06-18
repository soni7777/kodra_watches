import { NextResponse } from "next/server";
import crypto from "crypto";

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
const KEY = process.env.CLOUDINARY_API_KEY;
const SECRET = process.env.CLOUDINARY_API_SECRET;

function basicAuth() {
  return "Basic " + Buffer.from(`${KEY}:${SECRET}`).toString("base64");
}

function analyticsPublicId(page) {
  const d = new Date();
  const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  return `analytics/${ym}-${page}`;
}

async function readCount(publicId) {
  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD}/resources/raw/upload/${encodeURIComponent(publicId)}`,
      { headers: { Authorization: basicAuth() } }
    );
    if (!res.ok) return 0;
    const resource = await res.json();
    const contentRes = await fetch(resource.secure_url, { cache: "no-store" });
    if (!contentRes.ok) return 0;
    const data = await contentRes.json();
    return data.count ?? 0;
  } catch {
    return 0;
  }
}

async function writeCount(publicId, count) {
  const timestamp = Math.round(Date.now() / 1000);
  const params = { overwrite: true, public_id: publicId, timestamp };
  const str = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  const signature = crypto.createHash("sha256").update(str + SECRET).digest("hex");

  const content = JSON.stringify({ count });
  const body = new FormData();
  body.append("file", new Blob([content], { type: "application/json" }), "count.json");
  body.append("api_key", KEY);
  body.append("timestamp", String(timestamp));
  body.append("public_id", publicId);
  body.append("overwrite", "true");
  body.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/raw/upload`, {
    method: "POST",
    body,
  });
  if (!res.ok) throw new Error("Failed to write analytics");
}

export async function GET(request) {
  const page = new URL(request.url).searchParams.get("page") ?? "home";
  const count = await readCount(analyticsPublicId(page));
  return NextResponse.json({ count });
}

export async function POST(request) {
  const page = new URL(request.url).searchParams.get("page") ?? "home";
  const publicId = analyticsPublicId(page);
  const count = await readCount(publicId);
  const newCount = count + 1;
  await writeCount(publicId, newCount);
  return NextResponse.json({ count: newCount });
}
