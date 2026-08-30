"use client";

import Link from "next/link";
import { buildExplorerUrl } from "@/lib/explorer-url";
import { ALLOWED_PROBLEM_TAGS } from "@/lib/taxonomy-defaults";
import { problemLabel } from "@/lib/library-nav-shared";

const FEATURED_PROBLEMS = [
  "build-dashboard",
  "build-landing-page",
  "build-form",
  "build-navigation",
  "build-authentication",
  "build-ui-sections",
] as const;

export default function ExplorerDiscoveryHero() {
  return (
    <section className="mb-8 rounded-2xl border border-border/70 bg-gradient-to-br from-card/80 to-muted/30 p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">
        Discover
      </p>
      <h2 className="mt-2 text-2xl font-bold sm:text-3xl">What are you building?</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
        Start from the problem you need to solve — dashboards, landing pages, forms,
        navigation, and more — then browse components that fit.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {FEATURED_PROBLEMS.map((problem) => (
          <Link
            key={problem}
            href={buildExplorerUrl({ browse: "problem", problem })}
            className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-accent/40 hover:bg-accent/5"
          >
            {problemLabel(problem)}
          </Link>
        ))}
        {ALLOWED_PROBLEM_TAGS.filter(
          (tag) => !FEATURED_PROBLEMS.includes(tag as (typeof FEATURED_PROBLEMS)[number]),
        ).map((problem) => (
          <Link
            key={problem}
            href={buildExplorerUrl({ browse: "problem", problem })}
            className="rounded-full border border-dashed border-border/80 px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            {problemLabel(problem)}
          </Link>
        ))}
      </div>
    </section>
  );
}
