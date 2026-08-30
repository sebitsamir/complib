# CompLib storage

Canonical **component source** and **generated bundles**. The API owns this tree; the web app reads it through shared path contracts (`@complib/artifact-store`) or the API.

```
storage/
  components/     HTML/CSS/JS + manifests (source of truth)
  generated/      Framework codegen output (rebuildable)
  revisions/      Immutable per-version snapshots (Phase 3+)
```

Set `COMPLIB_STORAGE_ROOT` to point at a persistent volume in production. Do not keep a second copy under `apps/web/content`.
