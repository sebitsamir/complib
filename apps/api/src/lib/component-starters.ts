import type { ComponentLayer, ComponentVariant } from "./component-fs";
import {
  CHROME_VARIANTS,
  DENSITY_VARIANTS,
  EMPHASIS_VARIANTS,
  mergeVariants,
  PATTERN_VARIANTS,
  PRIMITIVE_VARIANTS,
  RADIUS_VARIANTS,
  SCALABLE_TOKENS_CSS,
  SECTION_VARIANTS,
  SIZE_VARIANTS,
  TONE_VARIANTS,
} from "./design-tokens";
import {
  getCategoriesForLayer,
  getCategoryDef,
  type ProblemTag,
} from "./taxonomy-defaults";

export type ComponentStarter = {
  name: string;
  slug: string;
  description: string;
  layer: ComponentLayer;
  category: string;
  problemTags: ProblemTag[];
  tier: "FREE" | "PRO";
  themes: Array<"light" | "dark" | "auto">;
  variants: ComponentVariant[];
  html: string;
  css: string;
  js: string;
};

export { SCALABLE_TOKENS_CSS };

type StarterDef = Omit<ComponentStarter, "layer" | "category" | "problemTags"> & {
  problemTags?: ProblemTag[];
};

function wrap(html: string, extraCss: string, js = ""): Pick<ComponentStarter, "html" | "css" | "js"> {
  return {
    html,
    css: `${SCALABLE_TOKENS_CSS}\n${extraCss}`,
    js,
  };
}

const STARTERS: Record<string, StarterDef> = {
  "primitives:layout": {
    name: "Box",
    slug: "box",
    description:
      "Generic layout box with padding, border, and surface tokens. The base unit for composition.",
    tier: "FREE",
    themes: ["light", "dark", "auto"],
    variants: PRIMITIVE_VARIANTS,
    ...wrap(
      `<div class="cl-ui" data-size="md" data-tone="default" data-density="normal" data-radius="rounded">
  <div class="cl-box cl-surface">
    <p class="cl-label" style="font-size:var(--cl-font-sm);color:var(--cl-text-muted);margin:0 0 8px">Box</p>
    <p style="margin:0;font-size:var(--cl-font-md)">Content lives here.</p>
  </div>
</div>`,
      `.cl-surface{background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);padding:var(--cl-pad);box-shadow:var(--cl-shadow);color:var(--cl-text)}
.cl-box{display:block;width:100%;max-width:var(--cl-max-w-md)}`,
    ),
  },
  "primitives:typography": {
    name: "Heading",
    slug: "heading",
    description: "Semantic heading scale (h1–h6) with tight tracking and size tokens.",
    tier: "FREE",
    themes: ["light", "dark", "auto"],
    variants: mergeVariants(SIZE_VARIANTS, DENSITY_VARIANTS),
    ...wrap(
      `<div class="cl-ui cl-type" data-size="md" data-density="normal">
  <h1 style="margin:0;font-size:var(--cl-font-xl);letter-spacing:-.03em">Display heading</h1>
  <h2 style="margin:8px 0 0;font-size:var(--cl-font-lg)">Section heading</h2>
</div>`,
      `.cl-type{max-width:var(--cl-max-w-xl);color:var(--cl-text)}`,
    ),
  },
  "primitives:inputs": {
    name: "Button",
    slug: "button",
    description: "Primary action button with size, tone, and style variants.",
    tier: "FREE",
    themes: ["light", "dark", "auto"],
    variants: mergeVariants(SIZE_VARIANTS, TONE_VARIANTS, DENSITY_VARIANTS, RADIUS_VARIANTS),
    ...wrap(
      `<div class="cl-ui" data-size="md" data-tone="default" data-density="normal" data-radius="rounded">
  <button type="button" class="cl-btn">Continue</button>
</div>`,
      `.cl-btn{appearance:none;display:inline-flex;align-items:center;justify-content:center;font:inherit;font-size:var(--cl-font-md);font-weight:600;cursor:pointer;border-radius:var(--cl-radius);border:0;padding:10px 16px;background:var(--cl-primary);color:#fff;box-shadow:var(--cl-shadow)}
.cl-btn:hover{background:var(--cl-primary-hover)}`,
    ),
  },
  "primitives:data-display": {
    name: "Badge",
    slug: "badge",
    description: "Compact status badge for counts, tiers, and labels.",
    tier: "FREE",
    themes: ["light", "dark", "auto"],
    variants: mergeVariants(SIZE_VARIANTS, TONE_VARIANTS),
    ...wrap(
      `<div class="cl-ui" data-size="md" data-tone="default"><span class="cl-badge">New</span></div>`,
      `.cl-badge{display:inline-flex;padding:4px 10px;border-radius:999px;font-size:var(--cl-font-sm);font-weight:700;background:color-mix(in srgb,var(--cl-primary) 14%,#fff);color:var(--cl-primary-hover)}`,
    ),
  },
  "primitives:utility": {
    name: "Surface",
    slug: "surface",
    description: "Elevated surface token demo — the shared panel used across CompLib.",
    tier: "FREE",
    themes: ["light", "dark", "auto"],
    variants: PRIMITIVE_VARIANTS,
    ...wrap(
      `<div class="cl-ui" data-size="md" data-tone="default" data-radius="rounded"><div class="cl-surface">Surface</div></div>`,
      `.cl-surface{background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);padding:var(--cl-pad);box-shadow:var(--cl-shadow)}`,
    ),
  },
  "primitives:feedback": {
    name: "Alert",
    slug: "feedback-alert",
    description: "Inline feedback banner with semantic tone colors.",
    tier: "FREE",
    themes: ["light", "dark", "auto"],
    variants: mergeVariants(SIZE_VARIANTS, TONE_VARIANTS, EMPHASIS_VARIANTS),
    ...wrap(
      `<div class="cl-ui cl-alert" data-size="md" data-tone="default" data-emphasis="balanced" role="status">
  <strong class="cl-alert__title">Update available</strong>
  <p class="cl-alert__body">A new version is ready. Review changes before deploying.</p>
</div>`,
      `.cl-alert{max-width:var(--cl-max-w-lg);padding:var(--cl-pad);border-radius:var(--cl-radius);border:1px solid color-mix(in srgb,var(--cl-primary) 35%,var(--cl-border));background:color-mix(in srgb,var(--cl-primary) 8%,var(--cl-surface))}
.cl-alert__title{display:block;font-size:var(--cl-font-md);margin-bottom:4px}
.cl-alert__body{margin:0;font-size:var(--cl-font-sm);color:var(--cl-text-muted)}`,
    ),
  },
  "primitives:overlay": {
    name: "Modal Shell",
    slug: "overlay-modal",
    description: "Dialog overlay primitive with centered panel.",
    tier: "FREE",
    themes: ["light", "dark", "auto"],
    variants: mergeVariants(SIZE_VARIANTS, TONE_VARIANTS, EMPHASIS_VARIANTS),
    ...wrap(
      `<div class="cl-ui cl-modal" data-size="md" data-tone="default" data-emphasis="bold">
  <div class="cl-modal__backdrop"></div>
  <div class="cl-modal__panel" role="dialog" aria-modal="true">
    <h3 class="cl-modal__title">Confirm action</h3>
    <p class="cl-modal__body">This modal shell scales with size tokens and supports dark tone.</p>
    <div class="cl-modal__actions">
      <button type="button" class="cl-btn cl-btn--ghost">Cancel</button>
      <button type="button" class="cl-btn cl-btn--primary">Confirm</button>
    </div>
  </div>
</div>`,
      `.cl-modal{position:relative;width:100%;max-width:var(--cl-max-w-xl);min-height:var(--cl-shell-min-h)}
.cl-modal__backdrop{position:absolute;inset:0;background:rgba(15,23,42,.55);border-radius:var(--cl-radius)}
.cl-modal__panel{position:relative;margin:calc(48px * var(--cl-size-mult)) calc(24px * var(--cl-size-mult));padding:var(--cl-pad);background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);box-shadow:var(--cl-shadow)}
.cl-modal__title{margin:0 0 8px;font-size:var(--cl-font-lg)}
.cl-modal__body{margin:0 0 var(--cl-gap);font-size:var(--cl-font-sm);color:var(--cl-text-muted)}
.cl-modal__actions{display:flex;gap:calc(8px * var(--cl-size-mult));justify-content:flex-end}
.cl-btn{padding:calc(8px * var(--cl-size-mult)) calc(14px * var(--cl-size-mult));border-radius:calc(8px * var(--cl-size-mult));font-size:var(--cl-font-sm);font-weight:600;border:1px solid transparent;cursor:pointer}
.cl-btn--ghost{background:transparent;border-color:var(--cl-border);color:var(--cl-text)}
.cl-btn--primary{background:var(--cl-primary);color:#fff}`,
    ),
  },
  "patterns:cards": {
    name: "Feature Card",
    slug: "card-feature",
    description: "Composable card pattern with icon, title, and CTA.",
    tier: "FREE",
    themes: ["light", "dark", "auto"],
    variants: PATTERN_VARIANTS,
    ...wrap(
      `<article class="cl-ui cl-card" data-size="md" data-tone="default" data-density="normal" data-radius="rounded" data-emphasis="balanced">
  <div class="cl-card__icon">⚡</div>
  <h3 class="cl-card__title">Fast delivery</h3>
  <p class="cl-card__body">Ship polished UI blocks with scalable tokens for size and brand color.</p>
  <button type="button" class="cl-card__cta">Learn more</button>
</article>`,
      `.cl-card{max-width:var(--cl-max-w-sm);padding:var(--cl-pad);background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);box-shadow:var(--cl-shadow)}
.cl-card__icon{width:var(--cl-icon-md);height:var(--cl-icon-md);display:grid;place-items:center;border-radius:var(--cl-radius);background:color-mix(in srgb,var(--cl-primary) 12%,transparent);margin-bottom:var(--cl-gap)}
.cl-card__title{margin:0 0 8px;font-size:var(--cl-font-lg)}
.cl-card__body{margin:0 0 var(--cl-gap);font-size:var(--cl-font-sm);color:var(--cl-text-muted);line-height:1.5}
.cl-card__cta{padding:calc(8px * var(--cl-size-mult)) calc(14px * var(--cl-size-mult));border:none;border-radius:calc(8px * var(--cl-size-mult));background:var(--cl-primary);color:#fff;font-weight:600;cursor:pointer}`,
    ),
  },
  "patterns:navigation": {
    name: "Navigation Bar",
    slug: "nav-bar",
    description: "Top navigation pattern with brand, links, and CTA.",
    tier: "FREE",
    themes: ["light", "dark", "auto"],
    variants: CHROME_VARIANTS,
    ...wrap(
      `<nav class="cl-ui cl-nav" data-size="md" data-tone="default" data-emphasis="balanced" aria-label="Main">
  <span class="cl-nav__brand">CompLib</span>
  <div class="cl-nav__links">
    <a href="#">Product</a><a href="#">Pricing</a><a href="#">Docs</a>
  </div>
  <button type="button" class="cl-nav__cta">Get started</button>
</nav>`,
      `.cl-nav{display:flex;align-items:center;gap:var(--cl-gap);width:100%;max-width:var(--cl-max-w-section);padding:var(--cl-pad);background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius)}
.cl-nav__brand{font-weight:800;font-size:var(--cl-font-lg)}
.cl-nav__links{display:flex;gap:var(--cl-gap);margin-left:auto;font-size:var(--cl-font-sm)}
.cl-nav__links a{color:var(--cl-text-muted);text-decoration:none}
.cl-nav__links a:hover{color:var(--cl-text)}
.cl-nav__cta{padding:calc(8px * var(--cl-size-mult)) calc(14px * var(--cl-size-mult));border:none;border-radius:calc(8px * var(--cl-size-mult));background:var(--cl-primary);color:#fff;font-weight:600;cursor:pointer}`,
    ),
  },
  "patterns:forms": {
    name: "Form Group",
    slug: "form-group",
    description: "Labelled form fields with submit action.",
    tier: "FREE",
    themes: ["light", "dark", "auto"],
    variants: mergeVariants(SIZE_VARIANTS, TONE_VARIANTS, DENSITY_VARIANTS, RADIUS_VARIANTS),
    ...wrap(
      `<form class="cl-ui cl-form" data-size="md" data-tone="default" data-density="normal" data-radius="rounded">
  <label class="cl-form__field"><span>Name</span><input type="text" placeholder="Jane Doe" /></label>
  <label class="cl-form__field"><span>Company</span><input type="text" placeholder="Acme Inc." /></label>
  <button type="submit" class="cl-form__submit">Submit</button>
</form>`,
      `.cl-form{display:flex;flex-direction:column;gap:var(--cl-gap);max-width:var(--cl-max-w-form);padding:var(--cl-pad);background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius)}
.cl-form__field{display:flex;flex-direction:column;gap:calc(6px * var(--cl-size-mult));font-size:var(--cl-font-sm);font-weight:600}
.cl-form__field input{padding:calc(10px * var(--cl-size-mult)) 12px;border:1px solid var(--cl-border);border-radius:calc(8px * var(--cl-size-mult));background:var(--cl-surface-muted);color:var(--cl-text)}
.cl-form__submit{padding:calc(10px * var(--cl-size-mult)) 16px;border:none;border-radius:calc(8px * var(--cl-size-mult));background:var(--cl-primary);color:#fff;font-weight:700;cursor:pointer}`,
    ),
  },
  "patterns:tables": {
    name: "Data Table",
    slug: "table-data",
    description: "Responsive data table pattern with zebra rows.",
    tier: "FREE",
    themes: ["light", "dark", "auto"],
    variants: mergeVariants(SIZE_VARIANTS, DENSITY_VARIANTS, TONE_VARIANTS),
    ...wrap(
      `<div class="cl-ui cl-table-wrap" data-size="md" data-density="normal" data-tone="default">
  <table class="cl-table">
    <thead><tr><th>Name</th><th>Status</th><th>Plan</th></tr></thead>
    <tbody>
      <tr><td>Alex Kim</td><td>Active</td><td>Pro</td></tr>
      <tr><td>Sam Rivera</td><td>Trialing</td><td>Free</td></tr>
      <tr><td>Jordan Lee</td><td>Active</td><td>Enterprise</td></tr>
    </tbody>
  </table>
</div>`,
      `.cl-table-wrap{width:100%;max-width:var(--cl-max-w-2xl);overflow:auto;border:1px solid var(--cl-border);border-radius:var(--cl-radius);background:var(--cl-surface)}
.cl-table{width:100%;border-collapse:collapse;font-size:var(--cl-font-sm)}
.cl-table th,.cl-table td{padding:calc(var(--cl-pad)*.65) var(--cl-pad);text-align:left;border-bottom:1px solid var(--cl-border)}
.cl-table th{font-size:var(--cl-font-sm);color:var(--cl-text-muted);font-weight:600;background:var(--cl-surface-muted)}
.cl-table tbody tr:nth-child(even){background:color-mix(in srgb,var(--cl-surface-muted) 80%,transparent)}`,
    ),
  },
  "patterns:pricing": {
    name: "Pricing Tier",
    slug: "pricing-tier",
    description: "Single pricing tier card for plan comparison rows.",
    tier: "FREE",
    themes: ["light", "dark", "auto"],
    variants: mergeVariants(TONE_VARIANTS, SIZE_VARIANTS, EMPHASIS_VARIANTS),
    ...wrap(
      `<article class="cl-ui cl-price" data-tone="brand" data-size="md" data-emphasis="bold">
  <p class="cl-price__name">Pro</p>
  <p class="cl-price__amount"><span>$29</span>/mo</p>
  <ul class="cl-price__features"><li>Unlimited components</li><li>Source export</li><li>Priority support</li></ul>
  <button type="button" class="cl-price__cta">Start trial</button>
</article>`,
      `.cl-price{max-width:var(--cl-max-w-xs);padding:var(--cl-pad);border:1px solid var(--cl-border);border-radius:var(--cl-radius);background:var(--cl-surface);box-shadow:var(--cl-shadow)}
.cl-price__name{margin:0 0 4px;font-weight:700;font-size:var(--cl-font-md)}
.cl-price__amount{margin:0 0 var(--cl-gap);font-size:var(--cl-font-sm);color:var(--cl-text-muted)}
.cl-price__amount span{font-size:var(--cl-font-xl);font-weight:800;color:var(--cl-text)}
.cl-price__features{margin:0 0 var(--cl-gap);padding-left:18px;font-size:var(--cl-font-sm);color:var(--cl-text-muted)}
.cl-price__cta{width:100%;padding:calc(10px * var(--cl-size-mult));border:none;border-radius:calc(8px * var(--cl-size-mult));background:var(--cl-primary);color:#fff;font-weight:700;cursor:pointer}`,
    ),
  },
  "sections:hero": {
    name: "Hero Banner",
    slug: "section-hero",
    description: "Full-width hero section with headline, subcopy, and dual CTAs.",
    tier: "FREE",
    themes: ["light", "dark", "auto"],
    variants: SECTION_VARIANTS,
    ...wrap(
      `<section class="cl-ui cl-hero" data-size="lg" data-tone="brand" data-density="spacious" data-emphasis="bold">
  <p class="cl-hero__eyebrow">Launch faster</p>
  <h1 class="cl-hero__title">Build production UI in hours, not weeks</h1>
  <p class="cl-hero__sub">Composable primitives, patterns, and sections — all scalable by size and color.</p>
  <div class="cl-hero__actions">
    <button type="button" class="cl-hero__btn cl-hero__btn--primary">Start building</button>
    <button type="button" class="cl-hero__btn cl-hero__btn--ghost">View library</button>
  </div>
</section>`,
      `.cl-hero{width:100%;max-width:var(--cl-max-w-section);padding:calc(var(--cl-pad)*2);border-radius:calc(var(--cl-radius)*1.5);background:linear-gradient(135deg,color-mix(in srgb,var(--cl-primary) 10%,var(--cl-surface)),var(--cl-surface));border:1px solid var(--cl-border)}
.cl-hero__eyebrow{margin:0 0 12px;font-size:var(--cl-font-sm);font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--cl-primary)}
.cl-hero__title{margin:0 0 12px;font-size:clamp(1.75rem,4vw,2.75rem);line-height:1.1;max-width:16ch}
.cl-hero__sub{margin:0 0 var(--cl-gap);font-size:var(--cl-font-md);color:var(--cl-text-muted);max-width:52ch;line-height:1.6}
.cl-hero__actions{display:flex;flex-wrap:wrap;gap:10px}
.cl-hero__btn{padding:calc(12px * var(--cl-size-mult)) calc(18px * var(--cl-size-mult));border-radius:var(--cl-radius);font-weight:700;border:1px solid transparent;cursor:pointer}
.cl-hero__btn--primary{background:var(--cl-primary);color:#fff}
.cl-hero__btn--ghost{background:transparent;border-color:var(--cl-border);color:var(--cl-text)}`,
    ),
  },
  "sections:features": {
    name: "Features Grid",
    slug: "section-features",
    description: "Three-column features section with icons.",
    tier: "FREE",
    themes: ["light", "dark", "auto"],
    variants: SECTION_VARIANTS,
    ...wrap(
      `<section class="cl-ui cl-features" data-size="md" data-tone="default" data-density="normal" data-emphasis="balanced">
  <header class="cl-features__head"><h2>Why teams choose CompLib</h2><p>Scale design tokens across every layer of your library.</p></header>
  <div class="cl-features__grid">
    <article><h3>Primitives</h3><p>Layout, type, inputs — sized with tokens.</p></article>
    <article><h3>Patterns</h3><p>Cards, nav, forms ready to compose.</p></article>
    <article><h3>Sections</h3><p>Hero, pricing, FAQ blocks for landing pages.</p></article>
  </div>
</section>`,
      `.cl-features{width:100%;max-width:var(--cl-max-w-section);padding:calc(var(--cl-pad)*1.5)}
.cl-features__head{margin-bottom:var(--cl-gap)}
.cl-features__head h2{margin:0 0 8px;font-size:var(--cl-font-xl)}
.cl-features__head p{margin:0;color:var(--cl-text-muted)}
.cl-features__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(var(--cl-grid-min),1fr));gap:var(--cl-gap)}
.cl-features__grid article{padding:var(--cl-pad);background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius)}
.cl-features__grid h3{margin:0 0 6px;font-size:var(--cl-font-md)}
.cl-features__grid p{margin:0;font-size:var(--cl-font-sm);color:var(--cl-text-muted)}`,
    ),
  },
  "sections:testimonials": {
    name: "Testimonials",
    slug: "section-testimonials",
    description: "Customer quote section with avatar and attribution.",
    tier: "FREE",
    themes: ["light", "dark", "auto"],
    variants: SECTION_VARIANTS,
    ...wrap(
      `<section class="cl-ui cl-quote" data-size="md" data-tone="default" data-emphasis="subtle">
  <blockquote class="cl-quote__text">"We shipped our marketing site in a weekend using scalable CompLib sections."</blockquote>
  <footer class="cl-quote__meta"><span class="cl-quote__avatar">MK</span><div><strong>Morgan Kim</strong><span>Head of Product, Northline</span></div></footer>
</section>`,
      `.cl-quote{max-width:var(--cl-max-w-2xl);padding:calc(var(--cl-pad)*1.25);background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);box-shadow:var(--cl-shadow)}
.cl-quote__text{margin:0 0 var(--cl-gap);font-size:var(--cl-font-lg);line-height:1.5}
.cl-quote__meta{display:flex;align-items:center;gap:calc(12px * var(--cl-size-mult));font-size:var(--cl-font-sm)}
.cl-quote__meta div{display:flex;flex-direction:column}
.cl-quote__meta span{color:var(--cl-text-muted)}
.cl-quote__avatar{width:var(--cl-icon-md);height:var(--cl-icon-md);border-radius:50%;display:grid;place-items:center;background:var(--cl-primary);color:#fff;font-weight:700}`,
    ),
  },
  "sections:pricing": {
    name: "Pricing Section",
    slug: "section-pricing",
    description: "Three-tier pricing section for landing pages.",
    tier: "FREE",
    themes: ["light", "dark", "auto"],
    variants: SECTION_VARIANTS,
    ...wrap(
      `<section class="cl-ui cl-pricing-section" data-size="md" data-tone="brand" data-emphasis="bold">
  <header><h2>Simple pricing</h2><p>Pick a plan and scale as you grow.</p></header>
  <div class="cl-pricing-section__grid">
    <article><h3>Free</h3><p class="price">$0</p><button type="button">Start</button></article>
    <article class="is-featured"><h3>Pro</h3><p class="price">$29</p><button type="button">Start trial</button></article>
    <article><h3>Team</h3><p class="price">$79</p><button type="button">Contact</button></article>
  </div>
</section>`,
      `.cl-pricing-section{width:100%;max-width:var(--cl-max-w-section);padding:calc(var(--cl-pad)*1.5)}
.cl-pricing-section header{margin-bottom:var(--cl-gap)}
.cl-pricing-section header h2{margin:0 0 6px;font-size:var(--cl-font-xl)}
.cl-pricing-section header p{margin:0;color:var(--cl-text-muted)}
.cl-pricing-section__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(var(--cl-grid-min),1fr));gap:var(--cl-gap)}
.cl-pricing-section__grid article{padding:var(--cl-pad);border:1px solid var(--cl-border);border-radius:var(--cl-radius);background:var(--cl-surface)}
.cl-pricing-section__grid article.is-featured{border-color:var(--cl-primary);box-shadow:var(--cl-shadow)}
.cl-pricing-section__grid h3{margin:0 0 8px}
.cl-pricing-section__grid .price{margin:0 0 var(--cl-gap);font-size:var(--cl-font-xl);font-weight:800}
.cl-pricing-section__grid button{width:100%;padding:calc(10px * var(--cl-size-mult));border:none;border-radius:calc(8px * var(--cl-size-mult));background:var(--cl-primary);color:#fff;font-weight:700;cursor:pointer}`,
    ),
  },
  "sections:faq": {
    name: "FAQ Accordion",
    slug: "section-faq",
    description: "Expandable FAQ section for marketing pages.",
    tier: "FREE",
    themes: ["light", "dark", "auto"],
    variants: SECTION_VARIANTS,
    ...wrap(
      `<section class="cl-ui cl-faq" data-size="md" data-tone="default" data-density="normal">
  <h2 class="cl-faq__title">Frequently asked questions</h2>
  <details class="cl-faq__item" open><summary>Are components scalable?</summary><p>Yes — size and color tokens ship with every starter.</p></details>
  <details class="cl-faq__item"><summary>Can I add more via admin?</summary><p>Pick a taxonomy category and load the starter template.</p></details>
</section>`,
      `.cl-faq{max-width:var(--cl-max-w-2xl);padding:var(--cl-pad)}
.cl-faq__title{margin:0 0 var(--cl-gap);font-size:var(--cl-font-xl)}
.cl-faq__item{padding:var(--cl-pad);border:1px solid var(--cl-border);border-radius:var(--cl-radius);background:var(--cl-surface);margin-bottom:10px}
.cl-faq__item summary{cursor:pointer;font-weight:600}
.cl-faq__item p{margin:10px 0 0;font-size:var(--cl-font-sm);color:var(--cl-text-muted)}`,
    ),
  },
  "sections:footer": {
    name: "Site Footer",
    slug: "section-footer",
    description: "Multi-column footer with links and copyright.",
    tier: "FREE",
    themes: ["light", "dark", "auto"],
    variants: SECTION_VARIANTS,
    ...wrap(
      `<footer class="cl-ui cl-footer" data-size="md" data-tone="dark" data-emphasis="subtle">
  <div class="cl-footer__cols">
    <div><strong>CompLib</strong><p>Scalable UI library</p></div>
    <div><span>Product</span><a href="#">Components</a><a href="#">Playground</a></div>
    <div><span>Company</span><a href="#">About</a><a href="#">Contact</a></div>
  </div>
  <p class="cl-footer__copy">© 2026 CompLib. All rights reserved.</p>
</footer>`,
      `.cl-footer{width:100%;max-width:var(--cl-max-w-section);padding:calc(var(--cl-pad)*1.5);border-radius:var(--cl-radius);background:var(--cl-surface);border:1px solid var(--cl-border)}
.cl-footer__cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(var(--cl-grid-min-sm),1fr));gap:var(--cl-gap);margin-bottom:var(--cl-gap)}
.cl-footer__cols div{display:flex;flex-direction:column;gap:calc(6px * var(--cl-size-mult));font-size:var(--cl-font-sm)}
.cl-footer__cols span{font-weight:700;color:var(--cl-text)}
.cl-footer__cols a{color:var(--cl-text-muted);text-decoration:none}
.cl-footer__copy{margin:0;font-size:var(--cl-font-sm);color:var(--cl-text-muted)}`,
    ),
  },
  "templates:saas": {
    name: "SaaS Landing",
    slug: "template-saas",
    description: "SaaS marketing page shell — hero, features, pricing, footer.",
    tier: "PRO",
    themes: ["light", "dark", "auto"],
    variants: SECTION_VARIANTS,
    ...wrap(
      `<div class="cl-ui cl-template" data-size="lg" data-tone="brand" data-emphasis="bold">
  <header class="cl-template__nav"><strong>SaaSify</strong><nav><a href="#">Features</a><a href="#">Pricing</a></nav><button type="button">Sign up</button></header>
  <section class="cl-template__hero"><h1>Ship your B2B SaaS site faster</h1><p>Pre-built sections with scalable tokens.</p></section>
  <section class="cl-template__strip"><span>Analytics</span><span>Billing</span><span>Teams</span></section>
</div>`,
      `.cl-template{width:100%;max-width:var(--cl-max-w-section);border:1px solid var(--cl-border);border-radius:var(--cl-radius);overflow:hidden;background:var(--cl-surface)}
.cl-template__nav{display:flex;align-items:center;gap:var(--cl-gap);padding:var(--cl-pad);border-bottom:1px solid var(--cl-border)}
.cl-template__nav nav{display:flex;gap:calc(12px * var(--cl-size-mult));margin-left:auto;font-size:var(--cl-font-sm)}
.cl-template__nav a{color:var(--cl-text-muted);text-decoration:none}
.cl-template__nav button{padding:calc(8px * var(--cl-size-mult)) calc(14px * var(--cl-size-mult));border:none;border-radius:calc(8px * var(--cl-size-mult));background:var(--cl-primary);color:#fff;font-weight:600}
.cl-template__hero{padding:calc(var(--cl-pad)*2)}
.cl-template__hero h1{margin:0 0 8px;font-size:var(--cl-font-xl)}
.cl-template__hero p{margin:0;color:var(--cl-text-muted)}
.cl-template__strip{display:flex;gap:var(--cl-gap);padding:var(--cl-pad);background:var(--cl-surface-muted);font-size:var(--cl-font-sm);font-weight:600}`,
    ),
  },
  "templates:dashboard": {
    name: "Dashboard Shell",
    slug: "template-dashboard",
    description: "App shell with sidebar, top bar, and content grid.",
    tier: "PRO",
    themes: ["light", "dark", "auto"],
    variants: SECTION_VARIANTS,
    ...wrap(
      `<div class="cl-ui cl-dash" data-size="md" data-tone="dark" data-density="compact" data-emphasis="balanced">
  <aside class="cl-dash__side"><p>Dashboard</p><a href="#">Overview</a><a href="#">Reports</a></aside>
  <main class="cl-dash__main">
    <header class="cl-dash__top"><h1>Overview</h1><button type="button">Export</button></header>
    <div class="cl-dash__grid"><div class="cl-dash__card">MRR</div><div class="cl-dash__card">Users</div><div class="cl-dash__card">Churn</div></div>
  </main>
</div>`,
      `.cl-dash{display:grid;grid-template-columns:var(--cl-sidebar-w) 1fr;min-height:calc(320px * var(--cl-size-mult));width:100%;max-width:var(--cl-max-w-section);border:1px solid var(--cl-border);border-radius:var(--cl-radius);overflow:hidden}
.cl-dash__side{padding:var(--cl-pad);background:var(--cl-surface-muted);border-right:1px solid var(--cl-border);display:flex;flex-direction:column;gap:calc(8px * var(--cl-size-mult));font-size:var(--cl-font-sm)}
.cl-dash__side a{color:var(--cl-text-muted);text-decoration:none}
.cl-dash__main{padding:var(--cl-pad)}
.cl-dash__top{display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--cl-gap)}
.cl-dash__top h1{margin:0;font-size:var(--cl-font-lg)}
.cl-dash__top button{padding:calc(8px * var(--cl-size-mult)) calc(12px * var(--cl-size-mult));border:1px solid var(--cl-border);border-radius:calc(8px * var(--cl-size-mult));background:var(--cl-surface);cursor:pointer}
.cl-dash__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--cl-gap)}
.cl-dash__card{padding:var(--cl-pad);background:var(--cl-surface-muted);border:1px solid var(--cl-border);border-radius:var(--cl-radius);font-weight:700}`,
    ),
  },
  "templates:agency": {
    name: "Agency Landing",
    slug: "template-agency",
    description: "Agency portfolio landing with hero and work grid.",
    tier: "PRO",
    themes: ["light", "dark", "auto"],
    variants: SECTION_VARIANTS,
    ...wrap(
      `<div class="cl-ui cl-agency" data-size="lg" data-tone="brand" data-emphasis="bold">
  <header><strong>Studio North</strong><span>Brand · Web · Product</span></header>
  <section class="cl-agency__hero"><h1>We design brands that scale</h1></section>
  <section class="cl-agency__work"><article>Case A</article><article>Case B</article><article>Case C</article></section>
</div>`,
      `.cl-agency{width:100%;max-width:var(--cl-max-w-section);border:1px solid var(--cl-border);border-radius:var(--cl-radius);overflow:hidden;background:var(--cl-surface)}
.cl-agency header{display:flex;justify-content:space-between;padding:var(--cl-pad);border-bottom:1px solid var(--cl-border);font-size:var(--cl-font-sm)}
.cl-agency__hero{padding:calc(var(--cl-pad)*2)}
.cl-agency__hero h1{margin:0;font-size:var(--cl-font-xl)}
.cl-agency__work{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--cl-gap);padding:var(--cl-pad)}
.cl-agency__work article{aspect-ratio:4/3;display:grid;place-items:center;background:var(--cl-surface-muted);border-radius:var(--cl-radius);font-weight:700}`,
    ),
  },
  "templates:portfolio": {
    name: "Portfolio",
    slug: "template-portfolio",
    description: "Personal portfolio template with projects and bio.",
    tier: "PRO",
    themes: ["light", "dark", "auto"],
    variants: SECTION_VARIANTS,
    ...wrap(
      `<div class="cl-ui cl-portfolio" data-size="md" data-tone="default" data-density="spacious">
  <section class="cl-portfolio__intro"><h1>Hi, I'm Alex</h1><p>Product designer building scalable design systems.</p></section>
  <section class="cl-portfolio__projects"><article>Project 1</article><article>Project 2</article></section>
</div>`,
      `.cl-portfolio{width:100%;max-width:var(--cl-max-w-narrow);padding:calc(var(--cl-pad)*1.5)}
.cl-portfolio__intro h1{margin:0 0 8px;font-size:var(--cl-font-xl)}
.cl-portfolio__intro p{margin:0 0 var(--cl-gap);color:var(--cl-text-muted)}
.cl-portfolio__projects{display:grid;grid-template-columns:repeat(2,1fr);gap:var(--cl-gap)}
.cl-portfolio__projects article{padding:var(--cl-pad);min-height:calc(120px * var(--cl-size-mult));background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius);font-weight:600}`,
    ),
  },
  "templates:blog": {
    name: "Blog Layout",
    slug: "template-blog",
    description: "Editorial blog index with featured post and list.",
    tier: "PRO",
    themes: ["light", "dark", "auto"],
    variants: SECTION_VARIANTS,
    ...wrap(
      `<div class="cl-ui cl-blog" data-size="md" data-tone="default" data-density="normal">
  <header class="cl-blog__head"><h1>The CompLib Journal</h1><p>Notes on composable UI and design systems.</p></header>
  <article class="cl-blog__featured"><h2>Scaling components with tokens</h2><p>How size and color props keep libraries maintainable.</p></article>
  <ul class="cl-blog__list"><li>Taxonomy-first libraries</li><li>Playground-driven exports</li></ul>
</div>`,
      `.cl-blog{width:100%;max-width:var(--cl-max-w-narrow);padding:calc(var(--cl-pad)*1.5)}
.cl-blog__head h1{margin:0 0 6px;font-size:var(--cl-font-xl)}
.cl-blog__head p{margin:0 0 var(--cl-gap);color:var(--cl-text-muted)}
.cl-blog__featured{padding:var(--cl-pad);margin-bottom:var(--cl-gap);background:var(--cl-surface);border:1px solid var(--cl-border);border-radius:var(--cl-radius)}
.cl-blog__featured h2{margin:0 0 6px;font-size:var(--cl-font-lg)}
.cl-blog__featured p{margin:0;color:var(--cl-text-muted);font-size:var(--cl-font-sm)}
.cl-blog__list{margin:0;padding-left:20px;font-size:var(--cl-font-sm);color:var(--cl-text-muted)}`,
    ),
  },
};

export function starterKey(layer: ComponentLayer, category: string): string {
  return `${layer}:${category}`;
}

export function getComponentStarter(
  layer: ComponentLayer,
  category: string,
): ComponentStarter | null {
  const def = STARTERS[starterKey(layer, category)];
  const cat = getCategoryDef(layer, category);
  if (!def || !cat) return null;
  return {
    layer,
    category,
    problemTags: (def.problemTags ?? cat.problemTags) as ProblemTag[],
    ...def,
  };
}

export function listAllStarters(): ComponentStarter[] {
  const out: ComponentStarter[] = [];
  for (const key of Object.keys(STARTERS)) {
    const [layer, category] = key.split(":") as [ComponentLayer, string];
    const starter = getComponentStarter(layer, category);
    if (starter) out.push(starter);
  }
  return out;
}

export function categoriesWithStarters(layer: ComponentLayer): string[] {
  return getCategoriesForLayer(layer)
    .map((c) => c.slug)
    .filter((slug) => Boolean(STARTERS[starterKey(layer, slug)]));
}
