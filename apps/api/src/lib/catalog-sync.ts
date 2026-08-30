import path from "node:path";
import prisma from "../prisma";
import {
  COMPONENTS_ROOT,
  listComponentSlugs,
  readComponentBundleFromDisk,
  readStyleVariantBundle,
} from "./component-fs";
import {
  buildVariantManifest,
  normalizeSearchText,
  relativeComponentPath,
  relativeVariantPath,
  slugifyTag,
  titleCaseTag,
} from "./variant-manifest";
import { syncComponentRegistry } from "./component-registry";

export type CatalogSearchFilters = {
  q?: string;
  layer?: string;
  category?: string;
  style?: string;
  tier?: string;
  problem?: string;
  limit?: number;
};

export type CatalogSearchHit = {
  slug: string;
  name: string;
  description: string;
  tier: string;
  layer: string;
  category: string;
  problemTags: string[];
  defaultStyleId: string;
  styleVariants: Array<{ id: string; label: string }>;
  tags: string[];
  filesystemPath: string;
};

type CatalogSearchRow = {
  slug: string;
  name: string;
  description: string;
  tier: string;
  layer: string;
  category: string;
  problemTags: string[];
  defaultStyleId: string;
  filesystemPath: string;
  variants: Array<{ styleId: string; label: string }>;
  tags: Array<{ tag: { slug: string } }>;
};

function splitSearchTerms(query: string): string[] {
  return query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

async function updateCatalogSearchVector(componentId: string, input: {
  name: string;
  description: string;
  category: string;
  problemTags: string[];
  tags: string[];
  styleLabels: string[];
}): Promise<void> {
  const weightedDocument = [
    `name: ${input.name}`,
    `name: ${input.name}`,
    `category: ${input.category}`,
    `category: ${input.category}`,
    ...input.problemTags.map((tag) => `problem: ${tag}`),
    ...input.tags.map((tag) => `tag: ${tag}`),
    `description: ${input.description}`,
    ...input.styleLabels.map((label) => `style: ${label}`),
  ].join(" ");

  try {
    await prisma.$executeRaw`
      UPDATE "CatalogComponent"
      SET "searchVector" = to_tsvector('english', ${weightedDocument})
      WHERE id = ${componentId}
    `;
  } catch {
    // FTS column may not exist until migration is applied.
  }
}

export async function syncComponentCatalog(slug: string): Promise<boolean> {
  const bundle = await readComponentBundleFromDisk(slug);
  if (!bundle) return false;

  const componentPath = relativeComponentPath(bundle.dir, COMPONENTS_ROOT);
  const componentSearchText = normalizeSearchText([
    bundle.json.name,
    bundle.json.slug,
    bundle.json.description,
    bundle.json.layer,
    bundle.json.category,
    ...bundle.json.tags,
    ...bundle.json.problemTags,
    ...bundle.styleVariants.map((variant) => variant.label),
    ...bundle.styleVariants.map((variant) => variant.id),
    ...bundle.dimensions.map((dimension) => dimension.label),
    ...bundle.dimensions.map((dimension) => dimension.id),
  ]);

  const component = await prisma.catalogComponent.upsert({
    where: { slug },
    create: {
      slug,
      name: bundle.json.name,
      description: bundle.json.description,
      tier: bundle.json.tier,
      layer: bundle.json.layer,
      category: bundle.json.category,
      problemTags: bundle.json.problemTags,
      viewCount: bundle.json.viewCount,
      defaultStyleId: bundle.json.defaultStyleId ?? bundle.styleId,
      filesystemPath: componentPath,
      searchText: componentSearchText,
    },
    update: {
      name: bundle.json.name,
      description: bundle.json.description,
      tier: bundle.json.tier,
      layer: bundle.json.layer,
      category: bundle.json.category,
      problemTags: bundle.json.problemTags,
      viewCount: bundle.json.viewCount,
      defaultStyleId: bundle.json.defaultStyleId ?? bundle.styleId,
      filesystemPath: componentPath,
      searchText: componentSearchText,
    },
  });

  const variantRows: Array<{
    styleId: string;
    label: string;
    filesystemPath: string;
    manifest: object;
    searchText: string;
  }> = [];

  for (const styleVariant of bundle.styleVariants) {
    const styleBundle =
      styleVariant.id === bundle.styleId
        ? bundle
        : await readStyleVariantBundle(slug, styleVariant.id);
    if (!styleBundle) continue;

    const manifest = buildVariantManifest(styleBundle, styleVariant.id, styleVariant.label);
    const variantPath = relativeVariantPath(componentPath, styleVariant.id);
    variantRows.push({
      styleId: styleVariant.id,
      label: styleVariant.label,
      filesystemPath: variantPath,
      manifest,
      searchText: normalizeSearchText([
        styleVariant.id,
        styleVariant.label,
        bundle.json.slug,
        bundle.json.name,
        bundle.json.description,
        ...bundle.json.tags,
      ]),
    });
  }

  const keepStyleIds = variantRows.map((row) => row.styleId);
  await prisma.catalogVariant.deleteMany({
    where: {
      componentId: component.id,
      styleId: { notIn: keepStyleIds },
    },
  });

  for (const row of variantRows) {
    await prisma.catalogVariant.upsert({
      where: {
        componentId_styleId: {
          componentId: component.id,
          styleId: row.styleId,
        },
      },
      create: {
        componentId: component.id,
        styleId: row.styleId,
        label: row.label,
        filesystemPath: row.filesystemPath,
        manifest: row.manifest,
        searchText: row.searchText,
      },
      update: {
        label: row.label,
        filesystemPath: row.filesystemPath,
        manifest: row.manifest,
        searchText: row.searchText,
      },
    });
  }

  const tagSlugs = [...new Set(bundle.json.tags.map((tag) => slugifyTag(tag)).filter(Boolean))];
  await prisma.catalogComponentTag.deleteMany({ where: { componentId: component.id } });
  for (const tagSlug of tagSlugs) {
    const tag = await prisma.tag.upsert({
      where: { slug: tagSlug },
      create: { slug: tagSlug, name: titleCaseTag(tagSlug) },
      update: {},
    });
    await prisma.catalogComponentTag.create({
      data: {
        componentId: component.id,
        tagId: tag.id,
      },
    });
  }

  await syncComponentRegistry({
    componentId: component.id,
    bundle,
    variantRows,
    componentPath,
    tagSlugs,
  });

  await updateCatalogSearchVector(component.id, {
    name: bundle.json.name,
    description: bundle.json.description,
    category: bundle.json.category,
    problemTags: bundle.json.problemTags,
    tags: bundle.json.tags,
    styleLabels: bundle.styleVariants.map((variant) => variant.label),
  });

  return true;
}

export async function syncAllComponentsCatalog(): Promise<{
  synced: number;
  total: number;
  pruned: number;
}> {
  const slugs = await listComponentSlugs();
  const keep = new Set(slugs);
  let synced = 0;
  for (const slug of slugs) {
    if (await syncComponentCatalog(slug)) {
      synced += 1;
      console.log(`  ✓ ${slug}`);
    } else {
      console.warn(`  ✗ ${slug}`);
    }
  }

  const existing = await prisma.catalogComponent.findMany({ select: { slug: true } });
  let pruned = 0;
  for (const row of existing) {
    if (!keep.has(row.slug)) {
      await prisma.catalogComponent.delete({ where: { slug: row.slug } });
      pruned += 1;
      console.log(`  − pruned ${row.slug}`);
    }
  }

  return { synced, total: slugs.length, pruned };
}

export async function removeComponentCatalog(slug: string): Promise<void> {
  await prisma.catalogComponent.deleteMany({ where: { slug } });
}

type CatalogSearchBaseRow = {
  slug: string;
  name: string;
  description: string;
  tier: string;
  layer: string;
  category: string;
  problemTags: string[];
  defaultStyleId: string;
  filesystemPath: string;
};

async function hydrateCatalogHits(
  rows: CatalogSearchBaseRow[],
  filters: CatalogSearchFilters,
  limit: number,
): Promise<CatalogSearchHit[]> {
  const filtered = rows.filter((row) => {
    if (filters.layer && row.layer !== filters.layer) return false;
    if (filters.category && row.category !== filters.category) return false;
    if (filters.tier && row.tier !== filters.tier) return false;
    if (filters.problem && !row.problemTags.includes(filters.problem)) return false;
    return true;
  });

  const slugs = filtered.slice(0, limit).map((row) => row.slug);
  if (slugs.length === 0) return [];

  const enriched = (await prisma.catalogComponent.findMany({
    where: { slug: { in: slugs } },
    include: {
      variants: {
        orderBy: { styleId: "asc" },
        select: { styleId: true, label: true },
      },
      tags: { include: { tag: { select: { slug: true } } } },
    },
  })) as CatalogSearchRow[];

  const order = new Map(slugs.map((slug, index) => [slug, index]));
  return enriched
    .sort((a, b) => (order.get(a.slug) ?? 0) - (order.get(b.slug) ?? 0))
    .map((row) => ({
      slug: row.slug,
      name: row.name,
      description: row.description,
      tier: row.tier,
      layer: row.layer,
      category: row.category,
      problemTags: row.problemTags,
      defaultStyleId: row.defaultStyleId,
      styleVariants: row.variants.map((variant) => ({
        id: variant.styleId,
        label: variant.label,
      })),
      tags: row.tags.map((entry) => entry.tag.slug),
      filesystemPath: row.filesystemPath,
    }));
}

export async function searchCatalog(
  filters: CatalogSearchFilters = {},
): Promise<CatalogSearchHit[]> {
  const terms = splitSearchTerms(filters.q ?? "");
  const limit = Math.min(Math.max(filters.limit ?? 60, 1), 200);
  const query = terms.join(" ").trim();

  if (query) {
    try {
      const ftsRows = (await prisma.$queryRaw`
        SELECT
          c.slug,
          c.name,
          c.description,
          c.tier::text AS tier,
          c.layer::text AS layer,
          c.category,
          c."problemTags",
          c."defaultStyleId",
          c."filesystemPath"
        FROM "CatalogComponent" c
        WHERE c."searchVector" @@ plainto_tsquery('english', ${query})
        ORDER BY ts_rank(c."searchVector", plainto_tsquery('english', ${query})) DESC, c.name ASC
        LIMIT ${limit * 3}
      `) as CatalogSearchBaseRow[];

      if (ftsRows.length > 0) {
        return hydrateCatalogHits(ftsRows, filters, limit);
      }
    } catch {
      // Fall back to contains search when FTS is unavailable.
    }
  }

  const rows = (await prisma.catalogComponent.findMany({
    where: {
      ...(filters.layer ? { layer: filters.layer as never } : {}),
      ...(filters.category ? { category: filters.category } : {}),
      ...(filters.tier ? { tier: filters.tier as never } : {}),
      ...(filters.problem ? { problemTags: { has: filters.problem } } : {}),
      ...(filters.style
        ? {
            variants: {
              some: { styleId: filters.style },
            },
          }
        : {}),
      ...(terms.length > 0
        ? {
            AND: terms.map((term) => ({
              searchText: { contains: term },
            })),
          }
        : {}),
    },
    include: {
      variants: {
        orderBy: { styleId: "asc" },
        select: { styleId: true, label: true },
      },
      tags: {
        include: { tag: { select: { slug: true } } },
      },
    },
    orderBy: [{ name: "asc" }],
    take: limit,
  })) as CatalogSearchRow[];

  return rows.map((row: CatalogSearchRow) => ({
    slug: row.slug,
    name: row.name,
    description: row.description,
    tier: row.tier,
    layer: row.layer,
    category: row.category,
    problemTags: row.problemTags,
    defaultStyleId: row.defaultStyleId,
    styleVariants: row.variants.map((variant: CatalogSearchRow["variants"][number]) => ({
      id: variant.styleId,
      label: variant.label,
    })),
    tags: row.tags.map((entry: CatalogSearchRow["tags"][number]) => entry.tag.slug),
    filesystemPath: row.filesystemPath,
  }));
}

export async function recordComponentView(input: {
  slug: string;
  styleId?: string;
  userId?: string;
}): Promise<void> {
  const component = await prisma.catalogComponent.findUnique({
    where: { slug: input.slug },
    select: { id: true },
  });
  if (!component) return;

  await prisma.$transaction([
    prisma.componentView.create({
      data: {
        componentId: component.id,
        userId: input.userId ?? null,
        styleId: input.styleId ?? null,
      },
    }),
    prisma.catalogComponent.update({
      where: { id: component.id },
      data: { viewCount: { increment: 1 } },
    }),
  ]);
}

export async function recordComponentDownload(input: {
  slug: string;
  styleId?: string;
  framework?: string;
  userId?: string;
  ip?: string;
}): Promise<void> {
  const component = await prisma.catalogComponent.findUnique({
    where: { slug: input.slug },
    select: { id: true },
  });
  if (!component) return;

  await prisma.downloadEvent.create({
    data: {
      componentId: component.id,
      userId: input.userId ?? null,
      styleId: input.styleId ?? null,
      framework: input.framework ?? "vanilla",
      ip: input.ip ?? null,
    },
  });
}
