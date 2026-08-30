import type { ArtboardZoom } from "@/components/playground/playground-artboard-viewport";
import type { PlaygroundPageSource } from "@/lib/playground-page-artifact";
import type { PlaygroundInstance } from "@/lib/playground-merge";
import { PLAYGROUND_ARTBOARD_MIN_HEIGHT } from "@/lib/playground-viewport";

export const PLAYGROUND_STORAGE_KEY = "complib-playground-v4";
export const PLAYGROUND_STORAGE_KEY_LEGACY = "complib-playground-v3";

export type WorkbenchView = "canvas" | "code";

/** Canonical playground document — separate from generated page code artifacts. */
export type PlaygroundDocument = {
  nodes: PlaygroundInstance[];
  settings: {
    workbenchView?: WorkbenchView;
    artboardZoom?: ArtboardZoom;
    codeDetached?: boolean;
  };
};

export type StoredPlaygroundSession = {
  instances: PlaygroundInstance[];
  pageCode?: PlaygroundPageSource;
  codeDetached?: boolean;
  workbenchView?: WorkbenchView;
  artboardZoom?: ArtboardZoom;
};

export function toPlaygroundDocument(session: StoredPlaygroundSession): PlaygroundDocument {
  return {
    nodes: session.instances,
    settings: {
      workbenchView: session.workbenchView,
      artboardZoom: session.artboardZoom,
      codeDetached: session.codeDetached,
    },
  };
}

export function parseInstances(raw: unknown): PlaygroundInstance[] {
  if (!Array.isArray(raw)) return [];
  const out: PlaygroundInstance[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const id = typeof r.id === "string" ? r.id : "";
    const slug = typeof r.slug === "string" ? r.slug : "";
    const x = typeof r.x === "number" ? r.x : undefined;
    const y = typeof r.y === "number" ? r.y : undefined;
    const width = typeof r.width === "number" ? r.width : undefined;
    const height = typeof r.height === "number" ? r.height : undefined;
    const heightAuto = r.heightAuto === true;
    const zIndex = typeof r.zIndex === "number" ? r.zIndex : 1;
    const variantId = typeof r.variantId === "string" ? r.variantId.trim() : undefined;
    const variantPropsRaw = r.variantProps;
    let variantProps: Record<string, string> | undefined;
    if (
      variantPropsRaw &&
      typeof variantPropsRaw === "object" &&
      !Array.isArray(variantPropsRaw)
    ) {
      const entries = Object.entries(variantPropsRaw).filter(
        ([, value]) => typeof value === "string" && value.trim(),
      ) as [string, string][];
      if (entries.length > 0) {
        variantProps = Object.fromEntries(entries.map(([key, value]) => [key, value.trim()]));
      }
    }
    if (!id || !slug) continue;
    if (x === undefined || y === undefined || width === undefined || height === undefined) {
      continue;
    }
    out.push({
      id,
      slug,
      x,
      y,
      width,
      height,
      zIndex: Number.isFinite(zIndex) ? zIndex : 1,
      ...(heightAuto ? { heightAuto: true } : {}),
      ...(variantId ? { variantId } : {}),
      ...(variantProps ? { variantProps } : {}),
    });
  }
  return out;
}

export function parsePageCode(raw: unknown): PlaygroundPageSource | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const legacyCss = typeof r.css === "string" ? r.css : "";
  const layoutCss = typeof r.layoutCss === "string" ? r.layoutCss : legacyCss;
  const componentsCss = typeof r.componentsCss === "string" ? r.componentsCss : "";
  const html = typeof r.html === "string" ? r.html : "";
  const js = typeof r.js === "string" ? r.js : "";
  const editorHeight =
    typeof r.editorHeight === "number" && Number.isFinite(r.editorHeight)
      ? r.editorHeight
      : PLAYGROUND_ARTBOARD_MIN_HEIGHT;
  if (!html && !layoutCss && !componentsCss && !js) return null;
  return { html, layoutCss, componentsCss, js, editorHeight };
}

export function parseArtboardZoom(raw: unknown): ArtboardZoom {
  if (raw === "fit" || raw === "50" || raw === "75" || raw === "100") return raw;
  if (raw === 0.5) return "50";
  if (raw === 0.75) return "75";
  if (raw === 1) return "100";
  return "fit";
}

function pageCodeHasEdits(source: PlaygroundPageSource | undefined): boolean {
  if (!source) return false;
  return Boolean(
    source.html.trim() ||
      source.layoutCss.trim() ||
      source.componentsCss.trim() ||
      source.js.trim(),
  );
}

export function loadStoredPlaygroundSession(): StoredPlaygroundSession {
  if (typeof window === "undefined") {
    return { instances: [] };
  }
  try {
    const raw =
      localStorage.getItem(PLAYGROUND_STORAGE_KEY) ??
      localStorage.getItem(PLAYGROUND_STORAGE_KEY_LEGACY);
    if (!raw) return { instances: [] };
    const data = JSON.parse(raw) as Record<string, unknown>;
    const workbenchView =
      data.workbenchView === "code" || data.workbenchView === "canvas"
        ? data.workbenchView
        : undefined;
    return {
      instances: parseInstances(data.instances),
      pageCode: parsePageCode(data.pageCode) ?? undefined,
      codeDetached: data.codeDetached === true,
      workbenchView,
      artboardZoom: parseArtboardZoom(data.artboardZoom),
    };
  } catch {
    return { instances: [] };
  }
}

export function saveStoredPlaygroundSession(session: StoredPlaygroundSession): void {
  try {
    const persistPageCode =
      session.codeDetached === true || pageCodeHasEdits(session.pageCode);
    localStorage.setItem(
      PLAYGROUND_STORAGE_KEY,
      JSON.stringify({
        instances: session.instances,
        pageCode: persistPageCode ? session.pageCode : undefined,
        codeDetached: session.codeDetached ?? false,
        workbenchView: session.workbenchView,
        artboardZoom: session.artboardZoom,
      }),
    );
  } catch {
    // ignore quota / private mode
  }
}
