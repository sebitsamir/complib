import { Router } from "express";
import { getComponents } from "../lib/component-store";
import { buildPlaygroundPreviewHtml } from "../lib/playground-preview-html";
import { mergePlaygroundVanillaPageSource, pageSourceToVanillaFiles } from "../lib/playground-page-artifact";
import {
  getResolvedTiers,
  mergePlaygroundToFiles,
  type PlaygroundInstance,
} from "../lib/playground-merge";
import { parsePlaygroundInstancesBody } from "../lib/playground-request";
import { buildPlaygroundScaffoldFiles } from "../lib/export-scaffold/playground-scaffold";
import { validateScaffoldFiles } from "../lib/export-pipeline";
import {
  tierRequiresProSourceLock,
  userHasProSourceAccess,
} from "../lib/source-access";
import { entitlementsForRequest } from "../lib/request-entitlements";
import { downloadRateLimit, writeRateLimit } from "../middleware/security";

async function assertPlaygroundSourceAccess(
  req: Parameters<typeof userHasProSourceAccess>[0],
  instances: PlaygroundInstance[],
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const tiers = await getResolvedTiers(instances);
  const includesLocked = tiers.some((tier) => tierRequiresProSourceLock(tier));
  if (!includesLocked) return { ok: true };
  const canAccess = await userHasProSourceAccess(req);
  if (canAccess) return { ok: true };
  return {
    ok: false,
    status: 403,
    error: "Pro subscription required to preview paid component source.",
  };
}

const router = Router();

router.get("/catalog", async (_req, res) => {
  const components = await getComponents();
  const catalog = components.map((c) => ({
    slug: c.slug,
    name: c.name,
    tier: c.tier,
    layer: c.layer,
    category: c.category,
    problemTags: c.problemTags,
    variants: (c.variants ?? []).map((v) => ({
      id: v.id,
      label: v.label,
      props: v.props,
    })),
  }));
  res.status(200).json({ catalog });
});

router.post("/preview", writeRateLimit, async (req, res) => {
  const data = req.body;
  if (data === undefined) {
    res.status(400).json({ error: "Invalid JSON body" });
    return;
  }

  const parsed = parsePlaygroundInstancesBody(data);
  if (!parsed.ok) {
    res.status(parsed.status).json({ error: parsed.error });
    return;
  }

  const access = await assertPlaygroundSourceAccess(req, parsed.instances);
  if (!access.ok) {
    res.status(access.status).json({ error: access.error });
    return;
  }

  try {
    const html = await buildPlaygroundPreviewHtml(parsed.instances);
    res
      .status(200)
      .set("Cache-Control", "no-store")
      .json({ html });
  } catch {
    res.status(500).json({ error: "Preview generation failed" });
  }
});

router.post("/page-source", writeRateLimit, async (req, res) => {
  const data = req.body;
  if (data === undefined) {
    res.status(400).json({ error: "Invalid JSON body" });
    return;
  }

  const parsed = parsePlaygroundInstancesBody(data);
  if (!parsed.ok) {
    res.status(parsed.status).json({ error: parsed.error });
    return;
  }

  const access = await assertPlaygroundSourceAccess(req, parsed.instances);
  if (!access.ok) {
    res.status(access.status).json({ error: access.error });
    return;
  }

  try {
    const source = await mergePlaygroundVanillaPageSource(parsed.instances);
    res.status(200).set("Cache-Control", "no-store").json(source);
  } catch {
    res.status(500).json({ error: "Page source generation failed" });
  }
});

router.post("/download", downloadRateLimit, async (req, res) => {
  const data = req.body;
  if (data === undefined) {
    res.status(400).json({ error: "Invalid JSON body" });
    return;
  }

  const parsed = parsePlaygroundInstancesBody(data);
  if (!parsed.ok) {
    res.status(parsed.status).json({ error: parsed.error });
    return;
  }

  const tiers = await getResolvedTiers(parsed.instances);
  const includesLocked = tiers.some((tier) => tierRequiresProSourceLock(tier));
  if (includesLocked) {
    const canAccess = await userHasProSourceAccess(req);
    if (!canAccess) {
      res.status(403).json({
        error: "Pro subscription required to download this playground.",
      });
      return;
    }
  }

  if (parsed.exportKind === "scaffold") {
    const entitlements = entitlementsForRequest(req);
    if (!entitlements.canUseScaffoldExport) {
      res.status(403).json({
        error: "Scaffold exports require a Pro or Enterprise plan.",
      });
      return;
    }
  }

  try {
    const pageSourceHasBody = Boolean(parsed.pageSource?.html.trim());
    const files =
      parsed.framework === "vanilla" &&
      parsed.exportKind === "library" &&
      parsed.pageSource &&
      pageSourceHasBody
        ? pageSourceToVanillaFiles(parsed.pageSource)
        : parsed.exportKind === "scaffold" && parsed.stack
          ? await buildPlaygroundScaffoldFiles(
              parsed.instances,
              parsed.framework,
              parsed.stack,
            )
          : await mergePlaygroundToFiles(parsed.instances, parsed.framework);

    const exportFiles = Object.entries(files).map(([filePath, contents]) => ({
      path: filePath,
      contents,
    }));
    const validated = validateScaffoldFiles(parsed.framework, exportFiles);
    if (!validated.ok) {
      res.status(422).json({
        error: "Export validation failed.",
        issues: validated.issues,
      });
      return;
    }

    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    for (const file of validated.files) {
      zip.file(file.path, file.contents);
    }
    const buf = await zip.generateAsync({ type: "uint8array" });
    const filename = `complib-playground-${
      parsed.exportKind === "scaffold" && parsed.stack
        ? parsed.stack
        : parsed.framework
    }.zip`;

    res
      .status(200)
      .set({
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      })
      .send(Buffer.from(buf));
  } catch {
    res.status(500).json({ error: "Download generation failed" });
  }
});

export default router;
