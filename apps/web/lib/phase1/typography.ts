import type { Phase1PrimitiveDef } from "./shared";
import { SURFACE, TYPO_VARIANTS, wrapRoot } from "./shared";

/** Typography primitives (10) */
export const TYPOGRAPHY: Phase1PrimitiveDef[] = [
  {
    slug: "heading",
    name: "Heading",
    category: "typography",
    problemTags: ["build-ui-sections"],
    description: "Semantic heading scale (h1–h6) with tight tracking and size tokens.",
    tags: ["typography", "heading", "title", "primitives", "standard"],
    dimensions: TYPO_VARIANTS,
    html: wrapRoot(`  <div class="cl-type">
    <h1 class="cl-heading" data-level="1">Display heading</h1>
    <h2 class="cl-heading" data-level="2">Section heading</h2>
    <h3 class="cl-heading" data-level="3">Subsection</h3>
  </div>`),
    css: `${SURFACE}
.cl-type{display:flex;flex-direction:column;gap:calc(var(--cl-gap) * .6);max-width:var(--cl-max-w-2xl)}
.cl-heading{margin:0;color:var(--cl-text);font-weight:700;letter-spacing:-.03em;line-height:1.15}
.cl-heading[data-level="1"]{font-size:calc(var(--cl-font-xl) * 1.35)}
.cl-heading[data-level="2"]{font-size:var(--cl-font-xl)}
.cl-heading[data-level="3"]{font-size:var(--cl-font-lg);letter-spacing:-.02em}
.cl-heading[data-level="4"]{font-size:var(--cl-font-md)}`,
  },
  {
    slug: "text",
    name: "Text",
    category: "typography",
    problemTags: ["build-ui-sections"],
    description: "Inline text primitive with muted/strong emphasis and size tokens.",
    tags: ["typography", "text", "span", "primitives", "standard"],
    dimensions: TYPO_VARIANTS,
    html: wrapRoot(`  <p class="cl-text" style="margin:0;max-width:42ch">
    Body text with <span class="cl-text" data-weight="strong">strong emphasis</span> and
    <span class="cl-text" data-tone="muted">muted secondary copy</span> for hierarchy.
  </p>`),
    css: `${SURFACE}
.cl-text{font-size:var(--cl-font-md);line-height:1.6;color:var(--cl-text)}
.cl-text[data-tone="muted"]{color:var(--cl-text-muted)}
.cl-text[data-weight="strong"]{font-weight:700;color:var(--cl-text)}
.cl-text[data-size="sm"]{font-size:var(--cl-font-sm)}
.cl-text[data-size="lg"]{font-size:var(--cl-font-lg)}`,
  },
  {
    slug: "paragraph",
    name: "Paragraph",
    category: "typography",
    problemTags: ["build-ui-sections"],
    description: "Readable paragraph block with comfortable measure and line-height.",
    tags: ["typography", "paragraph", "body", "primitives", "standard"],
    dimensions: TYPO_VARIANTS,
    html: wrapRoot(`  <div class="cl-prose">
    <p class="cl-paragraph">CompLib components are designed to drop into production UIs without a design-system tax. Paragraphs keep a comfortable measure for long-form reading.</p>
    <p class="cl-paragraph">Use spacing tokens between blocks so rhythm stays consistent across sections.</p>
  </div>`),
    css: `${SURFACE}
.cl-prose{max-width:var(--cl-max-w-narrow);display:flex;flex-direction:column;gap:var(--cl-gap)}
.cl-paragraph{margin:0;font-size:var(--cl-font-md);line-height:1.65;color:var(--cl-text);max-width:65ch}`,
  },
  {
    slug: "label",
    name: "Label",
    category: "typography",
    problemTags: ["build-form"],
    description: "Form and UI labels with optional required marker.",
    tags: ["typography", "label", "form", "primitives", "standard"],
    dimensions: TYPO_VARIANTS,
    html: wrapRoot(`  <label class="cl-field-label" for="cl-demo-input">Email address <span class="cl-req" aria-hidden="true">*</span></label>
  <input id="cl-demo-input" class="cl-surface" style="display:block;width:100%;max-width:var(--cl-max-w-form);margin-top:6px;font:inherit" placeholder="you@company.com" />`),
    css: `${SURFACE}
.cl-field-label{display:inline-block;font-size:var(--cl-font-sm);font-weight:600;color:var(--cl-text);letter-spacing:.01em}
.cl-req{color:var(--cl-danger);margin-left:2px}`,
  },
  {
    slug: "link",
    name: "Link",
    category: "typography",
    problemTags: ["build-navigation", "build-ui-sections"],
    description: "Accessible text link with hover/focus styles and optional underline variants.",
    tags: ["typography", "link", "anchor", "primitives", "standard"],
    dimensions: TYPO_VARIANTS,
    html: wrapRoot(`  <p style="margin:0;font-size:var(--cl-font-md);line-height:1.6">
    Read the <a class="cl-link" href="#">documentation</a> or jump to
    <a class="cl-link" data-underline="always" href="#">API reference</a>.
  </p>`),
    css: `${SURFACE}
.cl-link{color:var(--cl-primary);text-decoration:none;font-weight:600;underline-offset:3px;transition:color .15s ease,text-decoration-color .15s ease}
.cl-link:hover{color:var(--cl-primary-hover);text-decoration:underline}
.cl-link:focus-visible{outline:2px solid var(--cl-primary);outline-offset:3px;border-radius:4px}
.cl-link[data-underline="always"]{text-decoration:underline;text-decoration-color:color-mix(in srgb,var(--cl-primary) 45%,transparent)}`,
  },
  {
    slug: "code",
    name: "Code",
    category: "typography",
    problemTags: ["build-ui-sections"],
    description: "Block code sample with monospace type and subtle surface.",
    tags: ["typography", "code", "pre", "developer", "primitives", "standard"],
    dimensions: TYPO_VARIANTS,
    html: wrapRoot(`  <pre class="cl-code" tabindex="0"><code>npm install @complib/ui
import { Box } from "@complib/ui"</code></pre>`),
    css: `${SURFACE}
.cl-code{
  margin:0;padding:var(--cl-pad);border-radius:var(--cl-radius);border:1px solid var(--cl-border);
  background:var(--cl-surface-muted);box-shadow:var(--cl-shadow);overflow:auto;max-width:var(--cl-max-w-2xl);
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:var(--cl-font-sm);line-height:1.55;color:var(--cl-text);
}
.cl-code:focus-visible{outline:2px solid var(--cl-primary);outline-offset:2px}`,
  },
  {
    slug: "inline-code",
    name: "Inline Code",
    category: "typography",
    problemTags: ["build-ui-sections"],
    description: "Inline code chip for API names, props, and file paths.",
    tags: ["typography", "code", "inline", "primitives", "standard"],
    dimensions: TYPO_VARIANTS,
    html: wrapRoot(`  <p style="margin:0;font-size:var(--cl-font-md);line-height:1.6">
    Pass <code class="cl-inline-code">data-size="md"</code> to scale the component with design tokens.
  </p>`),
    css: `${SURFACE}
.cl-inline-code{
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.9em;
  background:var(--cl-surface-muted);border:1px solid var(--cl-border);border-radius:calc(var(--cl-radius) * .55);
  padding:.12em .4em;color:var(--cl-primary);
}`,
  },
  {
    slug: "blockquote",
    name: "Blockquote",
    category: "typography",
    problemTags: ["build-ui-sections"],
    description: "Pull quote with accent border for testimonials and citations.",
    tags: ["typography", "blockquote", "quote", "primitives", "standard"],
    dimensions: TYPO_VARIANTS,
    html: wrapRoot(`  <blockquote class="cl-quote">
    <p>“CompLib let us ship the marketing site in a weekend without reinventing spacing.”</p>
    <footer>— Product lead, early team</footer>
  </blockquote>`),
    css: `${SURFACE}
.cl-quote{
  margin:0;max-width:var(--cl-max-w-lg);padding:var(--cl-pad) var(--cl-pad) var(--cl-pad) calc(var(--cl-pad) * 1.15);
  border-left:3px solid var(--cl-primary);background:var(--cl-surface-muted);border-radius:0 var(--cl-radius) var(--cl-radius) 0;
}
.cl-quote p{margin:0 0 10px;font-size:var(--cl-font-lg);line-height:1.45;font-weight:500;color:var(--cl-text)}
.cl-quote footer{font-size:var(--cl-font-sm);color:var(--cl-text-muted)}`,
  },
  {
    slug: "list",
    name: "List",
    category: "typography",
    problemTags: ["build-ui-sections"],
    description: "Ordered and unordered lists with comfortable spacing.",
    tags: ["typography", "list", "ul", "ol", "primitives", "standard"],
    dimensions: TYPO_VARIANTS,
    html: wrapRoot(`  <div class="cl-lists">
    <ul class="cl-list">
      <li>Browse the explorer</li>
      <li>Compose in the playground</li>
      <li>Export Vanilla, React, or Vue</li>
    </ul>
    <ol class="cl-list" data-type="ordered">
      <li>Pick a primitive</li>
      <li>Choose a style variant</li>
      <li>Ship the page</li>
    </ol>
  </div>`),
    css: `${SURFACE}
.cl-lists{display:grid;gap:var(--cl-gap);grid-template-columns:repeat(auto-fit,minmax(200px,1fr));max-width:var(--cl-max-w-2xl)}
.cl-list{margin:0;padding-left:1.25em;font-size:var(--cl-font-md);line-height:1.55;color:var(--cl-text)}
.cl-list li{margin:0 0 .45em;padding-left:.15em}
.cl-list li::marker{color:var(--cl-primary)}`,
  },
  {
    slug: "truncated-text",
    name: "Truncated Text",
    category: "typography",
    problemTags: ["build-ui-sections", "build-dashboard"],
    description: "Single or multi-line truncation with ellipsis for dense UIs.",
    tags: ["typography", "truncate", "ellipsis", "primitives", "standard"],
    dimensions: TYPO_VARIANTS,
    html: wrapRoot(`  <div class="cl-truncate-demo cl-surface">
    <p class="cl-truncate" data-lines="1">Single-line truncate: The quick brown fox jumps over the lazy dog and then keeps running across a very long sentence.</p>
    <p class="cl-truncate" data-lines="2">Two-line clamp: CompLib keeps long descriptions readable in cards and tables by clamping overflow with an ellipsis after the configured line count.</p>
  </div>`),
    css: `${SURFACE}
.cl-truncate-demo{display:flex;flex-direction:column;gap:var(--cl-gap);max-width:var(--cl-max-w-md)}
.cl-truncate{margin:0;font-size:var(--cl-font-md);line-height:1.5;color:var(--cl-text);overflow:hidden}
.cl-truncate[data-lines="1"]{white-space:nowrap;text-overflow:ellipsis}
.cl-truncate[data-lines="2"]{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-clamp:2}`,
  },
];
