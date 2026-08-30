export type BillingCycle = "monthly" | "annual";

export type PlanId = "FREE" | "PRO" | "ENTERPRISE";

export type Plan = {
  id: PlanId;
  name: string;
  tagline: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  highlighted?: boolean;
  cta: string;
  ctaVariant: "primary" | "secondary" | "outline";
  features: string[];
};

export const plans: Plan[] = [
  {
    id: "FREE",
    name: "Free",
    tagline: "Explore the library and ship quick prototypes.",
    monthlyPrice: 0,
    annualPrice: 0,
    cta: "Browse components",
    ctaVariant: "outline",
    features: [
      "Full component catalog browsing",
      "Live previews for every component",
      "Playground with drag-and-drop layout",
      "Vanilla HTML/CSS/JS on free-tier components",
      "Community support",
    ],
  },
  {
    id: "PRO",
    name: "Pro",
    tagline: "Unlock source, exports, and production workflows.",
    monthlyPrice: 9,
    annualPrice: 7,
    highlighted: true,
    cta: "Start Pro trial",
    ctaVariant: "primary",
    features: [
      "Everything in Free",
      "Full HTML, CSS & JS source access",
      "Copy, edit, and download .zip bundles",
      "React, Vue & Tailwind generated exports",
      "Runnable Vite & Next.js scaffolds",
      "Pro-tier components & early releases",
      "Priority email support",
    ],
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    tagline: "Governance, scale, and support for larger teams.",
    monthlyPrice: 29,
    annualPrice: 24,
    cta: "Contact sales",
    ctaVariant: "secondary",
    features: [
      "Everything in Pro",
      "Unlimited team seats & shared library",
      "SSO & role-based access (coming soon)",
      "Custom component modules & branding",
      "Dedicated success manager",
      "SLA-backed uptime & security review",
      "Invoice & procurement-friendly billing",
    ],
  },
];

export type ComparisonRow = {
  label: string;
  free: string | boolean;
  pro: string | boolean;
  enterprise: string | boolean;
};

export const comparisonRows: ComparisonRow[] = [
  { label: "Component previews", free: true, pro: true, enterprise: true },
  { label: "Source code access", free: "Free tier only", pro: true, enterprise: true },
  { label: "Download & copy code", free: false, pro: true, enterprise: true },
  { label: "React / Vue / Tailwind exports", free: false, pro: true, enterprise: true },
  { label: "Runnable project scaffolds", free: false, pro: true, enterprise: true },
  { label: "Playground page builder", free: true, pro: true, enterprise: true },
  { label: "Team seats", free: "1", pro: "1", enterprise: "Unlimited" },
  { label: "Support", free: "Community", pro: "Priority email", enterprise: "Dedicated" },
  { label: "SSO & admin controls", free: false, pro: false, enterprise: true },
  { label: "Custom SLA", free: false, pro: false, enterprise: true },
];

export const faqs = [
  {
    q: "Can I try Pro before paying?",
    a: "Yes. Start with the Free plan, then upgrade when you need source access, exports, or Pro-tier components. Checkout integration is rolling out soon.",
  },
  {
    q: "What happens to my projects if I downgrade?",
    a: "You keep access to Free-tier components and previews. Downloaded bundles and local copies remain yours; Pro-only source locks apply again in the browser.",
  },
  {
    q: "Do you offer annual billing?",
    a: "Annual billing saves about 20% compared to monthly. Toggle Annual above to see discounted per-seat pricing.",
  },
  {
    q: "How does Enterprise differ from Pro?",
    a: "Enterprise adds team governance, procurement-friendly billing, dedicated support, and roadmap items like SSO—built for design systems and product orgs at scale.",
  },
  {
    q: "Can I use components in commercial products?",
    a: "Yes. All paid plans include commercial use. Enterprise includes custom terms for larger deployments—contact sales for details.",
  },
];

export function formatPrice(amount: number | null, cycle: BillingCycle): string {
  if (amount === null) return "Custom";
  if (amount === 0) return "$0";
  return `$${cycle === "annual" ? amount : amount}`;
}
