import type { Plan, UserRole } from "@complib/contracts";

export type { Plan, UserRole };

export type Entitlements = {
  plan: Plan;
  role: UserRole;
  canViewSource: boolean;
  canDownload: boolean;
  canUseScaffoldExport: boolean;
  canUseAdvancedPlayground: boolean;
  canCreateCollections: boolean;
  canSavePlaygrounds: boolean;
  canUseAI: boolean;
  isAdmin: boolean;
};

/**
 * Product capabilities from plan + role.
 * Enterprise never implies admin — that is role-only.
 */
export function getEntitlements(input: {
  plan: Plan;
  role: UserRole;
  /** Local/dev unlock; never set in production. */
  unlockPro?: boolean;
}): Entitlements {
  const paid =
    Boolean(input.unlockPro) || input.plan === "PRO" || input.plan === "ENTERPRISE";
  const enterprise = Boolean(input.unlockPro) || input.plan === "ENTERPRISE";
  const isAdmin = input.role === "ADMIN" || input.role === "SUPER_ADMIN";

  return {
    plan: input.plan,
    role: input.role,
    canViewSource: paid,
    canDownload: paid,
    canUseScaffoldExport: paid,
    canUseAdvancedPlayground: paid,
    canCreateCollections: paid,
    canSavePlaygrounds: paid,
    canUseAI: enterprise,
    isAdmin,
  };
}

export function roleFromClerkMetadata(
  pub: Record<string, unknown> | undefined,
): UserRole {
  const raw = pub?.complibRole ?? pub?.role;
  if (raw === "SUPER_ADMIN" || raw === "super_admin") return "SUPER_ADMIN";
  if (raw === "ADMIN" || raw === "admin" || raw === "Admin") return "ADMIN";
  return "USER";
}
