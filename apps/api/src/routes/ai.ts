import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getEntitlements, roleFromClerkMetadata } from "@complib/entitlements";
import type { Plan } from "@complib/contracts";
import prisma from "../prisma";
import { listRegistrySummaries } from "../lib/component-registry";
import { writeRateLimit } from "../middleware/security";

const router = Router();

const INTENT_KEYWORDS: Record<string, string[]> = {
  dashboard: ["build-dashboard", "dashboard", "table", "chart", "metric", "stat"],
  landing: ["build-landing-page", "landing", "hero", "marketing", "saas"],
  form: ["build-form", "form", "input", "signup", "login"],
  navigation: ["build-navigation", "nav", "menu", "sidebar", "header"],
  auth: ["build-authentication", "auth", "sign-in", "sign-up", "login"],
  ecommerce: ["commerce", "product", "cart", "pricing", "checkout"],
};

function scoreComponent(prompt: string, item: { slug: string; name: string; problemTags: string[]; layer: string }) {
  const haystack = `${item.slug} ${item.name} ${item.problemTags.join(" ")} ${item.layer}`.toLowerCase();
  let score = 0;
  const words = prompt.toLowerCase().split(/\W+/).filter((w) => w.length > 2);
  for (const word of words) {
    if (haystack.includes(word)) score += 2;
  }
  for (const [, keywords] of Object.entries(INTENT_KEYWORDS)) {
    if (keywords.some((kw) => prompt.toLowerCase().includes(kw) && haystack.includes(kw))) {
      score += 5;
    }
  }
  return score;
}

router.post("/compose", requireAuth, writeRateLimit, async (req, res) => {
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

  const catalog = await listRegistrySummaries();
  const ranked = catalog
    .map((item) => ({ item, score: scoreComponent(prompt, item) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  if (ranked.length === 0) {
    res.status(200).json({
      ok: true,
      source: "registry",
      message: "No strong matches found. Try describing a dashboard, landing page, or form.",
      instances: [],
      suggestions: catalog.slice(0, 5).map((item) => ({
        slug: item.slug,
        name: item.name,
        layer: item.layer,
      })),
    });
    return;
  }

  const instances = ranked.map((entry, index) => ({
    id: `ai-${entry.item.slug}-${index}`,
    slug: entry.item.slug,
    x: 24,
    y: 24 + index * 280,
    width: 720,
    height: 240,
    zIndex: index + 1,
    heightAuto: true,
  }));

  res.status(200).json({
    ok: true,
    source: "registry",
    prompt,
    instances,
    matched: ranked.map((entry) => ({
      slug: entry.item.slug,
      name: entry.item.name,
      layer: entry.item.layer,
      score: entry.score,
    })),
  });
});

export default router;
