"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export type CategoryChip = {
  slug: string;
  label: string;
  count: number;
};

type ChipClasses = {
  chip: string;
  chipActive: string;
  chipIdle: string;
  track: string;
};

const defaultClasses: ChipClasses = {
  chip: "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors",
  chipActive: "border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  chipIdle:
    "border-border/70 bg-background text-muted-foreground hover:border-border hover:text-foreground",
  track:
    "flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
};

type BaseProps = {
  categories: CategoryChip[];
  activeSlug: string | null;
  className?: string;
  chipClasses?: Partial<ChipClasses>;
};

type LinkProps = BaseProps & {
  variant: "link";
  buildHref: (categorySlug: string | null) => string;
};

type ButtonProps = BaseProps & {
  variant: "button";
  onChange: (categorySlug: string | null) => void;
};

type Props = LinkProps | ButtonProps;

function ChipWrapper({
  active,
  classes,
  children,
  onClick,
  href,
}: {
  active: boolean;
  classes: ChipClasses;
  children: ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  const className = `${classes.chip} ${active ? classes.chipActive : classes.chipIdle}`;

  if (href) {
    return (
      <Link href={href} className={className} aria-current={active ? "true" : undefined}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className} aria-pressed={active}>
      {children}
    </button>
  );
}

export default function LibraryCategoryChips(props: Props) {
  const { categories, activeSlug, className = "", chipClasses } = props;
  const classes = { ...defaultClasses, ...chipClasses };

  if (categories.length === 0) return null;

  const renderChip = (slug: string | null, label: string, count?: number) => {
    const active = activeSlug === slug;
    const content = (
      <>
        {label}
        {count !== undefined ? (
          <span className="ml-1 tabular-nums opacity-70">{count}</span>
        ) : null}
      </>
    );

    if (props.variant === "link") {
      return (
        <ChipWrapper
          key={slug ?? "all"}
          active={active}
          classes={classes}
          href={props.buildHref(slug)}
        >
          {content}
        </ChipWrapper>
      );
    }

    return (
      <ChipWrapper
        key={slug ?? "all"}
        active={active}
        classes={classes}
        onClick={() => props.onChange(slug)}
      >
        {content}
      </ChipWrapper>
    );
  };

  const totalCount = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <div
      className={`sticky top-0 z-[1] shrink-0 border-b border-border/50 bg-background/95 px-2 py-2 backdrop-blur-sm ${className}`}
    >
      <div className={classes.track} role="group" aria-label="Category filters">
        {renderChip(null, "All", totalCount)}
        {categories.map((category) =>
          renderChip(category.slug, category.label, category.count),
        )}
      </div>
    </div>
  );
}
