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
        <div className="mb-14 text-center">
          <h2 className="font-serif text-4xl sm:text-5xl text-foreground mb-4 tracking-wide">
            Koleksioni
          </h2>
          <div className="mx-auto mb-4 h-px w-16 bg-gold/50" />
          <p className="mx-auto max-w-md text-foreground-muted text-sm tracking-wide">
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
      className="group relative block aspect-[3/4] overflow-hidden rounded-2xl border border-[var(--border)] bg-background-card transition-all duration-300 hover:border-gold/50 hover:shadow-[0_0_30px_rgba(201,168,106,0.12)] hover:-translate-y-1"
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
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1c2a3e] to-[#111824]">
          <span className="px-4 text-center font-serif text-xl tracking-[0.2em] text-gold/60">
            {brand.name}
          </span>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-5">
        <h3 className="font-serif text-lg tracking-wide text-gold-light transition-colors duration-300 group-hover:text-gold sm:text-xl">
          {brand.name}
        </h3>
      </div>
    </Link>
  );
}
