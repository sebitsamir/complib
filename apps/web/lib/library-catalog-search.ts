import { categoryLabelForLayer } from "@/lib/library-nav-shared";
import { rankCatalogMatches, type QuickInsertItem } from "@/lib/library-quick-insert";

export type CatalogSearchItem = QuickInsertItem;

export const MAX_PALETTE_SEARCH_RESULTS = 60;

function normalizeQuery(query: string) {
  return query.trim().toLowerCase();
}

export function matchesCatalogItem(item: CatalogSearchItem, query: string): boolean {
  const q = normalizeQuery(query);
  if (!q) return true;

  return (
    item.name.toLowerCase().includes(q) ||
    item.slug.toLowerCase().includes(q) ||
    item.category.toLowerCase().includes(q) ||
    item.layer.toLowerCase().includes(q) ||
    categoryLabelForLayer(item.layer, item.category).toLowerCase().includes(q)
  );
}

export function filterCatalog<T extends CatalogSearchItem>(catalog: T[], query: string): T[] {
  const q = normalizeQuery(query);
  if (!q) return catalog;
  return catalog.filter((item) => matchesCatalogItem(item, q));
}

export function searchCatalogRanked<T extends CatalogSearchItem>(
  catalog: T[],
  query: string,
  limit = MAX_PALETTE_SEARCH_RESULTS,
): { items: T[]; total: number } {
  const q = normalizeQuery(query);
  if (!q) return { items: [], total: 0 };
  const ranked = rankCatalogMatches(catalog, q);
  return {
    items: ranked.slice(0, limit),
    total: ranked.length,
  };
}
