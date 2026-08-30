import {
  invalidateComponentCache,
  type ComponentTier,
} from "./component-store";
import {
  publishComponentToDisk,
  readComponentBundleFromDisk,
  type ComponentLayer,
  type ComponentVariant,
} from "./component-fs";
import { ensureGeneratedBundle } from "./framework-output";
import { syncComponentCatalog } from "./catalog-sync";
import { logAuditEvent } from "./audit-log";
import { safeSlug, validateTaxonomy } from "./taxonomy";
import { assertSafeComponentSlug } from "./path-safe";
import {
  validateComponentForPublish,
  type PublishValidationResult,
} from "@complib/component-validation";
import { componentSpecSchema } from "@complib/component-schema";

const MAX_SOURCE_BYTES = 512 * 1024;

export type PublishComponentPayload = {
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

export type PublishResult =
  | { ok: true; slug: string; validation: PublishValidationResult }
  | { ok: false; status: number; error: string; validation?: PublishValidationResult };

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
  variants: PublishComponentPayload["variants"],
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
  const total =
    Buffer.byteLength(html, "utf8") +
    Buffer.byteLength(css, "utf8") +
    Buffer.byteLength(js, "utf8");
  return total > MAX_SOURCE_BYTES;
}

export function validatePublishPayload(body: PublishComponentPayload): PublishValidationResult {
  const name = String(body.name ?? "").trim();
  const slug = safeSlug(body.slug || name);
  const taxonomy = validateTaxonomy({
    layer: body.layer,
    category: body.category,
    problemTags: body.problemTags,
  });
  const tier = body.tier === "PRO" || body.tier === "ENTERPRISE" ? body.tier : "FREE";
  const layer = taxonomy.ok ? taxonomy.layer : String(body.layer ?? "");
  const category = taxonomy.ok ? taxonomy.category : String(body.category ?? "");
  const problemTags = taxonomy.ok ? taxonomy.problemTags : [];

  const specResult = componentSpecSchema.safeParse({
    id: slug,
    name,
    slug,
    description: String(body.description ?? "").trim(),
    taxonomy: { layer, category, problemTags },
    access: { tier },
    frameworks: ["vanilla", "react", "vue"],
    themes: body.themes ?? ["light", "dark", "auto"],
    variants: normalizeVariants(body.variants),
    tags: body.tags ?? [],
    dependencies: [],
  });

  const pipelineResult = validateComponentForPublish({
    name,
    slug,
    description: String(body.description ?? "").trim(),
    tier,
    layer,
    category,
    problemTags,
    html: String(body.html ?? ""),
    css: String(body.css ?? ""),
    js: String(body.js ?? ""),
    variants: normalizeVariants(body.variants),
    styleFamilies: body.styleFamilies,
    themes: body.themes,
    frameworks: ["vanilla", "react", "vue"],
  });

  if (!specResult.success) {
    const schemaIssues = specResult.error.issues.map((issue) => ({
      code: "SPEC_SCHEMA",
      severity: "error" as const,
      field: issue.path.join("."),
      message: issue.message,
    }));
    return {
      ok: false,
      issues: [...schemaIssues, ...pipelineResult.issues],
      steps: { ...pipelineResult.steps, metadata: "fail" },
    };
  }

  return pipelineResult;
}

export async function publishComponent(input: {
  body: PublishComponentPayload;
  mode: "create" | "update";
  existingSlug?: string;
  userId?: string;
  ip?: string;
}): Promise<PublishResult> {
  const body = input.body;
  const validation = validatePublishPayload(body);
  if (!validation.ok) {
    return {
      ok: false,
      status: 422,
      error: "Component failed publish validation.",
      validation,
    };
  }

  const name = String(body.name ?? "").trim();
  const slug =
    input.mode === "update" && input.existingSlug
      ? input.existingSlug
      : safeSlug(body.slug || name);

  if (!name || !slug || !assertSafeComponentSlug(slug)) {
    return { ok: false, status: 400, error: "Invalid name or slug." };
  }

  const taxonomy = validateTaxonomy({
    layer: body.layer,
    category: body.category,
    problemTags: body.problemTags,
  });
  if (!taxonomy.ok) {
    return { ok: false, status: 400, error: taxonomy.error, validation };
  }

  const tier = body.tier === "PRO" || body.tier === "ENTERPRISE" ? body.tier : "FREE";
  const html = String(body.html ?? "");
  const css = String(body.css ?? "");
  const js = String(body.js ?? "");

  if (sourcePayloadTooLarge(html, css, js)) {
    return { ok: false, status: 413, error: "Component source exceeds size limit." };
  }

  const description = String(body.description ?? `${name} component`).trim();
  const tags =
    Array.isArray(body.tags) && body.tags.length > 0
      ? body.tags.map((t) => String(t)).filter(Boolean)
      : [taxonomy.category];
  const variants = normalizeVariants(body.variants);

  if (input.mode === "create") {
    const existing = await readComponentBundleFromDisk(slug);
    if (existing) {
      return { ok: false, status: 409, error: `Slug "${slug}" already exists.`, validation };
    }
  }

  if (input.mode === "update") {
    const existing = await readComponentBundleFromDisk(slug);
    if (!existing) {
      return { ok: false, status: 404, error: "Component not found." };
    }

    const themes: Array<"light" | "dark" | "auto"> = Array.isArray(body.themes)
      ? body.themes.filter(
          (t): t is "light" | "dark" | "auto" =>
            t === "light" || t === "dark" || t === "auto",
        )
      : existing.json.themes ?? ["light", "dark", "auto"];

    const component: import("./component-fs").ComponentJsonShape = {
      id: slug,
      name,
      slug,
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
      defaultStyleId:
        body.activeStyleId?.trim().toLowerCase() || existing.json.defaultStyleId,
    };

    const styleIds = new Set([
      ...buildStyleVariantIds(body.styleFamilies, body.activeStyleId),
      ...existing.styleVariants.map((variant) => variant.id),
    ]);
    const primaryStyleId =
      body.activeStyleId?.trim().toLowerCase() || existing.styleId || "default";

    try {
      await publishComponentToDisk({
        slug,
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
      await ensureGeneratedBundle(slug);
      invalidateComponentCache();
      await syncComponentCatalog(slug);

      await logAuditEvent({
        userId: input.userId,
        action: "component.update",
        resource: slug,
        ip: input.ip,
        metadata: {
          tier,
          layer: taxonomy.layer,
          category: taxonomy.category,
          pipeline: validation.steps,
        },
      });
    } catch {
      return { ok: false, status: 500, error: "Failed to publish component." };
    }

    return { ok: true, slug, validation };
  }

  const component: import("./component-fs").ComponentJsonShape = {
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
    themes: Array.isArray(body.themes)
      ? body.themes.filter(
          (t): t is "light" | "dark" | "auto" =>
            t === "light" || t === "dark" || t === "auto",
        )
      : ["light", "dark", "auto"],
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
    await syncComponentCatalog(slug);

    await logAuditEvent({
      userId: input.userId,
      action: input.mode === "create" ? "component.create" : "component.update",
      resource: slug,
      ip: input.ip,
      metadata: {
        tier,
        layer: taxonomy.layer,
        category: taxonomy.category,
        pipeline: validation.steps,
      },
    });
  } catch {
    return { ok: false, status: 500, error: "Failed to publish component." };
  }

  return { ok: true, slug, validation };
}
