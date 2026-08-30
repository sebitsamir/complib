import type { Request } from "express";
import { createClerkClient } from "@clerk/clerk-sdk-node";
import type { ComponentBundle, ComponentTier } from "./component-store";
import { isClerkDisabledDev } from "./clerk-dev-mode";
import prisma from "../prisma";
import type { Plan } from "@complib/contracts";
import { getEntitlements, roleFromClerkMetadata } from "@complib/entitlements";

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

async function entitlementsFromSessionToken(token: string) {
  if (!token.trim()) return null;
  try {
    const payload = await clerk.verifyToken(token);
    const user = await clerk.users.getUser(payload.sub);
    const role = roleFromClerkMetadata(
      user.publicMetadata as Record<string, unknown> | undefined,
    );
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: payload.sub },
      select: { plan: true },
    });
    const plan = (dbUser?.plan as Plan | undefined) ?? "FREE";
    return getEntitlements({
      plan,
      role,
      unlockPro: process.env.COMPLIB_UNLOCK_PRO_SOURCE === "true",
    });
  } catch {
    return null;
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
    const entitlements = await entitlementsFromSessionToken(token);
    if (entitlements?.canViewSource) return true;
  }

  const cookieToken = req.cookies?.__session;
  if (typeof cookieToken === "string" && cookieToken) {
    const entitlements = await entitlementsFromSessionToken(cookieToken);
    if (entitlements?.canViewSource) return true;
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
