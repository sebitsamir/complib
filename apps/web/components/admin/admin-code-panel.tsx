"use client";

import { adm } from "@/components/admin/admin-shell";

export type CodeTab = "html" | "css" | "js";

type Props = {
  html: string;
  css: string;
  js: string;
  activeTab: CodeTab;
  onTabChange: (tab: CodeTab) => void;
  onChange: (tab: CodeTab, value: string) => void;
  htmlError?: boolean;
  cssError?: boolean;
};

function lineCount(text: string) {
  return text.split("\n").length;
}

export default function AdminCodePanel({
  html,
  css,
  js,
  activeTab,
  onTabChange,
  onChange,
  htmlError,
  cssError,
}: Props) {
  const values: Record<CodeTab, string> = { html, css, js };
  const hasClUi = /\bcl-ui\b/.test(html);

  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-background shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 bg-muted/25 px-3 py-2">
        <div className={adm.codeTabs} role="tablist">
          {(["html", "css", "js"] as const).map((tab) => {
            const err = tab === "html" ? htmlError : tab === "css" ? cssError : false;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => onTabChange(tab)}
                className={`${adm.codeTab} ${
                  activeTab === tab ? adm.codeTabActive : adm.codeTabIdle
                } ${err ? "text-red-600 dark:text-red-400" : ""}`}
              >
                {tab.toUpperCase()}
                <span className="ml-1.5 font-normal text-muted-foreground">
                  {lineCount(values[tab])}
                </span>
              </button>
            );
          })}
        </div>
        <span
          className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
            hasClUi
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "bg-amber-500/10 text-amber-800 dark:text-amber-200"
          }`}
        >
          {hasClUi ? "cl-ui root ✓" : 'Needs class="cl-ui"'}
        </span>
      </div>
      <textarea
        value={values[activeTab]}
        onChange={(e) => onChange(activeTab, e.target.value)}
        spellCheck={false}
        aria-label={`${activeTab.toUpperCase()} source`}
        className={`${adm.textarea} min-h-[min(52vh,520px)] rounded-none border-0 font-mono text-[12px] leading-relaxed focus:ring-0`}
        placeholder={
          activeTab === "html"
            ? '<article class="cl-ui cl-card" data-size="md" data-tone="default">…</article>'
            : activeTab === "css"
              ? ".cl-card { … }"
              : "// Optional runtime (vanilla.js)"
        }
      />
    </div>
  );
}
