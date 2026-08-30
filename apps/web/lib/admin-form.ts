import type { ComponentLayer, ComponentVariant } from "@/lib/component-fs";
import type { AdminFormState } from "@/components/admin/admin-studio";
import { getCategoryDef } from "@/lib/taxonomy-defaults";
import { STYLE_FAMILY_DEFS } from "@/lib/style-navigation";
import { buildExplorerUrl } from "@/lib/explorer-url";

export function sanitizeAdminSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function inferStyleFamiliesFromTags(tags: string[]): string[] {
  const haystack = tags.join(" ").toLowerCase();
  return STYLE_FAMILY_DEFS.filter((family) =>
    family.keywords.some((keyword) => haystack.includes(keyword)),
  ).map((family) => family.slug);
}

export function buildPublishTags(form: AdminFormState): string[] {
  const styleKeywords = form.styleFamilies.flatMap((slug) => {
    const def = STYLE_FAMILY_DEFS.find((entry) => entry.slug === slug);
    return def ? [slug, ...def.keywords] : [slug];
  });
  return [
    ...new Set([
      form.categorySlug,
      form.layer,
      ...form.styleFamilies,
      ...styleKeywords,
      ...form.extraTags,
    ]),
  ].filter(Boolean);
}

export function buildAdminStudioUrl(overrides: {
  layer?: string | null;
  category?: string | null;
  edit?: string | null;
  view?: "browse" | "studio" | null;
}) {
  const p = new URLSearchParams();
  if (overrides.layer) p.set("layer", overrides.layer);
  if (overrides.category) p.set("category", overrides.category);
  if (overrides.edit) p.set("edit", overrides.edit);
  if (overrides.view && overrides.view !== "browse") p.set("view", overrides.view);
  const qs = p.toString();
  return qs ? `/admin/new?${qs}` : "/admin/new";
}

export function buildComponentContentPath(form: {
  layer: string;
  categorySlug: string;
  slug: string;
}) {
  const slug = form.slug || "{slug}";
  return `content/components/${form.layer}/${form.categorySlug}/${slug}/`;
}

export function buildExplorerPlacementUrl(form: Pick<AdminFormState, "layer" | "categorySlug" | "slug">) {
  return buildExplorerUrl(
    {},
    {
      browse: "layer",
      layer: form.layer,
      category: form.categorySlug,
      pick: form.slug || null,
      style: null,
      problem: null,
      collection: null,
      q: null,
    },
  );
}

export function buildStyleVariantPath(
  form: { layer: string; categorySlug: string; slug: string },
  styleId: string,
) {
  return `${buildComponentContentPath(form)}variants/${styleId}/html/`;
}

export type AdminEditPayload = {
  slug: string;
  component: {
    name: string;
    slug: string;
    description: string;
    tier: "FREE" | "PRO" | "ENTERPRISE";
    layer: ComponentLayer;
    category: string;
    problemTags: string[];
    tags?: string[];
    themes?: Array<"light" | "dark" | "auto">;
    variants?: ComponentVariant[];
  };
  html: string;
  css: string;
  js: string;
  styleFamilies?: string[];
  activeStyleId?: string;
};

export function adminFormFromEditPayload(payload: AdminEditPayload): AdminFormState {
  const { component, html, css, js } = payload;
  const tags = component.tags ?? [];
  return {
    name: component.name,
    slug: component.slug,
    description: component.description,
    html,
    css,
    js,
    layer: component.layer,
    categorySlug: component.category,
    problemTags: [...component.problemTags],
    tier: component.tier === "PRO" ? "PRO" : "FREE",
    themes: component.themes?.length ? [...component.themes] : ["light", "dark", "auto"],
    variants: (component.variants ?? []).map((v) => ({ ...v })),
    styleFamilies: payload.styleFamilies?.length
      ? [...payload.styleFamilies]
      : inferStyleFamiliesFromTags(tags),
    activeStyleId: payload.activeStyleId ?? "default",
    extraTags: tags.filter(
      (tag) =>
        tag !== component.category &&
        tag !== component.layer &&
        !STYLE_FAMILY_DEFS.some(
          (family) =>
            family.slug === tag || family.keywords.some((keyword) => tag.includes(keyword)),
        ),
    ),
    editingSlug: component.slug,
  };
}

export function defaultAdminForm(layer: ComponentLayer, categorySlug: string): AdminFormState {
  const category = getCategoryDef(layer, categorySlug);
  return {
    name: "",
    slug: "",
    description: "",
    html: "",
    css: "",
    js: "",
    layer,
    categorySlug,
    problemTags: category?.problemTags ?? ["build-ui-sections"],
    tier: "FREE",
    themes: ["light", "dark", "auto"],
    variants: [],
    styleFamilies: [],
    extraTags: [],
    editingSlug: null,
    activeStyleId: "default",
  };
}
