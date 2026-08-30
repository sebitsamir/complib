import type { ComponentVariant } from "./component-fs";
import {
  buildSelection,
  findPresetByProps,
  getDefaultProps,
  selectionFromVariantId,
  type VariantSelection,
} from "./variant-utils";

export type VariantPropMap = Record<string, string>;

export type VariantQuery = {
  variant?: string;
  style?: string;
  [key: string]: string | undefined;
};

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

/** Applies variant props as data-* attributes on the first `.cl-ui` root in the markup. */
export function applyVariantProps(html: string, props: VariantPropMap): string {
  if (!html.trim() || Object.keys(props).length === 0) return html;

  const tagRe =
    /<([a-zA-Z][\w-]*)([^>]*\bclass="[^"]*\bcl-ui\b[^"]*"[^>]*)>/;
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
      attrs = attrs.replace(existing, `$1${escapeHtmlAttr(value)}$3`);
    } else {
      attrs = `${attrs} ${dataAttr}="${escapeHtmlAttr(value)}"`;
    }
  }

  return html.replace(full, `<${tagName}${attrs}>`);
}

export function findVariantById(
  variants: ComponentVariant[] | undefined,
  variantId: string | undefined,
): ComponentVariant | undefined {
  if (!variantId || !variants?.length) return undefined;
  return variants.find((variant) => variant.id === variantId);
}

export function resolveVariantProps(
  variants: ComponentVariant[] | undefined,
  options: VariantQuery = {},
): VariantPropMap {
  if (!variants?.length) {
    const props: VariantPropMap = {};
    for (const [key, value] of Object.entries(options)) {
      if (key === "variant" || !value) continue;
      props[key] = value;
    }
    return props;
  }

  const { variant: variantParam, ...dimensionParams } = options;
  const mergedQuery: Record<string, string | undefined> = {
    variant: variantParam,
    ...dimensionParams,
  };

  const selection = buildSelection(
    variants,
    Object.keys(dimensionParams).length > 0 || variantParam
      ? parseSelectionFromQuery(variants, mergedQuery).props
      : getDefaultProps(variants),
  );

  if (variantParam && !Object.keys(dimensionParams).length) {
    return { ...selectionFromVariantId(variants, variantParam).props };
  }

  const props: VariantPropMap = { ...selection.props };

  for (const [key, value] of Object.entries(dimensionParams)) {
    if (key === "variant" || !value) continue;
    props[key] = value;
  }

  return props;
}

function parseSelectionFromQuery(
  variants: ComponentVariant[],
  query: Record<string, string | undefined>,
): VariantSelection {
  const { variant: variantParam, ...rest } = query;
  const base = variantParam
    ? selectionFromVariantId(variants, variantParam).props
    : getDefaultProps(variants);

  const merged = { ...base };
  for (const [key, value] of Object.entries(rest)) {
    if (value) merged[key] = value;
  }

  return buildSelection(variants, merged);
}

export function resolveInstanceVariantProps(
  variants: ComponentVariant[] | undefined,
  variantId?: string,
  variantProps?: VariantPropMap,
): VariantPropMap {
  const base = variantId
    ? selectionFromVariantId(variants ?? [], variantId).props
    : variants?.length
      ? getDefaultProps(variants)
      : {};

  return { ...base, ...variantProps };
}

export function resolveSelectionProps(selection: VariantSelection): VariantPropMap {
  return { ...selection.props };
}

export function buildComponentPreviewUrl(
  slug: string,
  options: VariantQuery = {},
): string {
  const params = new URLSearchParams();
  if (options.variant) params.set("variant", options.variant);
  for (const [key, value] of Object.entries(options)) {
    if (key === "variant" || !value) continue;
    params.set(key, value);
  }
  const query = params.toString();
  return `/api/preview/${encodeURIComponent(slug)}${query ? `?${query}` : ""}`;
}

export function buildPreviewUrlFromSelection(
  slug: string,
  variants: ComponentVariant[],
  selection: VariantSelection,
): string {
  const query: VariantQuery = {};
  if (selection.presetId) query.variant = selection.presetId;
  for (const [key, value] of Object.entries(selection.props)) {
    if (value) query[key] = value;
  }
  return buildComponentPreviewUrl(slug, query);
}

export function renderComponentHtml(
  html: string,
  variants: ComponentVariant[] | undefined,
  variantId?: string,
  extraProps?: VariantPropMap,
): string {
  const props = resolveInstanceVariantProps(variants, variantId, extraProps);
  return applyVariantProps(html, props);
}

export function renderFromSelection(
  html: string,
  selection: VariantSelection,
): string {
  return applyVariantProps(html, resolveSelectionProps(selection));
}

export { findPresetByProps, getDefaultProps, selectionFromVariantId, buildSelection };
export type { VariantSelection };
