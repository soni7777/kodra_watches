import { listImages } from "./cloudinary";

export async function getBrandImages(slug) {
  try {
    return await listImages(slug);
  } catch {
    return [];
  }
}

export async function getBrandCoverImage(slug) {
  const images = await getBrandImages(slug);
  return images[0]?.url ?? null;
}
