import type { Request } from "express";
import type { Plan, UserRole } from "@complib/contracts";
import { getEntitlements } from "@complib/entitlements";

export function entitlementsForRequest(req: Pick<Request, "userPlan" | "userRole">) {
  return getEntitlements({
    plan: (req.userPlan ?? "FREE") as Plan,
    role: (req.userRole ?? "USER") as UserRole,
    unlockPro: process.env.COMPLIB_UNLOCK_PRO_SOURCE === "true",
  });
}
