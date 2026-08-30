const DEFAULT_BACKEND = "http://127.0.0.1:5000";

export type RegistryRecord = {
  schemaVersion: 1;
  identity: {
    slug: string;
    name: string;
    description: string;
    tier: string;
    layer: string;
    category: string;
    problemTags: string[];
    tags: string[];
    defaultStyleId: string;
  };
  styles: Array<{ id: string; label: string }>;
  frameworks: string[];
  dependencies: Array<{ name: string; version?: string }>;
  documentation: {
    usage: string;
    accessibility: string;
    installation: string;
  };
  examples: Array<{ title: string; html: string; description?: string }>;
};

function backendBase(): string {
  return (process.env.COMPLIB_BACKEND_URL ?? DEFAULT_BACKEND).replace(/\/$/, "");
}

export async function fetchRegistryBySlug(slug: string): Promise<RegistryRecord | null> {
  try {
    const res = await fetch(`${backendBase()}/api/registry/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as RegistryRecord;
  } catch {
    return null;
  }
}
