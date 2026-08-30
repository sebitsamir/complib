"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ComponentLayer, ComponentVariant } from "@/lib/component-fs";
import AdminCodePanel, { type CodeTab } from "@/components/admin/admin-code-panel";
import PlaygroundVariantPanel from "@/components/playground/playground-variant-panel";
import AdminVariantPacks from "@/components/admin/admin-variant-packs";
import {
  adm,
  AdminField,
  AdminPanel,
  AdminSection,
  AdminSegmented,
  AdminStatPill,
  layerAccent,
  layerChip,
} from "@/components/admin/admin-shell";
import {
  adminFormCanPublish,
  validateAdminForm,
  type AdminValidationIssue,
} from "@/lib/admin-validation";
import {
  renderFromSelection,
  selectionFromVariantId,
} from "@/lib/variant-props";
import {
  getDefaultVariantId,
  type VariantSelection,
} from "@/lib/variant-utils";
import {
  ALLOWED_PROBLEM_TAGS,
  getCategoriesForLayer,
  getCategoryDef,
} from "@/lib/taxonomy-defaults";
import { STYLE_FAMILY_DEFS } from "@/lib/style-navigation";
import { buildComponentContentPath, buildExplorerPlacementUrl, buildStyleVariantPath } from "@/lib/admin-form";

export type AdminFormState = {
  name: string;
  slug: string;
  description: string;
  html: string;
  css: string;
  js: string;
  layer: ComponentLayer;
  categorySlug: string;
  problemTags: string[];
  tier: "FREE" | "PRO";
  themes: Array<"light" | "dark" | "auto">;
  variants: ComponentVariant[];
  /** Visual style families for Explorer style browse (glass, modern, …). */
  styleFamilies: string[];
  /** Additional discovery tags beyond taxonomy + styles. */
  extraTags: string[];
  /** When set, form updates an existing component instead of creating. */
  editingSlug: string | null;
  /** Style folder being edited under variants/{id}/ */
  activeStyleId: string;
};

export type SaveState = {
  type: "idle" | "saving" | "success" | "error";
  message: string;
  publishedSlug?: string;
};

function formatProblemTag(tag: string) {
  return tag.replace(/^build-/, "").replace(/-/g, " ");
}

function titleCase(input: string) {
  return input
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function ValidationBanner({ issues }: { issues: AdminValidationIssue[] }) {
  const errors = issues.filter((i) => i.level === "error");
  const warns = issues.filter((i) => i.level === "warn");
  if (errors.length === 0 && warns.length === 0) {
    return (
      <div className={adm.statusOk} role="status">
        Ready to publish — all required checks passed.
      </div>
    );
  }
  return (
    <ul className="space-y-1.5 text-xs" role="list">
      {errors.map((issue, i) => (
        <li key={`e-${i}`} className={adm.checklistErr}>
          ✕ {issue.message}
        </li>
      ))}
      {warns.map((issue, i) => (
        <li key={`w-${i}`} className={adm.checklistWarn}>
          △ {issue.message}
        </li>
      ))}
    </ul>
  );
}

function AdminPreview({
  html,
  css,
  js,
  selection,
  slug,
}: {
  html: string;
  css: string;
  js: string;
  selection: VariantSelection;
  slug: string;
}) {
  const previewHtml = useMemo(() => renderFromSelection(html, selection), [html, selection]);

  return (
    <div className={adm.previewWell}>
      <div className="flex h-full min-h-[380px] flex-col p-3">
        <div className="mb-2 flex items-center gap-2 rounded-lg border border-border/60 bg-background px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-red-500/80" />
          <span className="h-2 w-2 rounded-full bg-amber-400/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
          <span className="ml-1 truncate font-mono text-[10px] text-muted-foreground">
            {slug || "preview"}
          </span>
        </div>
        <iframe
          title="Component preview"
          srcDoc={`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:28px 20px;background:#f8fafc}
${css}
</style>
</head>
<body>${previewHtml}<script>${js.replace(/<\/script/gi, "<\\/script")}<\/script></body>
</html>`}
          sandbox="allow-scripts"
          className="min-h-[300px] flex-1 w-full overflow-hidden rounded-xl border border-border/80 bg-[#f8fafc] shadow-inner"
        />
      </div>
    </div>
  );
}

export function AdminStudio({
  form,
  saveState,
  componentCount,
  draftSavedAt,
  onFormChange,
  onLayerChange,
  onCategoryChange,
  onToggleProblemTag,
  onTierChange,
  onLoadStarter,
  onVariantsChange,
  onStyleFamiliesChange,
  onActiveStyleChange,
  onSaveDraft,
  onSave,
  onResetAfterPublish,
  onBackToBrowse,
}: {
  form: AdminFormState;
  saveState: SaveState;
  componentCount: number;
  draftSavedAt: string | null;
  onFormChange: (
    field: keyof Pick<AdminFormState, "name" | "slug" | "description" | "html" | "css" | "js">,
    value: string,
  ) => void;
  onLayerChange: (layer: ComponentLayer) => void;
  onCategoryChange: (categorySlug: string) => void;
  onToggleProblemTag: (tag: string) => void;
  onTierChange: (tier: "FREE" | "PRO") => void;
  onLoadStarter: () => void;
  onVariantsChange: (variants: ComponentVariant[]) => void;
  onStyleFamiliesChange: (families: string[]) => void;
  onActiveStyleChange: (styleId: string) => void;
  onSaveDraft: () => void;
  onSave: () => void;
  onResetAfterPublish: () => void;
  onBackToBrowse?: () => void;
}) {
  const [codeTab, setCodeTab] = useState<CodeTab>("html");
  const validation = useMemo(() => validateAdminForm(form), [form]);
  const canPublish = adminFormCanPublish(form);
  const errorFields = new Set(
    validation.filter((i) => i.level === "error").map((i) => i.field),
  );

  const [previewSelection, setPreviewSelection] = useState<VariantSelection>(() =>
    selectionFromVariantId(
      form.variants,
      getDefaultVariantId(form.variants) ?? form.variants[0]?.id,
    ),
  );

  useEffect(() => {
    setPreviewSelection(
      selectionFromVariantId(
        form.variants,
        getDefaultVariantId(form.variants) ?? form.variants[0]?.id,
      ),
    );
  }, [form.variants]);

  const layerCategories = useMemo(() => getCategoriesForLayer(form.layer), [form.layer]);
  const selectedCategory = useMemo(
    () => getCategoryDef(form.layer, form.categorySlug),
    [form.layer, form.categorySlug],
  );

  const contentPath = buildComponentContentPath({
    layer: form.layer,
    categorySlug: form.categorySlug,
    slug: form.slug,
  });
  const styleVariantPath = buildStyleVariantPath(
    { layer: form.layer, categorySlug: form.categorySlug, slug: form.slug },
    form.activeStyleId || "default",
  );
  const styleIds = useMemo(() => {
    const ids = new Set<string>(["default"]);
    for (const family of form.styleFamilies) {
      if (family && family !== "standard") ids.add(family);
    }
    if (form.activeStyleId) ids.add(form.activeStyleId);
    return [...ids];
  }, [form.styleFamilies, form.activeStyleId]);

  const playgroundUrl = form.slug.trim()
    ? `/playground?add=${encodeURIComponent(form.slug.trim())}`
    : "/playground";

  return (
    <div className={adm.workbench}>
      {/* Command bar */}
      <header className={adm.commandBar}>
        <div className={adm.commandLeft}>
          <AdminStatPill>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
            {componentCount} published
          </AdminStatPill>
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${layerChip(form.layer)}`}>
            {form.layer}
          </span>
          <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">
            {form.categorySlug}
          </span>
          {draftSavedAt ? (
            <span className="text-[10px] text-muted-foreground">Draft · {draftSavedAt}</span>
          ) : null}
        </div>
        <div className={adm.commandRight}>
          {onBackToBrowse ? (
            <button type="button" onClick={onBackToBrowse} className={adm.btnSecondary}>
              ← Browse
            </button>
          ) : null}
          <button type="button" onClick={onLoadStarter} className={adm.btnSecondary}>
            Reset template
          </button>
          <button type="button" onClick={onSaveDraft} className={adm.btnSecondary}>
            Save draft
          </button>
          <Link href={playgroundUrl} className={adm.btnSecondary} target="_blank" rel="noreferrer">
            Test in playground
          </Link>
          <button
            type="button"
            onClick={onSave}
            disabled={saveState.type === "saving" || !canPublish}
            className={adm.btnPrimaryCompact}
          >
            {saveState.type === "saving" ? "Publishing…" : form.editingSlug ? "Save changes" : "Publish"}
          </button>
        </div>
      </header>

      {/* Success banner */}
      {saveState.type === "success" && saveState.publishedSlug ? (
        <div className="shrink-0 border-b border-emerald-500/20 bg-emerald-500/8 px-4 py-3 sm:px-6">
          <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
              {form.editingSlug ? "Updated" : "Published"}{" "}
              <span className="font-mono">{saveState.publishedSlug}</span> in the library.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={buildExplorerPlacementUrl({
                  layer: form.layer,
                  categorySlug: form.categorySlug,
                  slug: saveState.publishedSlug,
                })}
                className={adm.btnSecondary}
              >
                View in Explorer
              </Link>
              <Link
                href={`/components/${saveState.publishedSlug}`}
                className={adm.btnSecondary}
              >
                Public page
              </Link>
              <Link
                href={`/playground?add=${encodeURIComponent(saveState.publishedSlug)}`}
                className={adm.btnSecondary}
              >
                Open in playground
              </Link>
              <button type="button" onClick={onResetAfterPublish} className={adm.btnPrimaryCompact}>
                Create another
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {saveState.type === "error" ? (
        <div className={`mx-4 mt-3 sm:mx-6 ${adm.statusErr}`} role="alert">
          {saveState.message}
        </div>
      ) : null}

      <div className={adm.studioGrid}>
        {/* Editor column */}
        <div className={adm.studioEditor}>
          <AdminPanel
            title="Component setup"
            subtitle="Identity and library placement — same fields as component.json"
          >
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <AdminField label="Display name">
                  <input
                    value={form.name}
                    onChange={(e) => onFormChange("name", e.target.value)}
                    placeholder="Feature Card"
                    className={`${adm.input} ${errorFields.has("name") ? "border-red-500/50" : ""}`}
                  />
                </AdminField>
                <AdminField label="Slug" hint={form.editingSlug ? "Slug is fixed when editing" : contentPath}>
                  <input
                    value={form.slug}
                    onChange={(e) => onFormChange("slug", e.target.value)}
                    placeholder="feature-card"
                    readOnly={Boolean(form.editingSlug)}
                    className={`${adm.input} font-mono ${errorFields.has("slug") ? "border-red-500/50" : ""} ${form.editingSlug ? "cursor-not-allowed opacity-70" : ""}`}
                  />
                </AdminField>
              </div>
              <AdminField label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) => onFormChange("description", e.target.value)}
                  rows={2}
                  placeholder="One line about when builders should use this component."
                  className={`${adm.textarea} min-h-[64px] font-sans text-sm`}
                />
              </AdminField>
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <p className={adm.sectionTitle}>Access tier</p>
                  <div className="mt-2">
                    <AdminSegmented
                      aria-label="Plan tier"
                      value={form.tier}
                      onChange={onTierChange}
                      options={[
                        { value: "FREE", label: "Free" },
                        { value: "PRO", label: "Pro" },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </AdminPanel>

          <AdminPanel
            title="Taxonomy"
            subtitle="Layer, category, style families, and discovery — matches Explorer placement"
            badge={
              <span
                className={`rounded-lg border-l-[3px] px-2 py-0.5 text-[10px] font-bold uppercase ${layerAccent(form.layer)} bg-muted/40`}
              >
                {form.categorySlug}
              </span>
            }
          >
            <div className="space-y-5">
              <AdminSection title="Layer">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {(["primitives", "patterns", "sections", "templates"] as const).map((layer) => {
                    const active = form.layer === layer;
                    return (
                      <button
                        key={layer}
                        type="button"
                        onClick={() => onLayerChange(layer)}
                        className={`rounded-xl border px-3 py-2.5 text-left text-xs font-bold capitalize transition ${
                          active
                            ? `border-blue-500/30 bg-blue-500/5 ring-2 ring-blue-500/15 ${layerAccent(layer)} border-l-[3px]`
                            : "border-border/70 bg-muted/15 hover:bg-muted/30"
                        }`}
                      >
                        {layer}
                      </button>
                    );
                  })}
                </div>
              </AdminSection>
              <AdminSection title="Category">
                <div className="flex flex-wrap gap-1.5">
                  {layerCategories.map((category) => {
                    const active = form.categorySlug === category.slug;
                    return (
                      <button
                        key={category.slug}
                        type="button"
                        onClick={() => onCategoryChange(category.slug)}
                        className={`${adm.pill} ${active ? adm.pillActive : adm.pillIdle}`}
                      >
                        {category.label}
                      </button>
                    );
                  })}
                </div>
                {selectedCategory ? (
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Suggested: {selectedCategory.problemTags.map(formatProblemTag).join(", ")}
                  </p>
                ) : null}
              </AdminSection>
              <AdminSection title="Visual style families">
                <p className="mb-2 text-[11px] text-muted-foreground">
                  Each family creates a folder under <code className="text-foreground/80">variants/&#123;style&#125;/</code> with its own HTML, CSS, and JS.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {STYLE_FAMILY_DEFS.filter((f) => f.slug !== "standard").map((family) => {
                    const active = form.styleFamilies.includes(family.slug);
                    return (
                      <button
                        key={family.slug}
                        type="button"
                        onClick={() => {
                          const next = active
                            ? form.styleFamilies.filter((s) => s !== family.slug)
                            : [...form.styleFamilies, family.slug];
                          onStyleFamiliesChange(next);
                        }}
                        className={`${adm.pill} ${active ? adm.pillActive : adm.pillIdle}`}
                      >
                        {family.label}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3">
                  <p className={adm.sectionTitle}>Editing style variant</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {styleIds.map((styleId) => {
                      const active = form.activeStyleId === styleId;
                      const label =
                        STYLE_FAMILY_DEFS.find((entry) => entry.slug === styleId)?.label ??
                        titleCase(styleId);
                      return (
                        <button
                          key={styleId}
                          type="button"
                          onClick={() => onActiveStyleChange(styleId)}
                          className={`${adm.pill} ${active ? adm.pillActive : adm.pillIdle}`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 font-mono text-[10px] text-muted-foreground">{styleVariantPath}</p>
                </div>
              </AdminSection>
              <AdminSection title="Problem tags">
                <div className="flex flex-wrap gap-1.5">
                  {ALLOWED_PROBLEM_TAGS.map((tag) => {
                    const active = form.problemTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => onToggleProblemTag(tag)}
                        className={`${adm.pill} ${active ? adm.pillActive : adm.pillIdle}`}
                      >
                        {formatProblemTag(tag)}
                      </button>
                    );
                  })}
                </div>
              </AdminSection>
            </div>
          </AdminPanel>

          <AdminPanel
            title="Variants"
            subtitle="Token packs — same controls as playground Properties panel"
          >
            <AdminVariantPacks variants={form.variants} onChange={onVariantsChange} />
            {form.variants.length === 0 ? (
              <p className="mt-4 rounded-xl border border-dashed border-border/70 bg-muted/15 px-4 py-6 text-center text-xs text-muted-foreground">
                Enable at least one variant pack so builders can customize size, color, and spacing in the playground.
              </p>
            ) : (
              <p className="mt-3 text-[11px] text-muted-foreground">
                Use the preview panel on the right to test variant combinations before publishing.
              </p>
            )}
          </AdminPanel>

          <AdminPanel title="Source code" subtitle="Vanilla HTML, CSS, and optional JS">
            <AdminCodePanel
              html={form.html}
              css={form.css}
              js={form.js}
              activeTab={codeTab}
              onTabChange={setCodeTab}
              onChange={(tab, value) => onFormChange(tab, value)}
              htmlError={errorFields.has("html")}
              cssError={errorFields.has("css")}
            />
          </AdminPanel>

          <AdminPanel title="Publish checklist" subtitle="All errors must be resolved before publishing">
            <ValidationBanner issues={validation} />
            <p className="mt-3 text-[11px] text-muted-foreground">
              Writes to <code className="text-foreground/80">{contentPath}</code> with parametric
              dimensions in <code className="text-foreground/80">dimensions.json</code> and style
              source under <code className="text-foreground/80">variants/</code>.
            </p>
          </AdminPanel>
        </div>

        {/* Preview column */}
        <aside className={adm.studioPreview}>
          <AdminPanel
            title="Live preview"
            subtitle="Updates as you edit — test variants below"
            className="sticky top-4"
          >
            <AdminPreview
              html={form.html}
              css={form.css}
              js={form.js}
              selection={previewSelection}
              slug={form.slug}
            />
            {form.variants.length > 0 ? (
              <div className="mt-4 border-t border-border/60 pt-4">
                <p className={adm.sectionTitle}>Preview style</p>
                <div className="mt-2">
                  <PlaygroundVariantPanel
                    variants={form.variants}
                    selection={previewSelection}
                    onChange={setPreviewSelection}
                  />
                </div>
              </div>
            ) : null}
          </AdminPanel>
        </aside>
      </div>
    </div>
  );
}
