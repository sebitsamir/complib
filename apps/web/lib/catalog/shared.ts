import type {
  ComponentJsonShape,
  ComponentLayer,
  ComponentVariant,
  PublishStyleVariantInput,
} from "@/lib/component-fs";
import {
  PATTERN_VARIANTS,
  SECTION_VARIANTS,
  SCALABLE_TOKENS_CSS,
} from "@/lib/design-tokens";
import type { ProblemTag } from "@/lib/taxonomy-defaults";
import {
  GLASS_CSS,
  MINIMAL_CSS,
  wrapRoot,
} from "@/lib/phase1/shared";

export type CatalogComponentDef = {
  slug: string;
  name: string;
  description: string;
  layer: ComponentLayer;
  category: string;
  problemTags: ProblemTag[];
  tags: string[];
  html: string;
  css: string;
  js?: string;
  tier?: "FREE" | "PRO";
  dimensions?: ComponentVariant[];
  extraStyles?: Array<{ id: string; label: string; cssExtra: string; html?: string }>;
};

export { wrapRoot, GLASS_CSS, MINIMAL_CSS };

/** Shared production UI atoms used across patterns / sections / templates. */
export const PRO_UI = `
.cl-btn{appearance:none;display:inline-flex;align-items:center;justify-content:center;gap:8px;font:inherit;font-size:var(--cl-font-sm);font-weight:600;cursor:pointer;border-radius:var(--cl-radius);border:1px solid transparent;padding:10px 16px;line-height:1.2;text-decoration:none}
.cl-btn--primary{background:var(--cl-primary);color:#fff;border-color:transparent}
.cl-btn--primary:hover{background:var(--cl-primary-hover)}
.cl-btn--secondary{background:var(--cl-surface);color:var(--cl-text);border-color:var(--cl-border)}
.cl-btn--secondary:hover{background:var(--cl-surface-muted)}
.cl-btn--ghost{background:transparent;color:var(--cl-text);border-color:transparent}
.cl-btn--ghost:hover{background:var(--cl-surface-muted)}
.cl-field{display:flex;flex-direction:column;gap:6px;width:100%}
.cl-field label{font-size:var(--cl-font-sm);font-weight:600;color:var(--cl-text)}
.cl-input,.cl-select,.cl-textarea{width:100%;font:inherit;font-size:var(--cl-font-sm);color:var(--cl-text);background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:calc(var(--cl-radius) * .85);padding:10px 12px;outline:none}
.cl-input:focus,.cl-select:focus,.cl-textarea:focus{border-color:var(--cl-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--cl-primary) 22%,transparent)}
.cl-textarea{min-height:96px;resize:vertical}
.cl-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;font-size:calc(var(--cl-font-sm) * .92);font-weight:700;background:color-mix(in srgb,var(--cl-primary) 12%,#fff);color:var(--cl-primary-hover)}
.cl-kicker{display:inline-flex;align-items:center;gap:8px;font-size:var(--cl-font-sm);font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--cl-primary)}
.cl-muted{color:var(--cl-text-muted)}
.cl-card{background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);box-shadow:var(--cl-shadow);padding:var(--cl-pad);color:var(--cl-text)}
.cl-section{width:100%;max-width:var(--cl-max-w-section);margin:0 auto;padding:calc(48px * var(--cl-size-mult)) calc(24px * var(--cl-size-mult))}
.cl-section__head{max-width:640px;margin:0 auto calc(32px * var(--cl-size-mult));text-align:center}
.cl-section__title{margin:0 0 10px;font-size:clamp(1.5rem,2.4vw,2.1rem);letter-spacing:-.03em;line-height:1.15}
.cl-section__lead{margin:0;font-size:var(--cl-font-md);color:var(--cl-text-muted);line-height:1.6}
.cl-grid-3{display:grid;gap:var(--cl-gap);grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))}
.cl-grid-2{display:grid;gap:calc(var(--cl-gap) * 1.25);grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));align-items:center}
.cl-avatar{width:40px;height:40px;border-radius:999px;background:linear-gradient(135deg,var(--cl-primary),#0ea5e9);color:#fff;display:grid;place-items:center;font-weight:700;font-size:var(--cl-font-sm);flex-shrink:0}
.cl-icon{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:color-mix(in srgb,var(--cl-primary) 12%,transparent);color:var(--cl-primary);font-size:1.1rem;flex-shrink:0}
.cl-link{color:var(--cl-primary);text-decoration:none;font-weight:600}
.cl-link:hover{text-decoration:underline}
.cl-divider{height:1px;background:var(--cl-border);border:0;margin:var(--cl-gap) 0}
.cl-table{width:100%;border-collapse:collapse;font-size:var(--cl-font-sm)}
.cl-table th,.cl-table td{padding:12px 14px;text-align:left;border-bottom:1px solid var(--cl-border)}
.cl-table th{font-size:calc(var(--cl-font-sm) * .9);text-transform:uppercase;letter-spacing:.04em;color:var(--cl-text-muted);font-weight:700;background:var(--cl-surface-muted)}
.cl-page{width:100%;max-width:1120px;margin:0 auto;background:var(--cl-surface-muted);border:1px solid var(--cl-border);border-radius:calc(var(--cl-radius) * 1.2);overflow:hidden;box-shadow:var(--cl-shadow)}
.cl-page__bar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 20px;background:var(--cl-surface);border-bottom:1px solid var(--cl-border)}
.cl-page__brand{font-weight:800;letter-spacing:-.02em}
.cl-page__nav{display:flex;flex-wrap:wrap;gap:14px;font-size:var(--cl-font-sm)}
.cl-page__nav a{color:var(--cl-text-muted);text-decoration:none}
.cl-page__nav a:hover{color:var(--cl-text)}
.cl-page__body{padding:28px 20px 36px}
.cl-stat{padding:var(--cl-pad);background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius)}
.cl-stat__value{font-size:clamp(1.4rem,2vw,1.85rem);font-weight:800;letter-spacing:-.03em;margin:0}
.cl-stat__label{margin:6px 0 0;font-size:var(--cl-font-sm);color:var(--cl-text-muted)}
`.trim();

function styleCss(baseCss: string, styleId: string, extra = ""): string {
  const full = `${SCALABLE_TOKENS_CSS}\n${PRO_UI}\n${baseCss}${extra ? `\n${extra}` : ""}`;
  if (styleId === "glass") return `${full}\n${GLASS_CSS}`;
  if (styleId === "minimal") return `${full}\n${MINIMAL_CSS}`;
  return full;
}

export function buildCatalogManifest(def: CatalogComponentDef): ComponentJsonShape {
  return {
    id: def.slug,
    name: def.name,
    slug: def.slug,
    description: def.description,
    tags: def.tags,
    tier: def.tier ?? "FREE",
    layer: def.layer,
    category: def.category,
    problemTags: def.problemTags,
    viewCount: 0,
    themes: ["light", "dark", "auto"],
    styleVariants: { vanilla: true, tailwind: false },
    defaultStyleId: "default",
  };
}

export function buildCatalogStyleVariants(def: CatalogComponentDef): PublishStyleVariantInput[] {
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

export function defaultCatalogDimensions(def: CatalogComponentDef): ComponentVariant[] {
  if (def.dimensions) return def.dimensions;
  if (def.layer === "sections" || def.layer === "templates") return SECTION_VARIANTS;
  return PATTERN_VARIANTS;
}

export function def(
  partial: Omit<CatalogComponentDef, "tags"> & { tags?: string[] },
): CatalogComponentDef {
  return {
    ...partial,
    tags: partial.tags ?? [partial.layer, partial.category, partial.slug, "production"],
  };
}
