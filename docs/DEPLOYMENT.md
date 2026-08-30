# CompLib deployment notes (baseline)

## Topology

```
Internet
  └── CompLib Web (Next.js)     apps/web    :3000
        └── CompLib API (Express) apps/api  :5000
              ├── PostgreSQL (catalog, users, billing)
              └── storage/ (component source + generated bundles)
```

## Production requirements

1. **Persistent `storage/`** — do not bake component source into an ephemeral container filesystem without a volume or object store. Horizontal API replicas must share this volume (or a later object-store backend).
2. **Single PostgreSQL** — catalog sync, users, and billing live here.
3. **Protected `main`** — production deploys only from `main`; feature work on branches / `develop`.
4. **Secrets** — Clerk, Stripe, database URLs, and admin API keys come from the host secret manager, not Git.
5. **Webhooks** — Clerk and Stripe endpoints must reach `POST /api/webhooks/clerk` and `POST /api/webhooks/stripe` on the API (or a reverse-proxied path). Bodies must stay raw for signature verification.

## Suggested process model

- Web: `npm run start -w @complib/web` after `next build`
- API: `npm run build -w @complib/api` then `npm run start -w @complib/api`
- Migrate: `npm run db:migrate` before starting the API

## Local PostgreSQL backup (operator)

```bash
pg_dump "$DATABASE_URL" -Fc -f complib-postgres.dump
```

## Local component filesystem backup (operator)

Zip or rsync the `storage/` directory. Catalog rows in Postgres are an index of that tree.
