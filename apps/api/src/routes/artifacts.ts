import { Router } from "express";
import { readComponentBundleFromDisk } from "../lib/component-fs";
import {
  checkStorageHealth,
  getComponentArtifactInventory,
} from "../lib/artifact-storage";
import { assertSafeComponentSlug } from "../lib/path-safe";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/health", async (_req, res) => {
  try {
    const health = await checkStorageHealth();
    res.status(health.ok ? 200 : 503).json(health);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Storage health check failed.";
    res.status(503).json({ ok: false, error: message });
  }
});

router.get("/:slug", requireAdmin, async (req, res) => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  if (!slug?.trim()) {
    res.status(400).json({ error: "Invalid slug." });
    return;
  }

  const decoded = assertSafeComponentSlug(slug.trim());
  if (!decoded) {
    res.status(400).json({ error: "Invalid slug." });
    return;
  }

  try {
    const bundle = await readComponentBundleFromDisk(decoded);
    if (!bundle) {
      res.status(404).json({ error: "Component not found in artifact store." });
      return;
    }

    const inventory = await getComponentArtifactInventory(bundle);
    res.status(200).json(inventory);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Artifact lookup failed.";
    res.status(503).json({ error: message });
  }
});

export default router;
