import { Router } from "express";
import prisma from "../prisma";
import { resolveDbUserId } from "../lib/user-resolve";
import { requireAuth } from "../middleware/auth";
import { writeRateLimit } from "../middleware/security";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const userId = await resolveDbUserId(req.userId);
  if (!userId) {
    res.status(404).json({ error: "User profile not found." });
    return;
  }

  const memberships = await prisma.teamMember.findMany({
    where: { userId },
    include: {
      team: {
        select: {
          id: true,
          name: true,
          slug: true,
          ownerId: true,
          createdAt: true,
        },
      },
    },
  });

  const owned = await prisma.team.findMany({
    where: { ownerId: userId },
    select: { id: true, name: true, slug: true, ownerId: true, createdAt: true },
  });

  res.status(200).json({
    owned,
    memberships: memberships.map((row: (typeof memberships)[number]) => ({
      role: row.role,
      team: row.team,
    })),
  });
});

router.post("/", requireAuth, writeRateLimit, async (req, res) => {
  const userId = await resolveDbUserId(req.userId);
  if (!userId) {
    res.status(404).json({ error: "User profile not found." });
    return;
  }

  const name = String(req.body?.name ?? "").trim();
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "");
  if (!name || !slug) {
    res.status(400).json({ error: "Team name is required." });
    return;
  }

  const existing = await prisma.team.findUnique({ where: { slug } });
  if (existing) {
    res.status(409).json({ error: "Team slug already taken." });
    return;
  }

  const team = await prisma.team.create({
    data: {
      name,
      slug,
      ownerId: userId,
      members: {
        create: { userId, role: "OWNER" },
      },
    },
    select: { id: true, name: true, slug: true, createdAt: true },
  });

  res.status(201).json({ ok: true, team });
});

export default router;
