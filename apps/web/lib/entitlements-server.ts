import type { Entitlements } from "@complib/entitlements";
import { getEntitlements } from "@complib/entitlements";
import { backendFetch } from "@/lib/server-backend";

const FREE_ENTITLEMENTS = getEntitlements({ plan: "FREE", role: "USER" });

/**
 * Authoritative entitlements from the API (Postgres plan + Clerk role).
 * Replaces Clerk-metadata-only checks on the web app.
 */
export async function fetchServerEntitlements(): Promise<Entitlements> {
  if (process.env.COMPLIB_UNLOCK_PRO_SOURCE === "true") {
    return getEntitlements({ plan: "PRO", role: "USER", unlockPro: true });
  }

  try {
    const res = await backendFetch("/api/entitlements/me");
    if (res.ok) {
      return (await res.json()) as Entitlements;
    }
  } catch {
    // API offline — safe default.
  }

  return FREE_ENTITLEMENTS;
}
