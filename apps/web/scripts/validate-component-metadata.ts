import fs from "node:fs/promises";
import path from "node:path";
import {
  COMPONENTS_ROOT,
  LEGACY_COMPONENTS_ROOT,
  fileExists,
  type ComponentJsonShape,
  type ComponentVariant,
} from "../lib/component-fs";
import { extractDimensions } from "../lib/variant-utils";

type JsonWithTaxonomy = ComponentJsonShape & {
  category?: string;
  problemTags?: string[];
};

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

async function listComponentJsonPaths(root: string): Promise<string[]> {
  const dirs = await walkForComponentDirs(root);
  const paths: string[] = [];
  for (const dir of dirs) {
    const manifest = await resolveManifestPath(dir);
    if (manifest) paths.push(manifest);
  }
  return paths;
}

async function readDimensions(
  componentDir: string,
  parsed: JsonWithTaxonomy,
): Promise<ComponentVariant[] | undefined> {
  const dimensionsPath = path.join(componentDir, "dimensions.json");
  if (await fileExists(dimensionsPath)) {
    const dimensions = JSON.parse(await fs.readFile(dimensionsPath, "utf8")) as {
      variants?: ComponentVariant[];
    };
    if (Array.isArray(dimensions.variants)) return dimensions.variants;
  }
  return parsed.variants;
}

function validateVariants(variants: ComponentVariant[] | undefined): string[] {
  if (!variants?.length) return [];
  const issues: string[] = [];
  const ids = new Set<string>();

  for (const variant of variants) {
    if (!variant.id?.trim()) issues.push("variant missing id");
    if (!variant.label?.trim()) issues.push(`variant "${variant.id}" missing label`);
    if (variant.id && ids.has(variant.id)) {
      issues.push(`duplicate variant id "${variant.id}"`);
    }
    if (variant.id) ids.add(variant.id);

    const props = variant.props ?? {};
    for (const [key, value] of Object.entries(props)) {
      if (!key.trim()) issues.push(`variant "${variant.id}" has empty prop key`);
      if (!String(value).trim()) {
        issues.push(`variant "${variant.id}" prop "${key}" has empty value`);
      }
    }
  }

  const dimensions = extractDimensions(variants);
  if (dimensions.length === 0 && variants.length > 1) {
    const multiProp = variants.filter((v) => Object.keys(v.props ?? {}).length > 1);
    if (multiProp.length === 0) {
      issues.push(
        "multiple single-axis variants without clear dimensions — consider grouping by prop key",
      );
    }
  }

  return issues;
}

async function main() {
  const paths = [
    ...(await listComponentJsonPaths(COMPONENTS_ROOT)),
    ...(await listComponentJsonPaths(LEGACY_COMPONENTS_ROOT)),
  ];

  let errors = 0;

  for (const jsonPath of paths) {
    if (!(await fileExists(jsonPath))) continue;
    const componentDir = path.dirname(jsonPath);
    const parsed = JSON.parse(await fs.readFile(jsonPath, "utf8")) as JsonWithTaxonomy;
    const missing: string[] = [];
    if (!parsed.layer) missing.push("layer");
    if (!parsed.category) missing.push("category");
    if (!parsed.problemTags || parsed.problemTags.length === 0) missing.push("problemTags");

    const dimensions = await readDimensions(componentDir, parsed);
    const variantIssues = validateVariants(dimensions);
    if (variantIssues.length > 0) {
      const label = path.relative(process.cwd(), jsonPath);
      errors += variantIssues.length;
      for (const issue of variantIssues) {
        console.error(`ERROR ${label}: ${issue}`);
      }
    }

    if (missing.length === 0) continue;

    const label = path.relative(process.cwd(), jsonPath);
    errors += 1;
    console.error(`ERROR ${label}: missing ${missing.join(", ")}`);
  }
  if (errors > 0) {
    console.error(`Validation failed with ${errors} error(s).`);
    process.exit(1);
  }
  console.log("Validation passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
