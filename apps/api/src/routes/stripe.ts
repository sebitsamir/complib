import { Router } from "express";
import Stripe from "stripe";
import { requireAuth } from "../middleware/auth";
import prisma from "../prisma";

const router = Router();

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return Stripe(key);
}

function resolvePriceId(plan: "PRO" | "ENTERPRISE", cycle: "monthly" | "annual") {
  if (plan === "PRO") {
    const annual = process.env.STRIPE_PRICE_PRO_ANNUAL?.trim() || process.env.STRIPE_PRICE_PRO?.trim();
    const monthly = process.env.STRIPE_PRICE_PRO_MONTHLY?.trim() || process.env.STRIPE_PRICE_PRO?.trim();
    return cycle === "annual" ? annual : monthly;
  }
  const annual =
    process.env.STRIPE_PRICE_ENTERPRISE_ANNUAL?.trim() ||
    process.env.STRIPE_PRICE_ENTERPRISE?.trim();
  const monthly =
    process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY?.trim() ||
    process.env.STRIPE_PRICE_ENTERPRISE?.trim();
  return cycle === "annual" ? annual : monthly;
}

router.post("/create-checkout", requireAuth, async (req, res) => {
  const stripe = getStripe();
  if (!stripe) {
    res.status(503).json({ error: "Stripe is not configured." });
    return;
  }

  const planRaw = req.body?.plan;
  const plan = planRaw === "PRO" || planRaw === "ENTERPRISE" ? planRaw : null;
  const cycleRaw = req.body?.cycle;
  const cycle = cycleRaw === "monthly" ? "monthly" : "annual";
  const priceId = plan ? resolvePriceId(plan, cycle) : "";

  if (!plan || !priceId) {
    res.status(400).json({ error: "Invalid plan or missing Stripe price ID." });
    return;
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: req.userId },
    select: { email: true, stripeCustomerId: true },
  });

  const frontendUrl = (process.env.FRONTEND_URL ?? "http://localhost:3000").replace(/\/$/, "");

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer: dbUser?.stripeCustomerId ?? undefined,
    customer_email: dbUser?.stripeCustomerId ? undefined : dbUser?.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${frontendUrl}/playground?upgraded=1`,
    cancel_url: `${frontendUrl}/pricing?cancelled=true`,
    metadata: { clerkId: req.userId!, plan, cycle },
  });

  res.json({ url: session.url });
});

router.post("/create-portal", requireAuth, async (req, res) => {
  const stripe = getStripe();
  if (!stripe) {
    res.status(503).json({ error: "Stripe is not configured." });
    return;
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: req.userId },
    select: { stripeCustomerId: true },
  });

  if (!dbUser?.stripeCustomerId) {
    res.status(400).json({ error: "No billing account found. Subscribe to a plan first." });
    return;
  }

  const frontendUrl = (process.env.FRONTEND_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const session = await stripe.billingPortal.sessions.create({
    customer: dbUser.stripeCustomerId,
    return_url: `${frontendUrl}/dashboard`,
  });

  res.json({ url: session.url });
});

export default router;
