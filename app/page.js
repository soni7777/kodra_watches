import Image from "next/image";
import Link from "next/link";
import { brands } from "@/lib/brands";
import { getBrandCoverImage } from "@/lib/blob";

export default async function Home() {
  const covers = await Promise.all(
    brands.map((brand) => getBrandCoverImage(brand.slug))
  );

  return (
    <div className="px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-4xl sm:text-5xl text-foreground mb-4">
            Koleksioni
          </h2>
          <p className="mx-auto max-w-md text-foreground/70">
            Zgjidh markën dhe zbulo modelet ekskluzive të disponueshme.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {brands.map((brand, i) => (
            <BrandCard key={brand.slug} brand={brand} coverUrl={covers[i]} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BrandCard({ brand, coverUrl }) {
  return (
    <Link
      href={`/brand/${brand.slug}`}
      className="group relative block aspect-[3/4] overflow-hidden rounded-lg border border-gold/20 bg-black/60 transition-colors duration-300 hover:border-gold/60"
    >
      {coverUrl ? (
        <Image
          src={coverUrl}
          alt={brand.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
          <span className="px-4 text-center font-serif text-xl tracking-[0.2em] text-gold/70">
            {brand.name}
          </span>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4">
        <h3 className="font-serif text-lg tracking-wide text-gold-light transition-colors duration-300 group-hover:text-gold sm:text-xl">
          {brand.name}
        </h3>
      </div>
    </Link>
  );
}
