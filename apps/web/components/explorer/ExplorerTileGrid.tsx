"use client";

import Link from "next/link";
import ComponentThumbnail from "@/components/library/ComponentThumbnail";
import { layerNavMeta, thumbnailDensityForLayer } from "@/lib/library-nav-shared";

export type ExplorerTile = {
  id: string;
  label: string;
  subtitle?: string;
  count?: number;
  href?: string;
  onClick?: () => void;
  layer?: string;
  slug?: string;
  accent?: string;
};

type Props = {
  tiles: ExplorerTile[];
  columns?: "auto" | 2 | 3 | 4;
  density?: "compact" | "comfortable";
};

export default function ExplorerTileGrid({
  tiles,
  columns = "auto",
  density = "comfortable",
}: Props) {
  const gridClass =
    columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : columns === 3
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : columns === 4
          ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

  const pad = density === "compact" ? "p-3" : "p-4";

  return (
    <ul className={`grid gap-3 ${gridClass}`}>
      {tiles.map((tile) => {
        const inner = (
          <>
            {tile.slug && tile.layer ? (
              <div className="mb-3 overflow-hidden rounded-lg border border-border/50 bg-muted/20">
                <ComponentThumbnail
                  slug={tile.slug}
                  name={tile.label}
                  layer={tile.layer}
                  density={thumbnailDensityForLayer(tile.layer)}
                />
              </div>
            ) : tile.layer ? (
              <div
                className={`mb-3 flex h-14 items-center justify-center rounded-lg bg-gradient-to-br ${layerNavMeta(tile.layer).iconBg}`}
              >
                <span className={`text-xs font-bold uppercase tracking-wider ${tile.accent ?? layerNavMeta(tile.layer).accent}`}>
                  {layerNavMeta(tile.layer).short}
                </span>
              </div>
            ) : (
              <div className="mb-3 flex h-14 items-center justify-center rounded-lg border border-border/50 bg-muted/30">
                <span className="text-lg font-semibold text-muted-foreground">
                  {tile.label.slice(0, 1)}
                </span>
              </div>
            )}
            <span className="block truncate text-sm font-semibold text-foreground">{tile.label}</span>
            {tile.subtitle ? (
              <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                {tile.subtitle}
              </span>
            ) : null}
            {typeof tile.count === "number" ? (
              <span className="mt-2 inline-flex rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold tabular-nums text-muted-foreground">
                {tile.count} {tile.count === 1 ? "item" : "items"}
              </span>
            ) : null}
          </>
        );

        const className = `group block rounded-xl border border-border/60 bg-background text-left transition-all hover:border-blue-500/30 hover:shadow-md hover:shadow-blue-500/5 ${pad}`;

        return (
          <li key={tile.id}>
            {tile.href ? (
              <Link href={tile.href} className={className}>
                {inner}
              </Link>
            ) : (
              <button type="button" onClick={tile.onClick} className={`w-full ${className}`}>
                {inner}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
