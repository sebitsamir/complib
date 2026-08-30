import {
  levelShowsComponentGrid,
  resolveExplorerLevel,
  type ExplorerSearchParams,
} from "./explorer-url";
import { getComponentsForStyleFamily } from "./style-navigation";
import type { Component } from "./component-store";

export function getExplorerVisibleComponents(
  allComponents: Component[],
  filteredFromServer: Component[],
  params: ExplorerSearchParams,
  recentSlugs: string[],
  favoriteSlugs: string[],
  catalogSearchSlugs?: string[] | null,
): Component[] {
  const level = resolveExplorerLevel(params);

  if (!levelShowsComponentGrid(level)) {
    return [];
  }

  let list = filteredFromServer;

  if (params.collection === "recent") {
    const order = new Map(recentSlugs.map((slug, i) => [slug, i]));
    list = allComponents
      .filter((c) => order.has(c.slug))
      .sort((a, b) => (order.get(a.slug) ?? 0) - (order.get(b.slug) ?? 0));
  } else if (params.collection === "favorites") {
    const order = new Map(favoriteSlugs.map((slug, i) => [slug, i]));
    list = allComponents
      .filter((c) => order.has(c.slug))
      .sort((a, b) => (order.get(a.slug) ?? 0) - (order.get(b.slug) ?? 0));
  } else if (params.q?.trim()) {
    list = filteredFromServer;
  } else if (params.browse === "style" && params.style) {
    list = getComponentsForStyleFamily(allComponents, params.style);
  } else if (params.browse === "problem" && params.problem) {
    list = allComponents.filter((c) =>
      c.problemTags.some((tag) => tag.toLowerCase() === params.problem?.toLowerCase()),
    );
  } else if (params.layer && params.category) {
    list = allComponents.filter(
      (c) =>
        c.layer === params.layer &&
        c.category.toLowerCase() === params.category?.toLowerCase(),
    );
  }

  if (params.tier === "FREE" || params.tier === "PRO") {
    list = list.filter((c) => c.tier === params.tier);
  }

  if (catalogSearchSlugs !== null && catalogSearchSlugs !== undefined && params.q?.trim()) {
    const allowed = new Set(catalogSearchSlugs);
    list = list.filter((component) => allowed.has(component.slug));
  }

  return list;
}

export function mergeExplorerParams(
  current: ExplorerSearchParams,
  overrides: Partial<ExplorerSearchParams>,
): ExplorerSearchParams {
  return { ...current, ...overrides };
}
