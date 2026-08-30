"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { MotionNavLink } from "@/components/motion/motion-link";

const NAV_LINKS = [
  { href: "/components", label: "Explorer" },
  { href: "/playground", label: "Playground" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
  { href: "/dashboard", label: "My CompLib" },
] as const;

type Props = {
  className?: string;
};

export default function MobileNavMenu({ className = "" }: Props) {
  const { isLoaded, userId } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={`lg:hidden ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 bg-background text-foreground transition-colors hover:bg-muted"
        aria-label="Open menu"
        aria-expanded={open}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <nav
            className="fixed inset-y-0 right-0 z-50 flex w-[min(100%,18rem)] flex-col border-l border-border bg-background shadow-2xl"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-sm font-semibold">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Close menu"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
              {NAV_LINKS.map((link) => (
                <MotionNavLink
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {link.label}
                </MotionNavLink>
              ))}
            </div>
            {isLoaded && !userId ? (
              <div className="border-t border-border p-4 text-xs text-muted-foreground">
                <Link href="/sign-in" onClick={() => setOpen(false)} className="font-semibold text-foreground hover:text-accent">
                  Sign in
                </Link>
                {" · "}
                <Link href="/sign-up" onClick={() => setOpen(false)} className="font-semibold text-foreground hover:text-accent">
                  Sign up
                </Link>
              </div>
            ) : null}
          </nav>
        </>
      ) : null}
    </div>
  );
}
