import type { Component } from "@/lib/component-store";
import { getLibraryStyleOptions } from "@/lib/variant-utils";

export type StyleFamily = {
  slug: string;
  label: string;
  count: number;
};

/** Known design-language families — matched via tags, style props, or preset labels. */
export const STYLE_FAMILY_DEFS: Array<{ slug: string; label: string; keywords: string[] }> = [
  { slug: "modern", label: "Modern", keywords: ["modern", "contemporary"] },
  { slug: "minimal", label: "Minimal", keywords: ["minimal", "clean", "simple"] },
  { slug: "glass", label: "Glass", keywords: ["glass", "glassmorphism", "frosted"] },
  { slug: "material", label: "Material", keywords: ["material", "mdc"] },
  { slug: "neumorphism", label: "Neumorphism", keywords: ["neumorphism", "neu", "soft-ui"] },
  { slug: "brutalist", label: "Brutalist", keywords: ["brutalist", "brutal"] },
  { slug: "apple", label: "Apple", keywords: ["apple", "ios", "sf"] },
  { slug: "fluent", label: "Fluent", keywords: ["fluent", "microsoft"] },
  { slug: "cyberpunk", label: "Cyberpunk", keywords: ["cyberpunk", "neon", "cyber"] },
  { slug: "standard", label: "Standard", keywords: ["standard", "default", "base"] },
];

function normalizeToken(value: string): string {
  return value.trim().toLowerCase();
}

function componentMatchesStyleFamily(component: Component, familySlug: string): boolean {
  if (component.styleFamilies?.some((variant) => variant.id === familySlug)) {
    return true;
  }

  const def = STYLE_FAMILY_DEFS.find((entry) => entry.slug === familySlug);
  if (!def) return false;

  const haystack = [
    component.slug,
    component.name,
    component.description,
    ...component.tags,
    ...component.problemTags,
  ]
    .join(" ")
    .toLowerCase();

  if (def.keywords.some((keyword) => haystack.includes(keyword))) {
    return true;
  }

  const styleOptions = getLibraryStyleOptions(component.variants ?? []);
  for (const option of styleOptions) {
    const label = normalizeToken(option.label);
    if (def.keywords.some((keyword) => label.includes(keyword))) return true;
    if (familySlug === "standard" && (label === "standard" || label === "default")) {
      return true;
    }
    for (const value of Object.values(option.props)) {
      if (def.keywords.some((keyword) => normalizeToken(value).includes(keyword))) {
        return true;
      }
    }
  }

  if (familySlug === "standard") {
    const options = getLibraryStyleOptions(component.variants ?? []);
    const onlyStandard =
      options.length <= 1 &&
      (options.length === 0 ||
        normalizeToken(options[0]?.label ?? "") === "standard" ||
        normalizeToken(options[0]?.label ?? "") === "default");
    if (onlyStandard) return true;
  }

  return false;
}

export function getComponentsForStyleFamily(
  components: Component[],
  familySlug: string,
): Component[] {
  return components.filter((component) => componentMatchesStyleFamily(component, familySlug));
}

export function buildStyleFamilies(components: Component[]): StyleFamily[] {
  const families = STYLE_FAMILY_DEFS.map((def) => ({
    slug: def.slug,
    label: def.label,
    count: getComponentsForStyleFamily(components, def.slug).length,
  })).filter((family) => family.count > 0);

  if (families.length === 0) {
    return [
      {
        slug: "standard",
        label: "Standard",
        count: components.length,
      },
    ];
  }

  return families.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function styleFamilyLabel(slug: string): string {
  return STYLE_FAMILY_DEFS.find((entry) => entry.slug === slug)?.label ?? slug.replace(/-/g, " ");
}
