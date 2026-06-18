import { NextResponse } from "next/server";
import { deleteImage } from "@/lib/cloudinary";
import { isAuthorized } from "@/lib/auth";

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { public_id } = await request.json();
  if (!public_id) {
    return NextResponse.json({ error: "Missing public_id" }, { status: 400 });
  }

  try {
    await deleteImage(public_id);
  } catch (err) {
    console.error("Delete error:", err?.message);
    return NextResponse.json({ error: err?.message ?? "Delete failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
