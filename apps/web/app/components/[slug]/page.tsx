import { notFound } from "next/navigation";
import SiteHeader from "@/layouts/Header";
import ComponentDetailTabs from "@/components/component-detail-tabs";
import { getComponentBySlug, getComponents } from "@/lib/component-store";
import {
  redactComponentSources,
  redactComponentsForClient,
  tierRequiresProSourceLock,
  userHasProSourceAccess,
} from "@/lib/source-access";
import { fetchRegistryBySlug } from "@/lib/registry-api";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const component = await getComponentBySlug(slug);
  if (!component) return { title: "Not Found | CompLib" };

  const description = component.description.slice(0, 160);
  const canonical = `/components/${component.slug}`;

  return {
    title: `${component.name} | CompLib`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${component.name} | CompLib`,
      description,
      type: "website",
      url: canonical,
    },
  };
}

function pickRelated(
  all: Awaited<ReturnType<typeof getComponents>>,
  currentSlug: string,
  category: string,
  problemTags: string[],
) {
  return all
    .filter((item) => item.slug !== currentSlug)
    .map((item) => {
      let score = 0;
      if (item.category === category) score += 3;
      for (const tag of item.problemTags) {
        if (problemTags.includes(tag)) score += 2;
      }
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
    .slice(0, 4)
    .map((entry) => entry.item);
}

export default async function ComponentDetail({ params }: { params: Params }) {
  const { slug } = await params;
  const component = await getComponentBySlug(slug);
  if (!component) notFound();

  const [canAccessSource, registry, allComponents] = await Promise.all([
    userHasProSourceAccess(),
    fetchRegistryBySlug(slug),
    getComponents(""),
  ]);

  const codeLocked = tierRequiresProSourceLock(component.tier) && !canAccessSource;
  const safeComponent = redactComponentSources(component, canAccessSource);
  const related = redactComponentsForClient(
    pickRelated(allComponents, component.slug, component.category, component.problemTags),
    canAccessSource,
  );

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader
        title={component.name}
        subtitle={`${component.layer} / ${component.category}`}
      />
      <div className="container mx-auto max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <ComponentDetailTabs
          component={safeComponent}
          safeRuntime={safeComponent.runtime}
          codeLocked={codeLocked}
          registry={registry}
          related={related}
          playgroundHref={`/playground?add=${encodeURIComponent(component.slug)}`}
        />
      </div>
    </div>
  );
}
