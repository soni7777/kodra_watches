import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { isAuthorized } from "@/lib/auth";

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url } = await request.json();
  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN });

  return NextResponse.json({ ok: true });
}
