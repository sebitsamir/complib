import fs from "node:fs/promises";
import path from "node:path";
import prisma from "../prisma";
import {
  buildDefaultDocumentation,
  buildDefaultExample,
  computeManifestHash,
  computeSourceHash,
  parseDependencies,
  type ComponentRegistryRecord,
  type RegistryFramework,
  type RegistryRevision,
  type StyleManifestInput,
} from "@complib/component-registry";
import {
  GENERATED_ROOT,
  type ComponentDiskBundle,
} from "./component-fs";

type RegistryQueryRow = {
  slug: string;
  name: string;
  description: string;
  tier: ComponentRegistryRecord["identity"]["tier"];
  layer: ComponentRegistryRecord["identity"]["layer"];
  category: string;
  problemTags: string[];
  defaultStyleId: string;
  filesystemPath: string;
  variants: Array<{
    styleId: string;
    label: string;
    filesystemPath: string;
    manifest: unknown;
  }>;
  tags: Array<{ tag: { slug: string } }>;
  dependencies: Array<{ name: string; version: string | null }>;
  frameworks: Array<{ framework: string }>;
  examples: Array<{ title: string; html: string; description: string | null }>;
  documentation: {
    usage: string;
    accessibility: string;
    installation: string;
  } | null;
  revisions: Array<{
    version: number;
    sourceHash: string;
    manifestHash: string;
    publishedAt: Date;
    publishedBy: string | null;
    notes: string | null;
  }>;
};

type VariantRow = {
  styleId: string;
  label: string;
  filesystemPath: string;
  manifest: object;
};

const FRAMEWORKS: RegistryFramework[] = ["vanilla", "react", "vue"];

async function generatedBundleExists(framework: RegistryFramework, slug: string): Promise<boolean> {
  const dir = path.join(GENERATED_ROOT, framework, slug);
  try {
    const stat = await fs.stat(dir);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

function readOptionalStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((entry) => String(entry)).filter(Boolean);
}

function readOptionalDocumentation(bundle: ComponentDiskBundle) {
  const raw = bundle.json as Record<string, unknown>;
  const doc = raw.documentation;
  if (!doc || typeof doc !== "object") return null;
  const record = doc as Record<string, unknown>;
  return {
    usage: typeof record.usage === "string" ? record.usage : "",
    accessibility: typeof record.accessibility === "string" ? record.accessibility : "",
    installation: typeof record.installation === "string" ? record.installation : "",
  };
}

function readOptionalExamples(bundle: ComponentDiskBundle) {
  const raw = bundle.json as Record<string, unknown>;
  const examples = raw.examples;
  if (!Array.isArray(examples)) return null;

  const parsed = examples
    .filter((entry) => entry && typeof entry === "object")
    .map((entry) => {
      const record = entry as Record<string, unknown>;
      const title = typeof record.title === "string" ? record.title.trim() : "";
      const html = typeof record.html === "string" ? record.html : "";
      if (!title) return null;
      return {
        title,
        html,
        description:
          typeof record.description === "string" ? record.description : undefined,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  return parsed.length > 0 ? parsed : null;
}

async function syncRevision(
  componentId: string,
  bundle: ComponentDiskBundle,
  variantRows: VariantRow[],
  publishedBy?: string,
): Promise<RegistryRevision | null> {
  const sourceHash = computeSourceHash({
    html: bundle.html,
    css: bundle.css,
    js: bundle.js,
    runtime: bundle.runtime,
  });

  const manifestInputs: StyleManifestInput[] = variantRows.map((row) => ({
    styleId: row.styleId,
    label: row.label,
    filesystemPath: row.filesystemPath,
    manifest: row.manifest as Record<string, unknown>,
  }));
  const manifestHash = computeManifestHash(manifestInputs);

  const latest = await prisma.componentRevision.findFirst({
    where: { componentId },
    orderBy: { version: "desc" },
    select: {
      version: true,
      sourceHash: true,
      manifestHash: true,
      publishedAt: true,
      publishedBy: true,
      notes: true,
    },
  });

  if (latest && latest.sourceHash === sourceHash && latest.manifestHash === manifestHash) {
    return {
      version: latest.version,
      sourceHash: latest.sourceHash,
      manifestHash: latest.manifestHash,
      publishedAt: latest.publishedAt.toISOString(),
      publishedBy: latest.publishedBy ?? undefined,
      notes: latest.notes ?? undefined,
    };
  }

  const version = (latest?.version ?? 0) + 1;
  const created = await prisma.componentRevision.create({
    data: {
      componentId,
      version,
      sourceHash,
      manifestHash,
      publishedBy: publishedBy ?? null,
      notes: "Catalog sync",
    },
  });

  return {
    version: created.version,
    sourceHash: created.sourceHash,
    manifestHash: created.manifestHash,
    publishedAt: created.publishedAt.toISOString(),
    publishedBy: created.publishedBy ?? undefined,
    notes: created.notes ?? undefined,
  };
}

async function syncDependencies(componentId: string, bundle: ComponentDiskBundle): Promise<void> {
  const raw = bundle.json as Record<string, unknown>;
  const deps = parseDependencies(readOptionalStringArray(raw.dependencies));

  await prisma.componentDependency.deleteMany({ where: { componentId } });
  if (deps.length === 0) return;

  await prisma.componentDependency.createMany({
    data: deps.map((dep) => ({
      componentId,
      name: dep.name,
      version: dep.version ?? null,
    })),
  });
}

async function syncFrameworks(componentId: string, slug: string): Promise<RegistryFramework[]> {
  const available: RegistryFramework[] = [];
  const now = new Date();

  for (const framework of FRAMEWORKS) {
    const exists = await generatedBundleExists(framework, slug);
    if (!exists) {
      await prisma.componentFramework.deleteMany({
        where: { componentId, framework },
      });
      continue;
    }

    available.push(framework);
    await prisma.componentFramework.upsert({
      where: {
        componentId_framework: { componentId, framework },
      },
      create: {
        componentId,
        framework,
        generatedPath: path.posix.join(framework, slug),
        lastBuiltAt: now,
      },
      update: {
        generatedPath: path.posix.join(framework, slug),
        lastBuiltAt: now,
      },
    });
  }

  return available;
}

async function syncExamples(
  componentId: string,
  bundle: ComponentDiskBundle,
): Promise<void> {
  const fromDisk = readOptionalExamples(bundle);
  const examples =
    fromDisk ??
    [buildDefaultExample({ name: bundle.json.name, html: bundle.html })];

  await prisma.componentExample.deleteMany({ where: { componentId } });
  await prisma.componentExample.createMany({
    data: examples.map((example) => ({
      componentId,
      title: example.title,
      html: example.html,
      description: example.description ?? null,
    })),
  });
}

async function syncDocumentation(
  componentId: string,
  bundle: ComponentDiskBundle,
): Promise<void> {
  const fromDisk = readOptionalDocumentation(bundle);
  const documentation =
    fromDisk ??
    buildDefaultDocumentation({
      name: bundle.json.name,
      slug: bundle.json.slug,
      description: bundle.json.description,
    });

  await prisma.componentDocumentation.upsert({
    where: { componentId },
    create: {
      componentId,
      usage: documentation.usage,
      accessibility: documentation.accessibility,
      installation: documentation.installation,
    },
    update: {
      usage: documentation.usage,
      accessibility: documentation.accessibility,
      installation: documentation.installation,
    },
  });
}

/**
 * Sync registry tables for a catalog component after catalog variant rows are written.
 * Creates a new revision only when source or manifest hashes change.
 */
export async function syncComponentRegistry(input: {
  componentId: string;
  bundle: ComponentDiskBundle;
  variantRows: VariantRow[];
  componentPath: string;
  tagSlugs: string[];
  publishedBy?: string;
}): Promise<void> {
  const { componentId, bundle, variantRows, componentPath, tagSlugs, publishedBy } = input;

  await Promise.all([
    syncDependencies(componentId, bundle),
    syncExamples(componentId, bundle),
    syncDocumentation(componentId, bundle),
    syncFrameworks(componentId, bundle.slug),
  ]);

  await syncRevision(componentId, bundle, variantRows, publishedBy);
}

export async function getRegistryBySlug(slug: string): Promise<ComponentRegistryRecord | null> {
  const row = (await prisma.catalogComponent.findUnique({
    where: { slug },
    include: {
      variants: { orderBy: { styleId: "asc" } },
      tags: { include: { tag: { select: { slug: true } } } },
      dependencies: { orderBy: { name: "asc" } },
      frameworks: { orderBy: { framework: "asc" } },
      examples: { orderBy: { title: "asc" } },
      documentation: true,
      revisions: {
        orderBy: { version: "desc" },
        take: 1,
      },
    },
  })) as RegistryQueryRow | null;

  if (!row) return null;

  const latest = row.revisions[0];
  const latestRevision: RegistryRevision | null = latest
    ? {
        version: latest.version,
        sourceHash: latest.sourceHash,
        manifestHash: latest.manifestHash,
        publishedAt: latest.publishedAt.toISOString(),
        publishedBy: latest.publishedBy ?? undefined,
        notes: latest.notes ?? undefined,
      }
    : null;

  return {
    schemaVersion: 1,
    identity: {
      slug: row.slug,
      name: row.name,
      description: row.description,
      tier: row.tier,
      layer: row.layer,
      category: row.category,
      problemTags: row.problemTags,
      tags: row.tags.map((entry) => entry.tag.slug),
      defaultStyleId: row.defaultStyleId,
      filesystemPath: row.filesystemPath,
    },
    styles: row.variants.map((variant) => ({
      id: variant.styleId,
      label: variant.label,
      filesystemPath: variant.filesystemPath,
      manifest: variant.manifest as Record<string, unknown>,
    })),
    variants: extractVariantsFromManifests(row.variants),
    frameworks: row.frameworks.map(
      (entry) => entry.framework as RegistryFramework,
    ),
    dependencies: row.dependencies.map((dep) => ({
      name: dep.name,
      version: dep.version ?? undefined,
    })),
    documentation: row.documentation
      ? {
          usage: row.documentation.usage,
          accessibility: row.documentation.accessibility,
          installation: row.documentation.installation,
        }
      : buildDefaultDocumentation({
          name: row.name,
          slug: row.slug,
          description: row.description,
        }),
    examples: row.examples.map((example) => ({
      title: example.title,
      html: example.html,
      description: example.description ?? undefined,
    })),
    latestRevision,
  };
}

export async function listRegistryRevisions(slug: string) {
  const component = await prisma.catalogComponent.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!component) return null;

  return prisma.componentRevision.findMany({
    where: { componentId: component.id },
    orderBy: { version: "desc" },
    select: {
      version: true,
      sourceHash: true,
      manifestHash: true,
      publishedAt: true,
      publishedBy: true,
      notes: true,
    },
  });
}

function extractVariantsFromManifests(
  variants: Array<{ manifest: unknown }>,
): ComponentRegistryRecord["variants"] {
  const seen = new Map<string, ComponentRegistryRecord["variants"][number]>();

  for (const variant of variants) {
    const manifest = variant.manifest as Record<string, unknown> | null;
    const dimensions = manifest?.dimensions;
    if (!Array.isArray(dimensions)) continue;

    for (const entry of dimensions) {
      if (!entry || typeof entry !== "object") continue;
      const record = entry as Record<string, unknown>;
      const id = typeof record.id === "string" ? record.id : "";
      const label = typeof record.label === "string" ? record.label : "";
      if (!id || !label || seen.has(id)) continue;

      const props =
        record.props && typeof record.props === "object"
          ? Object.fromEntries(
              Object.entries(record.props as Record<string, unknown>).map(
                ([key, value]) => [key, String(value)],
              ),
            )
          : undefined;

      seen.set(id, { id, label, props });
    }
  }

  return [...seen.values()].sort((a, b) => a.id.localeCompare(b.id));
}
