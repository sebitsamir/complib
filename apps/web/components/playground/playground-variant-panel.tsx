"use client";

import type { ComponentVariant } from "@/lib/component-fs";
import {
  getInspectorDimensions,
  extractPresets,
  TONE_SWATCHES,
  type VariantDimension,
  type VariantSelection,
} from "@/lib/variant-utils";
import { INSPECTOR_TONE_LABELS } from "@/lib/design-tokens";
import { buildSelection } from "@/lib/variant-props";
import { pg } from "@/components/playground/playground-shell";

const SIZE_LABELS: Record<string, string> = {
  xs: "XS",
  sm: "S",
  md: "M",
  lg: "L",
  xl: "XL",
  "2xl": "2XL",
};

function InspectorDimension({
  dimension,
  value,
  onSelect,
}: {
  dimension: VariantDimension;
  value: string;
  onSelect: (value: string) => void;
}) {
  if (dimension.kind === "tone") {
    return (
      <section className={pg.inspectorSection}>
        <p className={pg.inspectorSectionLabel}>{dimension.label}</p>
        <div className="grid grid-cols-4 gap-1.5">
          {dimension.options.map((opt) => {
            const active = opt.value === value;
            const color = TONE_SWATCHES[opt.value] ?? "#64748b";
            return (
              <button
                key={opt.value}
                type="button"
                title={opt.label}
                aria-label={opt.label}
                aria-pressed={active}
                onClick={() => onSelect(opt.value)}
                className={`group flex flex-col items-center gap-1 rounded-lg p-1 transition-all ${
                  active
                    ? "bg-blue-500/10 ring-2 ring-blue-500/50"
                    : "hover:bg-background/80"
                }`}
              >
                <span
                  className="h-5 w-5 rounded-full shadow-sm ring-1 ring-black/10"
                  style={{ background: color }}
                />
                <span className="max-w-full truncate text-[8px] font-medium text-muted-foreground group-hover:text-foreground">
                  {INSPECTOR_TONE_LABELS[opt.value as keyof typeof INSPECTOR_TONE_LABELS] ?? opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  if (dimension.kind === "size") {
    return (
      <section className={pg.inspectorSection}>
        <p className={pg.inspectorSectionLabel}>{dimension.label}</p>
        <div className="grid grid-cols-6 gap-1">
          {dimension.options.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                aria-pressed={active}
                onClick={() => onSelect(opt.value)}
                className={`rounded-md py-1.5 text-center text-[9px] font-bold transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-background/80 text-muted-foreground hover:bg-background hover:text-foreground"
                }`}
              >
                {SIZE_LABELS[opt.value] ?? opt.label}
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section className={pg.inspectorSection}>
      <p className={pg.inspectorSectionLabel}>{dimension.label}</p>
      <div className="flex flex-wrap gap-1">
        {dimension.options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(opt.value)}
              className={`rounded-md px-2 py-1 text-[10px] font-semibold transition-all ${
                active
                  ? "bg-blue-600 text-white"
                  : "border border-border/60 bg-background/80 text-muted-foreground hover:border-blue-500/30 hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

type Props = {
  variants: ComponentVariant[];
  selection: VariantSelection;
  onChange: (selection: VariantSelection) => void;
};

export default function PlaygroundVariantPanel({ variants, selection, onChange }: Props) {
  const dimensions = getInspectorDimensions(variants);
  const presets = extractPresets(variants);

  if (variants.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border/60 bg-muted/20 px-3 py-6 text-center text-xs text-muted-foreground">
        This component has no style variants.
      </p>
    );
  }

  if (dimensions.length === 0) {
    return (
      <div className="space-y-2">
        <p className={pg.inspectorSectionLabel}>Presets</p>
        <div className="flex flex-wrap gap-1">
          {variants.map((variant) => {
            const active = selection.presetId === variant.id;
            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => onChange(buildSelection(variants, variant.props ?? {}))}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-blue-600 text-white"
                    : "border border-border/70 bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {variant.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const updateDimension = (key: string, value: string) => {
    onChange(buildSelection(variants, { ...selection.props, [key]: value }));
  };

  return (
    <div className="space-y-2.5">
      {presets.length > 0 ? (
        <section className={pg.inspectorSection}>
          <p className={pg.inspectorSectionLabel}>Presets</p>
          <div className="flex flex-wrap gap-1">
            {presets.map((variant) => {
              const active = selection.presetId === variant.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => onChange(buildSelection(variants, variant.props ?? {}))}
                  className={`rounded-md px-2 py-1 text-[10px] font-semibold transition-all ${
                    active
                      ? "bg-blue-600 text-white"
                      : "border border-border/60 bg-background/80 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {variant.label}
                </button>
              );
            })}
          </div>
        </section>
      ) : null}
      {dimensions.map((dim) => (
        <InspectorDimension
          key={dim.key}
          dimension={dim}
          value={selection.props[dim.key] ?? dim.options[0]?.value ?? ""}
          onSelect={(value) => updateDimension(dim.key, value)}
        />
      ))}
    </div>
  );
}
