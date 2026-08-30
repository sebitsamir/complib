import type { Request } from "express";
import { createClerkClient } from "@clerk/clerk-sdk-node";
import type { ComponentBundle, ComponentTier } from "./component-store";
import { isClerkDisabledDev } from "./clerk-dev-mode";
import prisma from "../prisma";
import type { Plan } from "./access";

const PRO_MARKERS = new Set([
  "pro",
  "PRO",
  "Pro",
  "plus",
  "PLUS",
  "enterprise",
  "ENTERPRISE",
]);

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

function metadataGrantsPro(pub: Record<string, unknown> | undefined): boolean {
  if (!pub) return false;
  const keys = ["complibPlan", "plan", "subscriptionPlan", "tier"] as const;
  for (const k of keys) {
    const v = pub[k];
    if (typeof v === "string" && PRO_MARKERS.has(v)) return true;
  }
  return false;
}

function planGrantsPro(plan: Plan | undefined): boolean {
  return plan === "PRO" || plan === "ENTERPRISE";
}

async function proAccessFromSessionToken(token: string): Promise<boolean> {
  if (!token.trim()) return false;
  try {
    const payload = await clerk.verifyToken(token);
    const user = await clerk.users.getUser(payload.sub);
    if (
      metadataGrantsPro(
        user.publicMetadata as Record<string, unknown> | undefined,
      )
    ) {
      return true;
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: payload.sub },
      select: { plan: true },
    });
    return planGrantsPro(dbUser?.plan as Plan | undefined);
  } catch {
    return false;
  }
}

export async function userHasProSourceAccess(
  req?: Pick<Request, "headers" | "cookies">,
): Promise<boolean> {
  if (process.env.COMPLIB_UNLOCK_PRO_SOURCE === "true") return true;
  if (isClerkDisabledDev()) return true;
  if (!req) return false;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice("Bearer ".length).trim();
    if (await proAccessFromSessionToken(token)) return true;
  }

  const cookieToken = req.cookies?.__session;
  if (typeof cookieToken === "string" && cookieToken) {
    if (await proAccessFromSessionToken(cookieToken)) return true;
  }

  return false;
}

export function tierRequiresProSourceLock(tier: ComponentTier): boolean {
  return tier !== "FREE";
}

export function redactComponentSources(
  c: ComponentBundle,
  hasSourceAccess: boolean,
): ComponentBundle {
  if (!tierRequiresProSourceLock(c.tier) || hasSourceAccess) return c;
  return { ...c, html: "", css: "", runtime: "", js: "" };
}
