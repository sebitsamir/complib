# CompLib environment variables

Copy each `.env.example` beside the app that uses it. Never commit real secrets.

## `apps/web/.env.local`

| Variable | Required | Purpose |
|---|---|---|
| `COMPLIB_BACKEND_URL` | Yes (dev) | Express API origin, e.g. `http://127.0.0.1:5000` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Production | Clerk browser key |
| `CLERK_SECRET_KEY` | Production | Clerk server key (Next middleware / server components) |
| `NEXT_PUBLIC_DISABLE_CLERK_DEV` | No | `true` skips Clerk in local UI work |
| `COMPLIB_UNLOCK_PRO_SOURCE` | No | Local unlock for Pro source in the Next app |
| `COMPLIB_STORAGE_ROOT` | No | Override artifact root (defaults to repo `storage/`) |
| `COMPLIB_ALLOWED_DEV_ORIGINS` | No | Extra hosts for Next.js 16 `allowedDevOrigins` |
| `PORT` | No | Next dev port (default `3000`) |

## Database

| Command | Purpose |
|---|---|
| `npm run db:migrate` | Apply pending Prisma migrations (`apps/api`) |
| `npm run db:repair` | Reset failed/legacy migration state and re-apply init (destructive — see below) |
| `npm run sync:catalog` | Index `storage/components` into PostgreSQL |

### Failed migration (P3009)

If `db:migrate` reports a failed migration from the old split-repo history:

```bash
# PowerShell
$env:COMPLIB_DB_REPAIR_CONFIRM="yes"
npm run db:repair
npm run sync:catalog
```

This drops CompLib application tables, clears `_prisma_migrations`, and applies the squashed `20260830120000_init` migration.

### Neon `P1001: Can't reach database server`

Usually one of:

1. **Cold start** — Neon free tier sleeps after inactivity. Run `npm run db:migrate` again after 5–10 seconds.
2. **Missing SSL** — ensure the URL includes `?sslmode=require` (the API client adds this automatically for `*.neon.tech`).
3. **Wrong URL for migrations** — set `DIRECT_DATABASE_URL` to Neon's **direct** (non-pooler) connection string; keep the pooled URL in `DATABASE_URL` for runtime.

## `apps/api/.env`

| Variable | Required | Purpose |
|---|---|---|
| `PORT` | No | API port (default `5000`) |
| `NODE_ENV` | Yes | `development` or `production` |
| `FRONTEND_URL` | Yes | Canonical web origin for CORS + Stripe redirects |
| `FRONTEND_URLS` | No | Comma-separated extra CORS origins |
| `COMPLIB_REPO_ROOT` | No | Monorepo root (auto-detected from `apps/api`) |
| `COMPLIB_STORAGE_ROOT` | No | Artifact store root (defaults to `<repo>/storage`) |
| `DATABASE_URL` | Yes | PostgreSQL URL (`postgres://` or `postgresql://`) |
| `DIRECT_DATABASE_URL` | Recommended | Direct TCP URL for Prisma/pg adapter |
| `CLERK_SECRET_KEY` | Production | Token verification |
| `CLERK_WEBHOOK_SECRET` | Production | Svix verification for Clerk webhooks |
| `COMPLIB_ADMIN_API_KEY` | No | Header `x-complib-admin-key` for admin writes |
| `COMPLIB_UNLOCK_PRO_SOURCE` | No | Dev-only Pro source bypass |
| `COMPLIB_ALLOW_DEV_ADMIN` | No | Dev-only admin bypass (`NODE_ENV !== production`) |
| `STRIPE_SECRET_KEY` | Billing | Stripe API |
| `STRIPE_WEBHOOK_SECRET` | Billing | Stripe webhook signatures |
| `STRIPE_PRICE_PRO` | Billing | Fallback Pro price |
| `STRIPE_PRICE_ENTERPRISE` | Billing | Fallback Enterprise price |
| `STRIPE_PRICE_PRO_MONTHLY` / `_ANNUAL` | No | Cycle-specific Pro prices |
| `STRIPE_PRICE_ENTERPRISE_MONTHLY` / `_ANNUAL` | No | Cycle-specific Enterprise prices |

## Artifact storage

Component HTML/CSS/JS lives under `storage/components`, not inside the Next.js app. Both apps resolve that tree through `COMPLIB_STORAGE_ROOT` (or the repo-relative default).
