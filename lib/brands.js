export const brands = [
  { name: "Rolex", slug: "rolex" },
  { name: "Audemars Piguet", slug: "audemars-piguet" },
  { name: "Omega", slug: "omega" },
  { name: "Patek Philippe", slug: "patek-philippe" },
  { name: "Hublot", slug: "hublot" },
  { name: "Breitling", slug: "breitling" },
  { name: "Vacheron Constantin", slug: "vacheron-constantin" },
  { name: "Woman", slug: "woman" },
];

export function getBrandBySlug(slug) {
  return brands.find((brand) => brand.slug === slug) ?? null;
}

export function getBrandName(slug) {
  return getBrandBySlug(slug)?.name ?? null;
}
