/** Client-side preview document for edited page code (no layout editor). */

import { combinePageStyles } from "@/lib/playground-page-format";
import { PLAYGROUND_EDITOR_SCRIPT } from "@/lib/playground-editor-script";
import {
  PLAYGROUND_ARTBOARD_WIDTH,
  playgroundArtboardShellCss,
  playgroundPageShellCss,
} from "@/lib/playground-viewport";

const SHELL_STYLES = `*{box-sizing:border-box;margin:0;padding:0}
html,body{min-height:100%}
html{color-scheme:light}
body{background:#f8fafc;color:#0f172a;font-family:Inter,Arial,sans-serif}
`;

const CANVAS_SECTION_CSS = `.complib-section{position:absolute;overflow:visible;border:none;border-radius:0;background:transparent;padding:0;backdrop-filter:none}`;
const CANVAS_SELECTION_CSS =
  ".complib-section.complib-selected{outline:2px solid rgba(59,130,246,0.8);outline-offset:3px;box-shadow:0 0 0 4px rgba(59,130,246,0.2)}";

function layoutCssForCanvas(layoutCss: string): string {
  return layoutCss
    .replace(/\/\*\s*Page shell\s*\*\//g, "")
    .replace(/\.complib-page\s*\{[^}]*\}/g, "")
    .trim();
}

export function buildPageCodePreviewSrcDoc(
  html: string,
  layoutCss: string,
  componentsCss: string,
  js: string,
  editorHeight: number,
): string {
  const bodyInner =
    html.trim().length > 0
      ? `<main class="complib-page">\n${html}\n</main>`
      : `<p style="opacity:0.5;font-family:system-ui,sans-serif;padding:24px">Empty page — add HTML or return to the canvas.</p>`;

  const safeJs = js.trim();
  const scriptTag = safeJs
    ? `<script>${safeJs.replace(/<\/script/gi, "<\\/script")}<\/script>`
    : "";

  const pageCss = combinePageStyles(layoutCss, componentsCss);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>CompLib page preview</title>
<style>
${SHELL_STYLES}
${playgroundPageShellCss(PLAYGROUND_ARTBOARD_WIDTH, editorHeight)}
${pageCss}
</style>
</head>
<body>${bodyInner}${scriptTag}</body>
</html>`;
}

/** Canvas preview built from the same page source as the page code panel. */
export function buildCanvasPreviewFromPageSource(
  html: string,
  layoutCss: string,
  componentsCss: string,
  js: string,
  editorHeight: number,
): string {
  const bodyInner =
    html.trim().length > 0
      ? `<main class="complib-editor">\n${html}\n</main>`
      : `<p style="opacity:0.5;font-family:system-ui,sans-serif;padding:24px">Add components from the palette to build a preview.</p>`;

  const safeJs = js.trim();
  const scriptTag = safeJs
    ? `<script>${safeJs.replace(/<\/script/gi, "<\\/script")}<\/script>`
    : "";

  const pageCss = combinePageStyles(
    layoutCssForCanvas(layoutCss),
    componentsCss,
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>CompLib playground</title>
<style>
${SHELL_STYLES}
${playgroundArtboardShellCss(PLAYGROUND_ARTBOARD_WIDTH, editorHeight)}
${CANVAS_SECTION_CSS}
${CANVAS_SELECTION_CSS}
${pageCss}
</style>
</head>
<body>${bodyInner}${scriptTag}<script>${PLAYGROUND_EDITOR_SCRIPT}</script></body>
</html>`;
}
