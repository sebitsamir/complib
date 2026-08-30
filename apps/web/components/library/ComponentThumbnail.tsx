"use client";

import { memo, useMemo } from "react";
import { useLazyVisible } from "@/components/library/use-lazy-visible";
import { buildPreviewUrlFromSelection } from "@/lib/variant-props";
import {
  componentInitials,
  layerNavMeta,
  thumbnailDensityForLayer,
  type ThumbnailDensity,
} from "@/lib/library-nav-shared";
import { getDefaultVariantId, selectionFromVariantId } from "@/lib/variant-utils";
import type { ComponentVariant } from "@/lib/component-fs";

type Props = {
  slug: string;
  name: string;
  layer: string;
  variants?: ComponentVariant[];
  density?: ThumbnailDensity;
  className?: string;
  eager?: boolean;
};

function ComponentThumbnail({
  slug,
  name,
  layer,
  variants,
  density,
  className = "",
  eager = false,
}: Props) {
  const resolvedDensity = density ?? thumbnailDensityForLayer(layer);
  const meta = layerNavMeta(layer);
  const needsPreview = resolvedDensity !== "icon";
  const { ref, visible } = useLazyVisible({ disabled: eager || !needsPreview });

  const previewSrc = useMemo(() => {
    if (!needsPreview || !visible) return null;
    const defaultVariantId = getDefaultVariantId(variants ?? []) ?? "default";
    const selection = selectionFromVariantId(variants ?? [], defaultVariantId);
    return buildPreviewUrlFromSelection(slug, variants ?? [], selection);
  }, [needsPreview, slug, variants, visible]);

  if (resolvedDensity === "icon") {
    return (
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-[10px] font-bold uppercase tracking-wide text-foreground ${meta.iconBg} ${className}`}
      >
        {componentInitials(name)}
      </span>
    );
  }

  if (resolvedDensity === "thumb") {
    return (
      <span
        ref={ref}
        className={`relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted/30 ${className}`}
      >
        {previewSrc ? (
          <iframe
            src={previewSrc}
            title={`Preview of ${name}`}
            loading="lazy"
            className="pointer-events-none absolute left-1/2 top-0 h-[220%] w-[220%] origin-top-left -translate-x-1/2 scale-[0.45] border-0"
            tabIndex={-1}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[9px] font-bold uppercase text-muted-foreground">
            {componentInitials(name)}
          </span>
        )}
      </span>
    );
  }

  return (
    <span
      ref={ref}
      className={`relative block w-full overflow-hidden rounded-lg border border-border/60 bg-muted/20 ${className}`}
    >
      <span className="block aspect-[16/10] w-full">
        {previewSrc ? (
          <iframe
            src={previewSrc}
            title={`Preview of ${name}`}
            loading="lazy"
            className="pointer-events-none absolute inset-0 h-[200%] w-[200%] origin-top-left scale-50 border-0"
            tabIndex={-1}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-gradient-to-br text-sm font-bold uppercase text-muted-foreground">
            {componentInitials(name)}
          </span>
        )}
      </span>
    </span>
  );
}

export default memo(ComponentThumbnail);
