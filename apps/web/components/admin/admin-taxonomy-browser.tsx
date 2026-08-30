"use client";

import Link from "next/link";
import { buildAdminStudioUrl } from "@/lib/admin-form";
import { buildExplorerUrl } from "@/lib/explorer-url";
import { TAXONOMY_DEFAULTS } from "@/lib/taxonomy-defaults";
import type { ComponentLayer } from "@/lib/component-fs";

type CatalogItem = {
  slug: string;
  name: string;
  tier?: string;
  layer: string;
  category: string;
};

type Props = {
  catalog: CatalogItem[];
  layer: ComponentLayer | null;
  category: string | null;
  onEdit: (slug: string) => void;
  onCreate: (layer: ComponentLayer, categorySlug: string) => void;
};

function Tile({
  title,
  subtitle,
  count,
  href,
  onClick,
}: {
  title: string;
  subtitle?: string;
  count?: number;
  href?: string;
  onClick?: () => void;
}) {
  const className =
    "group flex flex-col rounded-xl border border-border/70 bg-card p-4 shadow-sm transition-all hover:border-blue-500/35 hover:bg-blue-500/[0.03] hover:shadow-md text-left w-full";

  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <span className="truncate text-sm font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {title}
        </span>
        {typeof count === "number" ? (
          <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground">
            {count}
          </span>
        ) : null}
      </div>
      {subtitle ? (
        <span className="mt-1 block truncate text-xs text-muted-foreground">{subtitle}</span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {inner}
    </button>
  );
}

const LAYER_ICONS: Record<string, string> = {
  primitives: "🧱",
  patterns: "🧩",
  sections: "🚀",
  templates: "📄",
};

export default function AdminTaxonomyBrowser({
  catalog,
  layer,
  category,
  onEdit,
  onCreate,
}: Props) {
  if (!layer) {
    return (
      <div className="min-h-0 flex-1 overflow-auto p-5 lg:p-8">
        <h1 className="text-2xl font-bold tracking-tight">Choose a layer</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Components are organized the same way as the public Explorer.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {TAXONOMY_DEFAULTS.map((entry) => {
            const count = catalog.filter((item) => item.layer === entry.id).length;
            return (
              <Tile
                key={entry.id}
                title={entry.label}
                subtitle="Browse categories"
                count={count}
                href={buildAdminStudioUrl({ layer: entry.id, view: "browse" })}
              />
            );
          })}
        </div>
      </div>
    );
  }

  const layerDef = TAXONOMY_DEFAULTS.find((entry) => entry.id === layer);

  if (!category) {
    return (
      <div className="min-h-0 flex-1 overflow-auto p-5 lg:p-8">
        <nav className="mb-4 text-sm text-muted-foreground">
          <Link href={buildAdminStudioUrl({ view: "browse" })} className="hover:text-foreground">
            Studio
          </Link>
          <span className="mx-1">/</span>
          <span className="font-semibold text-foreground">{layerDef?.label}</span>
        </nav>
        <h1 className="text-2xl font-bold tracking-tight">{layerDef?.label}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Pick a category to manage components.</p>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {layerDef?.categories.map((cat) => {
            const count = catalog.filter(
              (item) => item.layer === layer && item.category === cat.slug,
            ).length;
            return (
              <Tile
                key={cat.slug}
                title={cat.label}
                subtitle={layerDef.label}
                count={count}
                href={buildAdminStudioUrl({ layer, category: cat.slug, view: "browse" })}
              />
            );
          })}
        </div>
      </div>
    );
  }

  const categoryDef = layerDef?.categories.find((c) => c.slug === category);
  const items = catalog.filter((item) => item.layer === layer && item.category === category);

  return (
    <div className="min-h-0 flex-1 overflow-auto p-5 lg:p-8">
      <nav className="mb-4 text-sm text-muted-foreground">
        <Link href={buildAdminStudioUrl({ view: "browse" })} className="hover:text-foreground">
          Studio
        </Link>
        <span className="mx-1">/</span>
        <Link href={buildAdminStudioUrl({ layer, view: "browse" })} className="hover:text-foreground">
          {layerDef?.label}
        </Link>
        <span className="mx-1">/</span>
        <span className="font-semibold text-foreground">{categoryDef?.label}</span>
      </nav>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{categoryDef?.label}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} published · Explorer path: {layer} / {category}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onCreate(layer, category)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-500"
        >
          + New in {categoryDef?.label}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
        <button
          type="button"
          onClick={() => onCreate(layer, category)}
          className="flex min-h-[120px] flex-col items-center justify-center rounded-xl border border-dashed border-blue-500/40 bg-blue-500/[0.04] p-4 text-center transition hover:bg-blue-500/[0.08]"
        >
          <span className="text-2xl" aria-hidden>
            +
          </span>
          <span className="mt-2 text-sm font-semibold text-foreground">Create component</span>
          <span className="mt-1 text-xs text-muted-foreground">
            Starts from the {categoryDef?.label} template
          </span>
        </button>

        {items.map((item) => (
          <div
            key={item.slug}
            className="flex flex-col rounded-xl border border-border/70 bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{item.slug}</p>
              </div>
              {item.tier && item.tier !== "FREE" ? (
                <span className="shrink-0 rounded bg-amber-400/90 px-1.5 py-0.5 text-[9px] font-bold uppercase text-black">
                  {item.tier}
                </span>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onEdit(item.slug)}
                className="rounded-lg border border-border/70 px-3 py-1.5 text-xs font-semibold hover:bg-muted/60"
              >
                Edit
              </button>
              <Link
                href={buildExplorerUrl(
                  {},
                  {
                    browse: "layer",
                    layer: item.layer,
                    category: item.category,
                    pick: item.slug,
                  },
                )}
                className="rounded-lg border border-border/70 px-3 py-1.5 text-xs font-semibold hover:bg-muted/60"
                target="_blank"
                rel="noreferrer"
              >
                View in Explorer
              </Link>
              <Link
                href={`/components/${item.slug}`}
                className="rounded-lg border border-border/70 px-3 py-1.5 text-xs font-semibold hover:bg-muted/60"
                target="_blank"
                rel="noreferrer"
              >
                Public page
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
