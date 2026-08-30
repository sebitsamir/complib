import path from "node:path";

const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

/** Rejects path traversal and invalid component slugs. */
export function assertSafeComponentSlug(slug: string): string | null {
  const decoded = decodeURIComponent(slug).trim();
  if (!decoded || decoded.includes("..") || decoded.includes("/") || decoded.includes("\\")) {
    return null;
  }
  if (!SLUG_PATTERN.test(decoded)) return null;
  return decoded;
}

/** Ensures a resolved file path stays inside the allowed root. */
export function isPathInsideRoot(root: string, target: string): boolean {
  const resolvedRoot = path.resolve(root);
  const resolvedTarget = path.resolve(target);
  return (
    resolvedTarget === resolvedRoot ||
    resolvedTarget.startsWith(`${resolvedRoot}${path.sep}`)
  );
}
