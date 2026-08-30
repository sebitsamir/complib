"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";
import { buildAdminStudioUrl } from "@/lib/admin-form";
import { TAXONOMY_DEFAULTS } from "@/lib/taxonomy-defaults";
import type { ComponentLayer } from "@/lib/component-fs";

type CatalogItem = {
  slug: string;
  name: string;
  layer: string;
  category: string;
};

type Props = {
  catalog: CatalogItem[];
  activeLayer: ComponentLayer | null;
  activeCategory: string | null;
  editingSlug: string | null;
  view: "browse" | "studio";
};

const LAYER_ICONS: Record<string, string> = {
  primitives: "🧱",
  patterns: "🧩",
  sections: "🚀",
  templates: "📄",
};

function NavItem({
  href,
  active,
  icon,
  label,
  count,
}: {
  href: string;
  active: boolean;
  icon: string;
  label: string;
  count?: number;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
        active
          ? "bg-blue-500/10 font-semibold text-foreground ring-1 ring-blue-500/20"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      }`}
    >
      <span className="text-base leading-none" aria-hidden>
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {typeof count === "number" ? (
        <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">{count}</span>
      ) : null}
    </Link>
  );
}

export default function AdminExplorerNav({
  catalog,
  activeLayer,
  activeCategory,
  editingSlug,
  view,
}: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const push = useCallback(
    (href: string) => {
      startTransition(() => router.push(href));
    },
    [router],
  );

  const layerCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const layer of TAXONOMY_DEFAULTS) {
      counts.set(layer.id, catalog.filter((item) => item.layer === layer.id).length);
    }
    return counts;
  }, [catalog]);

  return (
    <aside className="flex h-full w-[min(100%,15rem)] shrink-0 flex-col border-r border-border bg-background lg:w-60">
      <div className="space-y-2 border-b border-border p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Studio
        </p>
        <p className="text-sm font-medium text-foreground">Placement</p>
        <p className="text-xs text-muted-foreground">
          Same taxonomy as Explorer — pick where components live.
        </p>
        <button
          type="button"
          onClick={() => push(buildAdminStudioUrl({ view: "studio", layer: activeLayer, category: activeCategory }))}
          className="mt-1 flex w-full items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-500"
        >
          + New component
        </button>
      </div>

      <nav className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3" aria-label="Admin placement">
        <div>
          <p className="mb-1.5 px-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Layers
          </p>
          <div className="space-y-0.5">
            <NavItem
              href={buildAdminStudioUrl({ view: "browse" })}
              active={view === "browse" && !activeLayer && !editingSlug}
              icon="📦"
              label="All layers"
            />
            {TAXONOMY_DEFAULTS.map((layer) => (
              <NavItem
                key={layer.id}
                href={buildAdminStudioUrl({ layer: layer.id, view: "browse" })}
                active={activeLayer === layer.id && !activeCategory && view === "browse"}
                icon={LAYER_ICONS[layer.id] ?? "📦"}
                label={layer.label}
                count={layerCounts.get(layer.id)}
              />
            ))}
          </div>
        </div>

        {activeLayer ? (
          <div>
            <p className="mb-1.5 px-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Categories
            </p>
            <div className="space-y-0.5">
              {TAXONOMY_DEFAULTS.find((l) => l.id === activeLayer)?.categories.map((category) => {
                const count = catalog.filter(
                  (c) => c.layer === activeLayer && c.category === category.slug,
                ).length;
                return (
                  <NavItem
                    key={category.slug}
                    href={buildAdminStudioUrl({
                      layer: activeLayer,
                      category: category.slug,
                      view: "browse",
                    })}
                    active={activeCategory === category.slug && view === "browse" && !editingSlug}
                    icon="▸"
                    label={category.label}
                    count={count}
                  />
                );
              })}
            </div>
          </div>
        ) : null}
      </nav>

      <div className="space-y-1 border-t border-border p-3 text-xs">
        <Link href="/components" className="block text-muted-foreground hover:text-foreground">
          Open Explorer
        </Link>
        <Link href="/playground" className="block text-muted-foreground hover:text-foreground">
          Open Playground
        </Link>
      </div>
    </aside>
  );
}
