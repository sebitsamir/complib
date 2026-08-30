import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

const clerkDisabled = process.env.NEXT_PUBLIC_DISABLE_CLERK_DEV === "true";
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

function devAdminBypassEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.COMPLIB_ALLOW_DEV_ADMIN === "true"
  );
}

function isAdminFromMetadata(
  sessionClaims: Record<string, unknown> | undefined,
): boolean {
  const pub = sessionClaims?.publicMetadata as Record<string, unknown> | undefined;
  const metadata = pub ?? sessionClaims;
  const role = metadata?.complibRole ?? metadata?.role;
  return role === "ADMIN" || role === "SUPER_ADMIN" || role === "admin" || role === "super_admin";
}

export default clerkDisabled
  ? function passthroughProxy(req: NextRequest) {
      if (isAdminRoute(req) && !devAdminBypassEnabled()) {
        return NextResponse.redirect(new URL("/?admin=denied", req.url));
      }
      return NextResponse.next();
    }
  : clerkMiddleware(async (auth, req) => {
      if (!isAdminRoute(req)) return;

      if (devAdminBypassEnabled()) return;

      const { userId, sessionClaims } = await auth();
      if (!userId) {
        await auth.protect();
        return;
      }

      if (!isAdminFromMetadata(sessionClaims as Record<string, unknown> | undefined)) {
        return NextResponse.redirect(new URL("/?admin=denied", req.url));
      }
    });

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
