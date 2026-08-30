"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LibraryNavTabs() {
  const pathname = usePathname();
  const playgroundActive =
    pathname === "/playground" || pathname.startsWith("/playground/");
  const browseActive =
    pathname === "/components" || pathname.startsWith("/components/");

  return (
    <div
      className="flex rounded-lg border border-zinc-700/90 bg-zinc-900/80 p-0.5 text-xs font-semibold shadow-inner shadow-black/20"
      role="navigation"
      aria-label="Library views"
    >
      <Link
        href="/components"
        className={`rounded-md px-3 py-1.5 transition-colors ${
          browseActive
            ? "bg-zinc-800 text-white shadow-sm"
            : "text-zinc-500 hover:text-zinc-200"
        }`}
      >
        Browse
      </Link>
      <Link
        href="/playground"
        className={`rounded-md px-3 py-1.5 transition-colors ${
          playgroundActive
            ? "bg-zinc-800 text-white shadow-sm"
            : "text-zinc-500 hover:text-zinc-200"
        }`}
      >
        Playground
      </Link>
    </div>
  );
}

