import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const clerkDisabled = process.env.NEXT_PUBLIC_DISABLE_CLERK_DEV === "true";

export default clerkDisabled
  ? function passthroughProxy() {
      return NextResponse.next();
    }
  : clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
