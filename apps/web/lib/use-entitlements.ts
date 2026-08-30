"use client";

import { useEffect, useState } from "react";
import type { Entitlements } from "@complib/entitlements";
import { getEntitlements } from "@complib/entitlements";

const FREE_ENTITLEMENTS = getEntitlements({ plan: "FREE", role: "USER" });

export function useEntitlements(): Entitlements {
  const [entitlements, setEntitlements] = useState<Entitlements>(FREE_ENTITLEMENTS);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/entitlements/me", { credentials: "include", cache: "no-store" })
      .then((res) => (res.ok ? res.json() : FREE_ENTITLEMENTS))
      .then((data: Entitlements) => {
        if (!cancelled) setEntitlements(data);
      })
      .catch(() => {
        if (!cancelled) setEntitlements(FREE_ENTITLEMENTS);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return entitlements;
}
