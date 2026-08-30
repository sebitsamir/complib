import type { ComponentLayer } from "./component-fs";

export const ALLOWED_LAYERS = new Set<ComponentLayer>([
  "primitives",
  "patterns",
  "sections",
  "templates",
]);

export const ALLOWED_CATEGORIES_BY_LAYER: Record<ComponentLayer, Set<string>> = {
  primitives: new Set(["layout", "typography", "inputs", "feedback", "overlay"]),
  patterns: new Set(["cards", "navigation", "forms", "tables", "pricing"]),
  sections: new Set([
    "hero",
    "features",
    "testimonials",
    "pricing",
    "faq",
    "footer",
  ]),
  templates: new Set(["saas", "dashboard", "agency", "portfolio", "blog"]),
};

export const ALLOWED_PROBLEM_TAGS = new Set([
  "build-landing-page",
  "build-dashboard",
  "build-form",
  "build-navigation",
  "build-authentication",
  "build-ui-sections",
]);

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
}): { ok: true; layer: ComponentLayer; category: string; problemTags: string[] } | { ok: false; error: string } {
  const layer = typeof input.layer === "string" ? input.layer.trim() : "";
  if (!ALLOWED_LAYERS.has(layer as ComponentLayer)) {
    return { ok: false, error: "Invalid or missing layer." };
  }

  const category = safeSlug(String(input.category ?? ""));
  if (!category) {
    return { ok: false, error: "Invalid or missing category." };
  }

  const allowedForLayer = ALLOWED_CATEGORIES_BY_LAYER[layer as ComponentLayer];
  if (!allowedForLayer?.has(category)) {
    return {
      ok: false,
      error: `Category "${category}" is not allowed for layer "${layer}".`,
    };
  }

  if (!Array.isArray(input.problemTags) || input.problemTags.length === 0) {
    return { ok: false, error: "At least one problem tag is required." };
  }

  const problemTags = input.problemTags
    .map((tag) => String(tag).trim())
    .filter(Boolean);
  const invalid = problemTags.filter((tag) => !ALLOWED_PROBLEM_TAGS.has(tag));
  if (invalid.length > 0) {
    return {
      ok: false,
      error: `Unsupported problem tags: ${invalid.join(", ")}`,
    };
  }

  return {
    ok: true,
    layer: layer as ComponentLayer,
    category,
    problemTags,
  };
}
