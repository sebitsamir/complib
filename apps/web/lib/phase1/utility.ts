import type { Phase1PrimitiveDef } from "./shared";
import { SURFACE, wrapRoot } from "./shared";

/** Utility / accessibility primitives (5) */
export const UTILITY: Phase1PrimitiveDef[] = [
  {
    slug: "scroll-area",
    name: "Scroll Area",
    category: "utility",
    problemTags: ["build-ui-sections", "build-dashboard"],
    description: "Constrained scroll region with subtle custom scrollbar styling.",
    tags: ["utility", "scroll", "overflow", "primitives", "standard"],
    html: wrapRoot(`  <div class="cl-scroll" tabindex="0">
    <p class="cl-surface">Item one</p>
    <p class="cl-surface">Item two</p>
    <p class="cl-surface">Item three</p>
    <p class="cl-surface">Item four</p>
    <p class="cl-surface">Item five</p>
  </div>`),
    css: `${SURFACE}
.cl-scroll{
  display:flex;flex-direction:column;gap:var(--cl-gap);max-height:calc(180px * var(--cl-size-mult));
  overflow:auto;padding:var(--cl-pad);border:1px solid var(--cl-border);border-radius:var(--cl-radius);
  background:var(--cl-surface-muted);max-width:var(--cl-max-w-md);
}
.cl-scroll .cl-surface{margin:0}
.cl-scroll:focus-visible{outline:2px solid var(--cl-primary);outline-offset:2px}
.cl-scroll::-webkit-scrollbar{width:8px}
.cl-scroll::-webkit-scrollbar-thumb{background:color-mix(in srgb,var(--cl-border) 80%,var(--cl-text-muted));border-radius:999px}`,
  },
  {
    slug: "visually-hidden",
    name: "Visually Hidden",
    category: "utility",
    problemTags: ["build-ui-sections"],
    description: "Screen-reader-only text — visually hidden but announced by assistive tech.",
    tags: ["utility", "a11y", "sr-only", "primitives", "standard"],
    html: wrapRoot(`  <button type="button" class="cl-surface" style="cursor:pointer;font:inherit">
    <span aria-hidden="true">🔔</span>
    <span class="cl-vh">3 unread notifications</span>
  </button>
  <p class="cl-hint">The badge text is visually hidden but available to screen readers.</p>`),
    css: `${SURFACE}
.cl-vh{
  position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;
  overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important;
}`,
  },
  {
    slug: "focus-ring",
    name: "Focus Ring",
    category: "utility",
    problemTags: ["build-ui-sections"],
    description: "Consistent focus-visible ring utility for keyboard accessibility.",
    tags: ["utility", "a11y", "focus", "primitives", "standard"],
    html: wrapRoot(`  <div class="cl-focus-demo">
    <button type="button" class="cl-focus-target">Tab to focus</button>
    <a class="cl-focus-target" href="#">Focusable link</a>
  </div>
  <p class="cl-hint">Uses :focus-visible so mouse clicks stay quiet.</p>`),
    css: `${SURFACE}
.cl-focus-demo{display:flex;flex-wrap:wrap;gap:var(--cl-gap)}
.cl-focus-target{
  appearance:none;font:inherit;font-size:var(--cl-font-md);font-weight:600;cursor:pointer;text-decoration:none;
  padding:10px 14px;border-radius:var(--cl-radius);border:1px solid var(--cl-border);
  background:var(--cl-surface);color:var(--cl-text);box-shadow:var(--cl-shadow);
}
.cl-focus-target:focus{outline:none}
.cl-focus-target:focus-visible{
  outline:2px solid var(--cl-primary);outline-offset:3px;
  box-shadow:0 0 0 4px color-mix(in srgb,var(--cl-primary) 25%,transparent);
}`,
  },
  {
    slug: "surface",
    name: "Surface",
    category: "utility",
    problemTags: ["build-ui-sections"],
    description: "Elevated surface token demo — the shared panel used across CompLib.",
    tags: ["utility", "surface", "panel", "primitives", "standard"],
    html: wrapRoot(`  <div class="cl-surface-stack">
    <div class="cl-surface" data-level="flat">Flat surface</div>
    <div class="cl-surface" data-level="raised">Raised surface</div>
    <div class="cl-surface" data-level="overlay">Overlay surface</div>
  </div>`),
    css: `${SURFACE}
.cl-surface-stack{display:flex;flex-direction:column;gap:var(--cl-gap);max-width:var(--cl-max-w-md)}
.cl-surface[data-level="flat"]{box-shadow:none;background:var(--cl-surface-muted)}
.cl-surface[data-level="raised"]{box-shadow:var(--cl-shadow)}
.cl-surface[data-level="overlay"]{box-shadow:0 22px 50px rgba(15,23,42,.18)}`,
  },
  {
    slug: "separator",
    name: "Separator",
    category: "utility",
    problemTags: ["build-ui-sections"],
    description: "Semantic separator with optional label for toolbar and menu groups.",
    tags: ["utility", "separator", "divider", "primitives", "standard"],
    html: wrapRoot(`  <div class="cl-sep-demo">
    <span>Account</span>
    <div class="cl-separator" role="separator"><span class="cl-separator__label">or</span></div>
    <span>Workspace</span>
  </div>`),
    css: `${SURFACE}
.cl-sep-demo{display:flex;flex-direction:column;gap:12px;max-width:var(--cl-max-w-sm);font-size:var(--cl-font-md);color:var(--cl-text)}
.cl-separator{display:flex;align-items:center;gap:12px;color:var(--cl-text-muted);font-size:var(--cl-font-sm);font-weight:600}
.cl-separator::before,.cl-separator::after{content:"";flex:1;height:1px;background:var(--cl-border)}
.cl-separator__label{flex-shrink:0}`,
  },
];
