"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import LibraryCategoryChips from "@/components/library/LibraryCategoryChips";
import LibraryLayerRail, { type LayerRailSection } from "@/components/library/LibraryLayerRail";
import LibrarySearchInput from "@/components/library/LibrarySearchInput";
import PaletteItemCard from "@/components/playground/palette-item-card";
import type { BuilderCatalogItem, PaletteDragPayload } from "@/components/playground/palette-types";
import { pg } from "@/components/playground/playground-shell";
import {
  MAX_PALETTE_SEARCH_RESULTS,
  searchCatalogRanked,
} from "@/lib/library-catalog-search";
import {
  categoryLabelForLayer,
  LAYER_ORDER,
  layerNavMeta,
} from "@/lib/library-nav-shared";
import { pickBestQuickInsertMatch } from "@/lib/library-quick-insert";
import {
  getBuilderSidebarCollapsed,
  setBuilderSidebarCollapsed,
  subscribeBuilderSidebarCollapsed,
} from "@/lib/library-persistence";
import { useLibraryPersistence } from "@/lib/use-library-persistence";
import { getLibraryStyleOptions, type LibraryStyleOption } from "@/lib/variant-utils";

export type { BuilderCatalogItem, PaletteDragPayload } from "@/components/playground/palette-types";

type NavSection = "recent" | "favorites" | (typeof LAYER_ORDER)[number];

type Props = {
  catalog: BuilderCatalogItem[] | null;
  catalogError?: string | null;
  compact?: boolean;
  onAdd: (slug: string, style: LibraryStyleOption) => void;
  onDragStart: (payload: PaletteDragPayload) => void;
  onDragEnd: () => void;
};

function IconPanelLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" />
    </svg>
  );
}

function useCollapsedSnapshot() {
  return useSyncExternalStore(
    subscribeBuilderSidebarCollapsed,
    getBuilderSidebarCollapsed,
    () => false,
  );
}

export default function BuilderPalette({
  catalog,
  catalogError,
  onAdd,
  onDragStart,
  onDragEnd,
}: Props) {
  const { recentSlugs, favoriteSlugs, favoriteSlugSet } = useLibraryPersistence();
  const collapsed = useCollapsedSnapshot();

  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [navSection, setNavSection] = useState<NavSection>("primitives");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const catalogBySlug = useMemo(() => {
    const map = new Map<string, BuilderCatalogItem>();
    for (const item of catalog ?? []) map.set(item.slug, item);
    return map;
  }, [catalog]);

  const searchActive = deferredQuery.trim().length > 0;

  const searchResultMeta = useMemo(() => {
    if (!catalog || !searchActive) return { items: [], truncated: false };
    const { items, total } = searchCatalogRanked(catalog, deferredQuery);
    return { items, truncated: total > MAX_PALETTE_SEARCH_RESULTS };
  }, [catalog, deferredQuery, searchActive]);

  const searchResults = searchResultMeta.items;
  const searchResultsTruncated = searchResultMeta.truncated;

  const layerCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of catalog ?? []) {
      counts.set(item.layer, (counts.get(item.layer) ?? 0) + 1);
    }
    return counts;
  }, [catalog]);

  const categoriesForLayer = useMemo(() => {
    if (navSection === "recent" || navSection === "favorites" || searchActive) return [];
    const categories = new Map<string, number>();
    for (const item of catalog ?? []) {
      if (item.layer !== navSection) continue;
      categories.set(item.category, (categories.get(item.category) ?? 0) + 1);
    }
    return Array.from(categories.entries())
      .map(([slug, count]) => ({
        slug,
        label: categoryLabelForLayer(navSection, slug),
        count,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [catalog, navSection, searchActive]);

  const visibleItems = useMemo(() => {
    if (!catalog) return [];

    if (searchActive) {
      return searchResults;
    }

    if (navSection === "recent") {
      return recentSlugs
        .map((slug) => catalogBySlug.get(slug))
        .filter((item): item is BuilderCatalogItem => !!item);
    }

    if (navSection === "favorites") {
      return favoriteSlugs
        .map((slug) => catalogBySlug.get(slug))
        .filter((item): item is BuilderCatalogItem => !!item);
    }

    return catalog.filter((item) => {
      if (item.layer !== navSection) return false;
      if (categoryFilter && item.category !== categoryFilter) return false;
      return true;
    });
  }, [
    catalog,
    catalogBySlug,
    categoryFilter,
    favoriteSlugs,
    navSection,
    recentSlugs,
    searchActive,
    searchResults,
  ]);

  const styleOptionsBySlug = useMemo(() => {
    const map = new Map<string, LibraryStyleOption[]>();
    for (const item of visibleItems) {
      map.set(item.slug, getLibraryStyleOptions(item.variants ?? []));
    }
    return map;
  }, [visibleItems]);

  const showCategoryChips =
    !searchActive &&
    navSection !== "recent" &&
    navSection !== "favorites" &&
    categoriesForLayer.length > 0;

  const isSearchPending = query !== deferredQuery;

  const layerRailSections = useMemo((): LayerRailSection[] => {
    const sections: LayerRailSection[] = [
      {
        id: "recent",
        label: "Recent",
        count: recentSlugs.length,
        icon: "recent",
      },
      {
        id: "favorites",
        label: "Favorites",
        count: favoriteSlugs.length,
        icon: "favorites",
      },
    ];
    for (const layer of LAYER_ORDER) {
      const count = layerCounts.get(layer) ?? 0;
      // Hide empty taxonomy layers so the rail stays focused on what exists.
      if (count === 0) continue;
      const meta = layerNavMeta(layer);
      sections.push({
        id: layer,
        label: meta.label,
        count,
        icon: meta.icon,
        accent: meta.accent,
      });
    }
    return sections;
  }, [favoriteSlugs.length, layerCounts, recentSlugs.length]);

  // If catalog only has primitives (etc.), keep selection on a visible layer.
  useEffect(() => {
    if (navSection === "recent" || navSection === "favorites") return;
    const count = layerCounts.get(navSection) ?? 0;
    if (count > 0) return;
    const fallback = LAYER_ORDER.find((layer) => (layerCounts.get(layer) ?? 0) > 0);
    if (fallback && fallback !== navSection) setNavSection(fallback);
  }, [layerCounts, navSection]);

  const activeRailId = searchActive ? "" : navSection;

  const handleQuickInsert = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed || !catalog) return;

      const match =
        pickBestQuickInsertMatch(searchActive ? searchResults : catalog, trimmed) ??
        pickBestQuickInsertMatch(catalog, trimmed);
      if (!match) return;

      const styles = getLibraryStyleOptions(match.variants ?? []);
      const primaryStyle = styles[0];
      if (!primaryStyle) return;

      onAdd(match.slug, primaryStyle);
      setQuery("");
      setExpandedSlug(null);
    },
    [catalog, onAdd, searchActive, searchResults],
  );

  const toggleCollapsed = useCallback(() => {
    setBuilderSidebarCollapsed(!collapsed);
  }, [collapsed]);

  const selectNav = useCallback(
    (section: string) => {
      if (collapsed) setBuilderSidebarCollapsed(false);
      setNavSection(section as NavSection);
      setCategoryFilter(null);
      setExpandedSlug(null);
    },
    [collapsed],
  );

  const handleCategoryChange = useCallback((slug: string | null) => {
    setCategoryFilter((current) => (slug === current ? null : slug));
  }, []);

  const handleToggleExpand = useCallback((slug: string | null) => {
    setExpandedSlug(slug);
  }, []);

  const chipClasses = {
    chip: pg.categoryChip,
    chipActive: pg.categoryChipActive,
    chipIdle: pg.categoryChipIdle,
    track: pg.libraryFilterTrack,
  };

  const renderItemsPanel = () => (
    <div className="flex min-h-0 flex-col overflow-hidden">
      {searchActive ? (
        <div className="shrink-0 border-b border-border/50 px-2 py-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Search results
            {searchResultsTruncated
              ? ` · top ${MAX_PALETTE_SEARCH_RESULTS}`
              : null}
          </p>
        </div>
      ) : null}

      {showCategoryChips ? (
        <LibraryCategoryChips
          variant="button"
          categories={categoriesForLayer}
          activeSlug={categoryFilter}
          onChange={handleCategoryChange}
          chipClasses={chipClasses}
        />
      ) : null}

      {catalogError ? (
        <p className="px-3 py-2 text-xs text-red-600 dark:text-red-300">{catalogError}</p>
      ) : null}

      <div className={pg.sidebarScroll}>
        {!catalog ? (
          <div className="space-y-2 px-1">
            {[1, 2, 3, 4, 5, 6].map((key) => (
              <div key={key} className={pg.librarySkeleton} />
            ))}
          </div>
        ) : visibleItems.length === 0 ? (
          <div className={pg.emptyState}>
            <p className="text-sm font-medium text-foreground">No matches</p>
            <p className="mt-1 text-xs">
              {searchActive
                ? "Try another term or press Enter after typing a component name."
                : "Try another search term or pick a different category."}
            </p>
          </div>
        ) : (
          <div
            className={`space-y-1.5 pb-1 transition-opacity ${isSearchPending ? "opacity-70" : ""}`}
          >
            {visibleItems.map((item) => (
              <PaletteItemCard
                key={item.slug}
                item={item}
                styles={styleOptionsBySlug.get(item.slug) ?? []}
                expanded={expandedSlug === item.slug}
                isFavorite={favoriteSlugSet.has(item.slug)}
                onAdd={onAdd}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onToggleExpand={handleToggleExpand}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className={`${pg.libraryHead} flex items-start justify-between gap-2`}>
        <div className="min-w-0 flex-1 space-y-3">
          {!collapsed ? (
            <>
              <div className="flex items-center justify-between gap-2">
                <p className={pg.libraryHeadTitle}>Insert</p>
                <span className={pg.libraryHeadCount}>
                  {visibleItems.length} {visibleItems.length === 1 ? "item" : "items"}
                </span>
              </div>
              <LibrarySearchInput
                value={query}
                onChange={setQuery}
                onSubmit={handleQuickInsert}
                placeholder="Search or quick insert…"
                inputClassName={pg.librarySearch}
              />
              {searchActive ? (
                <p className="text-[10px] text-muted-foreground">
                  <span className="font-semibold text-foreground">Quick insert:</span> press Enter
                  to add the best match
                </p>
              ) : null}
            </>
          ) : null}
        </div>
        <button
          type="button"
          onClick={toggleCollapsed}
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={collapsed ? "Expand library panel" : "Collapse library panel"}
          title={collapsed ? "Expand" : "Collapse"}
        >
          <IconPanelLeft />
        </button>
      </div>

      {collapsed ? (
        <LibraryLayerRail
          variant="button"
          sections={layerRailSections}
          activeId={activeRailId}
          onSelect={selectNav}
          collapsed
          dividerAfterIds={["favorites"]}
          className="flex-1 border-r-0"
          aria-label="Library rail"
        />
      ) : (
        <div className="grid min-h-0 flex-1 grid-cols-[5rem_minmax(0,1fr)]">
          <LibraryLayerRail
            variant="button"
            sections={layerRailSections}
            activeId={activeRailId}
            onSelect={selectNav}
            dividerAfterIds={["favorites"]}
            aria-label="Library navigation"
          />
          {renderItemsPanel()}
        </div>
      )}
    </div>
  );
}
