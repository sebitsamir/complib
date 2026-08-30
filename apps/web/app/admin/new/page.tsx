'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SiteHeader from '@/layouts/Header';
import AdminExplorerNav from '@/components/admin/admin-explorer-nav';
import AdminTaxonomyBrowser from '@/components/admin/admin-taxonomy-browser';
import { AdminStudio, type AdminFormState, type SaveState } from '@/components/admin/admin-studio';
import type { ComponentLayer } from '@/lib/component-fs';
import {
  adminFormFromEditPayload,
  buildAdminStudioUrl,
  buildPublishTags,
  defaultAdminForm,
  sanitizeAdminSlug,
  type AdminEditPayload,
} from '@/lib/admin-form';
import { clearAdminDraft, loadAdminDraft, saveAdminDraft } from '@/lib/admin-draft';
import { getComponentStarter } from '@/lib/component-starters';
import { getCategoriesForLayer, getCategoryDef } from '@/lib/taxonomy-defaults';

type CatalogItem = {
  slug: string;
  name: string;
  tier?: string;
  layer: string;
  category: string;
  problemTags: string[];
};

function titleCase(input: string) {
  return input
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function buildFormFromStarter(layer: ComponentLayer, categorySlug: string): AdminFormState {
  const base = defaultAdminForm(layer, categorySlug);
  const starter = getComponentStarter(layer, categorySlug);
  if (!starter) return base;

  return {
    ...base,
    name: starter.name,
    slug: `${starter.slug}-custom`,
    description: starter.description,
    html: starter.html,
    css: starter.css,
    js: starter.js,
    layer: starter.layer,
    categorySlug: starter.category,
    problemTags: [...starter.problemTags],
    tier: starter.tier,
    themes: [...starter.themes],
    variants: starter.variants.map((v) => ({ ...v })),
    styleFamilies: [],
    extraTags: [],
    editingSlug: null,
    activeStyleId: "default",
  };
}

function normalizeDraft(draft: AdminFormState): AdminFormState {
  return {
    ...defaultAdminForm(draft.layer, draft.categorySlug),
    ...draft,
    styleFamilies: draft.styleFamilies ?? [],
    extraTags: draft.extraTags ?? [],
    editingSlug: draft.editingSlug ?? null,
    activeStyleId: draft.activeStyleId ?? "default",
  };
}

function formatDraftTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function parseLayer(raw: string | null): ComponentLayer | null {
  if (raw === 'primitives' || raw === 'patterns' || raw === 'sections' || raw === 'templates') {
    return raw;
  }
  return null;
}

export default function AdminNewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlLayer = parseLayer(searchParams.get('layer'));
  const urlCategory = searchParams.get('category');
  const urlEdit = searchParams.get('edit');
  const urlView = searchParams.get('view') === 'studio' ? 'studio' : 'browse';

  const defaultLayer: ComponentLayer = urlLayer ?? 'patterns';
  const defaultCategory = urlCategory ?? getCategoriesForLayer(defaultLayer)[0]?.slug ?? 'cards';

  const [form, setForm] = useState<AdminFormState>(() => {
    const draft = loadAdminDraft();
    if (draft) return normalizeDraft(draft);
    return buildFormFromStarter(defaultLayer, defaultCategory);
  });
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>({ type: 'idle', message: '' });
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const slugTouchedRef = useRef(false);
  const editLoadRef = useRef<string | null>(null);

  const view: 'browse' | 'studio' =
    urlView === 'studio' || Boolean(urlEdit) || loadingEdit ? 'studio' : 'browse';

  const refreshCatalog = useCallback(() => {
    setCatalogError(null);
    fetch('/api/playground/catalog')
      .then((r) => {
        if (!r.ok) throw new Error('Catalog request failed');
        return r.json() as Promise<{ catalog: Array<Partial<CatalogItem>> }>;
      })
      .then(({ catalog: rows }) => {
        const strict: CatalogItem[] = (rows ?? [])
          .filter(
            (item): item is CatalogItem =>
              typeof item?.slug === 'string' &&
              typeof item?.name === 'string' &&
              typeof item?.layer === 'string' &&
              typeof item?.category === 'string' &&
              Array.isArray(item?.problemTags),
          )
          .map((item) => ({
            slug: item.slug,
            name: item.name,
            layer: item.layer,
            category: item.category,
            problemTags: item.problemTags,
            tier: item.tier,
          }));
        setCatalog(strict);
      })
      .catch(() => {
        setCatalog([]);
        setCatalogError('Could not load the component catalog.');
      });
  }, []);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  const loadForEdit = useCallback(async (slug: string, styleId?: string) => {
    setLoadingEdit(true);
    setSaveState({ type: 'idle', message: '' });
    try {
      const styleQuery = styleId ? `?style=${encodeURIComponent(styleId)}` : '';
      const res = await fetch(`/api/components/${encodeURIComponent(slug)}/edit${styleQuery}`, {
        credentials: 'include',
      });
      const data = (await res.json().catch(() => null)) as AdminEditPayload | { error?: string };
      if (!res.ok || !data || !('component' in data)) {
        setSaveState({
          type: 'error',
          message: (data as { error?: string })?.error || 'Failed to load component for editing.',
        });
        return;
      }
      const next = adminFormFromEditPayload(data);
      setForm(next);
      slugTouchedRef.current = true;
      router.push(
        buildAdminStudioUrl({
          layer: next.layer,
          category: next.categorySlug,
          edit: slug,
          view: 'studio',
        }),
      );
    } catch {
      setSaveState({ type: 'error', message: 'Network error while loading component.' });
    } finally {
      setLoadingEdit(false);
    }
  }, [router]);

  useEffect(() => {
    if (!urlEdit) {
      editLoadRef.current = null;
      return;
    }
    if (editLoadRef.current === urlEdit || form.editingSlug === urlEdit) return;
    editLoadRef.current = urlEdit;
    void loadForEdit(urlEdit);
  }, [urlEdit, form.editingSlug, loadForEdit]);

  const applyStarter = useCallback((layer: ComponentLayer, categorySlug: string) => {
    setForm(buildFormFromStarter(layer, categorySlug));
    slugTouchedRef.current = false;
    setSaveState({ type: 'idle', message: '' });
    router.push(
      buildAdminStudioUrl({ layer, category: categorySlug, view: 'studio' }),
    );
  }, [router]);

  const handleSaveDraft = useCallback(() => {
    saveAdminDraft(form);
    setDraftSavedAt(formatDraftTime(new Date()));
  }, [form]);

  useEffect(() => {
    if (view !== 'studio') return;
    const t = window.setTimeout(() => {
      saveAdminDraft(form);
      setDraftSavedAt(formatDraftTime(new Date()));
    }, 1200);
    return () => window.clearTimeout(t);
  }, [form, view]);

  const handleSave = async () => {
    const layer = form.layer;
    const slug = sanitizeAdminSlug(form.slug);
    if (!form.name.trim() || !slug) {
      setSaveState({ type: 'error', message: 'Name and slug are required.' });
      return;
    }
    if (!getCategoryDef(layer, form.categorySlug)) {
      setSaveState({ type: 'error', message: 'Select a valid taxonomy category.' });
      return;
    }
    const isUpdate = Boolean(form.editingSlug);
    if (!isUpdate && catalog.some((c) => c.slug === slug)) {
      setSaveState({
        type: 'error',
        message: `Slug "${slug}" already exists. Choose a unique slug.`,
      });
      return;
    }

    setSaveState({
      type: 'saving',
      message: isUpdate ? 'Updating component files…' : 'Writing component files…',
    });

    const payload = {
      name: form.name.trim(),
      slug,
      description:
        form.description.trim() ||
        `${form.name.trim()} — ${titleCase(form.categorySlug)} (${layer})`,
      html: form.html,
      css: form.css,
      js: form.js,
      tier: form.tier,
      layer,
      category: form.categorySlug,
      problemTags: form.problemTags,
      tags: buildPublishTags(form),
      themes: form.themes,
      variants: form.variants,
      styleFamilies: form.styleFamilies,
      activeStyleId: form.activeStyleId,
    };

    try {
      const res = await fetch(
        isUpdate
          ? `/api/components/${encodeURIComponent(form.editingSlug!)}`
          : '/api/components',
        {
          method: isUpdate ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setSaveState({
          type: 'error',
          message: data?.error || 'Publish failed. Check admin API access (COMPLIB_ADMIN_API_KEY or Clerk admin role).',
        });
        return;
      }
      const publishedSlug = (data?.slug as string) || slug;
      clearAdminDraft();
      setSaveState({
        type: 'success',
        message: isUpdate ? `Updated components/${publishedSlug}` : `Published components/${publishedSlug}`,
        publishedSlug,
      });
      setForm((prev) => ({ ...prev, editingSlug: publishedSlug, slug: publishedSlug }));
      refreshCatalog();
    } catch {
      setSaveState({ type: 'error', message: 'Network error while publishing.' });
    }
  };

  const handleResetAfterPublish = () => {
    applyStarter(form.layer, form.categorySlug);
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <SiteHeader title="Component Studio" subtitle="Create & manage · Explorer taxonomy" />

      <div className="flex min-h-0 flex-1">
        <AdminExplorerNav
          catalog={catalog}
          activeLayer={urlLayer}
          activeCategory={urlCategory}
          editingSlug={form.editingSlug}
          view={view}
        />

        {view === 'browse' ? (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            {catalogError ? (
              <p className="shrink-0 border-b border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-700 dark:text-red-300">
                {catalogError}{' '}
                <button
                  type="button"
                  className="font-semibold underline"
                  onClick={() => refreshCatalog()}
                >
                  Retry
                </button>
              </p>
            ) : null}
            <AdminTaxonomyBrowser
              catalog={catalog}
              layer={urlLayer}
              category={urlCategory}
              onEdit={(slug) => {
                router.push(
                  buildAdminStudioUrl({
                    layer: urlLayer ?? undefined,
                    category: urlCategory ?? undefined,
                    edit: slug,
                    view: 'studio',
                  }),
                );
              }}
              onCreate={(layer, categorySlug) => applyStarter(layer, categorySlug)}
            />
          </div>
        ) : (
          <main className="min-w-0 flex-1 overflow-auto">
            {loadingEdit ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Loading component…
              </div>
            ) : (
              <AdminStudio
                form={form}
                saveState={saveState}
                componentCount={catalog.length}
                draftSavedAt={draftSavedAt}
                onFormChange={(field, value) => {
                  setForm((prev) => {
                    if (field === 'name') {
                      const nextSlug =
                        !slugTouchedRef.current && !prev.editingSlug
                          ? sanitizeAdminSlug(value)
                          : prev.slug;
                      return { ...prev, name: value, slug: nextSlug };
                    }
                    if (field === 'slug') {
                      if (prev.editingSlug) return prev;
                      slugTouchedRef.current = true;
                      return { ...prev, slug: sanitizeAdminSlug(value) };
                    }
                    return { ...prev, [field]: value };
                  });
                  if (saveState.type === 'success') {
                    setSaveState({ type: 'idle', message: '' });
                  }
                }}
                onLayerChange={(layer) => {
                  const first = getCategoriesForLayer(layer)[0]?.slug ?? 'layout';
                  applyStarter(layer, first);
                }}
                onCategoryChange={(categorySlug) => {
                  applyStarter(form.layer, categorySlug);
                }}
                onToggleProblemTag={(tag) => {
                  setForm((prev) => {
                    const exists = prev.problemTags.includes(tag);
                    const next = exists
                      ? prev.problemTags.filter((t) => t !== tag)
                      : [...prev.problemTags, tag];
                    return {
                      ...prev,
                      problemTags: next.length > 0 ? next : ['build-ui-sections'],
                    };
                  });
                }}
                onTierChange={(tier) => setForm((prev) => ({ ...prev, tier }))}
                onStyleFamiliesChange={(styleFamilies) =>
                  setForm((prev) => ({ ...prev, styleFamilies }))
                }
                onActiveStyleChange={(activeStyleId) => {
                  if (form.editingSlug) {
                    void loadForEdit(form.editingSlug, activeStyleId);
                    return;
                  }
                  setForm((prev) => ({ ...prev, activeStyleId }));
                }}
                onLoadStarter={() => applyStarter(form.layer, form.categorySlug)}
                onVariantsChange={(variants) => setForm((prev) => ({ ...prev, variants }))}
                onSaveDraft={handleSaveDraft}
                onSave={handleSave}
                onResetAfterPublish={handleResetAfterPublish}
                onBackToBrowse={() =>
                  router.push(
                    buildAdminStudioUrl({
                      layer: form.layer,
                      category: form.categorySlug,
                      view: 'browse',
                    }),
                  )
                }
              />
            )}
          </main>
        )}
      </div>
    </div>
  );
}
