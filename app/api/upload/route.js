import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { isAuthorized } from "@/lib/auth";
import { brands } from "@/lib/brands";

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const slug = formData.get("slug");
  const files = formData.getAll("files");

  if (!brands.some((brand) => brand.slug === slug)) {
    return NextResponse.json({ error: "Invalid brand" }, { status: 400 });
  }

  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  const uploaded = [];
  for (const file of files) {
    const blob = await put(`${slug}/${Date.now()}-${file.name}`, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    uploaded.push(blob);
  }

  return NextResponse.json({ ok: true, uploaded });
}
