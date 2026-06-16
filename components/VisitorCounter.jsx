"use client";

import { useEffect, useState } from "react";

export default function VisitorCounter() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    fetch("/api/visitors?page=home", { method: "POST" })
      .then((r) => r.json())
      .then((d) => setCount(d.count))
      .catch(() => {});
  }, []);

  if (count === null) return null;

  const month = new Date().toLocaleString("sq-AL", { month: "long", year: "numeric" });

  return (
    <div className="flex items-center justify-center gap-2 rounded-full border border-gold/20 bg-background-card px-4 py-1.5 text-xs text-foreground-muted mx-auto w-fit mb-8">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
      <span>
        <span className="text-gold-light font-semibold">{count.toLocaleString()}</span>
        {" "}vizitorë këtë muaj
      </span>
    </div>
  );
}
