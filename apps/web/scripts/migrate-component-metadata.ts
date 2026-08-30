import fs from "node:fs/promises";
import path from "node:path";
import {
  COMPONENTS_ROOT,
  LEGACY_COMPONENTS_ROOT,
  type ComponentLayer,
  type ComponentJsonShape,
} from "../lib/component-fs";

type JsonWithTaxonomy = ComponentJsonShape & {
  category?: string;
  problemTags?: string[];
  variants?: Array<{ id: string; label: string; props?: Record<string, string> }>;
  themes?: Array<"light" | "dark" | "auto">;
};

const layerHints: Array<{ needles: string[]; layer: ComponentLayer }> = [
  { needles: ["layout", "typography", "input", "overlay", "feedback"], layer: "primitives" },
  { needles: ["card", "navigation", "form", "table", "pricing"], layer: "patterns" },
  { needles: ["hero", "feature", "testimonial", "faq", "footer"], layer: "sections" },
  {
    needles: ["template", "landing", "dashboard", "portfolio", "blog", "admin"],
    layer: "templates",
  },
];

function inferLayer(moduleSlug: string): ComponentLayer {
  const value = moduleSlug.toLowerCase();
  for (const hint of layerHints) {
    if (hint.needles.some((needle) => value.includes(needle))) return hint.layer;
  }
  return "patterns";
}

function inferLayerFromSlug(slug: string): ComponentLayer {
  return inferLayer(slug);
}

function inferProblemTags(data: JsonWithTaxonomy): string[] {
  const normalizedTags = data.tags.map((tag) => tag.toLowerCase());
  if (normalizedTags.some((tag) => tag.includes("auth"))) return ["build-authentication"];
  if (normalizedTags.some((tag) => tag.includes("dashboard"))) return ["build-dashboard"];
  if (normalizedTags.some((tag) => tag.includes("form"))) return ["build-form"];
  return data.layer === "templates" ? ["build-landing-page"] : ["build-ui-sections"];
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function listSlugs(root: string): Promise<string[]> {
  if (!(await fileExists(root))) return [];
  const entries = await fs.readdir(root, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

async function migrateOne(root: string, slug: string): Promise<boolean> {
  const jsonPath = path.join(root, slug, "component.json");
  if (!(await fileExists(jsonPath))) return false;
  const parsed = JSON.parse(await fs.readFile(jsonPath, "utf8")) as JsonWithTaxonomy;
  if (!parsed || !Array.isArray(parsed.tags)) return false;

  const legacyModuleSlug =
    typeof (parsed as { module?: { slug?: string } }).module?.slug === "string"
      ? String((parsed as { module?: { slug?: string } }).module?.slug)
      : slug;
  const layer = parsed.layer ?? inferLayerFromSlug(legacyModuleSlug);
  const category = parsed.category ?? legacyModuleSlug;
  const problemTags = parsed.problemTags ?? inferProblemTags({ ...parsed, layer });
  const themes = parsed.themes ?? ["light", "dark", "auto"];
  const variants = parsed.variants ?? [];

  const next: JsonWithTaxonomy = {
    ...parsed,
    layer,
    category,
    problemTags,
    themes,
    variants,
  };
  delete (next as { module?: unknown }).module;

  await fs.writeFile(jsonPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  return true;
}

async function main() {
  const roots = [COMPONENTS_ROOT, LEGACY_COMPONENTS_ROOT];
  let migrated = 0;

  for (const root of roots) {
    const slugs = await listSlugs(root);
    for (const slug of slugs) {
      if (await migrateOne(root, slug)) migrated += 1;
    }
  }

  console.log(`Migrated metadata for ${migrated} components.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
