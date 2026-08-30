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

async function isAdminFromBackend(req: NextRequest): Promise<boolean> {
  const backend = process.env.COMPLIB_BACKEND_URL?.replace(/\/$/, "");
  if (!backend) return false;

  const session = req.cookies.get("__session")?.value;
  if (!session) return false;

  try {
    const res = await fetch(`${backend}/api/entitlements/me`, {
      headers: { Cookie: `__session=${session}` },
      cache: "no-store",
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { isAdmin?: boolean };
    return Boolean(data.isAdmin);
  } catch {
    return false;
  }
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

      const { userId } = await auth();
      if (!userId) {
        await auth.protect();
        return;
      }

      const isAdmin = await isAdminFromBackend(req);
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/?admin=denied", req.url));
      }
    });

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
