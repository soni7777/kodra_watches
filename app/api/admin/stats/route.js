import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { brands } from "@/lib/brands";

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
const KEY = process.env.CLOUDINARY_API_KEY;
const SECRET = process.env.CLOUDINARY_API_SECRET;

function basicAuth() {
  return "Basic " + Buffer.from(`${KEY}:${SECRET}`).toString("base64");
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pages = ["home", ...brands.map((b) => b.slug)];
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  const listRes = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD}/resources/raw?type=upload&prefix=analytics/&max_results=500`,
    { headers: { Authorization: basicAuth() } }
  );
  const resources = listRes.ok ? (await listRes.json()).resources ?? [] : [];

  const dataMap = {};
  await Promise.all(
    resources.map(async (resource) => {
      const match = resource.public_id.match(/^analytics\/(\d{4}-\d{2})-(.+)$/);
      if (!match) return;
      const [, ym, page] = match;
      if (!months.includes(ym) || !pages.includes(page)) return;
      try {
        const res = await fetch(resource.secure_url, { cache: "no-store" });
        const data = await res.json();
        if (!dataMap[page]) dataMap[page] = {};
        dataMap[page][ym] = data.count ?? 0;
      } catch {}
    })
  );

  const result = pages.map((page) => ({
    page,
    label: page === "home" ? "Faqja kryesore" : brands.find((b) => b.slug === page)?.name ?? page,
    months: months.map((ym) => ({ ym, count: dataMap[page]?.[ym] ?? 0 })),
    total: months.reduce((s, ym) => s + (dataMap[page]?.[ym] ?? 0), 0),
  }));

  return NextResponse.json({ months, rows: result });
}
