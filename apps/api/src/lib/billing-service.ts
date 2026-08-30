import type { Plan } from "@complib/contracts";
import prisma from "../prisma";

export type SubscriptionSyncInput = {
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  stripePriceId: string;
  plan: Plan;
  status: string;
  currentPeriodStart?: Date | null;
  currentPeriodEnd?: Date | null;
  cancelAtPeriodEnd?: boolean;
};

/** Map Stripe subscription status to whether the user should retain paid access. */
export function subscriptionGrantsAccess(status: string): boolean {
  return status === "ACTIVE" || status === "TRIALING" || status === "PAST_DUE";
}

export async function syncUserPlanFromSubscription(input: {
  userId: string;
  subscription: SubscriptionSyncInput;
}): Promise<void> {
  const grantsAccess = subscriptionGrantsAccess(input.subscription.status);
  const userPlan =
    input.subscription.status === "CANCELED" || !grantsAccess
      ? "FREE"
      : input.subscription.plan;

  await prisma.$transaction([
    prisma.subscription.upsert({
      where: { stripeSubscriptionId: input.subscription.stripeSubscriptionId },
      create: {
        userId: input.userId,
        stripeSubscriptionId: input.subscription.stripeSubscriptionId,
        stripeCustomerId: input.subscription.stripeCustomerId,
        stripePriceId: input.subscription.stripePriceId,
        plan: input.subscription.plan,
        status: input.subscription.status as never,
        currentPeriodStart: input.subscription.currentPeriodStart ?? null,
        currentPeriodEnd: input.subscription.currentPeriodEnd ?? null,
        cancelAtPeriodEnd: input.subscription.cancelAtPeriodEnd ?? false,
      },
      update: {
        stripeCustomerId: input.subscription.stripeCustomerId,
        stripePriceId: input.subscription.stripePriceId,
        plan: input.subscription.plan,
        status: input.subscription.status as never,
        currentPeriodStart: input.subscription.currentPeriodStart ?? null,
        currentPeriodEnd: input.subscription.currentPeriodEnd ?? null,
        cancelAtPeriodEnd: input.subscription.cancelAtPeriodEnd ?? false,
      },
    }),
    prisma.user.update({
      where: { id: input.userId },
      data: {
        plan: userPlan,
        stripeCustomerId: input.subscription.stripeCustomerId,
      },
    }),
  ]);
}

export async function getUserEntitlementsFromDb(clerkId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: {
      id: true,
      plan: true,
      role: true,
      subscriptions: {
        where: { status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] as never[] } },
        orderBy: { updatedAt: "desc" },
        take: 1,
      },
    },
  });
  return user;
}
