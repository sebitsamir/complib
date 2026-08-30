import { createHash } from "crypto";
import type { ComponentLayer, ComponentTier } from "@complib/contracts";

/** Supported export / preview frameworks tracked in the registry. */
export type RegistryFramework = "vanilla" | "react" | "vue";

export type RegistryStyle = {
  id: string;
  label: string;
  filesystemPath: string;
  manifest: Record<string, unknown>;
};

export type RegistryVariant = {
  id: string;
  label: string;
  props?: Record<string, string>;
};

export type RegistryDependency = {
  name: string;
  version?: string;
};

export type RegistryExample = {
  title: string;
  html: string;
  description?: string;
};

export type RegistryDocumentation = {
  usage: string;
  accessibility: string;
  installation: string;
};

export type RegistryRevision = {
  version: number;
  sourceHash: string;
  manifestHash: string;
  publishedAt: string;
  publishedBy?: string;
  notes?: string;
};

/** Canonical registry identity for a component. */
export type ComponentRegistryIdentity = {
  slug: string;
  name: string;
  description: string;
  tier: ComponentTier;
  layer: ComponentLayer;
  category: string;
  problemTags: string[];
  tags: string[];
  defaultStyleId: string;
  filesystemPath: string;
};

/**
 * Full registry record — the constitution of a published component.
 * Source of truth for catalog metadata; artifact bytes live on disk/object store.
 */
export type ComponentRegistryRecord = {
  schemaVersion: 1;
  identity: ComponentRegistryIdentity;
  styles: RegistryStyle[];
  variants: RegistryVariant[];
  frameworks: RegistryFramework[];
  dependencies: RegistryDependency[];
  documentation: RegistryDocumentation;
  examples: RegistryExample[];
  latestRevision: RegistryRevision | null;
};

export type SourceBundleInput = {
  html: string;
  css: string;
  js: string;
  runtime: string;
};

export type StyleManifestInput = {
  styleId: string;
  label: string;
  filesystemPath: string;
  manifest: Record<string, unknown>;
};

/** Stable SHA-256 over ordered string parts (null-byte separated). */
export function hashContent(parts: string[]): string {
  const digest = createHash("sha256");
  for (const part of parts) {
    digest.update(part);
    digest.update("\0");
  }
  return digest.digest("hex");
}

/** Hash a JSON-serializable value with stable key ordering. */
export function hashJson(value: unknown): string {
  return hashContent([stableStringify(value)]);
}

/** Hash component source files for revision tracking. */
export function computeSourceHash(bundle: SourceBundleInput): string {
  return hashContent([bundle.html, bundle.css, bundle.js, bundle.runtime]);
}

/** Hash all style manifests for a component revision. */
export function computeManifestHash(styles: StyleManifestInput[]): string {
  const ordered = [...styles].sort((a, b) => a.styleId.localeCompare(b.styleId));
  return hashJson(
    ordered.map((style) => ({
      styleId: style.styleId,
      label: style.label,
      filesystemPath: style.filesystemPath,
      manifest: style.manifest,
    })),
  );
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`).join(",")}}`;
}

/** Default documentation when none is authored on disk. */
export function buildDefaultDocumentation(input: {
  name: string;
  slug: string;
  description: string;
}): RegistryDocumentation {
  return {
    installation: `Import or copy the ${input.name} component from CompLib using slug "${input.slug}".`,
    usage: `${input.description}\n\nUse variant props and style families from the explorer or playground to customize appearance.`,
    accessibility:
      "Keep visible labels for interactive controls, preserve focus-visible styles, verify color contrast for text and backgrounds, and test keyboard navigation before publishing.",
  };
}

/** Default preview example from primary HTML markup. */
export function buildDefaultExample(input: {
  name: string;
  html: string;
}): RegistryExample {
  return {
    title: `${input.name} preview`,
    html: input.html.trim(),
    description: "Default live preview markup for this component.",
  };
}

/** Parse optional dependency strings from component metadata (`name` or `name@version`). */
export function parseDependencies(raw: string[] | undefined): RegistryDependency[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const deps: RegistryDependency[] = [];

  for (const entry of raw) {
    const trimmed = String(entry).trim();
    if (!trimmed) continue;
    const at = trimmed.lastIndexOf("@");
    const name = at > 0 ? trimmed.slice(0, at) : trimmed;
    const version = at > 0 ? trimmed.slice(at + 1) : undefined;
    const key = version ? `${name}@${version}` : name;
    if (seen.has(key)) continue;
    seen.add(key);
    deps.push({ name, version: version || undefined });
  }

  return deps;
}
