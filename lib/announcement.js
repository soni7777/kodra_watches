import crypto from "crypto";

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
const KEY = process.env.CLOUDINARY_API_KEY;
const SECRET = process.env.CLOUDINARY_API_SECRET;
const PUBLIC_ID = "announcement";

export async function getAnnouncement() {
  if (!CLOUD || !KEY || !SECRET) return null;
  try {
    const auth = "Basic " + Buffer.from(`${KEY}:${SECRET}`).toString("base64");
    const adminRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD}/resources/raw/upload/${PUBLIC_ID}`,
      { headers: { Authorization: auth }, cache: "no-store" }
    );
    if (!adminRes.ok) return null;
    const resource = await adminRes.json();
    const res = await fetch(resource.secure_url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function saveAnnouncement(text, active) {
  const timestamp = Math.round(Date.now() / 1000);
  const params = { overwrite: true, public_id: PUBLIC_ID, timestamp };
  const str = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  const signature = crypto.createHash("sha256").update(str + SECRET).digest("hex");

  const content = JSON.stringify({ text, active });
  const body = new FormData();
  body.append("file", new Blob([content], { type: "application/json" }), "announcement.json");
  body.append("api_key", KEY);
  body.append("timestamp", String(timestamp));
  body.append("public_id", PUBLIC_ID);
  body.append("overwrite", "true");
  body.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/raw/upload`, {
    method: "POST",
    body,
  });
  if (!res.ok) throw new Error(await res.text());
}
