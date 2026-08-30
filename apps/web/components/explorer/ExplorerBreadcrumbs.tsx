"use client";

import Link from "next/link";
import {
  buildExplorerUrl,
  type ExplorerBrowseMode,
  type ExplorerSearchParams,
} from "@/lib/explorer-url";
import {
  categoryLabelForLayer,
  layerNavMeta,
  problemLabel,
} from "@/lib/library-nav-shared";
import { styleFamilyLabel } from "@/lib/style-navigation";
import type { Component } from "@/lib/component-store";
import { getLibraryStyleOptions } from "@/lib/variant-utils";

type Crumb = {
  label: string;
  href: string | null;
  overrides: Partial<ExplorerSearchParams> | null;
};

type Props = {
  params: ExplorerSearchParams;
  pickedComponent?: Component | null;
  onNavigate?: (overrides: Partial<ExplorerSearchParams>) => void;
};

function buildCrumbs(params: ExplorerSearchParams, pickedComponent?: Component | null): Crumb[] {
  const browse = (params.browse ?? "layer") as ExplorerBrowseMode;
  const rootOverrides: Partial<ExplorerSearchParams> = {
    browse: "layer",
    layer: null,
    category: null,
    problem: null,
    style: null,
    pick: null,
    collection: null,
    q: null,
  };
  const crumbs: Crumb[] = [
    {
      label: "Explorer",
      href: buildExplorerUrl(params, rootOverrides),
      overrides: rootOverrides,
    },
  ];

  if (params.q?.trim()) {
    crumbs.push({ label: `Search “${params.q.trim()}”`, href: null, overrides: null });
    return crumbs;
  }

  if (params.collection === "recent") {
    crumbs.push({ label: "Recent", href: null, overrides: null });
    return crumbs;
  }
  if (params.collection === "favorites") {
    crumbs.push({ label: "Favorites", href: null, overrides: null });
    return crumbs;
  }

  if (browse === "style") {
    const styleRoot: Partial<ExplorerSearchParams> = {
      browse: "style",
      style: null,
      pick: null,
    };
    crumbs.push({
      label: "Visual style",
      href: buildExplorerUrl(params, styleRoot),
      overrides: styleRoot,
    });
    if (params.style) {
      crumbs.push({ label: styleFamilyLabel(params.style), href: null, overrides: null });
    }
    return crumbs;
  }

  if (browse === "problem") {
    const problemRoot: Partial<ExplorerSearchParams> = {
      browse: "problem",
      problem: null,
      pick: null,
    };
    crumbs.push({
      label: "Use case",
      href: buildExplorerUrl(params, problemRoot),
      overrides: problemRoot,
    });
    if (params.problem) {
      crumbs.push({ label: problemLabel(params.problem), href: null, overrides: null });
    }
    return crumbs;
  }

  if (params.layer) {
    const layerOverrides: Partial<ExplorerSearchParams> = {
      category: null,
      pick: null,
      style: null,
    };
    crumbs.push({
      label: layerNavMeta(params.layer).label,
      href: buildExplorerUrl(params, layerOverrides),
      overrides: layerOverrides,
    });
  }
  if (params.category && params.layer) {
    const categoryOverrides: Partial<ExplorerSearchParams> = {
      pick: null,
      style: null,
    };
    crumbs.push({
      label: categoryLabelForLayer(params.layer, params.category),
      href: buildExplorerUrl(params, categoryOverrides),
      overrides: categoryOverrides,
    });
  }
  if (params.pick && pickedComponent) {
    const pickOverrides: Partial<ExplorerSearchParams> = { style: null };
    crumbs.push({
      label: pickedComponent.name,
      href: buildExplorerUrl(params, pickOverrides),
      overrides: pickOverrides,
    });
  }
  if (params.pick && params.style && pickedComponent) {
    const styles = getLibraryStyleOptions(pickedComponent.variants ?? []);
    const styleLabel = styles.find((s) => s.id === params.style)?.label ?? params.style;
    crumbs.push({ label: styleLabel, href: null, overrides: null });
  }

  return crumbs;
}

export default function ExplorerBreadcrumbs({
  params,
  pickedComponent,
  onNavigate,
}: Props) {
  const crumbs = buildCrumbs(params, pickedComponent);

  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-sm">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        const canNavigate = Boolean(crumb.overrides || crumb.href) && !isLast;
        return (
          <span key={`${crumb.label}-${index}`} className="inline-flex items-center gap-1">
            {index > 0 ? (
              <span className="text-muted-foreground/50" aria-hidden>
                /
              </span>
            ) : null}
            {canNavigate && onNavigate && crumb.overrides ? (
              <button
                type="button"
                onClick={() => onNavigate(crumb.overrides!)}
                className="font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {crumb.label}
              </button>
            ) : canNavigate && crumb.href ? (
              <Link
                href={crumb.href}
                className="font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {crumb.label}
              </Link>
            ) : (
              <span
                className={
                  isLast ? "font-semibold text-foreground" : "font-medium text-muted-foreground"
                }
                aria-current={isLast ? "page" : undefined}
              >
                {crumb.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
