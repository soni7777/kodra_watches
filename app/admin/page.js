"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { brands } from "@/lib/brands";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");

  const [slug, setSlug] = useState(brands[0].slug);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deletingUrl, setDeletingUrl] = useState(null);

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

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
      if (res.ok) setAuthed(true);
      else setAuthError("Fjalëkalim i gabuar.");
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

  async function loadStats() {
    setLoadingStats(true);
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { "x-admin-password": password },
      });
      if (res.ok) setStats(await res.json());
    } finally {
      setLoadingStats(false);
    }
  }

  useEffect(() => {
    if (authed) loadImages(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, slug]);

  useEffect(() => {
    if (authed && activeTab === "stats" && !stats) loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, activeTab]);

  async function handleUpload(e) {
    e.preventDefault();
    if (files.length === 0) return;
    setUploading(true);
    setUploadMessage("");
    try {
      const formData = new FormData();
      formData.append("slug", slug);
      for (const file of files) formData.append("files", file);
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
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({ url }),
      });
      if (res.ok) setImages((prev) => prev.filter((img) => img.url !== url));
    } finally {
      setDeletingUrl(null);
      setDeleteConfirm(null);
    }
  }

  if (!authed) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-24">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-xl border border-gold/20 bg-background-card p-8"
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
            className="mb-4 w-full rounded-lg border border-gold/30 bg-black/60 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-gold focus:outline-none"
            required
          />
          {authError && <p className="mb-4 text-sm text-red-400">{authError}</p>}
          <button
            type="submit"
            disabled={authLoading}
            className="w-full rounded-lg bg-gold px-4 py-3 font-medium text-black transition-colors hover:bg-gold-light disabled:opacity-50"
          >
            {authLoading ? "Duke verifikuar..." : "Hyr"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-8 font-serif text-3xl text-gold-light sm:text-4xl">
          Paneli Admin
        </h2>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 border-b border-gold/20">
          {[
            { key: "upload", label: "Ngarko / Fshi Foto" },
            { key: "stats", label: "Statistika" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 text-sm font-medium transition-colors rounded-t-lg border-b-2 ${
                activeTab === tab.key
                  ? "border-gold text-gold-light"
                  : "border-transparent text-foreground-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB: FOTO ── */}
        {activeTab === "upload" && (
          <>
            <form
              onSubmit={handleUpload}
              className="mb-10 rounded-xl border border-gold/20 bg-background-card p-6"
            >
              <label className="mb-2 block text-sm text-foreground-muted">Marka</label>
              <select
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="mb-4 w-full rounded-lg border border-gold/30 bg-black/60 px-4 py-3 text-foreground focus:border-gold focus:outline-none"
              >
                {brands.map((brand) => (
                  <option key={brand.slug} value={brand.slug}>
                    {brand.name}
                  </option>
                ))}
              </select>

              <label className="mb-2 block text-sm text-foreground-muted">Foto</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                className="mb-4 w-full rounded-lg border border-gold/30 bg-black/60 px-4 py-3 text-sm text-foreground/80 file:mr-4 file:rounded file:border-0 file:bg-gold file:px-4 file:py-2 file:font-medium file:text-black"
              />

              <button
                type="submit"
                disabled={uploading || files.length === 0}
                className="w-full rounded-lg bg-gold px-4 py-3 font-medium text-black transition-colors hover:bg-gold-light disabled:opacity-50"
              >
                {uploading ? "Duke ngarkuar..." : `Ngarko${files.length > 0 ? ` (${files.length} foto)` : ""}`}
              </button>

              {uploadMessage && (
                <p className="mt-4 text-center text-sm text-gold-light">{uploadMessage}</p>
              )}
            </form>

            <h3 className="mb-4 font-serif text-xl text-foreground">
              Fotot ekzistuese — {brands.find((b) => b.slug === slug)?.name}
            </h3>

            {loadingImages ? (
              <p className="text-foreground-muted">Duke ngarkuar...</p>
            ) : images.length === 0 ? (
              <p className="text-foreground-muted">Ende s&apos;ka foto për këtë markë.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {images.map((image) => (
                  <div
                    key={image.pathname}
                    className="flex flex-col rounded-xl border border-gold/20 bg-background-card overflow-hidden"
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={image.url}
                        alt={image.pathname}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-2">
                      {deleteConfirm === image.url ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleDelete(image.url)}
                            disabled={deletingUrl === image.url}
                            className="flex-1 rounded-lg bg-red-600 py-1.5 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50"
                          >
                            {deletingUrl === image.url ? "..." : "Konfirmo"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm(null)}
                            className="flex-1 rounded-lg border border-gold/30 py-1.5 text-xs text-foreground-muted hover:text-foreground"
                          >
                            Anulo
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(image.url)}
                          className="w-full rounded-lg border border-red-500/40 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/10 hover:border-red-400"
                        >
                          🗑 Fshi foton
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── TAB: STATISTIKA ── */}
        {activeTab === "stats" && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-serif text-xl text-foreground">Vizita mujore (12 muajt e fundit)</h3>
              <button
                type="button"
                onClick={() => { setStats(null); loadStats(); }}
                className="rounded-lg border border-gold/30 px-4 py-2 text-xs text-foreground-muted hover:text-gold-light transition-colors"
              >
                ↻ Rifresko
              </button>
            </div>

            {loadingStats ? (
              <p className="text-foreground-muted">Duke ngarkuar statistikat...</p>
            ) : !stats ? (
              <p className="text-foreground-muted">Nuk ka të dhëna.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gold/20">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gold/20 bg-background-card">
                      <th className="px-4 py-3 text-left text-foreground-muted font-medium sticky left-0 bg-background-card min-w-[160px]">
                        Faqja
                      </th>
                      {stats.months.map((ym) => (
                        <th key={ym} className="px-3 py-3 text-center text-foreground-muted font-medium whitespace-nowrap min-w-[80px]">
                          {new Date(ym + "-01").toLocaleString("sq-AL", { month: "short", year: "2-digit" })}
                        </th>
                      ))}
                      <th className="px-4 py-3 text-center text-gold font-semibold min-w-[80px]">
                        Gjithsej
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.rows.map((row, i) => (
                      <tr
                        key={row.page}
                        className={`border-b border-gold/10 transition-colors hover:bg-background-card ${
                          i % 2 === 0 ? "" : "bg-white/[0.02]"
                        }`}
                      >
                        <td className="px-4 py-3 font-medium text-foreground sticky left-0 bg-inherit">
                          {row.label}
                        </td>
                        {row.months.map(({ ym, count }) => (
                          <td key={ym} className="px-3 py-3 text-center">
                            {count > 0 ? (
                              <span className="text-gold-light font-semibold">{count}</span>
                            ) : (
                              <span className="text-foreground-muted/40">—</span>
                            )}
                          </td>
                        ))}
                        <td className="px-4 py-3 text-center font-bold text-gold">
                          {row.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
