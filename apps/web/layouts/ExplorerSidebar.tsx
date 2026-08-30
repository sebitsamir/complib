"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";
import LibrarySearchInput from "@/components/library/LibrarySearchInput";
import {
  buildExplorerUrl,
  parseBrowseMode,
  type ExplorerBrowseMode,
  type ExplorerSearchParams,
} from "@/lib/explorer-url";
import { LAYER_ORDER, layerNavMeta } from "@/lib/library-nav-shared";
import type { LibraryNavLayer } from "@/lib/component-store";
import { useLibraryPersistence } from "@/lib/use-library-persistence";
import {
  ExplorerLayerIcon,
  IconClock,
  IconLightbulb,
  IconPackage,
  IconPalette,
  IconStar,
} from "@/components/explorer/explorer-icons";

type NavItemProps = {
  href?: string;
  onClick?: () => void;
  onNavigate?: () => void;
  active: boolean;
  icon: ReactNode;
  label: string;
  count?: number;
};

function NavItem({ href, onClick, onNavigate, active, icon, label, count }: NavItemProps) {
  const className = `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
    active
      ? "bg-accent/10 font-semibold text-foreground ring-1 ring-accent/20"
      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
  }`;

  const content = (
    <>
      <span className="flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground" aria-hidden>
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {typeof count === "number" ? (
        <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">{count}</span>
      ) : null}
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${className} w-full text-left`}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href!} className={className} onClick={onNavigate}>
      {content}
    </Link>
  );
}

type Props = {
  layers?: LibraryNavLayer[];
  params: ExplorerSearchParams;
  initialQuery?: string;
  onOpenCommandPalette?: () => void;
  /** Playground: local navigation without route changes (opens browse overlay). */
  onNavigate?: (overrides: Partial<ExplorerSearchParams>) => void;
  /** Playground: update filters without opening browse overlay. */
  onParamsChange?: (overrides: Partial<ExplorerSearchParams>) => void;
  /** Playground: open full browse overlay. */
  onBrowse?: () => void;
  /** Playground: Enter in search adds best match to canvas. */
  onQuickInsert?: (query: string) => void;
  /** Mobile drawer: called after a navigation action to close the sheet. */
  onNavSelect?: () => void;
  /** Render inside playground aside (no outer width/border). */
  embedded?: boolean;
  showBrowseButton?: boolean;
  showFullLibraryLink?: boolean;
};

export default function ExplorerSidebar({
  layers = [],
  params,
  initialQuery = "",
  onOpenCommandPalette,
  onNavigate,
  onParamsChange,
  onBrowse,
  onQuickInsert,
  onNavSelect,
  embedded = false,
  showBrowseButton = false,
  showFullLibraryLink = false,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { recentSlugs, favoriteSlugs } = useLibraryPersistence();

  const browse = parseBrowseMode(params.browse ?? undefined);
  const collection =
    params.collection === "recent" || params.collection === "favorites"
      ? params.collection
      : null;

  const pushParams = useCallback(
    (overrides: Partial<ExplorerSearchParams>) => {
      if (onNavigate) {
        onNavigate(overrides);
        onNavSelect?.();
        return;
      }
      startTransition(() => {
        router.push(buildExplorerUrl(searchParams, overrides));
        onNavSelect?.();
      });
    },
    [onNavigate, onNavSelect, router, searchParams],
  );

  const patchParams = useCallback(
    (overrides: Partial<ExplorerSearchParams>) => {
      if (onParamsChange) {
        onParamsChange(overrides);
        return;
      }
      pushParams(overrides);
    },
    [onParamsChange, pushParams],
  );

  const orderedLayers = useMemo(() => {
    const bySlug = new Map(layers.map((layer) => [layer.slug, layer]));
    return LAYER_ORDER.map((slug) => bySlug.get(slug)).filter(Boolean) as LibraryNavLayer[];
  }, [layers]);

  const layerCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const layer of orderedLayers) {
      counts.set(
        layer.slug,
        layer.categories.reduce((t, c) => t + c.components.length, 0),
      );
    }
    return counts;
  }, [orderedLayers]);

  const urlFor = useCallback(
    (overrides: Partial<ExplorerSearchParams>) =>
      onNavigate ? undefined : buildExplorerUrl(searchParams, overrides),
    [onNavigate, searchParams],
  );

  const afterNav = onNavSelect;

  const browseTabOverrides = (mode: ExplorerBrowseMode): Partial<ExplorerSearchParams> => ({
    browse: mode,
    layer: null,
    category: null,
    problem: null,
    style: null,
    pick: null,
    collection: null,
    q: null,
  });

  const isLayerActive = (slug: string) =>
    browse === "layer" && !collection && !params.q && params.layer === slug;

  const searchValue = onNavigate
    ? (params.q ?? initialQuery)
    : (searchParams.get("q") ?? initialQuery);

  const panelHint = onBrowse
    ? "Browse opens the component picker →"
    : "Browse in the main panel →";

  const shellClass = embedded
    ? "flex min-h-0 flex-1 flex-col overflow-hidden bg-background"
    : "flex h-full w-full shrink-0 flex-col border-r border-border bg-background lg:w-60";

  const Shell = embedded ? "div" : "aside";

  return (
    <Shell className={shellClass}>
      <div className="space-y-3 border-b border-border p-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Explorer
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">Navigation</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{panelHint}</p>
        </div>

        {showBrowseButton && onBrowse ? (
          <button
            type="button"
            onClick={onBrowse}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-3 py-2.5 text-xs font-semibold text-accent-foreground transition-colors hover:opacity-90"
          >
            Browse components
          </button>
        ) : null}

        <LibrarySearchInput
          value={searchValue}
          onChange={(next) => patchParams({ q: next.trim() || null })}
          onSubmit={onQuickInsert}
          placeholder={onQuickInsert ? "Search or quick insert…" : "Search components…"}
          debounceMs={280}
          inputClassName={isPending ? "opacity-70" : ""}
        />

        {onQuickInsert ? (
          <p className="text-[10px] text-muted-foreground">
            <span className="font-semibold text-foreground">Quick insert:</span> press Enter to add
            the best match
          </p>
        ) : null}

        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="flex w-full items-center justify-between rounded-lg border border-border/70 bg-muted/30 px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
        >
          <span>Quick jump</span>
          <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[9px]">
            ⌘K
          </kbd>
        </button>
      </div>

      <nav className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3" aria-label="Explorer navigation">
        <div className="space-y-0.5">
          <NavItem
            href={urlFor({
              collection: "favorites",
              layer: null,
              category: null,
              pick: null,
              style: null,
              problem: null,
              browse: "layer",
              q: null,
            })}
            onClick={
              onNavigate
                ? () =>
                    pushParams({
                      collection: "favorites",
                      layer: null,
                      category: null,
                      pick: null,
                      style: null,
                      problem: null,
                      browse: "layer",
                      q: null,
                    })
                : undefined
            }
            onNavigate={afterNav}
            active={collection === "favorites"}
            icon={<IconStar size={16} />}
            label="Favorites"
            count={favoriteSlugs.length}
          />
          <NavItem
            href={urlFor({
              collection: "recent",
              layer: null,
              category: null,
              pick: null,
              style: null,
              problem: null,
              browse: "layer",
              q: null,
            })}
            onClick={
              onNavigate
                ? () =>
                    pushParams({
                      collection: "recent",
                      layer: null,
                      category: null,
                      pick: null,
                      style: null,
                      problem: null,
                      browse: "layer",
                      q: null,
                    })
                : undefined
            }
            onNavigate={afterNav}
            active={collection === "recent"}
            icon={<IconClock size={16} />}
            label="Recent"
            count={recentSlugs.length}
          />
        </div>

        <div>
          <p className="mb-1.5 px-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Layers
          </p>
          <div className="space-y-0.5">
            <NavItem
              href={urlFor({
                browse: "layer",
                layer: null,
                category: null,
                pick: null,
                style: null,
                problem: null,
                collection: null,
                q: null,
              })}
              onClick={
                onNavigate
                  ? () =>
                      pushParams({
                        browse: "layer",
                        layer: null,
                        category: null,
                        pick: null,
                        style: null,
                        problem: null,
                        collection: null,
                        q: null,
                      })
                  : undefined
              }
              onNavigate={afterNav}
              active={browse === "layer" && !params.layer && !collection && !params.q}
              icon={<IconPackage size={16} />}
              label="All layers"
            />
            {orderedLayers.map((layer) => (
              <NavItem
                key={layer.slug}
                href={urlFor({
                  browse: "layer",
                  layer: layer.slug,
                  category: null,
                  pick: null,
                  style: null,
                  problem: null,
                  collection: null,
                  q: null,
                })}
                onClick={
                  onNavigate
                    ? () =>
                        pushParams({
                          browse: "layer",
                          layer: layer.slug,
                          category: null,
                          pick: null,
                          style: null,
                          problem: null,
                          collection: null,
                          q: null,
                        })
                    : undefined
                }
                onNavigate={afterNav}
                active={isLayerActive(layer.slug)}
                icon={<ExplorerLayerIcon layer={layer.slug} size={16} />}
                label={layerNavMeta(layer.slug).label}
                count={layerCounts.get(layer.slug)}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 px-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Browse by
          </p>
          <div className="space-y-0.5">
            <NavItem
              href={urlFor(browseTabOverrides("style"))}
              onClick={onNavigate ? () => pushParams(browseTabOverrides("style")) : undefined}
              onNavigate={afterNav}
              active={browse === "style" && !params.q}
              icon={<IconPalette size={16} />}
              label="Visual style"
            />
            <NavItem
              href={urlFor(browseTabOverrides("problem"))}
              onClick={onNavigate ? () => pushParams(browseTabOverrides("problem")) : undefined}
              onNavigate={afterNav}
              active={browse === "problem" && !params.q}
              icon={<IconLightbulb size={16} />}
              label="Use case"
            />
          </div>
        </div>
      </nav>

      {showFullLibraryLink ? (
        <div className="shrink-0 border-t border-border/50 p-3">
          <Link
            href="/components"
            className="block rounded-lg px-2.5 py-2 text-center text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          >
            Browse full library →
          </Link>
        </div>
      ) : null}
    </Shell>
  );
}
