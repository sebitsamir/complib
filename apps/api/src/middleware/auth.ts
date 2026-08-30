import type { Request, Response, NextFunction } from "express";
import { createClerkClient } from "@clerk/clerk-sdk-node";
import prisma from "../prisma";
import type { Plan } from "../lib/access";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userPlan?: Plan;
      isAdmin?: boolean;
    }
  }
}

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const ADMIN_ROLE_MARKERS = new Set(["admin", "ADMIN", "Admin"]);

function metadataGrantsAdmin(
  pub: Record<string, unknown> | undefined,
): boolean {
  if (!pub) return false;
  const role = pub.complibRole ?? pub.role;
  return typeof role === "string" && ADMIN_ROLE_MARKERS.has(role);
}

function adminApiKeyMatches(req: Request): boolean {
  const configured = process.env.COMPLIB_ADMIN_API_KEY?.trim();
  if (!configured) return false;
  const provided = req.headers["x-complib-admin-key"];
  return typeof provided === "string" && provided === configured;
}

function devAdminBypassEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.COMPLIB_ALLOW_DEV_ADMIN === "true"
  );
}

async function verifyClerkToken(token: string): Promise<string | null> {
  if (!token.trim()) return null;
  try {
    const payload = await clerk.verifyToken(token);
    return payload.sub;
  } catch {
    return null;
  }
}

function extractSessionToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }
  const cookieToken = req.cookies?.__session;
  if (typeof cookieToken === "string" && cookieToken) return cookieToken;
  return null;
}

async function resolveRequestUser(req: Request): Promise<{
  clerkId: string;
  plan: Plan;
  isAdmin: boolean;
} | null> {
  const token = extractSessionToken(req);
  if (!token) return null;

  const clerkId = await verifyClerkToken(token);
  if (!clerkId) return null;

  let plan: Plan = "FREE";
  let isAdmin = false;

  try {
    const user = await clerk.users.getUser(clerkId);
    isAdmin = metadataGrantsAdmin(
      user.publicMetadata as Record<string, unknown> | undefined,
    );
  } catch {
    // Clerk metadata is optional; DB plan still applies.
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId },
    select: { plan: true },
  });
  if (dbUser?.plan) {
    plan = dbUser.plan as Plan;
    if (plan === "ENTERPRISE") isAdmin = true;
  }

  return { clerkId, plan, isAdmin };
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const resolved = await resolveRequestUser(req);
  if (!resolved) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }

  req.userId = resolved.clerkId;
  req.userPlan = resolved.plan;
  req.isAdmin = resolved.isAdmin;
  next();
}

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (adminApiKeyMatches(req)) {
    req.isAdmin = true;
    next();
    return;
  }

  if (devAdminBypassEnabled()) {
    req.isAdmin = true;
    next();
    return;
  }

  await requireAuth(req, res, async () => {
    if (req.isAdmin) {
      next();
      return;
    }
    res.status(403).json({ error: "Admin access required." });
  });
}

export async function attachUserIfPresent(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const resolved = await resolveRequestUser(req);
  if (resolved) {
    req.userId = resolved.clerkId;
    req.userPlan = resolved.plan;
    req.isAdmin = resolved.isAdmin;
  }
  next();
}
