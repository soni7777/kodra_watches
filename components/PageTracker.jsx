"use client";

import { useEffect } from "react";

export default function PageTracker({ page }) {
  useEffect(() => {
    fetch(`/api/visitors?page=${encodeURIComponent(page)}`, { method: "POST" }).catch(() => {});
  }, [page]);

  return null;
}
