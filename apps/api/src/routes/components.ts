import { Router } from "express";
import {
  getComponentBySlug,
  invalidateComponentCache,
  type ComponentTier,
} from "../lib/component-store";
import {
  publishComponentToDisk,
  readComponentBundleFromDisk,
  type ComponentLayer,
  type ComponentVariant,
} from "../lib/component-fs";
import {
  buildExportedBundleFiles,
  ensureGeneratedBundle,
  getGeneratedBundleFiles,
  parseFramework,
  type SourceOverrides,
} from "../lib/framework-output";
import { type VariantQuery } from "../lib/variant-props";
import { assertSafeComponentSlug } from "../lib/path-safe";
import {
  tierRequiresProSourceLock,
  userHasProSourceAccess,
} from "../lib/source-access";
import { safeSlug, validateTaxonomy } from "../lib/taxonomy";
import { requireAdmin } from "../middleware/auth";
import { downloadRateLimit } from "../middleware/security";
import { logAuditEvent } from "../lib/audit-log";
import { syncComponentCatalog, recordComponentDownload } from "../lib/catalog-sync";
import { resolveDbUserId } from "../lib/user-resolve";

const router = Router();

const MAX_SOURCE_BYTES = 512 * 1024;

type CreateComponentPayload = {
  name?: string;
  slug?: string;
  description?: string;
  html?: string;
  css?: string;
  js?: string;
  tier?: ComponentTier;
  layer?: string;
  category?: string;
  problemTags?: string[];
  tags?: string[];
  themes?: string[];
  variants?: Array<{ id?: string; label?: string; props?: Record<string, string> }>;
  styleFamilies?: string[];
  activeStyleId?: string;
};

function titleCase(input: string): string {
  return input
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function buildStyleVariantIds(
  styleFamilies: string[] | undefined,
  activeStyleId?: string,
): string[] {
  const ids = new Set<string>();
  ids.add("default");
  for (const family of styleFamilies ?? []) {
    const normalized = family.trim().toLowerCase();
    if (normalized && normalized !== "standard") ids.add(normalized);
  }
  if (activeStyleId?.trim()) ids.add(activeStyleId.trim().toLowerCase());
  return [...ids];
}

function normalizeVariants(
  variants: CreateComponentPayload["variants"],
): ComponentVariant[] {
  if (!Array.isArray(variants)) return [];
  return variants
    .filter((v) => v && typeof v.id === "string" && typeof v.label === "string")
    .map((v) => ({
      id: String(v.id),
      label: String(v.label),
      props:
        v.props && typeof v.props === "object"
          ? Object.fromEntries(
              Object.entries(v.props).map(([k, val]) => [String(k), String(val)]),
            )
          : undefined,
    }));
}

function sourcePayloadTooLarge(html: string, css: string, js: string): boolean {
  const total = Buffer.byteLength(html, "utf8") + Buffer.byteLength(css, "utf8") + Buffer.byteLength(js, "utf8");
  return total > MAX_SOURCE_BYTES;
}

router.post("/", requireAdmin, async (req, res) => {
  const body = req.body as CreateComponentPayload;
  if (!body || typeof body !== "object") {
    res.status(400).json({ error: "Invalid JSON body." });
    return;
  }

  const name = String(body.name ?? "").trim();
  const slug = safeSlug(body.slug || name);
  const taxonomy = validateTaxonomy({
    layer: body.layer,
    category: body.category,
    problemTags: body.problemTags,
  });
  const tier =
    body.tier === "PRO" || body.tier === "ENTERPRISE" ? body.tier : "FREE";

  if (!name || !slug) {
    res.status(400).json({ error: "Missing required fields: name and slug." });
    return;
  }
  if (!assertSafeComponentSlug(slug)) {
    res.status(400).json({ error: "Invalid slug format." });
    return;
  }
  if (!taxonomy.ok) {
    res.status(400).json({ error: taxonomy.error });
    return;
  }

  const html = String(body.html ?? "");
  const css = String(body.css ?? "");
  const js = String(body.js ?? "");
  if (sourcePayloadTooLarge(html, css, js)) {
    res.status(413).json({ error: "Component source exceeds size limit." });
    return;
  }

  const description = String(body.description ?? `${name} component`).trim();
  const tags =
    Array.isArray(body.tags) && body.tags.length > 0
      ? body.tags.map((t) => String(t)).filter(Boolean)
      : [taxonomy.category];

  const themes: Array<"light" | "dark" | "auto"> = Array.isArray(body.themes)
    ? body.themes.filter(
        (t): t is "light" | "dark" | "auto" =>
          t === "light" || t === "dark" || t === "auto",
      )
    : ["light", "dark", "auto"];

  const variants = normalizeVariants(body.variants);

  const component: import("../lib/component-fs").ComponentJsonShape = {
    id: slug,
    name,
    slug,
    description,
    tags,
    tier,
    layer: taxonomy.layer,
    category: taxonomy.category,
    problemTags: taxonomy.problemTags,
    viewCount: 0,
    themes,
    styleVariants: { vanilla: true, tailwind: false },
  };

  const styleIds = buildStyleVariantIds(body.styleFamilies, body.activeStyleId);
  const primaryStyleId = body.activeStyleId?.trim().toLowerCase() || styleIds[0] || "default";

  try {
    await publishComponentToDisk({
      slug,
      layer: taxonomy.layer as ComponentLayer,
      category: taxonomy.category,
      component,
      dimensions: variants,
      styleVariants: styleIds.map((id) => ({
        id,
        label: titleCase(id),
        html: id === primaryStyleId ? html : "",
        css: id === primaryStyleId ? css : "",
        js: id === primaryStyleId ? js : "",
      })),
    });
    await ensureGeneratedBundle(slug);
    invalidateComponentCache();
    try {
      await syncComponentCatalog(slug);
    } catch {
      // Catalog sync is best-effort when DB is unavailable.
    }

    await logAuditEvent({
      userId: req.userId,
      action: "component.create",
      resource: slug,
      ip: req.ip,
      metadata: { tier, layer: taxonomy.layer, category: taxonomy.category },
    });
  } catch {
    res.status(500).json({ error: "Failed to save component files to disk." });
    return;
  }

  res.status(201).json({ ok: true, slug });
});

router.get("/:slug/edit", requireAdmin, async (req, res) => {
  const slugParam = req.params.slug;
  const decoded = assertSafeComponentSlug(
    Array.isArray(slugParam) ? slugParam[0] : slugParam,
  );
  if (!decoded) {
    res.status(400).json({ error: "Invalid slug." });
    return;
  }

  const styleParam =
    typeof req.query.style === "string" ? req.query.style : undefined;

  const bundle = await readComponentBundleFromDisk(
    decoded,
    styleParam ? { styleId: styleParam } : undefined,
  );
  if (!bundle) {
    res.status(404).json({ error: "Component not found." });
    return;
  }

  res.status(200).json({
    slug: decoded,
    component: {
      ...bundle.json,
      variants: bundle.dimensions,
    },
    html: bundle.html,
    css: bundle.css,
    js: bundle.js,
    styleFamilies: bundle.styleVariants.map((variant) => variant.id),
    activeStyleId: bundle.styleId,
  });
});

router.put("/:slug", requireAdmin, async (req, res) => {
  const slugParam = req.params.slug;
  const decoded = assertSafeComponentSlug(
    Array.isArray(slugParam) ? slugParam[0] : slugParam,
  );
  if (!decoded) {
    res.status(400).json({ error: "Invalid slug." });
    return;
  }

  const existing = await readComponentBundleFromDisk(decoded);
  if (!existing) {
    res.status(404).json({ error: "Component not found." });
    return;
  }

  const body = req.body as CreateComponentPayload;
  if (!body || typeof body !== "object") {
    res.status(400).json({ error: "Invalid JSON body." });
    return;
  }

  const name = String(body.name ?? "").trim();
  const taxonomy = validateTaxonomy({
    layer: body.layer,
    category: body.category,
    problemTags: body.problemTags,
  });
  const tier =
    body.tier === "PRO" || body.tier === "ENTERPRISE" ? body.tier : "FREE";

  if (!name) {
    res.status(400).json({ error: "Missing required field: name." });
    return;
  }
  if (!taxonomy.ok) {
    res.status(400).json({ error: taxonomy.error });
    return;
  }

  const html = String(body.html ?? "");
  const css = String(body.css ?? "");
  const js = String(body.js ?? "");
  if (sourcePayloadTooLarge(html, css, js)) {
    res.status(413).json({ error: "Component source exceeds size limit." });
    return;
  }

  const description = String(body.description ?? `${name} component`).trim();
  const tags =
    Array.isArray(body.tags) && body.tags.length > 0
      ? body.tags.map((t) => String(t)).filter(Boolean)
      : [taxonomy.category];

  const themes: Array<"light" | "dark" | "auto"> = Array.isArray(body.themes)
    ? body.themes.filter(
        (t): t is "light" | "dark" | "auto" =>
          t === "light" || t === "dark" || t === "auto",
      )
    : existing.json.themes ?? ["light", "dark", "auto"];

  const variants = normalizeVariants(body.variants);

  const component: import("../lib/component-fs").ComponentJsonShape = {
    id: decoded,
    name,
    slug: decoded,
    description,
    tags,
    tier,
    layer: taxonomy.layer,
    category: taxonomy.category,
    problemTags: taxonomy.problemTags,
    viewCount:
      typeof existing.json.viewCount === "number" ? existing.json.viewCount : 0,
    themes,
    styleVariants: existing.json.styleVariants ?? { vanilla: true, tailwind: false },
    defaultStyleId: body.activeStyleId?.trim().toLowerCase() || existing.json.defaultStyleId,
  };

  const styleIds = new Set([
    ...buildStyleVariantIds(body.styleFamilies, body.activeStyleId),
    ...existing.styleVariants.map((variant) => variant.id),
  ]);
  const primaryStyleId =
    body.activeStyleId?.trim().toLowerCase() || existing.styleId || "default";

  try {
    await publishComponentToDisk({
      slug: decoded,
      layer: taxonomy.layer as ComponentLayer,
      category: taxonomy.category,
      component,
      dimensions: variants,
      existingDir: existing.dir,
      styleVariants: [...styleIds].map((id) => ({
        id,
        label: titleCase(id),
        html: id === primaryStyleId ? html : "",
        css: id === primaryStyleId ? css : "",
        js: id === primaryStyleId ? js : "",
      })),
    });
    await ensureGeneratedBundle(decoded);
    invalidateComponentCache();
    try {
      await syncComponentCatalog(decoded);
    } catch {
      // Catalog sync is best-effort when DB is unavailable.
    }

    await logAuditEvent({
      userId: req.userId,
      action: "component.update",
      resource: decoded,
      ip: req.ip,
      metadata: { tier, layer: taxonomy.layer, category: taxonomy.category },
    });
  } catch {
    res.status(500).json({ error: "Failed to update component files on disk." });
    return;
  }

  res.status(200).json({ ok: true, slug: decoded });
});

const VARIANT_KEYS = ["size", "tone", "density", "radius", "emphasis"] as const;

function parseVariantQueryFromRecord(
  source: Record<string, unknown>,
): VariantQuery {
  const out: VariantQuery = {};
  if (typeof source.variant === "string") out.variant = source.variant;
  for (const key of VARIANT_KEYS) {
    const value = source[key];
    if (typeof value === "string") out[key] = value;
  }
  return out;
}

function parseVariantQuery(req: { query: Record<string, unknown> }): VariantQuery {
  return parseVariantQueryFromRecord(req.query);
}

type DownloadRequestBody = {
  framework?: string;
  variant?: string;
  size?: string;
  tone?: string;
  density?: string;
  radius?: string;
  emphasis?: string;
  overrides?: {
    html?: string;
    css?: string;
    js?: string;
  };
};

function parseSourceOverrides(
  body: DownloadRequestBody,
  framework: ReturnType<typeof parseFramework>,
): SourceOverrides | undefined | "too_large" {
  if (framework !== "vanilla" || !body.overrides || typeof body.overrides !== "object") {
    return undefined;
  }
  const { html, css, js } = body.overrides;
  if (typeof html !== "string" || typeof css !== "string" || typeof js !== "string") {
    return undefined;
  }
  if (sourcePayloadTooLarge(html, css, js)) {
    return "too_large";
  }
  return { html, css, js };
}

async function sendComponentZip(
  res: import("express").Response,
  slug: string,
  name: string,
  layer: string,
  category: string,
  framework: ReturnType<typeof parseFramework>,
  variantQuery: VariantQuery,
  sourceOverrides?: SourceOverrides,
) {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  const safe = slug.replace(/[^a-z0-9-_]/gi, "_") || "component";

  if (framework === "vanilla") {
    const exported = await buildExportedBundleFiles(
      slug,
      "vanilla",
      variantQuery,
      sourceOverrides,
    );
    if (!exported) {
      res.status(500).json({ error: "Failed to compile export." });
      return;
    }
    zip.file(`${safe}.html`, exported[`${safe}.html`] ?? exported["vanilla.html"] ?? "");
    zip.file(`${safe}.css`, exported[`${safe}.css`] ?? exported["vanilla.css"] ?? "");
    zip.file(`${safe}.runtime.js`, exported[`${safe}.runtime.js`] ?? exported["runtime.js"] ?? "");
  } else {
    const files = await buildExportedBundleFiles(slug, framework, variantQuery);
    if (!files) {
      res.status(500).json({
        error: `No generated ${framework} files for this component.`,
      });
      return;
    }
    for (const [filePath, content] of Object.entries(files)) {
      zip.file(filePath, content);
    }
  }

  const editedNote = sourceOverrides ? "\nIncludes preview edits from the library card.\n" : "";
  zip.file(
    "README.txt",
    `${name}\nCompLib · ${layer} / ${category}\nFramework: ${framework}${editedNote}\n\nOpen README.md inside the zip for Next.js, Vite, and Vue integration steps.\n`,
  );

  const buf = await zip.generateAsync({ type: "uint8array" });
  res
    .status(200)
    .set({
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${safe}-complib.zip"`,
      "Cache-Control": "no-store",
    })
    .send(Buffer.from(buf));
}

async function handleComponentDownload(
  req: import("express").Request,
  res: import("express").Response,
  decoded: string,
  variantQuery: VariantQuery,
  sourceOverrides?: SourceOverrides,
) {
  const c = await getComponentBySlug(decoded);
  if (!c) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const canAccess = await userHasProSourceAccess(req);
  if (tierRequiresProSourceLock(c.tier) && !canAccess) {
    res.status(403).json({
      error: "Pro subscription required to download source.",
    });
    return;
  }

  const framework = parseFramework(
    typeof req.query.framework === "string" ? req.query.framework : undefined,
  );
  const bodyFramework =
    req.method === "POST" && req.body && typeof req.body === "object"
      ? parseFramework((req.body as DownloadRequestBody).framework)
      : framework;

  try {
    const dbUserId = await resolveDbUserId(req.userId);
    await recordComponentDownload({
      slug: c.slug,
      styleId: variantQuery.style,
      framework: bodyFramework,
      userId: dbUserId ?? undefined,
      ip: req.ip,
    });
  } catch {
    // Analytics must not block downloads.
  }

  await sendComponentZip(
    res,
    c.slug,
    c.name,
    c.layer,
    c.category,
    bodyFramework,
    variantQuery,
    sourceOverrides,
  );
}

router.get("/:slug/source", downloadRateLimit, async (req, res) => {
  const slugParam = req.params.slug;
  const decoded = assertSafeComponentSlug(
    Array.isArray(slugParam) ? slugParam[0] : slugParam,
  );
  if (!decoded) {
    res.status(400).json({ error: "Invalid slug." });
    return;
  }

  const framework = parseFramework(
    typeof req.query.framework === "string" ? req.query.framework : undefined,
  );
  const component = await getComponentBySlug(decoded);
  if (!component) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const canAccess = await userHasProSourceAccess(req);
  if (tierRequiresProSourceLock(component.tier) && !canAccess) {
    res.status(403).json({
      error: "Pro subscription required to access source.",
    });
    return;
  }

  if (framework === "vanilla") {
    res.status(200).json({
      framework,
      files: {
        "vanilla.html": component.html,
        "vanilla.css": component.css,
        "runtime.js": component.runtime || component.js,
      },
    });
    return;
  }

  await ensureGeneratedBundle(decoded);
  const generated = await getGeneratedBundleFiles(decoded, framework);
  if (!generated) {
    res.status(500).json({
      error: `No generated ${framework} source available.`,
    });
    return;
  }

  const files: Record<string, string> = {};
  for (const [filePath, contents] of Object.entries(generated)) {
    files[filePath] = contents;
  }

  res.status(200).json({ framework, files });
});

router.get("/:slug/download", downloadRateLimit, async (req, res) => {
  const slugParam = req.params.slug;
  const decoded = assertSafeComponentSlug(
    Array.isArray(slugParam) ? slugParam[0] : slugParam,
  );
  if (!decoded) {
    res.status(400).json({ error: "Invalid slug." });
    return;
  }

  const variantQuery = parseVariantQuery(req);
  await handleComponentDownload(req, res, decoded, variantQuery);
});

router.post("/:slug/download", downloadRateLimit, async (req, res) => {
  const slugParam = req.params.slug;
  const decoded = assertSafeComponentSlug(
    Array.isArray(slugParam) ? slugParam[0] : slugParam,
  );
  if (!decoded) {
    res.status(400).json({ error: "Invalid slug." });
    return;
  }

  const body = (req.body ?? {}) as DownloadRequestBody;
  const framework = parseFramework(body.framework);
  const variantQuery = parseVariantQueryFromRecord(body as unknown as Record<string, unknown>);
  const sourceOverrides = parseSourceOverrides(body, framework);
  if (sourceOverrides === "too_large") {
    res.status(413).json({ error: "Component source exceeds size limit." });
    return;
  }

  await handleComponentDownload(req, res, decoded, variantQuery, sourceOverrides);
});

export default router;
