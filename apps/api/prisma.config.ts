// Prisma CLI config — migrations use the same URL rules as the runtime client.
import "dotenv/config";
import { defineConfig } from "prisma/config";

function isLocalHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

/** Connection string for `prisma migrate` / `db push` (prefer direct Neon endpoint). */
function migrationConnectionString(): string {
  const direct = process.env.DIRECT_DATABASE_URL?.trim();
  const database = process.env.DATABASE_URL?.trim();

  let chosen = direct || database;
  if (!chosen) {
    throw new Error("Set DIRECT_DATABASE_URL (preferred) or DATABASE_URL in apps/api/.env");
  }

  if (direct && database) {
    try {
      const d = new URL(direct);
      const db = new URL(database);
      if (isLocalHost(d.hostname) && !isLocalHost(db.hostname)) {
        chosen = database;
      }
    } catch {
      // keep chosen
    }
  }

  try {
    const url = new URL(chosen);
    const host = url.hostname.toLowerCase();
    if (host.includes("neon.tech")) {
      // Migrations should hit the direct compute endpoint, not the pooler.
      url.hostname = host.replace("-pooler.", ".");
      url.searchParams.set("sslmode", "require");
      url.searchParams.set("uselibpqcompat", "true");
      url.searchParams.delete("channel_binding");
      return url.toString();
    }
  } catch {
    // keep chosen
  }

  return chosen;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: migrationConnectionString(),
  },
});
