import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrandBySlug } from "@/lib/brands";
import { getBrandImages } from "@/lib/blob";
import Gallery from "@/components/Gallery";
import PageTracker from "@/components/PageTracker";

export default async function BrandPage({ params }) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const images = await getBrandImages(slug);

  return (
    <div className="px-6 py-12 sm:px-10 lg:px-16">
      <PageTracker page={slug} />
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm tracking-wide text-foreground-muted transition-colors hover:text-gold-light"
        >
          ← Kthehu
        </Link>

        <h2 className="mb-10 font-serif text-4xl text-foreground sm:text-5xl">
          {brand.name}
        </h2>

        {images.length === 0 ? (
          <p className="text-foreground/70">
            Ende s&apos;ka orë në këtë koleksion.
          </p>
        ) : (
          <Gallery images={images} brandName={brand.name} />
        )}
      </div>
    </div>
  );
}
