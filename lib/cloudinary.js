import crypto from "crypto";

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
const KEY = process.env.CLOUDINARY_API_KEY;
const SECRET = process.env.CLOUDINARY_API_SECRET;

function basicAuth() {
  return "Basic " + Buffer.from(`${KEY}:${SECRET}`).toString("base64");
}

export function generateSignature(folder) {
  const timestamp = Math.round(Date.now() / 1000);
  const params = { folder, timestamp };
  const str = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  const signature = crypto.createHash("sha256").update(str + SECRET).digest("hex");
  return { signature, timestamp, api_key: KEY, cloud_name: CLOUD, folder };
}

export async function listImages(folder) {
  if (!CLOUD || !KEY || !SECRET) return [];
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD}/resources/image?type=upload&prefix=${encodeURIComponent(folder + "/")}&max_results=500`,
    { headers: { Authorization: basicAuth() } }
  );
  if (!res.ok) throw new Error("Failed to list images");
  const data = await res.json();
  const resources = data.resources ?? [];
  resources.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return resources.map((r) => ({ url: r.secure_url, pathname: r.public_id }));
}

export async function deleteImage(publicId) {
  const timestamp = Math.round(Date.now() / 1000);
  const paramStr = `public_id=${publicId}&timestamp=${timestamp}`;
  const signature = crypto.createHash("sha256").update(paramStr + SECRET).digest("hex");

  const body = new URLSearchParams({
    public_id: publicId,
    api_key: KEY,
    timestamp: String(timestamp),
    signature,
  });

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD}/image/destroy`,
    { method: "POST", body }
  );
  if (!res.ok) throw new Error("Cloudinary destroy failed");
  const data = await res.json();
  if (data.result !== "ok") throw new Error(`Delete failed: ${data.result}`);
}
