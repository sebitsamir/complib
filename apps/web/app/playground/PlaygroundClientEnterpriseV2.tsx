"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import PageCodePanel, {
  type PageCodeTab,
} from "@/components/playground/page-code-panel";
import PlaygroundArtboardViewport, {
  mapArtboardCoords,
  type ArtboardZoom,
} from "@/components/playground/playground-artboard-viewport";
import {
  IconDownload,
  IconRedo,
  IconUndo,
  pg,
  PlaygroundIconButton,
  PlaygroundPanel,
  PlaygroundSegmented,
  PlaygroundStatusPill,
  ToolbarDivider,
} from "@/components/playground/playground-shell";
import {
  cloneInstances,
  pushHistory,
  redoHistory,
  undoHistory,
} from "@/lib/playground-history";
import { buildPageCodePreviewSrcDoc } from "@/lib/playground-code-preview";
import { isPaletteDragEvent, readPaletteDragData } from "@/lib/palette-drag";
import type { PlaygroundPageSource } from "@/lib/playground-page-artifact";
import type { PlaygroundInstance } from "@/lib/playground-merge";
import {
  computePlaygroundEditorHeight,
  PLAYGROUND_ARTBOARD_MIN_HEIGHT,
  PLAYGROUND_ARTBOARD_WIDTH,
  PLAYGROUND_SNAP,
} from "@/lib/playground-viewport";
import PlaygroundInspector from "@/components/playground/playground-inspector";
import PlaygroundLibraryRail from "@/components/playground/PlaygroundLibraryRail";
import type { PaletteDragPayload } from "@/components/playground/palette-types";
import {
  addRecentSlug,
  getBuilderSidebarCollapsed,
  subscribeBuilderSidebarCollapsed,
} from "@/lib/library-persistence";
import { buildSelection, selectionFromVariantId } from "@/lib/variant-props";
import {
  formatVariantLabel,
  getDefaultProps,
  getDefaultVariantId,
  libraryStyleToQuery,
  parseVariantQuery,
  type LibraryStyleOption,
  type VariantSelection,
} from "@/lib/variant-utils";
import type { ComponentVariant } from "@/lib/component-fs";
import {
  autoGridPlacementForComponent,
  defaultFrameForComponent,
  PLAYGROUND_QUICK_INSERT,
} from "@/lib/playground-defaults";
import { PLAYGROUND_STARTERS } from "@/lib/playground-starters";

type CatalogRow = {
  slug: string;
  name: string;
  layer: string;
  category: string;
  tier: "FREE" | "PRO" | "ENTERPRISE";
  variants?: Array<{ id: string; label: string; props?: Record<string, string> }>;
};
function normalizeCatalogRow(input: unknown): CatalogRow | null {
  if (!input || typeof input !== "object") return null;
  const row = input as Record<string, unknown>;
  if (
    typeof row.slug !== "string" ||
    typeof row.name !== "string" ||
    typeof row.layer !== "string" ||
    typeof row.category !== "string"
  ) {
    return null;
  }
  const variantsRaw = row.variants;
  const variants = Array.isArray(variantsRaw)
    ? variantsRaw
        .filter(
          (v): v is { id: string; label: string; props?: Record<string, string> } =>
            !!v &&
            typeof v === "object" &&
            typeof (v as { id?: unknown }).id === "string" &&
            typeof (v as { label?: unknown }).label === "string",
        )
        .map((v) => ({
          id: v.id,
          label: v.label,
          ...(v.props && typeof v.props === "object"
            ? {
                props: Object.fromEntries(
                  Object.entries(v.props).map(([key, value]) => [String(key), String(value)]),
                ),
              }
            : {}),
        }))
    : undefined;
  const tier =
    row.tier === "FREE" || row.tier === "ENTERPRISE" || row.tier === "PRO"
      ? row.tier
      : "PRO";
  return {
    slug: row.slug,
    name: row.name,
    layer: row.layer,
    category: row.category,
    tier,
    variants,
  };
}

type Framework = "vanilla" | "react" | "vue";
type WorkbenchView = "canvas" | "code";

const EMPTY_PAGE_CODE: PlaygroundPageSource = {
  html: "",
  layoutCss: "",
  componentsCss: "",
  js: "",
  editorHeight: PLAYGROUND_ARTBOARD_MIN_HEIGHT,
};

const STORAGE_KEY = "complib-playground-v4";
const STORAGE_KEY_LEGACY = "complib-playground-v3";
const CODE_PREVIEW_DEBOUNCE_MS = 200;
const PREVIEW_DEBOUNCE_MS = 140;

const EDITOR_WIDTH = PLAYGROUND_ARTBOARD_WIDTH;
const SNAP = PLAYGROUND_SNAP;

function snap(v: number) {
  return Math.round(v / SNAP) * SNAP;
}

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

function resolveLayout(instance: PlaygroundInstance) {
  const defaults = defaultFrameForComponent(instance.slug);
  const heightAuto = instance.heightAuto === true;
  return {
    x: typeof instance.x === "number" ? instance.x : 0,
    y: typeof instance.y === "number" ? instance.y : 0,
    width: typeof instance.width === "number" ? instance.width : defaults.width,
    height: typeof instance.height === "number" ? instance.height : defaults.height,
    heightAuto,
    zIndex: typeof instance.zIndex === "number" ? instance.zIndex : 1,
  };
}

/** Stable key for add/remove/variant changes (excludes layout). */
function instanceStructureKey(instances: PlaygroundInstance[]): string {
  return instances
    .map((i) => {
      const props = i.variantProps
        ? Object.keys(i.variantProps)
            .sort()
            .map((k) => `${k}=${i.variantProps![k]}`)
            .join("&")
        : "";
      return `${i.id}\0${i.slug}\0${i.variantId ?? ""}\0${props}`;
    })
    .join("\n");
}

function instanceLayoutPayload(instances: PlaygroundInstance[]) {
  return instances.map((i) => {
    const layout = resolveLayout(i);
    return {
      id: i.id,
      x: layout.x,
      y: layout.y,
      width: layout.width,
      height: layout.height,
      heightAuto: layout.heightAuto,
      zIndex: layout.zIndex,
    };
  });
}

function getNextZ(instances: PlaygroundInstance[]) {
  const maxZ = instances.reduce((acc, i) => Math.max(acc, i.zIndex || 1), 1);
  return maxZ + 1;
}

function autoGridPlacement(
  index: number,
  slug?: string,
  layer?: string | null,
) {
  if (slug) {
    return autoGridPlacementForComponent(index, slug, layer);
  }
  return autoGridPlacementForComponent(index, "box", layer ?? "layout");
}

type StoredPlaygroundSession = {
  instances: PlaygroundInstance[];
  pageCode?: PlaygroundPageSource;
  codeDetached?: boolean;
  workbenchView?: WorkbenchView;
  artboardZoom?: ArtboardZoom;
};

function parseInstances(raw: unknown): PlaygroundInstance[] {
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

function parsePageCode(raw: unknown): PlaygroundPageSource | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const legacyCss = typeof r.css === "string" ? r.css : "";
  const layoutCss =
    typeof r.layoutCss === "string" ? r.layoutCss : legacyCss;
  const componentsCss =
    typeof r.componentsCss === "string" ? r.componentsCss : "";
  const html = typeof r.html === "string" ? r.html : "";
  const js = typeof r.js === "string" ? r.js : "";
  const editorHeight =
    typeof r.editorHeight === "number" && Number.isFinite(r.editorHeight)
      ? r.editorHeight
      : PLAYGROUND_ARTBOARD_MIN_HEIGHT;
  if (!html && !layoutCss && !componentsCss && !js) return null;
  return { html, layoutCss, componentsCss, js, editorHeight };
}

function parseArtboardZoom(raw: unknown): ArtboardZoom {
  if (raw === "fit" || raw === "50" || raw === "75" || raw === "100") return raw;
  if (raw === 0.5) return "50";
  if (raw === 0.75) return "75";
  if (raw === 1) return "100";
  return "fit";
}

function loadStoredSession(): StoredPlaygroundSession {
  if (typeof window === "undefined") {
    return { instances: [] };
  }
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ??
      localStorage.getItem(STORAGE_KEY_LEGACY);
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

function pageCodeHasEdits(source: PlaygroundPageSource | undefined): boolean {
  if (!source) return false;
  return Boolean(
    source.html.trim() ||
      source.layoutCss.trim() ||
      source.componentsCss.trim() ||
      source.js.trim(),
  );
}

function saveStoredSession(session: StoredPlaygroundSession) {
  try {
    const persistPageCode =
      session.codeDetached === true || pageCodeHasEdits(session.pageCode);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        instances: session.instances,
        pageCode: persistPageCode ? session.pageCode : undefined,
        codeDetached: session.codeDetached ?? false,
        workbenchView: session.workbenchView,
        artboardZoom: session.artboardZoom,
      }),
    );
  } catch {
    // ignore
  }
}

type PatchMove = { id: string; x: number; y: number; zIndex: number };

/** Layout snapshot for copy/paste (no instance id). */
type ClipboardItem = {
  slug: string;
  x: number;
  y: number;
  width: number;
  height: number;
  heightAuto?: boolean;
  variantId?: string;
  variantProps?: Record<string, string>;
};

const PASTE_NUDGE = 32;

function defaultVariantState(
  variants: ComponentVariant[] | undefined,
): { variantId?: string; variantProps?: Record<string, string> } {
  if (!variants?.length) return {};
  const props = getDefaultProps(variants);
  const presetId = getDefaultVariantId(variants);
  return {
    ...(presetId ? { variantId: presetId } : {}),
    variantProps: props,
  };
}

function instanceVariantSelection(
  instance: PlaygroundInstance,
  variants: ComponentVariant[],
): VariantSelection {
  if (instance.variantProps && Object.keys(instance.variantProps).length > 0) {
    return buildSelection(variants, instance.variantProps);
  }
  return selectionFromVariantId(variants, instance.variantId ?? getDefaultVariantId(variants));
}

function buildInstancesFromClipboard(
  items: ClipboardItem[],
  existing: PlaygroundInstance[],
  offsetX: number,
  offsetY: number,
): { added: PlaygroundInstance[]; newIds: string[] } {
  if (items.length === 0) return { added: [], newIds: [] };
  let z = getNextZ(existing);
  const newIds: string[] = [];
  const added = items.map((t) => {
    const id = crypto.randomUUID();
    newIds.push(id);
    const inst: PlaygroundInstance = {
      id,
      slug: t.slug,
      x: clamp(snap(t.x + offsetX), 0, EDITOR_WIDTH - t.width),
      y: clamp(snap(t.y + offsetY), 0, 100000),
      width: t.width,
      height: t.height,
      zIndex: z++,
      ...(t.heightAuto ? { heightAuto: true } : {}),
      ...(t.variantId ? { variantId: t.variantId } : {}),
      ...(t.variantProps ? { variantProps: t.variantProps } : {}),
    };
    return inst;
  });
  return { added, newIds };
}

function applyPatch(
  instances: PlaygroundInstance[],
  patch: { remove?: string[]; moves?: PatchMove[] },
): PlaygroundInstance[] {
  let next = instances;
  if (patch.remove?.length) {
    const removeSet = new Set(patch.remove);
    next = next.filter((i) => !removeSet.has(i.id));
  }
  if (patch.moves?.length) {
    const moveMap = new Map(patch.moves.map((m) => [m.id, m]));
    next = next.map((i) => {
      const m = moveMap.get(i.id);
      if (!m) return i;
      return { ...i, x: m.x, y: m.y, zIndex: m.zIndex };
    });
  }
  return next;
}

export default function PlaygroundClientEnterprise() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const canvasIframeRef = useRef<HTMLIFrameElement | null>(null);
  const canvasDropZoneRef = useRef<HTMLDivElement | null>(null);
  const artboardScaleRef = useRef(1);
  const handledAddsRef = useRef<Set<string>>(new Set());
  const skipHistoryRef = useRef(false);
  const instancesRef = useRef<PlaygroundInstance[]>([]);
  const clipboardRef = useRef<ClipboardItem[]>([]);
  const pasteCountRef = useRef(0);
  const codeDetachedRef = useRef(false);
  const structureKeyRef = useRef("");
  const pendingStructureKeyRef = useRef<string | null>(null);
  const previewReadyRef = useRef(false);

  const [catalog, setCatalog] = useState<CatalogRow[] | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [sidebarTab, setSidebarTab] = useState<"library" | "layers">("library");

  const [sessionHydrated, setSessionHydrated] = useState(false);
  const prevWorkbenchViewRef = useRef<WorkbenchView>("canvas");

  const [instances, setInstances] = useState<PlaygroundInstance[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [history, setHistory] = useState({ past: [] as PlaygroundInstance[][], future: [] as PlaygroundInstance[][] });

  const [editMode, setEditMode] = useState(true);
  const [canvasPreviewHtml, setCanvasPreviewHtml] = useState<string>("");
  const [codePreviewHtml, setCodePreviewHtml] = useState<string>("");
  const [previewError, setPreviewError] = useState<string | null>(null);

  const [downloadError, setDownloadError] = useState<"pro" | "other" | null>(null);
  const [downloadBusy, setDownloadBusy] = useState(false);
  const [downloadOk, setDownloadOk] = useState(false);
  const [exportKind, setExportKind] = useState<"library" | "scaffold">("library");
  const [stack, setStack] = useState<"vite-react" | "vite-vue" | "next-app">("vite-react");
  const [workbenchView, setWorkbenchView] = useState<WorkbenchView>("canvas");
  const [artboardZoom, setArtboardZoom] = useState<ArtboardZoom>("fit");
  const [codeDetached, setCodeDetached] = useState(false);
  const [pageCode, setPageCode] = useState<PlaygroundPageSource>(EMPTY_PAGE_CODE);
  const [pageCodeTab, setPageCodeTab] = useState<PageCodeTab>("html");
  const [pageCodeLoading, setPageCodeLoading] = useState(false);

  useEffect(() => {
    const session = loadStoredSession();
    if (session.instances.length > 0) {
      setInstances(session.instances);
      setSelectedIds(session.instances[0]?.id ? [session.instances[0].id] : []);
    }
    if (session.workbenchView) {
      setWorkbenchView(session.workbenchView);
      prevWorkbenchViewRef.current = session.workbenchView;
    }
    if (session.artboardZoom) setArtboardZoom(session.artboardZoom);
    if (session.codeDetached) setCodeDetached(session.codeDetached);
    if (session.pageCode) setPageCode(session.pageCode);
    setSessionHydrated(true);
  }, []);

  const frameworkParam = searchParams.get("framework");
  const framework: Framework =
    frameworkParam === "react" || frameworkParam === "vue" ? frameworkParam : "vanilla";

  instancesRef.current = instances;
  codeDetachedRef.current = codeDetached;

  const catalogBySlug = useMemo(() => {
    const map = new Map<string, CatalogRow>();
    for (const row of catalog ?? []) map.set(row.slug, row);
    return map;
  }, [catalog]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const editorHeight = useMemo(() => {
    const maxBottom = instances.reduce((acc, i) => {
      const layout = resolveLayout(i);
      return Math.max(acc, layout.y + layout.height);
    }, 0);
    return computePlaygroundEditorHeight(maxBottom);
  }, [instances]);

  const commitInstances = useCallback((next: PlaygroundInstance[]) => {
    if (skipHistoryRef.current) {
      setInstances(next);
      return;
    }
    setHistory((h) => pushHistory(h, instancesRef.current));
    setInstances(next);
  }, []);

  const undo = useCallback(() => {
    setHistory((h) => {
      const result = undoHistory(h, instancesRef.current);
      if (!result.instances) return h;
      skipHistoryRef.current = true;
      setInstances(result.instances);
      setSelectedIds((ids) => ids.filter((id) => result.instances!.some((i) => i.id === id)));
      skipHistoryRef.current = false;
      return result.history;
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((h) => {
      const result = redoHistory(h, instancesRef.current);
      if (!result.instances) return h;
      skipHistoryRef.current = true;
      setInstances(result.instances);
      setSelectedIds((ids) => ids.filter((id) => result.instances!.some((i) => i.id === id)));
      skipHistoryRef.current = false;
      return result.history;
    });
  }, []);

  useEffect(() => {
    if (!sessionHydrated) return;
    saveStoredSession({
      instances,
      pageCode,
      codeDetached,
      workbenchView,
      artboardZoom,
    });
  }, [sessionHydrated, instances, pageCode, codeDetached, workbenchView, artboardZoom]);

  const postToCanvas = useCallback((payload: Record<string, unknown>) => {
    canvasIframeRef.current?.contentWindow?.postMessage(payload, "*");
  }, []);

  const postEditMode = useCallback(
    (value: boolean) => postToCanvas({ type: "complib:set-edit-mode", value }),
    [postToCanvas],
  );

  const postSelection = useCallback(
    (ids: string[]) => postToCanvas({ type: "complib:set-selection", ids }),
    [postToCanvas],
  );

  useEffect(() => {
    if (workbenchView !== "canvas") return;
    postEditMode(editMode);
  }, [editMode, postEditMode, workbenchView]);

  useEffect(() => {
    if (workbenchView !== "canvas") return;
    postSelection(selectedIds);
  }, [selectedIds, canvasPreviewHtml, postSelection, workbenchView]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/playground/catalog")
      .then((r) => {
        if (!r.ok) throw new Error("Catalog request failed");
        return r.json() as Promise<{ catalog: CatalogRow[] }>;
      })
      .then((data) => {
        if (cancelled) return;
        const normalized = (data.catalog ?? [])
          .map((row) => normalizeCatalogRow(row))
          .filter((row): row is CatalogRow => row !== null);
        setCatalog(normalized);
        if (normalized.length !== (data.catalog ?? []).length) {
          setCatalogError("Catalog contains invalid taxonomy entries.");
        }
      })
      .catch(() => {
        if (!cancelled) setCatalogError("Could not load component list.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data as { type?: string; [key: string]: unknown } | null;
      if (!data || typeof data.type !== "string") return;
      if (event.source !== canvasIframeRef.current?.contentWindow) return;

      if (data.type === "complib:select") {
        const ids = Array.isArray(data.ids)
          ? (data.ids as unknown[]).filter((x): x is string => typeof x === "string")
          : typeof data.id === "string"
            ? [data.id]
            : [];
        setSelectedIds(ids);
        if (ids.length > 0) setSidebarTab("layers");
      }

      if (data.type === "complib:patch") {
        const remove = Array.isArray(data.remove)
          ? (data.remove as unknown[]).filter((x): x is string => typeof x === "string")
          : undefined;
        const moves = Array.isArray(data.moves)
          ? (data.moves as PatchMove[]).filter(
              (m) => m && typeof m.id === "string" && typeof m.x === "number",
            )
          : undefined;
        commitInstances(applyPatch(instancesRef.current, { remove, moves }));
        if (remove?.length) {
          setSelectedIds((prev) => prev.filter((id) => !remove.includes(id)));
        }
      }

      if (data.type === "complib:drag-end") {
        const id = typeof data.id === "string" ? data.id : null;
        const x = typeof data.x === "number" ? data.x : null;
        const y = typeof data.y === "number" ? data.y : null;
        const zIndex = typeof data.zIndex === "number" ? data.zIndex : null;
        if (!id || x === null || y === null) return;
        commitInstances(
          instancesRef.current.map((i) =>
            i.id === id
              ? { ...i, x, y, zIndex: zIndex ?? i.zIndex }
              : i,
          ),
        );
      }

      if (data.type === "complib:measure") {
        const sizesRaw = Array.isArray(data.sizes) ? data.sizes : [];
        const byId = new Map<string, number>();
        for (const row of sizesRaw) {
          if (!row || typeof row !== "object") continue;
          const r = row as { id?: unknown; height?: unknown };
          if (typeof r.id !== "string" || typeof r.height !== "number") continue;
          if (!Number.isFinite(r.height) || r.height <= 0) continue;
          byId.set(r.id, Math.round(r.height));
        }
        if (byId.size === 0) return;

        let changed = false;
        const next = instancesRef.current.map((inst) => {
          if (inst.heightAuto !== true) return inst;
          const measured = byId.get(inst.id);
          if (measured == null) return inst;
          const current = typeof inst.height === "number" ? inst.height : 0;
          if (Math.abs(current - measured) < 2) return inst;
          changed = true;
          return { ...inst, height: measured, heightAuto: true };
        });
        if (!changed) return;
        // Soft update — measured content height shouldn't spam undo history.
        skipHistoryRef.current = true;
        setInstances(next);
        skipHistoryRef.current = false;
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [commitInstances]);

  const syncPageCodeFromCanvas = useCallback(async (inst?: PlaygroundInstance[]) => {
    if (framework !== "vanilla") return;
    setPageCodeLoading(true);
    try {
      const res = await fetch("/api/playground/page-source", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instances: inst ?? instancesRef.current }),
      });
      if (!res.ok) throw new Error("Page source failed");
      const data = (await res.json()) as PlaygroundPageSource;
      setPageCode(data);
    } catch {
      setPreviewError("Could not build page code from canvas.");
    } finally {
      setPageCodeLoading(false);
    }
  }, [framework]);

  useEffect(() => {
    if (framework !== "vanilla" || codeDetached) return;
    if (workbenchView !== "code") return;
    const t = window.setTimeout(() => {
      void syncPageCodeFromCanvas(instances);
    }, PREVIEW_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [instances, framework, codeDetached, syncPageCodeFromCanvas, workbenchView]);

  /** Page code tab only — custom HTML/CSS/JS preview (no layout editor). */
  useEffect(() => {
    if (workbenchView !== "code") return;
    const t = window.setTimeout(() => {
      setCodePreviewHtml(
        buildPageCodePreviewSrcDoc(
          pageCode.html,
          pageCode.layoutCss,
          pageCode.componentsCss,
          pageCode.js,
          pageCode.editorHeight || editorHeight,
        ),
      );
    }, CODE_PREVIEW_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [pageCode, workbenchView, editorHeight]);

  /**
   * Canvas preview — full rebuild only when structure changes (add/remove/variant).
   * Layout-only changes (move/resize) update the live iframe via postMessage.
   */
  useEffect(() => {
    if (workbenchView !== "canvas") return;

    const nextKey = instanceStructureKey(instances);

    if (nextKey === structureKeyRef.current && previewReadyRef.current) {
      postToCanvas({
        type: "complib:apply-layout",
        layouts: instanceLayoutPayload(instances),
        editorHeight,
      });
      return;
    }

    if (nextKey === pendingStructureKeyRef.current) {
      return;
    }

    const switchedFromCode = prevWorkbenchViewRef.current === "code";
    prevWorkbenchViewRef.current = "canvas";
    pendingStructureKeyRef.current = nextKey;
    previewReadyRef.current = false;

    const ctrl = new AbortController();
    const delay = switchedFromCode ? 0 : PREVIEW_DEBOUNCE_MS;
    const t = window.setTimeout(() => {
      setPreviewError(null);
      fetch("/api/playground/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instances }),
        signal: ctrl.signal,
      })
        .then(async (res) => {
          if (!res.ok) {
            const json = await res.json().catch(() => ({}));
            throw new Error(
              typeof (json as { error?: string }).error === "string"
                ? (json as { error: string }).error
                : "Preview failed",
            );
          }
          return res.json() as Promise<{ html: string }>;
        })
        .then((data) => {
          if (pendingStructureKeyRef.current !== nextKey) return;
          structureKeyRef.current = nextKey;
          pendingStructureKeyRef.current = null;
          setCanvasPreviewHtml(data.html);
          previewReadyRef.current = true;
          window.requestAnimationFrame(() => {
            const live = instancesRef.current;
            const maxBottom = live.reduce((acc, i) => {
              const layout = resolveLayout(i);
              return Math.max(acc, layout.y + layout.height);
            }, 0);
            postToCanvas({
              type: "complib:apply-layout",
              layouts: instanceLayoutPayload(live),
              editorHeight: computePlaygroundEditorHeight(maxBottom),
            });
          });
        })
        .catch((e: unknown) => {
          if (!ctrl.signal.aborted) {
            if (pendingStructureKeyRef.current === nextKey) {
              pendingStructureKeyRef.current = null;
            }
            previewReadyRef.current = false;
            setPreviewError(e instanceof Error ? e.message : "Preview failed");
          }
        });
    }, delay);
    return () => {
      ctrl.abort();
      window.clearTimeout(t);
      if (pendingStructureKeyRef.current === nextKey) {
        pendingStructureKeyRef.current = null;
      }
    };
  }, [instances, workbenchView, postToCanvas, editorHeight]);

  useEffect(() => {
    if (workbenchView === "code") {
      prevWorkbenchViewRef.current = "code";
    }
  }, [workbenchView]);

  const onPageCodeChange = (tab: PageCodeTab, value: string) => {
    setCodeDetached(true);
    setPageCode((prev) => {
      if (tab === "html") return { ...prev, html: value };
      if (tab === "layout") return { ...prev, layoutCss: value };
      if (tab === "components") return { ...prev, componentsCss: value };
      return { ...prev, js: value };
    });
  };

  const resetPageCodeFromCanvas = () => {
    setCodeDetached(false);
    void syncPageCodeFromCanvas();
  };

  const [isPaletteDragging, setIsPaletteDragging] = useState(false);
  const paletteDragRef = useRef<PaletteDragPayload | null>(null);
  const paletteDropHandledRef = useRef(false);

  const addInstance = useCallback(
    (
      slug: string,
      placement: ReturnType<typeof autoGridPlacement>,
      variantQuery?: Record<string, string | undefined>,
    ) => {
      const id = crypto.randomUUID();
      const catalogItem = catalogBySlug.get(slug);
      const variants = (catalogItem?.variants ?? []) as ComponentVariant[];
      let variantState = defaultVariantState(variants);

      if (variantQuery && variants.length > 0) {
        const selection = parseVariantQuery(variants, variantQuery);
        variantState = {
          ...(selection.presetId ? { variantId: selection.presetId } : {}),
          variantProps: selection.props,
        };
      }

      const next = [
        ...instancesRef.current,
        { id, slug, ...placement, zIndex: getNextZ(instancesRef.current), ...variantState },
      ];
      commitInstances(next);
      setSelectedIds([id]);
      if (framework === "vanilla") setCodeDetached(false);
    },
    [catalogBySlug, commitInstances, framework],
  );

  useEffect(() => {
    const addSlug = searchParams.get("add");
    if (!addSlug) return;
    const trimmed = addSlug.trim();
    if (!trimmed || handledAddsRef.current.has(trimmed)) return;
    handledAddsRef.current.add(trimmed);

    const variantQuery: Record<string, string | undefined> = {
      variant: searchParams.get("variant") ?? undefined,
      size: searchParams.get("size") ?? undefined,
      tone: searchParams.get("tone") ?? undefined,
      density: searchParams.get("density") ?? undefined,
      radius: searchParams.get("radius") ?? undefined,
      emphasis: searchParams.get("emphasis") ?? undefined,
    };

    const timer = window.setTimeout(() => {
      addRecentSlug(trimmed);
      const layer = catalogBySlug.get(trimmed)?.category ?? catalogBySlug.get(trimmed)?.layer ?? null;
      addInstance(
        trimmed,
        autoGridPlacement(instancesRef.current.length, trimmed, layer),
        variantQuery,
      );
    }, 0);

    const next = new URLSearchParams(searchParams.toString());
    next.delete("add");
    next.delete("variant");
    next.delete("size");
    next.delete("tone");
    next.delete("density");
    next.delete("radius");
    next.delete("emphasis");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    return () => window.clearTimeout(timer);
  }, [pathname, router, searchParams, addInstance, catalogBySlug]);

  const addFromSlugAt = useCallback(
    (slug: string, x: number, y: number, style?: LibraryStyleOption) => {
      addRecentSlug(slug);
      const variantQuery = style ? libraryStyleToQuery(style) : undefined;
      const meta = catalogBySlug.get(slug);
      const frame = defaultFrameForComponent(slug, meta?.category ?? meta?.layer);
      addInstance(
        slug,
        {
          x: clamp(snap(x), 0, EDITOR_WIDTH - frame.width),
          y: clamp(snap(y), 0, 100000),
          width: frame.width,
          height: frame.height,
          heightAuto: frame.heightAuto,
        },
        variantQuery,
      );
    },
    [addInstance, catalogBySlug],
  );

  const addAutoGrid = useCallback(
    (slug: string, style?: LibraryStyleOption) => {
      addRecentSlug(slug);
      const variantQuery = style ? libraryStyleToQuery(style) : undefined;
      const meta = catalogBySlug.get(slug);
      addInstance(
        slug,
        autoGridPlacement(
          instancesRef.current.length,
          slug,
          meta?.category ?? meta?.layer,
        ),
        variantQuery,
      );
    },
    [addInstance, catalogBySlug],
  );

  const applyStarter = useCallback(
    (starterId: string) => {
      const starter = PLAYGROUND_STARTERS.find((s) => s.id === starterId);
      if (!starter) return;
      const available = starter.slugs.filter((slug) => catalogBySlug.has(slug));
      if (available.length === 0) {
        setSidebarTab("library");
        return;
      }

      const next: PlaygroundInstance[] = available.map((slug, index) => {
        const id = crypto.randomUUID();
        const catalogItem = catalogBySlug.get(slug);
        const variants = (catalogItem?.variants ?? []) as ComponentVariant[];
        const variantState = defaultVariantState(variants);
        return {
          id,
          slug,
          ...autoGridPlacement(
            index,
            slug,
            catalogItem?.category ?? catalogItem?.layer,
          ),
          zIndex: index + 1,
          ...variantState,
        };
      });

      for (const slug of available) addRecentSlug(slug);
      commitInstances(next);
      setSelectedIds(next[0] ? [next[0].id] : []);
      setSidebarTab("layers");
      if (framework === "vanilla") setCodeDetached(false);
    },
    [catalogBySlug, commitInstances, framework],
  );

  const addWithStyle = (slug: string, style: LibraryStyleOption) => {
    addRecentSlug(slug);
    const meta = catalogBySlug.get(slug);
    addInstance(
      slug,
      autoGridPlacement(
        instancesRef.current.length,
        slug,
        meta?.category ?? meta?.layer,
      ),
      libraryStyleToQuery(style),
    );
  };

  const handlePaletteDragStart = useCallback((payload: PaletteDragPayload) => {
    paletteDropHandledRef.current = false;
    paletteDragRef.current = payload;
    setIsPaletteDragging(true);
  }, []);

  const handlePaletteDragEnd = useCallback(() => {
    paletteDragRef.current = null;
    setIsPaletteDragging(false);
  }, []);

  const placePaletteDrop = useCallback(
    (clientX: number, clientY: number, drag: PaletteDragPayload) => {
      // Map onto the scaled iframe (artboard content), not the outer canvas body.
      const dropZone = canvasIframeRef.current ?? canvasDropZoneRef.current;
      if (!dropZone) {
        addAutoGrid(drag.slug, drag.style);
        return;
      }
      const rect = dropZone.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        addAutoGrid(drag.slug, drag.style);
        return;
      }

      const { x, y } = mapArtboardCoords(
        artboardScaleRef.current,
        clientX,
        clientY,
        rect,
      );
      addFromSlugAt(drag.slug, x, y, drag.style);
    },
    [addAutoGrid, addFromSlugAt],
  );

  const handlePaletteDrop = useCallback((
    event: DragEvent | React.DragEvent,
    options?: { requireCanvasBounds?: boolean },
  ) => {
    if (paletteDropHandledRef.current) return;

    if (options?.requireCanvasBounds) {
      const zone = canvasIframeRef.current ?? canvasDropZoneRef.current;
      if (zone) {
        const rect = zone.getBoundingClientRect();
        const inside =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;
        if (!inside) return;
      }
    }

    event.preventDefault();
    event.stopPropagation();

    const drag =
      (event.dataTransfer ? readPaletteDragData(event.dataTransfer) : null) ??
      paletteDragRef.current;
    if (!drag) return;

    paletteDropHandledRef.current = true;
    paletteDragRef.current = null;
    setIsPaletteDragging(false);
    placePaletteDrop(event.clientX, event.clientY, drag);
  }, [placePaletteDrop]);

  const handlePaletteDropRef = useRef(handlePaletteDrop);
  handlePaletteDropRef.current = handlePaletteDrop;

  /** Keep dragover/drop listeners mounted so the first dragover is never missed. */
  useEffect(() => {
    const onDragOver = (event: DragEvent) => {
      if (!isPaletteDragEvent(event.dataTransfer) && !paletteDragRef.current) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
    };

    const onDrop = (event: DragEvent) => {
      if (!isPaletteDragEvent(event.dataTransfer) && !paletteDragRef.current) return;
      handlePaletteDropRef.current(event, { requireCanvasBounds: true });
    };

    document.addEventListener("dragover", onDragOver);
    document.addEventListener("drop", onDrop);
    return () => {
      document.removeEventListener("dragover", onDragOver);
      document.removeEventListener("drop", onDrop);
    };
  }, []);

  const removeIds = (ids: string[]) => {
    if (ids.length === 0) return;
    const removeSet = new Set(ids);
    commitInstances(instancesRef.current.filter((i) => !removeSet.has(i.id)));
    setSelectedIds((prev) => prev.filter((id) => !removeSet.has(id)));
  };

  const clearEditor = () => {
    if (instancesRef.current.length === 0) return;
    if (
      !window.confirm(
        "Clear the artboard? This removes all blocks. You can undo with Ctrl+Z.",
      )
    ) {
      return;
    }
    commitInstances([]);
    setSelectedIds([]);
    setCodeDetached(false);
    setPageCode(EMPTY_PAGE_CODE);
    setPreviewError(null);
    setDownloadError(null);
    setDownloadOk(false);
  };

  const selectAll = () => setSelectedIds(instances.map((i) => i.id));

  const toggleLayerSelection = (id: string, shiftKey: boolean) => {
    setSelectedIds((prev) => {
      if (shiftKey) {
        return prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      }
      return [id];
    });
  };

  const copySelected = useCallback(() => {
    const toCopy = instancesRef.current.filter((i) => selectedSet.has(i.id));
    if (toCopy.length === 0) return;
    clipboardRef.current = toCopy.map((item) => {
      const layout = resolveLayout(item);
      return {
        slug: item.slug,
        x: layout.x,
        y: layout.y,
        width: layout.width,
        height: layout.height,
        ...(layout.heightAuto ? { heightAuto: true } : {}),
        ...(item.variantId ? { variantId: item.variantId } : {}),
        ...(item.variantProps ? { variantProps: item.variantProps } : {}),
      };
    });
    pasteCountRef.current = 0;
  }, [selectedSet]);

  const pasteClipboard = useCallback(() => {
    const clip = clipboardRef.current;
    if (clip.length === 0) return;
    pasteCountRef.current += 1;
    const offset = PASTE_NUDGE * pasteCountRef.current;
    const { added, newIds } = buildInstancesFromClipboard(
      clip,
      instancesRef.current,
      offset,
      offset,
    );
    commitInstances([...instancesRef.current, ...added]);
    setSelectedIds(newIds);
  }, [commitInstances]);

  const duplicateSelected = useCallback(() => {
    const toDup = instancesRef.current.filter((i) => selectedSet.has(i.id));
    if (toDup.length === 0) return;
    const clip: ClipboardItem[] = toDup.map((item) => {
      const layout = resolveLayout(item);
      return {
        slug: item.slug,
        x: layout.x,
        y: layout.y,
        width: layout.width,
        height: layout.height,
        ...(layout.heightAuto ? { heightAuto: true } : {}),
        ...(item.variantId ? { variantId: item.variantId } : {}),
        ...(item.variantProps ? { variantProps: item.variantProps } : {}),
      };
    });
    const { added, newIds } = buildInstancesFromClipboard(
      clip,
      instancesRef.current,
      24,
      24,
    );
    commitInstances([...instancesRef.current, ...added]);
    setSelectedIds(newIds);
  }, [selectedSet, commitInstances]);

  const bringSelectedToFront = () => {
    if (selectedIds.length === 0) return;
    const nextZ = getNextZ(instancesRef.current);
    const selected = new Set(selectedIds);
    commitInstances(
      instancesRef.current.map((item, index) =>
        selected.has(item.id) ? { ...item, zIndex: nextZ + index } : item,
      ),
    );
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }
      if ((mod && e.key === "y") || (mod && e.shiftKey && e.key === "z")) {
        e.preventDefault();
        redo();
        return;
      }
      if (mod && e.key === "a") {
        e.preventDefault();
        selectAll();
        return;
      }
      if (mod && e.key === "d") {
        e.preventDefault();
        duplicateSelected();
        return;
      }
      if (mod && e.key === "c") {
        if (selectedIds.length > 0) {
          e.preventDefault();
          copySelected();
        }
        return;
      }
      if (mod && e.key === "v") {
        if (clipboardRef.current.length > 0) {
          e.preventDefault();
          pasteClipboard();
        }
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedIds.length > 0 && editMode) {
          e.preventDefault();
          removeIds(selectedIds);
        }
      }
      if (e.key === "Escape") {
        setSelectedIds([]);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    undo,
    redo,
    selectedIds,
    editMode,
    duplicateSelected,
    selectAll,
    removeIds,
    copySelected,
    pasteClipboard,
  ]);

  const handleDownload = async () => {
    if (downloadBusy) return;
    setDownloadError(null);
    setDownloadOk(false);
    setDownloadBusy(true);
    try {
      const effectiveExportKind = framework === "vanilla" ? "library" : exportKind;
      const effectiveStack = effectiveExportKind === "scaffold" ? stack : null;

      let exportPageSource: PlaygroundPageSource | null = null;
      if (framework === "vanilla") {
        if (!codeDetached) {
          try {
            const syncRes = await fetch("/api/playground/page-source", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ instances }),
            });
            if (syncRes.ok) {
              exportPageSource = (await syncRes.json()) as PlaygroundPageSource;
              setPageCode(exportPageSource);
            }
          } catch {
            // fall back to cached page code below
          }
        }
        exportPageSource =
          exportPageSource ?? (pageCodeHasEdits(pageCode) ? pageCode : null);
      }

      const res = await fetch("/api/playground/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          instances,
          framework,
          exportKind: effectiveExportKind,
          stack: effectiveStack,
          ...(exportPageSource ? { pageSource: exportPageSource } : {}),
        }),
      });
      if (res.status === 403) {
        setDownloadError("pro");
        return;
      }
      if (!res.ok) {
        setDownloadError("other");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        effectiveExportKind === "scaffold" && effectiveStack
          ? `complib-playground-${effectiveStack}.zip`
          : `complib-playground-${framework}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setDownloadOk(true);
      window.setTimeout(() => setDownloadOk(false), 4000);
    } catch {
      setDownloadError("other");
    } finally {
      setDownloadBusy(false);
    }
  };

  const setFramework = (next: Framework) => {
    const p = new URLSearchParams(searchParams.toString());
    if (next === "vanilla") p.delete("framework");
    else p.set("framework", next);
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const downloadLabel =
    framework === "vanilla"
      ? "Vanilla"
      : exportKind === "scaffold"
        ? "Project"
        : "Source";

  const statusLabel =
    workbenchView === "code"
      ? codeDetached
        ? "Detached code"
        : "Page code"
      : selectedIds.length > 0
        ? `${selectedIds.length} selected`
        : editMode
          ? "Layout mode"
          : "Preview mode";

  const selectedName =
    selectedIds.length === 1
      ? catalogBySlug.get(
          instances.find((i) => i.id === selectedIds[0])?.slug ?? "",
        )?.name
      : null;

  const selectedInstance =
    selectedIds.length === 1
      ? instances.find((i) => i.id === selectedIds[0]) ?? null
      : null;

  const selectedVariantList = selectedInstance
    ? (catalogBySlug.get(selectedInstance.slug)?.variants ?? []) as ComponentVariant[]
    : [];

  const selectedVariantSelection = selectedInstance
    ? instanceVariantSelection(selectedInstance, selectedVariantList)
    : { props: {} };

  const setSelectedInstanceVariant = (selection: VariantSelection) => {
    if (!selectedInstance) return;
    const next = instancesRef.current.map((inst) =>
      inst.id === selectedInstance.id
        ? {
            ...inst,
            variantId: selection.presetId,
            variantProps: { ...selection.props },
          }
        : inst,
    );
    commitInstances(next);
  };

  const setSelectedInstanceLayout = (patch: {
    width?: number;
    height?: number;
    heightAuto?: boolean;
  }) => {
    if (!selectedInstance) return;
    const next = instancesRef.current.map((inst) =>
      inst.id === selectedInstance.id ? { ...inst, ...patch } : inst,
    );
    commitInstances(next);
  };

  const showInspector = workbenchView === "canvas" && !!selectedInstance;

  const sidebarCollapsed = useSyncExternalStore(
    subscribeBuilderSidebarCollapsed,
    getBuilderSidebarCollapsed,
    () => false,
  );

  const workspaceClass =
    sidebarCollapsed && sidebarTab === "library"
      ? `${pg.workspace} ${pg.workspaceSidebarCollapsed}`
      : pg.workspace;

  const [upgradeNotice, setUpgradeNotice] = useState(false);

  useEffect(() => {
    if (searchParams.get("upgraded") !== "1") return;
    setUpgradeNotice(true);
    const next = new URLSearchParams(searchParams.toString());
    next.delete("upgraded");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    const timer = window.setTimeout(() => setUpgradeNotice(false), 6000);
    return () => window.clearTimeout(timer);
  }, [pathname, router, searchParams]);

  return (
    <div className={pg.workbench}>
      {upgradeNotice ? (
        <p className={`${pg.alertBanner} border-accent/30 bg-accent/10 text-foreground`} role="status">
          Welcome to Pro — source, downloads, and scaffolds are unlocked on your account.
        </p>
      ) : null}
      <header className={pg.commandBar}>
        <div className={pg.commandBarLeft}>
          <PlaygroundSegmented
            aria-label="Workbench view"
            options={[
              { value: "canvas", label: "Canvas" },
              { value: "code", label: "Page code" },
            ]}
            value={workbenchView}
            onChange={(v) => {
              setWorkbenchView(v);
              if (v === "code" && framework === "vanilla" && !codeDetached) {
                void syncPageCodeFromCanvas();
              }
              if (v === "canvas") {
                setPreviewError(null);
                setEditMode(true);
              }
            }}
          />
          <ToolbarDivider />
          <PlaygroundSegmented
            aria-label="Output framework"
            options={[
              { value: "vanilla", label: "Vanilla" },
              { value: "react", label: "React" },
              { value: "vue", label: "Vue" },
            ]}
            value={framework}
            onChange={setFramework}
          />
          {framework !== "vanilla" ? (
            <>
              <PlaygroundSegmented
                aria-label="Export type"
                size="sm"
                options={[
                  { value: "library", label: "Source" },
                  { value: "scaffold", label: "Runnable" },
                ]}
                value={exportKind}
                onChange={setExportKind}
              />
              {exportKind === "scaffold" ? (
                <select
                  value={stack}
                  onChange={(e) =>
                    setStack(
                      e.target.value as "vite-react" | "vite-vue" | "next-app",
                    )
                  }
                  className={pg.select}
                  aria-label="Project stack"
                >
                  {framework === "react" ? (
                    <>
                      <option value="vite-react">Vite + React</option>
                      <option value="next-app">Next.js App</option>
                    </>
                  ) : (
                    <option value="vite-vue">Vite + Vue</option>
                  )}
                </select>
              ) : null}
            </>
          ) : null}
        </div>

        <div className={pg.commandBarCenter}>
          <PlaygroundStatusPill>
            <span className={pg.statusDot} aria-hidden />
            {instances.length} block{instances.length === 1 ? "" : "s"}
          </PlaygroundStatusPill>
          <PlaygroundStatusPill>{statusLabel}</PlaygroundStatusPill>
          {selectedName && !showInspector ? (
            <PlaygroundStatusPill variant="accent">{selectedName}</PlaygroundStatusPill>
          ) : showInspector ? (
            <PlaygroundStatusPill variant="accent">Editing block</PlaygroundStatusPill>
          ) : null}
        </div>

        <div className={pg.commandBarRight}>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloadBusy || instances.length === 0}
            className={pg.btnPrimary}
          >
            <IconDownload />
            {downloadBusy ? "Preparing…" : `Download ${downloadLabel}`}
          </button>
        </div>
      </header>

      {workbenchView === "canvas" ? (
        <div className={pg.subToolbar}>
          <div className={pg.subToolbarGroup}>
            <PlaygroundIconButton label="Undo (Ctrl+Z)" onClick={undo} disabled={!canUndo}>
              <IconUndo />
            </PlaygroundIconButton>
            <PlaygroundIconButton label="Redo (Ctrl+Y)" onClick={redo} disabled={!canRedo}>
              <IconRedo />
            </PlaygroundIconButton>
            <ToolbarDivider />
            <button
              type="button"
              onClick={() => setEditMode((v) => !v)}
              className={editMode ? pg.btnEditOn : pg.btnEditOff}
            >
              {editMode ? "Layout" : "Interact"}
            </button>
            <button
              type="button"
              onClick={duplicateSelected}
              disabled={selectedIds.length === 0}
              className={`${pg.btnGhost} ${showInspector ? "hidden" : ""}`}
            >
              Duplicate
            </button>
            {selectedIds.length > 0 && !showInspector ? (
              <button type="button" onClick={bringSelectedToFront} className={pg.btnGhost}>
                Bring forward
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => removeIds(selectedIds)}
              disabled={selectedIds.length === 0}
              className={`${pg.btnDanger} ${showInspector ? "hidden" : ""}`}
            >
              Delete
            </button>
            <button
              type="button"
              onClick={clearEditor}
              disabled={instances.length === 0}
              className={pg.btnGhost}
            >
              Clear
            </button>
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">
            {EDITOR_WIDTH} × {pageCode.editorHeight || editorHeight}px ·{" "}
            {artboardZoom === "fit"
              ? "fit view"
              : `${artboardZoom}%`}
          </span>
        </div>
      ) : null}

      {downloadOk ? (
        <p className={`${pg.alertBanner} border-accent/30 bg-accent/10 text-foreground`} role="status">
          Bundle downloaded — open the ZIP and start from <code className="font-mono text-[11px]">index.html</code>{" "}
          or the framework entry. Layout is document flow (canvas top→bottom).
        </p>
      ) : null}
      {downloadError === "pro" ? (
        <p className={`${pg.alertBanner} ${pg.alertPro}`}>
          Pro required to download bundles with Pro components.{" "}
          <Link href="/pricing" className="font-semibold underline">
            View pricing
          </Link>
        </p>
      ) : null}
      {downloadError === "other" ? (
        <p className={`${pg.alertBanner} ${pg.alertError}`}>
          Download failed. Please try again.
        </p>
      ) : null}

      <div className={workspaceClass}>
        <aside className={pg.sidebar}>
          <div className={pg.sidebarTabs} role="tablist" aria-label="Sidebar panels">
            <button
              type="button"
              role="tab"
              aria-selected={sidebarTab === "library"}
              onClick={() => setSidebarTab("library")}
              className={`${pg.sidebarTab} ${
                sidebarTab === "library" ? pg.sidebarTabActive : pg.sidebarTabIdle
              }`}
            >
              {sidebarCollapsed ? "+" : "Insert"}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={sidebarTab === "layers"}
              onClick={() => setSidebarTab("layers")}
              className={`${pg.sidebarTab} ${
                sidebarTab === "layers" ? pg.sidebarTabActive : pg.sidebarTabIdle
              }`}
            >
              {sidebarCollapsed ? "◫" : `Layers${instances.length > 0 ? ` · ${instances.length}` : ""}`}
              {showInspector ? (
                <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
              ) : null}
            </button>
          </div>

          {sidebarTab === "library" ? (
            <PlaygroundLibraryRail
              catalog={catalog}
              catalogError={catalogError}
              onAdd={addWithStyle}
              onDragStart={handlePaletteDragStart}
              onDragEnd={handlePaletteDragEnd}
            />
          ) : (
            <div className={pg.sidebarScroll}>
              {instances.length === 0 ? (
                <div className={pg.emptyState}>
                  <p className="text-sm font-medium text-foreground">No layers yet</p>
                  <p className="mt-1 text-xs">
                    Add components from Insert, then fine-tune in Properties.
                  </p>
                </div>
              ) : (
                <ul className="space-y-1 px-1 pb-2">
                  {[...instances]
                    .sort((a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0))
                    .map((inst, index) => {
                      const meta = catalogBySlug.get(inst.slug);
                      const active = selectedSet.has(inst.id);
                      const variantSummary =
                        inst.variantProps && Object.keys(inst.variantProps).length > 0
                          ? formatVariantLabel(inst.variantProps)
                          : inst.variantId ?? null;
                      return (
                        <li key={inst.id}>
                          <button
                            type="button"
                            onClick={(e) => toggleLayerSelection(inst.id, e.shiftKey)}
                            className={`${pg.layerBtn} ${
                              active ? pg.layerBtnActive : pg.layerBtnIdle
                            } ${active && showInspector ? "border-l-2 border-l-accent pl-1.5" : ""}`}
                          >
                            <span className={pg.layerIndex}>{index + 1}</span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-xs font-medium">
                                {meta?.name ?? inst.slug}
                              </span>
                              {variantSummary ? (
                                <span className={pg.layerChip}>{variantSummary}</span>
                              ) : (
                                <span className="text-[10px] text-muted-foreground">
                                  Default style
                                </span>
                              )}
                            </span>
                            <span className="shrink-0 font-mono text-[9px] text-muted-foreground/70">
                              z{inst.zIndex ?? 1}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>
          )}
        </aside>

        <section className={pg.main}>
          <PlaygroundPanel
            hideHeader={workbenchView === "canvas"}
            title={workbenchView === "canvas" ? "Canvas" : "Page code"}
            subtitle={
              workbenchView === "code"
                ? "Export-ready source — stacked in document flow from canvas order. Customize here, then Download."
                : undefined
            }
          >
            {workbenchView === "code" && framework !== "vanilla" ? (
              <div className={pg.emptyState}>
                <p className="text-sm font-medium text-foreground">Page code is Vanilla-only</p>
                <p className="mt-2 max-w-sm text-xs leading-relaxed">
                  Switch to Vanilla to edit merged HTML, CSS, and JS here. For React or
                  Vue, use Download and edit in your IDE.
                </p>
              </div>
            ) : workbenchView === "code" ? (
              <div className={pg.codeSplit}>
                <PageCodePanel
                  source={pageCode}
                  codeDetached={codeDetached}
                  activeTab={pageCodeTab}
                  onTabChange={setPageCodeTab}
                  onChange={onPageCodeChange}
                  onResetFromCanvas={resetPageCodeFromCanvas}
                  loading={pageCodeLoading}
                />
                <PlaygroundArtboardViewport
                  width={EDITOR_WIDTH}
                  height={pageCode.editorHeight || editorHeight}
                  label="Live preview"
                  zoom={artboardZoom}
                  onZoomChange={setArtboardZoom}
                  onScaleChange={(s) => {
                    artboardScaleRef.current = s;
                  }}
                >
                  <iframe
                    key="page-code-preview"
                    title="Page code preview"
                    sandbox="allow-scripts"
                    className="block w-full"
                    style={{
                      width: EDITOR_WIDTH,
                      height: pageCode.editorHeight || editorHeight,
                    }}
                    srcDoc={codePreviewHtml}
                  />
                </PlaygroundArtboardViewport>
              </div>
            ) : (
              <div ref={canvasDropZoneRef} className={pg.canvasBody}>
                <PlaygroundArtboardViewport
                  width={EDITOR_WIDTH}
                  height={editorHeight}
                  label="Artboard"
                  zoom={artboardZoom}
                  onZoomChange={setArtboardZoom}
                  onScaleChange={(s) => {
                    artboardScaleRef.current = s;
                  }}
                  emptyState={
                    instances.length === 0 && !previewError ? (
                      <div className={pg.canvasEmptyCard}>
                        <p className="font-display text-base font-semibold text-foreground">
                          Start from a starter — or build freeform
                        </p>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          Drop a ready layout onto the artboard, then swap variants in
                          Properties. Or add components one-by-one from Insert.
                        </p>
                        <div className="pointer-events-auto mt-4 grid gap-2">
                          {PLAYGROUND_STARTERS.map((starter) => {
                            const available = starter.slugs.filter((s) =>
                              catalogBySlug.has(s),
                            ).length;
                            if (available === 0) return null;
                            return (
                              <button
                                key={starter.id}
                                type="button"
                                onClick={() => applyStarter(starter.id)}
                                className="rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-left transition-colors hover:border-accent/40 hover:bg-accent/10"
                              >
                                <span className="block text-xs font-semibold text-foreground">
                                  {starter.name}
                                </span>
                                <span className="mt-0.5 block text-[10px] text-muted-foreground">
                                  {starter.description}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        {catalog && catalog.length > 0 ? (
                          <div className="pointer-events-auto mt-3 flex flex-wrap justify-center gap-2 border-t border-border/60 pt-3">
                            {PLAYGROUND_QUICK_INSERT.map((slug) => {
                              const item = catalogBySlug.get(slug);
                              if (!item) return null;
                              return (
                                <button
                                  key={slug}
                                  type="button"
                                  onClick={() => addAutoGrid(slug)}
                                  className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-accent/40 hover:bg-accent/10"
                                >
                                  + {item.name}
                                </button>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    ) : undefined
                  }
                  overlay={
                    isPaletteDragging ? (
                      <div
                        className="pointer-events-none absolute inset-0 z-20 bg-accent/10 ring-2 ring-inset ring-accent/50"
                      >
                        <div className={pg.dropOverlay}>Release to place component</div>
                      </div>
                    ) : null
                  }
                >
                  <iframe
                    ref={canvasIframeRef}
                    title="Playground sandbox"
                    sandbox="allow-scripts"
                    className="block w-full"
                    style={{
                      width: EDITOR_WIDTH,
                      height: editorHeight,
                      pointerEvents: isPaletteDragging ? "none" : "auto",
                    }}
                    srcDoc={canvasPreviewHtml || undefined}
                    onLoad={() => {
                      postEditMode(editMode);
                      postSelection(selectedIds);
                      postToCanvas({
                        type: "complib:apply-layout",
                        layouts: instanceLayoutPayload(instancesRef.current),
                        editorHeight,
                      });
                      postToCanvas({ type: "complib:measure-request" });
                    }}
                  />
                </PlaygroundArtboardViewport>

                {codeDetached || previewError ? (
                  <div className={pg.canvasAlertStack}>
                    {codeDetached ? (
                      <p className={`${pg.canvasAlertToast} ${pg.alertPro}`}>
                        Page code is detached. Layout edits won&apos;t sync until you reset.{" "}
                        <button
                          type="button"
                          className="font-semibold underline"
                          onClick={() => setWorkbenchView("code")}
                        >
                          Open page code
                        </button>
                      </p>
                    ) : null}
                    {previewError ? (
                      <p className={`${pg.canvasAlertToast} ${pg.alertError}`}>
                        {previewError}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )}
            {workbenchView === "code" && previewError ? (
              <p className={`${pg.alertBanner} ${pg.alertError}`}>{previewError}</p>
            ) : null}
          </PlaygroundPanel>

          {workbenchView === "code" ? (
            <footer className={pg.footerHint}>
              <span className="hidden lg:inline">
                Page code matches Download — document flow from canvas order · Reset to re-sync · Ctrl+Z/Y
                undo/redo
              </span>
              <span className="hidden sm:inline lg:hidden">
                Matches Download · Reset to sync · Ctrl+Z/Y undo/redo
              </span>
              <span className="sm:hidden">Page code view — switch to Canvas to edit layout</span>
            </footer>
          ) : (
            <footer className={pg.footerHint}>
              <span className="hidden lg:inline">
                Drag from Insert · Drop on artboard · Ctrl+Z/Y undo · Ctrl+D duplicate · Delete removes ·
                Download exports production page flow
              </span>
              <span className="hidden sm:inline lg:hidden">
                Drop to place · Ctrl+Z/Y · Download = page flow
              </span>
              <span className="sm:hidden">Insert → canvas · Download for production files</span>
            </footer>
          )}

          {showInspector ? (
            <button
              type="button"
              className={pg.inspectorBackdrop}
              onClick={() => setSelectedIds([])}
              aria-label="Close properties panel"
            />
          ) : null}

          {showInspector && selectedInstance ? (
            <PlaygroundInspector
              name={catalogBySlug.get(selectedInstance.slug)?.name ?? selectedInstance.slug}
              slug={selectedInstance.slug}
              tier={catalogBySlug.get(selectedInstance.slug)?.tier}
              layer={catalogBySlug.get(selectedInstance.slug)?.layer}
              category={catalogBySlug.get(selectedInstance.slug)?.category}
              variants={selectedVariantList}
              selection={selectedVariantSelection}
              layout={{
                width: resolveLayout(selectedInstance).width,
                height: resolveLayout(selectedInstance).height,
                heightAuto: resolveLayout(selectedInstance).heightAuto,
              }}
              onChange={setSelectedInstanceVariant}
              onLayoutChange={setSelectedInstanceLayout}
              onDuplicate={duplicateSelected}
              onDelete={() => removeIds([selectedInstance.id])}
              onBringForward={bringSelectedToFront}
              onDeselect={() => setSelectedIds([])}
            />
          ) : null}
        </section>
      </div>
    </div>
  );
}
