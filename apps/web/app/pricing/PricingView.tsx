"use client";

import Link from "next/link";
import { useState } from "react";
import { HeroShell, MarketingCtaBand } from "@/components/marketing/hero-shell";
import { AnimatedStat } from "@/components/motion/animated-stat";
import {
  HeroEntrance,
  HeroItem,
  HoverLift,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/motion/reveal";
import {
  comparisonRows,
  faqs,
  formatPrice,
  plans,
  type BillingCycle,
  type Plan,
  type PlanId,
} from "./pricing-data";

type PricingViewProps = {
  isSignedIn: boolean;
};

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`h-5 w-5 shrink-0 text-emerald-500 ${className}`}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.5a1 1 0 0 1-1.343.03l-3.25-3a1 1 0 1 1 1.28-1.536l2.58 2.384 6.544-6.78a1 1 0 0 1 1.414-.012Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function MinusIcon() {
  return (
    <span className="text-muted-foreground/50" aria-hidden>
      —
    </span>
  );
}

function BillingToggle({
  cycle,
  onChange,
}: {
  cycle: BillingCycle;
  onChange: (c: BillingCycle) => void;
}) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-border bg-muted/50 p-1.5">
      <button
        type="button"
        onClick={() => onChange("monthly")}
        className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
          cycle === "monthly"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => onChange("annual")}
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
          cycle === "annual"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Annual
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
          Save 20%
        </span>
      </button>
    </div>
  );
}

function PlanCard({
  plan,
  cycle,
  isSignedIn,
  onSubscribe,
  loading = false,
}: {
  plan: Plan;
  cycle: BillingCycle;
  isSignedIn: boolean;
  onSubscribe: (id: PlanId) => void;
  loading?: boolean;
}) {
  const price =
    cycle === "annual" ? plan.annualPrice : plan.monthlyPrice;
  const isFree = plan.id === "FREE";
  const isEnterprise = plan.id === "ENTERPRISE";

  const ctaClass =
    plan.ctaVariant === "primary"
      ? "bg-accent text-accent-foreground hover:opacity-90"
      : plan.ctaVariant === "secondary"
        ? "border border-border bg-muted/60 text-foreground hover:border-accent/40 hover:bg-muted"
        : "border border-border bg-background text-foreground hover:border-accent/40";

  const href = isFree
    ? "/components"
    : isEnterprise
      ? "mailto:sales@complib.dev?subject=Enterprise%20plan"
      : isSignedIn
        ? undefined
        : "/sign-in";

  return (
    <HoverLift className="h-full">
    <article
      className={`relative flex h-full flex-col rounded-2xl border p-8 transition-shadow duration-300 ${
        plan.highlighted
          ? "z-10 border-accent/50 bg-background ring-1 ring-accent/25 lg:scale-[1.02]"
          : "border-border bg-background/80 hover:border-border"
      }`}
    >
      {plan.highlighted ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-md bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-foreground">
          Most popular
        </span>
      ) : null}

      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {plan.tagline}
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-bold tracking-tight text-foreground">
            {formatPrice(price, cycle)}
          </span>
          {!isEnterprise || price !== null ? (
            <span className="text-muted-foreground">
              {isFree ? "" : "/mo"}
            </span>
          ) : null}
        </div>
        {!isFree && cycle === "annual" && price ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Billed annually · ${price * 12}/year per seat
          </p>
        ) : isFree ? (
          <p className="mt-1 text-xs text-muted-foreground">
            Forever free · no card required
          </p>
        ) : null}
      </div>

      <ul className="mb-8 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-3 text-sm text-foreground/90"
          >
            <CheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {href ? (
        <Link
          href={href}
          className={`inline-flex w-full items-center justify-center rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors ${ctaClass}`}
        >
          {plan.cta}
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => onSubscribe(plan.id)}
          disabled={loading}
          className={`inline-flex w-full items-center justify-center rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors disabled:opacity-60 ${ctaClass}`}
        >
          {loading ? "Redirecting to checkout…" : plan.cta}
        </button>
      )}
    </article>
    </HoverLift>
  );
}

function ComparisonTable() {
  const cell = (value: string | boolean) => {
    if (value === true) {
      return (
        <div className="flex justify-center">
          <CheckIcon />
        </div>
      );
    }
    if (value === false) {
      return (
        <div className="flex justify-center">
          <MinusIcon />
        </div>
      );
    }
    return (
      <span className="text-sm text-foreground/90">{value}</span>
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                Compare plans
              </th>
              <th className="px-6 py-4 text-center text-sm font-bold text-foreground">
                Free
              </th>
              <th className="px-6 py-4 text-center text-sm font-bold text-accent">
                Pro
              </th>
              <th className="px-6 py-4 text-center text-sm font-bold text-foreground">
                Enterprise
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row, i) => (
              <tr
                key={row.label}
                className={
                  i % 2 === 0
                    ? "border-b border-border/60 bg-muted/20"
                    : "border-b border-border/60"
                }
              >
                <td className="px-6 py-3.5 text-sm font-medium text-foreground">
                  {row.label}
                </td>
                <td className="px-6 py-3.5 text-center">{cell(row.free)}</td>
                <td className="px-6 py-3.5 text-center">{cell(row.pro)}</td>
                <td className="px-6 py-3.5 text-center">
                  {cell(row.enterprise)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-border rounded-2xl border border-border bg-background">
      {faqs.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-muted/30"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-semibold text-foreground sm:text-base">
                {item.q}
              </span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-transform ${
                  isOpen ? "rotate-45 bg-muted" : "bg-background"
                }`}
                aria-hidden
              >
                +
              </span>
            </button>
            {isOpen ? (
              <p className="border-t border-border/60 px-6 pb-5 pt-0 text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default function PricingView({ isSignedIn }: PricingViewProps) {
  const [cycle, setCycle] = useState<BillingCycle>("annual");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<PlanId | null>(null);

  const handleSubscribe = async (planId: PlanId) => {
    if (!isSignedIn) {
      window.location.href = "/sign-in";
      return;
    }
    if (planId === "FREE" || planId === "ENTERPRISE") return;

    setCheckoutError(null);
    setCheckoutLoading(planId);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan: planId, cycle }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };
      if (!res.ok || !data.url) {
        setCheckoutError(
          data.error ||
            "Checkout is unavailable right now. Confirm Stripe keys are configured, or try again shortly.",
        );
        return;
      }
      window.location.href = data.url;
    } catch {
      setCheckoutError("Could not reach checkout. Check your connection and try again.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  return (
    <main className="flex-1">
      <HeroShell mesh>
        <HeroEntrance className="mx-auto max-w-6xl px-6 py-16 text-center sm:py-20 lg:py-24">
          <HeroItem>
            <p className="mb-4 inline-flex items-center gap-2 rounded-md border border-accent/25 bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
              <span
                className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent"
                aria-hidden
              />
              Simple, transparent pricing
            </p>
          </HeroItem>
          <HeroItem>
            <h1 className="mx-auto max-w-3xl font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Ship production UI{" "}
              <span className="text-accent">without the tax</span>
            </h1>
          </HeroItem>
          <HeroItem>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Start free with live previews and the playground. Upgrade when your
              team needs source access, framework exports, and governed workflows.
            </p>
          </HeroItem>
          <HeroItem>
            <div className="mt-10 flex flex-col items-center gap-6">
              <BillingToggle cycle={cycle} onChange={setCycle} />
              <p className="text-xs text-muted-foreground">
                Prices in USD · cancel anytime · VAT may apply
              </p>
            </div>
          </HeroItem>
        </HeroEntrance>
      </HeroShell>

      {/* Plans */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        {checkoutError ? (
          <p
            role="alert"
            className="mb-6 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-center text-sm text-red-700 dark:text-red-300"
          >
            {checkoutError}
          </p>
        ) : null}
        <Stagger
          className="grid gap-8 lg:grid-cols-3 lg:items-stretch lg:gap-6"
          stagger={0.12}
        >
          {plans.map((plan) => (
            <StaggerItem key={plan.id} className="h-full">
              <PlanCard
                plan={plan}
                cycle={cycle}
                isSignedIn={isSignedIn}
                onSubscribe={handleSubscribe}
                loading={checkoutLoading === plan.id}
              />
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-16">
          <div className="grid gap-6 border border-border bg-muted/30 px-6 py-8 sm:grid-cols-3 sm:divide-x sm:divide-border">
            {[
              { stat: "50", label: "Phase-1 primitives" },
              { stat: "3", label: "Export stacks · Vanilla, React, Vue" },
              { stat: "1", label: "Playground · compose & export pages" },
            ].map((item) => (
              <AnimatedStat
                key={item.label}
                value={item.stat}
                label={item.label}
                className="text-center sm:px-4"
              />
            ))}
          </div>
        </Reveal>
      </section>

      {/* Comparison */}
      <section className="border-t border-border bg-muted/20 py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Full feature comparison
            </h2>
            <p className="mt-2 text-muted-foreground">
              See exactly what each plan includes before you upgrade.
            </p>
          </Reveal>
          <Reveal>
            <ComparisonTable />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <Reveal className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Frequently asked questions
          </h2>
          <p className="mt-2 text-muted-foreground">
            Everything teams ask before rolling CompLib across a product org.
          </p>
        </Reveal>
        <Reveal>
          <FaqSection />
        </Reveal>
      </section>

      <MarketingCtaBand
        title="Ready to standardize your UI stack?"
        description="Join teams using CompLib to move from mockups to shippable components in hours—not sprints."
        primaryHref="/components"
        primaryLabel="Explore components"
        secondaryHref="/playground"
        secondaryLabel="Open playground"
      />
    </main>
  );
}
