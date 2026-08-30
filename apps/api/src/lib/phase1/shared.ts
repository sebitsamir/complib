import type {
  ComponentJsonShape,
  ComponentLayer,
  ComponentVariant,
  PublishStyleVariantInput,
} from "../component-fs";
import {
  PRIMITIVE_VARIANTS,
  SCALABLE_TOKENS_CSS,
  SIZE_VARIANTS,
  DENSITY_VARIANTS,
  TONE_VARIANTS,
  RADIUS_VARIANTS,
  mergeVariants,
} from "../design-tokens";
import type { ProblemTag } from "../taxonomy-defaults";

export type Phase1PrimitiveDef = {
  slug: string;
  name: string;
  description: string;
  category: string;
  problemTags: ProblemTag[];
  tags: string[];
  html: string;
  css: string;
  js?: string;
  /** Extra style folders beyond default / glass / minimal */
  extraStyles?: Array<{ id: string; label: string; cssExtra: string; html?: string }>;
  dimensions?: ComponentVariant[];
};

export const SURFACE = `
.cl-surface{
  background:var(--cl-surface);
  border:1px solid var(--cl-border);
  border-radius:var(--cl-radius);
  padding:var(--cl-pad);
  box-shadow:var(--cl-shadow);
  color:var(--cl-text);
  font-size:var(--cl-font-sm);
}
.cl-label{display:block;font-size:var(--cl-font-sm);font-weight:600;color:var(--cl-text-muted);margin:0 0 8px;letter-spacing:.02em}
.cl-hint{margin:8px 0 0;font-size:var(--cl-font-sm);color:var(--cl-text-muted)}
`.trim();

export const GLASS_CSS = `
.cl-ui{background:linear-gradient(145deg,rgba(13,148,136,.1),rgba(15,23,42,.03))}
.cl-surface,.cl-btn,.cl-input,.cl-field,.cl-chip,.cl-badge,.cl-card{
  background:rgba(255,255,255,.58) !important;
  border-color:rgba(255,255,255,.5) !important;
  backdrop-filter:blur(16px);
  -webkit-backdrop-filter:blur(16px);
  box-shadow:0 12px 40px rgba(15,23,42,.1) !important;
}
.cl-ui[data-tone="dark"] .cl-surface,
.cl-ui[data-tone="dark"] .cl-btn,
.cl-ui[data-tone="dark"] .cl-input,
.cl-ui[data-tone="dark"] .cl-field{
  background:rgba(15,23,42,.55) !important;
  border-color:rgba(148,163,184,.28) !important;
}
`.trim();

export const MINIMAL_CSS = `
.cl-ui{--cl-shadow:none}
.cl-surface,.cl-btn,.cl-input,.cl-field,.cl-chip,.cl-badge{
  box-shadow:none !important;
  background:var(--cl-surface-muted) !important;
}
.cl-btn{font-weight:500}
`.trim();

export function wrapRoot(inner: string): string {
  return `<div class="cl-ui" data-size="md" data-tone="default" data-density="normal" data-radius="rounded" data-emphasis="balanced">
${inner}
</div>`;
}

export function styleCss(baseCss: string, styleId: string, extra = ""): string {
  const full = `${SCALABLE_TOKENS_CSS}\n${baseCss}${extra ? `\n${extra}` : ""}`;
  if (styleId === "glass") return `${full}\n${GLASS_CSS}`;
  if (styleId === "minimal") return `${full}\n${MINIMAL_CSS}`;
  return full;
}

export function buildManifest(def: Phase1PrimitiveDef): ComponentJsonShape {
  return {
    id: def.slug,
    name: def.name,
    slug: def.slug,
    description: def.description,
    tags: def.tags,
    tier: "FREE",
    layer: "primitives" as ComponentLayer,
    category: def.category,
    problemTags: def.problemTags,
    viewCount: 0,
    themes: ["light", "dark", "auto"],
    styleVariants: { vanilla: true, tailwind: false },
    defaultStyleId: "default",
  };
}

export function buildStyleVariants(def: Phase1PrimitiveDef): PublishStyleVariantInput[] {
  const base: PublishStyleVariantInput[] = [
    {
      id: "default",
      label: "Default",
      html: def.html,
      css: styleCss(def.css, "default"),
      js: def.js ?? "",
    },
    {
      id: "glass",
      label: "Glass",
      html: def.html,
      css: styleCss(def.css, "glass"),
      js: def.js ?? "",
    },
    {
      id: "minimal",
      label: "Minimal",
      html: def.html,
      css: styleCss(def.css, "minimal"),
      js: def.js ?? "",
    },
  ];

  for (const extra of def.extraStyles ?? []) {
    base.push({
      id: extra.id,
      label: extra.label,
      html: extra.html ?? def.html,
      css: styleCss(def.css, extra.id, extra.cssExtra),
      js: def.js ?? "",
    });
  }

  return base;
}

export function defaultDimensions(def: Phase1PrimitiveDef): ComponentVariant[] {
  return def.dimensions ?? PRIMITIVE_VARIANTS;
}

export const TYPO_VARIANTS = mergeVariants(SIZE_VARIANTS, TONE_VARIANTS, DENSITY_VARIANTS);
export const INPUT_VARIANTS = mergeVariants(
  SIZE_VARIANTS,
  TONE_VARIANTS,
  DENSITY_VARIANTS,
  RADIUS_VARIANTS,
);
