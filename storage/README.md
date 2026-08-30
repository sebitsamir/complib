# CompLib storage

Canonical **component source** and **generated bundles**.

```
storage/
  components/     HTML/CSS/JS + manifests (source of truth)
  generated/      Framework codegen output (rebuildable)
```

The API and the Next.js app both read this tree. Do not keep a second copy under `apps/web/content`.
