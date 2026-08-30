/** Official CompLib visual style families — same semantic component, different design language. */
export const STYLE_FAMILIES = [
  { id: "default", label: "Default", description: "Balanced baseline styling." },
  { id: "minimal", label: "Minimal", description: "Quiet surfaces and restrained borders." },
  { id: "glass", label: "Glass", description: "Translucent panels with soft blur." },
  { id: "soft", label: "Soft", description: "Rounded, friendly, approachable UI." },
  { id: "sharp", label: "Sharp", description: "Crisp corners and high-contrast edges." },
  { id: "editorial", label: "Editorial", description: "Typography-forward, magazine-like rhythm." },
  { id: "enterprise", label: "Enterprise", description: "Dense, professional dashboard styling." },
  { id: "playful", label: "Playful", description: "Expressive color and motion-friendly shapes." },
  { id: "brutalist", label: "Brutalist", description: "Bold blocks and unapologetic contrast." },
] as const;

export type StyleFamilyId = (typeof STYLE_FAMILIES)[number]["id"];

export function isStyleFamilyId(value: string): value is StyleFamilyId {
  return STYLE_FAMILIES.some((family) => family.id === value);
}

export function styleFamilyLabel(id: string): string {
  return STYLE_FAMILIES.find((family) => family.id === id)?.label ?? id;
}

export function resolveStylePath(componentSlug: string, styleId: string): string {
  return `variants/${styleId}/html`;
}
