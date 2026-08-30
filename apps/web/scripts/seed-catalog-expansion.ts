/**
 * Seed patterns, sections, and templates from apps/web/lib/catalog into storage/components.
 * Does not remove existing primitives.
 *
 * Usage: npm run seed:catalog -w @complib/web
 * Then:  npm run sync:catalog
 */
import fs from "node:fs/promises";
import { publishComponentToDisk, COMPONENTS_ROOT } from "../lib/component-fs";
import path from "node:path";
import { ALL_CATALOG_COMPONENTS } from "../lib/catalog";
import {
  buildCatalogManifest,
  buildCatalogStyleVariants,
  defaultCatalogDimensions,
} from "../lib/catalog/shared";

async function componentExists(slug: string, layer: string, category: string): Promise<boolean> {
  const dir = path.join(COMPONENTS_ROOT, layer, category, slug);
  try {
    const stat = await fs.stat(dir);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

async function main() {
  let created = 0;
  let skipped = 0;

  for (const def of ALL_CATALOG_COMPONENTS) {
    const exists = await componentExists(def.slug, def.layer, def.category);
    if (exists) {
      skipped += 1;
      continue;
    }

    await publishComponentToDisk({
      slug: def.slug,
      layer: def.layer,
      category: def.category,
      component: buildCatalogManifest(def),
      dimensions: defaultCatalogDimensions(def),
      styleVariants: buildCatalogStyleVariants(def),
    });
    created += 1;
    console.log(`  ✓ ${def.layer}/${def.category}/${def.slug}`);
  }

  console.log(
    `\nCatalog expansion complete: ${created} created, ${skipped} skipped (already on disk).`,
  );
  console.log("Next: npm run sync:catalog");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
