import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getEntitlements, roleFromClerkMetadata } from "@complib/entitlements";
import type { Plan } from "@complib/contracts";
import prisma from "../prisma";
import { createClerkClient } from "@clerk/clerk-sdk-node";

const router = Router();
const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

router.get("/me", requireAuth, async (req, res) => {
  let plan: Plan = req.userPlan ?? "FREE";
  let role = roleFromClerkMetadata(undefined);

  if (req.userId) {
    try {
      const user = await clerk.users.getUser(req.userId);
      role = roleFromClerkMetadata(
        user.publicMetadata as Record<string, unknown> | undefined,
      );
    } catch {
      // optional
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: req.userId },
      select: { plan: true, role: true },
    });
    if (dbUser?.plan) plan = dbUser.plan as Plan;
    if (dbUser?.role) role = dbUser.role as typeof role;
  }

  const entitlements = getEntitlements({
    plan,
    role,
    unlockPro: process.env.COMPLIB_UNLOCK_PRO_SOURCE === "true",
  });

  res.status(200).json(entitlements);
});

export default router;
