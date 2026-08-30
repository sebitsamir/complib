export type LibraryPersistenceState = {
  recentSlugs: string[];
  favoriteSlugs: string[];
};

let persistenceInflight: Promise<LibraryPersistenceState | null> | null = null;
let persistenceCache: { at: number; data: LibraryPersistenceState | null } | null =
  null;
const PERSISTENCE_CACHE_MS = 30_000;

export async function fetchServerLibraryPersistence(): Promise<LibraryPersistenceState | null> {
  if (
    persistenceCache &&
    Date.now() - persistenceCache.at < PERSISTENCE_CACHE_MS
  ) {
    return persistenceCache.data;
  }
  if (persistenceInflight) return persistenceInflight;

  persistenceInflight = (async () => {
    try {
      const res = await fetch("/api/library/persistence", {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) {
        persistenceCache = { at: Date.now(), data: null };
        return null;
      }
      const data = (await res.json()) as Partial<LibraryPersistenceState>;
      const parsed: LibraryPersistenceState = {
        recentSlugs: Array.isArray(data.recentSlugs)
          ? data.recentSlugs.filter((slug): slug is string => typeof slug === "string")
          : [],
        favoriteSlugs: Array.isArray(data.favoriteSlugs)
          ? data.favoriteSlugs.filter((slug): slug is string => typeof slug === "string")
          : [],
      };
      persistenceCache = { at: Date.now(), data: parsed };
      return parsed;
    } catch {
      persistenceCache = { at: Date.now(), data: null };
      return null;
    } finally {
      persistenceInflight = null;
    }
  })();

  return persistenceInflight;
}

export async function pushFavoriteToServer(slug: string, favorited: boolean): Promise<boolean> {
  try {
    const res = await fetch(`/api/library/favorites/${encodeURIComponent(slug)}`, {
      method: favorited ? "POST" : "DELETE",
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function pushRecentToServer(slug: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/library/recent/${encodeURIComponent(slug)}`, {
      method: "POST",
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export type CatalogSearchResult = {
  slug: string;
  name: string;
  description: string;
  tier: string;
  layer: string;
  category: string;
  problemTags: string[];
  defaultStyleId: string;
  styleVariants: Array<{ id: string; label: string }>;
  tags: string[];
  filesystemPath: string;
};

export async function searchCatalogFromServer(
  query: string,
  filters: {
    layer?: string;
    category?: string;
    style?: string;
    tier?: string;
    problem?: string;
    limit?: number;
  } = {},
): Promise<CatalogSearchResult[]> {
  const params = new URLSearchParams();
  if (query.trim()) params.set("q", query.trim());
  if (filters.layer) params.set("layer", filters.layer);
  if (filters.category) params.set("category", filters.category);
  if (filters.style) params.set("style", filters.style);
  if (filters.tier) params.set("tier", filters.tier);
  if (filters.problem) params.set("problem", filters.problem);
  if (filters.limit) params.set("limit", String(filters.limit));

  try {
    const res = await fetch(`/api/catalog/search?${params.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { results?: CatalogSearchResult[] };
    return Array.isArray(data.results) ? data.results : [];
  } catch {
    return [];
  }
}
