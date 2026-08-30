import fs from "node:fs/promises";
import path from "node:path";
import { listComponentSlugs } from "../lib/component-fs";
import { ensureGeneratedBundle } from "../lib/framework-output";

async function main() {
  const slugs = await listComponentSlugs();
  let count = 0;
  for (const slug of slugs) {
    const ok = await ensureGeneratedBundle(slug);
    if (ok) count += 1;
  }
  console.log(`Generated production React/Vue/vanilla bundles for ${count} components.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
