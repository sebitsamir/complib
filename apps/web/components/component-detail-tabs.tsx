"use client";

import { useState } from "react";
import Link from "next/link";
import type { Component } from "@/lib/component-store";
import ComponentVariantPreview from "@/components/component-variant-preview";
import { extractDimensions, hasDimensionalControls } from "@/lib/variant-utils";
import type { RegistryRecord } from "@/lib/registry-api";

type Tab = "overview" | "code" | "usage" | "accessibility";

type Props = {
  component: Component;
  safeRuntime: string;
  codeLocked: boolean;
  registry: RegistryRecord | null;
  related: Component[];
  playgroundHref: string;
};

export default function ComponentDetailTabs({
  component,
  safeRuntime,
  codeLocked,
  registry,
  related,
  playgroundHref,
}: Props) {
  const [tab, setTab] = useState<Tab>("overview");
  const componentThemes = component.themes?.length
    ? component.themes
    : ["light", "dark", "auto"];

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "overview", label: "Overview" },
    { id: "code", label: "Code" },
    { id: "usage", label: "Usage" },
    { id: "accessibility", label: "Accessibility" },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              {component.tier}
            </span>
            <span className="text-sm uppercase tracking-widest text-yellow-500">
              {component.layer} / {component.category}
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl lg:text-5xl">{component.name}</h1>
          <p className="mt-3 text-base text-muted-foreground sm:mt-4 sm:text-lg lg:text-xl">
            {component.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(registry?.frameworks ?? ["vanilla"]).map((fw) => (
              <span
                key={fw}
                className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium capitalize"
              >
                {fw}
              </span>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
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
        <ComponentVariantPreview
          slug={component.slug}
          name={component.name}
          variants={component.variants}
          showGallery
        />
      </section>

      <div className="mb-4 flex gap-1 overflow-x-auto border-b border-border pb-px [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setTab(entry.id)}
            className={`shrink-0 border-b-2 px-3 py-2 text-sm font-medium transition sm:px-4 ${
              tab === entry.id
                ? "border-accent text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {entry.label}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <div className="space-y-8">
          <section className="rounded-2xl border border-border bg-card/50 p-5">
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
                        <p className="text-xs font-semibold">{dim.label}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {dim.options.map((opt) => opt.label).join(" · ")}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Fixed styling component.</p>
            )}
          </section>

          {registry?.dependencies && registry.dependencies.length > 0 ? (
            <section className="rounded-2xl border border-border bg-card/50 p-5">
              <h2 className="text-lg font-semibold">Dependencies</h2>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {registry.dependencies.map((dep) => (
                  <li key={`${dep.name}-${dep.version ?? ""}`}>
                    <code>{dep.name}</code>
                    {dep.version ? ` @ ${dep.version}` : ""}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {related.length > 0 ? (
            <section className="rounded-2xl border border-border bg-card/50 p-5">
              <h2 className="text-lg font-semibold">Related components</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/components/${item.slug}`}
                    className="rounded-xl border border-border bg-background px-4 py-3 hover:border-accent/40"
                  >
                    <p className="font-semibold">{item.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      ) : null}

      {tab === "code" ? (
        <section className="rounded-2xl border border-border bg-card/50 p-5">
          {codeLocked ? (
            <p className="text-sm text-muted-foreground">
              Source code is available with Pro. Preview remains available.
            </p>
          ) : (
            <pre className="max-h-[28rem] overflow-auto rounded-xl border border-border bg-background p-4 text-xs leading-relaxed">
              <code>{safeRuntime}</code>
            </pre>
          )}
        </section>
      ) : null}

      {tab === "usage" ? (
        <section className="rounded-2xl border border-border bg-card/50 p-5 space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Installation</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
              {registry?.documentation.installation ||
                "Copy the component from CompLib or export a framework bundle."}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Usage</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
              {registry?.documentation.usage || component.description}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Themes</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {componentThemes.join(", ")}
            </p>
          </div>
          {registry?.examples?.[0] ? (
            <div>
              <h2 className="text-lg font-semibold">Example</h2>
              <p className="mt-1 text-sm font-medium">{registry.examples[0].title}</p>
              {codeLocked ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  Example source is available with Pro.
                </p>
              ) : (
                <pre className="mt-2 overflow-auto rounded-lg border border-border bg-background p-3 text-xs">
                  <code>{registry.examples[0].html}</code>
                </pre>
              )}
            </div>
          ) : null}
        </section>
      ) : null}

      {tab === "accessibility" ? (
        <section className="rounded-2xl border border-border bg-card/50 p-5">
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">
            {registry?.documentation.accessibility ||
              "Keep visible labels, semantic structure, focus states, and verify contrast in all themes."}
          </p>
        </section>
      ) : null}
    </div>
  );
}
