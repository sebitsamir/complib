"use client";

import { useEffect, useState } from "react";
import { searchCatalogFromServer } from "@/lib/library-api";

export function useCatalogSearchSlugs(
  query: string | null | undefined,
  filters: {
    layer?: string | null;
    category?: string | null;
    style?: string | null;
    tier?: string | null;
    problem?: string | null;
  } = {},
) {
  const [slugs, setSlugs] = useState<string[] | null>(null);

  useEffect(() => {
    const q = query?.trim();
    if (!q) {
      setSlugs(null);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    void searchCatalogFromServer(q, {
      layer: filters.layer ?? undefined,
      category: filters.category ?? undefined,
      style: filters.style ?? undefined,
      tier: filters.tier ?? undefined,
      problem: filters.problem ?? undefined,
    })
      .then((results) => {
        if (cancelled || controller.signal.aborted) return;
        // Empty array means no matches — do not fall back to the unfiltered list.
        setSlugs(results.map((row) => row.slug));
      })
      .catch(() => {
        if (!cancelled) setSlugs([]);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [query, filters.layer, filters.category, filters.style, filters.tier, filters.problem]);

  return slugs;
}
