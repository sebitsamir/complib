import { Router } from "express";
import { playgroundDocumentSchema } from "@complib/component-schema";
import prisma from "../prisma";
import { resolveDbUserId } from "../lib/user-resolve";
import { requireAuth } from "../middleware/auth";
import { entitlementsForRequest } from "../lib/request-entitlements";
import { writeRateLimit } from "../middleware/security";

const router = Router();

function slugifyName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 64);
}

router.get("/", requireAuth, async (req, res) => {
  const userId = await resolveDbUserId(req.userId);
  if (!userId) {
    res.status(404).json({ error: "User profile not found." });
    return;
  }

  const projects = await prisma.playgroundProject.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json({ projects });
});

router.get("/:slug", requireAuth, async (req, res) => {
  const userId = await resolveDbUserId(req.userId);
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  if (!userId || !slug) {
    res.status(400).json({ error: "Invalid request." });
    return;
  }

  const project = await prisma.playgroundProject.findUnique({
    where: { userId_slug: { userId, slug } },
  });
  if (!project) {
    res.status(404).json({ error: "Project not found." });
    return;
  }

  res.status(200).json({
    id: project.id,
    name: project.name,
    slug: project.slug,
    document: project.document,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  });
});

router.put("/:slug", requireAuth, writeRateLimit, async (req, res) => {
  const entitlements = entitlementsForRequest(req);
  if (!entitlements.canSavePlaygrounds) {
    res.status(403).json({ error: "Saving playgrounds requires a Pro or Enterprise plan." });
    return;
  }

  const userId = await resolveDbUserId(req.userId);
  const slugParam = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  if (!userId || !slugParam) {
    res.status(400).json({ error: "Invalid request." });
    return;
  }

  const name = String(req.body?.name ?? slugParam).trim();
  const parsed = playgroundDocumentSchema.safeParse(req.body?.document ?? req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Invalid playground document.",
      details: parsed.error.flatten(),
    });
    return;
  }

  const slug = slugifyName(slugParam) || slugifyName(name);
  if (!slug) {
    res.status(400).json({ error: "Project slug is required." });
    return;
  }

  const project = await prisma.playgroundProject.upsert({
    where: { userId_slug: { userId, slug } },
    create: {
      userId,
      name: name || slug,
      slug,
      document: parsed.data,
    },
    update: {
      name: name || slug,
      document: parsed.data,
    },
  });

  res.status(200).json({
    ok: true,
    project: {
      id: project.id,
      name: project.name,
      slug: project.slug,
      updatedAt: project.updatedAt,
    },
  });
});

router.delete("/:slug", requireAuth, async (req, res) => {
  const userId = await resolveDbUserId(req.userId);
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  if (!userId || !slug) {
    res.status(400).json({ error: "Invalid request." });
    return;
  }

  await prisma.playgroundProject.deleteMany({
    where: { userId, slug },
  });

  res.status(200).json({ ok: true, slug });
});

export default router;
