"use client";

import type { ReactNode } from "react";
import type { ComponentLayer } from "@/lib/component-fs";

export const adm = {
  workbench: "flex min-h-0 flex-1 flex-col overflow-hidden",
  commandBar:
    "flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border/80 bg-background/95 px-4 py-3 backdrop-blur-md sm:px-6",
  commandLeft: "flex min-w-0 flex-wrap items-center gap-2 sm:gap-3",
  commandRight: "flex flex-wrap items-center gap-2",
  workspace: "min-h-0 flex-1 overflow-auto",
  workspaceInner: "mx-auto flex h-full max-w-[1600px] flex-col gap-6 p-4 sm:p-6 lg:p-8",
  studioGrid:
    "mx-auto grid min-h-0 flex-1 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] lg:gap-6 lg:p-6 xl:grid-cols-[minmax(0,1fr)_440px]",
  studioEditor: "flex min-w-0 flex-col gap-5",
  studioPreview: "min-w-0 lg:sticky lg:top-0 lg:self-start",
  composeGrid: "grid min-h-0 flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(380px,44%)] xl:grid-cols-[minmax(0,1fr)_520px]",
  panel:
    "flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border/80 bg-background/80 shadow-sm",
  panelHead:
    "flex shrink-0 items-center justify-between gap-3 border-b border-border/60 bg-muted/30 px-4 py-3 sm:px-5",
  panelBody: "min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5",
  panelFoot:
    "shrink-0 border-t border-border/60 bg-muted/20 px-4 py-4 sm:px-5",
  section: "space-y-3",
  sectionTitle:
    "text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground",
  fieldLabel: "mb-1.5 block text-xs font-semibold text-foreground/90",
  input:
    "w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/15",
  inputMuted:
    "w-full cursor-default rounded-xl border border-border/60 bg-muted/40 px-3.5 py-2.5 font-mono text-sm text-muted-foreground",
  textarea:
    "w-full resize-y rounded-xl border border-border/80 bg-background px-3.5 py-3 font-mono text-[13px] leading-relaxed text-foreground outline-none transition-shadow focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/15",
  segmentGroup:
    "inline-flex gap-0.5 rounded-xl border border-border/70 bg-muted/30 p-1",
  segmentBtn:
    "rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-150",
  segmentActive: "bg-background text-foreground shadow-sm",
  segmentIdle: "text-muted-foreground hover:text-foreground",
  pill:
    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
  pillActive: "border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-200",
  pillIdle:
    "border-border/80 bg-background text-muted-foreground hover:border-border hover:text-foreground",
  btnPrimary:
    "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 disabled:pointer-events-none disabled:opacity-50",
  btnPrimaryCompact:
    "inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-xs font-bold text-white shadow-sm transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 disabled:pointer-events-none disabled:opacity-50",
  btnSecondary:
    "inline-flex h-9 items-center gap-2 rounded-lg border border-border/80 bg-background px-3.5 text-xs font-semibold text-foreground transition hover:bg-muted/60",
  statusOk:
    "rounded-xl border border-emerald-500/25 bg-emerald-500/8 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-200",
  statusErr:
    "rounded-xl border border-red-500/25 bg-red-500/8 px-4 py-3 text-sm text-red-800 dark:text-red-200",
  statusInfo:
    "rounded-xl border border-border/80 bg-muted/30 px-4 py-3 text-sm text-muted-foreground",
  previewWell:
    "relative min-h-[420px] flex-1 overflow-hidden bg-[radial-gradient(circle_at_1px_1px,hsl(var(--border)/0.4)_1px,transparent_0)] [background-size:18px_18px]",
  previewFrame:
    "mx-auto h-full w-full max-w-full overflow-hidden rounded-xl border border-border/80 bg-[#0a0a0f] shadow-inner",
  codeTabs:
    "flex shrink-0 gap-0.5 overflow-x-auto border-b border-border/60 bg-muted/20 px-2 pt-2",
  codeTab:
    "shrink-0 rounded-t-lg px-3 py-2 text-xs font-semibold transition-colors",
  codeTabActive: "bg-background text-foreground shadow-sm",
  codeTabIdle: "text-muted-foreground hover:text-foreground",
  taxonomyGrid: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
  taxonomyCard:
    "group rounded-xl border border-border/80 bg-background/80 p-4 transition hover:border-border hover:shadow-sm",
  statPill:
    "inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-muted/30 px-2.5 py-1 text-[11px] font-medium text-muted-foreground",
  sidebar:
    "flex w-[15.5rem] shrink-0 flex-col border-r border-border/80 bg-muted/15 lg:w-[17rem]",
  sidebarHead: "shrink-0 space-y-2 border-b border-border/60 px-4 py-4",
  sidebarTitle: "text-sm font-bold tracking-tight text-foreground",
  sidebarSubtitle: "text-[11px] text-muted-foreground",
  sidebarNewBtn:
    "mt-2 flex w-full items-center justify-center rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-500",
  sidebarScroll: "min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3",
  sidebarCategoryBtn:
    "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors",
  sidebarCategoryBtnActive: "bg-background text-foreground shadow-sm ring-1 ring-border/80",
  sidebarCategoryBtnIdle: "text-muted-foreground hover:bg-background/60 hover:text-foreground",
  sidebarFoot:
    "shrink-0 flex flex-col gap-1 border-t border-border/60 px-4 py-3 text-xs font-medium",
  sidebarLink: "text-muted-foreground transition-colors hover:text-foreground",
  wizardBar:
    "flex shrink-0 flex-wrap items-center gap-2 border-b border-border/70 bg-muted/20 px-4 py-3 sm:px-6",
  wizardStep:
    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
  wizardStepActive: "border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-200",
  wizardStepDone: "border-emerald-500/30 bg-emerald-500/8 text-emerald-800 dark:text-emerald-200",
  wizardStepIdle: "border-border/70 bg-background/80 text-muted-foreground hover:text-foreground",
  wizardDot: "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
  reviewCard:
    "rounded-xl border border-border/80 bg-muted/20 px-4 py-3 text-sm",
  packCard:
    "rounded-xl border px-3.5 py-3 text-left transition-all",
  packCardOn: "border-blue-500/35 bg-blue-500/5 ring-1 ring-blue-500/20",
  packCardOff: "border-border/80 bg-background/80 hover:border-border hover:bg-muted/30",
  packSummary:
    "rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-3",
  checklistOk: "text-emerald-700 dark:text-emerald-300",
  checklistWarn: "text-amber-700 dark:text-amber-300",
  checklistErr: "text-red-700 dark:text-red-300",
} as const;

const LAYER_ACCENT: Record<ComponentLayer, string> = {
  primitives: "border-l-emerald-500",
  patterns: "border-l-blue-500",
  sections: "border-l-violet-500",
  templates: "border-l-amber-500",
};

const LAYER_CHIP: Record<ComponentLayer, string> = {
  primitives: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  patterns: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  sections: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  templates: "bg-amber-500/10 text-amber-800 dark:text-amber-200",
};

export function layerAccent(layer: ComponentLayer) {
  return LAYER_ACCENT[layer];
}

export function layerChip(layer: ComponentLayer) {
  return LAYER_CHIP[layer];
}

export function AdminPanel({
  title,
  subtitle,
  badge,
  children,
  footer,
  className = "",
}: {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`${adm.panel} ${className}`}>
      <header className={adm.panelHead}>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
          {subtitle ? (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {badge}
      </header>
      <div className={adm.panelBody}>{children}</div>
      {footer ? <footer className={adm.panelFoot}>{footer}</footer> : null}
    </section>
  );
}

export function AdminSection({
  title,
  children,
  description,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className={adm.section}>
      <div>
        <h3 className={adm.sectionTitle}>{title}</h3>
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export function AdminField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className={adm.fieldLabel}>{label}</span>
      {children}
      {hint ? <p className="mt-1.5 text-[11px] text-muted-foreground">{hint}</p> : null}
    </label>
  );
}

export function AdminSegmented<T extends string>({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  "aria-label"?: string;
}) {
  return (
    <div className={adm.segmentGroup} role="group" aria-label={ariaLabel}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`${adm.segmentBtn} ${active ? adm.segmentActive : adm.segmentIdle}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function AdminStatPill({ children }: { children: ReactNode }) {
  return <span className={adm.statPill}>{children}</span>;
}
