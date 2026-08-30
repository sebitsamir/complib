import Link from "next/link";
import SiteHeader from "@/layouts/Header";

export default function GettingStartedPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader title="Getting started" subtitle="Documentation" />
      <main className="docs-prose container mx-auto max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <h1>Getting started</h1>
        <ol>
          <li>Browse the <Link href="/components">component explorer</Link>.</li>
          <li>Open a component preview and customize variants.</li>
          <li>Add components to the <Link href="/playground">playground</Link> to compose a page.</li>
          <li>Export vanilla, React, or Vue bundles when you are ready to ship.</li>
        </ol>
        <p>
          Component source lives in the monorepo <code>storage/</code> tree. The API indexes
          components into PostgreSQL and serves registry metadata at <code>/api/registry/:slug</code>.
        </p>
      </main>
    </div>
  );
}
