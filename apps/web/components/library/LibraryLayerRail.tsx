"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { LayerRailIcon } from "@/components/library/library-layer-icons";
import type { LayerIconKey } from "@/lib/library-nav-shared";

export type LayerRailSection = {
  id: string;
  label: string;
  count: number;
  icon: LayerIconKey;
  accent?: string;
};

type RailItemProps = {
  section: LayerRailSection;
  active: boolean;
  collapsed?: boolean;
  children: ReactNode;
};

function RailItem({ section, active, collapsed = false, children }: RailItemProps) {
  return (
    <div className="relative">
      {active ? (
        <span
          className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-blue-600"
          aria-hidden
        />
      ) : null}
      <div
        title={section.label}
        className={`flex w-full items-center justify-center rounded-lg transition-colors ${
          collapsed ? "px-1 py-2" : "px-2 py-2"
        } ${
          active
            ? "bg-blue-500/10 text-foreground"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

type BaseProps = {
  sections: LayerRailSection[];
  activeId: string;
  collapsed?: boolean;
  className?: string;
  dividerAfterIds?: string[];
  "aria-label"?: string;
};

type LinkProps = BaseProps & {
  variant: "link";
  buildHref: (sectionId: string) => string;
};

type ButtonProps = BaseProps & {
  variant: "button";
  onSelect: (sectionId: string) => void;
};

type Props = LinkProps | ButtonProps;

export default function LibraryLayerRail(props: Props) {
  const {
    sections,
    activeId,
    collapsed = false,
    className = "",
    dividerAfterIds = [],
    "aria-label": ariaLabel = "Library navigation",
  } = props;

  return (
    <nav
      className={`overflow-y-auto border-r border-border/70 bg-muted/10 p-1.5 ${className}`}
      aria-label={ariaLabel}
    >
      {sections.map((section) => {
        const active = activeId === section.id;
        const iconClass = active && section.accent ? section.accent : undefined;

        const content = (
          <RailItem section={section} active={active} collapsed={collapsed}>
            <LayerRailIcon icon={section.icon} className={iconClass} />
          </RailItem>
        );

        const item =
          props.variant === "link" ? (
            <Link
              key={section.id}
              href={props.buildHref(section.id)}
              className="mb-0.5 block"
              aria-current={active ? "page" : undefined}
            >
              {content}
            </Link>
          ) : (
            <button
              key={section.id}
              type="button"
              onClick={() => props.onSelect(section.id)}
              className="mb-0.5 block w-full"
              aria-current={active ? "true" : undefined}
              aria-label={`${section.label} (${section.count})`}
            >
              {content}
            </button>
          );

        return (
          <div key={section.id}>
            {item}
            {dividerAfterIds.includes(section.id) ? (
              <div className="my-1.5 h-px bg-border/60" aria-hidden />
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
