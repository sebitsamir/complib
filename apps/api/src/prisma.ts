/* Lazy Prisma client so the API can boot before `prisma generate` (DB routes fail until then). */

import path from "node:path";
import dotenv from "dotenv";

// Scripts like `npm run sync:catalog` do not go through server.ts — load backend/.env here.
dotenv.config({ path: path.resolve(process.cwd(), ".env"), override: true });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaClientInstance = any;

let prismaClient: PrismaClientInstance | null = null;

function isLocalHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

function withNeonSsl(connectionString: string): string {
  try {
    const url = new URL(connectionString);
    const host = url.hostname.toLowerCase();
    if (!host.includes("neon.tech")) return connectionString;

    // Runtime queries are happier on the pooler endpoint.
    if (!host.includes("-pooler.")) {
      url.hostname = host.replace(".c-", "-pooler.c-");
    }

    // Avoid pg v8 treating require as verify-full (can hang / fail on Neon).
    url.searchParams.set("sslmode", "require");
    url.searchParams.set("uselibpqcompat", "true");
    url.searchParams.delete("channel_binding");
    return url.toString();
  } catch {
    return connectionString;
  }
}

function resolveConnectionString(): string {
  const direct = process.env.DIRECT_DATABASE_URL?.trim();
  const database = process.env.DATABASE_URL?.trim();

  let chosen = direct || database;
  if (!chosen) {
    throw new Error(
      "Set DIRECT_DATABASE_URL (preferred) or DATABASE_URL in apps/api/.env",
    );
  }

  // Common misconfig: Neon/hosted URL in DATABASE_URL + leftover local prisma-dev in DIRECT.
  if (direct && database) {
    try {
      const d = new URL(direct);
      const db = new URL(database);
      if (isLocalHost(d.hostname) && !isLocalHost(db.hostname)) {
        chosen = database;
        console.warn(
          "[prisma] DIRECT_DATABASE_URL points at localhost but DATABASE_URL is remote — using DATABASE_URL.",
        );
      }
    } catch {
      // keep chosen
    }
  }

  if (chosen.startsWith("prisma+")) {
    throw new Error(
      "That URL starts with prisma+postgres://. The pg adapter needs a direct postgres:// or postgresql:// TCP URL — put it in DIRECT_DATABASE_URL (from your host dashboard or `npx prisma dev`).",
    );
  }
  return withNeonSsl(chosen);
}

export function getPrisma(): PrismaClientInstance {
  if (!prismaClient) {
    try {
      const { PrismaClient } = require("@prisma/client") as {
        PrismaClient: new (args: {
          adapter: unknown;
          log?: string[];
        }) => PrismaClientInstance;
      };
      const { PrismaPg } = require("@prisma/adapter-pg") as {
        PrismaPg: new (args: { connectionString: string }) => unknown;
      };
      const connectionString = resolveConnectionString();
      const adapter = new PrismaPg({ connectionString });
      prismaClient = new PrismaClient({ adapter, log: ["warn", "error"] });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(
        `Database client not ready. Check apps/api/.env and run "npx prisma generate". (${message})`,
      );
    }
  }
  return prismaClient;
}

const prisma = new Proxy({} as PrismaClientInstance, {
  get(_target, prop) {
    const client = getPrisma();
    const value = client[prop as keyof PrismaClientInstance];
    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(client);
    }
    return value;
  },
});

export default prisma;
