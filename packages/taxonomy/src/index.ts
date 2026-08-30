import type { ComponentLayer } from "@complib/contracts";

export type { ComponentLayer };

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

/** Official CompLib taxonomy — library, admin, and API validation share this tree. */
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

/** Intent-based discovery: what the user is building. */
export const BUILDING_INTENTS = [
  { id: "saas", label: "SaaS", problemTags: ["build-landing-page", "build-dashboard"] },
  { id: "dashboard", label: "Dashboard", problemTags: ["build-dashboard"] },
  { id: "ecommerce", label: "E-commerce", problemTags: ["build-landing-page", "build-ui-sections"] },
  { id: "portfolio", label: "Portfolio", problemTags: ["build-landing-page", "build-ui-sections"] },
  { id: "admin", label: "Admin", problemTags: ["build-dashboard", "build-navigation"] },
  { id: "landing", label: "Landing page", problemTags: ["build-landing-page"] },
] as const;

export type ProblemTag = (typeof ALLOWED_PROBLEM_TAGS)[number];

export const ALLOWED_LAYERS = new Set<ComponentLayer>([
  "primitives",
  "patterns",
  "sections",
  "templates",
]);

const layerMap = new Map(TAXONOMY_DEFAULTS.map((layer) => [layer.id, layer]));

export const ALLOWED_CATEGORIES_BY_LAYER: Record<ComponentLayer, Set<string>> =
  TAXONOMY_DEFAULTS.reduce(
    (acc, layer) => {
      acc[layer.id] = new Set(layer.categories.map((c) => c.slug));
      return acc;
    },
    {} as Record<ComponentLayer, Set<string>>,
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

export function safeSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function validateTaxonomy(input: {
  layer?: unknown;
  category?: unknown;
  problemTags?: unknown;
}):
  | { ok: true; layer: ComponentLayer; category: string; problemTags: string[] }
  | { ok: false; error: string } {
  const layer = typeof input.layer === "string" ? input.layer.trim() : "";
  if (!ALLOWED_LAYERS.has(layer as ComponentLayer)) {
    return { ok: false, error: "Invalid or missing layer." };
  }

  const category = safeSlug(String(input.category ?? ""));
  if (!category) {
    return { ok: false, error: "Invalid or missing category." };
  }

  if (!ALLOWED_CATEGORIES_BY_LAYER[layer as ComponentLayer]?.has(category)) {
    return {
      ok: false,
      error: `Category "${category}" is not allowed for layer "${layer}".`,
    };
  }

  if (!Array.isArray(input.problemTags) || input.problemTags.length === 0) {
    return { ok: false, error: "At least one problem tag is required." };
  }

  const problemTags = input.problemTags.map((tag) => String(tag).trim()).filter(Boolean);
  const allowed = new Set<string>(ALLOWED_PROBLEM_TAGS);
  const invalid = problemTags.filter((tag) => !allowed.has(tag));
  if (invalid.length > 0) {
    return { ok: false, error: `Unsupported problem tags: ${invalid.join(", ")}` };
  }

  return {
    ok: true,
    layer: layer as ComponentLayer,
    category,
    problemTags,
  };
}
