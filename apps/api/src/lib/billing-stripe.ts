import type { Plan } from "@complib/contracts";

const STRIPE_STATUS_MAP: Record<string, string> = {
  incomplete: "INCOMPLETE",
  incomplete_expired: "INCOMPLETE_EXPIRED",
  trialing: "TRIALING",
  active: "ACTIVE",
  past_due: "PAST_DUE",
  canceled: "CANCELED",
  unpaid: "UNPAID",
  paused: "PAUSED",
};

export function mapStripeSubscriptionStatus(status: string): string {
  return STRIPE_STATUS_MAP[status] ?? "CANCELED";
}

export function planFromStripeMetadata(metadata: Record<string, string> | undefined): Plan {
  const raw = metadata?.plan ?? metadata?.complibPlan;
  if (raw === "ENTERPRISE") return "ENTERPRISE";
  if (raw === "PRO") return "PRO";
  return "PRO";
}

export function planFromPriceId(priceId: string | undefined, metadata?: Record<string, string>): Plan {
  if (metadata?.plan === "ENTERPRISE") return "ENTERPRISE";
  if (metadata?.plan === "PRO") return "PRO";
  const enterprisePrice = process.env.STRIPE_ENTERPRISE_PRICE_ID?.trim();
  if (enterprisePrice && priceId === enterprisePrice) return "ENTERPRISE";
  return "PRO";
}
