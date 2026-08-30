import { Router } from "express";
import {
  searchCatalog,
  syncAllComponentsCatalog,
  syncComponentCatalog,
} from "../lib/catalog-sync";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/search", async (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q : undefined;
  const layer = typeof req.query.layer === "string" ? req.query.layer : undefined;
  const category = typeof req.query.category === "string" ? req.query.category : undefined;
  const style = typeof req.query.style === "string" ? req.query.style : undefined;
  const tier = typeof req.query.tier === "string" ? req.query.tier : undefined;
  const problem = typeof req.query.problem === "string" ? req.query.problem : undefined;
  const limit =
    typeof req.query.limit === "string" && Number.isFinite(Number(req.query.limit))
      ? Number(req.query.limit)
      : undefined;

  try {
    const results = await searchCatalog({ q, layer, category, style, tier, problem, limit });
    res.status(200).json({ results, count: results.length });
  } catch {
    res.status(503).json({
      error: "Catalog search unavailable. Ensure PostgreSQL is running and migrations are applied.",
    });
  }
});

router.post("/sync", requireAdmin, async (_req, res) => {
  try {
    const result = await syncAllComponentsCatalog();
    res.status(200).json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Catalog sync failed.";
    res.status(500).json({ error: message });
  }
});

router.post("/sync/:slug", requireAdmin, async (req, res) => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  if (!slug?.trim()) {
    res.status(400).json({ error: "Invalid slug." });
    return;
  }

  try {
    const ok = await syncComponentCatalog(slug.trim());
    if (!ok) {
      res.status(404).json({ error: "Component not found on disk." });
      return;
    }
    res.status(200).json({ ok: true, slug: slug.trim() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Catalog sync failed.";
    res.status(500).json({ error: message });
  }
});

export default router;
