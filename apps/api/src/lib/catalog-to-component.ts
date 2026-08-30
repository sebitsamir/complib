import type { Component } from "./component-store";
import type { ComponentLayer } from "./component-fs";
import type { BuilderCatalogItem } from "@/components/playground/palette-types";

/** Minimal Component shape for explorer picker (no source bodies). */
export function catalogItemsToExplorerComponents(
  items: BuilderCatalogItem[],
): Component[] {
  return items.map((item) => ({
    id: item.slug,
    name: item.name,
    slug: item.slug,
    description: "",
    html: "",
    css: "",
    js: "",
    runtime: "",
    tags: [],
    tier: item.tier,
    layer: item.layer as ComponentLayer,
    category: item.category,
    problemTags: [],
    viewCount: 0,
    variants: item.variants,
  }));
}
