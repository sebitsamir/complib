"use client";

import type { PlaygroundDocument } from "@/lib/playground/persistence-store";

export async function savePlaygroundToCloud(
  slug: string,
  name: string,
  document: PlaygroundDocument,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/playground/projects/${encodeURIComponent(slug)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, document }),
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      return { ok: false, error: data.error ?? "Save failed." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error while saving." };
  }
}

export async function loadPlaygroundFromCloud(
  slug: string,
): Promise<{ ok: boolean; document?: PlaygroundDocument; error?: string }> {
  try {
    const res = await fetch(`/api/playground/projects/${encodeURIComponent(slug)}`, {
      credentials: "include",
      cache: "no-store",
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      return { ok: false, error: data.error ?? "Load failed." };
    }
    const data = (await res.json()) as { document?: PlaygroundDocument };
    return { ok: true, document: data.document };
  } catch {
    return { ok: false, error: "Network error while loading." };
  }
}
