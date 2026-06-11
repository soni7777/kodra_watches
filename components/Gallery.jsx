"use client";

import { useState } from "react";
import Image from "next/image";

export default function Gallery({ images, brandName }) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, i) => (
          <button
            key={image.pathname}
            type="button"
            onClick={() => setSelected(i)}
            className="group relative aspect-square overflow-hidden rounded-lg border border-gold/20 bg-black/60 transition-colors duration-300 hover:border-gold/60"
          >
            <Image
              src={image.url}
              alt={`${brandName} ${i + 1}`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {selected !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelected(null)}
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            aria-label="Mbyll"
            className="absolute right-4 top-4 text-3xl leading-none text-gold-light transition-colors hover:text-gold"
          >
            ×
          </button>
          <div
            className="relative h-[80vh] w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selected].url}
              alt={`${brandName} ${selected + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
