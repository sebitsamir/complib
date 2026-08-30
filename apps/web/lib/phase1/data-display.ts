import type { Phase1PrimitiveDef } from "./shared";
import { SURFACE, wrapRoot } from "./shared";

/** Data display primitives (5) */
export const DATA_DISPLAY: Phase1PrimitiveDef[] = [
  {
    slug: "badge",
    name: "Badge",
    category: "data-display",
    problemTags: ["build-ui-sections", "build-dashboard"],
    description: "Compact status badge for counts, tiers, and labels.",
    tags: ["data-display", "badge", "status", "primitives", "standard"],
    html: wrapRoot(`  <div class="cl-badge-row">
    <span class="cl-badge">New</span>
    <span class="cl-badge" data-tone="success">Live</span>
    <span class="cl-badge" data-tone="warning">Beta</span>
    <span class="cl-badge" data-tone="danger">Deprecated</span>
  </div>`),
    css: `${SURFACE}
.cl-badge-row{display:flex;flex-wrap:wrap;gap:8px}
.cl-badge{
  display:inline-flex;align-items:center;padding:4px 10px;border-radius:999px;
  font-size:var(--cl-font-sm);font-weight:700;letter-spacing:.02em;
  background:color-mix(in srgb,var(--cl-primary) 14%,var(--cl-surface));color:var(--cl-primary-hover);
  border:1px solid color-mix(in srgb,var(--cl-primary) 25%,transparent);
}
.cl-badge[data-tone="success"]{background:color-mix(in srgb,var(--cl-success) 16%,#fff);color:#047857;border-color:color-mix(in srgb,var(--cl-success) 30%,transparent)}
.cl-badge[data-tone="warning"]{background:color-mix(in srgb,var(--cl-warning) 18%,#fff);color:#b45309;border-color:color-mix(in srgb,var(--cl-warning) 35%,transparent)}
.cl-badge[data-tone="danger"]{background:color-mix(in srgb,var(--cl-danger) 14%,#fff);color:#b91c1c;border-color:color-mix(in srgb,var(--cl-danger) 30%,transparent)}`,
  },
  {
    slug: "avatar",
    name: "Avatar",
    category: "data-display",
    problemTags: ["build-ui-sections", "build-dashboard"],
    description: "User avatar with initials fallback and size tokens.",
    tags: ["data-display", "avatar", "user", "primitives", "standard"],
    html: wrapRoot(`  <div class="cl-avatar-row">
    <span class="cl-avatar" data-size="sm" aria-label="Alex Rivera">AR</span>
    <span class="cl-avatar" data-size="md" aria-label="Sam Chen">SC</span>
    <span class="cl-avatar" data-size="lg" aria-label="Jordan Lee">JL</span>
  </div>`),
    css: `${SURFACE}
.cl-avatar-row{display:flex;align-items:center;gap:12px}
.cl-avatar{
  display:inline-flex;align-items:center;justify-content:center;border-radius:999px;
  background:linear-gradient(135deg,var(--cl-primary),var(--cl-accent));color:#fff;font-weight:700;
  box-shadow:var(--cl-shadow);letter-spacing:.02em;
}
.cl-avatar[data-size="sm"]{width:32px;height:32px;font-size:11px}
.cl-avatar[data-size="md"]{width:44px;height:44px;font-size:14px}
.cl-avatar[data-size="lg"]{width:64px;height:64px;font-size:18px}`,
  },
  {
    slug: "chip",
    name: "Chip",
    category: "data-display",
    problemTags: ["build-form", "build-ui-sections"],
    description: "Selectable filter chip for tags and facets.",
    tags: ["data-display", "chip", "tag", "filter", "primitives", "standard"],
    html: wrapRoot(`  <div class="cl-chip-row" role="group" aria-label="Filters">
    <button type="button" class="cl-chip" data-active="true">Layout</button>
    <button type="button" class="cl-chip">Inputs</button>
    <button type="button" class="cl-chip">Typography</button>
  </div>`),
    css: `${SURFACE}
.cl-chip-row{display:flex;flex-wrap:wrap;gap:8px}
.cl-chip{
  appearance:none;cursor:pointer;font:inherit;font-size:var(--cl-font-sm);font-weight:600;
  padding:7px 12px;border-radius:999px;border:1px solid var(--cl-border);
  background:var(--cl-surface);color:var(--cl-text);transition:background .15s ease,border-color .15s ease,color .15s ease;
}
.cl-chip:hover{border-color:var(--cl-primary);color:var(--cl-primary)}
.cl-chip[data-active="true"]{background:var(--cl-primary);border-color:var(--cl-primary);color:#fff}
.cl-chip:focus-visible{outline:2px solid var(--cl-primary);outline-offset:2px}`,
    js: `(() => {
  const root = document.currentScript?.closest(".cl-ui") || document;
  root.querySelectorAll(".cl-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      root.querySelectorAll(".cl-chip").forEach((b) => b.setAttribute("data-active", "false"));
      btn.setAttribute("data-active", "true");
    });
  });
})();`,
  },
  {
    slug: "kbd",
    name: "KBD",
    category: "data-display",
    problemTags: ["build-ui-sections"],
    description: "Keyboard key indicator for shortcuts and docs.",
    tags: ["data-display", "kbd", "keyboard", "shortcut", "primitives", "standard"],
    html: wrapRoot(`  <p style="margin:0;font-size:var(--cl-font-md);color:var(--cl-text)">
    Press <kbd class="cl-kbd">⌘</kbd> <kbd class="cl-kbd">K</kbd> to open the command palette.
  </p>`),
    css: `${SURFACE}
.cl-kbd{
  display:inline-flex;align-items:center;justify-content:center;min-width:1.6em;
  padding:3px 7px;margin:0 2px;border-radius:6px;border:1px solid var(--cl-border);
  background:var(--cl-surface-muted);box-shadow:inset 0 -1px 0 rgba(15,23,42,.12);
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.85em;font-weight:600;color:var(--cl-text);
}`,
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    category: "data-display",
    problemTags: ["build-ui-sections", "build-dashboard"],
    description: "Loading placeholder shimmer for content that has not arrived yet.",
    tags: ["data-display", "skeleton", "loading", "primitives", "standard"],
    html: wrapRoot(`  <div class="cl-skeleton-card" aria-busy="true" aria-live="polite">
    <div class="cl-skeleton cl-skeleton--avatar"></div>
    <div class="cl-skeleton-lines">
      <div class="cl-skeleton cl-skeleton--line" style="width:70%"></div>
      <div class="cl-skeleton cl-skeleton--line" style="width:90%"></div>
      <div class="cl-skeleton cl-skeleton--line" style="width:55%"></div>
    </div>
  </div>`),
    css: `${SURFACE}
.cl-skeleton-card{display:flex;gap:14px;align-items:flex-start;width:100%;max-width:var(--cl-max-w-md);padding:var(--cl-pad);border:1px solid var(--cl-border);border-radius:var(--cl-radius);background:var(--cl-surface)}
.cl-skeleton-lines{flex:1;display:flex;flex-direction:column;gap:10px;padding-top:4px}
.cl-skeleton{
  background:linear-gradient(90deg,var(--cl-surface-muted) 0%,color-mix(in srgb,var(--cl-border) 65%,#fff) 50%,var(--cl-surface-muted) 100%);
  background-size:200% 100%;animation:cl-shimmer 1.4s ease-in-out infinite;border-radius:6px;
}
.cl-skeleton--avatar{width:44px;height:44px;border-radius:999px;flex-shrink:0}
.cl-skeleton--line{height:12px}
@keyframes cl-shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}
@media (prefers-reduced-motion:reduce){.cl-skeleton{animation:none}}`,
  },
];
