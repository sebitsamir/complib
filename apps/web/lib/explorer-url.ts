export type ExplorerBrowseMode = "layer" | "style" | "problem";
export type ExplorerFramework = "vanilla" | "react" | "vue";
export type ExplorerCollection = "recent" | "favorites";

export type ExplorerSearchParams = {
  q?: string | null;
  tier?: string | null;
  framework?: ExplorerFramework | null;
  browse?: ExplorerBrowseMode | null;
  layer?: string | null;
  category?: string | null;
  problem?: string | null;
  style?: string | null;
  pick?: string | null;
  collection?: ExplorerCollection | null;
};

export function parseBrowseMode(raw: string | null | undefined): ExplorerBrowseMode {
  if (raw === "style" || raw === "problem") return raw;
  return "layer";
}

export function parseFramework(raw: string | null | undefined): ExplorerFramework {
  if (raw === "react" || raw === "vue") return raw;
  return "vanilla";
}

export function buildExplorerUrl(
  current: URLSearchParams | ExplorerSearchParams,
  overrides: Partial<ExplorerSearchParams> = {},
): string {
  const base =
    current instanceof URLSearchParams
      ? Object.fromEntries(current.entries())
      : { ...current };

  const merged: Record<string, string | null | undefined> = {
    q: base.q ?? null,
    tier: base.tier ?? null,
    framework: base.framework ?? null,
    browse: base.browse ?? null,
    layer: base.layer ?? null,
    category: base.category ?? null,
    problem: base.problem ?? null,
    style: base.style ?? null,
    pick: base.pick ?? null,
    collection: base.collection ?? null,
    ...overrides,
  };

  const p = new URLSearchParams();
  for (const [key, value] of Object.entries(merged)) {
    if (value === null || value === undefined || value === "") continue;
    if (key === "framework" && value === "vanilla") continue;
    if (key === "browse" && value === "layer") continue;
    p.set(key, value);
  }
  const qs = p.toString();
  return qs ? `/components?${qs}` : "/components";
}

export type ExplorerLevel =
  | "all"
  | "layer-home"
  | "category-components"
  | "component-styles"
  | "style-variants"
  | "collection"
  | "search"
  | "style-home"
  | "style-components"
  | "problem-home"
  | "problem-components";

export function resolveExplorerLevel(params: ExplorerSearchParams): ExplorerLevel {
  if (params.q?.trim()) return "search";

  if (params.collection === "recent" || params.collection === "favorites") {
    return "collection";
  }

  const browse = parseBrowseMode(params.browse ?? undefined);

  if (browse === "style") {
    return params.style ? "style-components" : "style-home";
  }

  if (browse === "problem") {
    return params.problem ? "problem-components" : "problem-home";
  }

  if (params.pick && params.style) return "style-variants";
  if (params.pick) return "component-styles";
  if (params.layer && params.category) return "category-components";
  if (params.layer) return "layer-home";

  return "all";
}

export function buildExplorerPickUrl(
  current: URLSearchParams | ExplorerSearchParams,
  component: { slug: string; layer: string; category: string },
): string {
  return buildExplorerUrl(current, {
    browse: "layer",
    layer: component.layer,
    category: component.category.toLowerCase(),
    pick: component.slug,
    style: null,
    problem: null,
    collection: null,
    q: null,
  });
}

export function buildExplorerStyleUrl(
  current: URLSearchParams | ExplorerSearchParams,
  styleId: string,
): string {
  return buildExplorerUrl(current, { style: styleId });
}

export function levelShowsComponentGrid(level: ExplorerLevel): boolean {
  return (
    level === "category-components" ||
    level === "style-components" ||
    level === "problem-components" ||
    level === "search" ||
    level === "collection"
  );
}
