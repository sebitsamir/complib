import fs from "node:fs/promises";
import path from "node:path";
import { COMPONENTS_ROOT, LEGACY_COMPONENTS_ROOT, fileExists } from "../lib/component-fs";
import {
  ALLOWED_CATEGORIES_BY_LAYER,
  ALLOWED_PROBLEM_TAGS,
} from "../lib/taxonomy-defaults";

const ALLOWED_LAYERS = new Set(["primitives", "patterns", "sections", "templates"]);
const SKIPPED_SUBDIRS = new Set(["variants", "examples", "docs", "assets", "generated"]);

type ComponentJson = {
  slug?: string;
  name?: string;
  layer?: string;
  category?: string;
  problemTags?: string[];
};

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

async function collectJsonPaths(root: string): Promise<string[]> {
  const dirs = await walkForComponentDirs(root);
  const paths: string[] = [];
  for (const dir of dirs) {
    const manifest = await resolveManifestPath(dir);
    if (manifest) paths.push(manifest);
  }
  return paths;
}

function validateRow(filePath: string, row: ComponentJson): string[] {
  const errors: string[] = [];
  if (!row.slug || typeof row.slug !== "string") errors.push("missing slug");
  if (!row.name || typeof row.name !== "string") errors.push("missing name");
  if (!row.layer || !ALLOWED_LAYERS.has(row.layer)) errors.push("invalid layer");
  if (!row.category || typeof row.category !== "string") errors.push("missing category");
  else if (
    row.layer &&
    ALLOWED_LAYERS.has(row.layer) &&
    !ALLOWED_CATEGORIES_BY_LAYER[row.layer as keyof typeof ALLOWED_CATEGORIES_BY_LAYER]?.has(
      row.category,
    )
  ) {
    errors.push(`category "${row.category}" not in taxonomy for layer "${row.layer}"`);
  }
  if (!Array.isArray(row.problemTags) || row.problemTags.length === 0) {
    errors.push("missing problemTags");
  } else {
    const invalid = row.problemTags.filter((tag) => !ALLOWED_PROBLEM_TAGS.includes(tag as never));
    if (invalid.length > 0) {
      errors.push(`unsupported problemTags: ${invalid.join(", ")}`);
    }
  }
  return errors.length > 0
    ? [`${path.relative(process.cwd(), filePath)} -> ${errors.join("; ")}`]
    : [];
}

async function main() {
  const jsonPaths = [
    ...(await collectJsonPaths(COMPONENTS_ROOT)),
    ...(await collectJsonPaths(LEGACY_COMPONENTS_ROOT)),
  ];

  const failures: string[] = [];
  for (const jsonPath of jsonPaths) {
    if (!(await fileExists(jsonPath))) continue;
    const parsed = JSON.parse(await fs.readFile(jsonPath, "utf8")) as ComponentJson;
    failures.push(...validateRow(jsonPath, parsed));
  }

  if (failures.length > 0) {
    console.error("Admin taxonomy smoke test failed:");
    for (const row of failures) console.error(`- ${row}`);
    process.exit(1);
  }

  console.log(`Admin taxonomy smoke test passed (${jsonPaths.length} components checked).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
