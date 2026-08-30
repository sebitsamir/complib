import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getEntitlements, roleFromClerkMetadata } from "@complib/entitlements";
import type { Plan } from "@complib/contracts";
import prisma from "../prisma";

const router = Router();

router.post("/compose", requireAuth, async (req, res) => {
  const prompt = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";
  if (!prompt) {
    res.status(400).json({ error: "Prompt is required." });
    return;
  }

  const dbUser = await prisma.user.findFirst({
    where: { clerkId: req.userId },
    select: { plan: true, role: true },
  });
  const plan = (dbUser?.plan ?? req.userPlan ?? "FREE") as Plan;
  const role = dbUser?.role ?? roleFromClerkMetadata(undefined);
  const entitlements = getEntitlements({ plan, role });

  if (!entitlements.canUseAI) {
    res.status(403).json({
      error: "AI composition requires Enterprise access.",
      code: "AI_NOT_ENTITLED",
    });
    return;
  }

  res.status(501).json({
    error: "AI composition is not enabled yet.",
    code: "AI_NOT_CONFIGURED",
    message:
      "Phase 20 foundation is in place. Wire an LLM provider to generate playground documents from prompts.",
    prompt,
  });
});

export default router;
