"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useAuth, useClerk, useUser } from "@clerk/nextjs";
import { useEntitlements } from "@/lib/use-entitlements";

type ClerkUser = NonNullable<ReturnType<typeof useUser>["user"]>;

function userInitials(user: ClerkUser | null | undefined) {
  const first = user?.firstName?.trim()?.[0] ?? "";
  const last = user?.lastName?.trim()?.[0] ?? "";
  if (first || last) return `${first}${last}`.toUpperCase();

  const fallback =
    user?.username?.trim() ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "?";
  return fallback.slice(0, 2).toUpperCase();
}

function planBadge(entitlements: ReturnType<typeof useEntitlements>) {
  if (entitlements.plan === "ENTERPRISE") {
    return { label: "Enterprise", isPro: true };
  }
  if (entitlements.plan === "PRO" || entitlements.canViewSource) {
    return { label: "Pro", isPro: true };
  }
  return { label: "Free", isPro: false };
}

function UserAvatar({
  user,
  size = "sm",
}: {
  user: ClerkUser | null | undefined;
  size?: "sm" | "md";
}) {
  const sizeClass = size === "md" ? "h-10 w-10 text-sm" : "h-8 w-8 text-[11px]";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-muted font-semibold text-foreground ${sizeClass}`}
      aria-hidden
    >
      {userInitials(user)}
    </span>
  );
}

type MenuLinkProps = {
  href: string;
  icon: ReactNode;
  label: string;
  hint?: string;
  onNavigate: () => void;
};

function MenuLink({ href, icon, label, hint, onNavigate }: MenuLinkProps) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onNavigate}
      className="group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-muted/70"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border/70 bg-background text-muted-foreground transition-colors group-hover:text-foreground">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-foreground">{label}</span>
        {hint ? (
          <span className="block truncate text-xs text-muted-foreground">{hint}</span>
        ) : null}
      </span>
    </Link>
  );
}

function IconPlayground() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18M3 9h6" />
    </svg>
  );
}

function IconLibrary() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function IconPricing() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function IconLogOut() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function UserAccountMenu() {
  const { user } = useUser();
  const entitlements = useEntitlements();
  const { signOut, openUserProfile } = useClerk();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const displayName =
    user?.fullName?.trim() ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress ||
    "Your account";
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const plan = planBadge(entitlements);
  const memberSince = user?.createdAt
    ? new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(user.createdAt)
    : null;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const close = () => setOpen(false);

  const copyUserId = async () => {
    if (!user?.id) return;
    try {
      await navigator.clipboard.writeText(user.id);
      setCopied(true);
    } catch {
      // ignore
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut({ redirectUrl: "/" });
    } finally {
      setSigningOut(false);
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Account menu for ${displayName}`}
        className={`rounded-full transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 ${
          open ? "ring-2 ring-border shadow-sm" : "hover:shadow-sm"
        }`}
      >
        <UserAvatar user={user} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(17.5rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-border bg-background shadow-xl"
        >
          <div className="border-b border-border px-3 py-3">
            <div className="flex items-center gap-3">
              <UserAvatar user={user} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
                {email ? (
                  <p className="truncate text-xs text-muted-foreground">{email}</p>
                ) : null}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  plan.isPro
                    ? "bg-accent text-accent-foreground"
                    : "border border-border bg-muted text-muted-foreground"
                }`}
              >
                {plan.label} plan
              </span>
              {memberSince ? (
                <span className="text-[10px] text-muted-foreground">Since {memberSince}</span>
              ) : null}
            </div>

            {user?.id ? (
              <button
                type="button"
                onClick={() => void copyUserId()}
                className="mt-3 flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-muted/40 px-2.5 py-1.5 text-left transition-colors hover:bg-muted/70"
              >
                <span className="truncate font-mono text-[10px] text-muted-foreground">
                  {user.id}
                </span>
                <span className="shrink-0 text-[10px] font-semibold text-foreground">
                  {copied ? "Copied" : "Copy"}
                </span>
              </button>
            ) : null}
          </div>

          <div className="space-y-0.5 p-2">
            <p className="px-2.5 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Workspace
            </p>
            <MenuLink
              href="/playground"
              icon={<IconPlayground />}
              label="Playground"
              hint="Build and export pages"
              onNavigate={close}
            />
            <MenuLink
              href="/components"
              icon={<IconLibrary />}
              label="Explorer"
              hint="Browse the component catalog"
              onNavigate={close}
            />
            <MenuLink
              href="/pricing"
              icon={<IconPricing />}
              label="Billing & plans"
              hint={plan.isPro ? "Manage subscription" : "Upgrade to Pro"}
              onNavigate={close}
            />
          </div>

          <div className="space-y-0.5 border-t border-border p-2">
            <p className="px-2.5 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Account
            </p>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                close();
                openUserProfile();
              }}
              className="group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-muted/70"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border/70 bg-background text-muted-foreground transition-colors group-hover:text-foreground">
                <IconSettings />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-foreground">Account settings</span>
                <span className="block text-xs text-muted-foreground">Profile, security, sessions</span>
              </span>
            </button>
          </div>

          <div className="border-t border-border p-2">
            <button
              type="button"
              role="menuitem"
              disabled={signingOut}
              onClick={() => void handleSignOut()}
              className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground disabled:opacity-60"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border/70 bg-background">
                <IconLogOut />
              </span>
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function HeaderAuthClerk() {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 animate-pulse rounded-full bg-muted" aria-hidden />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex items-center gap-2 sm:gap-2.5">
        <Link
          href="/sign-in"
          className="inline-flex h-9 items-center rounded-lg border border-border bg-background px-3 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted sm:px-4"
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          className="inline-flex h-9 items-center rounded-lg bg-accent px-3 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:opacity-90 sm:px-4"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return <UserAccountMenu />;
}
