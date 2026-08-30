import type { AdminFormState } from "@/components/admin/admin-studio";

const DRAFT_KEY = "complib-admin-draft-v1";

export function loadAdminDraft(): AdminFormState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as AdminFormState;
    if (!data || typeof data.name !== "string" || typeof data.slug !== "string") return null;
    return data;
  } catch {
    return null;
  }
}

export function saveAdminDraft(form: AdminFormState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
  } catch {
    // ignore quota errors
  }
}

export function clearAdminDraft() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}
