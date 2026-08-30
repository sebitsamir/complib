/**
 * Wipe the on-disk catalog and seed Phase-1 primitives (50).
 *
 * Structure:
 *   content/components/primitives/{category}/{slug}/
 *     {slug}.json
 *     dimensions.json
 *     variants/{styleId}/config.json + html/{index.html,style.css,script.js}
 *     examples/ docs/ assets/
 */
import fs from "node:fs/promises";
import path from "node:path";
import {
  COMPONENTS_ROOT,
  GENERATED_ROOT,
  LEGACY_COMPONENTS_ROOT,
  publishComponentToDisk,
} from "../lib/component-fs";
import {
  PHASE1_PRIMITIVES,
  buildManifest,
  buildStyleVariants,
  defaultDimensions,
} from "../lib/phase1";

async function emptyDir(root: string) {
  const resolved = path.resolve(root);
  const reactComponents = path.resolve(process.cwd(), "components");
  if (resolved === reactComponents || resolved.startsWith(`${reactComponents}${path.sep}`)) {
    throw new Error(
      "Refusing to wipe the Next.js components/ folder. Use content/components for disk bundles.",
    );
  }
  await fs.mkdir(root, { recursive: true });
  const entries = await fs.readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    await fs.rm(path.join(root, entry.name), { recursive: true, force: true });
  }
}

async function clearGeneratedExports(keepSlugs: Set<string>) {
  for (const framework of ["react", "vue"]) {
    const root = path.join(GENERATED_ROOT, framework);
    try {
      const entries = await fs.readdir(root, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        if (!keepSlugs.has(entry.name)) {
          await fs.rm(path.join(root, entry.name), { recursive: true, force: true });
        }
      }
    } catch {
      // optional
    }
  }
}

async function main() {
  const count = PHASE1_PRIMITIVES.length;
  if (count !== 50) {
    console.warn(`Expected 50 Phase-1 primitives, found ${count}. Continuing anyway.`);
  }

  await emptyDir(COMPONENTS_ROOT);
  await emptyDir(LEGACY_COMPONENTS_ROOT);

  const keep = new Set(PHASE1_PRIMITIVES.map((d) => d.slug));

  for (const def of PHASE1_PRIMITIVES) {
    await publishComponentToDisk({
      slug: def.slug,
      layer: "primitives",
      category: def.category,
      component: buildManifest(def),
      dimensions: defaultDimensions(def),
      styleVariants: buildStyleVariants(def),
    });
    console.log(`  ✓ primitives/${def.category}/${def.slug}`);
  }

  await clearGeneratedExports(keep);

  console.log(`\nSeeded ${count} Phase-1 primitives under content/components/primitives/`);
  console.log("Next: cd backend && npm run sync-libs && npm run sync:catalog");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
