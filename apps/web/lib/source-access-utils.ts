import type { ComponentBundle, ComponentTier } from "@/lib/component-store";

export function tierRequiresProSourceLock(tier: ComponentTier): boolean {
  return tier !== "FREE";
}

export function redactComponentSources(
  c: ComponentBundle,
  hasSourceAccess: boolean,
): ComponentBundle {
  if (!tierRequiresProSourceLock(c.tier) || hasSourceAccess) return c;
  return { ...c, html: "", css: "", runtime: "", js: "" };
}
