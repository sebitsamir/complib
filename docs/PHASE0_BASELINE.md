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

1. Dual component trees (web content vs API expecting a sibling frontend)
2. Duplicated domain logic + `sync-libs`
3. Inconsistent Pro entitlements
4. Enterprise plan implied admin
5. Stripe subscription updates collapse Enterprise → PRO/FREE
6. Admin UI not page-guarded
7. Preview CSP disabled; iframe not fully isolated

## Secrets

No production secret files are committed. `.env` / `.env.local` stay gitignored. Operators keep their own copies.

## Dist

`apps/api/dist` is gitignored. TypeScript emit is a build artifact only.
