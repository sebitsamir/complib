import type { ComponentType, ReactNode } from "react";
import type { LayerIconKey } from "@/lib/library-nav-shared";

type IconProps = {
  className?: string;
};

function SvgBase({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function IconRecent({ className }: IconProps) {
  return (
    <SvgBase className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </SvgBase>
  );
}

export function IconFavorites({ className, filled = false }: IconProps & { filled?: boolean }) {
  return (
    <SvgBase className={className}>
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 22 12 18.56 5.82 22 7 14.14 2 9.27 8.91 8.26 12 2"
        fill={filled ? "currentColor" : "none"}
      />
    </SvgBase>
  );
}

export function IconPrimitives({ className }: IconProps) {
  return (
    <SvgBase className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </SvgBase>
  );
}

export function IconPatterns({ className }: IconProps) {
  return (
    <SvgBase className={className}>
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </SvgBase>
  );
}

export function IconSections({ className }: IconProps) {
  return (
    <SvgBase className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </SvgBase>
  );
}

export function IconTemplates({ className }: IconProps) {
  return (
    <SvgBase className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </SvgBase>
  );
}

export function IconFallback({ className }: IconProps) {
  return (
    <SvgBase className={className}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </SvgBase>
  );
}

const ICON_MAP: Record<LayerIconKey, ComponentType<IconProps>> = {
  recent: IconRecent,
  favorites: IconFavorites,
  primitives: IconPrimitives,
  patterns: IconPatterns,
  sections: IconSections,
  templates: IconTemplates,
  fallback: IconFallback,
};

export function LayerRailIcon({
  icon,
  className,
}: {
  icon: LayerIconKey;
  className?: string;
}) {
  const Icon = ICON_MAP[icon] ?? IconFallback;
  return <Icon className={className} />;
}
