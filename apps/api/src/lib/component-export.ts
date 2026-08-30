import { DEFAULT_VARIANT_PROPS } from "./design-tokens";
import { applyVariantProps, type VariantPropMap } from "./variant-props";

export type ExportCompileInput = {
  html: string;
  css: string;
  js?: string;
  variantProps?: VariantPropMap;
};

export type ExportCompileResult = {
  html: string;
  css: string;
  js: string;
};

const SIZE_MULT: Record<string, number> = {
  xs: 0.5,
  sm: 0.625,
  md: 1,
  lg: 1.5,
  xl: 2,
  "2xl": 2.5,
};

const DENSITY_MULT: Record<string, number> = {
  compact: 0.72,
  normal: 1,
  spacious: 1.38,
};

const RADIUS_MULT: Record<string, number> = {
  sharp: 0.35,
  rounded: 1,
  soft: 1.65,
  pill: 1,
};

const EMPHASIS_SHADOW: Record<string, string> = {
  subtle: "0 2px 8px rgba(15,23,42,.04)",
  balanced: "0 10px 30px rgba(15,23,42,.08)",
  bold: "0 22px 55px rgba(15,23,42,.16)",
};

const TONE_OVERRIDES: Record<string, Record<string, string>> = {
  default: {
    "--cl-primary": "#3b82f6",
    "--cl-primary-hover": "#2563eb",
    "--cl-accent": "#8b5cf6",
  },
  brand: {
    "--cl-primary": "#6366f1",
    "--cl-primary-hover": "#4f46e5",
    "--cl-accent": "#a855f7",
  },
  dark: {
    "--cl-surface": "#0f172a",
    "--cl-surface-muted": "#1e293b",
    "--cl-border": "#334155",
    "--cl-text": "#f8fafc",
    "--cl-text-muted": "#94a3b8",
    "--cl-primary": "#60a5fa",
    "--cl-primary-hover": "#3b82f6",
    "--cl-accent": "#a78bfa",
    "--cl-shadow": "0 10px 30px rgba(0,0,0,.35)",
  },
  emerald: {
    "--cl-primary": "#10b981",
    "--cl-primary-hover": "#059669",
    "--cl-accent": "#14b8a6",
  },
  rose: {
    "--cl-primary": "#f43f5e",
    "--cl-primary-hover": "#e11d48",
    "--cl-accent": "#fb7185",
  },
  amber: {
    "--cl-primary": "#f59e0b",
    "--cl-primary-hover": "#d97706",
    "--cl-accent": "#fbbf24",
  },
  violet: {
    "--cl-primary": "#8b5cf6",
    "--cl-primary-hover": "#7c3aed",
    "--cl-accent": "#a78bfa",
  },
  cyan: {
    "--cl-primary": "#06b6d4",
    "--cl-primary-hover": "#0891b2",
    "--cl-accent": "#22d3ee",
  },
  slate: {
    "--cl-primary": "#64748b",
    "--cl-primary-hover": "#475569",
    "--cl-accent": "#94a3b8",
  },
  crimson: {
    "--cl-primary": "#dc2626",
    "--cl-primary-hover": "#b91c1c",
    "--cl-accent": "#f87171",
  },
};

const VARIANT_ATTRS = ["size", "tone", "density", "radius", "emphasis"] as const;

function px(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return `${rounded}px`;
}

function rem(value: number): string {
  const rounded = Math.round(value * 10000) / 10000;
  return `${rounded}rem`;
}

/** Resolve CompLib design tokens to literal values for a variant selection. */
export function resolveDesignTokens(variantProps: VariantPropMap = {}): Record<string, string> {
  const props = { ...DEFAULT_VARIANT_PROPS, ...variantProps };
  const sizeMult = SIZE_MULT[props.size] ?? 1;
  const densityMult = DENSITY_MULT[props.density] ?? 1;
  const radiusMult = RADIUS_MULT[props.radius] ?? 1;
  const emphasis = props.emphasis ?? "balanced";
  const tone = props.tone ?? "default";

  const tokens: Record<string, string> = {
    "--cl-size-mult": String(sizeMult),
    "--cl-density-mult": String(densityMult),
    "--cl-radius-mult": String(radiusMult),
    "--cl-primary": "#3b82f6",
    "--cl-primary-hover": "#2563eb",
    "--cl-accent": "#8b5cf6",
    "--cl-surface": "#ffffff",
    "--cl-surface-muted": "#f8fafc",
    "--cl-border": "#e2e8f0",
    "--cl-text": "#0f172a",
    "--cl-text-muted": "#64748b",
    "--cl-success": "#10b981",
    "--cl-warning": "#f59e0b",
    "--cl-danger": "#ef4444",
    "--cl-pad-base": "16px",
    "--cl-gap-base": "16px",
    "--cl-radius-base": "10px",
    "--cl-shadow-strength": emphasis === "subtle" ? "0.6" : emphasis === "bold" ? "1.4" : "1",
    "--cl-shadow": EMPHASIS_SHADOW[emphasis] ?? EMPHASIS_SHADOW.balanced,
  };

  Object.assign(tokens, TONE_OVERRIDES[tone] ?? TONE_OVERRIDES.default);

  const pad = 16 * sizeMult * densityMult;
  const gap = 16 * sizeMult * densityMult;
  tokens["--cl-pad"] = px(pad);
  tokens["--cl-gap"] = px(gap);
  tokens["--cl-font-sm"] = rem(0.875 * sizeMult);
  tokens["--cl-font-md"] = rem(1 * sizeMult);
  tokens["--cl-font-lg"] = rem(1.25 * sizeMult);
  tokens["--cl-font-xl"] = rem(1.75 * sizeMult);

  if (props.radius === "pill") {
    tokens["--cl-radius"] = "9999px";
  } else {
    tokens["--cl-radius"] = px(10 * radiusMult * Math.max(0.55, sizeMult));
  }

  tokens["--cl-max-w-xs"] = px(280 * sizeMult);
  tokens["--cl-max-w-sm"] = px(320 * sizeMult);
  tokens["--cl-max-w-md"] = px(360 * sizeMult);
  tokens["--cl-max-w-form"] = px(400 * sizeMult);
  tokens["--cl-max-w-lg"] = px(480 * sizeMult);
  tokens["--cl-max-w-xl"] = px(520 * sizeMult);
  tokens["--cl-max-w-2xl"] = px(640 * sizeMult);
  tokens["--cl-max-w-narrow"] = px(720 * sizeMult);
  tokens["--cl-max-w-section"] = px(960 * sizeMult);
  tokens["--cl-icon-md"] = px(40 * sizeMult);
  tokens["--cl-shell-min-h"] = px(280 * sizeMult);
  tokens["--cl-sidebar-w"] = px(200 * sizeMult);
  tokens["--cl-grid-min"] = px(180 * sizeMult);
  tokens["--cl-grid-min-sm"] = px(140 * sizeMult);

  return tokens;
}

/** Remove internal CompLib token engine and data-* variant rules from authoring CSS. */
export function stripAuthoringCss(css: string): string {
  let out = css.trim();
  const tokenStart = out.indexOf(".cl-ui{");
  if (tokenStart !== -1) {
    const lastToneRule = out.lastIndexOf(".cl-ui[data-tone");
    if (lastToneRule !== -1) {
      const end = out.indexOf("}", lastToneRule);
      if (end !== -1) out = out.slice(end + 1);
    } else {
      const firstBrace = out.indexOf("}", tokenStart);
      if (firstBrace !== -1) out = out.slice(firstBrace + 1);
    }
  }

  out = out.replace(/\.cl-ui\s*,\s*\.cl-ui\s+\*[^\{]*\{[^}]*\}/g, "");
  out = out.replace(/\.cl-ui\[data-[^\]]+\]\{[^}]*\}/g, "");
  out = out.replace(/\.cl-ui\{[^}]*\}/g, "");
  return out.trim();
}

function simplifyCssValue(value: string, tokens: Record<string, string>): string {
  let out = value;
  for (let pass = 0; pass < 12; pass++) {
    const before = out;
    out = out.replace(/var\(\s*(--cl-[\w-]+)\s*\)/g, (_, name: string) => tokens[name] ?? `var(${name})`);
    out = out.replace(
      /calc\(\s*([\d.]+)rem\s*\*\s*([\d.]+)\s*\)/gi,
      (_, a, b) => rem(parseFloat(a) * parseFloat(b)),
    );
    out = out.replace(
      /calc\(\s*([\d.]+)px\s*\*\s*([\d.]+)\s*\)/gi,
      (_, a, b) => px(parseFloat(a) * parseFloat(b)),
    );
    out = out.replace(/max\(\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/gi, (_, a, b) =>
      String(Math.max(parseFloat(a), parseFloat(b))),
    );
    if (out === before) break;
  }
  return out;
}

/** Replace var(--cl-*) references with resolved literals. */
export function flattenCssVariables(css: string, tokens: Record<string, string>): string {
  return css.replace(/([^{};]+)\{([^}]*)\}/g, (full, selectors: string, body: string) => {
    if (selectors.trim().startsWith("@")) return full;
    const flatBody = body
      .split(";")
      .map((decl: string) => {
        const trimmed = decl.trim();
        if (!trimmed) return "";
        const colon = trimmed.indexOf(":");
        if (colon === -1) return trimmed;
        const prop = trimmed.slice(0, colon).trim();
        const value = simplifyCssValue(trimmed.slice(colon + 1).trim(), tokens);
        return `${prop}:${value}`;
      })
      .filter(Boolean)
      .join(";");
    return `${selectors}{${flatBody}}`;
  });
}

function extractRootClasses(html: string): string[] {
  const match = html.match(/\bclass="([^"]*\bcl-[\w-]+[^"]*)"/);
  if (!match) return [];
  return match[1]!
    .split(/\s+/)
    .map((c) => c.trim())
    .filter((c) => c && c !== "cl-ui");
}

function stripVariantAttributesFromHtml(html: string): string {
  const tagRe = /<([a-zA-Z][\w-]*)([^>]*\bclass="[^"]*\bcl-ui\b[^"]*"[^>]*)>/;
  const match = html.match(tagRe);
  if (!match) return html;

  const tagName = match[1]!;
  let attrs = match[2]!;

  for (const key of VARIANT_ATTRS) {
    const dataAttr = `data-${key}`;
    attrs = attrs.replace(new RegExp(`\\s${dataAttr}="[^"]*"`, "g"), "");
  }

  attrs = attrs.replace(/\bclass="([^"]*)"/, (_, classes: string) => {
    const cleaned = classes
      .split(/\s+/)
      .filter((c: string) => c && c !== "cl-ui")
      .join(" ");
    return `class="${cleaned}"`;
  });

  return html.replace(match[0]!, `<${tagName}${attrs}>`);
}

function buildExportFoundationCss(
  rootClasses: string[],
  tokens: Record<string, string>,
): string {
  if (rootClasses.length === 0) return "";
  const selector = rootClasses.map((c) => `.${c}`).join("");
  const color = tokens["--cl-text"] ?? "#0f172a";
  return `${selector}{font-family:Inter,system-ui,sans-serif;color:${color};box-sizing:border-box}
${selector} *,${selector} *::before,${selector} *::after{box-sizing:border-box}`;
}

/** Prefix each rule so multiple instances with different variants can coexist. */
export function scopeCssRules(css: string, scopeSelector: string): string {
  const chunks: string[] = [];
  let i = 0;
  while (i < css.length) {
    const brace = css.indexOf("{", i);
    if (brace === -1) break;
    const selectors = css.slice(i, brace).trim();
    let depth = 1;
    let j = brace + 1;
    while (j < css.length && depth > 0) {
      if (css[j] === "{") depth++;
      else if (css[j] === "}") depth--;
      j++;
    }
    const body = css.slice(brace, j);
    if (!selectors) {
      i = j;
      continue;
    }
    if (selectors.startsWith("@")) {
      chunks.push(selectors + body);
    } else {
      const scoped = selectors
        .split(",")
        .map((s) => `${scopeSelector} ${s.trim()}`)
        .join(",");
      chunks.push(scoped + body);
    }
    i = j;
  }
  return chunks.join("\n");
}

/**
 * Bake a CompLib component for download: literal CSS, no token engine, no data-* variant attrs.
 */
export function compileComponentForExport(input: ExportCompileInput): ExportCompileResult {
  const props = { ...DEFAULT_VARIANT_PROPS, ...input.variantProps };
  const htmlWithVariant = applyVariantProps(input.html, props);
  const html = stripVariantAttributesFromHtml(htmlWithVariant);
  const tokens = resolveDesignTokens(props);
  const componentCss = stripAuthoringCss(input.css);
  const flattened = flattenCssVariables(componentCss, tokens);
  const rootClasses = extractRootClasses(htmlWithVariant);
  const foundation = buildExportFoundationCss(rootClasses, tokens);
  const css = [foundation, flattened].filter(Boolean).join("\n");
  return {
    html,
    css,
    js: input.js ?? "",
  };
}

export function variantPropsCacheKey(props: VariantPropMap = {}): string {
  return Object.entries({ ...DEFAULT_VARIANT_PROPS, ...props })
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
}
