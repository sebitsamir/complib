import fs from "node:fs/promises";
import path from "node:path";
import {
  componentDir,
  joinStorage,
  listRequiredStorageDirs,
  resolveStorageRoot,
  revisionSnapshotDir,
  STORAGE_DIRS,
  toPosixRelative,
  type ArtifactRef,
  type ComponentLocation,
} from "@complib/artifact-store";
import { REPO_ROOT, STORAGE_ROOT } from "../complib-paths";
import type { ComponentDiskBundle } from "./component-fs";

export { STORAGE_ROOT };

export type StorageHealth = {
  ok: boolean;
  root: string;
  writable: boolean;
  directories: Record<string, boolean>;
  error?: string;
};

export type ComponentArtifactInventory = {
  slug: string;
  sourcePath: string;
  styleVariants: string[];
  generated: Array<{ framework: string; path: string; exists: boolean }>;
  revisions: Array<{ version: number; path: string; exists: boolean }>;
};

function defaultStorageRoot(): string {
  return resolveStorageRoot({
    envRoot: process.env.COMPLIB_STORAGE_ROOT,
    defaultRoot: path.join(REPO_ROOT, "storage"),
  });
}

/** Ensure the artifact tree exists and is usable. */
export async function ensureStorageLayout(root = STORAGE_ROOT): Promise<void> {
  for (const dir of listRequiredStorageDirs()) {
    await fs.mkdir(joinStorage(root, dir), { recursive: true });
  }
}

export async function checkStorageHealth(root = STORAGE_ROOT): Promise<StorageHealth> {
  const directories: Record<string, boolean> = {};
  let writable = false;

  try {
    await ensureStorageLayout(root);
    for (const dir of listRequiredStorageDirs()) {
      const full = joinStorage(root, dir);
      try {
        const stat = await fs.stat(full);
        directories[dir] = stat.isDirectory();
      } catch {
        directories[dir] = false;
      }
    }

    const probe = joinStorage(root, ".write-probe");
    await fs.writeFile(probe, "ok", "utf8");
    await fs.unlink(probe);
    writable = true;

    return {
      ok: Object.values(directories).every(Boolean) && writable,
      root,
      writable,
      directories,
    };
  } catch (err) {
    return {
      ok: false,
      root,
      writable,
      directories,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function readArtifactText(
  ref: ArtifactRef,
  root = STORAGE_ROOT,
): Promise<string | null> {
  try {
    return await fs.readFile(joinStorage(root, ref.relativePath), "utf8");
  } catch {
    return null;
  }
}

export async function writeArtifactText(
  ref: ArtifactRef,
  content: string,
  root = STORAGE_ROOT,
): Promise<void> {
  const target = joinStorage(root, ref.relativePath);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, content, "utf8");
}

async function copyDirRecursive(src: string, dest: string): Promise<void> {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDirRecursive(from, to);
    } else if (entry.isFile()) {
      await fs.copyFile(from, to);
    }
  }
}

/**
 * Immutable snapshot of component source at publish time.
 * Stored under storage/revisions/{slug}/v{n}/.
 */
export async function snapshotRevisionArtifacts(input: {
  bundle: ComponentDiskBundle;
  version: number;
  root?: string;
}): Promise<string> {
  const root = input.root ?? STORAGE_ROOT;
  const location: ComponentLocation = {
    layer: input.bundle.json.layer,
    category: input.bundle.json.category,
    slug: input.bundle.slug,
  };

  const sourceDir = joinStorage(root, componentDir(location));
  const snapshotRelative = revisionSnapshotDir(input.bundle.slug, input.version);
  const snapshotDir = joinStorage(root, snapshotRelative);

  await fs.rm(snapshotDir, { recursive: true, force: true });
  await copyDirRecursive(sourceDir, snapshotDir);

  const manifest = {
    schemaVersion: 1,
    slug: input.bundle.slug,
    version: input.version,
    snapshottedAt: new Date().toISOString(),
    sourceRelativePath: componentDir(location),
  };
  await fs.writeFile(
    path.join(snapshotDir, "revision.json"),
    JSON.stringify(manifest, null, 2),
    "utf8",
  );

  return snapshotRelative;
}

export async function listRevisionSnapshots(
  slug: string,
  root = STORAGE_ROOT,
): Promise<Array<{ version: number; path: string; exists: boolean }>> {
  const revisionsRoot = joinStorage(root, path.posix.join(STORAGE_DIRS.revisions, slug));
  try {
    const entries = await fs.readdir(revisionsRoot, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory() && /^v\d+$/.test(entry.name))
      .map((entry) => {
        const version = Number(entry.name.slice(1));
        return {
          version,
          path: path.posix.join(STORAGE_DIRS.revisions, slug, entry.name),
          exists: true,
        };
      })
      .sort((a, b) => b.version - a.version);
  } catch {
    return [];
  }
}

export async function getComponentArtifactInventory(
  bundle: ComponentDiskBundle,
  root = STORAGE_ROOT,
): Promise<ComponentArtifactInventory> {
  const location: ComponentLocation = {
    layer: bundle.json.layer,
    category: bundle.json.category,
    slug: bundle.slug,
  };
  const sourcePath = componentDir(location);

  const frameworks = ["vanilla", "react", "vue"] as const;
  const generated = await Promise.all(
    frameworks.map(async (framework) => {
      const rel = path.posix.join(STORAGE_DIRS.generated, framework, bundle.slug);
      try {
        const stat = await fs.stat(joinStorage(root, rel));
        return { framework, path: rel, exists: stat.isDirectory() };
      } catch {
        return { framework, path: rel, exists: false };
      }
    }),
  );

  const revisions = await listRevisionSnapshots(bundle.slug, root);

  return {
    slug: bundle.slug,
    sourcePath,
    styleVariants: bundle.styleVariants.map((variant) => variant.id),
    generated,
    revisions,
  };
}

export function absoluteToStorageRelative(absolutePath: string, root = STORAGE_ROOT): string {
  return toPosixRelative(root, absolutePath);
}

export function resolveStorageRootFromEnv(): string {
  return defaultStorageRoot();
}
