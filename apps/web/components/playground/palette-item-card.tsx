"use client";

import { memo, useCallback } from "react";
import ComponentThumbnail from "@/components/library/ComponentThumbnail";
import { pg } from "@/components/playground/playground-shell";
import type { BuilderCatalogItem, PaletteDragPayload } from "@/components/playground/palette-types";
import { categoryLabelForLayer } from "@/lib/library-nav-shared";
import { toggleFavoriteSlug } from "@/lib/library-persistence";
import { writePaletteDragData } from "@/lib/palette-drag";
import type { LibraryStyleOption } from "@/lib/variant-utils";

type Props = {
  item: BuilderCatalogItem;
  styles: LibraryStyleOption[];
  expanded: boolean;
  isFavorite: boolean;
  onAdd: (slug: string, style: LibraryStyleOption) => void;
  onDragStart: (payload: PaletteDragPayload) => void;
  onDragEnd: () => void;
  onToggleExpand: (slug: string | null) => void;
};

function IconPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M7 2.5v9M2.5 7h9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={`shrink-0 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`}
      aria-hidden
    >
      <path
        d="M5 3l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconGrip() {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor" aria-hidden className="opacity-40">
      <circle cx="2" cy="2" r="1" />
      <circle cx="8" cy="2" r="1" />
      <circle cx="2" cy="7" r="1" />
      <circle cx="8" cy="7" r="1" />
      <circle cx="2" cy="12" r="1" />
      <circle cx="8" cy="12" r="1" />
    </svg>
  );
}

function IconStar({ filled }: { filled: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z" />
    </svg>
  );
}

function PaletteItemCard({
  item,
  styles,
  expanded,
  isFavorite,
  onAdd,
  onDragStart,
  onDragEnd,
  onToggleExpand,
}: Props) {
  const hasMultipleTypes = styles.length > 1;
  const primaryStyle = styles[0];
  const density =
    item.layer === "sections" || item.layer === "templates" ? "card" : undefined;

  const handleAdd = useCallback(
    (style: LibraryStyleOption) => {
      onAdd(item.slug, style);
    },
    [item.slug, onAdd],
  );

  const beginPaletteDrag = useCallback(
    (event: React.DragEvent, style: LibraryStyleOption) => {
      if ((event.target as HTMLElement).closest("[data-palette-no-drag]")) {
        event.preventDefault();
        return;
      }
      const payload = { slug: item.slug, style };
      writePaletteDragData(event.dataTransfer, payload);
      onDragStart(payload);
    },
    [item.slug, onDragStart],
  );

  const handleCardDragStart = useCallback(
    (event: React.DragEvent) => {
      if (!primaryStyle) {
        event.preventDefault();
        return;
      }
      beginPaletteDrag(event, primaryStyle);
    },
    [beginPaletteDrag, primaryStyle],
  );

  const handleCardClick = useCallback(() => {
    if (hasMultipleTypes) {
      onToggleExpand(expanded ? null : item.slug);
      return;
    }
    if (primaryStyle) handleAdd(primaryStyle);
  }, [expanded, handleAdd, hasMultipleTypes, item.slug, onToggleExpand, primaryStyle]);

  if (density === "card") {
    return (
      <div className="group space-y-1 [content-visibility:auto] [contain-intrinsic-size:0_140px]">
        <div
          className={`overflow-hidden rounded-xl border bg-background transition-all hover:border-border/80 hover:shadow-sm ${
            expanded ? "border-blue-500/30 ring-1 ring-blue-500/15" : "border-border/60"
          } ${primaryStyle ? "cursor-grab active:cursor-grabbing" : ""}`}
          draggable={Boolean(primaryStyle)}
          onDragStart={handleCardDragStart}
          onDragEnd={onDragEnd}
        >
          <div className="group block w-full text-left">
            <button
              type="button"
              onClick={handleCardClick}
              data-palette-no-drag
              className="block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <ComponentThumbnail
                slug={item.slug}
                name={item.name}
                layer={item.layer}
                variants={item.variants}
                density="card"
              />
            </button>
            <div className="flex items-center gap-2 px-2.5 py-2">
              <button
                type="button"
                onClick={handleCardClick}
                data-palette-no-drag
                className="min-w-0 flex-1 text-left"
              >
                <span className="block truncate text-[13px] font-semibold text-foreground">
                  {item.name}
                </span>
                <span className="mt-0.5 block truncate text-[10px] capitalize text-muted-foreground">
                  {categoryLabelForLayer(item.layer, item.category)}
                </span>
              </button>
              <button
                type="button"
                onClick={() => toggleFavoriteSlug(item.slug)}
                data-palette-no-drag
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/60 transition-colors ${
                  isFavorite
                    ? "text-amber-500"
                    : "text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-amber-500"
                }`}
                aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
              >
                <IconStar filled={isFavorite} />
              </button>
              {!hasMultipleTypes && primaryStyle ? (
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/60 text-muted-foreground"
                  aria-hidden
                >
                  <IconGrip />
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleCardClick}
                  data-palette-no-drag
                  className="flex h-7 w-7 shrink-0 items-center justify-center text-muted-foreground"
                >
                  <IconChevron open={expanded} />
                </button>
              )}
            </div>
          </div>
        </div>
        {expanded && hasMultipleTypes ? (
          <div className="space-y-0.5 rounded-lg border border-border/50 bg-muted/20 px-2 py-2">
            {styles.map((style) => (
              <div
                key={style.id}
                role="button"
                tabIndex={0}
                draggable
                onDragStart={(event) => beginPaletteDrag(event, style)}
                onDragEnd={onDragEnd}
                onClick={() => handleAdd(style)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleAdd(style);
                  }
                }}
                className="group flex w-full cursor-grab items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-background active:cursor-grabbing"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500/70" aria-hidden />
                <span className="min-w-0 flex-1 truncate font-medium">{style.label}</span>
                <span className="opacity-0 transition-opacity group-hover:opacity-100">
                  <IconPlus />
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`${pg.libraryCardWrap} group [content-visibility:auto] [contain-intrinsic-size:0_56px]`}>
      <div
        className={`${pg.libraryCard} ${expanded ? pg.libraryCardExpanded : ""} group/card ${
          primaryStyle ? "cursor-grab active:cursor-grabbing" : ""
        }`}
        draggable={Boolean(primaryStyle)}
        onDragStart={handleCardDragStart}
        onDragEnd={onDragEnd}
      >
        <div className={pg.libraryCardMain}>
          <span className={`${pg.libraryCardGrip} sm:opacity-60`} aria-hidden>
            <IconGrip />
          </span>

          <button
            type="button"
            onClick={handleCardClick}
            data-palette-no-drag
            className="flex min-w-0 flex-1 items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            <ComponentThumbnail
              slug={item.slug}
              name={item.name}
              layer={item.layer}
              variants={item.variants}
            />

            <span className={pg.libraryCardMeta}>
              <span className="flex items-center gap-1.5">
                <span className={pg.libraryCardName}>{item.name}</span>
                {item.tier !== "FREE" ? (
                  <span className={pg.libraryCardProDot} title="Pro component" />
                ) : null}
              </span>
              <span className={pg.libraryCardCategory}>
                {categoryLabelForLayer(item.layer, item.category)}
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => toggleFavoriteSlug(item.slug)}
            data-palette-no-drag
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors ${
              isFavorite
                ? "text-amber-500"
                : "opacity-0 group-hover/card:opacity-100 hover:text-amber-500"
            }`}
            aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
          >
            <IconStar filled={isFavorite} />
          </button>

          {hasMultipleTypes ? (
            <button type="button" onClick={handleCardClick} data-palette-no-drag className={pg.libraryCardActionMuted}>
              <IconChevron open={expanded} />
            </button>
          ) : (
            <button type="button" onClick={handleCardClick} data-palette-no-drag className={pg.libraryCardAction}>
              <IconPlus />
            </button>
          )}
        </div>
      </div>

      {expanded && hasMultipleTypes ? (
        <div className={pg.libraryTypePanel} role="group" aria-label={`${item.name} styles`}>
          <p className={pg.libraryTypePanelLabel}>Choose a style</p>
          {styles.map((style) => (
            <div
              key={style.id}
              role="button"
              tabIndex={0}
              draggable
              onDragStart={(event) => beginPaletteDrag(event, style)}
              onDragEnd={onDragEnd}
              onClick={() => handleAdd(style)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleAdd(style);
                }
              }}
              className={`${pg.libraryTypeBtn} cursor-grab active:cursor-grabbing`}
            >
              <span className={pg.libraryTypeDot} aria-hidden />
              <span className={pg.libraryTypeLabel}>{style.label}</span>
              <span className={pg.libraryTypeAdd}>
                <IconPlus />
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default memo(PaletteItemCard);
