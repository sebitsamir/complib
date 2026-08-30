"use client";

import type { ComponentVariant } from "@/lib/component-fs";
import {
  DENSITY_VARIANTS,
  EMPHASIS_VARIANTS,
  INSPECTOR_TONE_VARIANTS,
  RADIUS_VARIANTS,
  SIZE_VARIANTS,
} from "@/lib/design-tokens";
import { extractDimensions } from "@/lib/variant-utils";
import { adm } from "@/components/admin/admin-shell";

type VariantPack = {
  id: string;
  label: string;
  description: string;
  items: ComponentVariant[];
};

const PACKS: VariantPack[] = [
  {
    id: "size",
    label: "Scale",
    description: "XS → 2XL token sizing (data-size)",
    items: SIZE_VARIANTS,
  },
  {
    id: "tone",
    label: "Colors",
    description: "Brand palette (data-tone)",
    items: INSPECTOR_TONE_VARIANTS,
  },
  {
    id: "density",
    label: "Density",
    description: "Spacing rhythm (data-density)",
    items: DENSITY_VARIANTS,
  },
  {
    id: "radius",
    label: "Corners",
    description: "Border radius (data-radius)",
    items: RADIUS_VARIANTS,
  },
  {
    id: "emphasis",
    label: "Emphasis",
    description: "Shadow depth (data-emphasis)",
    items: EMPHASIS_VARIANTS,
  },
];

function packEnabled(variants: ComponentVariant[], pack: VariantPack): boolean {
  const ids = new Set(variants.map((v) => v.id));
  return pack.items.every((item) => ids.has(item.id));
}

function togglePack(variants: ComponentVariant[], pack: VariantPack): ComponentVariant[] {
  const enabled = packEnabled(variants, pack);
  if (enabled) {
    const removeIds = new Set(pack.items.map((v) => v.id));
    return variants.filter((v) => !removeIds.has(v.id));
  }
  const existing = new Set(variants.map((v) => v.id));
  const toAdd = pack.items.filter((v) => !existing.has(v.id));
  return [...variants, ...toAdd];
}

type Props = {
  variants: ComponentVariant[];
  onChange: (variants: ComponentVariant[]) => void;
};

export default function AdminVariantPacks({ variants, onChange }: Props) {
  const dimensions = extractDimensions(variants);

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2">
        {PACKS.map((pack) => {
          const on = packEnabled(variants, pack);
          return (
            <button
              key={pack.id}
              type="button"
              onClick={() => onChange(togglePack(variants, pack))}
              className={`${adm.packCard} ${on ? adm.packCardOn : adm.packCardOff}`}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-foreground">{pack.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                    on ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {on ? "On" : "Off"}
                </span>
              </span>
              <span className="mt-1 block text-left text-xs text-muted-foreground">
                {pack.description}
              </span>
              <span className="mt-2 block text-left font-mono text-[10px] text-muted-foreground/80">
                {pack.items.length} options
              </span>
            </button>
          );
        })}
      </div>

      {dimensions.length > 0 ? (
        <div className={adm.packSummary}>
          <p className="text-xs font-semibold text-foreground">Playground inspector will show</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {dimensions.map((d) => `${d.label} (${d.options.length})`).join(" · ")}
          </p>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Enable at least Scale or Colors so users can customize components in the playground.
        </p>
      )}
    </div>
  );
}
