"use client";

import { useId, useMemo, useState } from "react";
import type { ComponentVariant } from "@/lib/component-fs";
import { buildSelection } from "@/lib/variant-props";
import {
  formatVariantLabel,
  getInspectorDimensions,
  getLibraryStyleOptions,
  hasDimensionalControls,
  type LibraryStyleOption,
  type VariantSelection,
} from "@/lib/variant-utils";

type Props = {
  variants: ComponentVariant[];
  selection: VariantSelection;
  onChange: (selection: VariantSelection) => void;
};

function styleOptionMatchesSelection(
  option: LibraryStyleOption,
  selection: VariantSelection,
): boolean {
  if (option.presetId && selection.presetId) {
    return option.presetId === selection.presetId;
  }
  const optionEntries = Object.entries(option.props).filter(([, value]) => value);
  if (optionEntries.length === 0) return Object.keys(selection.props).length === 0;
  return optionEntries.every(([key, value]) => selection.props[key] === value);
}

export function libraryCardHasVariantPicker(variants: ComponentVariant[]): boolean {
  if (variants.length === 0) return false;
  return getLibraryStyleOptions(variants).length > 1 || hasDimensionalControls(variants);
}

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className={`shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LibraryCardVariantPicker({
  variants,
  selection,
  onChange,
}: Props) {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const styleOptions = useMemo(() => getLibraryStyleOptions(variants), [variants]);
  const dimensions = useMemo(() => getInspectorDimensions(variants), [variants]);
  const useDimensional = hasDimensionalControls(variants);
  const useStyleChips = styleOptions.length > 1 && !useDimensional;

  if (!libraryCardHasVariantPicker(variants)) return null;

  const currentLabel = formatVariantLabel(selection.props);

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-2 rounded-lg border border-border/70 bg-muted/30 px-2.5 py-1.5 text-left transition-colors hover:bg-muted/50"
      >
        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Variants
        </span>
        <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-foreground">
          {currentLabel}
        </span>
        <IconChevron open={open} />
      </button>

      {open ? (
        <div
          id={panelId}
          className="mt-1.5 rounded-lg border border-border/70 bg-background p-2.5 shadow-sm"
          role="group"
          aria-label="Variant options"
        >
          {useStyleChips ? (
            <div className="flex flex-wrap gap-1.5" role="listbox" aria-label="Styles">
              {styleOptions.map((option) => {
                const active = styleOptionMatchesSelection(option, selection);
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => onChange(buildSelection(variants, option.props))}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      active
                        ? "bg-blue-600 text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {dimensions.map((dim) => (
                <label key={dim.key} className="flex flex-col gap-1">
                  <span className="text-[10px] font-medium text-muted-foreground">{dim.label}</span>
                  <select
                    value={selection.props[dim.key] ?? dim.options[0]?.value ?? ""}
                    onChange={(event) =>
                      onChange(
                        buildSelection(variants, {
                          ...selection.props,
                          [dim.key]: event.target.value,
                        }),
                      )
                    }
                    className="w-full rounded-md border border-border bg-background px-2 py-1 text-[11px] text-foreground outline-none focus:ring-2 focus:ring-blue-500/30"
                  >
                    {dim.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
