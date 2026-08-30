import { Suspense } from "react";
import ExplorerClientShell from "@/components/explorer/ExplorerClientShell";
import LibrarySidebarSkeleton from "@/layouts/LibrarySidebarSkeleton";
import SiteHeader from "@/layouts/Header";
import {
  getComponents,
  getLibraryNavigationByLayer,
  getProblemNavigation,
} from "@/lib/component-store";
import { userHasProSourceAccess, redactComponentsForClient } from "@/lib/source-access";
import type { ExplorerSearchParams } from "@/lib/explorer-url";

type SearchParams = Promise<{
  q?: string;
  tier?: string;
  framework?: string;
  layer?: string;
  category?: string;
  problem?: string;
  browse?: string;
  style?: string;
  pick?: string;
  collection?: string;
}>;

export default async function ComponentsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  const selectedFramework =
    raw.framework === "react" || raw.framework === "vue" ? raw.framework : "vanilla";

  const explorerParams: ExplorerSearchParams = {
    q: raw.q ?? null,
    tier: raw.tier ?? null,
    framework: selectedFramework,
    browse:
      raw.browse === "style" || raw.browse === "problem" ? raw.browse : "layer",
    layer: raw.layer ?? null,
    category: raw.category ?? null,
    problem: raw.problem ?? null,
    style: raw.style ?? null,
    pick: raw.pick ?? null,
    collection:
      raw.collection === "recent" || raw.collection === "favorites"
        ? raw.collection
        : null,
  };

  const [components, allComponents, navLayers, problemGroups] = await Promise.all([
    getComponents(
      raw.q || "",
      raw.tier,
      raw.layer,
      raw.category,
      raw.problem,
    ),
    getComponents("", raw.tier),
    getLibraryNavigationByLayer(),
    getProblemNavigation(),
  ]);
  const canAccessSource = await userHasProSourceAccess();
  const clientComponents = redactComponentsForClient(components, canAccessSource);
  const clientAllComponents = redactComponentsForClient(allComponents, canAccessSource);

  const subtitleParts = [
    `${allComponents.length} in catalog`,
    raw.tier ? `· ${raw.tier}` : "",
    selectedFramework !== "vanilla" ? `· ${selectedFramework}` : "",
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader title="Explorer" subtitle={subtitleParts.join(" ").trim()} />
      <div className="flex min-h-0 flex-1">
        <Suspense fallback={<LibrarySidebarSkeleton />}>
          <ExplorerClientShell
            navLayers={navLayers}
            problemGroups={problemGroups}
            components={clientComponents}
            allComponents={clientAllComponents}
            searchParams={explorerParams}
            framework={selectedFramework}
            canAccessSource={canAccessSource}
          />
        </Suspense>
      </div>
    </div>
  );
}
