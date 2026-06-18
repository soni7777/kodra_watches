"use client";

import { useEffect, useState } from "react";

export default function AnnouncementBanner() {
  const [text, setText] = useState("");

  useEffect(() => {
    fetch("/api/announcement")
      .then((r) => r.json())
      .then((d) => { if (d.active && d.text) setText(d.text); })
      .catch(() => {});
  }, []);

  if (!text) return null;

  return (
    <div className="w-full border-b border-gold/30 bg-gold/10 px-4 py-2.5 text-center text-sm font-medium text-gold-light">
      {text}
    </div>
  );
}
