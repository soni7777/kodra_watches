import { NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { isAuthorized } from "@/lib/auth";
import { brands } from "@/lib/brands";

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!brands.some((brand) => brand.slug === slug)) {
    return NextResponse.json({ error: "Invalid brand" }, { status: 400 });
  }

  const { blobs } = await list({
    prefix: slug,
    token: process.env.BLOB_READ_WRITE_TOKEN,
    limit: 1000,
  });

  blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

  return NextResponse.json({ blobs });
}
