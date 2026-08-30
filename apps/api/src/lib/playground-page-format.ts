/** Light formatting so merged page code is readable in the editor. */

export function formatCss(css: string): string {
  let s = css.trim();
  if (!s) return "";

  s = s.replace(/\/\* complib: ([^·]+) · [^\s]+ \*\//g, "/* $1 */");
  s = s.replace(/\}\s*/g, "}\n");
  s = s.replace(/\{\s*/g, " {\n  ");
  s = s.replace(/;\s*(?=\S)/g, ";\n  ");
  s = s.replace(/\s+\}/g, "\n}");
  s = s.replace(/\n\s*\n\s*\n+/g, "\n\n");

  return s
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

const SECTION_ATTRS = [
  "class",
  "data-complib-instance",
  "data-complib-slug",
  "data-complib-variant",
  "data-complib-variant-props",
  "data-complib-z",
] as const;

function extractSectionOpenTag(part: string): string | null {
  const match = part.match(/^<section\b[^>]*>/i);
  return match?.[0] ?? null;
}

function formatSectionOpenTag(openTag: string): string {
  const attrs: string[] = [];
  for (const name of SECTION_ATTRS) {
    const match = openTag.match(new RegExp(`\\b${name}="([^"]*)"`));
    if (match) attrs.push(`${name}="${match[1]}"`);
  }
  if (attrs.length === 0) attrs.push('class="complib-section"');
  return `<section ${attrs.join(" ")}>`;
}

/** Pretty-print playground section markup for the HTML tab. */
export function formatPageHtml(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const parts = trimmed.split(/(?=<section\s)/i).filter(Boolean);
  if (parts.length === 0) return trimmed;

  const blocks: string[] = [];

  for (const part of parts) {
    const openTag = extractSectionOpenTag(part);
    if (!openTag) continue;
    const slugMatch = openTag.match(/data-complib-slug="([^"]+)"/);
    const slug = slugMatch?.[1] ?? "component";

    const openEnd = part.indexOf(">");
    if (openEnd === -1) continue;
    const inner = part.slice(openEnd + 1).replace(/<\/section>\s*$/i, "").trim();

    const indentedInner = indentBlock(inner, 2);

    blocks.push(
      `<!-- ${slug} -->\n${formatSectionOpenTag(openTag)}\n${indentedInner}\n</section>`,
    );
  }

  return blocks.join("\n\n");
}

function indentBlock(text: string, spaces: number): string {
  const pad = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line) => (line.trim() ? pad + line.trim() : ""))
    .join("\n");
}

export function combinePageStyles(layoutCss: string, componentsCss: string): string {
  return [layoutCss.trim(), componentsCss.trim()].filter(Boolean).join("\n\n");
}
