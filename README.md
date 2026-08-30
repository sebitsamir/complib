# CompLib

A component platform for building real interfaces: **Discover → Preview → Customize → Assemble → Copy/Export → Save → Reuse**.

This is a **monorepo**: one Git history, one install, multiple apps (`web`, `api`), shared packages, and independent artifact storage.

## Layout

```
apps/web          Next.js 16 explorer, playground, admin UI
apps/api          Express 5 + Prisma + PostgreSQL
packages/         Shared contracts and engines (Phase 1+)
storage/          Component source + generated artifacts
```

## Quick start

```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
# Fill DATABASE_URL and Clerk keys as needed

# First time or after a failed migration (drops app tables — requires confirmation):
#   set COMPLIB_DB_REPAIR_CONFIRM=yes   (PowerShell: $env:COMPLIB_DB_REPAIR_CONFIRM="yes")
#   npm run db:repair -w @complib/api

npm run db:migrate
npm run sync:catalog
npm run dev:api
npm run dev:web
```

- App: http://localhost:3000
- API: http://127.0.0.1:5000

See [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), and [docs/PRODUCT.md](docs/PRODUCT.md).

## Baseline

Phase 0 freeze notes: [docs/PHASE0_BASELINE.md](docs/PHASE0_BASELINE.md)
