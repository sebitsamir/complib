# Phase 18 — Component expansion

Expand the catalog systematically after infrastructure is stable:

1. Run `npm run seed:taxonomy -w @complib/web` for taxonomy-aligned starters.
2. Publish through Admin Studio (`/admin/new`) — validation + registry sync run automatically.
3. Run `npm run sync:catalog` to index new components into PostgreSQL.

Target layers: primitives → patterns → sections → templates.
