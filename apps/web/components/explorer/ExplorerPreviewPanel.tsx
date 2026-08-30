"use client";

import Link from "next/link";
import ComponentVariantPreview from "@/components/component-variant-preview";
import type { Component } from "@/lib/component-store";
import { libraryStyleToQuery } from "@/lib/variant-utils";
import { buildExplorerUrl, type ExplorerSearchParams } from "@/lib/explorer-url";

type Props = {
  component: Component;
  params: ExplorerSearchParams;
  styleSlug?: string | null;
  onClose?: () => void;
  compact?: boolean;
};

export default function ExplorerPreviewPanel({
  component,
  params,
  styleSlug,
  onClose,
  compact = false,
}: Props) {
  const playgroundQuery = new URLSearchParams({ add: component.slug });
  const styleParams = styleSlug ? { style: styleSlug } : {};
  const explorerBack = buildExplorerUrl(
    { ...params, pick: null },
    styleParams,
  );

  return (
    <aside
      className={
        compact
          ? "flex min-h-0 flex-col overflow-hidden"
          : "hidden w-[min(100%,22rem)] shrink-0 flex-col overflow-hidden border-l border-border/70 bg-muted/10 lg:flex xl:w-[26rem]"
      }
    >
      <div className="flex shrink-0 items-start justify-between gap-2 border-b border-border/50 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Preview
          </p>
          <p className="truncate text-sm font-semibold text-foreground">{component.name}</p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            Close
          </button>
        ) : (
          <Link
            href={explorerBack}
            className="shrink-0 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            Back
          </Link>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <ComponentVariantPreview
          slug={component.slug}
          name={component.name}
          variants={component.variants}
          html={component.html}
          css={component.css}
          js={component.js}
          height="280px"
          showGallery
          syncUrl={false}
        />
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {component.description}
        </p>
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-border/50 p-3">
        <Link
          href={`/components/${encodeURIComponent(component.slug)}`}
          className="inline-flex items-center justify-center rounded-lg border border-border/70 bg-background px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
        >
          Full page
        </Link>
        <Link
          href={`/playground?${playgroundQuery.toString()}`}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Build page
        </Link>
      </div>
    </aside>
  );
}

export function buildPlaygroundHref(slug: string, styleProps?: Record<string, string | undefined>) {
  const q = new URLSearchParams({ add: slug });
  if (styleProps) {
    for (const [key, value] of Object.entries(styleProps)) {
      if (value) q.set(key, value);
    }
  }
  return `/playground?${q.toString()}`;
}

export function playgroundHrefFromStyleOption(
  slug: string,
  option: { presetId?: string; props: Record<string, string> },
) {
  const query = libraryStyleToQuery({
    id: option.presetId ?? slug,
    label: "",
    props: option.props,
    presetId: option.presetId,
  });
  return buildPlaygroundHref(slug, {
    variant: query.variant,
    size: query.size,
    tone: query.tone,
    density: query.density,
    radius: query.radius,
    emphasis: query.emphasis,
    style: query.style,
  });
}
