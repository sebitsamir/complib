import express, { Router } from "express";
import { Webhook } from "svix";
import Stripe from "stripe";
import prisma from "../prisma";
import {
  mapStripeSubscriptionStatus,
  planFromPriceId,
} from "../lib/billing-stripe";
import { syncUserPlanFromSubscription } from "../lib/billing-service";
import { roleFromClerkMetadata } from "@complib/entitlements";

type StripeWebhookEvent = {
  id?: string;
  type: string;
  data: { object: Record<string, unknown> };
};

async function markWebhookProcessed(provider: string, externalId: string): Promise<boolean> {
  try {
    await prisma.webhookEvent.create({
      data: { provider, externalId },
    });
    return true;
  } catch {
    return false;
  }
}

const router = Router();

router.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      res.status(500).json({ error: "Webhook secret not configured" });
      return;
    }

    const wh = new Webhook(webhookSecret);
    let event: {
      type: string;
      data: {
        id: string;
        email_addresses?: { email_address: string }[];
        public_metadata?: Record<string, unknown>;
      };
    };
    try {
      event = wh.verify(req.body, {
        "svix-id": req.headers["svix-id"] as string,
        "svix-timestamp": req.headers["svix-timestamp"] as string,
        "svix-signature": req.headers["svix-signature"] as string,
      }) as typeof event;
    } catch {
      res.status(400).json({ error: "Invalid webhook" });
      return;
    }

    if (event.type === "user.created") {
      const email = event.data.email_addresses?.[0]?.email_address;
      const role = roleFromClerkMetadata(event.data.public_metadata);
      if (email) {
        await prisma.user.upsert({
          where: { clerkId: event.data.id },
          update: { email, role },
          create: {
            clerkId: event.data.id,
            email,
            plan: "FREE",
            role,
          },
        });
      }
    }

    if (event.type === "user.updated") {
      const email = event.data.email_addresses?.[0]?.email_address;
      const role = roleFromClerkMetadata(event.data.public_metadata);
      if (email) {
        await prisma.user.updateMany({
          where: { clerkId: event.data.id },
          data: { email, role },
        });
      }
    }

    if (event.type === "user.deleted") {
      await prisma.user.deleteMany({
        where: { clerkId: event.data.id },
      });
    }

    res.status(200).json({ received: true });
  },
);

const stripeClient = (() => {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return Stripe(key);
})();

router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret || !stripeClient) {
      res.status(503).json({ error: "Stripe webhook is not configured" });
      return;
    }

    const signature = req.headers["stripe-signature"];
    if (typeof signature !== "string") {
      res.status(400).json({ error: "Missing stripe-signature header" });
      return;
    }

    let event: StripeWebhookEvent;
    try {
      event = stripeClient.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret,
      ) as unknown as StripeWebhookEvent;
    } catch {
      res.status(400).json({ error: "Invalid Stripe webhook signature" });
      return;
    }

    const eventId = typeof event.id === "string" ? event.id : null;
    if (eventId) {
      const isNew = await markWebhookProcessed("stripe", eventId);
      if (!isNew) {
        res.status(200).json({ received: true, duplicate: true });
        return;
      }
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const metadata =
        session.metadata && typeof session.metadata === "object"
          ? (session.metadata as Record<string, string>)
          : {};
      const clerkId = metadata.clerkId ?? metadata.userId;
      const customer = session.customer;
      if (clerkId && typeof customer === "string") {
        await prisma.user.updateMany({
          where: { clerkId },
          data: { stripeCustomerId: customer },
        });
      }
    }

    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object;
      const customer = subscription.customer;
      const customerId =
        typeof customer === "string"
          ? customer
          : customer && typeof customer === "object" && "id" in customer
            ? String((customer as { id: string }).id)
            : null;
      const statusRaw = typeof subscription.status === "string" ? subscription.status : "canceled";
      const status = mapStripeSubscriptionStatus(statusRaw);
      const stripeSubscriptionId =
        typeof subscription.id === "string" ? subscription.id : null;
      const priceId =
        typeof subscription.items === "object" &&
        subscription.items &&
        "data" in (subscription.items as object) &&
        Array.isArray((subscription.items as { data: unknown[] }).data)
          ? String(
              (
                (subscription.items as { data: Array<{ price?: { id?: string } }> }).data[0]
                  ?.price?.id
              ) ?? "",
            )
          : "";
      const metadata =
        subscription.metadata && typeof subscription.metadata === "object"
          ? (subscription.metadata as Record<string, string>)
          : undefined;
      const plan = planFromPriceId(priceId, metadata);

      if (customerId && stripeSubscriptionId) {
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
          select: { id: true },
        });
        if (user) {
          const purchasedPlan = plan;
          await syncUserPlanFromSubscription({
            userId: user.id,
            subscription: {
              stripeSubscriptionId,
              stripeCustomerId: customerId,
              stripePriceId: priceId || "unknown",
              plan: purchasedPlan,
              status: event.type === "customer.subscription.deleted" ? "CANCELED" : status,
              currentPeriodStart:
                typeof subscription.current_period_start === "number"
                  ? new Date(subscription.current_period_start * 1000)
                  : null,
              currentPeriodEnd:
                typeof subscription.current_period_end === "number"
                  ? new Date(subscription.current_period_end * 1000)
                  : null,
              cancelAtPeriodEnd: subscription.cancel_at_period_end === true,
            },
          });
        } else {
          await prisma.user.updateMany({
            where: { stripeCustomerId: customerId },
            data: {
              plan:
                status === "ACTIVE" || status === "TRIALING" || status === "PAST_DUE"
                  ? plan
                  : "FREE",
            },
          });
        }
      }
    }

    res.status(200).json({ received: true });
  },
);

export default router;
