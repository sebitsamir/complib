import {
  invalidateComponentSlugIndex,
  listComponentSlugs,
  readComponentBundleFromDisk,
  type ComponentJsonShape,
  type ComponentLayer,
  type ComponentStyleVariant,
  type ComponentVariant,
} from "@/lib/component-fs";

export type ComponentTier = "FREE" | "PRO" | "ENTERPRISE";

export type Component = {
  id: string;
  name: string;
  slug: string;
  description: string;
  html: string;
  css: string;
  /**
   * The JS payload for the component, stored as a string.
   * This project historically used `component.js` in HTML/script tags.
   */
  js: string;
  /**
   * Some parts of the newer pipeline call it `runtime`.
   * We keep it as an alias of `js` for compatibility.
   */
  runtime: string;
  tags: string[];
  tier: ComponentTier;
  layer: ComponentLayer;
  category: string;
  problemTags: string[];
  viewCount: number;
  variants?: ComponentVariant[];
  themes?: Array<"light" | "dark" | "auto">;
  /** Folder-based style families under variants/{id}/ */
  styleFamilies?: ComponentStyleVariant[];
  defaultStyleId?: string;
};

export type ComponentBundle = Component;

export type LibraryNavComponent = {
  name: string;
  slug: string;
  tier: ComponentTier;
};

export type LibraryLayerCategory = {
  name: string;
  slug: string;
  components: LibraryNavComponent[];
};

export type LibraryNavLayer = {
  name: string;
  slug: ComponentLayer;
  categories: LibraryLayerCategory[];
};

export type ProblemNavGroup = {
  problem: string;
  components: LibraryNavComponent[];
};

function toTitleCase(input: string): string {
  return input
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function normalizeComponentFromAny(input: {
  html: string;
  css: string;
  js: string;
  runtime?: string;
} & Omit<Component, "html" | "css" | "js" | "runtime">): Component {
  const runtime = typeof input.runtime === "string" ? input.runtime : input.js;
  return {
    ...input,
    runtime,
    js: input.js,
    problemTags: input.problemTags.map((tag) => String(tag)),
    variants: input.variants,
    themes: input.themes,
    styleFamilies: input.styleFamilies,
    defaultStyleId: input.defaultStyleId,
  };
}

async function readComponentFromDisk(
  slug: string,
  options?: { styleId?: string },
): Promise<Component | null> {
  const bundle = await readComponentBundleFromDisk(slug, options);
  if (!bundle) return null;
  const parsed = bundle.json as ComponentJsonShape;
  const { html, css, js, runtime } = bundle;

  if (
    !parsed.id ||
    !parsed.name ||
    !parsed.slug ||
    !parsed.description ||
    !parsed.tier ||
    !parsed.tags ||
    !parsed.layer ||
    !parsed.category ||
    !parsed.problemTags ||
    typeof parsed.viewCount !== "number"
  ) {
    return null;
  }

  return normalizeComponentFromAny({
    id: String(parsed.id),
    name: String(parsed.name),
    slug: String(parsed.slug),
    description: String(parsed.description),
    tier: parsed.tier as ComponentTier,
    tags: parsed.tags as string[],
    layer: parsed.layer as ComponentLayer,
    category: String(parsed.category),
    problemTags: (parsed.problemTags as string[]).map((tag) => String(tag)),
    viewCount: parsed.viewCount,
    html,
    css,
    js,
    runtime,
    variants: bundle.dimensions.length > 0 ? bundle.dimensions : parsed.variants,
    themes: parsed.themes,
    styleFamilies: bundle.styleVariants,
    defaultStyleId: parsed.defaultStyleId ?? bundle.styleId,
  });
}

let cachedComponents: Component[] | null = null;

export function invalidateComponentCache() {
  cachedComponents = null;
  invalidateComponentSlugIndex();
}

async function getAllComponents(): Promise<Component[]> {
  if (cachedComponents) return cachedComponents;

  try {
    const dirs = await listComponentSlugs();
    const loaded = await Promise.all(dirs.map((slug) => readComponentFromDisk(slug)));
    const disk = loaded.filter((c): c is Component => c !== null);
    if (disk.length > 0) {
      cachedComponents = disk;
      return disk;
    }
    cachedComponents = [];
    return cachedComponents;
  } catch {
    cachedComponents = [];
    return cachedComponents;
  }
}

export async function getComponentBySlug(
  slug: string,
  options?: { styleId?: string },
): Promise<Component | null> {
  if (options?.styleId) {
    return readComponentFromDisk(slug, options);
  }
  const all = await getAllComponents();
  return all.find((c) => c.slug === slug) ?? null;
}

export async function getComponents(
  search = "",
  tier?: string,
  layer?: string,
  category?: string,
  problem?: string,
): Promise<Component[]> {
  const all = await getAllComponents();
  let filtered = all;

  const term = search.trim().toLowerCase();
  if (term) {
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term) ||
        c.tags.some((tag) => tag.toLowerCase().includes(term)),
    );
  }

  if (tier) {
    filtered = filtered.filter((c) => c.tier === tier);
  }

  if (layer) {
    filtered = filtered.filter((c) => c.layer === layer.toLowerCase());
  }

  if (category) {
    filtered = filtered.filter((c) => c.category.toLowerCase() === category.toLowerCase());
  }

  if (problem) {
    filtered = filtered.filter((c) =>
      c.problemTags.some((tag) => tag.toLowerCase() === problem.toLowerCase()),
    );
  }

  return filtered;
}

export async function getLibraryNavigationByLayer(): Promise<LibraryNavLayer[]> {
  const all = await getAllComponents();
  const byLayer = new Map<ComponentLayer, Map<string, LibraryLayerCategory>>();

  for (const c of all) {
    const layerGroup = byLayer.get(c.layer) ?? new Map<string, LibraryLayerCategory>();
    const categorySlug = c.category.toLowerCase();
    const category = layerGroup.get(categorySlug) ?? {
      name: toTitleCase(c.category),
      slug: categorySlug,
      components: [],
    };
    if (!category.components.some((item) => item.slug === c.slug)) {
      category.components.push({ name: c.name, slug: c.slug, tier: c.tier });
    }
    layerGroup.set(categorySlug, category);
    byLayer.set(c.layer, layerGroup);
  }

  return Array.from(byLayer.entries())
    .map(([layer, categories]) => ({
      name: toTitleCase(layer),
      slug: layer,
      categories: Array.from(categories.values())
        .map((entry) => ({
          ...entry,
          components: entry.components.sort((a, b) => a.name.localeCompare(b.name)),
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getProblemNavigation(): Promise<ProblemNavGroup[]> {
  const all = await getAllComponents();
  const byProblem = new Map<string, LibraryNavComponent[]>();

  for (const c of all) {
    for (const problemTag of c.problemTags) {
      if (!byProblem.has(problemTag)) byProblem.set(problemTag, []);
      const problemComponents = byProblem.get(problemTag)!;
      if (!problemComponents.some((item) => item.slug === c.slug)) {
        problemComponents.push({ name: c.name, slug: c.slug, tier: c.tier });
      }
    }
  }

  return Array.from(byProblem.entries())
    .map(([problem, components]) => ({
      problem,
      components: components.sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.problem.localeCompare(b.problem));
}

