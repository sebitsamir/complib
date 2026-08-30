"use client";

import type { ComponentVariant } from "@/lib/component-fs";
import PlaygroundLayoutPanel, {
  type LayoutValues,
} from "@/components/playground/playground-layout-panel";
import PlaygroundVariantPanel from "@/components/playground/playground-variant-panel";
import type { VariantSelection } from "@/lib/variant-utils";
import { formatVariantLabel } from "@/lib/variant-utils";
import { pg } from "@/components/playground/playground-shell";

type Props = {
  name: string;
  slug: string;
  tier?: "FREE" | "PRO" | "ENTERPRISE";
  layer?: string;
  category?: string;
  variants: ComponentVariant[];
  selection: VariantSelection;
  layout: LayoutValues;
  onChange: (selection: VariantSelection) => void;
  onLayoutChange: (patch: Partial<LayoutValues>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBringForward: () => void;
  onDeselect: () => void;
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function IconClose() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M3 3l8 8M11 3L3 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function PlaygroundInspector({
  name,
  slug,
  tier,
  layer,
  category,
  variants,
  selection,
  layout,
  onChange,
  onLayoutChange,
  onDuplicate,
  onDelete,
  onBringForward,
  onDeselect,
}: Props) {
  const variantLabel = formatVariantLabel(selection.props);
  const hasVariants = variants.length > 0;

  return (
    <aside className={pg.inspector}>
      <div className={pg.inspectorSheetHandle} aria-hidden />

      <div className={pg.inspectorTopBar}>
        <p className={pg.inspectorTopTitle}>Properties</p>
        <button
          type="button"
          onClick={onDeselect}
          className={pg.inspectorCloseBtn}
          aria-label="Close properties panel"
        >
          <IconClose />
        </button>
      </div>

      <div className={pg.inspectorHero}>
        <span className={pg.inspectorAvatar}>{initials(name)}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{name}</p>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
            {[layer, category].filter(Boolean).join(" · ")}
          </p>
        </div>
        {tier ? (
          <span
            className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
              tier === "FREE"
                ? "bg-muted text-muted-foreground"
                : "bg-amber-400/90 text-amber-950"
            }`}
          >
            {tier === "FREE" ? "Free" : "Pro"}
          </span>
        ) : null}
      </div>

      {hasVariants ? (
        <div className={pg.inspectorSummary}>
          <span className={pg.inspectorSummaryLabel}>Current style</span>
          <span className={pg.inspectorSummaryValue}>{variantLabel}</span>
        </div>
      ) : null}

      <div className={pg.inspectorScroll}>
        <PlaygroundLayoutPanel values={layout} onChange={onLayoutChange} />
        {hasVariants ? (
          <div className="mt-3">
            <PlaygroundVariantPanel
              variants={variants}
              selection={selection}
              onChange={onChange}
            />
          </div>
        ) : null}
      </div>

      <div className={pg.inspectorActions}>
        <button type="button" onClick={onDuplicate} className={pg.inspectorActionBtn}>
          Duplicate
        </button>
        <button type="button" onClick={onBringForward} className={pg.inspectorActionBtn}>
          Forward
        </button>
        <button type="button" onClick={onDelete} className={pg.inspectorActionBtnDanger}>
          Delete
        </button>
      </div>

      <p className={pg.inspectorFootnote}>
        <span className="font-mono">{slug}</span>
      </p>
    </aside>
  );
}
