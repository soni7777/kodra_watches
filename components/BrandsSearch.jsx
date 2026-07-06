"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function BrandsSearch({ items }) {
  const [query, setQuery] = useState("");

  const filtered = items.filter((item) =>
    item.brand.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <div className="relative mx-auto mb-10 max-w-sm">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted pointer-events-none"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Kërko markën..."
          className="w-full rounded-full border border-gold/30 bg-black/60 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-foreground/40 focus:border-gold focus:outline-none transition-colors"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-foreground-muted text-sm">
          Asnjë markë nuk u gjet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map(({ brand, coverUrl, count }) => (
            <Link
              key={brand.slug}
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
              {count > 0 && (
                <div className="absolute top-2 right-2 rounded-full bg-black/70 border border-gold/30 px-2 py-0.5 text-[10px] font-semibold text-gold-light backdrop-blur-sm sm:top-3 sm:right-3 sm:px-2.5 sm:py-1 sm:text-xs">
                  {count} items
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-3 sm:p-5">
                <h3 className="font-serif text-sm tracking-wide text-gold-light transition-colors duration-300 group-hover:text-gold sm:text-lg">
                  {brand.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
