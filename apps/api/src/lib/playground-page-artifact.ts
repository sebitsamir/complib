import {
  mergePlaygroundToFiles,
  type PlaygroundInstance,
} from "./playground-merge";
import {
  computePlaygroundEditorHeight,
  PLAYGROUND_ARTBOARD_MIN_HEIGHT,
} from "./playground-viewport";
import {
  combinePageStyles,
  formatCss,
  formatPageHtml,
} from "./playground-page-format";

export type PlaygroundPageSource = {
  /** Formatted section markup (inside `<main class="complib-page">`) */
  html: string;
  /** `styles/layout.css` — page shell + block positions */
  layoutCss: string;
  /** `styles/components.css` — component styles only */
  componentsCss: string;
  js: string;
  editorHeight: number;
};

/** @deprecated Use layoutCss + componentsCss; kept for preview combine */
export function pageSourceCombinedCss(source: PlaygroundPageSource): string {
  return combinePageStyles(source.layoutCss, source.componentsCss);
}

function parseEditorHeight(layoutCss: string): number {
  const match = layoutCss.match(/min-height:\s*(\d+)px/);
  return match ? parseInt(match[1]!, 10) : PLAYGROUND_ARTBOARD_MIN_HEIGHT;
}

function splitLayoutAndPlacement(layoutFile: string): {
  shell: string;
  placement: string;
} {
  const lines = layoutFile.split("\n");
  const shell: string[] = [];
  const placement: string[] = [];

  for (const line of lines) {
    if (/^\s*\.complib-node-/.test(line)) {
      placement.push(line);
    } else {
      shell.push(line);
    }
  }

  return {
    shell: shell.join("\n").trim(),
    placement: placement.join("\n").trim(),
  };
}

/** Merged vanilla page files derived from canvas instances (export-shaped, formatted). */
export async function mergePlaygroundVanillaPageSource(
  instances: PlaygroundInstance[],
): Promise<PlaygroundPageSource> {
  const files = await mergePlaygroundToFiles(instances, "vanilla");
  const layoutRaw = files["styles/layout.css"] ?? "";
  const componentsRaw = files["styles/components.css"] ?? "";
  const js = files["scripts/components.js"] ?? "";
  const indexHtml = files["index.html"] ?? "";

  const mainMatch = indexHtml.match(
    /<main class="(?:complib-page|page)">([\s\S]*?)<\/main>/i,
  );
  const htmlRaw = mainMatch?.[1]?.trim() ?? "";
  const html =
    htmlRaw.includes("<section") ? formatPageHtml(htmlRaw) : htmlRaw;

  const { shell, placement } = splitLayoutAndPlacement(layoutRaw);
  const shellForPage = shell.replace(/\.page\b/g, ".complib-page");

  const layoutCss = formatCss(
    [
      "/* Document flow (export) — canvas order top→bottom */",
      shellForPage,
      placement ? "\n/* Block size hints */\n" + placement : "",
    ]
      .filter(Boolean)
      .join("\n"),
  );

  const componentsCss = formatCss(componentsRaw);

  const maxBottom = instances.reduce((acc, inst, index) => {
    const y = Number.isFinite(inst.y) ? Number(inst.y) : 120 + index * 28;
    const h = Number.isFinite(inst.height) ? Number(inst.height) : 140;
    return Math.max(acc, y + h);
  }, 0);

  return {
    html,
    layoutCss,
    componentsCss,
    js: js.trim(),
    editorHeight: Math.max(
      parseEditorHeight(layoutRaw),
      computePlaygroundEditorHeight(maxBottom),
    ),
  };
}

const SHELL_STYLES = `*{box-sizing:border-box;margin:0;padding:0}
html,body{min-height:100%}
html{color-scheme:light}
body{background:#f8fafc;color:#0f172a;font-family:Inter,Arial,sans-serif}
`;

/** Build vanilla export files from edited page source (page code panel). */
export function pageSourceToVanillaFiles(
  source: PlaygroundPageSource,
): Record<string, string> {
  const bodyInner =
    source.html.trim().length > 0
      ? `<main class="complib-page">\n${source.html.trim()}\n</main>`
      : `<p style="opacity:0.5;font-family:system-ui,sans-serif">Empty playground.</p>`;

  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>CompLib playground bundle</title>
<link rel="stylesheet" href="styles/reset.css">
<link rel="stylesheet" href="styles/layout.css">
<link rel="stylesheet" href="styles/components.css">
</head>
<body>
${bodyInner}
<script src="scripts/components.js"><\/script>
<script src="scripts/interactions.js"><\/script>
</body>
</html>`;

  const readme = `CompLib — playground bundle
This archive was generated from the CompLib playground page code.

Structure:
- index.html
- styles/reset.css
- styles/layout.css
- styles/components.css
- scripts/components.js
- scripts/interactions.js

Layout uses document flow (stacked by canvas order) for production-ready pages.
`;

  return {
    "index.html": indexHtml,
    "styles/reset.css": SHELL_STYLES,
    "styles/layout.css": source.layoutCss.trim(),
    "styles/components.css": source.componentsCss.trim(),
    "scripts/components.js": source.js.trim(),
    "scripts/interactions.js": `document.addEventListener("DOMContentLoaded", () => {
  document.body.dataset.complibReady = "true";
});`,
    "README.txt": readme,
  };
}
