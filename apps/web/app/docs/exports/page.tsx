import Link from "next/link";
import SiteHeader from "@/layouts/Header";

export default function ExportsDocsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader title="Exports" subtitle="Documentation" />
      <main className="container mx-auto max-w-3xl flex-1 px-6 py-10 prose prose-neutral dark:prose-invert">
        <h1>Exports</h1>
        <p>
          CompLib generates framework-specific bundles from the same component registry and
          variant engine used in the explorer and playground.
        </p>
        <h2>Supported targets</h2>
        <ul>
          <li><strong>Vanilla</strong> — HTML, CSS, and JavaScript files merged into a zip.</li>
          <li><strong>React</strong> — Component modules generated from registry metadata.</li>
          <li><strong>Vue</strong> — Single-file components with scoped styles.</li>
          <li><strong>Scaffold</strong> — Vite or Next.js starter projects (Pro plan).</li>
        </ul>
        <p>
          Pro and Enterprise plans unlock source access for paid-tier components. Exports
          validate dependencies and resolve component slugs from the registry before packaging.
        </p>
        <p>
          Try exporting from the <Link href="/playground">playground</Link> after composing a page.
        </p>
      </main>
    </div>
  );
}
