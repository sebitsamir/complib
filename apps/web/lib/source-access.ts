import { currentUser } from "@clerk/nextjs/server";import {
  redactComponentSources,
  tierRequiresProSourceLock,
} from "@/lib/source-access-utils";

export { redactComponentSources, tierRequiresProSourceLock };

const PRO_MARKERS = new Set([
  "pro",
  "PRO",
  "Pro",
  "plus",
  "PLUS",
  "enterprise",
  "ENTERPRISE",
]);

/**
 * Who can see HTML/CSS/JS, copy, edit, and download source.
 * Set Clerk user publicMetadata, e.g. { "complibPlan": "pro" } (Dashboard → Users → metadata),
 * or wire your billing webhook to update metadata.
 *
 * COMPLIB_UNLOCK_PRO_SOURCE=true in .env.local unlocks for local dev only.
 */
export async function userHasProSourceAccess(): Promise<boolean> {
  if (process.env.COMPLIB_UNLOCK_PRO_SOURCE === "true") return true;
  try {
    const user = await currentUser();
    if (!user) return false;
    const pub = user.publicMetadata as Record<string, unknown> | undefined;
    const keys = ["complibPlan", "plan", "subscriptionPlan", "tier"] as const;
    for (const k of keys) {
      const v = pub?.[k];
      if (typeof v === "string" && PRO_MARKERS.has(v)) return true;
    }
    return false;
  } catch {
    return false;
  }
}

