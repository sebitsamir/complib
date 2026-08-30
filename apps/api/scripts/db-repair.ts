/**
 * Clears failed or legacy Prisma migration state and drops CompLib tables
 * so `prisma migrate deploy` can apply the squashed init migration cleanly.
 *
 * Usage (from repo root):
 *   npm run db:repair -w @complib/api
 *   npm run db:migrate -w @complib/api
 *
 * Requires COMPLIB_DB_REPAIR_CONFIRM=yes — destructive to application data.
 */

import { execSync } from "node:child_process";
import path from "node:path";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const CONFIRM = process.env.COMPLIB_DB_REPAIR_CONFIRM === "yes";

const DROP_STATEMENTS = `
DROP TABLE IF EXISTS
  "SubscriptionEvent",
  "Subscription",
  "WebhookEvent",
  "ComponentDocumentation",
  "ComponentExample",
  "ComponentFramework",
  "ComponentDependency",
  "ComponentRevision",
  "ComponentView",
  "DownloadEvent",
  "CollectionItem",
  "UserCollection",
  "UserRecent",
  "UserFavorite",
  "CatalogComponentTag",
  "CatalogVariant",
  "CatalogComponent",
  "Tag",
  "AuditLog",
  "User"
CASCADE;

DROP TYPE IF EXISTS "SubscriptionStatus" CASCADE;
DROP TYPE IF EXISTS "UserRole" CASCADE;
DROP TYPE IF EXISTS "ComponentLayer" CASCADE;
DROP TYPE IF EXISTS "ComponentTier" CASCADE;
DROP TYPE IF EXISTS "Plan" CASCADE;

DELETE FROM "_prisma_migrations";
`;

function resolveConnectionString(): string {
  const direct = process.env.DIRECT_DATABASE_URL?.trim();
  const database = process.env.DATABASE_URL?.trim();
  const chosen = direct || database;
  if (!chosen) {
    throw new Error("Set DIRECT_DATABASE_URL or DATABASE_URL in apps/api/.env");
  }
  return chosen;
}

async function main(): Promise<void> {
  if (!CONFIRM) {
    console.error(
      [
        "Refusing to repair database without explicit confirmation.",
        "This drops all CompLib tables and clears migration history.",
        "",
        "  set COMPLIB_DB_REPAIR_CONFIRM=yes",
        "  npm run db:repair -w @complib/api",
        "  npm run db:migrate -w @complib/api",
        "  npm run sync:catalog -w @complib/api",
      ].join("\n"),
    );
    process.exit(1);
  }

  const connectionString = resolveConnectionString();
  const client = new pg.Client({ connectionString });

  try {
    await client.connect();
    console.log("[db:repair] Dropping CompLib tables and clearing migration history…");
    await client.query(DROP_STATEMENTS);
    console.log("[db:repair] Database reset complete. Running prisma migrate deploy…");
  } finally {
    await client.end();
  }

  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    cwd: process.cwd(),
    env: process.env,
  });

  console.log("[db:repair] Migrations applied. Run `npm run sync:catalog -w @complib/api` next.");
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error("[db:repair] Failed:", message);
  process.exit(1);
});
