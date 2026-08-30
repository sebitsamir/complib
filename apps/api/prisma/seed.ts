import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "..", ".env"), override: true });

import { syncAllComponentsCatalog } from "../src/lib/catalog-sync";

async function main() {
  console.log("Indexing on-disk components into PostgreSQL…");
  const result = await syncAllComponentsCatalog();
  console.log(
    `Catalog sync complete: ${result.synced}/${result.total} indexed` +
      (result.pruned ? `, ${result.pruned} orphan(s) pruned` : "") +
      ".",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
