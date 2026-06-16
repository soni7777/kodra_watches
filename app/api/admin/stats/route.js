import { NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { isAuthorized } from "@/lib/auth";
import { brands } from "@/lib/brands";

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { blobs } = await list({ prefix: "_analytics/", limit: 200 });

  const pages = ["home", ...brands.map((b) => b.slug)];
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  const dataMap = {};
  await Promise.all(
    blobs.map(async (blob) => {
      const match = blob.pathname.match(/_analytics\/(\d{4}-\d{2})-(.+)\.json$/);
      if (!match) return;
      const [, ym, page] = match;
      if (!months.includes(ym) || !pages.includes(page)) return;
      try {
        const res = await fetch(blob.url, { cache: "no-store" });
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
