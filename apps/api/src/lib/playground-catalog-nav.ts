import type { BuilderCatalogItem } from "@/components/playground/palette-types";
import type { LibraryNavLayer } from "./component-store";
import { LAYER_ORDER, layerNavMeta } from "./library-nav-shared";

/** Build layer/category nav tree from flat playground catalog rows. */
export function buildNavLayersFromCatalog(catalog: BuilderCatalogItem[]): LibraryNavLayer[] {
  const byLayer = new Map<
    string,
    Map<
      string,
      {
        name: string;
        slug: string;
        components: { name: string; slug: string; tier: "FREE" | "PRO" | "ENTERPRISE" }[];
      }
    >
  >();

  for (const item of catalog) {
    const layerMap = byLayer.get(item.layer) ?? new Map();
    const catSlug = item.category.toLowerCase();
    const category = layerMap.get(catSlug) ?? {
      name: item.category.replace(/-/g, " "),
      slug: catSlug,
      components: [],
    };
    if (!category.components.some((c: { slug: string }) => c.slug === item.slug)) {
      category.components.push({ name: item.name, slug: item.slug, tier: item.tier });
    }
    layerMap.set(catSlug, category);
    byLayer.set(item.layer, layerMap);
  }

  return LAYER_ORDER.filter((layer) => byLayer.has(layer)).map((layer) => ({
    name: layerNavMeta(layer).label,
    slug: layer,
    categories: Array.from(byLayer.get(layer)!.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    ),
  }));
}
