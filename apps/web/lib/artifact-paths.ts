import path from "path";
import {
  resolveStorageRoot,
  STORAGE_DIRS,
} from "@complib/artifact-store";

/** Repo-level artifact store — not the Next.js `components/` UI folder. */
function resolveWebStorageRoot(): string {
  const fromEnv = process.env.COMPLIB_STORAGE_ROOT?.trim();
  const defaultRoot = path.resolve(process.cwd(), "..", "..", "storage");
  return resolveStorageRoot({ envRoot: fromEnv, defaultRoot });
}

export const STORAGE_ROOT = resolveWebStorageRoot();
export const COMPONENTS_ROOT = path.join(STORAGE_ROOT, STORAGE_DIRS.components);
export const GENERATED_ROOT = path.join(STORAGE_ROOT, STORAGE_DIRS.generated);
export const REVISIONS_ROOT = path.join(STORAGE_ROOT, STORAGE_DIRS.revisions);
export const LEGACY_COMPONENTS_ROOT = path.join(GENERATED_ROOT, "components");
