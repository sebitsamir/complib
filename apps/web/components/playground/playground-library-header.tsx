"use client";

import { IconSearch } from "@/components/playground/playground-shell";
import { pg } from "@/components/playground/playground-shell";

export type LayerFilter = "all" | "primitives" | "patterns" | "sections" | "templates";

const LAYER_FILTERS: Array<{ value: LayerFilter; label: string; short: string }> = [
  { value: "all", label: "All", short: "All" },
  { value: "primitives", label: "Primitives", short: "Prim" },
  { value: "patterns", label: "Patterns", short: "Pat" },
  { value: "sections", label: "Sections", short: "Sec" },
  { value: "templates", label: "Templates", short: "Tpl" },
];

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  layerFilter: LayerFilter;
  onLayerFilterChange: (value: LayerFilter) => void;
  totalCount: number;
  compact?: boolean;
};

export default function PlaygroundLibraryHeader({
  query,
  onQueryChange,
  layerFilter,
  onLayerFilterChange,
  totalCount,
  compact = false,
}: Props) {
  return (
    <div className={pg.libraryHead}>
      <div className="flex items-center justify-between gap-2">
        <p className={pg.libraryHeadTitle}>Explorer</p>
        <span className={pg.libraryHeadCount}>
          {totalCount} {totalCount === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <IconSearch />
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search library…"
          className={`${pg.searchInput} ${pg.librarySearch}`}
          aria-label="Search components"
        />
      </div>

      <div className={pg.libraryFilterTrack} role="tablist" aria-label="Filter by layer">
        {LAYER_FILTERS.map((filter) => {
          const active = layerFilter === filter.value;
          return (
            <button
              key={filter.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onLayerFilterChange(filter.value)}
              className={`${pg.libraryFilterPill} ${
                active ? pg.libraryFilterPillActive : pg.libraryFilterPillIdle
              }`}
            >
              {compact && filter.value !== "all" ? filter.short : filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
