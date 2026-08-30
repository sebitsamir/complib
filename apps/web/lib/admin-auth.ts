import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Plan } from "@complib/contracts";
import { fetchServerEntitlements } from "@/lib/entitlements-server";

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

    const entitlements = await fetchServerEntitlements();
    if (!entitlements.isAdmin) return null;

    return { userId: user.id, plan: entitlements.plan, isAdmin: true };
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
