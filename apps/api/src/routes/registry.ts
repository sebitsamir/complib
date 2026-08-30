import { Router } from "express";
import { assertSafeComponentSlug } from "../lib/path-safe";
import { getRegistryBySlug, listRegistryRevisions } from "../lib/component-registry";

const router = Router();

router.get("/:slug/revisions", async (req, res) => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  if (!slug?.trim()) {
    res.status(400).json({ error: "Invalid slug." });
    return;
  }

  try {
    assertSafeComponentSlug(slug.trim());
  } catch {
    res.status(400).json({ error: "Invalid slug." });
    return;
  }

  try {
    const revisions = await listRegistryRevisions(slug.trim());
    if (!revisions) {
      res.status(404).json({ error: "Component not found in registry." });
      return;
    }
    res.status(200).json({ slug: slug.trim(), revisions });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Revision lookup failed.";
    res.status(503).json({ error: message });
  }
});

router.get("/:slug", async (req, res) => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  if (!slug?.trim()) {
    res.status(400).json({ error: "Invalid slug." });
    return;
  }

  try {
    assertSafeComponentSlug(slug.trim());
  } catch {
    res.status(400).json({ error: "Invalid slug." });
    return;
  }

  try {
    const record = await getRegistryBySlug(slug.trim());
    if (!record) {
      res.status(404).json({ error: "Component not found in registry." });
      return;
    }
    res.status(200).json(record);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Registry lookup failed.";
    res.status(503).json({ error: message });
  }
});

export default router;
