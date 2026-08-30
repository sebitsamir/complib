import type { ComponentLayer } from "./component-fs";

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
      { slug: "navigation", label: "Navigation", problemTags: ["build-navigation"] },
      { slug: "forms", label: "Forms", problemTags: ["build-form"] },
      { slug: "tables", label: "Tables", problemTags: ["build-dashboard"] },
      { slug: "pricing", label: "Pricing", problemTags: ["build-landing-page"] },
    ],
  },
  {
    id: "sections",
    label: "Sections",
    categories: [
      { slug: "hero", label: "Hero", problemTags: ["build-landing-page"] },
      { slug: "features", label: "Features", problemTags: ["build-landing-page"] },
      { slug: "testimonials", label: "Testimonials", problemTags: ["build-landing-page"] },
      { slug: "pricing", label: "Pricing", problemTags: ["build-landing-page"] },
      { slug: "faq", label: "FAQ", problemTags: ["build-landing-page"] },
      { slug: "footer", label: "Footer", problemTags: ["build-landing-page"] },
    ],
  },
  {
    id: "templates",
    label: "Templates",
    categories: [
      { slug: "saas", label: "SaaS", problemTags: ["build-landing-page"] },
      { slug: "dashboard", label: "Dashboard", problemTags: ["build-dashboard"] },
      { slug: "agency", label: "Agency", problemTags: ["build-landing-page"] },
      { slug: "portfolio", label: "Portfolio", problemTags: ["build-landing-page"] },
      { slug: "blog", label: "Blog", problemTags: ["build-ui-sections"] },
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
