import { NextResponse } from "next/server";
import { getAnnouncement, saveAnnouncement } from "@/lib/announcement";
import { isAuthorized } from "@/lib/auth";

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await getAnnouncement();
  return NextResponse.json(data ?? { text: "", active: false });
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { text, active } = await request.json();
  await saveAnnouncement(text ?? "", active ?? false);
  return NextResponse.json({ ok: true });
}
