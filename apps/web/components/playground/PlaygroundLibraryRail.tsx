"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import ExplorerCommandPalette, {
  useExplorerCommandPalette,
} from "@/components/explorer/ExplorerCommandPalette";
import BuilderPalette from "@/components/playground/builder-palette";
import PlaygroundBrowseModal from "@/components/playground/PlaygroundBrowseModal";
import type { BuilderCatalogItem, PaletteDragPayload } from "@/components/playground/palette-types";
import { catalogItemsToExplorerComponents } from "@/lib/catalog-to-component";
import { getExplorerVisibleComponents, mergeExplorerParams } from "@/lib/explorer-visible";
import type { ExplorerSearchParams } from "@/lib/explorer-url";
import { buildNavLayersFromCatalog } from "@/lib/playground-catalog-nav";
import {
  getBuilderSidebarCollapsed,
  subscribeBuilderSidebarCollapsed,
} from "@/lib/library-persistence";
import { useLibraryPersistence } from "@/lib/use-library-persistence";
import type { LibraryStyleOption } from "@/lib/variant-utils";

type Props = {
  catalog: BuilderCatalogItem[] | null;
  catalogError?: string | null;
  onAdd: (slug: string, style: LibraryStyleOption) => void;
  onDragStart: (payload: PaletteDragPayload) => void;
  onDragEnd: () => void;
};

export default function PlaygroundLibraryRail({
  catalog,
  catalogError,
  onAdd,
  onDragStart,
  onDragEnd,
}: Props) {
  const { recentSlugs, favoriteSlugs } = useLibraryPersistence();
  const [params, setParams] = useState<ExplorerSearchParams>({
    browse: "layer",
    framework: "vanilla",
  });
  const [browseOpen, setBrowseOpen] = useState(false);
  const { open: paletteOpen, setOpen: setPaletteOpen } = useExplorerCommandPalette();
  const sidebarCollapsed = useSyncExternalStore(
    subscribeBuilderSidebarCollapsed,
    getBuilderSidebarCollapsed,
    () => false,
  );

  const navLayers = useMemo(() => buildNavLayersFromCatalog(catalog ?? []), [catalog]);
  const explorerComponents = useMemo(
    () => catalogItemsToExplorerComponents(catalog ?? []),
    [catalog],
  );

  const visibleComponents = useMemo(
    () =>
      getExplorerVisibleComponents(
        explorerComponents,
        explorerComponents,
        params,
        recentSlugs,
        favoriteSlugs,
      ),
    [explorerComponents, favoriteSlugs, params, recentSlugs],
  );

  const handlePick = useCallback(
    (slug: string, style: LibraryStyleOption) => {
      onAdd(slug, style);
      setBrowseOpen(false);
      setPaletteOpen(false);
    },
    [onAdd, setPaletteOpen],
  );

  const updateParams = useCallback((overrides: Partial<ExplorerSearchParams>) => {
    setParams((current) => mergeExplorerParams(current, overrides));
  }, []);

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <BuilderPalette
          catalog={catalog}
          catalogError={catalogError}
          onAdd={onAdd}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />

        {!sidebarCollapsed ? (
          <div className="flex shrink-0 items-center gap-1 border-t border-border/50 bg-background/90 px-2 py-1.5">
            <button
              type="button"
              onClick={() => setBrowseOpen(true)}
              className="min-w-0 flex-1 truncate rounded-md px-2 py-1.5 text-left text-[10px] font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              Browse all…
            </button>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="shrink-0 rounded-md border border-border/60 px-2 py-1.5 text-[10px] font-semibold text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              title="Quick pick (Ctrl+K)"
            >
              ⌘K
            </button>
          </div>
        ) : null}
      </div>

      <PlaygroundBrowseModal
        open={browseOpen}
        onClose={() => setBrowseOpen(false)}
        navLayers={navLayers}
        explorerComponents={explorerComponents}
        visibleComponents={visibleComponents}
        params={params}
        onNavigate={updateParams}
        onPick={handlePick}
        onOpenCommandPalette={() => setPaletteOpen(true)}
      />

      <ExplorerCommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        components={explorerComponents}
        params={params}
        pickerMode
        onPick={handlePick}
      />
    </>
  );
}
