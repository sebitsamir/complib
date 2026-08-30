"use client";

import type { ReactNode } from "react";

export const pg = {
  workbench: "flex min-h-0 flex-1 flex-col overflow-hidden",
  commandBar:
    "flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border/70 bg-background/95 px-3 py-2.5 backdrop-blur-md sm:gap-3 sm:px-4 md:px-5",
  commandBarLeft:
    "flex min-w-0 max-w-full flex-1 items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-3 [&::-webkit-scrollbar]:hidden",
  commandBarCenter: "hidden items-center gap-2 md:flex",
  commandBarRight: "flex flex-wrap items-center justify-end gap-2",
  subToolbar:
    "flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border/50 bg-muted/25 px-4 py-2 sm:px-5",
  subToolbarGroup: "flex flex-wrap items-center gap-1.5",
  toolbarDivider: "mx-1 hidden h-5 w-px shrink-0 bg-border/80 sm:block",
  workspace:
    "grid min-h-0 flex-1 grid-cols-1 grid-rows-[auto_minmax(0,1fr)] lg:grid-cols-[minmax(3rem,22rem)_minmax(0,1fr)] lg:grid-rows-1",
  workspaceSidebarCollapsed:
    "lg:grid-cols-[5rem_minmax(0,1fr)]",
  sidebar:
    "flex max-h-[min(35dvh,280px)] min-h-0 flex-col overflow-hidden border-b border-border/60 bg-muted/10 lg:max-h-none lg:border-b-0 lg:border-r lg:bg-muted/15",
  inspector:
    "fixed inset-x-0 bottom-0 z-30 flex max-h-[min(72vh,520px)] min-h-0 flex-col overflow-hidden rounded-t-2xl border border-border/80 bg-background shadow-[0_-12px_40px_rgba(0,0,0,0.12)] lg:absolute lg:inset-x-auto lg:bottom-0 lg:right-0 lg:top-0 lg:z-20 lg:w-[min(320px,36%)] lg:max-w-[320px] lg:max-h-none lg:rounded-none lg:border-l lg:border-t-0 lg:shadow-[-8px_0_24px_rgba(0,0,0,0.06)]",
  inspectorSheetHandle:
    "mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-border/80 lg:hidden",
  inspectorTopBar:
    "flex shrink-0 items-center justify-between border-b border-border/50 px-4 py-2.5 lg:px-3",
  inspectorTopTitle:
    "text-[11px] font-bold uppercase tracking-widest text-muted-foreground",
  inspectorCloseBtn:
    "flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
  inspectorHero:
    "flex shrink-0 items-center gap-3 border-b border-border/40 px-4 py-3 lg:px-3",
  inspectorAvatar:
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-xs font-bold text-accent",
  inspectorSummary:
    "flex shrink-0 items-center justify-between gap-2 border-b border-border/40 bg-muted/20 px-4 py-2 lg:px-3",
  inspectorSummaryLabel: "text-[10px] font-semibold uppercase tracking-wide text-muted-foreground",
  inspectorSummaryValue:
    "truncate text-right text-xs font-medium text-foreground",
  inspectorSection: "rounded-xl border border-border/50 bg-muted/15 px-2.5 py-2.5",
  inspectorSectionLabel:
    "mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
  inspectorScroll: "min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3",
  inspectorActions:
    "grid shrink-0 grid-cols-3 gap-2 border-t border-border/50 bg-muted/15 p-3",
  inspectorActionBtn:
    "inline-flex items-center justify-center gap-1.5 rounded-lg border border-border/70 bg-background px-2 py-2 text-[10px] font-semibold text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground",
  inspectorActionBtnDanger:
    "inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 px-2 py-2 text-[10px] font-semibold text-red-600 transition-colors hover:bg-red-500/10 dark:text-red-400",
  inspectorFootnote:
    "shrink-0 border-t border-border/30 px-3 py-2 text-center text-[9px] text-muted-foreground/70",
  inspectorBackdrop:
    "fixed inset-0 z-20 bg-black/20 backdrop-blur-[1px] lg:hidden",
  categoryChip:
    "rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-colors",
  categoryChipActive:
    "border-accent/40 bg-accent/10 text-accent dark:text-accent",
  categoryChipIdle:
    "border-border/70 bg-background text-muted-foreground hover:border-border hover:text-foreground",
  layerGroupHead:
    "sticky top-0 z-[1] bg-muted/15 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground backdrop-blur-sm",
  layerChip:
    "inline-flex max-w-full items-center gap-1 truncate rounded-md bg-muted/60 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground",
  layerIndex:
    "flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] font-bold text-muted-foreground",
  sidebarTabs:
    "grid shrink-0 grid-cols-2 border-b border-border/50 bg-background/90",
  sidebarTab:
    "relative px-3 py-2.5 text-center text-xs font-semibold tracking-wide transition-colors",
  sidebarTabActive:
    "bg-background text-foreground shadow-sm after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-accent",
  sidebarTabIdle:
    "text-muted-foreground hover:bg-muted/30 hover:text-foreground",
  libraryHead: "shrink-0 space-y-3 border-b border-border/50 bg-background/90 px-3 py-3",
  /** Legacy playground clients */
  sidebarHead: "shrink-0 space-y-2.5 border-b border-border/50 px-3 py-3",
  libraryHeadTitle: "text-xs font-bold uppercase tracking-widest text-foreground",
  libraryHeadCount:
    "rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground",
  librarySearch: "h-9 pl-9 text-xs",
  libraryFilterTrack:
    "flex gap-1 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  libraryFilterPill:
    "shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-colors",
  libraryFilterPillActive:
    "border-accent/40 bg-accent/10 text-accent dark:text-accent",
  libraryFilterPillIdle:
    "border-border/70 bg-background text-muted-foreground hover:border-border hover:text-foreground",
  sidebarScroll: "min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2",
  libraryRoot: "space-y-3 pb-1",
  librarySection: "overflow-hidden rounded-xl border border-border/50 bg-background/80",
  librarySectionHead:
    "flex w-full items-center justify-between gap-2 px-2.5 py-2 text-left transition-colors hover:bg-muted/30",
  librarySectionCount:
    "rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-muted-foreground",
  libraryGrid: "grid gap-1.5 p-2 pt-0",
  libraryCardWrap: "space-y-0",
  libraryCard:
    "relative overflow-hidden rounded-lg border border-transparent bg-background transition-all hover:border-border/80 hover:shadow-sm",
  libraryCardExpanded: "border-accent/30 bg-accent/[0.03] shadow-sm ring-1 ring-accent/15",
  libraryCardMain:
    "relative flex w-full items-center gap-2 px-2 py-2 text-left transition-colors group-hover/card:bg-muted/20",
  libraryCardGrip: "flex w-4 shrink-0 items-center justify-center text-muted-foreground",
  libraryCardIcon:
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold uppercase tracking-wide text-foreground",
  libraryCardMeta: "min-w-0 flex-1",
  libraryCardName: "truncate text-[13px] font-semibold leading-tight text-foreground",
  libraryCardCategory: "mt-0.5 truncate text-[10px] capitalize text-muted-foreground",
  libraryCardProDot: "h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400 ring-1 ring-amber-500/30",
  libraryCardAction:
    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/60 bg-background text-muted-foreground opacity-0 shadow-sm transition-all group-hover/card:opacity-100 group-hover/card:text-accent dark:group-hover/card:text-accent",
  libraryCardActionMuted:
    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground",
  libraryTypePanel: "space-y-0.5 border-t border-border/40 bg-muted/20 px-2 py-2",
  libraryTypePanelLabel:
    "px-1 pb-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground",
  libraryTypeBtn:
    "group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25",
  libraryTypeDot: "h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70",
  libraryTypeLabel: "min-w-0 flex-1 truncate font-medium text-foreground",
  libraryTypeAdd:
    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted hover:text-accent",
  librarySkeleton: "h-[52px] animate-pulse rounded-lg bg-muted/70",
  paletteBtn:
    "group flex w-full items-center gap-2.5 rounded-lg border border-transparent px-2 py-2 text-left transition-all hover:border-border/70 hover:bg-background hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25 active:scale-[0.99]",
  paletteBtnExpanded:
    "border-border/70 bg-background shadow-sm",
  paletteTypeList: "mb-1 space-y-0.5 border-l-2 border-accent/25 py-1 pl-2",
  paletteTypeBtn:
    "flex w-full items-center gap-2 rounded-md border border-transparent px-2 py-1.5 text-left text-xs transition-colors hover:border-border/60 hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25",
  paletteChevron:
    "flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground transition-transform group-hover:text-foreground",
  paletteIcon:
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/80 text-[10px] font-bold uppercase tracking-wide text-muted-foreground transition-colors group-hover:bg-accent/10 group-hover:text-accent dark:group-hover:text-accent",
  layerBtn:
    "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs transition-colors",
  layerBtnActive:
    "bg-accent/10 text-foreground ring-1 ring-accent/25",
  layerBtnIdle: "text-foreground hover:bg-muted/50",
  emptyState:
    "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-8 text-center",
  canvasEmptyCard:
    "max-w-sm rounded-2xl border border-dashed border-border/80 bg-background/95 px-6 py-6 text-center shadow-lg backdrop-blur-md",
  main: "relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/10 lg:min-h-0",
  canvasPanel: "flex min-h-0 flex-1 flex-col overflow-hidden",
  canvasBody: "relative flex min-h-0 flex-1 flex-col overflow-hidden",
  canvasAlertStack:
    "pointer-events-none absolute inset-x-0 bottom-3 z-10 flex flex-col items-center gap-2 px-4",
  canvasAlertToast:
    "pointer-events-auto max-w-lg rounded-lg border bg-background/95 px-4 py-2.5 text-xs shadow-lg backdrop-blur-md",
  canvasToolbar:
    "flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border/50 bg-background/80 px-4 py-2.5 sm:px-5",
  canvasWell:
    "relative min-h-[12rem] flex-1 overflow-auto overscroll-contain bg-[radial-gradient(circle_at_1px_1px,hsl(var(--border)/0.35)_1px,transparent_0)] [background-size:20px_20px]",
  canvasStage: "flex min-h-0 flex-1 flex-col overflow-hidden",
  canvasViewportBar:
    "flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border/40 bg-muted/20 px-3 py-2 sm:px-4",
  canvasWellInner:
    "flex min-h-full w-full justify-center p-4 sm:p-5",
  canvasWellInnerFit: "items-center",
  canvasWellInnerScroll: "items-start",
  artboardSlot: "relative shrink-0",
  artboardInner: "origin-top-left",
  canvasEmptyOverlay:
    "pointer-events-none absolute inset-0 flex items-center justify-center p-6",
  codeSplit:
    "grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(280px,38%)_minmax(0,1fr)]",
  panelBody: "flex min-h-0 flex-1 flex-col overflow-hidden",
  canvasFrameWrap: "mx-auto w-fit",
  canvasFrameChrome:
    "overflow-hidden rounded-xl border border-border/80 bg-[#0c0c12] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/5 dark:ring-white/5",
  canvasFrameBar:
    "flex items-center gap-2 border-b border-white/8 bg-[#14141c] px-3 py-2",
  canvasFrameDot: "h-2.5 w-2.5 rounded-full",
  canvasFrame: "relative overflow-hidden bg-[#07070b]",
  dropOverlay:
    "pointer-events-none absolute inset-x-6 top-6 z-10 rounded-lg border border-accent/40 bg-ink/90 px-4 py-2.5 text-center text-xs font-medium text-accent-soft shadow-lg backdrop-blur-md",
  segmentGroup:
    "inline-flex gap-0.5 rounded-lg border border-border/70 bg-muted/30 p-0.5",
  segmentBtn:
    "rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150",
  segmentBtnActive: "bg-background text-foreground shadow-sm",
  segmentBtnIdle: "text-muted-foreground hover:text-foreground",
  iconBtn:
    "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-colors hover:border-border/70 hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-35",
  btnGhost:
    "inline-flex h-8 items-center gap-1.5 rounded-lg border border-border/70 bg-background/70 px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-40",
  btnPrimary:
    "inline-flex h-8 items-center gap-1.5 rounded-lg bg-accent px-3.5 text-xs font-semibold text-accent-foreground shadow-sm transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
  btnDanger:
    "inline-flex h-8 items-center gap-1.5 rounded-lg border border-red-500/25 bg-red-500/8 px-3 text-xs font-medium text-red-700 transition-colors hover:bg-red-500/12 disabled:opacity-40 dark:text-red-300",
  btnEditOn:
    "inline-flex h-8 items-center gap-1.5 rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300",
  btnEditOff:
    "inline-flex h-8 items-center gap-1.5 rounded-lg border border-border/70 bg-background/70 px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
  select:
    "h-8 appearance-none rounded-lg border border-border/70 bg-background px-2.5 pr-7 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
  searchInput:
    "h-9 w-full rounded-lg border border-border/70 bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
  statusPill:
    "inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-background/80 px-2.5 py-1 text-[11px] font-medium text-muted-foreground",
  statusPillAccent:
    "inline-flex items-center gap-1.5 rounded-md border border-accent/25 bg-accent/8 px-2.5 py-1 text-[11px] font-medium text-accent",
  statusDot: "h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500",
  alertBanner: "shrink-0 border-b px-4 py-2.5 text-xs sm:px-5",
  alertPro: "border-amber-500/30 bg-amber-500/8 text-amber-950 dark:text-amber-100",
  alertError: "border-red-500/30 bg-red-500/8 text-red-700 dark:text-red-200",
  footerHint:
    "shrink-0 border-t border-border/50 bg-background/80 px-4 py-2 text-[11px] text-muted-foreground sm:px-5",
  /** Shared shell tokens for playground workbench chrome. */
  page: "flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-4 sm:p-6",
  toolbar:
    "flex flex-col gap-4 rounded-2xl border border-border/80 bg-background/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5",
  toolbarActions: "flex flex-wrap items-center gap-2",
  statusBar:
    "flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-muted/25 px-3 py-2",
  tipsBox:
    "mt-4 shrink-0 rounded-xl border border-border/60 bg-muted/20 p-3",
} as const;

type SegmentedOption<T extends string> = { value: T; label: string };

export function PlaygroundSegmented<T extends string>({
  options,
  value,
  onChange,
  size = "default",
  "aria-label": ariaLabel,
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (v: T) => void;
  size?: "default" | "sm";
  "aria-label"?: string;
}) {
  const btn = size === "sm" ? "rounded-md px-2.5 py-1 text-[11px] font-medium" : pg.segmentBtn;
  return (
    <div className={pg.segmentGroup} role="group" aria-label={ariaLabel}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`${btn} ${active ? pg.segmentBtnActive : pg.segmentBtnIdle}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function PlaygroundIconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={pg.iconBtn}
    >
      {children}
    </button>
  );
}

export function ToolbarDivider() {
  return <span className={pg.toolbarDivider} aria-hidden />;
}

export function PlaygroundStatusPill({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "accent" | "danger";
}) {
  const cls =
    variant === "accent"
      ? pg.statusPillAccent
      : variant === "danger"
        ? "inline-flex items-center gap-1.5 rounded-md border border-red-500/25 bg-red-500/8 px-2.5 py-1 text-[11px] font-medium text-red-700 dark:text-red-200"
        : pg.statusPill;
  return <span className={cls}>{children}</span>;
}

export function CanvasDeviceFrame({
  width,
  height,
  label,
  children,
}: {
  width: number;
  height: number;
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className={pg.canvasFrameWrap}>
      <div className={pg.canvasFrameChrome} style={{ width }}>
        <div className={pg.canvasFrameBar}>
          <span className={`${pg.canvasFrameDot} bg-red-500/80`} />
          <span className={`${pg.canvasFrameDot} bg-amber-400/80`} />
          <span className={`${pg.canvasFrameDot} bg-emerald-500/80`} />
          <span className="ml-2 font-mono text-[10px] text-white/45">
            {label ?? `${width} × ${height}`}
          </span>
        </div>
        <div className={pg.canvasFrame} style={{ width, height }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function PlaygroundPanel({
  title,
  subtitle,
  badge,
  children,
  className = "",
  hideHeader = false,
}: {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
  hideHeader?: boolean;
}) {
  return (
    <section className={`${pg.canvasPanel} ${className}`}>
      {!hideHeader ? (
        <div className={pg.canvasToolbar}>
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight text-foreground">{title}</p>
            {subtitle ? <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p> : null}
          </div>
          {badge}
        </div>
      ) : null}
      <div className={pg.panelBody}>{children}</div>
    </section>
  );
}

export function IconUndo() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6.69 3L3 13" />
    </svg>
  );
}

export function IconRedo() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 7v6h-6" />
      <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6.69 3L21 13" />
    </svg>
  );
}

export function IconDownload() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function IconSearch() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
