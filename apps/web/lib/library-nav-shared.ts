import type { ComponentLayer } from "@/lib/component-fs";
import { ALLOWED_PROBLEM_TAGS, TAXONOMY_DEFAULTS } from "@/lib/taxonomy-defaults";

export const LAYER_ORDER: ComponentLayer[] = [
  "primitives",
  "patterns",
  "sections",
  "templates",
];

export type ThumbnailDensity = "icon" | "thumb" | "card";

export type LayerIconKey =
  | "recent"
  | "favorites"
  | "primitives"
  | "patterns"
  | "sections"
  | "templates"
  | "fallback";

export type LayerNavMeta = {
  label: string;
  short: string;
  accent: string;
  iconBg: string;
  icon: LayerIconKey;
};

export const LAYER_NAV_META: Record<ComponentLayer, LayerNavMeta> = {
  primitives: {
    label: "Primitives",
    short: "Prim",
    accent: "text-blue-600 dark:text-blue-400",
    iconBg: "from-blue-500/30 to-blue-600/10",
    icon: "primitives",
  },
  patterns: {
    label: "Patterns",
    short: "Pat",
    accent: "text-violet-600 dark:text-violet-400",
    iconBg: "from-violet-500/30 to-violet-600/10",
    icon: "patterns",
  },
  sections: {
    label: "Sections",
    short: "Sec",
    accent: "text-emerald-600 dark:text-emerald-400",
    iconBg: "from-emerald-500/30 to-emerald-600/10",
    icon: "sections",
  },
  templates: {
    label: "Templates",
    short: "Tpl",
    accent: "text-amber-700 dark:text-amber-300",
    iconBg: "from-amber-500/30 to-amber-600/10",
    icon: "templates",
  },
};

export const PROBLEM_LABELS: Record<string, string> = {
  "build-landing-page": "Landing page",
  "build-dashboard": "Dashboard",
  "build-form": "Forms",
  "build-navigation": "Navigation",
  "build-authentication": "Authentication",
  "build-ui-sections": "UI sections",
};

export function layerNavMeta(layer: string): LayerNavMeta {
  return (
    LAYER_NAV_META[layer as ComponentLayer] ?? {
      label: layer,
      short: layer.slice(0, 4),
      accent: "text-muted-foreground",
      iconBg: "from-muted to-muted/40",
      icon: "fallback",
    }
  );
}

export function problemLabel(problem: string): string {
  return PROBLEM_LABELS[problem] ?? problem.replace(/-/g, " ");
}

export function componentInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function thumbnailDensityForLayer(layer: string): ThumbnailDensity {
  if (layer === "primitives") return "icon";
  if (layer === "patterns") return "thumb";
  return "card";
}

export function categoryLabelForLayer(layer: string, categorySlug: string): string {
  const layerDef = TAXONOMY_DEFAULTS.find((entry) => entry.id === layer);
  const category = layerDef?.categories.find((entry) => entry.slug === categorySlug);
  return category?.label ?? categorySlug.replace(/-/g, " ");
}

export const PROBLEM_ORDER = [...ALLOWED_PROBLEM_TAGS];
