import Link from "next/link";
import { cookies } from "next/headers";
import SiteHeader from "@/layouts/Header";
import { getComponents } from "@/lib/component-store";
import { currentUser } from "@clerk/nextjs/server";
import { getEntitlements, roleFromClerkMetadata } from "@complib/entitlements";
import type { Plan } from "@complib/contracts";

const DEFAULT_BACKEND = "http://127.0.0.1:5000";

async function fetchLibraryData(cookieHeader: string) {
  const base = (process.env.COMPLIB_BACKEND_URL ?? DEFAULT_BACKEND).replace(/\/$/, "");
  try {
    const [persistence, collections] = await Promise.all([
      fetch(`${base}/api/library/persistence`, {
        headers: { cookie: cookieHeader },
        cache: "no-store",
      }),
      fetch(`${base}/api/library/collections`, {
        headers: { cookie: cookieHeader },
        cache: "no-store",
      }),
    ]);

    const persistenceJson = persistence.ok
      ? ((await persistence.json()) as {
          favoriteSlugs?: string[];
          recentSlugs?: string[];
        })
      : { favoriteSlugs: [], recentSlugs: [] };

    const collectionsJson = collections.ok
      ? ((await collections.json()) as {
          collections?: Array<{
            name: string;
            slug: string;
            description?: string | null;
            items: Array<{ slug: string; name: string }>;
          }>;
        })
      : { collections: [] };

    return {
      favoriteSlugs: persistenceJson.favoriteSlugs ?? [],
      recentSlugs: persistenceJson.recentSlugs ?? [],
      collections: collectionsJson.collections ?? [],
    };
  } catch {
    return { favoriteSlugs: [], recentSlugs: [], collections: [] };
  }
}

function resolvePlan(user: Awaited<ReturnType<typeof currentUser>>): Plan {
  const pub = user?.publicMetadata as Record<string, unknown> | undefined;
  const raw = pub?.complibPlan ?? pub?.plan;
  if (raw === "PRO" || raw === "ENTERPRISE" || raw === "FREE") return raw;
  return "FREE";
}

export default async function DashboardPage() {
  const user = await currentUser();
  const plan = resolvePlan(user);
  const role = roleFromClerkMetadata(
    user?.publicMetadata as Record<string, unknown> | undefined,
  );
  const entitlements = getEntitlements({ plan, role });

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((entry) => `${entry.name}=${entry.value}`)
    .join("; ");

  const [library, allComponents] = await Promise.all([
    user ? fetchLibraryData(cookieHeader) : Promise.resolve({
      favoriteSlugs: [],
      recentSlugs: [],
      collections: [],
    }),
    getComponents(""),
  ]);

  const bySlug = new Map(allComponents.map((c) => [c.slug, c]));
  const favorites = library.favoriteSlugs
    .map((slug) => bySlug.get(slug))
    .filter(Boolean)
    .slice(0, 8);
  const recents = library.recentSlugs
    .map((slug) => bySlug.get(slug))
    .filter(Boolean)
    .slice(0, 8);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader title="My CompLib" subtitle="Workspace overview" />
      <main className="container mx-auto max-w-6xl flex-1 px-6 py-10">
        <section className="mb-10 rounded-2xl border border-border bg-card/50 p-6">
          <h1 className="text-2xl font-bold">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""}.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Plan: <span className="font-semibold text-foreground">{plan}</span>
            {entitlements.canViewSource ? " · Pro source access enabled" : ""}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/components" className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted">
              Explore components
            </Link>
            <Link href="/playground" className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground">
              Open Playground
            </Link>
            <Link href="/pricing" className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted">
              {plan === "FREE" ? "Upgrade to Pro" : "Manage billing"}
            </Link>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="text-lg font-semibold">Recently used</h2>
            <div className="mt-4 grid gap-3">
              {recents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent components yet.</p>
              ) : (
                recents.map((item) => item && (
                  <Link
                    key={item.slug}
                    href={`/components/${item.slug}`}
                    className="rounded-xl border border-border bg-card/40 px-4 py-3 hover:border-accent/40"
                  >
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </Link>
                ))
              )}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Favorites</h2>
            <div className="mt-4 grid gap-3">
              {favorites.length === 0 ? (
                <p className="text-sm text-muted-foreground">Star components in the explorer to save them here.</p>
              ) : (
                favorites.map((item) => item && (
                  <Link
                    key={item.slug}
                    href={`/components/${item.slug}`}
                    className="rounded-xl border border-border bg-card/40 px-4 py-3 hover:border-accent/40"
                  >
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.layer} / {item.category}</p>
                  </Link>
                ))
              )}
            </div>
          </section>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold">Collections</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {library.collections.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {user
                  ? "Create collections from the explorer to organize components."
                  : "Sign in to create and manage collections."}
              </p>
            ) : (
              library.collections.map((collection) => (
                <div
                  key={collection.slug}
                  className="rounded-xl border border-border bg-card/40 px-4 py-3"
                >
                  <p className="font-medium">{collection.name}</p>
                  {collection.description ? (
                    <p className="mt-1 text-xs text-muted-foreground">{collection.description}</p>
                  ) : null}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {collection.items.length} component{collection.items.length === 1 ? "" : "s"}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
