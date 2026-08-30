import path from "path";

/** Top-level folders under the artifact root. */
export const STORAGE_DIRS = {
  components: "components",
  generated: "generated",
  revisions: "revisions",
} as const;

export type StorageDir = (typeof STORAGE_DIRS)[keyof typeof STORAGE_DIRS];

export type ArtifactKind =
  | "component-source"
  | "style-variant"
  | "generated-bundle"
  | "revision-snapshot";

export type ArtifactRef = {
  kind: ArtifactKind;
  /** Path relative to storage root (posix-style). */
  relativePath: string;
};

export type ComponentLocation = {
  layer: string;
  category: string;
  slug: string;
};

export type ResolveStorageRootOptions = {
  envRoot?: string;
  /** Fallback when COMPLIB_STORAGE_ROOT is unset (e.g. monorepo `storage/`). */
  defaultRoot: string;
};

/** Resolve artifact root from env or default. */
export function resolveStorageRoot(options: ResolveStorageRootOptions): string {
  const fromEnv = options.envRoot?.trim();
  if (fromEnv) return path.resolve(fromEnv);
  return path.resolve(options.defaultRoot);
}

export function componentDir(location: ComponentLocation): string {
  return path.posix.join(
    STORAGE_DIRS.components,
    location.layer,
    location.category,
    location.slug,
  );
}

export function styleVariantDir(
  location: ComponentLocation,
  styleId: string,
): string {
  return path.posix.join(componentDir(location), "variants", styleId);
}

export function generatedBundleDir(framework: string, slug: string): string {
  return path.posix.join(STORAGE_DIRS.generated, framework, slug);
}

export function revisionSnapshotDir(slug: string, version: number): string {
  return path.posix.join(STORAGE_DIRS.revisions, slug, `v${version}`);
}

export function joinStorage(root: string, relativePath: string): string {
  return path.join(root, ...relativePath.split("/"));
}

export function toPosixRelative(root: string, absolutePath: string): string {
  return path.relative(root, absolutePath).split(path.sep).join("/");
}

/** Standard artifact filenames inside a style variant folder. */
export const VARIANT_FILES = {
  html: "html/index.html",
  css: "html/style.css",
  js: "html/script.js",
  config: "config.json",
} as const;

export const COMPONENT_MANIFEST_FILE = "dimensions.json";

export function listRequiredStorageDirs(): StorageDir[] {
  return [
    STORAGE_DIRS.components,
    STORAGE_DIRS.generated,
    STORAGE_DIRS.revisions,
  ];
}
