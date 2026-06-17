import { NextResponse } from "next/server";
import { handleUpload } from "@vercel/blob/client";
import { isAuthorized } from "@/lib/auth";
import { brands } from "@/lib/brands";

export async function POST(request) {
  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!isAuthorized(request)) {
          throw new Error("Unauthorized");
        }
        const slug = clientPayload;
        if (!brands.some((brand) => brand.slug === slug)) {
          throw new Error("Invalid brand");
        }
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/heic",
            "image/heif",
            "image/gif",
          ],
          tokenPayload: slug,
        };
      },
      onUploadCompleted: async () => {
        // no post-upload processing needed
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
