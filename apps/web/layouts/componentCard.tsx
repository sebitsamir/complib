"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useState, useSyncExternalStore } from "react";
import LibraryCardVariantPicker, {
  libraryCardHasVariantPicker,
} from "@/components/library/LibraryCardVariantPicker";
import { IconFavorites } from "@/components/library/library-layer-icons";
import { useLazyVisible } from "@/components/library/use-lazy-visible";
import type { Component } from "@/lib/component-store";
import {
  isFavoriteSlug,
  subscribeLibraryPersistence,
  toggleFavoriteSlug,
} from "@/lib/library-persistence";
import { categoryLabelForLayer, layerNavMeta } from "@/lib/library-nav-shared";
import {
  applyVariantProps,
  buildPreviewUrlFromSelection,
  selectionFromVariantId,
} from "@/lib/variant-props";
import {
  getDefaultVariantId,
  selectionToQuery,
  type LibraryStyleOption,
  type VariantSelection,
} from "@/lib/variant-utils";

type Framework = "vanilla" | "react" | "vue";
type Tab = "preview" | "html" | "css" | "js" | "component" | "tailwind" | "runtime";

const VANILLA_TABS: Tab[] = ["preview", "html", "css", "js"];
const PANEL_HEIGHT = "min-h-[280px] h-[min(320px,42vh)] sm:min-h-[300px]";

function buildSrcDoc(html: string, css: string, js: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{
  display:flex;
  align-items:center;
  justify-content:center;
  min-height:100vh;
  padding:16px;
  background:#06060b;
}
${css}
</style>
</head>
<body>${html}<script>${js}<\/script></body>
</html>`;
}

function LockedSourcePanel() {
  return (
    <div
      className={`flex ${PANEL_HEIGHT} w-full flex-col items-center justify-center gap-3 bg-muted/30 p-6 text-center`}
    >
      <p className="max-w-xs text-sm text-muted-foreground">
        Source is available on Pro. Preview is free for everyone.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Link
          href="/sign-in"
          className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground hover:opacity-90"
        >
          Sign in
        </Link>
        <Link
          href="/pricing"
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:border-accent/40"
        >
          View Pro
        </Link>
      </div>
    </div>
  );
}

type Props = {
  component: Component;
  codeLocked: boolean;
  framework: Framework;
  /** Override title link (e.g. explorer drill-down). Defaults to detail page. */
  titleHref?: string;
  /** When set, "Add to canvas" calls this instead of navigating to playground. */
  onAddToPlayground?: (style: LibraryStyleOption) => void;
};

export default function ComponentCard({
  component,
  codeLocked,
  framework,
  titleHref,
  onAddToPlayground,
}: Props) {
  const previewId = useId();
  const [tab, setTab] = useState<Tab>("preview");
  const variants = component.variants ?? [];
  const layerMeta = layerNavMeta(component.layer);
  const favorited = useSyncExternalStore(
    subscribeLibraryPersistence,
    () => isFavoriteSlug(component.slug),
    () => false,
  );

  const defaultSelection = useMemo(() => {
    const defaultVariantId = getDefaultVariantId(variants);
    return selectionFromVariantId(variants, defaultVariantId);
  }, [variants]);
  const [selection, setSelection] = useState<VariantSelection>(defaultSelection);

  useEffect(() => {
    setSelection(defaultSelection);
  }, [component.slug, defaultSelection]);

  const [html, setHtml] = useState(component.html);
  const [css, setCss] = useState(component.css);
  const [js, setJs] = useState(component.js);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [frameworkSource, setFrameworkSource] = useState<Record<string, string> | null>(null);
  const [sourceError, setSourceError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { ref: previewRef, visible: previewVisible } = useLazyVisible({
    disabled: tab !== "preview",
    rootMargin: "160px",
  });

  useEffect(() => {
    if (framework === "vanilla" || codeLocked) return;
    const controller = new AbortController();
    fetch(
      `/api/components/${encodeURIComponent(component.slug)}/source?framework=${encodeURIComponent(framework)}`,
      { credentials: "include", signal: controller.signal },
    )
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(
            typeof (data as { error?: string }).error === "string"
              ? (data as { error: string }).error
              : "Failed to load source",
          );
        }
        return data as { files?: Record<string, string> };
      })
      .then((data) => {
        setFrameworkSource(data.files ?? null);
        setSourceError(null);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setFrameworkSource(null);
        setSourceError(err instanceof Error ? err.message : "Failed to load source");
      });
    return () => controller.abort();
  }, [component.slug, framework, codeLocked]);

  const isDirty =
    framework === "vanilla" &&
    !codeLocked &&
    (html !== component.html || css !== component.css || js !== component.js);

  const variantAppliedHtml = useMemo(
    () => applyVariantProps(html, selection.props),
    [html, selection.props],
  );

  const iframeSrc = useMemo(
    () => buildSrcDoc(variantAppliedHtml, css, js),
    [variantAppliedHtml, css, js],
  );

  const previewIframeSrc = useMemo(
    () => buildPreviewUrlFromSelection(component.slug, variants, selection),
    [component.slug, variants, selection],
  );

  const showVariantPicker = libraryCardHasVariantPicker(variants);
  const componentDetailHref = `/components/${component.slug}`;
  const componentTitleHref = titleHref ?? componentDetailHref;

  const buildPageHref = useMemo(() => {
    const params = new URLSearchParams();
    params.set("add", component.slug);
    params.set("framework", framework);
    const query = selectionToQuery(selection);
    for (const [key, value] of Object.entries(query)) {
      if (value) params.set(key, value);
    }
    return `/playground?${params.toString()}`;
  }, [component.slug, framework, selection]);

  const resetToDefault = useCallback(() => {
    setHtml(component.html);
    setCss(component.css);
    setJs(component.js);
  }, [component.html, component.css, component.js]);

  const handleDownload = async () => {
    if (isDownloading) return;
    setDownloadError(null);
    setIsDownloading(true);
    try {
      const variantQuery = selectionToQuery(selection);
      const params = new URLSearchParams({ framework });
      for (const [key, value] of Object.entries(variantQuery)) {
        if (value) params.set(key, value);
      }
      const dirtyVanilla = framework === "vanilla" && !codeLocked && isDirty;
      const res = dirtyVanilla
        ? await fetch(`/api/components/${encodeURIComponent(component.slug)}/download`, {
            method: "POST",
            credentials: "include",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              framework,
              ...variantQuery,
              overrides: { html, css, js },
            }),
          })
        : await fetch(
            `/api/components/${encodeURIComponent(component.slug)}/download?${params.toString()}`,
            { credentials: "include" },
          );
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
      const safe = component.slug.replace(/[^a-z0-9-_]/gi, "_") || "component";
      a.download = `${safe}-complib.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setDownloadError("other");
    } finally {
      setIsDownloading(false);
    }
  };

  const dynamicTabs = useMemo(() => {
    if (framework === "vanilla") return VANILLA_TABS;
    const tabs: Tab[] = ["preview", "component"];
    if (frameworkSource && Object.keys(frameworkSource).some((k) => k.endsWith("tailwind.ts"))) {
      tabs.push("tailwind");
    }
    tabs.push("css", "runtime");
    return tabs;
  }, [framework, frameworkSource]);

  const editorValue = useMemo(() => {
    if (framework === "vanilla") {
      return tab === "html" ? html : tab === "css" ? css : tab === "js" ? js : "";
    }
    if (!frameworkSource) return "";
    if (framework === "react") {
      if (tab === "component") return frameworkSource["Component.tsx"] ?? "";
      if (tab === "tailwind")
        return frameworkSource["tailwind.ts"] ?? frameworkSource["src/tailwind.ts"] ?? "";
      if (tab === "css")
        return (
          frameworkSource["styles.css"] ??
          frameworkSource["vanilla.css"] ??
          frameworkSource["src/styles.css"] ??
          ""
        );
      if (tab === "runtime")
        return (
          frameworkSource["runtime.ts"] ??
          frameworkSource["runtime.js"] ??
          frameworkSource["src/runtime.ts"] ??
          ""
        );
      return "";
    }
    if (tab === "component") return frameworkSource["Component.vue"] ?? "";
    if (tab === "tailwind")
      return frameworkSource["tailwind.ts"] ?? frameworkSource["src/tailwind.ts"] ?? "";
    if (tab === "css")
      return (
        frameworkSource["styles.css"] ??
        frameworkSource["vanilla.css"] ??
        frameworkSource["src/styles.css"] ??
        ""
      );
    if (tab === "runtime")
      return (
        frameworkSource["runtime.ts"] ??
        frameworkSource["runtime.js"] ??
        frameworkSource["src/runtime.ts"] ??
        ""
      );
    return "";
  }, [framework, frameworkSource, tab, html, css, js]);

  const tabLabels: Record<Framework, Record<Tab, string>> = {
    vanilla: {
      preview: "Preview",
      html: "HTML",
      css: "CSS",
      js: "JS",
      component: "Component",
      tailwind: "Tailwind",
      runtime: "Runtime",
    },
    react: {
      preview: "Preview",
      html: "HTML",
      css: "CSS",
      js: "JS",
      component: "React",
      tailwind: "Tailwind",
      runtime: "Runtime",
    },
    vue: {
      preview: "Preview",
      html: "HTML",
      css: "CSS",
      js: "JS",
      component: "Vue",
      tailwind: "Tailwind",
      runtime: "Runtime",
    },
  };

  const setEditorValue = (v: string) => {
    if (codeLocked || framework !== "vanilla") return;
    if (tab === "html") setHtml(v);
    else if (tab === "css") setCss(v);
    else if (tab === "js") setJs(v);
  };

  const copyEditorValue = useCallback(async () => {
    if (tab === "preview" || codeLocked) return;
    try {
      await navigator.clipboard.writeText(editorValue);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }, [codeLocked, editorValue, tab]);

  const statusNote =
    isDirty && tab === "preview"
      ? "Preview edits included in download"
      : codeLocked && tab === "preview"
        ? "Pro unlocks source"
        : framework !== "vanilla" && tab !== "preview"
          ? "Authoring source · export may differ"
          : null;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="border-b border-border/60 px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {onAddToPlayground ? (
                <button
                  type="button"
                  onClick={() =>
                    onAddToPlayground({
                      id: selection.presetId ?? "default",
                      label: selection.presetId ?? "Standard",
                      props: { ...selection.props },
                      presetId: selection.presetId,
                    })
                  }
                  className="truncate text-left text-sm font-semibold text-foreground hover:text-accent "
                >
                  {component.name}
                </button>
              ) : (
                <Link
                  href={componentTitleHref}
                  className="truncate text-sm font-semibold text-foreground hover:text-accent "
                >
                  {component.name}
                </Link>
              )}
              {component.tier !== "FREE" ? (
                <span className="shrink-0 rounded bg-amber-400/90 px-1.5 py-px text-[9px] font-bold uppercase text-black">
                  Pro
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => toggleFavoriteSlug(component.slug)}
                className={`ml-auto shrink-0 rounded-md p-1.5 transition-colors ${
                  favorited
                    ? "text-amber-500 hover:bg-amber-500/10"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                title={favorited ? "Remove from favorites" : "Add to favorites"}
                aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
                aria-pressed={favorited}
              >
                <IconFavorites className="h-3.5 w-3.5" filled={favorited} />
              </button>
            </div>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              <span className={layerMeta.accent}>{layerMeta.label}</span>
              <span className="mx-1 text-border">·</span>
              {categoryLabelForLayer(component.layer, component.category)}
            </p>
          </div>
        </div>
        {showVariantPicker ? (
          <LibraryCardVariantPicker
            variants={variants}
            selection={selection}
            onChange={setSelection}
          />
        ) : null}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-border/60 px-2 py-1.5 [scrollbar-width:none]">
        {dynamicTabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              tab === t
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {tabLabels[framework][t]}
          </button>
        ))}
        {tab !== "preview" && !codeLocked ? (
          <button
            type="button"
            onClick={copyEditorValue}
            className="ml-auto shrink-0 rounded-md px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        ) : null}
      </div>

      {/* Content */}
      <div className="flex-1 bg-muted/20 dark:bg-[#06060b]/50">
        {tab === "preview" ? (
          <div ref={previewRef} className={`relative ${PANEL_HEIGHT} w-full`}>
            {previewVisible ? (
              codeLocked ? (
                <iframe
                  id={previewId}
                  src={previewIframeSrc}
                  className="h-full w-full border-0"
                  sandbox="allow-scripts allow-same-origin"
                  title={`Preview: ${component.name}`}
                  loading="lazy"
                />
              ) : (
                <iframe
                  id={previewId}
                  srcDoc={iframeSrc}
                  className="h-full w-full border-0"
                  sandbox="allow-scripts"
                  title={`Preview: ${component.name}`}
                  loading="lazy"
                />
              )
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                Loading preview…
              </div>
            )}
          </div>
        ) : codeLocked ? (
          <LockedSourcePanel />
        ) : framework !== "vanilla" && !frameworkSource && !sourceError ? (
          <div
            className={`flex ${PANEL_HEIGHT} items-center justify-center text-xs text-muted-foreground`}
          >
            Loading {framework} source…
          </div>
        ) : framework !== "vanilla" && sourceError ? (
          <div
            className={`flex ${PANEL_HEIGHT} items-center justify-center p-4 text-center text-xs text-red-600 dark:text-rose-300`}
          >
            {sourceError}
          </div>
        ) : (
          <textarea
            value={editorValue}
            onChange={(e) => setEditorValue(e.target.value)}
            readOnly={framework !== "vanilla"}
            spellCheck={false}
            className={`${PANEL_HEIGHT} w-full resize-none border-0 bg-transparent p-3 font-mono text-[12px] leading-relaxed text-foreground outline-none focus:ring-2 focus:ring-inset focus:ring-accent/20`}
            aria-label={`Edit ${tab}`}
          />
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border/60 bg-muted/20 px-3 py-2.5">
        {statusNote ? (
          <p className="mb-2 text-[10px] text-muted-foreground">{statusNote}</p>
        ) : null}
        {downloadError === "pro" ? (
          <p className="mb-2 text-[10px] text-amber-700 dark:text-amber-300">
            Pro required to download.{" "}
            <Link href="/pricing" className="underline">
              Pricing
            </Link>
          </p>
        ) : null}
        {downloadError === "other" ? (
          <p className="mb-2 text-[10px] text-red-600 dark:text-red-300">
            Download failed. Please try again.
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          {titleHref ? (
            <Link
              href={componentDetailHref}
              className="rounded-md border border-border bg-background px-2.5 py-1.5 text-[11px] font-medium text-foreground hover:border-accent/40"
            >
              Full details
            </Link>
          ) : null}
          {onAddToPlayground ? (
            <button
              type="button"
              onClick={() =>
                onAddToPlayground({
                  id: selection.presetId ?? "default",
                  label: selection.presetId ?? "Standard",
                  props: { ...selection.props },
                  presetId: selection.presetId,
                })
              }
              className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-300"
            >
              Add to canvas
            </button>
          ) : (
            <Link
              href={buildPageHref}
              className="rounded-md border border-border bg-background px-2.5 py-1.5 text-[11px] font-medium text-foreground hover:border-emerald-500/40"
            >
              Build page
            </Link>
          )}
          {!codeLocked && framework === "vanilla" && isDirty ? (
            <button
              type="button"
              onClick={resetToDefault}
              className="rounded-md px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Reset edits
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className={`ml-auto rounded-md px-3 py-1.5 text-[11px] font-semibold transition-colors ${
              isDownloading
                ? "cursor-wait bg-muted text-muted-foreground"
                : "bg-accent text-accent-foreground hover:opacity-90"
            }`}
          >
            {isDownloading ? "Preparing…" : "Download"}
          </button>
        </div>
      </div>
    </article>
  );
}
