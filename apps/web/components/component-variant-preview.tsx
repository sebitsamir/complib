"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ComponentVariant } from "@/lib/component-fs";
import VariantControls from "@/components/variant-controls";
import {
  buildPreviewUrlFromSelection,
  buildSelection,
  renderFromSelection,
} from "@/lib/variant-props";
import {
  getDefaultVariantId,
  getDimensionCombinations,
  hasDimensionalControls,
  parseVariantQuery,
  selectionToQuery,
  type VariantSelection,
} from "@/lib/variant-utils";

type Props = {
  slug: string;
  name: string;
  variants?: ComponentVariant[];
  /** When set, preview uses srcDoc with variant-applied HTML instead of the API. */
  html?: string;
  css?: string;
  js?: string;
  height?: string;
  showGallery?: boolean;
  /** Sync active variant to URL query params. */
  syncUrl?: boolean;
};

function buildSrcDoc(html: string, css: string, js: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{
  display:flex;
  align-items:center;
  justify-content:center;
  min-height:100vh;
  padding:16px;
  background:#06060b;
}
${css}
</style>
</head>
<body>${html}<script>${js}<\/script></body>
</html>`;
}

export default function ComponentVariantPreview({
  slug,
  name,
  variants = [],
  html,
  css = "",
  js = "",
  height = "360px",
  showGallery = false,
  syncUrl = true,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previewId = useId();

  const initialSelection = useMemo(() => {
    if (variants.length === 0) {
      return { props: {} } satisfies VariantSelection;
    }
    if (syncUrl) {
      const query: Record<string, string | undefined> = {};
      searchParams.forEach((value, key) => {
        query[key] = value;
      });
      return parseVariantQuery(variants, query);
    }
    const defaultId = getDefaultVariantId(variants);
    return parseVariantQuery(variants, defaultId ? { variant: defaultId } : {});
  }, [variants, syncUrl, searchParams]);

  const [selection, setSelection] = useState<VariantSelection>(initialSelection);

  useEffect(() => {
    setSelection(initialSelection);
  }, [initialSelection]);

  const updateSelection = useCallback(
    (next: VariantSelection) => {
      setSelection(next);
      if (!syncUrl || variants.length === 0) return;

      const params = new URLSearchParams(searchParams.toString());
      params.delete("variant");
      for (const dim of ["size", "tone", "density", "radius", "emphasis"]) params.delete(dim);

      const query = selectionToQuery(next);
      for (const [key, value] of Object.entries(query)) {
        if (value) params.set(key, value);
      }

      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [syncUrl, variants.length, searchParams, router, pathname],
  );

  const previewSrc = useMemo(() => {
    if (html !== undefined) {
      return buildSrcDoc(renderFromSelection(html, selection), css, js);
    }
    return buildPreviewUrlFromSelection(slug, variants, selection);
  }, [slug, html, css, js, variants, selection]);

  const galleryItems = useMemo(() => {
    if (!showGallery || variants.length <= 1) return [];
    return getDimensionCombinations(variants, 24);
  }, [showGallery, variants]);

  return (
    <div className="space-y-4">
      {variants.length > 0 ? (
        <VariantControls
          variants={variants}
          selection={selection}
          onChange={updateSelection}
          aria-label={`${name} variants`}
          previewId={previewId}
        />
      ) : null}

      <iframe
        id={previewId}
        src={html !== undefined ? undefined : previewSrc}
        srcDoc={html !== undefined ? previewSrc : undefined}
        className="w-full rounded-xl border border-border bg-background"
        style={{ height }}
        sandbox={html !== undefined ? "allow-scripts" : "allow-scripts allow-same-origin"}
        title={`Preview: ${name}`}
      />

      {galleryItems.length > 1 ? (
        <div>
          <h3 className="mb-1 text-sm font-semibold text-foreground">
            {hasDimensionalControls(variants) ? "All combinations" : "All variants"}
          </h3>
          <p className="mb-3 text-xs text-muted-foreground">
            Click any tile to apply that configuration to the live preview above.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((item) => {
              const itemSelection = buildSelection(variants, item.props);
              const active =
                JSON.stringify(selection.props) === JSON.stringify(item.props);
              const gallerySrc =
                html !== undefined
                  ? buildSrcDoc(renderFromSelection(html, itemSelection), css, js)
                  : buildPreviewUrlFromSelection(slug, variants, itemSelection);

              return (
                <button
                  key={item.presetId ?? item.label}
                  type="button"
                  onClick={() => updateSelection(itemSelection)}
                  className={`overflow-hidden rounded-xl border text-left transition-all ${
                    active
                      ? "border-blue-500 ring-2 ring-blue-500/30"
                      : "border-border bg-card/50 hover:border-blue-500/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
                    <span className="text-xs font-medium text-foreground">{item.label}</span>
                    {active ? (
                      <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                        Active
                      </span>
                    ) : null}
                  </div>
                  <iframe
                    src={html !== undefined ? undefined : gallerySrc}
                    srcDoc={html !== undefined ? gallerySrc : undefined}
                    className="pointer-events-none h-[160px] w-full border-0 bg-background"
                    sandbox={
                      html !== undefined
                        ? "allow-scripts"
                        : "allow-scripts allow-same-origin"
                    }
                    title={`${name} — ${item.label}`}
                    loading="lazy"
                    tabIndex={-1}
                  />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
