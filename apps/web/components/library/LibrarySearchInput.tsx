"use client";

import { useEffect, useState } from "react";
import { IconSearch } from "@/components/playground/playground-shell";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  debounceMs?: number;
  autoFocus?: boolean;
};

export default function LibrarySearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Search components…",
  className = "",
  inputClassName = "",
  debounceMs = 0,
  autoFocus = false,
}: Props) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (debounceMs <= 0) return;
    const id = window.setTimeout(() => {
      if (draft !== value) onChange(draft);
    }, debounceMs);
    return () => window.clearTimeout(id);
  }, [debounceMs, draft, onChange, value]);

  const handleChange = (next: string) => {
    setDraft(next);
    if (debounceMs <= 0) onChange(next);
  };

  return (
    <form
      className={`relative ${className}`}
      onSubmit={(event) => {
        event.preventDefault();
        onChange(draft);
        onSubmit?.(draft);
      }}
    >
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <IconSearch />
      </span>
      <input
        type="search"
        value={draft}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label="Search components"
        className={`h-9 w-full rounded-lg border border-border/70 bg-background pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 ${inputClassName}`}
      />
    </form>
  );
}
