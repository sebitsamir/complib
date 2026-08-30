"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ExplorerPreviewPanel from "@/components/explorer/ExplorerPreviewPanel";
import {
  ExplorerCategoryTiles,
  ExplorerComponentStyleTiles,
  ExplorerLayerTiles,
  ExplorerProblemTiles,
  ExplorerStyleFamilyTiles,
  ExplorerToolbarFilters,
  ExplorerVariantTiles,
} from "@/components/explorer/ExplorerBrowsePanels";
import ExplorerBreadcrumbs from "@/components/explorer/ExplorerBreadcrumbs";
import ExplorerDiscoveryHero from "@/components/explorer/ExplorerDiscoveryHero";
import ComponentsMainGrid from "@/components/library/ComponentsMainGrid";
import {
  buildExplorerPickUrl,
  buildExplorerUrl,
  levelShowsComponentGrid,
  parseBrowseMode,
  resolveExplorerLevel,
  type ExplorerSearchParams,
} from "@/lib/explorer-url";
import {
  categoryLabelForLayer,
  layerNavMeta,
  problemLabel,
} from "@/lib/library-nav-shared";
import { styleFamilyLabel } from "@/lib/style-navigation";
import type { Component, LibraryNavLayer, ProblemNavGroup } from "@/lib/component-store";
import { getLibraryStyleOptions, type LibraryStyleOption } from "@/lib/variant-utils";

type Framework = "vanilla" | "react" | "vue";

type Props = {
  navLayers: LibraryNavLayer[];
  problemGroups: ProblemNavGroup[];
  components: Component[];
  allComponents: Component[];
  params: ExplorerSearchParams;
  framework: Framework;
  canAccessSource: boolean;
  pickerMode?: boolean;
  onPick?: (slug: string, style: LibraryStyleOption) => void;
  onNavigate?: (overrides: Partial<ExplorerSearchParams>) => void;
};

function levelHint(
  level: ReturnType<typeof resolveExplorerLevel>,
  count: number,
): string {
  switch (level) {
    case "all":
      return "Choose a layer to browse categories and components.";
    case "layer-home":
      return "Pick a category to see components with live previews.";
    case "category-components":
      return `${count} components — click a card to explore styles and variants.`;
    case "component-styles":
      return "Choose a design style for this component.";
    case "style-variants":
      return "Pick a variant to open the full preview and code.";
    case "style-home":
      return "Browse by visual design language across the catalog.";
    case "style-components":
      return "Components matching this style family.";
    case "problem-home":
      return "Find components by the problem they solve.";
    case "problem-components":
      return "Components for this use case.";
    case "collection":
      return "Your saved favorites and recent components.";
    case "search":
      return `${count} matches across the catalog.`;
    default:
      return "";
  }
}

export default function ExplorerMainBrowser({
  navLayers,
  problemGroups,
  components,
  allComponents,
  params,
  framework,
  canAccessSource,
  pickerMode = false,
  onPick,
  onNavigate,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const browse = parseBrowseMode(params.browse ?? undefined);
  const level = resolveExplorerLevel({ ...params, browse });

  const pickedComponent = useMemo(() => {
    if (!params.pick) return null;
    return allComponents.find((c) => c.slug === params.pick) ?? null;
  }, [allComponents, params.pick]);

  const selectedLayer = useMemo(() => {
    if (!params.layer) return null;
    return navLayers.find((layer) => layer.slug === params.layer) ?? null;
  }, [navLayers, params.layer]);

  const navigate = (overrides: Partial<ExplorerSearchParams>) => {
    if (onNavigate) {
      onNavigate(overrides);
      return;
    }
    router.push(buildExplorerUrl(searchParams, overrides));
  };

  const title = useMemo(() => {
    if (params.q?.trim()) return "Search results";
    if (params.collection === "recent") return "Recent";
    if (params.collection === "favorites") return "Favorites";
    if (browse === "style" && params.style) return styleFamilyLabel(params.style);
    if (browse === "style") return "Visual styles";
    if (browse === "problem" && params.problem) return problemLabel(params.problem);
    if (browse === "problem") return "Use cases";
    if (params.pick && params.style && pickedComponent) {
      const styles = getLibraryStyleOptions(pickedComponent.variants ?? []);
      const styleLabel = styles.find((s) => s.id === params.style)?.label ?? params.style;
      return `${styleLabel} · ${pickedComponent.name}`;
    }
    if (params.pick && pickedComponent) return pickedComponent.name;
    if (params.category && params.layer) {
      return categoryLabelForLayer(params.layer, params.category);
    }
    if (params.layer) return layerNavMeta(params.layer).label;
    return "All layers";
  }, [browse, params, pickedComponent]);

  const showGrid = levelShowsComponentGrid(level);
  const collectionEmptyHint =
    params.collection === "recent"
      ? "Insert components in the playground or explorer to build your recent list."
      : params.collection === "favorites"
        ? "Star components on any card to save favorites."
        : undefined;

  const gridProps = {
    components,
    framework,
    canAccessSource,
    buildPickHref: pickerMode
      ? undefined
      : (component: Component) => buildExplorerPickUrl(searchParams, component),
    onPick: pickerMode ? onPick : undefined,
    emptyHint: collectionEmptyHint,
  };

  const mainContent = (() => {
    switch (level) {
      case "all":
        return (
          <>
            <ExplorerDiscoveryHero />
            <ExplorerLayerTiles
              navLayers={navLayers}
              searchParams={searchParams}
              onNavigate={onNavigate}
            />
          </>
        );
      case "layer-home":
        return selectedLayer ? (
          <ExplorerCategoryTiles
            layer={selectedLayer}
            searchParams={searchParams}
            onNavigate={onNavigate}
          />
        ) : (
          <ExplorerLayerTiles
            navLayers={navLayers}
            searchParams={searchParams}
            onNavigate={onNavigate}
          />
        );
      case "category-components":
        return <ComponentsMainGrid {...gridProps} />;
      case "component-styles":
        return pickedComponent ? (
          <ExplorerComponentStyleTiles
            component={pickedComponent}
            searchParams={searchParams}
            onNavigate={onNavigate}
            onPickStyle={pickerMode ? onPick : undefined}
          />
        ) : null;
      case "style-variants":
        return pickedComponent && params.style ? (
          <ExplorerVariantTiles
            component={pickedComponent}
            styleId={params.style}
            framework={framework}
            canAccessSource={canAccessSource}
            onPickStyle={pickerMode ? onPick : undefined}
          />
        ) : null;
      case "style-home":
        return (
          <ExplorerStyleFamilyTiles
            components={allComponents}
            searchParams={searchParams}
            onNavigate={onNavigate}
          />
        );
      case "style-components":
      case "problem-components":
      case "search":
      case "collection":
        return showGrid ? <ComponentsMainGrid {...gridProps} /> : null;
      case "problem-home":
        return (
          <ExplorerProblemTiles
            problems={problemGroups}
            searchParams={searchParams}
            onNavigate={onNavigate}
          />
        );
      default:
        return null;
    }
  })();

  const showPreview =
    !pickerMode &&
    pickedComponent &&
    (level === "component-styles" || level === "style-variants");

  return (
    <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden bg-muted/10">
      <div className="min-h-0 min-w-0 flex-1 overflow-auto">
        <div className="mx-auto max-w-[1600px] p-5 lg:p-8">
          <ExplorerBreadcrumbs
            params={{ ...params, browse }}
            pickedComponent={pickedComponent}
            onNavigate={onNavigate}
          />

          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                {pickerMode
                  ? "Browse layers and styles, then add a component to the canvas."
                  : levelHint(level, components.length)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {!pickerMode ? (
                <ExplorerToolbarFilters
                  params={params}
                  onTierChange={(tier) =>
                    navigate({ tier: tier === "all" ? null : tier })
                  }
                  onFrameworkChange={(fw) =>
                    navigate({ framework: fw === "vanilla" ? null : fw })
                  }
                />
              ) : null}
              <p className="text-xs text-muted-foreground">
                <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">
                  ⌘K
                </kbd>{" "}
                quick jump
              </p>
            </div>
          </div>

          {mainContent}

          {!pickerMode &&
          levelShowsComponentGrid(level) &&
          components.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg font-medium text-muted-foreground">No components found</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {collectionEmptyHint ??
                  "Try clearing filters or use search to find components."}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {showPreview && pickedComponent ? (
        <ExplorerPreviewPanel
          component={pickedComponent}
          params={params}
          styleSlug={params.style}
        />
      ) : null}
    </div>
  );
}
