import type { ComponentLayer } from "@/lib/component-fs";

export type TaxonomyCategory = {
  slug: string;
  label: string;
  problemTags: string[];
};

export type TaxonomyLayer = {
  id: ComponentLayer;
  label: string;
  categories: TaxonomyCategory[];
};

/** Official CompLib taxonomy — single source of truth for library + admin. */
export const TAXONOMY_DEFAULTS: TaxonomyLayer[] = [
  {
    id: "primitives",
    label: "Primitives",
    categories: [
      { slug: "layout", label: "Layout", problemTags: ["build-ui-sections"] },
      { slug: "typography", label: "Typography", problemTags: ["build-ui-sections"] },
      { slug: "inputs", label: "Inputs", problemTags: ["build-form"] },
      { slug: "data-display", label: "Data Display", problemTags: ["build-ui-sections"] },
      { slug: "feedback", label: "Feedback", problemTags: ["build-ui-sections"] },
      { slug: "overlay", label: "Overlay", problemTags: ["build-ui-sections"] },
      { slug: "utility", label: "Utility", problemTags: ["build-ui-sections"] },
    ],
  },
  {
    id: "patterns",
    label: "Patterns",
    categories: [
      { slug: "cards", label: "Cards", problemTags: ["build-ui-sections"] },
      { slug: "forms", label: "Forms", problemTags: ["build-form"] },
      { slug: "navigation", label: "Navigation", problemTags: ["build-navigation"] },
      { slug: "data", label: "Data & Interaction", problemTags: ["build-dashboard"] },
      { slug: "feedback", label: "Feedback & States", problemTags: ["build-ui-sections"] },
    ],
  },
  {
    id: "sections",
    label: "Sections",
    categories: [
      { slug: "hero", label: "Hero", problemTags: ["build-landing-page"] },
      { slug: "features", label: "Features", problemTags: ["build-landing-page"] },
      { slug: "social-proof", label: "Social Proof", problemTags: ["build-landing-page"] },
      { slug: "conversion", label: "Conversion", problemTags: ["build-landing-page"] },
      { slug: "page", label: "Page Sections", problemTags: ["build-landing-page"] },
    ],
  },
  {
    id: "templates",
    label: "Templates",
    categories: [
      { slug: "saas", label: "SaaS & Startup", problemTags: ["build-landing-page"] },
      { slug: "dashboard", label: "Dashboards", problemTags: ["build-dashboard"] },
      { slug: "commerce", label: "Commerce", problemTags: ["build-landing-page"] },
      { slug: "marketing", label: "Marketing Sites", problemTags: ["build-landing-page"] },
      { slug: "content", label: "Content & Docs", problemTags: ["build-ui-sections"] },
      { slug: "auth", label: "Authentication", problemTags: ["build-authentication"] },
      { slug: "niche", label: "Industry", problemTags: ["build-landing-page"] },
    ],
  },
];

export const ALLOWED_PROBLEM_TAGS = [
  "build-landing-page",
  "build-dashboard",
  "build-form",
  "build-navigation",
  "build-authentication",
  "build-ui-sections",
] as const;

export type ProblemTag = (typeof ALLOWED_PROBLEM_TAGS)[number];

const layerMap = new Map(
  TAXONOMY_DEFAULTS.map((layer) => [layer.id, layer]),
);

export function getTaxonomyLayer(layer: ComponentLayer): TaxonomyLayer | undefined {
  return layerMap.get(layer);
}

export function getCategoriesForLayer(layer: ComponentLayer): TaxonomyCategory[] {
  return getTaxonomyLayer(layer)?.categories ?? [];
}

export function getCategoryDef(
  layer: ComponentLayer,
  categorySlug: string,
): TaxonomyCategory | undefined {
  return getCategoriesForLayer(layer).find((c) => c.slug === categorySlug);
}

export function isAllowedCategory(layer: ComponentLayer, categorySlug: string): boolean {
  return Boolean(getCategoryDef(layer, categorySlug));
}

export function inferLayerFromCategory(categorySlug: string): ComponentLayer {
  for (const layer of TAXONOMY_DEFAULTS) {
    if (layer.categories.some((c) => c.slug === categorySlug)) {
      return layer.id;
    }
  }
  return "patterns";
}

export const ALLOWED_CATEGORIES_BY_LAYER: Record<ComponentLayer, Set<string>> =
  TAXONOMY_DEFAULTS.reduce(
    (acc, layer) => {
      acc[layer.id] = new Set(layer.categories.map((c) => c.slug));
      return acc;
    },
    {} as Record<ComponentLayer, Set<string>>,
  );
