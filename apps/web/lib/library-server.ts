import { backendFetch } from "@/lib/server-backend";

export type LibraryCollection = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  items: Array<{ slug: string; name: string; position: number }>;
};

export type LibraryDashboardData = {
  favoriteSlugs: string[];
  recentSlugs: string[];
  collections: LibraryCollection[];
};

export async function fetchLibraryDashboardData(): Promise<LibraryDashboardData> {
  const empty: LibraryDashboardData = {
    favoriteSlugs: [],
    recentSlugs: [],
    collections: [],
  };

  try {
    const [persistence, collections] = await Promise.all([
      backendFetch("/api/library/persistence"),
      backendFetch("/api/library/collections"),
    ]);

    const persistenceJson = persistence.ok
      ? ((await persistence.json()) as {
          favoriteSlugs?: string[];
          recentSlugs?: string[];
        })
      : {};

    const collectionsJson = collections.ok
      ? ((await collections.json()) as { collections?: LibraryCollection[] })
      : {};

    return {
      favoriteSlugs: persistenceJson.favoriteSlugs ?? [],
      recentSlugs: persistenceJson.recentSlugs ?? [],
      collections: collectionsJson.collections ?? [],
    };
  } catch {
    return empty;
  }
}
