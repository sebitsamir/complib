"use client";

import type { ReactNode } from "react";
import HeroMesh from "@/components/marketing/hero-mesh";
import { MotionCtaLink } from "@/components/motion/motion-link";
import { Reveal } from "@/components/motion/reveal";

export function HeroShell({
  children,
  mesh = false,
}: {
  children: ReactNode;
  mesh?: boolean;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-blueprint">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,hsl(var(--accent)/0.14),transparent_55%)]"
        aria-hidden
      />
      {mesh ? <HeroMesh /> : null}
      <div className="relative">{children}</div>
    </section>
  );
}

export function MarketingCtaBand({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <section className="border-t border-border bg-ink py-16 text-background lg:py-20 dark:bg-accent dark:text-accent-foreground">
      <Reveal className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 text-base leading-relaxed opacity-80">{description}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <MotionCtaLink
            href={primaryHref}
            className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 dark:bg-ink dark:text-background"
          >
            {primaryLabel}
          </MotionCtaLink>
          <MotionCtaLink
            href={secondaryHref}
            className="rounded-lg border border-background/30 bg-transparent px-6 py-3 text-sm font-semibold transition-colors hover:bg-background/10 dark:border-ink/30 dark:hover:bg-ink/10"
          >
            {secondaryLabel}
          </MotionCtaLink>
        </div>
      </Reveal>
    </section>
  );
}
