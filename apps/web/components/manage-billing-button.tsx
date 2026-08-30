"use client";

import { useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  fallbackHref?: string;
};

export default function ManageBillingButton({
  children,
  className,
  fallbackHref = "/pricing",
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/create-portal", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      window.location.href = fallbackHref;
    } catch {
      window.location.href = fallbackHref;
    } finally {
      setLoading(false);
    }
  };

  return (
    <button type="button" onClick={() => void handleClick()} disabled={loading} className={className}>
      {loading ? "Opening billing…" : children}
    </button>
  );
}
