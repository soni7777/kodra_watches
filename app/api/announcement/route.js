import { NextResponse } from "next/server";
import { getAnnouncement } from "@/lib/announcement";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getAnnouncement();
  if (!data?.active || !data?.text?.trim()) {
    return NextResponse.json({ active: false, text: "" });
  }
  return NextResponse.json({ active: true, text: data.text });
}
