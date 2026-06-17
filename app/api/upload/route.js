import { NextResponse } from "next/server";
import { generateSignature } from "@/lib/cloudinary";
import { isAuthorized } from "@/lib/auth";
import { brands } from "@/lib/brands";

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await request.json();

  if (!brands.some((brand) => brand.slug === slug)) {
    return NextResponse.json({ error: "Invalid brand" }, { status: 400 });
  }

  return NextResponse.json(generateSignature(slug));
}
