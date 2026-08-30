import { Router } from "express";
import prisma from "../prisma";
import { resolveDbUserId } from "../lib/user-resolve";
import { requireAuth } from "../middleware/auth";
import { entitlementsForRequest } from "../lib/request-entitlements";

const router = Router();
const MAX_RECENT = 12;

type SlugRow = { component: { slug: string } };
type RecentOverflowRow = { id: string };
type CollectionRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  items: Array<{
    position: number;
    component: { slug: string; name: string };
  }>;
};

async function getComponentIdBySlug(slug: string): Promise<string | null> {
  const component = await prisma.catalogComponent.findUnique({
    where: { slug },
    select: { id: true },
  });
  return component?.id ?? null;
}

router.get("/persistence", requireAuth, async (req, res) => {
  const userId = await resolveDbUserId(req.userId);
  if (!userId) {
    res.status(404).json({ error: "User profile not found." });
    return;
  }

  const [favorites, recents] = await Promise.all([
    prisma.userFavorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { component: { select: { slug: true } } },
    }) as Promise<SlugRow[]>,
    prisma.userRecent.findMany({
      where: { userId },
      orderBy: { lastUsedAt: "desc" },
      take: MAX_RECENT,
      include: { component: { select: { slug: true } } },
    }) as Promise<SlugRow[]>,
  ]);

  res.status(200).json({
    favoriteSlugs: favorites.map((row: SlugRow) => row.component.slug),
    recentSlugs: recents.map((row: SlugRow) => row.component.slug),
  });
});

router.post("/favorites/:slug", requireAuth, async (req, res) => {
  const slugParam = req.params.slug;
  const slug = (Array.isArray(slugParam) ? slugParam[0] : slugParam)?.trim();
  if (!slug) {
    res.status(400).json({ error: "Invalid slug." });
    return;
  }

  const userId = await resolveDbUserId(req.userId);
  const componentId = await getComponentIdBySlug(slug);
  if (!userId || !componentId) {
    res.status(404).json({ error: "User or component not found." });
    return;
  }

  await prisma.userFavorite.upsert({
    where: {
      userId_componentId: { userId, componentId },
    },
    create: { userId, componentId },
    update: {},
  });

  res.status(200).json({ ok: true, slug, favorited: true });
});

router.delete("/favorites/:slug", requireAuth, async (req, res) => {
  const slugParam = req.params.slug;
  const slug = (Array.isArray(slugParam) ? slugParam[0] : slugParam)?.trim();
  if (!slug) {
    res.status(400).json({ error: "Invalid slug." });
    return;
  }

  const userId = await resolveDbUserId(req.userId);
  const componentId = await getComponentIdBySlug(slug);
  if (!userId || !componentId) {
    res.status(404).json({ error: "User or component not found." });
    return;
  }

  await prisma.userFavorite.deleteMany({
    where: { userId, componentId },
  });

  res.status(200).json({ ok: true, slug, favorited: false });
});

router.post("/recent/:slug", requireAuth, async (req, res) => {
  const slugParam = req.params.slug;
  const slug = (Array.isArray(slugParam) ? slugParam[0] : slugParam)?.trim();
  if (!slug) {
    res.status(400).json({ error: "Invalid slug." });
    return;
  }

  const userId = await resolveDbUserId(req.userId);
  const componentId = await getComponentIdBySlug(slug);
  if (!userId || !componentId) {
    res.status(404).json({ error: "User or component not found." });
    return;
  }

  await prisma.userRecent.upsert({
    where: {
      userId_componentId: { userId, componentId },
    },
    create: { userId, componentId },
    update: { lastUsedAt: new Date() },
  });

  const overflow = (await prisma.userRecent.findMany({
    where: { userId },
    orderBy: { lastUsedAt: "desc" },
    skip: MAX_RECENT,
    select: { id: true },
  })) as RecentOverflowRow[];
  if (overflow.length > 0) {
    await prisma.userRecent.deleteMany({
      where: { id: { in: overflow.map((row: RecentOverflowRow) => row.id) } },
    });
  }

  res.status(200).json({ ok: true, slug });
});

router.get("/collections", requireAuth, async (req, res) => {
  const userId = await resolveDbUserId(req.userId);
  if (!userId) {
    res.status(404).json({ error: "User profile not found." });
    return;
  }

  const collections = (await prisma.userCollection.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      items: {
        orderBy: { position: "asc" },
        include: { component: { select: { slug: true, name: true } } },
      },
    },
  })) as CollectionRow[];

  res.status(200).json({
    collections: collections.map((collection: CollectionRow) => ({
      id: collection.id,
      name: collection.name,
      slug: collection.slug,
      description: collection.description,
      items: collection.items.map((item: CollectionRow["items"][number]) => ({
        slug: item.component.slug,
        name: item.component.name,
        position: item.position,
      })),
    })),
  });
});

router.post("/collections", requireAuth, async (req, res) => {
  const userId = await resolveDbUserId(req.userId);
  if (!userId) {
    res.status(404).json({ error: "User profile not found." });
    return;
  }

  const entitlements = entitlementsForRequest(req);
  if (!entitlements.canCreateCollections) {
    res.status(403).json({ error: "Collections require a Pro or Enterprise plan." });
    return;
  }

  const body = req.body as { name?: string; slug?: string; description?: string };
  const name = String(body?.name ?? "").trim();
  const slug = String(body?.slug ?? name)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "");
  if (!name || !slug) {
    res.status(400).json({ error: "Collection name is required." });
    return;
  }

  const collection = await prisma.userCollection.create({
    data: {
      userId,
      name,
      slug,
      description: body?.description ? String(body.description) : null,
    },
  });

  res.status(201).json({ ok: true, collection });
});

router.post("/collections/:slug/items", requireAuth, async (req, res) => {
  const userId = await resolveDbUserId(req.userId);
  if (!userId) {
    res.status(404).json({ error: "User profile not found." });
    return;
  }

  const entitlements = entitlementsForRequest(req);
  if (!entitlements.canCreateCollections) {
    res.status(403).json({ error: "Collections require a Pro or Enterprise plan." });
    return;
  }

  const collectionSlug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const componentSlug = String((req.body as { componentSlug?: string })?.componentSlug ?? "").trim();
  if (!collectionSlug || !componentSlug) {
    res.status(400).json({ error: "Collection slug and componentSlug are required." });
    return;
  }

  const collection = await prisma.userCollection.findFirst({
    where: { userId, slug: collectionSlug },
    select: { id: true },
  });
  const componentId = await getComponentIdBySlug(componentSlug);
  if (!collection || !componentId) {
    res.status(404).json({ error: "Collection or component not found." });
    return;
  }

  const last = await prisma.collectionItem.findFirst({
    where: { collectionId: collection.id },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  await prisma.collectionItem.upsert({
    where: {
      collectionId_componentId: {
        collectionId: collection.id,
        componentId,
      },
    },
    create: {
      collectionId: collection.id,
      componentId,
      position: (last?.position ?? -1) + 1,
    },
    update: {},
  });

  res.status(200).json({ ok: true, collectionSlug, componentSlug });
});

router.delete("/collections/:slug", requireAuth, async (req, res) => {
  const userId = await resolveDbUserId(req.userId);
  const collectionSlug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  if (!userId || !collectionSlug) {
    res.status(400).json({ error: "Invalid request." });
    return;
  }

  await prisma.userCollection.deleteMany({
    where: { userId, slug: collectionSlug },
  });

  res.status(200).json({ ok: true, slug: collectionSlug });
});

router.delete("/collections/:slug/items/:componentSlug", requireAuth, async (req, res) => {
  const userId = await resolveDbUserId(req.userId);
  const collectionSlug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const componentSlug = Array.isArray(req.params.componentSlug)
    ? req.params.componentSlug[0]
    : req.params.componentSlug;
  if (!userId || !collectionSlug || !componentSlug) {
    res.status(400).json({ error: "Invalid request." });
    return;
  }

  const collection = await prisma.userCollection.findFirst({
    where: { userId, slug: collectionSlug },
    select: { id: true },
  });
  const componentId = await getComponentIdBySlug(componentSlug);
  if (!collection || !componentId) {
    res.status(404).json({ error: "Collection or component not found." });
    return;
  }

  await prisma.collectionItem.deleteMany({
    where: { collectionId: collection.id, componentId },
  });

  res.status(200).json({ ok: true, collectionSlug, componentSlug });
});

export default router;
