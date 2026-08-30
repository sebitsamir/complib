"use client";

import { useCallback, useId, useRef } from "react";
import type { ComponentVariant } from "@/lib/component-fs";
import {
  extractDimensions,
  extractPresets,
  formatVariantLabel,
  getInspectorDimensions,
  hasDimensionalControls,
  TONE_SWATCHES,
  type VariantDimension,
  type VariantSelection,
} from "@/lib/variant-utils";
import { buildSelection } from "@/lib/variant-props";

type Props = {
  variants: ComponentVariant[];
  selection: VariantSelection;
  onChange: (selection: VariantSelection) => void;
  size?: "sm" | "md";
  className?: string;
  showPresets?: boolean;
  showHeader?: boolean;
  "aria-label"?: string;
  previewId?: string;
};

const SIZE_VISUAL: Record<string, { bars: number; height: string }> = {
  xs: { bars: 1, height: "h-1.5" },
  sm: { bars: 2, height: "h-2" },
  md: { bars: 3, height: "h-2.5" },
  lg: { bars: 4, height: "h-3" },
  xl: { bars: 5, height: "h-3.5" },
  "2xl": { bars: 6, height: "h-4" },
};

const DENSITY_VISUAL: Record<string, number> = {
  compact: 2,
  normal: 3,
  spacious: 4,
};

const RADIUS_VISUAL: Record<string, string> = {
  sharp: "rounded-sm",
  rounded: "rounded-md",
  soft: "rounded-lg",
  pill: "rounded-full",
};

const EMPHASIS_VISUAL: Record<string, string> = {
  subtle: "opacity-40",
  balanced: "opacity-70",
  bold: "opacity-100",
};

function SizeIcon({ value, active }: { value: string; active: boolean }) {
  const visual = SIZE_VISUAL[value] ?? { bars: 3, height: "h-2.5" };
  return (
    <span className="flex items-end gap-0.5" aria-hidden>
      {Array.from({ length: visual.bars }).map((_, i) => (
        <span
          key={i}
          className={`w-1 rounded-sm ${visual.height} ${
            active ? "bg-current" : "bg-current/50"
          }`}
          style={{ opacity: 0.5 + (i + 1) / (visual.bars * 2) }}
        />
      ))}
    </span>
  );
}

function DensityIcon({ value, active }: { value: string; active: boolean }) {
  const bars = DENSITY_VISUAL[value] ?? 3;
  return (
    <span className="flex flex-col gap-0.5" aria-hidden>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={`h-0.5 w-3 rounded-full ${active ? "bg-current" : "bg-current/40"}`}
        />
      ))}
    </span>
  );
}

function RadiusIcon({ value, active }: { value: string; active: boolean }) {
  const radius = RADIUS_VISUAL[value] ?? "rounded-md";
  return (
    <span
      className={`inline-block h-3 w-3 border-2 ${radius} ${
        active ? "border-current bg-current/20" : "border-current/50"
      }`}
      aria-hidden
    />
  );
}

function EmphasisIcon({ value, active }: { value: string; active: boolean }) {
  const opacity = EMPHASIS_VISUAL[value] ?? "opacity-70";
  return (
    <span
      className={`inline-block h-3 w-3 rounded-sm bg-current shadow-sm ${opacity} ${
        active ? "ring-1 ring-current" : ""
      }`}
      aria-hidden
    />
  );
}
function ToneSwatch({ value, active }: { value: string; active: boolean }) {
  const color = TONE_SWATCHES[value] ?? "#64748b";
  return (
    <span
      className={`inline-block h-3.5 w-3.5 shrink-0 rounded-full ring-2 ring-offset-1 ring-offset-background ${
        active ? "ring-blue-500" : "ring-transparent"
      }`}
      style={{ background: color }}
      aria-hidden
    />
  );
}

function DimensionRow({
  dimension,
  value,
  onSelect,
  size,
  groupId,
}: {
  dimension: VariantDimension;
  value: string;
  onSelect: (value: string) => void;
  size: "sm" | "md";
  groupId: string;
}) {
  const btnClass =
    size === "sm"
      ? "rounded-lg px-2 py-1 text-[10px] font-semibold transition-all"
      : "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all";

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    const options = dimension.options;
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (index + 1) % options.length;
      event.preventDefault();
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (index - 1 + options.length) % options.length;
      event.preventDefault();
    } else if (event.key === "Home") {
      next = 0;
      event.preventDefault();
    } else if (event.key === "End") {
      next = options.length - 1;
      event.preventDefault();
    } else {
      return;
    }
    const opt = options[next];
    if (opt) onSelect(opt.value);
  };

  const isToneGrid = dimension.kind === "tone" && dimension.options.length > 6;

  return (
    <div className={`space-y-1.5 ${isToneGrid ? "sm:col-span-2" : ""}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {dimension.label}
        {isToneGrid ? (
          <span className="ml-1 font-normal normal-case text-muted-foreground/80">
            ({dimension.options.length})
          </span>
        ) : null}
      </p>
      <div
        className={`flex flex-wrap gap-1 ${isToneGrid ? "gap-1.5" : ""}`}
        role="radiogroup"
        aria-label={dimension.label}
        id={groupId}
      >
        {dimension.options.map((option, index) => {
          const active = option.value === value;
          const toneOnly = isToneGrid;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={option.label}
              tabIndex={active ? 0 : -1}
              onClick={() => onSelect(option.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`${toneOnly ? "rounded-full p-1" : btnClass} inline-flex items-center gap-1.5 ${
                active
                  ? toneOnly
                    ? "ring-2 ring-blue-500 ring-offset-1 ring-offset-background"
                    : "bg-blue-600 text-white shadow-sm shadow-blue-900/25"
                  : toneOnly
                    ? "hover:ring-1 hover:ring-border"
                    : "border border-border bg-background text-muted-foreground hover:border-blue-500/30 hover:bg-muted hover:text-foreground"
              }`}
              title={option.label}
            >
              {dimension.kind === "size" ? (
                <SizeIcon value={option.value} active={active} />
              ) : null}
              {dimension.kind === "tone" ? (
                <ToneSwatch value={option.value} active={active} />
              ) : null}
              {dimension.kind === "density" ? (
                <DensityIcon value={option.value} active={active} />
              ) : null}
              {dimension.kind === "radius" ? (
                <RadiusIcon value={option.value} active={active} />
              ) : null}
              {dimension.kind === "emphasis" ? (
                <EmphasisIcon value={option.value} active={active} />
              ) : null}
              {toneOnly ? null : <span>{option.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function VariantControls({
  variants,
  selection,
  onChange,
  size = "md",
  className = "",
  showPresets = true,
  showHeader = true,
  "aria-label": ariaLabel = "Component variants",
  previewId,
}: Props) {
  const baseId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  const dimensions = getInspectorDimensions(variants);
  const presets = extractPresets(variants);
  const useDimensions = hasDimensionalControls(variants);

  const updateDimension = useCallback(
    (key: string, value: string) => {
      const nextProps = { ...selection.props, [key]: value };
      onChange(buildSelection(variants, nextProps));
    },
    [variants, selection.props, onChange],
  );

  const applyPreset = useCallback(
    (preset: ComponentVariant) => {
      onChange(buildSelection(variants, preset.props ?? {}));
    },
    [variants, onChange],
  );

  if (variants.length === 0) return null;

  if (!useDimensions) {
    const activeId = selection.presetId ?? variants[0]!.id;
    const btnClass =
      size === "sm"
        ? "rounded-md px-2 py-1 text-[10px] font-semibold transition-colors"
        : "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors";

    return (
      <div
        ref={containerRef}
        className={`flex flex-wrap gap-1 ${className}`}
        role="tablist"
        aria-label={ariaLabel}
        {...(previewId ? { "aria-controls": previewId } : {})}
      >
        {variants.map((variant) => {
          const active = variant.id === activeId;
          return (
            <button
              key={variant.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => applyPreset(variant)}
              className={`${btnClass} ${
                active
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-900/30"
                  : "border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {variant.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`space-y-3 rounded-xl border border-border/80 bg-muted/20 p-3 ${className}`}
      role="group"
      aria-label={ariaLabel}
      {...(previewId ? { "aria-controls": previewId } : {})}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        {showHeader ? (
          <p className="text-xs font-semibold text-foreground">Customize</p>
        ) : (
          <span className="sr-only">{ariaLabel}</span>
        )}
        <span className="rounded-md bg-background px-2 py-0.5 font-mono text-[10px] text-muted-foreground ring-1 ring-border">
          {formatVariantLabel(selection.props)}
        </span>
      </div>

      <div className={`grid gap-3 ${size === "sm" ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {dimensions.map((dim) => (
          <DimensionRow
            key={dim.key}
            dimension={dim}
            value={selection.props[dim.key] ?? dim.options[0]?.value ?? ""}
            onSelect={(value) => updateDimension(dim.key, value)}
            size={size}
            groupId={`${baseId}-${dim.key}`}
          />
        ))}
      </div>

      {showPresets && presets.length > 0 ? (
        <div className="border-t border-border/60 pt-2">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Presets
          </p>
          <div className="flex flex-wrap gap-1" role="listbox" aria-label="Named presets">
            {presets.map((preset) => {
              const active = selection.presetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => applyPreset(preset)}
                  className={`rounded-md px-2 py-1 text-[10px] font-semibold transition-colors ${
                    active
                      ? "bg-violet-600 text-white"
                      : "border border-border bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
