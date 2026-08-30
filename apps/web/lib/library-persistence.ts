const RECENT_KEY = "complib:library-recent";
const FAVORITES_KEY = "complib:library-favorites";
const SIDEBAR_COLLAPSED_KEY = "complib:builder-sidebar-collapsed";
export const MAX_RECENT_SLUGS = 12;

function readJsonArray(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function writeJsonArray(key: string, values: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(values));
}

export function getRecentSlugs(): string[] {
  return readJsonArray(RECENT_KEY);
}

export function setRecentSlugs(values: string[]) {
  writeJsonArray(RECENT_KEY, values.slice(0, MAX_RECENT_SLUGS));
}

export function addRecentSlug(slug: string) {
  const trimmed = slug.trim();
  if (!trimmed) return;
  const next = [trimmed, ...getRecentSlugs().filter((s) => s !== trimmed)].slice(
    0,
    MAX_RECENT_SLUGS,
  );
  writeJsonArray(RECENT_KEY, next);
  window.dispatchEvent(new CustomEvent("complib:library-persistence"));

  void import("@/lib/library-api")
    .then(({ pushRecentToServer }) => pushRecentToServer(trimmed))
    .catch(() => undefined);
}

export function getFavoriteSlugs(): string[] {
  return readJsonArray(FAVORITES_KEY);
}

export function setFavoriteSlugs(values: string[]) {
  writeJsonArray(FAVORITES_KEY, values);
}

export function isFavoriteSlug(slug: string): boolean {
  return getFavoriteSlugs().includes(slug);
}

export function toggleFavoriteSlug(slug: string): boolean {
  const trimmed = slug.trim();
  if (!trimmed) return false;
  const current = getFavoriteSlugs();
  const exists = current.includes(trimmed);
  const next = exists
    ? current.filter((s) => s !== trimmed)
    : [trimmed, ...current];
  writeJsonArray(FAVORITES_KEY, next);
  window.dispatchEvent(new CustomEvent("complib:library-persistence"));

  void import("@/lib/library-api")
    .then(({ pushFavoriteToServer }) => pushFavoriteToServer(trimmed, !exists))
    .catch(() => undefined);

  return !exists;
}

export function applyServerLibraryPersistence(input: {
  recentSlugs: string[];
  favoriteSlugs: string[];
}) {
  if (typeof window === "undefined") return;
  if (input.recentSlugs.length > 0) {
    const merged = [
      ...input.recentSlugs,
      ...getRecentSlugs().filter((slug) => !input.recentSlugs.includes(slug)),
    ].slice(0, MAX_RECENT_SLUGS);
    writeJsonArray(RECENT_KEY, merged);
  }
  if (input.favoriteSlugs.length > 0) {
    const merged = [
      ...input.favoriteSlugs,
      ...getFavoriteSlugs().filter((slug) => !input.favoriteSlugs.includes(slug)),
    ];
    writeJsonArray(FAVORITES_KEY, merged);
  }
  window.dispatchEvent(new CustomEvent("complib:library-persistence"));
}

export function getBuilderSidebarCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1";
}

export function setBuilderSidebarCollapsed(collapsed: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? "1" : "0");
  window.dispatchEvent(new CustomEvent("complib:builder-sidebar-collapsed"));
}

export function subscribeLibraryPersistence(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => onStoreChange();
  window.addEventListener("complib:library-persistence", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("complib:library-persistence", handler);
    window.removeEventListener("storage", handler);
  };
}

export function subscribeBuilderSidebarCollapsed(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => onStoreChange();
  window.addEventListener("complib:builder-sidebar-collapsed", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("complib:builder-sidebar-collapsed", handler);
    window.removeEventListener("storage", handler);
  };
}
