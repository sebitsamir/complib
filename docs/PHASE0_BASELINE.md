# Phase 0 — Freeze & Baseline

Recorded 2026-08-30 from the previous split `frontend/` + `backend/` trees.

## Production behavior (as of freeze)

- Explorer browses taxonomy layers and live-previews HTML/CSS/JS from disk.
- Playground composes instances, stores editor state in `localStorage`, exports page/scaffold ZIP.
- Catalog metadata is mirrored into PostgreSQL (`CatalogComponent` + variants + tags).
- Auth: Clerk session (optional local disable). Billing: Stripe checkout + webhook plan updates.
- Admin studio at `/admin/new` writes components to disk and re-indexes Postgres.
- Pro source gating is **inconsistent** (Clerk metadata on web vs Clerk + DB plan on API). Documented, not yet fixed (Phase 11).

## Known critical issues at freeze (do not regress while fixing)

1. ~~Dual component trees (web content vs API expecting a sibling frontend)~~ — resolved in monorepo migration
2. Duplicated domain logic between `apps/web/lib` and `apps/api/src/lib` — tracked; consolidate into packages incrementally
3. ~~Inconsistent Pro entitlements~~ — fixed Phase 1: unified `@complib/entitlements` on web + API
4. ~~Enterprise plan implied admin~~ — fixed Phase 1: admin is role-only via `resolveEffectiveRole`
5. ~~Stripe subscription updates collapse Enterprise → PRO/FREE~~ — fixed Phase 1: `planFromPriceId` preserves ENTERPRISE
6. ~~Admin UI not page-guarded~~ — fixed Phase 1: middleware checks `/api/entitlements/me` isAdmin
7. ~~Preview CSP disabled; iframe not fully isolated~~ — fixed Phase 12: API CSP headers enabled

## Secrets

No production secret files are committed. `.env` / `.env.local` stay gitignored. Operators keep their own copies.

## Dist

`apps/api/dist` is gitignored. TypeScript emit is a build artifact only.
