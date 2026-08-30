import path from "node:path";

/**
 * Canonical artifact locations for the CompLib monorepo.
 * Component source does not live inside the Next.js app.
 */
function repoRootFromApi(): string {
  const fromEnv = process.env.COMPLIB_REPO_ROOT?.trim();
  if (fromEnv) return path.resolve(fromEnv);
  // apps/api/src → repo root (or apps/api/dist after compile)
  return path.resolve(__dirname, "..", "..", "..");
}

export const REPO_ROOT = repoRootFromApi();

export const STORAGE_ROOT = path.resolve(
  process.env.COMPLIB_STORAGE_ROOT?.trim() || path.join(REPO_ROOT, "storage"),
);

export const COMPONENTS_ROOT = path.join(STORAGE_ROOT, "components");
export const GENERATED_ROOT = path.join(STORAGE_ROOT, "generated");
export const LEGACY_COMPONENTS_ROOT = path.join(GENERATED_ROOT, "components");
