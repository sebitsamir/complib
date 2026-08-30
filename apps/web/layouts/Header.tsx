"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import ThemeToggle from "@/components/theme-toggle";
import { MotionNavLink } from "@/components/motion/motion-link";
import HeaderAuth from "@/layouts/HeaderAuth";
import MobileNavMenu from "@/components/layout/mobile-nav-menu";

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
      <div className="mx-auto flex h-14 max-w-[1920px] items-center justify-between gap-2 px-4 sm:gap-4 sm:px-5 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4 md:gap-6">
          <div className="shrink-0 sm:ml-1">
            <Logo href="/" size="sm" />
          </div>
          {title ? (
            <>
              <span
                className="hidden h-6 w-px shrink-0 bg-border md:block"
                aria-hidden
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{title}</p>
                {subtitle ? (
                  <p className="hidden truncate text-xs text-muted-foreground sm:block">
                    {subtitle}
                  </p>
                ) : null}
              </div>
            </>
          ) : null}
        </div>

        <nav className="hidden shrink-0 items-center gap-0.5 text-sm lg:flex lg:gap-1">
          <MotionNavLink
            href="/components"
            className="rounded-lg px-3 py-1.5 transition-colors hover:text-accent"
          >
            Explorer
          </MotionNavLink>
          <MotionNavLink
            href="/playground"
            className="rounded-lg px-3 py-1.5 transition-colors hover:text-accent"
          >
            Playground
          </MotionNavLink>
          <MotionNavLink
            href="/pricing"
            className="rounded-lg px-3 py-1.5 transition-colors hover:text-accent"
          >
            Pricing
          </MotionNavLink>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
          <ThemeToggle />
          <HeaderAuth />
          <MobileNavMenu />
        </div>
      </div>
    </header>
  );
}
