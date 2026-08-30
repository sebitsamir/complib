# CompLib architecture (Foundation 2.0)

## Engineering law

> The database owns application state.  
> The component registry owns component identity and metadata.  
> Artifact storage owns component source.  
> The frontend renders and edits.  
> The API enforces authorization and business rules.  
> The export engine generates artifacts.  
> No layer invents its own version of another layer's truth.

## Monorepo

```
complib/
  apps/web              Next.js explorer, playground, admin UI
  apps/api              Express API, Prisma, Stripe, Clerk webhooks
  packages/*            Shared contracts, taxonomy, schema, engines
  storage/components    Canonical component source
  storage/generated     Generated framework bundles
```

## Component registry (Phase 2)

PostgreSQL holds the **registry mirror** of each component:

- `CatalogComponent` — identity, taxonomy, search index
- `CatalogVariant` — style families (`variants/{styleId}/`)
- `ComponentRevision` — versioned source/manifest hashes
- `ComponentDependency`, `ComponentFramework`, `ComponentExample`, `ComponentDocumentation`

Catalog sync (`npm run sync:catalog`) indexes disk → registry. Public read API: `GET /api/registry/:slug`.

## Artifact storage (Phase 3)

Component **bytes** live under `storage/` (or `COMPLIB_STORAGE_ROOT`):

- `components/` — editable source
- `generated/` — framework bundles
- `revisions/` — immutable snapshots per registry version

The API owns writes; both apps resolve paths via `@complib/artifact-store`. Storage health: `GET /api/artifacts/health`.

## What we will not do

- Copy `lib/` from web into API (`sync-libs` is retired)
- Treat Enterprise plan as admin
- Store billing truth only on `User.plan`
- Depend on an undocumented sibling frontend checkout
- Treat generated playground code as the document source of truth
