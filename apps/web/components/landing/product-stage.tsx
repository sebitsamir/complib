"use client";

/**
 * Full-bleed product stage for the landing hero — a live-feeling CompLib workbench mock.
 * Not a card grid: one composition that shows browse → compose → export.
 */
export default function ProductStage() {
  return (
    <div
      className="relative mx-auto w-full max-w-6xl animate-preview-rise"
      aria-hidden
    >
      <div className="overflow-hidden border border-border/80 bg-surface shadow-[0_24px_80px_-24px_rgba(12,18,34,0.35)] dark:shadow-[0_24px_80px_-24px_rgba(0,0,0,0.65)]">
        {/* Chrome */}
        <div className="flex items-center gap-3 border-b border-border/70 bg-muted/40 px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-foreground/20" />
            <span className="h-2.5 w-2.5 rounded-sm bg-foreground/20" />
            <span className="h-2.5 w-2.5 rounded-sm bg-foreground/20" />
          </div>
          <div className="flex flex-1 items-center justify-center">
            <span className="rounded-md bg-background/80 px-3 py-1 font-mono text-[10px] text-muted-foreground">
              complib.dev/playground
            </span>
          </div>
          <span className="hidden rounded-md bg-accent px-2.5 py-1 text-[10px] font-semibold text-accent-foreground sm:inline">
            Export · Vite
          </span>
        </div>

        <div className="grid min-h-[280px] grid-cols-1 sm:min-h-[340px] sm:grid-cols-[200px_1fr] lg:min-h-[400px] lg:grid-cols-[220px_1fr_180px]">
          {/* Library rail */}
          <aside className="hidden border-r border-border/60 bg-muted/20 p-3 sm:block">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Insert
            </p>
            <ul className="space-y-1.5">
              {[
                { name: "Hero section", layer: "Sections", hot: true },
                { name: "Feature card", layer: "Patterns", hot: false },
                { name: "Pricing tier", layer: "Patterns", hot: false },
                { name: "Nav bar", layer: "Patterns", hot: false },
                { name: "FAQ block", layer: "Sections", hot: false },
              ].map((item) => (
                <li
                  key={item.name}
                  className={`rounded-lg border px-2.5 py-2 ${
                    item.hot
                      ? "border-accent/40 bg-accent-soft"
                      : "border-transparent bg-background/60"
                  }`}
                >
                  <p className="text-xs font-semibold text-foreground">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground">{item.layer}</p>
                </li>
              ))}
            </ul>
          </aside>

          {/* Artboard */}
          <div className="relative bg-blueprint p-4 sm:p-6">
            <div className="mx-auto max-w-md space-y-3 rounded-lg border border-border/80 bg-surface p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <div className="h-2.5 w-16 rounded-sm bg-foreground/80" />
                <div className="flex gap-1.5">
                  <span className="h-2 w-8 rounded-sm bg-muted" />
                  <span className="h-2 w-8 rounded-sm bg-muted" />
                  <span className="h-2.5 w-10 rounded-sm bg-accent" />
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-3 w-[85%] rounded-sm bg-foreground/70" />
                <div className="h-3 w-[62%] rounded-sm bg-foreground/40" />
                <div className="h-2 w-[70%] rounded-sm bg-muted-foreground/30" />
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="space-y-1.5 rounded-md border border-border/70 bg-muted/30 p-2"
                  >
                    <div className="h-1.5 w-6 rounded-sm bg-accent/70" />
                    <div className="h-1.5 w-full rounded-sm bg-foreground/25" />
                    <div className="h-1.5 w-3/4 rounded-sm bg-foreground/15" />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2 rounded-md border border-dashed border-accent/50 bg-accent-soft/60 px-2 py-1.5">
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />
                <span className="text-[10px] font-medium text-foreground/80">
                  Drop components · snap to grid
                </span>
              </div>
            </div>
          </div>

          {/* Inspector */}
          <aside className="hidden border-l border-border/60 bg-muted/15 p-3 lg:block">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Properties
            </p>
            <div className="space-y-3">
              <div>
                <p className="mb-1 text-[10px] font-semibold text-muted-foreground">Style</p>
                <div className="flex flex-wrap gap-1">
                  {["Default", "Compact", "Bold"].map((t, i) => (
                    <span
                      key={t}
                      className={`rounded-md px-2 py-1 text-[10px] font-medium ${
                        i === 0
                          ? "bg-accent text-accent-foreground"
                          : "bg-background text-muted-foreground"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-1 text-[10px] font-semibold text-muted-foreground">Framework</p>
                <p className="text-xs font-semibold text-foreground">Vanilla → React</p>
              </div>
              <div className="rounded-md border border-border/60 bg-background p-2 font-mono text-[9px] leading-relaxed text-muted-foreground">
                <span className="text-accent">export</span> function Hero() {"{"}
                <br />
                &nbsp;&nbsp;return &lt;section /&gt;
                <span className="inline-block h-3 w-0.5 animate-cursor-blink bg-accent align-middle" />
                <br />
                {"}"}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
