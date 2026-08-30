"use client";

import ProductStage from "@/components/landing/product-stage";
import { MarketingCtaBand } from "@/components/marketing/hero-shell";
import { MotionCtaLink } from "@/components/motion/motion-link";
import {
  HeroEntrance,
  HeroItem,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/motion/reveal";
import { Logo } from "@/layouts/Logo";

const features = [
  {
    title: "Live in the browser",
    description:
      "Every component renders instantly—no clone, install, or build step just to evaluate a button.",
  },
  {
    title: "Own the source",
    description:
      "Copy HTML/CSS/JS or export React and Vue. No runtime lock-in, no opaque package dependency.",
  },
  {
    title: "Compose, then ship",
    description:
      "Drag blocks onto the playground canvas, tune variants, and download a runnable Vite or Next scaffold.",
  },
];

const steps = [
  {
    step: "01",
    title: "Browse by intent",
    body: "Filter by layer, problem, or style. Preview before you commit a single line.",
  },
  {
    step: "02",
    title: "Compose the page",
    body: "Drop components on the artboard, snap layouts, and sync page source as you go.",
  },
  {
    step: "03",
    title: "Export and run",
    body: "Copy, ZIP, or scaffold — Vanilla, React, or Vue — and keep shipping in your stack.",
  },
];

export default function LandingPage() {
  return (
    <main className="flex-1">
      {/* Hero: brand + one line + one sentence + CTAs + product stage */}
      <section className="relative overflow-hidden border-b border-border bg-blueprint">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,hsl(var(--accent)/0.12),transparent_60%)]"
          aria-hidden
        />
        <HeroEntrance className="relative mx-auto max-w-6xl px-6 pb-10 pt-14 sm:pb-14 sm:pt-20 lg:pt-24">
          <HeroItem>
            <div className="mb-8 flex justify-center sm:mb-10">
              <Logo href={null} size="lg" className="scale-110 sm:scale-125" />
            </div>
          </HeroItem>
          <HeroItem>
            <h1 className="mx-auto max-w-3xl text-center font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
              UI you can paste.
              <br />
              <span className="text-accent">Pages you can ship.</span>
            </h1>
          </HeroItem>
          <HeroItem>
            <p className="mx-auto mt-5 max-w-xl text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
              CompLib is the component explorer and playground for builders who want
              production UI without the design-system tax.
            </p>
          </HeroItem>
          <HeroItem>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <MotionCtaLink
                href="/components"
                className="rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
              >
                Browse components
              </MotionCtaLink>
              <MotionCtaLink
                href="/playground"
                className="rounded-lg border border-border bg-surface px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/40"
              >
                Open playground
              </MotionCtaLink>
            </div>
          </HeroItem>
          <HeroItem>
            <div className="mt-14 sm:mt-16">
              <ProductStage />
            </div>
          </HeroItem>
        </HeroEntrance>
      </section>

      <section className="border-b border-border bg-surface py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mb-12 max-w-2xl">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Built for the moment you need a screen, not a seminar
            </h2>
            <p className="mt-3 text-muted-foreground">
              Preview free. Unlock source and exports when you are ready to go deeper.
            </p>
          </Reveal>
          <Stagger className="grid gap-10 sm:grid-cols-3" stagger={0.1}>
            {features.map((f) => (
              <StaggerItem key={f.title}>
                <article>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {f.description}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-blueprint py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mb-12">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Three moves from blank canvas to shipped UI
            </h2>
          </Reveal>
          <Stagger className="grid gap-8 md:grid-cols-3" stagger={0.12}>
            {steps.map((item) => (
              <StaggerItem key={item.step}>
                <div className="relative">
                  <span className="font-display text-5xl font-extrabold text-accent/25">
                    {item.step}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-16 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">
              Explorer
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">
              A catalog that respects how you search
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Layer and category taxonomy, problem tags, favorites, and a command palette.
              Framework tabs for Vanilla, React, and Vue — with live preview on every tile.
            </p>
            <MotionCtaLink
              href="/components"
              className="mt-6 inline-flex text-sm font-semibold text-accent transition-opacity hover:opacity-80"
            >
              Open the explorer →
            </MotionCtaLink>
          </Reveal>
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">
              Playground
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">
              Compose full pages like a workbench
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Drag from the palette, tune variants in Properties, edit merged page source,
              and export a scaffold your team can run tonight.
            </p>
            <MotionCtaLink
              href="/playground"
              className="mt-6 inline-flex text-sm font-semibold text-accent transition-opacity hover:opacity-80"
            >
              Launch playground →
            </MotionCtaLink>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <Reveal>
          <div className="border border-border bg-surface px-8 py-10 sm:px-12 sm:py-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                  Free to explore. Pro when you need the keys.
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Previews and playground for everyone. Source, downloads, and scaffolds on
                  Pro — from $7/mo billed annually.
                </p>
              </div>
              <MotionCtaLink
                href="/pricing"
                className="inline-flex shrink-0 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
              >
                View pricing
              </MotionCtaLink>
            </div>
          </div>
        </Reveal>
      </section>

      <MarketingCtaBand
        title="Stop scaffolding the same screen again"
        description="Open the catalog, drop a few blocks into the playground, and leave with code you actually own."
        primaryHref="/components"
        primaryLabel="Browse components"
        secondaryHref="/playground"
        secondaryLabel="Try the playground"
      />
    </main>
  );
}
