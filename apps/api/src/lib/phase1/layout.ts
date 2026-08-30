import type { Phase1PrimitiveDef } from "./shared";
import { SURFACE, wrapRoot } from "./shared";

/** Layout primitives (15) */
export const LAYOUT: Phase1PrimitiveDef[] = [
  {
    slug: "box",
    name: "Box",
    category: "layout",
    problemTags: ["build-ui-sections"],
    description:
      "Generic layout box with padding, border, and surface tokens — the atomic unit for composition.",
    tags: ["layout", "box", "primitives", "standard"],
    html: wrapRoot(`  <div class="cl-box cl-surface">
    <span class="cl-label">Box</span>
    <p style="margin:0;font-size:var(--cl-font-md);line-height:1.5">Content lives here. Use Box as a padded surface for any nested layout.</p>
  </div>`),
    css: `${SURFACE}
.cl-box{display:block;width:100%;max-width:var(--cl-max-w-md)}`,
  },
  {
    slug: "flex",
    name: "Flex",
    category: "layout",
    problemTags: ["build-ui-sections"],
    description: "Flexbox row/column helper with gap tokens. Align and distribute children without custom CSS.",
    tags: ["layout", "flex", "primitives", "standard"],
    html: wrapRoot(`  <span class="cl-label">Flex · space-between</span>
  <div class="cl-flex" data-justify="between">
    <div class="cl-flex__item cl-surface">Start</div>
    <div class="cl-flex__item cl-surface">Middle</div>
    <div class="cl-flex__item cl-surface">End</div>
  </div>`),
    css: `${SURFACE}
.cl-flex{display:flex;gap:var(--cl-gap);width:100%;max-width:var(--cl-max-w-2xl);align-items:stretch}
.cl-flex[data-direction="column"]{flex-direction:column}
.cl-flex[data-justify="between"]{justify-content:space-between}
.cl-flex[data-justify="center"]{justify-content:center}
.cl-flex[data-align="center"]{align-items:center}
.cl-flex__item{flex:1;min-width:0;text-align:center}`,
  },
  {
    slug: "grid",
    name: "Grid",
    category: "layout",
    problemTags: ["build-ui-sections"],
    description: "Responsive CSS grid with auto-fit columns and tokenized gaps.",
    tags: ["layout", "grid", "primitives", "standard"],
    html: wrapRoot(`  <span class="cl-label">Grid · auto-fit</span>
  <div class="cl-grid">
    <div class="cl-grid__cell cl-surface">1</div>
    <div class="cl-grid__cell cl-surface">2</div>
    <div class="cl-grid__cell cl-surface">3</div>
    <div class="cl-grid__cell cl-surface">4</div>
  </div>`),
    css: `${SURFACE}
.cl-grid{display:grid;gap:var(--cl-gap);width:100%;max-width:var(--cl-max-w-section);grid-template-columns:repeat(auto-fit,minmax(var(--cl-grid-min-sm),1fr))}
.cl-grid__cell{min-height:calc(72px * var(--cl-size-mult));display:flex;align-items:center;justify-content:center;font-weight:600}`,
  },
  {
    slug: "stack",
    name: "Stack",
    category: "layout",
    problemTags: ["build-ui-sections"],
    description: "Vertical or horizontal stack with consistent spacing between items.",
    tags: ["layout", "stack", "primitives", "standard"],
    html: wrapRoot(`  <div class="cl-stack" data-direction="vertical">
    <div class="cl-stack__item cl-surface">Header block</div>
    <div class="cl-stack__item cl-surface">Content block</div>
    <div class="cl-stack__item cl-surface">Footer block</div>
  </div>`),
    css: `${SURFACE}
.cl-stack{display:flex;gap:var(--cl-gap);width:100%;max-width:var(--cl-max-w-2xl)}
.cl-stack[data-direction="horizontal"]{flex-direction:row;flex-wrap:wrap}
.cl-stack[data-direction="vertical"]{flex-direction:column}
.cl-stack__item{flex:1;min-width:0}`,
  },
  {
    slug: "hstack",
    name: "HStack",
    category: "layout",
    problemTags: ["build-ui-sections"],
    description: "Horizontal stack shortcut — row direction with wrap and gap tokens.",
    tags: ["layout", "hstack", "flex", "primitives", "standard"],
    html: wrapRoot(`  <span class="cl-label">HStack</span>
  <div class="cl-hstack">
    <div class="cl-surface">Nav</div>
    <div class="cl-surface">Search</div>
    <div class="cl-surface">Actions</div>
  </div>`),
    css: `${SURFACE}
.cl-hstack{display:flex;flex-direction:row;flex-wrap:wrap;align-items:center;gap:var(--cl-gap);width:100%;max-width:var(--cl-max-w-2xl)}`,
  },
  {
    slug: "vstack",
    name: "VStack",
    category: "layout",
    problemTags: ["build-ui-sections"],
    description: "Vertical stack shortcut — column direction with gap tokens.",
    tags: ["layout", "vstack", "flex", "primitives", "standard"],
    html: wrapRoot(`  <span class="cl-label">VStack</span>
  <div class="cl-vstack">
    <div class="cl-surface">Title</div>
    <div class="cl-surface">Body</div>
    <div class="cl-surface">Meta</div>
  </div>`),
    css: `${SURFACE}
.cl-vstack{display:flex;flex-direction:column;gap:var(--cl-gap);width:100%;max-width:var(--cl-max-w-md)}`,
  },
  {
    slug: "container",
    name: "Container",
    category: "layout",
    problemTags: ["build-ui-sections"],
    description: "Centered content container with max-width tokens for readable page shells.",
    tags: ["layout", "container", "primitives", "standard"],
    html: wrapRoot(`  <div class="cl-container">
    <div class="cl-surface">
      <span class="cl-label">Container</span>
      <p style="margin:0;font-size:var(--cl-font-md);line-height:1.5">Constrained width, centered on the page. Ideal for article and marketing shells.</p>
    </div>
  </div>`),
    css: `${SURFACE}
.cl-container{width:100%;max-width:var(--cl-max-w-narrow);margin-inline:auto;padding-inline:var(--cl-pad)}`,
  },
  {
    slug: "section",
    name: "Section",
    category: "layout",
    problemTags: ["build-landing-page", "build-ui-sections"],
    description: "Page section band with vertical rhythm — heroes, features, and CTAs.",
    tags: ["layout", "section", "primitives", "standard"],
    html: wrapRoot(`  <section class="cl-section">
    <div class="cl-section__inner">
      <span class="cl-label">Section</span>
      <h2 class="cl-section__title">Ship faster with clear structure</h2>
      <p class="cl-section__body">Supporting copy sits in a padded band with consistent vertical rhythm.</p>
    </div>
  </section>`),
    css: `${SURFACE}
.cl-section{width:100%;padding-block:calc(var(--cl-pad) * 2.25);background:var(--cl-surface-muted);border-radius:var(--cl-radius)}
.cl-section__inner{width:100%;max-width:var(--cl-max-w-narrow);margin-inline:auto;padding-inline:var(--cl-pad)}
.cl-section__title{margin:0 0 10px;font-size:var(--cl-font-xl);font-weight:700;letter-spacing:-.02em;line-height:1.2}
.cl-section__body{margin:0;color:var(--cl-text-muted);font-size:var(--cl-font-md);line-height:1.55;max-width:42ch}`,
  },
  {
    slug: "center",
    name: "Center",
    category: "layout",
    problemTags: ["build-ui-sections"],
    description: "Centers children both horizontally and vertically within a min-height frame.",
    tags: ["layout", "center", "primitives", "standard"],
    html: wrapRoot(`  <div class="cl-center">
    <div class="cl-surface" style="text-align:center;max-width:var(--cl-max-w-xs)">
      <span class="cl-label">Center</span>
      <p style="margin:0;font-size:var(--cl-font-md)">Perfectly centered content.</p>
    </div>
  </div>`),
    css: `${SURFACE}
.cl-center{display:flex;align-items:center;justify-content:center;width:100%;min-height:var(--cl-shell-min-h);padding:var(--cl-pad)}`,
  },
  {
    slug: "spacer",
    name: "Spacer",
    category: "layout",
    problemTags: ["build-ui-sections"],
    description: "Invisible spacing primitive. Push layout apart with size tokens instead of magic margins.",
    tags: ["layout", "spacer", "primitives", "standard"],
    html: wrapRoot(`  <div class="cl-surface">Above</div>
  <div class="cl-spacer" data-size="md" aria-hidden="true"></div>
  <div class="cl-surface">Below</div>`),
    css: `${SURFACE}
.cl-spacer{display:block;width:100%;flex-shrink:0;height:calc(24px * var(--cl-size-mult) * var(--cl-density-mult))}
.cl-spacer[data-size="xs"]{height:calc(8px * var(--cl-size-mult))}
.cl-spacer[data-size="sm"]{height:calc(12px * var(--cl-size-mult))}
.cl-spacer[data-size="md"]{height:calc(24px * var(--cl-size-mult))}
.cl-spacer[data-size="lg"]{height:calc(40px * var(--cl-size-mult))}
.cl-spacer[data-size="xl"]{height:calc(64px * var(--cl-size-mult))}`,
  },
  {
    slug: "divider",
    name: "Divider",
    category: "layout",
    problemTags: ["build-ui-sections"],
    description: "Horizontal or vertical rule to separate content groups.",
    tags: ["layout", "divider", "separator", "primitives", "standard"],
    html: wrapRoot(`  <div class="cl-surface">Top content</div>
  <hr class="cl-divider" />
  <div class="cl-surface">Bottom content</div>`),
    css: `${SURFACE}
.cl-divider{border:0;border-top:1px solid var(--cl-border);margin:var(--cl-gap) 0;width:100%}
.cl-divider[data-orientation="vertical"]{border-top:0;border-left:1px solid var(--cl-border);width:1px;height:auto;align-self:stretch;margin:0 var(--cl-gap)}`,
  },
  {
    slug: "aspect-ratio",
    name: "Aspect Ratio",
    category: "layout",
    problemTags: ["build-ui-sections"],
    description: "Locks a child to a fixed aspect ratio (16:9, 4:3, 1:1) for media and placeholders.",
    tags: ["layout", "aspect-ratio", "media", "primitives", "standard"],
    html: wrapRoot(`  <span class="cl-label">Aspect ratio · 16:9</span>
  <div class="cl-aspect" data-ratio="16/9">
    <div class="cl-aspect__inner cl-surface">Media / preview</div>
  </div>`),
    css: `${SURFACE}
.cl-aspect{position:relative;width:100%;max-width:var(--cl-max-w-lg);aspect-ratio:16/9;border-radius:var(--cl-radius);overflow:hidden}
.cl-aspect[data-ratio="1/1"]{aspect-ratio:1/1}
.cl-aspect[data-ratio="4/3"]{aspect-ratio:4/3}
.cl-aspect[data-ratio="16/9"]{aspect-ratio:16/9}
.cl-aspect__inner{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;border-radius:0;margin:0;font-weight:600}`,
  },
  {
    slug: "absolute",
    name: "Absolute",
    category: "layout",
    problemTags: ["build-ui-sections"],
    description: "Positioning frame for absolutely placed children (badges, floating actions, overlays).",
    tags: ["layout", "absolute", "position", "primitives", "standard"],
    html: wrapRoot(`  <div class="cl-absolute-frame cl-surface">
    <p style="margin:0;font-size:var(--cl-font-md)">Relative parent</p>
    <span class="cl-absolute-pin">Pinned</span>
  </div>`),
    css: `${SURFACE}
.cl-absolute-frame{position:relative;width:100%;max-width:var(--cl-max-w-md);min-height:calc(140px * var(--cl-size-mult))}
.cl-absolute-pin{
  position:absolute;top:var(--cl-pad);right:var(--cl-pad);
  background:var(--cl-primary);color:#fff;font-size:var(--cl-font-sm);font-weight:600;
  padding:6px 10px;border-radius:var(--cl-radius);box-shadow:var(--cl-shadow);
}`,
  },
  {
    slug: "sticky",
    name: "Sticky",
    category: "layout",
    problemTags: ["build-navigation", "build-ui-sections"],
    description: "Sticky positioning wrapper for headers and sidebars that remain in view while scrolling.",
    tags: ["layout", "sticky", "header", "primitives", "standard"],
    html: wrapRoot(`  <div class="cl-sticky-demo">
    <div class="cl-sticky cl-surface">Sticky header — stays in view</div>
    <div class="cl-sticky-demo__body">
      <p class="cl-surface">Scroll content block A</p>
      <p class="cl-surface">Scroll content block B</p>
      <p class="cl-surface">Scroll content block C</p>
    </div>
  </div>`),
    css: `${SURFACE}
.cl-sticky-demo{max-height:calc(220px * var(--cl-size-mult));overflow:auto;border:1px solid var(--cl-border);border-radius:var(--cl-radius);width:100%;max-width:var(--cl-max-w-lg)}
.cl-sticky{position:sticky;top:0;z-index:2;border-radius:0;border-left:0;border-right:0;border-top:0;font-weight:600}
.cl-sticky-demo__body{display:flex;flex-direction:column;gap:var(--cl-gap);padding:var(--cl-pad)}
.cl-sticky-demo__body .cl-surface{margin:0}`,
  },
  {
    slug: "overlay",
    name: "Overlay",
    category: "layout",
    problemTags: ["build-ui-sections"],
    description: "Dimmed overlay scrim for modals, drawers, and focus traps — theme-aware opacity.",
    tags: ["layout", "overlay", "scrim", "primitives", "standard"],
    html: wrapRoot(`  <div class="cl-overlay-stage cl-surface">
    <p style="margin:0;font-size:var(--cl-font-md)">Page content behind scrim</p>
    <div class="cl-overlay" role="presentation" aria-hidden="true"></div>
    <div class="cl-overlay__panel">Dialog preview</div>
  </div>`),
    css: `${SURFACE}
.cl-overlay-stage{position:relative;width:100%;max-width:var(--cl-max-w-lg);min-height:calc(180px * var(--cl-size-mult));overflow:hidden}
.cl-overlay{position:absolute;inset:0;background:rgba(15,23,42,.45);backdrop-filter:blur(2px)}
.cl-overlay__panel{
  position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
  background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);
  padding:var(--cl-pad);box-shadow:var(--cl-shadow);font-weight:600;z-index:1;min-width:40%;
  text-align:center;
}`,
  },
];
