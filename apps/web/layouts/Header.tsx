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
      className={`relative sticky top-0 z-40 shrink-0 border-b transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled
          ? "border-border/80 shadow-sm shadow-black/5 dark:shadow-black/30"
          : "border-border"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-0 backdrop-blur-md ${
          scrolled ? "bg-background/92" : "bg-background/80"
        }`}
        aria-hidden
      />
      <div className="relative mx-auto flex h-14 max-w-[1920px] items-center gap-2 px-3 sm:gap-3 sm:px-5 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 md:gap-5">
          <div className="shrink-0">
            <Logo href="/" size="sm" wordmark={!title} />
          </div>
          {title ? (
            <>
              <span
                className="hidden h-6 w-px shrink-0 bg-border sm:block"
                aria-hidden
              />
              <div className="min-w-0 max-w-[42vw] sm:max-w-none">
                <p className="truncate text-sm font-semibold text-foreground">{title}</p>
                {subtitle ? (
                  <p className="hidden truncate text-xs text-muted-foreground md:block">
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

        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5 md:gap-2">
          <ThemeToggle />
          <HeaderAuth />
          <MobileNavMenu />
        </div>
      </div>
    </header>
  );
}
