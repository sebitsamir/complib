import { Router } from "express";
import { attachUserIfPresent, requireAuth } from "../middleware/auth";
import { resolveDbUserId } from "../lib/user-resolve";
import prisma from "../prisma";
import { writeRateLimit } from "../middleware/security";
import { validatePublishPayload } from "../lib/publish-pipeline";

const router = Router();

router.post("/submit", attachUserIfPresent, writeRateLimit, async (req, res) => {
  const name = String(req.body?.name ?? "").trim();
  const slug = String(req.body?.slug ?? name)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "");
  const description = String(req.body?.description ?? "").trim();

  if (!name || !slug || !description) {
    res.status(400).json({ error: "name, slug, and description are required." });
    return;
  }

  const validation = validatePublishPayload(req.body ?? {});
  if (!validation.ok) {
    res.status(400).json({
      error: "Component validation failed.",
      validation,
    });
    return;
  }

  let submitterId: string | null = null;
  if (req.userId) {
    submitterId = await resolveDbUserId(req.userId);
  }

  const submission = await prisma.communitySubmission.create({
    data: {
      submitterId,
      name,
      slug,
      description,
      status: "PENDING",
      payload: req.body ?? {},
    },
    select: { id: true, slug: true, status: true, createdAt: true },
  });

  res.status(201).json({
    ok: true,
    submission,
    message: "Submission received. It will be reviewed before publishing to the catalog.",
  });
});

router.get("/submissions", requireAuth, async (req, res) => {
  const userId = await resolveDbUserId(req.userId);
  if (!userId) {
    res.status(404).json({ error: "User profile not found." });
    return;
  }

  const submissions = await prisma.communitySubmission.findMany({
    where: { submitterId: userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json({ submissions });
});

export default router;
