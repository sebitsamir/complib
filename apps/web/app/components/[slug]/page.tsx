import Link from "next/link";
import { notFound } from "next/navigation";
import ComponentVariantPreview from "@/components/component-variant-preview";
import SiteHeader from "@/layouts/Header";
import { getComponentBySlug } from "@/lib/component-store";
import {
  redactComponentSources,
  tierRequiresProSourceLock,
  userHasProSourceAccess,
} from "@/lib/source-access";
import { extractDimensions, hasDimensionalControls } from "@/lib/variant-utils";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const component = await getComponentBySlug(slug);
  return {
    title: component ? `${component.name} | CompLib` : "Not Found",
  };
}

export default async function ComponentDetail({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const component = await getComponentBySlug(slug);

  if (!component) notFound();

  const canAccessSource = await userHasProSourceAccess();
  const codeLocked =
    tierRequiresProSourceLock(component.tier) && !canAccessSource;
  const safeComponent = redactComponentSources(component, canAccessSource);
  const componentThemes = component.themes?.length
    ? component.themes
    : ["light", "dark", "auto"];
  const playgroundHref = `/playground?add=${encodeURIComponent(component.slug)}`;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader
        title={component.name}
        subtitle={`${component.layer} / ${component.category}`}
      />
      <div className="container mx-auto max-w-5xl flex-1 px-6 py-10">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-sm uppercase tracking-widest text-yellow-500">
              {component.layer} / {component.category}
            </span>
            <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{component.name}</h1>
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
              {component.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {component.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-3xl bg-muted px-4 py-1.5 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/components"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              Back to Explorer
            </Link>
            <Link
              href={playgroundHref}
              className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90"
            >
              Open in Playground
            </Link>
          </div>
        </div>

        <section className="mb-8 rounded-2xl border border-border bg-card/50 p-5">
          <h2 className="text-lg font-semibold">Preview</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Live preview for{" "}
            <span className="font-medium text-foreground">{component.name}</span>.
            {component.variants && component.variants.length > 0
              ? hasDimensionalControls(component.variants)
                ? " Mix size, tone, and other dimensions independently — shareable via URL."
                : " Switch variants to compare options — shareable via URL."
              : null}
          </p>
          <div className="mt-4">
            <ComponentVariantPreview
              slug={component.slug}
              name={component.name}
              variants={component.variants}
              showGallery
            />
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-border bg-card/50 p-5">
          <h2 className="text-lg font-semibold">Code</h2>
          {codeLocked ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Source code is available with Pro. Preview remains available.
            </p>
          ) : (
            <pre className="mt-4 max-h-80 overflow-auto rounded-xl border border-border bg-background p-4 text-xs leading-relaxed">
              <code>{safeComponent.runtime}</code>
            </pre>
          )}
        </section>

        <section className="mb-8 rounded-2xl border border-border bg-card/50 p-5">
          <h2 className="text-lg font-semibold">Variants</h2>
          {component.variants && component.variants.length > 0 ? (
            <div className="mt-3 space-y-4">
              {hasDimensionalControls(component.variants) ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {extractDimensions(component.variants).map((dim) => (
                    <div
                      key={dim.key}
                      className="rounded-lg border border-border bg-background px-3 py-2"
                    >
                      <p className="text-xs font-semibold text-foreground">{dim.label}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {dim.options
                          .map((opt) => `${opt.label} (${opt.value})`)
                          .join(" · ")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
              <div className="space-y-2">
                {component.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs"
                  >
                    <span className="font-semibold text-foreground">{variant.label}</span>
                    <span className="font-mono text-muted-foreground">{variant.id}</span>
                    {variant.props && Object.keys(variant.props).length > 0 ? (
                      <span className="text-muted-foreground">
                        {Object.entries(variant.props)
                          .map(([key, value]) => `${key}=${value}`)
                          .join(" · ")}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              No explicit variants declared yet. This component can still support
              variants via props or CSS classes.
            </p>
          )}
        </section>

        <section className="mb-8 rounded-2xl border border-border bg-card/50 p-5">
          <h2 className="text-lg font-semibold">Customization</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Themes supported:{" "}
            {componentThemes.map((theme) => (
              <span
                key={theme}
                className="mr-2 inline-block rounded-md bg-muted px-2 py-1 text-xs"
              >
                {theme}
              </span>
            ))}
          </p>
        </section>

        <section className="mb-8 rounded-2xl border border-border bg-card/50 p-5">
          <h2 className="text-lg font-semibold">Accessibility</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Keep visible labels and semantic structure for interactive content.</li>
            <li>Ensure focus states are clearly visible in all themes.</li>
            <li>Verify color contrast in light and dark mode before shipping.</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card/50 p-5">
          <h2 className="text-lg font-semibold">Examples</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Recommended usage contexts:{" "}
            {component.problemTags.map((tag) => tag.replace(/-/g, " ")).join(", ")}.
          </p>
        </section>
      </div>
    </div>
  );
}
