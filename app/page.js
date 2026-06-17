import { brands } from "@/lib/brands";
import { getBrandCoverImage } from "@/lib/blob";
import VisitorCounter from "@/components/VisitorCounter";
import BrandsSearch from "@/components/BrandsSearch";

export const dynamic = "force-dynamic";

export default async function Home() {
  const covers = await Promise.all(
    brands.map((brand) => getBrandCoverImage(brand.slug))
  );

  const items = brands.map((brand, i) => ({ brand, coverUrl: covers[i] }));

  return (
    <div className="px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <h2 className="font-serif text-4xl sm:text-5xl text-foreground mb-4 tracking-wide">
            Koleksioni
          </h2>
          <div className="mx-auto mb-4 h-px w-16 bg-gold/50" />
          <p className="mx-auto max-w-md text-foreground-muted text-sm tracking-wide mb-6">
            Zgjidh markën dhe zbulo modelet ekskluzive të disponueshme.
          </p>
          <VisitorCounter />
        </div>

        <BrandsSearch items={items} />
      </div>
    </div>
  );
}
