"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Component } from "@/lib/component-store";

type Tab = "preview" | "html" | "css" | "js";

function buildSrcDoc(html: string, css: string, js: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:32px;background:#06060b;}
${css}
</style>
</head>
<body>${html}<script>${js}<\/script></body>
</html>`;
}

type Props = {
  component: Component;
  codeLocked: boolean;
};

export default function ComponentViewer({ component, codeLocked }: Props) {
  const [tab, setTab] = useState<Tab>("preview");
  const [copied, setCopied] = useState(false);

  const iframeSrcDoc = useMemo(
    () => buildSrcDoc(component.html, component.css, component.js),
    [component.html, component.css, component.js],
  );

  const previewSrc = `/api/preview/${encodeURIComponent(component.slug)}`;

  const copyCode = async () => {
    if (codeLocked) return;
    const map: Record<Tab, string> = {
      preview: component.html,
      html: component.html,
      css: component.css,
      js: component.js,
    };
    await navigator.clipboard.writeText(map[tab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-background">
      <div className="flex h-[480px] items-center bg-muted/40 p-8 dark:bg-[#06060b]">
        {codeLocked ? (
          <iframe
            src={previewSrc}
            className="h-full w-full max-w-4xl rounded-2xl border border-border"
            sandbox="allow-scripts allow-same-origin"
            title={component.name}
          />
        ) : (
          <iframe
            srcDoc={iframeSrcDoc}
            className="h-full w-full max-w-4xl rounded-2xl border border-zinc-700"
            sandbox="allow-scripts"
            title={component.name}
          />
        )}
      </div>

      <div className="flex flex-wrap border-t border-zinc-800 bg-zinc-950">
        {(["preview", "html", "css", "js"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-6 py-4 text-sm font-mono transition-all sm:px-8 ${
              tab === t
                ? "border-b-2 border-yellow-400 text-yellow-400"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}

        <button
          type="button"
          onClick={copyCode}
          disabled={codeLocked}
          className="ml-auto flex items-center gap-2 px-6 py-4 text-sm font-medium text-yellow-400 disabled:cursor-not-allowed disabled:opacity-40 sm:px-8"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {tab !== "preview" && codeLocked ? (
        <div className="flex max-h-96 flex-col items-center justify-center gap-4 bg-zinc-950 p-12 text-center">
          <p className="max-w-md text-zinc-300">
            HTML, CSS, and JS for this Pro component are only available to Pro
            subscribers. The preview above is visible to everyone.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/sign-in"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Sign in
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border border-zinc-600 px-5 py-2.5 text-sm font-semibold text-zinc-200 hover:border-zinc-500"
            >
              View Pro
            </Link>
          </div>
        </div>
      ) : null}

      {tab !== "preview" && !codeLocked ? (
        <pre className="max-h-96 overflow-auto bg-muted/50 p-8 font-mono text-sm text-foreground dark:bg-[#06060b] dark:text-zinc-300">
          <code>
            {tab === "html"
              ? component.html
              : tab === "css"
                ? component.css
                : component.js}
          </code>
        </pre>
      ) : null}
    </div>
  );
}
