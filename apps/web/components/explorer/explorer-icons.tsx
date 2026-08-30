import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

function Icon({ size = 16, className = "", children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconPackage({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M16.5 9.4 7.55 4.24" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
    </Icon>
  );
}

export function IconPrimitives({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </Icon>
  );
}

export function IconPatterns({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M12 2 2 7l10 5 10-5-10-5Z" />
      <path d="m2 17 10 5 10-5" />
      <path d="m2 12 10 5 10-5" />
    </Icon>
  );
}

export function IconSections({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <rect x="3" y="3" width="18" height="6" rx="1" />
      <rect x="3" y="11" width="8" height="10" rx="1" />
      <rect x="13" y="11" width="8" height="10" rx="1" />
    </Icon>
  );
}

export function IconTemplates({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </Icon>
  );
}

export function IconPalette({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <circle cx="13.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="10.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="6.5" cy="12.5" r="1.5" fill="currentColor" stroke="none" />
      <path d="M12 22a8 8 0 0 0 8-8c0-3.5-2.5-6-6-6.5-1.5 3-4.5 4.5-7 5.5a4.5 4.5 0 0 0 5 9Z" />
    </Icon>
  );
}

export function IconLightbulb({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z" />
    </Icon>
  );
}

export function IconClock({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Icon>
  );
}

export function IconStar({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
    </Icon>
  );
}

export function IconChevronRight({ size, className, ...props }: IconProps) {
  return (
    <Icon size={size} className={className} {...props}>
      <path d="m9 18 6-6-6-6" />
    </Icon>
  );
}

export type ExplorerLayerSlug = "primitives" | "patterns" | "sections" | "templates";

const LAYER_ICON_COMPONENTS: Record<ExplorerLayerSlug, (props: IconProps) => ReactNode> = {
  primitives: IconPrimitives,
  patterns: IconPatterns,
  sections: IconSections,
  templates: IconTemplates,
};

export function ExplorerLayerIcon({
  layer,
  size = 18,
  className = "text-foreground",
}: {
  layer: string;
  size?: number;
  className?: string;
}) {
  const IconComponent = LAYER_ICON_COMPONENTS[layer as ExplorerLayerSlug] ?? IconPackage;
  return <IconComponent size={size} className={className} />;
}
