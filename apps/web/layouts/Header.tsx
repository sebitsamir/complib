"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import ThemeToggle from "@/components/theme-toggle";
import { MotionNavLink } from "@/components/motion/motion-link";
import HeaderAuth from "@/layouts/HeaderAuth";

type SiteHeaderProps = {
  title?: string;
  subtitle?: string;
};

export default function SiteHeader({ title, subtitle }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 shrink-0 border-b backdrop-blur-md transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled
          ? "border-border/80 bg-background/92 shadow-sm shadow-black/5 dark:shadow-black/30"
          : "border-border bg-background/80"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-[1920px] items-center justify-between gap-4 px-5 lg:px-8">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <div className="ml-1 shrink-0 sm:ml-2">
            <Logo href="/" size="sm" />
          </div>
          {title ? (
            <>
              <span
                className="hidden h-6 w-px shrink-0 bg-border sm:block"
                aria-hidden
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {title}
                </p>
                {subtitle ? (
                  <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
                ) : null}
              </div>
            </>
          ) : null}
        </div>

        <nav className="mr-2 flex shrink-0 items-center gap-0.5 text-sm sm:mr-4 sm:gap-1">
          <MotionNavLink
            href="/components"
            className="rounded-lg px-2 py-1.5 transition-colors hover:text-accent sm:px-3"
          >
            Explorer
          </MotionNavLink>

          <MotionNavLink
            href="/playground"
            className="rounded-lg px-2 py-1.5 transition-colors hover:text-accent sm:px-3"
          >
            Playground
          </MotionNavLink>

          <MotionNavLink
            href="/pricing"
            className="rounded-lg px-2 py-1.5 transition-colors hover:text-accent sm:px-3"
          >
            Pricing
          </MotionNavLink>
        </nav>

        <div className="mr-1 flex shrink-0 items-center gap-2 text-sm sm:mr-2 sm:gap-3">
          <ThemeToggle />
          <HeaderAuth />
        </div>
      </div>
    </header>
  );
}
