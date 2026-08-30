import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getEntitlements, roleFromClerkMetadata } from "@complib/entitlements";
import type { Plan } from "@complib/contracts";

export type AdminSession = {
  userId: string;
  plan: Plan;
  isAdmin: boolean;
};

function devAdminBypassEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.COMPLIB_ALLOW_DEV_ADMIN === "true"
  );
}

/** Resolve whether the current Clerk user may access admin studio routes. */
export async function getAdminSession(): Promise<AdminSession | null> {
  if (devAdminBypassEnabled()) {
    return { userId: "dev-admin", plan: "ENTERPRISE", isAdmin: true };
  }

  try {
    const user = await currentUser();
    if (!user) return null;

    const role = roleFromClerkMetadata(
      user.publicMetadata as Record<string, unknown> | undefined,
    );
    const pub = user.publicMetadata as Record<string, unknown> | undefined;
    const rawPlan = pub?.complibPlan ?? pub?.plan;
    const plan: Plan =
      rawPlan === "PRO" || rawPlan === "ENTERPRISE" || rawPlan === "FREE"
        ? rawPlan
        : "FREE";

    const entitlements = getEntitlements({ plan, role });
    if (!entitlements.isAdmin) return null;

    return { userId: user.id, plan, isAdmin: true };
  } catch {
    return null;
  }
}

/** Server-side guard for /admin pages — redirects non-admins to home. */
export async function requireAdminPage(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    redirect("/?admin=denied");
  }
  return session;
}
