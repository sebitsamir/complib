"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import {
  applyServerLibraryPersistence,
  getFavoriteSlugs,
  getRecentSlugs,
  subscribeLibraryPersistence,
} from "@/lib/library-persistence";
import { fetchServerLibraryPersistence } from "@/lib/library-api";

function persistenceSnapshot() {
  return `${getRecentSlugs().join(",")}|${getFavoriteSlugs().join(",")}`;
}

export function useLibraryPersistence() {
  const snapshot = useSyncExternalStore(
    subscribeLibraryPersistence,
    persistenceSnapshot,
    () => "",
  );

  useEffect(() => {
    let cancelled = false;
    void fetchServerLibraryPersistence().then((serverState) => {
      if (cancelled || !serverState) return;
      applyServerLibraryPersistence(serverState);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const recentSlugs = useMemo(() => getRecentSlugs(), [snapshot]);
  const favoriteSlugs = useMemo(() => getFavoriteSlugs(), [snapshot]);
  const favoriteSlugSet = useMemo(() => new Set(favoriteSlugs), [favoriteSlugs]);

  return { recentSlugs, favoriteSlugs, favoriteSlugSet };
}
