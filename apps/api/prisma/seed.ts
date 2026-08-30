import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "..", ".env"), override: true });

import { configurePrisma, getPrisma, resetPrisma } from "../src/prisma";
import { syncAllComponentsCatalog } from "../src/lib/catalog-sync";

async function main() {
  // Long catalog syncs are more stable on the Neon pooler endpoint.
  configurePrisma({ preferPooler: true });
  getPrisma();
  console.log("Indexing on-disk components into PostgreSQL…");
  const result = await syncAllComponentsCatalog();
  console.log(
    `Catalog sync complete: ${result.synced}/${result.total} indexed` +
      (result.pruned ? `, ${result.pruned} orphan(s) pruned` : "") +
      ".",
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await resetPrisma();
  });
