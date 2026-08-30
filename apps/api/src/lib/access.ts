export type Plan = "FREE" | "PRO" | "ENTERPRISE";

const TIER_RANK: Record<Plan, number> = { FREE: 0, PRO: 1, ENTERPRISE: 2};

export function canAccess(userPlan: Plan, componentTier: Plan): boolean {
    return TIER_RANK[userPlan] >= TIER_RANK[componentTier];
}