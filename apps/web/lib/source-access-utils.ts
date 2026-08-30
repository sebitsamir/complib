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

/** Strip source payloads before passing components to client components. */
export function redactComponentsForClient(
  components: ComponentBundle[],
  hasSourceAccess: boolean,
): ComponentBundle[] {
  return components.map((c) => redactComponentSources(c, hasSourceAccess));
}
