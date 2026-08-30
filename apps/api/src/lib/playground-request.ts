import type { PlaygroundInstance } from "./playground-merge";
import type { PlaygroundPageSource } from "./playground-page-artifact";
import { parseFramework, type ComponentFramework } from "./framework-output";

const MAX_INSTANCES = 48;

export type PlaygroundExportKind = "library" | "scaffold";
export type PlaygroundExportStack = "vite-react" | "vite-vue" | "next-app";

export type ParsePlaygroundInstancesBodyResult =
  | {
      ok: true;
      instances: PlaygroundInstance[];
      framework: ComponentFramework;
      exportKind: PlaygroundExportKind;
      stack: PlaygroundExportStack | null;
      pageSource: PlaygroundPageSource | null;
    }
  | { ok: false; error: string; status: number };

function parsePageSource(raw: unknown): PlaygroundPageSource | null {
  if (raw === null || typeof raw !== "object") return null;
  const source = raw as Record<string, unknown>;
  const html = source.html;
  const layoutCss = source.layoutCss;
  const componentsCss = source.componentsCss;
  const js = source.js;
  const editorHeight = source.editorHeight;
  if (
    typeof html !== "string" ||
    typeof layoutCss !== "string" ||
    typeof componentsCss !== "string" ||
    typeof js !== "string" ||
    typeof editorHeight !== "number" ||
    !Number.isFinite(editorHeight)
  ) {
    return null;
  }
  return { html, layoutCss, componentsCss, js, editorHeight };
}

export function parsePlaygroundInstancesBody(
  data: unknown,
): ParsePlaygroundInstancesBodyResult {
  if (data === null || typeof data !== "object") {
    return { ok: false, error: "Invalid JSON body", status: 400 };
  }
  const raw = (data as { instances?: unknown }).instances;
  const framework = parseFramework(
    (data as { framework?: unknown }).framework as string | undefined,
  );
  const exportKindRaw = (data as { exportKind?: unknown }).exportKind;
  const exportKind: PlaygroundExportKind =
    exportKindRaw === "scaffold" ? "scaffold" : "library";
  const stackRaw = (data as { stack?: unknown }).stack;
  const stack: PlaygroundExportStack | null =
    stackRaw === "vite-react" || stackRaw === "vite-vue" || stackRaw === "next-app"
      ? stackRaw
      : null;
  const pageSource = parsePageSource((data as { pageSource?: unknown }).pageSource);
  if (!Array.isArray(raw)) {
    return { ok: false, error: '"instances" must be an array', status: 400 };
  }
  if (raw.length > MAX_INSTANCES) {
    return { ok: false, error: "Too many instances", status: 413 };
  }

  const instances: PlaygroundInstance[] = [];
  for (const row of raw) {
    if (row === null || typeof row !== "object") {
      return { ok: false, error: "Each instance must be an object", status: 400 };
    }
    const id = (row as { id?: unknown }).id;
    const slug = (row as { slug?: unknown }).slug;
    const x = (row as { x?: unknown }).x;
    const y = (row as { y?: unknown }).y;
    const width = (row as { width?: unknown }).width;
    const height = (row as { height?: unknown }).height;
    const zIndex = (row as { zIndex?: unknown }).zIndex;
    const heightAuto = (row as { heightAuto?: unknown }).heightAuto === true;
    const variantId = (row as { variantId?: unknown }).variantId;
    const variantPropsRaw = (row as { variantProps?: unknown }).variantProps;
    if (
      typeof id !== "string" ||
      typeof slug !== "string" ||
      typeof x !== "number" ||
      typeof y !== "number" ||
      typeof width !== "number" ||
      typeof height !== "number"
    ) {
      return {
        ok: false,
        error: "Each instance needs id, slug, x, y, width, and height",
        status: 400,
      };
    }
    const ti = id.trim();
    const ts = slug.trim();
    if (!ti || !ts) {
      return { ok: false, error: "id and slug must be non-empty", status: 400 };
    }
    if (
      !Number.isFinite(x) ||
      !Number.isFinite(y) ||
      !Number.isFinite(width) ||
      !Number.isFinite(height)
    ) {
      return { ok: false, error: "Layout values must be finite numbers", status: 400 };
    }
    let variantProps: Record<string, string> | undefined;
    if (variantPropsRaw && typeof variantPropsRaw === "object" && !Array.isArray(variantPropsRaw)) {
      const entries = Object.entries(variantPropsRaw as Record<string, unknown>).filter(
        ([, value]) => typeof value === "string" && value.trim(),
      ) as [string, string][];
      if (entries.length > 0) {
        variantProps = Object.fromEntries(entries.map(([key, value]) => [key, value.trim()]));
      }
    }

    instances.push({
      id: ti,
      slug: ts,
      x,
      y,
      width,
      height,
      zIndex: typeof zIndex === "number" && Number.isFinite(zIndex) ? zIndex : 1,
      ...(heightAuto ? { heightAuto: true } : {}),
      ...(typeof variantId === "string" && variantId.trim()
        ? { variantId: variantId.trim() }
        : {}),
      ...(variantProps ? { variantProps } : {}),
    });
  }

  if (exportKind === "scaffold") {
    if (!stack) {
      return { ok: false, error: '"stack" is required for scaffold exports', status: 400 };
    }
    if (stack === "vite-react" && framework !== "react") {
      return {
        ok: false,
        error: '"framework" must be "react" for stack "vite-react"',
        status: 400,
      };
    }
    if (stack === "vite-vue" && framework !== "vue") {
      return {
        ok: false,
        error: '"framework" must be "vue" for stack "vite-vue"',
        status: 400,
      };
    }
    if (stack === "next-app" && framework !== "react") {
      return {
        ok: false,
        error: '"framework" must be "react" for stack "next-app"',
        status: 400,
      };
    }
  }

  return { ok: true, instances, framework, exportKind, stack, pageSource };
}

