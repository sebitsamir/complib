"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  buildExplorerStyleUrl,
  buildExplorerUrl,
  type ExplorerSearchParams,
} from "@/lib/explorer-url";
import {
  categoryLabelForLayer,
  LAYER_ORDER,
  layerNavMeta,
  problemLabel,
} from "@/lib/library-nav-shared";
import { buildStyleFamilies } from "@/lib/style-navigation";
import type { Component, LibraryNavLayer, ProblemNavGroup } from "@/lib/component-store";
import {
  getLibraryStyleOptions,
  libraryStyleToQuery,
  type LibraryStyleOption,
} from "@/lib/variant-utils";
import {
  ExplorerLayerIcon,
  IconLightbulb,
  IconPalette,
} from "@/components/explorer/explorer-icons";

type TileProps = {
  title: string;
  subtitle?: string;
  count?: number;
  href?: string;
  onClick?: () => void;
  accent?: string;
  icon?: ReactNode;
};

function ExplorerTile({ title, subtitle, count, href, onClick, accent, icon }: TileProps) {
  const className =
    "group flex flex-col rounded-xl border border-border/70 bg-card p-4 text-left shadow-sm transition-all hover:border-accent/35 hover:opacity-90/[0.03] hover:shadow-md";
  const body = (
    <div className="flex items-start gap-3">
      {icon ? (
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-foreground ${accent ?? "from-muted to-muted/50"}`}
        >
          {icon}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-foreground group-hover:text-accent">
          {title}
        </span>
        {subtitle ? (
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">{subtitle}</span>
        ) : null}
      </div>
      {typeof count === "number" ? (
        <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground">
          {count}
        </span>
      ) : null}
    </div>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {body}
      </button>
    );
  }

  return (
    <Link href={href ?? "#"} className={className}>
      {body}
    </Link>
  );
}

function PanelGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  );
}

type LayerTilesProps = {
  navLayers: LibraryNavLayer[];
  searchParams: URLSearchParams;
  onNavigate?: (overrides: Partial<ExplorerSearchParams>) => void;
};

export function ExplorerLayerTiles({
  navLayers,
  searchParams,
  onNavigate,
}: LayerTilesProps) {
  const bySlug = new Map(navLayers.map((layer) => [layer.slug, layer]));

  return (
    <PanelGrid>
      {LAYER_ORDER.filter((slug) => bySlug.has(slug)).map((slug) => {
        const layer = bySlug.get(slug)!;
        const meta = layerNavMeta(slug);
        const count = layer.categories.reduce((t, c) => t + c.components.length, 0);
        const overrides: Partial<ExplorerSearchParams> = {
          browse: "layer",
          layer: slug,
          category: null,
          pick: null,
          style: null,
          problem: null,
          collection: null,
          q: null,
        };
        return (
          <ExplorerTile
            key={slug}
            title={meta.label}
            subtitle="Browse categories"
            count={count}
            accent={meta.iconBg}
            icon={<ExplorerLayerIcon layer={slug} size={18} />}
            href={onNavigate ? undefined : buildExplorerUrl(searchParams, overrides)}
            onClick={onNavigate ? () => onNavigate(overrides) : undefined}
          />
        );
      })}
    </PanelGrid>
  );
}

type CategoryTilesProps = {
  layer: LibraryNavLayer;
  searchParams: URLSearchParams;
  onNavigate?: (overrides: Partial<ExplorerSearchParams>) => void;
};

export function ExplorerCategoryTiles({
  layer,
  searchParams,
  onNavigate,
}: CategoryTilesProps) {
  return (
    <PanelGrid>
      {layer.categories.map((category) => {
        const overrides: Partial<ExplorerSearchParams> = {
          browse: "layer",
          layer: layer.slug,
          category: category.slug,
          pick: null,
          style: null,
        };
        return (
          <ExplorerTile
            key={category.slug}
            title={category.name}
            subtitle={layerNavMeta(layer.slug).label}
            count={category.components.length}
            href={onNavigate ? undefined : buildExplorerUrl(searchParams, overrides)}
            onClick={onNavigate ? () => onNavigate(overrides) : undefined}
          />
        );
      })}
    </PanelGrid>
  );
}

type StyleFamilyTilesProps = {
  components: Component[];
  searchParams: URLSearchParams;
  onNavigate?: (overrides: Partial<ExplorerSearchParams>) => void;
};

export function ExplorerStyleFamilyTiles({
  components,
  searchParams,
  onNavigate,
}: StyleFamilyTilesProps) {
  const families = buildStyleFamilies(components);

  return (
    <PanelGrid>
      {families.map((family) => {
        const overrides: Partial<ExplorerSearchParams> = {
          browse: "style",
          style: family.slug,
          layer: null,
          category: null,
          pick: null,
          problem: null,
          collection: null,
          q: null,
        };
        return (
          <ExplorerTile
            key={family.slug}
            title={family.label}
            subtitle="Design language"
            count={family.count}
            accent="from-violet-500/25 to-violet-600/10"
            icon={<IconPalette size={18} className="text-violet-700 dark:text-violet-300" />}
            href={onNavigate ? undefined : buildExplorerUrl(searchParams, overrides)}
            onClick={onNavigate ? () => onNavigate(overrides) : undefined}
          />
        );
      })}
    </PanelGrid>
  );
}

type ProblemTilesProps = {
  problems: ProblemNavGroup[];
  searchParams: URLSearchParams;
  onNavigate?: (overrides: Partial<ExplorerSearchParams>) => void;
};

export function ExplorerProblemTiles({
  problems,
  searchParams,
  onNavigate,
}: ProblemTilesProps) {
  return (
    <PanelGrid>
      {problems.map((group) => {
        const overrides: Partial<ExplorerSearchParams> = {
          browse: "problem",
          problem: group.problem,
          layer: null,
          category: null,
          pick: null,
          style: null,
          collection: null,
          q: null,
        };
        return (
          <ExplorerTile
            key={group.problem}
            title={problemLabel(group.problem)}
            subtitle="Use case"
            count={group.components.length}
            accent="from-emerald-500/25 to-emerald-600/10"
            icon={<IconLightbulb size={18} className="text-emerald-700 dark:text-emerald-300" />}
            href={onNavigate ? undefined : buildExplorerUrl(searchParams, overrides)}
            onClick={onNavigate ? () => onNavigate(overrides) : undefined}
          />
        );
      })}
    </PanelGrid>
  );
}

type ComponentStyleTilesProps = {
  component: Component;
  searchParams: URLSearchParams;
  onNavigate?: (overrides: Partial<ExplorerSearchParams>) => void;
  onPickStyle?: (slug: string, style: LibraryStyleOption) => void;
};

export function ExplorerComponentStyleTiles({
  component,
  searchParams,
  onNavigate,
  onPickStyle,
}: ComponentStyleTilesProps) {
  const styles = getLibraryStyleOptions(component.variants ?? []);

  return (
    <PanelGrid>
      {styles.map((style) => (
        <ExplorerTile
          key={style.id}
          title={style.label}
          subtitle={onPickStyle ? "Add this style to canvas" : component.name}
          href={
            onPickStyle || onNavigate
              ? undefined
              : buildExplorerStyleUrl(searchParams, style.id)
          }
          onClick={
            onPickStyle
              ? () => onPickStyle(component.slug, style)
              : onNavigate
                ? () => onNavigate({ pick: component.slug, style: style.id })
                : undefined
          }
        />
      ))}
    </PanelGrid>
  );
}

type VariantTilesProps = {
  component: Component;
  styleId: string;
  framework: "vanilla" | "react" | "vue";
  canAccessSource: boolean;
  onPickStyle?: (slug: string, style: LibraryStyleOption) => void;
};

function buildVariantDetailHref(
  component: Component,
  style: LibraryStyleOption,
  framework: string,
): string {
  const query = new URLSearchParams({ framework });
  const styleQuery = libraryStyleToQuery(style);
  for (const [key, value] of Object.entries(styleQuery)) {
    if (value) query.set(key, value);
  }
  const qs = query.toString();
  return qs ? `/components/${component.slug}?${qs}` : `/components/${component.slug}`;
}

export function ExplorerVariantTiles({
  component,
  styleId,
  framework,
  onPickStyle,
}: VariantTilesProps) {
  const styles = getLibraryStyleOptions(component.variants ?? []);
  const selectedStyle = styles.find((s) => s.id === styleId) ?? styles[0];

  if (!selectedStyle) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No variants for this style.
      </p>
    );
  }

  const dimensions = Object.keys(selectedStyle.props);
  const variants =
    dimensions.length > 0
      ? [selectedStyle]
      : styles.filter((s) => s.id === styleId);

  return (
    <PanelGrid>
      {variants.map((style) =>
        onPickStyle ? (
          <button
            key={style.id}
            type="button"
            onClick={() => onPickStyle(component.slug, style)}
            className="group flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card text-left shadow-sm transition-all hover:border-accent/35 hover:shadow-md"
          >
            <div className="border-b border-border/60 px-4 py-3">
              <span className="text-sm font-semibold text-foreground group-hover:text-accent">
                {style.label}
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {categoryLabelForLayer(component.layer, component.category)}
              </span>
            </div>
            <div className="flex min-h-[120px] items-center justify-center bg-muted/20 p-4 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              Add to canvas →
            </div>
          </button>
        ) : (
          <Link
            key={style.id}
            href={buildVariantDetailHref(component, style, framework)}
            className="group flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm transition-all hover:border-accent/35 hover:shadow-md"
          >
            <div className="border-b border-border/60 px-4 py-3">
              <span className="text-sm font-semibold text-foreground group-hover:text-accent">
                {style.label}
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {categoryLabelForLayer(component.layer, component.category)}
              </span>
            </div>
            <div className="flex min-h-[120px] items-center justify-center bg-muted/20 p-4 text-xs text-muted-foreground">
              Open full preview & code →
            </div>
          </Link>
        ),
      )}
      {!onPickStyle ? (
        <Link
          href={buildVariantDetailHref(component, selectedStyle, framework)}
          className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 p-6 text-center transition-colors hover:border-accent/40 hover:opacity-90/[0.03]"
        >
          <span className="text-sm font-semibold text-foreground">View all variants</span>
          <span className="mt-1 text-xs text-muted-foreground">
            Live preview, code, and download
          </span>
        </Link>
      ) : null}
    </PanelGrid>
  );
}

export function ExplorerToolbarFilters({
  params,
  onTierChange,
  onFrameworkChange,
}: {
  params: ExplorerSearchParams;
  onTierChange: (tier: "all" | "FREE" | "PRO") => void;
  onFrameworkChange: (framework: "vanilla" | "react" | "vue") => void;
}) {
  const tier = params.tier === "FREE" || params.tier === "PRO" ? params.tier : "all";
  const framework = parseFrameworkParam(params.framework);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={framework}
        onChange={(e) =>
          onFrameworkChange(e.target.value as "vanilla" | "react" | "vue")
        }
        aria-label="Framework filter"
        className="h-9 rounded-lg border border-border/70 bg-background px-3 text-xs font-medium"
      >
        <option value="vanilla">Vanilla</option>
        <option value="react">React</option>
        <option value="vue">Vue</option>
      </select>
      <div className="flex gap-1 rounded-lg border border-border/70 bg-muted/20 p-0.5">
        {(["all", "FREE", "PRO"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onTierChange(value)}
            className={`rounded-md px-2.5 py-1 text-[10px] font-semibold transition-colors ${
              tier === value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {value === "all" ? "All" : value === "FREE" ? "Free" : "Pro"}
          </button>
        ))}
      </div>
    </div>
  );
}

function parseFrameworkParam(raw: ExplorerSearchParams["framework"]) {
  if (raw === "react" || raw === "vue") return raw;
  return "vanilla";
}
