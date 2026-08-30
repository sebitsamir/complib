"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { Reveal } from "@/components/motion/reveal";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <Reveal className="mx-auto flex max-w-[1920px] flex-col gap-10 px-6 py-10 sm:flex-row sm:justify-between sm:px-10 lg:px-14">
        <div className="max-w-sm">
          <Logo href="/" size="md" />
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Copy-paste UI components with live preview, playground composition, and
            Vanilla / React / Vue exports — without the design-system tax.
          </p>
        </div>

        <div className="flex flex-wrap gap-12 sm:gap-16">
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-bold text-foreground">Product</h2>
            <Link
              href="/components"
              className="text-xs text-muted-foreground transition-colors hover:text-accent"
            >
              Explorer
            </Link>
            <Link
              href="/playground"
              className="text-xs text-muted-foreground transition-colors hover:text-accent"
            >
              Playground
            </Link>
            <Link
              href="/pricing"
              className="text-xs text-muted-foreground transition-colors hover:text-accent"
            >
              Pricing
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-bold text-foreground">Account</h2>
            <Link
              href="/sign-in"
              className="text-xs text-muted-foreground transition-colors hover:text-accent"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="text-xs text-muted-foreground transition-colors hover:text-accent"
            >
              Create account
            </Link>
            <Link
              href="/admin"
              className="text-xs text-muted-foreground transition-colors hover:text-accent"
            >
              Admin
            </Link>
          </div>
        </div>
      </Reveal>

      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-[1920px] flex-col gap-3 px-6 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-14">
          <p>© 2026 CompLib. All rights reserved.</p>
          <nav className="flex flex-wrap gap-4 sm:gap-6">
            <Link href="/privacy" className="transition-colors hover:text-accent">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-accent">
              Terms
            </Link>
            <Link href="/license" className="transition-colors hover:text-accent">
              License
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
