"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  buildExplorerPickUrl,
  buildExplorerUrl,
  type ExplorerSearchParams,
} from "@/lib/explorer-url";
import { categoryLabelForLayer, layerNavMeta } from "@/lib/library-nav-shared";
import { searchCatalogRanked } from "@/lib/library-catalog-search";
import {
  getLibraryStyleOptions,
  libraryStyleToQuery,
  type LibraryStyleOption,
} from "@/lib/variant-utils";
import type { Component } from "@/lib/component-store";

export type CommandPaletteItem = {
  id: string;
  label: string;
  subtitle?: string;
  href: string;
  keywords?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  components: Component[];
  params: ExplorerSearchParams;
  pickerMode?: boolean;
  onPick?: (slug: string, style: LibraryStyleOption) => void;
};

function useFlatCommands(components: Component[], params: ExplorerSearchParams): CommandPaletteItem[] {
  return useMemo(() => {
    const items: CommandPaletteItem[] = [];
    const framework = params.framework ?? "vanilla";

    for (const component of components) {
      items.push({
        id: `component-${component.slug}`,
        label: component.name,
        subtitle: `${layerNavMeta(component.layer).label} · ${categoryLabelForLayer(component.layer, component.category)}`,
        href: buildExplorerPickUrl(params, component),
        keywords: `${component.slug} ${component.tags.join(" ")}`,
      });

      const styles = getLibraryStyleOptions(component.variants ?? []);
      for (const style of styles) {
        const query = libraryStyleToQuery(style);
        const q = new URLSearchParams({ add: component.slug });
        for (const [key, value] of Object.entries(query)) {
          if (value) q.set(key, value);
        }
        items.push({
          id: `style-${component.slug}-${style.id}`,
          label: `${component.name} — ${style.label}`,
          subtitle: "Open in playground with this style",
          href: `/playground?${q.toString()}`,
          keywords: `${component.slug} ${style.label}`,
        });
      }
    }

    return items;
  }, [components, params]);
}

export default function ExplorerCommandPalette({
  open,
  onClose,
  components,
  params,
  pickerMode = false,
  onPick,
}: Props) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const flatCommands = useFlatCommands(components, params);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return flatCommands.slice(0, 12);
    const ranked = searchCatalogRanked(
      flatCommands.map((item) => ({
        slug: item.id,
        name: item.label,
        category: item.subtitle ?? "",
        layer: item.keywords ?? "",
      })),
      q,
      20,
    );
    const byId = new Map(flatCommands.map((item) => [item.id, item]));
    return ranked.items
      .map((item) => byId.get(item.slug))
      .filter((item): item is CommandPaletteItem => !!item);
  }, [flatCommands, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const runItem = useCallback(
    (item: CommandPaletteItem) => {
      if (pickerMode && onPick && item.id.startsWith("component-")) {
        const slug = item.id.replace("component-", "");
        const component = components.find((c) => c.slug === slug);
        if (component) {
          const styles = getLibraryStyleOptions(component.variants ?? []);
          onPick(slug, styles[0] ?? { id: "default", label: "Standard", props: {} });
        }
        onClose();
        return;
      }
      onClose();
    },
    [components, onClose, onPick, pickerMode],
  );

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Enter" && results[activeIndex]) {
        e.preventDefault();
        runItem(results[activeIndex]!);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, onClose, open, results, runItem]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-[12vh] backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-border/80 bg-background shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-border/60 px-4 py-3">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components, styles, or jump to playground…"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            aria-label="Search command palette"
          />
          <p className="mt-1.5 text-[10px] text-muted-foreground">
            ↑↓ navigate · Enter select · Esc close
          </p>
        </div>
        <ul className="max-h-[min(50vh,360px)] overflow-y-auto p-2" role="listbox">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">No matches</li>
          ) : (
            results.map((item, index) => (
              <li key={item.id} role="option" aria-selected={index === activeIndex}>
                {pickerMode && item.id.startsWith("component-") ? (
                  <button
                    type="button"
                    onClick={() => runItem(item)}
                    className={`flex w-full flex-col rounded-lg px-3 py-2.5 text-left transition-colors ${
                      index === activeIndex ? "bg-blue-500/10 text-foreground" : "hover:bg-muted/60"
                    }`}
                  >
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.subtitle ? (
                      <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                    ) : null}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`flex flex-col rounded-lg px-3 py-2.5 transition-colors ${
                      index === activeIndex ? "bg-blue-500/10 text-foreground" : "hover:bg-muted/60"
                    }`}
                  >
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.subtitle ? (
                      <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                    ) : null}
                  </Link>
                )}
              </li>
            ))
          )}
        </ul>
        <div className="border-t border-border/50 px-4 py-2 text-[10px] text-muted-foreground">
          {pickerMode ? "Pick a component to insert on the canvas" : "Skip browse levels — jump straight to a component or playground"}
        </div>
      </div>
    </div>
  );
}

export function useExplorerCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
        if (tag === "input" || tag === "textarea" || tag === "select") return;
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return { open, setOpen };
}
