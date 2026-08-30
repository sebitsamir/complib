"use client";

import ExplorerMainBrowser from "@/components/explorer/ExplorerMainBrowser";
import type { Component, LibraryNavLayer, ProblemNavGroup } from "@/lib/component-store";
import type { ExplorerSearchParams } from "@/lib/explorer-url";
import type { LibraryStyleOption } from "@/lib/variant-utils";

type Props = {
  open: boolean;
  onClose: () => void;
  navLayers: LibraryNavLayer[];
  explorerComponents: Component[];
  visibleComponents: Component[];
  params: ExplorerSearchParams;
  onNavigate: (overrides: Partial<ExplorerSearchParams>) => void;
  onPick: (slug: string, style: LibraryStyleOption) => void;
  onOpenCommandPalette?: () => void;
};

export default function PlaygroundBrowseModal({
  open,
  onClose,
  navLayers,
  explorerComponents,
  visibleComponents,
  params,
  onNavigate,
  onPick,
  onOpenCommandPalette,
}: Props) {

  const handlePick = (slug: string, style: LibraryStyleOption) => {
    onPick(slug, style);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Browse components"
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border/70 px-4 py-3 sm:px-6">
        <div>
          <p className="text-sm font-semibold text-foreground">Browse components</p>
          <p className="text-xs text-muted-foreground">
            Tap to add to canvas · ⌘K to search
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="hidden rounded-lg border border-border/70 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted sm:inline-flex"
          >
            ⌘K Search
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted/80"
          >
            Close
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <ExplorerMainBrowser
          navLayers={navLayers}
          problemGroups={[] as ProblemNavGroup[]}
          components={visibleComponents}
          allComponents={explorerComponents}
          params={params}
          framework="vanilla"
          canAccessSource={false}
          pickerMode
          onPick={handlePick}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
}
