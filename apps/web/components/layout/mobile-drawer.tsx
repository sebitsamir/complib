"use client";

import { useEffect, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  side?: "left" | "bottom";
  children: ReactNode;
};

export default function MobileDrawer({
  open,
  onClose,
  title = "Menu",
  side = "left",
  children,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const panelClass =
    side === "bottom"
      ? "fixed inset-x-0 bottom-0 z-50 flex max-h-[min(85dvh,640px)] flex-col overflow-hidden rounded-t-2xl border border-border bg-background shadow-[0_-12px_40px_rgba(0,0,0,0.15)]"
      : "fixed inset-y-0 left-0 z-50 flex w-[min(100%,18rem)] flex-col border-r border-border bg-background shadow-2xl lg:w-60";

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
        aria-label="Close panel"
        onClick={onClose}
      />
      <aside className={`${panelClass} lg:hidden`} role="dialog" aria-modal="true" aria-label={title}>
        {side === "bottom" ? (
          <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-border" aria-hidden />
        ) : null}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-semibold">{title}</span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      </aside>
    </>
  );
}
