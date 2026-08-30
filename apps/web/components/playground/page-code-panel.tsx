"use client";

import type { PlaygroundPageSource } from "@/lib/playground-page-artifact";
import { pg } from "@/components/playground/playground-shell";

export type PageCodeTab = "html" | "layout" | "components" | "js";

const TABS: { id: PageCodeTab; label: string; field: keyof PlaygroundPageSource }[] = [
  { id: "html", label: "HTML", field: "html" },
  { id: "layout", label: "Layout CSS", field: "layoutCss" },
  { id: "components", label: "Components CSS", field: "componentsCss" },
  { id: "js", label: "JavaScript", field: "js" },
];

export default function PageCodePanel({
  source,
  codeDetached,
  activeTab,
  onTabChange,
  onChange,
  onResetFromCanvas,
  loading,
}: {
  source: PlaygroundPageSource;
  codeDetached: boolean;
  activeTab: PageCodeTab;
  onTabChange: (tab: PageCodeTab) => void;
  onChange: (tab: PageCodeTab, value: string) => void;
  onResetFromCanvas: () => void;
  loading: boolean;
}) {
  const active = TABS.find((t) => t.id === activeTab) ?? TABS[0];
  const value = String(source[active.field] ?? "");

  return (
    <section className={`${pg.canvasPanel} min-h-0 border-b border-border/60 xl:border-b-0 xl:border-r`}>
      <div className={pg.canvasToolbar}>
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-tight text-foreground">Page source</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {codeDetached
              ? "Custom edits — preview updates live; Download uses this source"
              : "Same files as Download — document flow from canvas order (not absolute collage)"}
          </p>
        </div>
        <button type="button" onClick={onResetFromCanvas} className={pg.btnGhost} disabled={loading}>
          Reset from canvas
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 gap-0.5 overflow-x-auto border-b border-border/60 bg-muted/20 px-2 pt-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`shrink-0 rounded-t-lg px-3 py-2 text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center p-8 text-sm text-muted-foreground">
            Loading page source…
          </div>
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(activeTab, e.target.value)}
            spellCheck={false}
            className="min-h-[240px] flex-1 resize-none border-0 bg-background p-4 font-mono text-[13px] leading-relaxed text-foreground outline-none focus:ring-0"
            aria-label={`${active.label} editor`}
          />
        )}
      </div>
    </section>
  );
}
