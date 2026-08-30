import {
  redactComponentSources,
  redactComponentsForClient,
  tierRequiresProSourceLock,
} from "@/lib/source-access-utils";
import { fetchServerEntitlements } from "@/lib/entitlements-server";

export {
  redactComponentSources,
  redactComponentsForClient,
  tierRequiresProSourceLock,
};

/** Whether the signed-in user can view/copy/download component source (DB-backed plan). */
export async function userHasProSourceAccess(): Promise<boolean> {
  const entitlements = await fetchServerEntitlements();
  return entitlements.canViewSource;
}

export { fetchServerEntitlements };
