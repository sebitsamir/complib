import { getComponentBySlug, type Component } from "./component-store";
import { compileComponentForExport, scopeCssRules, variantPropsCacheKey } from "./component-export";
import {
  buildExportedBundleFiles,
  type ComponentFramework,
} from "./framework-output";
import {
  computePlaygroundEditorHeight,
  PLAYGROUND_ARTBOARD_WIDTH,
  PLAYGROUND_GRID_COL_WIDTH,
  PLAYGROUND_SECTION_HEIGHT,
  playgroundArtboardShellCss,
} from "./playground-viewport";
import {
  resolveInstanceVariantProps,
} from "./variant-props";

/**
 * Note: This file is intentionally self-contained for the playground merge pipeline.
 * It merges component HTML/CSS/JS into a single HTML document or ZIP file bundle.
 *
 * Source of truth is the file-based component store under /components.
 * This merge layer intentionally reads through component-store only.
 */

export type PlaygroundInstance = {
  id: string;
  slug: string;
  variantId?: string;
  variantProps?: Record<string, string>;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  /** When true, only width constrains layout; height follows content. */
  heightAuto?: boolean;
  zIndex?: number;
};

type ResolvedInstance = PlaygroundInstance & {
  x: number;
  y: number;
  width: number;
  height: number;
  heightAuto: boolean;
  zIndex: number;
};

export function isValidPlaygroundJs(code: string): boolean {
  const trimmed = code.trim();
  if (!trimmed) return true;
  try {
    new Function(trimmed);
    return true;
  } catch {
    return false;
  }
}

export function sanitizePlaygroundJs(code: string): string {
  if (!code.trim()) return "";
  return isValidPlaygroundJs(code) ? code : "";
}

function instanceClassName(id: string) {
  return `complib-node-${id.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}

function normalizeInstance(instance: PlaygroundInstance, index: number): ResolvedInstance {
  return {
    ...instance,
    x: Number.isFinite(instance.x) ? Number(instance.x) : 120 + index * 36,
    y: Number.isFinite(instance.y) ? Number(instance.y) : 120 + index * 28,
    width: Number.isFinite(instance.width)
      ? Number(instance.width)
      : PLAYGROUND_GRID_COL_WIDTH,
    height: Number.isFinite(instance.height)
      ? Number(instance.height)
      : PLAYGROUND_SECTION_HEIGHT,
    heightAuto: instance.heightAuto === true,
    zIndex: Number.isFinite(instance.zIndex) ? Number(instance.zIndex) : index + 1,
  };
}

function mergeBodyHtml(
  blocks: { instance: ResolvedInstance; component: Component }[],
): string {
  return blocks
    .map(({ instance, component }) => {
      const variantProps = resolveInstanceVariantProps(
        component.variants,
        instance.variantId,
        instance.variantProps,
      );
      const baked = compileComponentForExport({
        html: component.html,
        css: component.css,
        js: component.runtime || component.js,
        variantProps,
      });
      const variantAttr = instance.variantId
        ? ` data-complib-variant="${escapeAttr(instance.variantId)}"`
        : "";
      const propsAttr =
        instance.variantProps && Object.keys(instance.variantProps).length > 0
          ? ` data-complib-variant-props="${escapeAttr(JSON.stringify(instance.variantProps))}"`
          : "";
      const heightAttr = instance.heightAuto ? ` data-height-auto="true"` : "";
      return `<section class="complib-section ${instanceClassName(instance.id)}" data-complib-instance="${escapeAttr(instance.id)}" data-complib-slug="${escapeAttr(
        component.slug,
      )}"${variantAttr}${propsAttr}${heightAttr} data-complib-z="${instance.zIndex}">
${baked.html}
</section>`;
    })
    .join("\n");
}

function mergeBodyHtmlForExport(
  blocks: { instance: ResolvedInstance; component: Component }[],
): string {
  return blocks
    .map(({ instance, component }) => {
      const variantProps = resolveInstanceVariantProps(
        component.variants,
        instance.variantId,
        instance.variantProps,
      );
      const baked = compileComponentForExport({
        html: component.html,
        css: component.css,
        js: component.runtime || component.js,
        variantProps,
      });
      const scopeClass = instanceClassName(instance.id);
      return `<div class="page-item ${scopeClass}">
${baked.html}
</div>`;
    })
    .join("\n");
}

function mergeCss(blocks: { instance: ResolvedInstance; component: Component }[]): string {
  return blocks
    .map(({ instance, component }) => {
      const variantProps = resolveInstanceVariantProps(
        component.variants,
        instance.variantId,
        instance.variantProps,
      );
      const baked = compileComponentForExport({
        html: component.html,
        css: component.css,
        variantProps,
      });
      const scopeClass = `.${instanceClassName(instance.id)}`;
      return `/* complib: ${component.slug} · ${instance.id} */\n${scopeCssRules(baked.css, scopeClass)}`;
    })
    .join("\n\n");
}

function mergeCssForExport(
  blocks: { instance: ResolvedInstance; component: Component }[],
): string {
  return blocks
    .map(({ instance, component }) => {
      const variantProps = resolveInstanceVariantProps(
        component.variants,
        instance.variantId,
        instance.variantProps,
      );
      const baked = compileComponentForExport({
        html: component.html,
        css: component.css,
        variantProps,
      });
      const scopeClass = `.${instanceClassName(instance.id)}`;
      return `/* ${component.slug} */\n${scopeCssRules(baked.css, scopeClass)}`;
    })
    .join("\n\n");
}

function exportComponentDir(slug: string, variantProps: Record<string, string>): string {
  const suffix = variantPropsCacheKey(variantProps)
    .replace(/[^a-z0-9&=]/gi, "_")
    .slice(0, 80);
  return suffix ? `${slug}__${suffix}` : slug;
}

function mergeJs(
  blocks: { instance: ResolvedInstance; component: Component }[],
): string {
  const chunks: string[] = [];
  for (const { instance, component } of blocks) {
    const safe = sanitizePlaygroundJs(component.runtime || component.js);
    if (!safe.trim()) continue;
    chunks.push(
      `/* complib: ${component.slug} · ${instance.id} */\n(function(){\n${safe}\n})();`,
    );
  }
  return chunks.join("\n\n");
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

async function resolveBlocks(
  instances: PlaygroundInstance[],
): Promise<{ instance: ResolvedInstance; component: Component }[]> {
  const resolved = await Promise.all(
    instances.map(async (instance, index) => {
      const component = await getComponentBySlug(instance.slug);
      return component
        ? { instance: normalizeInstance(instance, index), component }
        : null;
    }),
  );
  return resolved.filter(
    (x): x is { instance: ResolvedInstance; component: Component } => !!x,
  );
}

const SHELL_STYLES = `*{box-sizing:border-box;margin:0;padding:0}
html,body{min-height:100%}
html{color-scheme:light}
body{background:#f8fafc;color:#0f172a;font-family:Inter,Arial,sans-serif}
`;

function getEditorHeight(blocks: { instance: ResolvedInstance; component: Component }[]) {
  const maxBottom = blocks.reduce((acc, block) => {
    const bottom = block.instance.y + block.instance.height;
    return Math.max(acc, bottom);
  }, 0);
  return computePlaygroundEditorHeight(maxBottom);
}

const SECTION_LAYOUT_CSS = `
.complib-section{box-sizing:border-box}
.complib-section > .cl-ui{width:100%;max-width:100%;box-sizing:border-box}
.complib-section[data-height-auto="true"] > .cl-ui{height:auto}
.complib-section:not([data-height-auto]) > .cl-ui{height:100%;min-height:0}
`.trim();

function buildPlacementCss(
  blocks: { instance: ResolvedInstance; component: Component }[],
) {
  const rules = blocks.map(({ instance }) => {
    const cls = instanceClassName(instance.id);
    const parts = [
      `left:${Math.round(instance.x)}px`,
      `top:${Math.round(instance.y)}px`,
      `width:${Math.round(instance.width)}px`,
      `z-index:${Math.round(instance.zIndex)}`,
    ];
    if (instance.heightAuto) {
      parts.push("height:auto", "min-height:0");
    } else {
      parts.push(`height:${Math.round(instance.height)}px`);
    }
    return `.${cls}{${parts.join(";")}}`;
  });
  return `${SECTION_LAYOUT_CSS}\n${rules.join("\n")}`;
}

function buildPlacementCssForExport(
  blocks: { instance: ResolvedInstance; component: Component }[],
  mode: "canvas" | "flow" = "flow",
) {
  if (mode === "flow") {
    // Document-flow export: readable, responsive pages (not an absolute collage).
    const editorHeight = getEditorHeight(blocks);
    const sizeRules = blocks
      .map(({ instance }) => {
        const cls = instanceClassName(instance.id);
        const maxW = Math.round(instance.width);
        if (instance.heightAuto) {
          return `.${cls}{width:100%;max-width:${maxW}px;height:auto}`;
        }
        return `.${cls}{width:100%;max-width:${maxW}px;min-height:${Math.round(instance.height)}px}`;
      })
      .join("\n");
    return `.page{display:flex;flex-direction:column;gap:24px;align-items:flex-start;width:min(100%,1120px);margin:0 auto;padding:32px 24px;box-sizing:border-box;min-height:${editorHeight}px}
.page-item{position:relative;width:100%;max-width:100%;overflow:visible}
.page-item > .cl-ui{width:100%;max-width:100%;box-sizing:border-box}
${sizeRules}`;
  }
  const rules = blocks.map(({ instance }) => {
    const cls = instanceClassName(instance.id);
    const parts = [
      `left:${Math.round(instance.x)}px`,
      `top:${Math.round(instance.y)}px`,
      `width:${Math.round(instance.width)}px`,
      `z-index:${Math.round(instance.zIndex)}`,
    ];
    if (instance.heightAuto) {
      parts.push("height:auto", "min-height:0");
    } else {
      parts.push(`height:${Math.round(instance.height)}px`);
    }
    return `.${cls}{${parts.join(";")}}`;
  });
  return `.page{position:relative;min-height:${getEditorHeight(blocks)}px;width:100%}
.page-item{position:absolute;overflow:visible}
${rules.join("\n")}`;
}

function sortBlocksForFlow(
  blocks: { instance: ResolvedInstance; component: Component }[],
) {
  return [...blocks].sort((a, b) => {
    const dy = a.instance.y - b.instance.y;
    if (Math.abs(dy) > 8) return dy;
    return a.instance.x - b.instance.x;
  });
}

export async function mergePlaygroundToDocument(
  instances: PlaygroundInstance[],
): Promise<string> {
  const blocks = await resolveBlocks(instances);
  const editorHeight = getEditorHeight(blocks);
  const placementCss = buildPlacementCss(blocks);
  const bodyInner =
    blocks.length > 0
      ? `<main class="complib-editor">
${mergeBodyHtml(blocks)}
</main>`
      : `<p style="opacity:0.5;font-family:system-ui,sans-serif">Add components from the palette to build a preview.</p>`;
  const css = mergeCss(blocks);
  const js = mergeJs(blocks);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>CompLib playground</title>
<style>
${SHELL_STYLES}
${playgroundArtboardShellCss(PLAYGROUND_ARTBOARD_WIDTH, editorHeight)}
.complib-section{position:absolute;overflow:visible;border:none;border-radius:0;background:transparent;padding:0;backdrop-filter:none}
.complib-selected{outline:0}
${placementCss}
${css}
</style>
</head>
<body>${bodyInner}<script>${js}<\/script></body>
</html>`;
}

export async function mergePlaygroundToFiles(
  instances: PlaygroundInstance[],
  framework: ComponentFramework = "vanilla",
): Promise<Record<string, string>> {
  const blocks = await resolveBlocks(instances);
  return mergeResolvedPlaygroundToFiles(blocks, framework);
}

export async function mergeResolvedPlaygroundToFiles(
  blocks: { instance: ResolvedInstance; component: Component }[],
  framework: ComponentFramework = "vanilla",
): Promise<Record<string, string>> {
  const editorHeight = getEditorHeight(blocks);
  const flowBlocks = sortBlocksForFlow(blocks);
  const placementCss = buildPlacementCssForExport(flowBlocks, "flow");
  const bodyInner =
    flowBlocks.length > 0
      ? `<main class="page">
${mergeBodyHtmlForExport(flowBlocks)}
</main>`
      : `<p style="opacity:0.5;font-family:system-ui,sans-serif">Empty playground.</p>`;
  const css = mergeCssForExport(flowBlocks);
  const js = mergeJs(flowBlocks);

  if (framework === "react" || framework === "vue") {
    const exportDirs = new Map<string, string>();
    for (const block of flowBlocks) {
      const variantProps = resolveInstanceVariantProps(
        block.component.variants,
        block.instance.variantId,
        block.instance.variantProps,
      );
      exportDirs.set(block.instance.id, exportComponentDir(block.component.slug, variantProps));
    }

    const reactImports = flowBlocks
      .map((b, i) => {
        const name = `Comp${i + 1}`;
        const dir = exportDirs.get(b.instance.id) ?? b.component.slug;
        return `import ${name} from "./components/${dir}/Component${framework === "vue" ? ".vue" : ""}";`;
      })
      .join("\n");
    const reactNodes = flowBlocks
      .map((b, i) => {
        const name = `Comp${i + 1}`;
        const width = Math.round(b.instance.width);
        const heightStyle = b.instance.heightAuto
          ? "height: \"auto\""
          : `height: ${Math.round(b.instance.height)}`;
        return `      <div key="${b.instance.id}" style={{ width: "100%", maxWidth: ${width}, ${heightStyle} }}><${name} /></div>`;
      })
      .join("\n");
    const vueImports = flowBlocks
      .map((b, i) => {
        const dir = exportDirs.get(b.instance.id) ?? b.component.slug;
        return `import Comp${i + 1} from "./components/${dir}/Component.vue";`;
      })
      .join("\n");
    const vueNodes = flowBlocks
      .map((b, i) => {
        const width = Math.round(b.instance.width);
        const heightStyle = b.instance.heightAuto
          ? "height:auto"
          : `height:${Math.round(b.instance.height)}px`;
        return `    <div style="width:100%;max-width:${width}px;${heightStyle}"><Comp${i + 1} /></div>`;
      })
      .join("\n");

    const frameworkFiles: Record<string, string> = {
      "README.txt": `CompLib playground ${framework} bundle
Generated from playground instances.
Blocks are stacked in document flow (top→bottom by canvas order) for production-ready layouts.
`,
    };

    if (framework === "react") {
      frameworkFiles["src/App.tsx"] = `${reactImports}

export default function App() {
  return (
    <main style={{ display: "flex", flexDirection: "column", gap: 24, width: "min(100%, 1120px)", margin: "0 auto", padding: "32px 24px", boxSizing: "border-box", minHeight: ${editorHeight} }}>
${reactNodes}
    </main>
  );
}
`;
      frameworkFiles["src/main.tsx"] = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = document.getElementById("root");
if (root) createRoot(root).render(<StrictMode><App /></StrictMode>);
`;
      frameworkFiles["index.html"] = `<!doctype html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>CompLib React Playground</title></head><body><div id="root"></div></body></html>`;
    } else {
      frameworkFiles["src/App.vue"] = `<script setup>
${vueImports}
</script>

<template>
  <main style="display:flex;flex-direction:column;gap:24px;width:min(100%,1120px);margin:0 auto;padding:32px 24px;box-sizing:border-box;min-height:${editorHeight}px;">
${vueNodes}
  </main>
</template>
`;
      frameworkFiles["src/main.ts"] = `import { createApp } from "vue";
import App from "./App.vue";
createApp(App).mount("#app");
`;
      frameworkFiles["index.html"] = `<!doctype html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>CompLib Vue Playground</title></head><body><div id="app"></div></body></html>`;
    }

    const dirToBlock = new Map<string, (typeof flowBlocks)[number]>();
    for (const block of flowBlocks) {
      const variantProps = resolveInstanceVariantProps(
        block.component.variants,
        block.instance.variantId,
        block.instance.variantProps,
      );
      const dir = exportComponentDir(block.component.slug, variantProps);
      if (!dirToBlock.has(dir)) dirToBlock.set(dir, block);
    }

    for (const [dir, block] of dirToBlock) {
      const variantProps = resolveInstanceVariantProps(
        block.component.variants,
        block.instance.variantId,
        block.instance.variantProps,
      );
      const files = await buildExportedBundleFiles(block.component.slug, framework, {
        variant: block.instance.variantId,
        ...variantProps,
      });
      if (!files) continue;
      for (const [relativeFilePath, content] of Object.entries(files)) {
        frameworkFiles[`src/components/${dir}/${relativeFilePath}`] = content;
      }
    }
    return frameworkFiles;
  }

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
Generated from the CompLib playground.

Structure:
- index.html
- styles/reset.css
- styles/layout.css
- styles/components.css
- scripts/components.js
- scripts/interactions.js

Layout uses document flow (stacked top→bottom by canvas order) so the page is readable and responsive.
Open index.html in a browser or serve the folder with any static server.
`;

  return {
    "index.html": indexHtml,
    "styles/reset.css": SHELL_STYLES,
    "styles/layout.css": placementCss,
    "styles/components.css": css,
    "scripts/components.js": js,
    "scripts/interactions.js": `document.addEventListener("DOMContentLoaded", () => {
  document.body.dataset.complibReady = "true";
});`,
    "README.txt": readme,
  };
}

export async function getResolvedTiers(
  instances: PlaygroundInstance[],
): Promise<Component["tier"][]> {
  const blocks = await resolveBlocks(instances);
  return blocks.map((b) => b.component.tier);
}

