"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { brands } from "@/lib/brands";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [slug, setSlug] = useState(brands[0].slug);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [deletingUrl, setDeletingUrl] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setAuthed(true);
      } else {
        setAuthError("Fjalëkalim i gabuar.");
      }
    } catch {
      setAuthError("Diçka shkoi keq. Provo përsëri.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function loadImages(currentSlug) {
    setLoadingImages(true);
    try {
      const res = await fetch(`/api/admin/list?slug=${currentSlug}`, {
        headers: { "x-admin-password": password },
      });
      if (res.ok) {
        const data = await res.json();
        setImages(data.blobs ?? []);
      }
    } finally {
      setLoadingImages(false);
    }
  }

  useEffect(() => {
    if (authed) {
      loadImages(slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, slug]);

  async function handleUpload(e) {
    e.preventDefault();
    if (files.length === 0) return;

    setUploading(true);
    setUploadMessage("");

    try {
      const formData = new FormData();
      formData.append("slug", slug);
      for (const file of files) {
        formData.append("files", file);
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-admin-password": password },
        body: formData,
      });

      if (res.ok) {
        setUploadMessage(`U ngarkuan ${files.length} foto me sukses.`);
        setFiles([]);
        await loadImages(slug);
      } else {
        setUploadMessage("Ngarkimi dështoi. Provo përsëri.");
      }
    } catch {
      setUploadMessage("Ngarkimi dështoi. Provo përsëri.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(url) {
    setDeletingUrl(url);
    try {
      const res = await fetch("/api/admin/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ url }),
      });
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.url !== url));
      }
    } finally {
      setDeletingUrl(null);
    }
  }

  if (!authed) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-24">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-lg border border-gold/20 bg-black/40 p-8"
        >
          <h2 className="mb-6 text-center font-serif text-2xl text-gold-light">
            Hyrje Admin
          </h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Fjalëkalimi"
            autoComplete="current-password"
            className="mb-4 w-full rounded border border-gold/30 bg-black/60 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-gold focus:outline-none"
            required
          />
          {authError && (
            <p className="mb-4 text-sm text-red-400">{authError}</p>
          )}
          <button
            type="submit"
            disabled={authLoading}
            className="w-full rounded bg-gold px-4 py-3 font-medium text-black transition-colors hover:bg-gold-light disabled:opacity-50"
          >
            {authLoading ? "Duke verifikuar..." : "Hyr"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-8 font-serif text-3xl text-gold-light sm:text-4xl">
          Paneli Admin
        </h2>

        <form
          onSubmit={handleUpload}
          className="mb-12 rounded-lg border border-gold/20 bg-black/40 p-6"
        >
          <label className="mb-2 block text-sm text-foreground/70">
            Marka
          </label>
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mb-4 w-full rounded border border-gold/30 bg-black/60 px-4 py-3 text-foreground focus:border-gold focus:outline-none"
          >
            {brands.map((brand) => (
              <option key={brand.slug} value={brand.slug}>
                {brand.name}
              </option>
            ))}
          </select>

          <label className="mb-2 block text-sm text-foreground/70">
            Foto
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            className="mb-4 w-full rounded border border-gold/30 bg-black/60 px-4 py-3 text-sm text-foreground/80 file:mr-4 file:rounded file:border-0 file:bg-gold file:px-4 file:py-2 file:font-medium file:text-black"
          />

          <button
            type="submit"
            disabled={uploading || files.length === 0}
            className="w-full rounded bg-gold px-4 py-3 font-medium text-black transition-colors hover:bg-gold-light disabled:opacity-50"
          >
            {uploading ? "Duke ngarkuar..." : "Ngarko"}
          </button>

          {uploadMessage && (
            <p className="mt-4 text-center text-sm text-gold-light">
              {uploadMessage}
            </p>
          )}
        </form>

        <h3 className="mb-4 font-serif text-2xl text-foreground">
          Fotot ekzistuese
        </h3>

        {loadingImages ? (
          <p className="text-foreground/70">Duke ngarkuar...</p>
        ) : images.length === 0 ? (
          <p className="text-foreground/70">
            Ende s&apos;ka foto për këtë markë.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {images.map((image) => (
              <div
                key={image.pathname}
                className="group relative aspect-square overflow-hidden rounded-lg border border-gold/20 bg-black/60"
              >
                <Image
                  src={image.url}
                  alt={image.pathname}
                  fill
                  sizes="(min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleDelete(image.url)}
                  disabled={deletingUrl === image.url}
                  className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-xs font-medium text-red-300 transition-colors hover:bg-red-500 hover:text-white disabled:opacity-50"
                >
                  {deletingUrl === image.url ? "..." : "Fshi"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
