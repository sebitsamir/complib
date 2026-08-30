import { categoryLabelForLayer } from "@/lib/library-nav-shared";

export type QuickInsertItem = {
  slug: string;
  name: string;
  category: string;
  layer: string;
};

type ScoredMatch = {
  item: QuickInsertItem;
  score: number;
};

function normalizeToken(value: string) {
  return value.trim().toLowerCase();
}

function scoreMatch(item: QuickInsertItem, query: string): number {
  const q = normalizeToken(query);
  if (!q) return 0;

  const slug = item.slug.toLowerCase();
  const name = item.name.toLowerCase();
  const category = item.category.toLowerCase();
  const layer = item.layer.toLowerCase();
  const categoryLabel = categoryLabelForLayer(item.layer, item.category).toLowerCase();

  if (slug === q || name === q) return 1000;
  if (slug.startsWith(q) || name.startsWith(q)) return 800;
  if (slug.includes(q) || name.includes(q)) return 600;
  if (category === q || categoryLabel === q) return 500;
  if (category.includes(q) || categoryLabel.includes(q) || layer.includes(q)) return 400;

  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length > 1) {
    const haystack = `${name} ${slug} ${categoryLabel} ${layer}`;
    if (tokens.every((token) => haystack.includes(token))) return 350;
  }

  return 0;
}

export function rankCatalogMatches<T extends QuickInsertItem>(
  catalog: T[],
  query: string,
): T[] {
  const q = normalizeToken(query);
  if (!q) return [];

  const scored: ScoredMatch[] = [];
  for (const item of catalog) {
    const score = scoreMatch(item, q);
    if (score > 0) scored.push({ item, score });
  }

  return scored
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.item.name.localeCompare(b.item.name);
    })
    .map((entry) => entry.item as T);
}

export function pickBestQuickInsertMatch<T extends QuickInsertItem>(
  catalog: T[],
  query: string,
): T | null {
  return rankCatalogMatches(catalog, query)[0] ?? null;
}
