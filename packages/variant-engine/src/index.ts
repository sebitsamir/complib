/** Shared variant/style contracts. Implementations in apps still apply CSS tokens. */

export type VariantDimensionKind =
  | "size"
  | "tone"
  | "density"
  | "radius"
  | "emphasis"
  | "generic";

export type VariantSelection = {
  props: Record<string, string>;
  presetId?: string;
};

export const STYLE_FAMILIES = [
  "default",
  "minimal",
  "soft",
  "sharp",
  "editorial",
  "glass",
  "brutalist",
  "enterprise",
  "playful",
] as const;

export type StyleFamilyId = (typeof STYLE_FAMILIES)[number];

export function applyVariantProps(html: string, props: Record<string, string>): string {
  if (!html.trim() || Object.keys(props).length === 0) return html;

  const tagRe = /<([a-zA-Z][\w-]*)([^>]*\bclass="[^"]*\bcl-ui\b[^"]*"[^>]*)>/;
  const match = html.match(tagRe);
  if (!match) return html;

  const full = match[0]!;
  const tagName = match[1]!;
  let attrs = match[2]!;

  for (const [key, value] of Object.entries(props)) {
    if (!value) continue;
    const dataAttr = `data-${key.replace(/[^a-z0-9_-]/gi, "")}`;
    const existing = new RegExp(`(\\s${dataAttr}=")([^"]*)(")`);
    if (existing.test(attrs)) {
      attrs = attrs.replace(
        existing,
        `$1${value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")}$3`,
      );
    } else {
      const escaped = value
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;");
      attrs = `${attrs} ${dataAttr}="${escaped}"`;
    }
  }

  return html.replace(full, `<${tagName}${attrs}>`);
}
