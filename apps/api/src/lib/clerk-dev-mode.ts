/**
 * Dev-only toggle to allow offline/local UI work without Clerk network calls.
 * Set `NEXT_PUBLIC_DISABLE_CLERK_DEV=true` in `.env.local`.
 */
export function isClerkDisabledDev(): boolean {
  return process.env.NEXT_PUBLIC_DISABLE_CLERK_DEV === "true";
}

