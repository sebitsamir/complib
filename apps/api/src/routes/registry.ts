import { Router } from "express";
import { assertSafeComponentSlug } from "../lib/path-safe";
import {
  getRegistryBySlug,
  listRegistryRevisions,
  listRegistrySummaries,
} from "../lib/component-registry";
import { userHasProSourceAccess } from "../lib/source-access";

const router = Router();

function decodeSlug(raw: string | string[] | undefined): string | null {
  const slug = (Array.isArray(raw) ? raw[0] : raw)?.trim();
  if (!slug) return null;
  return assertSafeComponentSlug(slug);
}

router.get("/", async (req, res) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q : undefined;
    const tier = typeof req.query.tier === "string" ? req.query.tier : undefined;
    const layer = typeof req.query.layer === "string" ? req.query.layer : undefined;
    const category = typeof req.query.category === "string" ? req.query.category : undefined;
    const problem = typeof req.query.problem === "string" ? req.query.problem : undefined;

    const items = await listRegistrySummaries({ search: q, tier, layer, category, problem });
    res.status(200).json({ items, total: items.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Registry listing failed.";
    res.status(503).json({ error: message });
  }
});

router.get("/:slug/revisions", async (req, res) => {
  const slug = decodeSlug(req.params.slug);
  if (!slug) {
    res.status(400).json({ error: "Invalid slug." });
    return;
  }

  try {
    const revisions = await listRegistryRevisions(slug);
    if (!revisions) {
      res.status(404).json({ error: "Component not found in registry." });
      return;
    }
    res.status(200).json({ slug, revisions });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Revision lookup failed.";
    res.status(503).json({ error: message });
  }
});

router.get("/:slug", async (req, res) => {
  const slug = decodeSlug(req.params.slug);
  if (!slug) {
    res.status(400).json({ error: "Invalid slug." });
    return;
  }

  try {
    const hasSourceAccess = await userHasProSourceAccess(req);
    const record = await getRegistryBySlug(slug, {
      redactSource: !hasSourceAccess,
    });
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
