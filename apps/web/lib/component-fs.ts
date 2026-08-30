import fs from "node:fs/promises";
import path from "node:path";
import type { ComponentTier } from "@/lib/component-store";
import { buildVariantManifest } from "@/lib/variant-manifest";
import {
  COMPONENTS_ROOT,
  GENERATED_ROOT,
  LEGACY_COMPONENTS_ROOT,
  STORAGE_ROOT,
} from "@/lib/artifact-paths";

export { COMPONENTS_ROOT, GENERATED_ROOT, LEGACY_COMPONENTS_ROOT, STORAGE_ROOT };

export type ComponentLayer =
  | "primitives"
  | "patterns"
  | "sections"
  | "templates";

export type ComponentVariant = {
  id: string;
  label: string;
  props?: Record<string, string>;
};

export type StyleVariantConfig = {
  id: string;
  label: string;
  description?: string;
  themes?: Array<"light" | "dark" | "auto">;
  tags?: string[];
};

export type ComponentStyleVariant = {
  id: string;
  label: string;
  config?: StyleVariantConfig;
};

export type ComponentDimensionsJson = {
  variants: ComponentVariant[];
};

export type ComponentJsonShape = {
  id: string;
  name: string;
  slug: string;
  description: string;
  tags: string[];
  tier: ComponentTier;
  layer: ComponentLayer;
  category: string;
  problemTags: string[];
  viewCount: number;
  defaultStyleId?: string;
  html?: string;
  css?: string;
  js?: string;
  runtime?: string;
  styleVariants?: { vanilla?: boolean; tailwind?: boolean };
  runtimeContract?: { mount?: string; unmount?: string };
  variants?: ComponentVariant[];
  themes?: Array<"light" | "dark" | "auto">;
};

export type ComponentDiskBundle = {
  slug: string;
  dir: string;
  json: ComponentJsonShape;
  html: string;
  css: string;
  js: string;
  runtime: string;
  tailwind: string | null;
  styleId: string;
  styleVariants: ComponentStyleVariant[];
  dimensions: ComponentVariant[];
};

export type ReadComponentOptions = {
  styleId?: string;
};

export type PublishStyleVariantInput = {
  id: string;
  label?: string;
  html: string;
  css: string;
  js: string;
};

export type PublishComponentInput = {
  slug: string;
  layer: ComponentLayer;
  category: string;
  component: ComponentJsonShape;
  dimensions: ComponentVariant[];
  styleVariants: PublishStyleVariantInput[];
  existingDir?: string | null;
};

let slugIndex: Map<string, string> | null = null;

export function invalidateComponentSlugIndex() {
  slugIndex = null;
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function titleCase(input: string): string {
  return input
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export function getComponentContentPath(
  layer: string,
  category: string,
  slug: string,
): string {
  return path.join(COMPONENTS_ROOT, layer, category, slug);
}

export function getComponentManifestPath(componentDir: string, slug: string): string {
  return path.join(componentDir, `${slug}.json`);
}

const SKIPPED_SUBDIRS = new Set(["variants", "examples", "docs", "assets", "generated"]);

async function resolveManifestPath(componentDir: string): Promise<string | null> {
  const slugGuess = path.basename(componentDir);
  const candidates = [
    path.join(componentDir, `${slugGuess}.json`),
    path.join(componentDir, "component.json"),
  ];
  for (const candidate of candidates) {
    if (await fileExists(candidate)) return candidate;
  }
  return null;
}

async function isComponentDir(dir: string): Promise<boolean> {
  return (await resolveManifestPath(dir)) !== null;
}

async function walkForComponentDirs(root: string): Promise<string[]> {
  const results: string[] = [];

  async function walk(current: string, depth: number) {
    if (await isComponentDir(current)) {
      results.push(current);
      return;
    }
    if (depth >= 3) return;
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory() || SKIPPED_SUBDIRS.has(entry.name)) continue;
      await walk(path.join(current, entry.name), depth + 1);
    }
  }

  if (!(await fileExists(root))) return [];
  const top = await fs.readdir(root, { withFileTypes: true });
  for (const entry of top) {
    if (entry.isDirectory()) {
      await walk(path.join(root, entry.name), 0);
    }
  }
  return results;
}

async function buildSlugIndex(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  for (const root of [COMPONENTS_ROOT, LEGACY_COMPONENTS_ROOT]) {
    const dirs = await walkForComponentDirs(root);
    for (const dir of dirs) {
      const manifestPath = await resolveManifestPath(dir);
      if (!manifestPath) continue;
      const parsed = JSON.parse(await fs.readFile(manifestPath, "utf8")) as Partial<ComponentJsonShape>;
      const slug = String(parsed.slug ?? path.basename(dir));
      if (!map.has(slug)) map.set(slug, dir);
    }
  }
  return map;
}

async function getSlugIndex(): Promise<Map<string, string>> {
  if (!slugIndex) slugIndex = await buildSlugIndex();
  return slugIndex;
}

export async function listComponentSlugs(): Promise<string[]> {
  const index = await getSlugIndex();
  return [...index.keys()].sort((a, b) => a.localeCompare(b));
}

export async function resolveComponentDir(slug: string): Promise<string | null> {
  const index = await getSlugIndex();
  const dir = index.get(slug);
  if (dir && (await isComponentDir(dir))) return dir;

  for (const root of [COMPONENTS_ROOT, LEGACY_COMPONENTS_ROOT]) {
    const legacy = path.join(root, slug);
    if (await isComponentDir(legacy)) return legacy;
  }
  return null;
}

export async function listStyleVariantIds(componentDir: string): Promise<string[]> {
  const variantsRoot = path.join(componentDir, "variants");
  if (!(await fileExists(variantsRoot))) return [];
  const entries = await fs.readdir(variantsRoot, { withFileTypes: true });
  const ids: string[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    ids.push(entry.name);
  }
  return ids.sort((a, b) => a.localeCompare(b));
}

async function readStyleVariantConfig(
  componentDir: string,
  styleId: string,
): Promise<StyleVariantConfig | null> {
  const configPath = path.join(componentDir, "variants", styleId, "config.json");
  if (!(await fileExists(configPath))) return null;
  const parsed = JSON.parse(await fs.readFile(configPath, "utf8")) as Partial<StyleVariantConfig>;
  if (!parsed?.id) return { id: styleId, label: titleCase(styleId) };
  return {
    id: String(parsed.id),
    label: String(parsed.label ?? titleCase(styleId)),
    description: parsed.description ? String(parsed.description) : undefined,
    themes: Array.isArray(parsed.themes)
      ? parsed.themes.filter(
          (theme): theme is "light" | "dark" | "auto" =>
            theme === "light" || theme === "dark" || theme === "auto",
        )
      : undefined,
    tags: Array.isArray(parsed.tags) ? parsed.tags.map((tag) => String(tag)) : undefined,
  };
}

export async function listStyleVariants(componentDir: string): Promise<ComponentStyleVariant[]> {
  const ids = await listStyleVariantIds(componentDir);
  const variants: ComponentStyleVariant[] = [];
  for (const id of ids) {
    const config = await readStyleVariantConfig(componentDir, id);
    variants.push({
      id,
      label: config?.label ?? titleCase(id),
      config: config ?? undefined,
    });
  }
  return variants;
}

async function readFirstExistingFile(candidates: string[]): Promise<string> {
  for (const candidate of candidates) {
    if (await fileExists(candidate)) {
      return await fs.readFile(candidate, "utf8");
    }
  }
  return "";
}

async function readStyleVariantSource(
  componentDir: string,
  styleId: string,
  parsed: Partial<ComponentJsonShape>,
): Promise<{ html: string; css: string; js: string; runtime: string }> {
  const variantRoot = path.join(componentDir, "variants", styleId);
  const htmlDir = path.join(variantRoot, "html");

  const html = parsed.html
    ? String(parsed.html)
    : await readFirstExistingFile([
        path.join(htmlDir, "index.html"),
        path.join(variantRoot, "index.html"),
        ...(styleId === "default"
          ? [path.join(componentDir, "vanilla.html")]
          : []),
      ]);

  const css = parsed.css
    ? String(parsed.css)
    : await readFirstExistingFile([
        path.join(htmlDir, "style.css"),
        path.join(variantRoot, "style.css"),
        ...(styleId === "default"
          ? [path.join(componentDir, "vanilla.css")]
          : []),
      ]);

  const js = parsed.js
    ? String(parsed.js)
    : await readFirstExistingFile([
        path.join(htmlDir, "script.js"),
        path.join(variantRoot, "script.js"),
        path.join(componentDir, "vanilla.js"),
      ]);

  const runtime = parsed.runtime
    ? String(parsed.runtime)
    : await readFirstExistingFile([
        path.join(htmlDir, "script.js"),
        path.join(variantRoot, "script.js"),
        path.join(componentDir, "runtime.js"),
        path.join(componentDir, "vanilla.js"),
      ]) || js;

  return { html, css, js, runtime };
}

async function readDimensions(
  componentDir: string,
  parsed: Partial<ComponentJsonShape>,
): Promise<ComponentVariant[]> {
  const dimensionsPath = path.join(componentDir, "dimensions.json");
  if (await fileExists(dimensionsPath)) {
    const dimensions = JSON.parse(await fs.readFile(dimensionsPath, "utf8")) as ComponentDimensionsJson;
    if (Array.isArray(dimensions?.variants)) {
      return normalizeVariants(dimensions.variants);
    }
  }
  return normalizeVariants(parsed.variants);
}

function normalizeVariants(variants: ComponentVariant[] | undefined): ComponentVariant[] {
  if (!Array.isArray(variants)) return [];
  return variants
    .filter(
      (variant): variant is ComponentVariant =>
        !!variant &&
        typeof variant.id === "string" &&
        typeof variant.label === "string",
    )
    .map((variant) => ({
      id: variant.id,
      label: variant.label,
      props:
        variant.props && typeof variant.props === "object"
          ? Object.fromEntries(
              Object.entries(variant.props).map(([key, value]) => [
                String(key),
                String(value),
              ]),
            )
          : undefined,
    }));
}

function resolveDefaultStyleId(
  parsed: Partial<ComponentJsonShape>,
  styleVariants: ComponentStyleVariant[],
): string {
  if (parsed.defaultStyleId && styleVariants.some((v) => v.id === parsed.defaultStyleId)) {
    return parsed.defaultStyleId;
  }
  if (styleVariants.some((v) => v.id === "default")) return "default";
  return styleVariants[0]?.id ?? "default";
}

function normalizeComponentJson(parsed: Partial<ComponentJsonShape>): ComponentJsonShape | null {
  if (
    !parsed.id ||
    !parsed.name ||
    !parsed.slug ||
    !parsed.description ||
    !parsed.tier ||
    !parsed.tags ||
    !parsed.layer ||
    !parsed.category ||
    !parsed.problemTags ||
    typeof parsed.viewCount !== "number"
  ) {
    return null;
  }

  return {
    id: String(parsed.id),
    name: String(parsed.name),
    slug: String(parsed.slug),
    description: String(parsed.description),
    tags: parsed.tags as string[],
    tier: parsed.tier as ComponentTier,
    layer: parsed.layer as ComponentLayer,
    category: String(parsed.category),
    problemTags: (parsed.problemTags as string[]).map((tag) => String(tag)),
    viewCount: parsed.viewCount,
    defaultStyleId: parsed.defaultStyleId ? String(parsed.defaultStyleId) : undefined,
    html: parsed.html ? String(parsed.html) : undefined,
    css: parsed.css ? String(parsed.css) : undefined,
    js: parsed.js ? String(parsed.js) : undefined,
    runtime: parsed.runtime ? String(parsed.runtime) : undefined,
    styleVariants: parsed.styleVariants,
    runtimeContract: parsed.runtimeContract,
    variants: normalizeVariants(parsed.variants),
    themes: Array.isArray(parsed.themes)
      ? parsed.themes.filter(
          (theme): theme is "light" | "dark" | "auto" =>
            theme === "light" || theme === "dark" || theme === "auto",
        )
      : undefined,
  };
}

export async function readComponentBundleFromDisk(
  slug: string,
  options: ReadComponentOptions = {},
): Promise<ComponentDiskBundle | null> {
  const dir = await resolveComponentDir(slug);
  if (!dir) return null;

  const manifestPath = await resolveManifestPath(dir);
  if (!manifestPath) return null;

  const parsed = JSON.parse(await fs.readFile(manifestPath, "utf8")) as Partial<ComponentJsonShape>;
  const json = normalizeComponentJson(parsed);
  if (!json) return null;

  let styleVariants = await listStyleVariants(dir);
  if (styleVariants.length === 0) {
    styleVariants = [{ id: "default", label: "Default" }];
  }

  const styleId =
    options.styleId && styleVariants.some((variant) => variant.id === options.styleId)
      ? options.styleId
      : resolveDefaultStyleId(json, styleVariants);

  const source = await readStyleVariantSource(dir, styleId, parsed);
  const dimensions = await readDimensions(dir, parsed);
  const tailwindPath = path.join(dir, "tailwind.ts");
  const tailwind = (await fileExists(tailwindPath))
    ? await fs.readFile(tailwindPath, "utf8")
    : null;

  return {
    slug,
    dir,
    json,
    html: source.html,
    css: source.css,
    js: source.js,
    runtime: source.runtime,
    tailwind,
    styleId,
    styleVariants,
    dimensions,
  };
}

export async function readStyleVariantBundle(
  slug: string,
  styleId: string,
): Promise<ComponentDiskBundle | null> {
  return readComponentBundleFromDisk(slug, { styleId });
}

async function ensureSatelliteDirs(componentDir: string) {
  for (const name of ["examples", "docs", "assets"]) {
    await fs.mkdir(path.join(componentDir, name), { recursive: true });
  }
}

export async function publishComponentToDisk(input: PublishComponentInput): Promise<string> {
  const targetDir = getComponentContentPath(input.layer, input.category, input.slug);
  if (input.existingDir && path.resolve(input.existingDir) !== path.resolve(targetDir)) {
    await fs.mkdir(path.dirname(targetDir), { recursive: true });
    await fs.rename(input.existingDir, targetDir);
  } else {
    await fs.mkdir(targetDir, { recursive: true });
  }

  const manifest: ComponentJsonShape = {
    ...input.component,
    slug: input.slug,
    id: input.slug,
    layer: input.layer,
    category: input.category,
    defaultStyleId: input.styleVariants[0]?.id ?? "default",
    variants: undefined,
    html: undefined,
    css: undefined,
    js: undefined,
    runtime: undefined,
  };

  await fs.writeFile(
    getComponentManifestPath(targetDir, input.slug),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );

  if (input.dimensions.length > 0) {
    const dimensions: ComponentDimensionsJson = { variants: input.dimensions };
    await fs.writeFile(
      path.join(targetDir, "dimensions.json"),
      `${JSON.stringify(dimensions, null, 2)}\n`,
      "utf8",
    );
  } else if (await fileExists(path.join(targetDir, "dimensions.json"))) {
    await fs.unlink(path.join(targetDir, "dimensions.json"));
  }

  const existingStyles = new Set(await listStyleVariantIds(targetDir));
  const primaryStyle = input.styleVariants.find(
    (style) => style.html || style.css || style.js,
  );

  for (const style of input.styleVariants) {
    const variantDir = path.join(targetDir, "variants", style.id);
    const htmlDir = path.join(variantDir, "html");
    await fs.mkdir(htmlDir, { recursive: true });

    let html = style.html;
    let css = style.css;
    let js = style.js;

    if (!html && !css && !js) {
      if (existingStyles.has(style.id)) {
        const existing = await readStyleVariantSource(targetDir, style.id, {});
        html = existing.html;
        css = existing.css;
        js = existing.js;
      } else if (primaryStyle) {
        html = primaryStyle.html;
        css = primaryStyle.css;
        js = primaryStyle.js;
      }
    }

    await fs.writeFile(path.join(htmlDir, "index.html"), html, "utf8");
    await fs.writeFile(path.join(htmlDir, "style.css"), css, "utf8");
    await fs.writeFile(path.join(htmlDir, "script.js"), js, "utf8");

    const config = buildVariantManifest(
      { slug: input.slug, json: manifest },
      style.id,
      style.label ?? titleCase(style.id),
    );
    await fs.writeFile(
      path.join(variantDir, "config.json"),
      `${JSON.stringify(config, null, 2)}\n`,
      "utf8",
    );
  }

  await ensureSatelliteDirs(targetDir);

  const legacyManifest = path.join(targetDir, "component.json");
  if (await fileExists(legacyManifest)) {
    await fs.unlink(legacyManifest);
  }
  for (const legacyFile of ["vanilla.html", "vanilla.css", "vanilla.js", "runtime.js"]) {
    const legacyPath = path.join(targetDir, legacyFile);
    if (await fileExists(legacyPath)) {
      await fs.unlink(legacyPath);
    }
  }

  invalidateComponentSlugIndex();
  return targetDir;
}
