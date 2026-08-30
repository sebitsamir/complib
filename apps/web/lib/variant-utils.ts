import type { ComponentVariant } from "@/lib/component-fs";
import { DEFAULT_VARIANT_PROPS, INSPECTOR_TONE_VALUES, TONE_SWATCHES } from "@/lib/design-tokens";

export { TONE_SWATCHES };

export type VariantDimensionOption = {
  value: string;
  label: string;
  /** Preset id when this option maps to a single-prop variant. */
  presetId?: string;
};

export type VariantDimension = {
  key: string;
  label: string;
  kind: "size" | "tone" | "density" | "radius" | "emphasis" | "generic";
  options: VariantDimensionOption[];
};

export type VariantSelection = {
  props: Record<string, string>;
  /** Matching named preset, if the current props map exactly to one. */
  presetId?: string;
};

const DIMENSION_LABELS: Record<string, { label: string; kind: VariantDimension["kind"] }> = {
  size: { label: "Scale", kind: "size" },
  tone: { label: "Color", kind: "tone" },
  density: { label: "Density", kind: "density" },
  radius: { label: "Corners", kind: "radius" },
  emphasis: { label: "Emphasis", kind: "emphasis" },
};

/** Prop keys that define library types (Solid, Neon, …) — not shown as size/tone chips in the inspector. */
export const LIBRARY_TYPE_DIMENSION_KEYS = new Set([
  "style",
  "type",
  "variant",
  "preset",
  "appearance",
]);

export type LibraryStyleOption = {
  id: string;
  label: string;
  props: Record<string, string>;
  presetId?: string;
};

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function dimensionMeta(key: string): { label: string; kind: VariantDimension["kind"] } {
  return (
    DIMENSION_LABELS[key] ?? {
      label: capitalize(key.replace(/[-_]/g, " ")),
      kind: "generic",
    }
  );
}

/** Groups flat variant presets into independent prop dimensions (size, tone, …). */
export function extractDimensions(variants: ComponentVariant[]): VariantDimension[] {
  const byKey = new Map<string, Map<string, VariantDimensionOption>>();

  for (const variant of variants) {
    const props = variant.props ?? {};
    const keys = Object.keys(props);
    if (keys.length !== 1) continue;
    const key = keys[0]!;
    const value = props[key]!;
    const bucket = byKey.get(key) ?? new Map<string, VariantDimensionOption>();
    if (!bucket.has(value)) {
      bucket.set(value, { value, label: variant.label, presetId: variant.id });
    }
    byKey.set(key, bucket);
  }

  const order = ["size", "tone", "density", "radius", "emphasis"];
  const keys = [...byKey.keys()].sort((a, b) => {
    const ai = order.indexOf(a);
    const bi = order.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return keys.map((key) => {
    const meta = dimensionMeta(key);
    return {
      key,
      label: meta.label,
      kind: meta.kind,
      options: [...(byKey.get(key)?.values() ?? [])],
    };
  });
}

/** Variants that set more than one prop or don't fit a single dimension — named combos. */
export function extractPresets(variants: ComponentVariant[]): ComponentVariant[] {
  const dimensions = extractDimensions(variants);
  const singlePropIds = new Set(
    dimensions.flatMap((dim) => dim.options.map((opt) => opt.presetId).filter(Boolean)),
  );
  return variants.filter((variant) => {
    const propCount = Object.keys(variant.props ?? {}).length;
    if (propCount > 1) return true;
    if (propCount === 0) return true;
    return !singlePropIds.has(variant.id);
  });
}

export function hasDimensionalControls(variants: ComponentVariant[]): boolean {
  return getInspectorDimensions(variants).length > 0;
}

/** Dimensions tuned in the Properties panel (size, tone, …) — excludes library type keys. */
export function getInspectorDimensions(variants: ComponentVariant[]): VariantDimension[] {
  const toneOrder = new Map(INSPECTOR_TONE_VALUES.map((value, index) => [value, index]));

  return extractDimensions(variants)
    .filter((dim) => !LIBRARY_TYPE_DIMENSION_KEYS.has(dim.key))
    .map((dim) => {
      if (dim.kind !== "tone") return dim;
      const filtered = dim.options.filter((opt) => toneOrder.has(opt.value as (typeof INSPECTOR_TONE_VALUES)[number]));
      filtered.sort(
        (a, b) =>
          (toneOrder.get(a.value as (typeof INSPECTOR_TONE_VALUES)[number]) ?? 99) -
          (toneOrder.get(b.value as (typeof INSPECTOR_TONE_VALUES)[number]) ?? 99),
      );
      return { ...dim, options: filtered };
    });
}

/**
 * Named types shown when expanding a component in the library (Solid, Neon Glow, …).
 * Multi-prop presets first; else options on a type dimension (`style`, `type`, …);
 * else a single Standard entry using default token props.
 */
export function getLibraryStyleOptions(variants: ComponentVariant[]): LibraryStyleOption[] {
  const presets = extractPresets(variants);
  if (presets.length > 0) {
    return presets.map((variant) => ({
      id: variant.id,
      label: variant.label,
      props: { ...(variant.props ?? {}) },
      presetId: variant.id,
    }));
  }

  const dimensions = extractDimensions(variants);
  const typeDim = dimensions.find((dim) => LIBRARY_TYPE_DIMENSION_KEYS.has(dim.key));
  if (typeDim && typeDim.options.length > 0) {
    const defaults = getDefaultProps(variants);
    return typeDim.options.map((opt) => ({
      id: opt.presetId ?? `${typeDim.key}-${opt.value}`,
      label: opt.label,
      props: { ...defaults, [typeDim.key]: opt.value },
      presetId: opt.presetId,
    }));
  }

  if (variants.length === 0) {
    return [{ id: "default", label: "Standard", props: {} }];
  }

  const defaults = getDefaultProps(variants);
  const preset = findPresetByProps(variants, defaults);
  return [
    {
      id: preset?.id ?? "default",
      label: "Standard",
      props: defaults,
      presetId: preset?.id,
    },
  ];
}

export function libraryStyleOptionCount(variants: ComponentVariant[]): number {
  return getLibraryStyleOptions(variants).length;
}

export function libraryStyleToQuery(
  option: LibraryStyleOption,
): Record<string, string | undefined> {
  const query: Record<string, string | undefined> = {};
  if (option.presetId) query.variant = option.presetId;
  for (const [key, value] of Object.entries(option.props)) {
    if (value) query[key] = value;
  }
  return query;
}

const DEFAULT_PROP_VALUES = DEFAULT_VARIANT_PROPS;

export function getDefaultProps(variants: ComponentVariant[]): Record<string, string> {
  const dimensions = extractDimensions(variants);
  if (dimensions.length > 0) {
    const props: Record<string, string> = {};
    for (const dim of dimensions) {
      const preferred = dim.options.find((opt) => opt.value === DEFAULT_PROP_VALUES[dim.key]);
      props[dim.key] = preferred?.value ?? dim.options[0]?.value ?? "";
    }
    return props;
  }

  const first = variants[0];
  return first?.props ? { ...first.props } : {};
}

export function findPresetByProps(
  variants: ComponentVariant[],
  props: Record<string, string>,
): ComponentVariant | undefined {
  const entries = Object.entries(props).filter(([, value]) => value);
  if (entries.length === 0) return undefined;

  return variants.find((variant) => {
    const vp = variant.props ?? {};
    const vKeys = Object.keys(vp);
    if (vKeys.length !== entries.length) return false;
    return entries.every(([key, value]) => vp[key] === value);
  });
}

export function findPresetById(
  variants: ComponentVariant[],
  variantId: string | undefined,
): ComponentVariant | undefined {
  if (!variantId) return undefined;
  return variants.find((variant) => variant.id === variantId);
}

export function propsFromVariantId(
  variants: ComponentVariant[],
  variantId: string | undefined,
): Record<string, string> {
  const preset = findPresetById(variants, variantId);
  if (preset?.props) return { ...preset.props };

  const defaults = getDefaultProps(variants);
  const dimensions = extractDimensions(variants);
  if (dimensions.length === 0) return defaults;

  for (const dim of dimensions) {
    const match = dim.options.find((opt) => opt.presetId === variantId);
    if (match) {
      return { ...defaults, [dim.key]: match.value };
    }
  }

  return defaults;
}

export function buildSelection(
  variants: ComponentVariant[],
  props: Record<string, string>,
): VariantSelection {
  const preset = findPresetByProps(variants, props);
  return {
    props: { ...props },
    presetId: preset?.id,
  };
}

export function selectionFromVariantId(
  variants: ComponentVariant[],
  variantId: string | undefined,
): VariantSelection {
  const props = propsFromVariantId(variants, variantId);
  return buildSelection(variants, props);
}

export function formatVariantLabel(props: Record<string, string>): string {
  const parts = Object.entries(props)
    .filter(([, value]) => value)
    .map(([key, value]) => {
      if (LIBRARY_TYPE_DIMENSION_KEYS.has(key)) {
        return capitalize(value.replace(/[-_]/g, " "));
      }
      if (key === "size") return capitalize(value);
      if (key === "tone") return capitalize(value);
      if (key === "density") return capitalize(value);
      if (key === "radius") return capitalize(value);
      if (key === "emphasis") return capitalize(value);
      return `${capitalize(key)}: ${value}`;
    });
  return parts.join(" · ") || "Default";
}

/** Cartesian product of all dimension options (capped). */
export function getDimensionCombinations(
  variants: ComponentVariant[],
  max = 12,
): Array<{ props: Record<string, string>; label: string; presetId?: string }> {
  const dimensions = extractDimensions(variants);
  if (dimensions.length === 0) {
    return variants.map((variant) => ({
      props: variant.props ?? {},
      label: variant.label,
      presetId: variant.id,
    }));
  }

  const combos: Array<{ props: Record<string, string>; label: string; presetId?: string }> = [];

  function walk(index: number, current: Record<string, string>) {
    if (combos.length >= max) return;
    if (index >= dimensions.length) {
      const preset = findPresetByProps(variants, current);
      combos.push({
        props: { ...current },
        label: formatVariantLabel(current),
        presetId: preset?.id,
      });
      return;
    }
    const dim = dimensions[index]!;
    for (const opt of dim.options) {
      walk(index + 1, { ...current, [dim.key]: opt.value });
      if (combos.length >= max) return;
    }
  }

  walk(0, {});
  return combos;
}

export function selectionToQuery(selection: VariantSelection): Record<string, string> {
  const query: Record<string, string> = {};
  if (selection.presetId) {
    query.variant = selection.presetId;
  }
  for (const [key, value] of Object.entries(selection.props)) {
    if (value) query[key] = value;
  }
  return query;
}

export function parseVariantQuery(
  variants: ComponentVariant[],
  query: Record<string, string | undefined>,
): VariantSelection {
  const dimensions = extractDimensions(variants);

  if (query.variant) {
    const fromPreset = selectionFromVariantId(variants, query.variant);
    const merged = { ...fromPreset.props };
    for (const dim of dimensions) {
      const override = query[dim.key];
      if (override) merged[dim.key] = override;
    }
    return buildSelection(variants, merged);
  }

  const defaults = getDefaultProps(variants);
  const props = { ...defaults };
  for (const dim of dimensions) {
    const value = query[dim.key];
    if (value && dim.options.some((opt) => opt.value === value)) {
      props[dim.key] = value;
    }
  }

  return buildSelection(variants, props);
}

export function getDefaultVariantId(variants: ComponentVariant[]): string | undefined {
  if (variants.length === 0) return undefined;
  const defaults = getDefaultProps(variants);
  const preset = findPresetByProps(variants, defaults);
  if (preset) return preset.id;

  const dimensions = extractDimensions(variants);
  for (const dim of dimensions) {
    const value = defaults[dim.key];
    const opt = dim.options.find((o) => o.value === value);
    if (opt?.presetId) return opt.presetId;
  }

  return variants[0]?.id;
}
