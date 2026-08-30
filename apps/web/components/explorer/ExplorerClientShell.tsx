"use client";

import { useMemo, useState } from "react";
import ExplorerCommandPalette, {
  useExplorerCommandPalette,
} from "@/components/explorer/ExplorerCommandPalette";
import ExplorerMainBrowser from "@/components/explorer/ExplorerMainBrowser";
import ExplorerSidebar from "@/layouts/ExplorerSidebar";
import MobileDrawer from "@/components/layout/mobile-drawer";
import type { Component, LibraryNavLayer, ProblemNavGroup } from "@/lib/component-store";
import {
  parseBrowseMode,
  parseFramework,
  type ExplorerSearchParams,
} from "@/lib/explorer-url";
import { getExplorerVisibleComponents } from "@/lib/explorer-visible";
import { useLibraryPersistence } from "@/lib/use-library-persistence";
import { useCatalogSearchSlugs } from "@/lib/use-catalog-search";

type Framework = "vanilla" | "react" | "vue";

type Props = {
  navLayers: LibraryNavLayer[];
  problemGroups: ProblemNavGroup[];
  components: Component[];
  allComponents: Component[];
  searchParams: ExplorerSearchParams;
  framework: Framework;
  canAccessSource: boolean;
};

export default function ExplorerClientShell({
  navLayers,
  problemGroups,
  components,
  allComponents,
  searchParams,
  framework,
  canAccessSource,
}: Props) {
  const { open, setOpen } = useExplorerCommandPalette();
  const [navOpen, setNavOpen] = useState(false);
  const params = useMemo<ExplorerSearchParams>(
    () => ({
      ...searchParams,
      browse: parseBrowseMode(searchParams.browse ?? undefined),
      framework: parseFramework(searchParams.framework ?? undefined),
    }),
    [searchParams],
  );
  const { recentSlugs, favoriteSlugs } = useLibraryPersistence();
  const catalogSearchSlugs = useCatalogSearchSlugs(params.q, {
    layer: params.layer,
    category: params.category,
    style: params.style,
    tier: params.tier,
    problem: params.problem,
  });

  const visibleComponents = useMemo(
    () =>
      getExplorerVisibleComponents(
        allComponents,
        components,
        params,
        recentSlugs,
        favoriteSlugs,
        catalogSearchSlugs,
      ),
    [allComponents, catalogSearchSlugs, components, favoriteSlugs, params, recentSlugs],
  );

  const sidebar = (
    <ExplorerSidebar
      layers={navLayers}
      params={params}
      onOpenCommandPalette={() => {
        setNavOpen(false);
        setOpen(true);
      }}
      onNavSelect={() => setNavOpen(false)}
    />
  );

  return (
    <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
      <div className="hidden h-full shrink-0 lg:flex">{sidebar}</div>

      <MobileDrawer open={navOpen} onClose={() => setNavOpen(false)} title="Explorer">
        {sidebar}
      </MobileDrawer>

      <ExplorerMainBrowser
        navLayers={navLayers}
        problemGroups={problemGroups}
        components={visibleComponents}
        allComponents={allComponents}
        params={params}
        framework={framework}
        canAccessSource={canAccessSource}
        onOpenNav={() => setNavOpen(true)}
      />
      <ExplorerCommandPalette
        open={open}
        onClose={() => setOpen(false)}
        components={allComponents}
        params={params}
      />
    </div>
  );
}
