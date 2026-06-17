import { NextResponse } from "next/server";
import { listImages } from "@/lib/cloudinary";
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

  const blobs = await listImages(slug);
  return NextResponse.json({ blobs });
}
