import express, { Router } from "express";
import { Webhook } from "svix";
import Stripe from "stripe";
import prisma from "../prisma";

type StripeWebhookEvent = {
  type: string;
  data: { object: Record<string, unknown> };
};

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
      if (email) {
        await prisma.user.upsert({
          where: { clerkId: event.data.id },
          update: { email },
          create: {
            clerkId: event.data.id,
            email,
            plan: "FREE",
          },
        });
      }
    }

    if (event.type === "user.updated") {
      const email = event.data.email_addresses?.[0]?.email_address;
      if (email) {
        await prisma.user.updateMany({
          where: { clerkId: event.data.id },
          data: { email },
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

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const metadata =
        session.metadata && typeof session.metadata === "object"
          ? (session.metadata as Record<string, string>)
          : {};
      const clerkId = metadata.clerkId ?? metadata.userId;
      const plan = metadata.plan;
      const customer = session.customer;
      if (
        clerkId &&
        (plan === "PRO" || plan === "ENTERPRISE") &&
        typeof customer === "string"
      ) {
        await prisma.user.updateMany({
          where: { clerkId },
          data: {
            plan,
            stripeCustomerId: customer,
          },
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
      const status = subscription.status;
      const active = status === "active" || status === "trialing";

      if (customerId) {
        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: { plan: active ? "PRO" : "FREE" },
        });
      }
    }

    res.status(200).json({ received: true });
  },
);

export default router;
