import { brands } from "@/lib/brands";
import { getBrandCoverImage } from "@/lib/blob";
import { readCount } from "@/lib/visitors";
import VisitorCounter from "@/components/VisitorCounter";
import BrandsSearch from "@/components/BrandsSearch";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [covers, monthlyVisits] = await Promise.all([
    Promise.all(brands.map((brand) => getBrandCoverImage(brand.slug))),
    readCount("home"),
  ]);

  const items = brands.map((brand, i) => ({ brand, coverUrl: covers[i] }));
  const month = new Date().toLocaleString("sq-AL", { month: "long", year: "numeric" });

  return (
    <div className="px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <h2 className="font-serif text-4xl sm:text-5xl text-foreground mb-4 tracking-wide">
            Koleksioni Ynë
          </h2>
          <div className="mx-auto mb-4 h-px w-16 bg-gold/50" />
          <div className="flex items-center justify-center gap-2 rounded-full border border-gold/20 bg-background-card px-4 py-1.5 text-xs text-foreground-muted mx-auto w-fit mb-6">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            <span>
              <span className="text-gold-light font-semibold">{monthlyVisits.toLocaleString()}</span>
              {" "}vizitorë — {month}
            </span>
          </div>
          <VisitorCounter />
        </div>

        <BrandsSearch items={items} />
      </div>
    </div>
  );
}
