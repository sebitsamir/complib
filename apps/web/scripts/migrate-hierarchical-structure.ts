import fs from "node:fs/promises";
import path from "node:path";
import {
  COMPONENTS_ROOT,
  fileExists,
  getComponentContentPath,
  publishComponentToDisk,
  type ComponentJsonShape,
  type ComponentLayer,
} from "../lib/component-fs";
import { STYLE_FAMILY_DEFS } from "../lib/style-navigation";

function titleCase(input: string): string {
  return input
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function styleLabel(styleId: string): string {
  return STYLE_FAMILY_DEFS.find((entry) => entry.slug === styleId)?.label ?? titleCase(styleId);
}

async function readTextIfExists(filePath: string): Promise<string> {
  if (!(await fileExists(filePath))) return "";
  return fs.readFile(filePath, "utf8");
}

async function migrateFlatComponent(slug: string): Promise<boolean> {
  const sourceDir = path.join(COMPONENTS_ROOT, slug);
  const jsonPath = path.join(sourceDir, "component.json");
  if (!(await fileExists(jsonPath))) return false;

  const parsed = JSON.parse(await fs.readFile(jsonPath, "utf8")) as ComponentJsonShape;
  if (!parsed.layer || !parsed.category) {
    console.warn(`Skipping ${slug}: missing layer/category`);
    return false;
  }

  const html = await readTextIfExists(path.join(sourceDir, "vanilla.html"));
  const css = await readTextIfExists(path.join(sourceDir, "vanilla.css"));
  const js =
    (await readTextIfExists(path.join(sourceDir, "runtime.js"))) ||
    (await readTextIfExists(path.join(sourceDir, "vanilla.js")));

  const styleIds = new Set<string>(["default"]);
  for (const tag of parsed.tags ?? []) {
    const family = STYLE_FAMILY_DEFS.find((entry) => entry.slug === tag);
    if (family && family.slug !== "standard") styleIds.add(family.slug);
  }

  const styleVariants = [...styleIds].map((id) => ({
    id,
    label: styleLabel(id),
    html,
    css,
    js,
  }));

  const targetDir = getComponentContentPath(parsed.layer, parsed.category, slug);
  if (path.resolve(targetDir) === path.resolve(sourceDir)) {
    await publishComponentToDisk({
      slug,
      layer: parsed.layer as ComponentLayer,
      category: parsed.category,
      component: parsed,
      dimensions: parsed.variants ?? [],
      styleVariants,
      existingDir: sourceDir,
    });
    return true;
  }

  await publishComponentToDisk({
    slug,
    layer: parsed.layer as ComponentLayer,
    category: parsed.category,
    component: parsed,
    dimensions: parsed.variants ?? [],
    styleVariants,
    existingDir: null,
  });

  await fs.rm(sourceDir, { recursive: true, force: true });
  return true;
}

async function main() {
  if (!(await fileExists(COMPONENTS_ROOT))) {
    console.log("No components root found.");
    return;
  }

  const entries = await fs.readdir(COMPONENTS_ROOT, { withFileTypes: true });
  const flatSlugs: string[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (await fileExists(path.join(COMPONENTS_ROOT, entry.name, "component.json"))) {
      flatSlugs.push(entry.name);
    }
  }

  let migrated = 0;
  for (const slug of flatSlugs) {
    if (await migrateFlatComponent(slug)) migrated += 1;
  }

  console.log(`Migrated ${migrated} component(s) to hierarchical layout.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
