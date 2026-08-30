"use client";

import ComponentCard from "@/layouts/componentCard";
import type { Component } from "@/lib/component-store";
import { redactComponentSources, tierRequiresProSourceLock } from "@/lib/source-access-utils";
import type { LibraryStyleOption } from "@/lib/variant-utils";

type Framework = "vanilla" | "react" | "vue";

type Props = {
  components: Component[];
  framework: Framework;
  canAccessSource: boolean;
  /** When set, card titles link into explorer drill-down instead of detail page. */
  buildPickHref?: (component: Component) => string;
  /** Playground browse: add component instead of navigating. */
  onPick?: (slug: string, style: LibraryStyleOption) => void;
  emptyTitle?: string;
  emptyHint?: string;
};

export default function ComponentsMainGrid({
  components,
  framework,
  canAccessSource,
  buildPickHref,
  onPick,
  emptyTitle = "No components found",
  emptyHint = "Try clearing search or changing the plan filter in the sidebar.",
}: Props) {
  if (components.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-2xl text-muted-foreground">{emptyTitle}</p>
        <p className="mt-2 text-sm text-muted-foreground/80">{emptyHint}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {components.map((comp) => {
        const codeLocked = tierRequiresProSourceLock(comp.tier) && !canAccessSource;
        const safe = redactComponentSources(comp, canAccessSource);
        return (
          <ComponentCard
            key={`${comp.slug}-${comp.id}-${framework}`}
            component={safe}
            codeLocked={codeLocked}
            framework={framework}
            titleHref={buildPickHref?.(comp) ?? `/components/${comp.slug}`}
            onAddToPlayground={
              onPick
                ? (style) => onPick(comp.slug, style)
                : undefined
            }
          />
        );
      })}
    </div>
  );
}
