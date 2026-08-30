import Link from "next/link";
import SiteHeader from "@/layouts/Header";

export default function PlaygroundDocsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader title="Playground" subtitle="Documentation" />
      <main className="container mx-auto max-w-3xl flex-1 px-6 py-10 prose prose-neutral dark:prose-invert">
        <h1>Playground</h1>
        <p>
          The playground is where you compose multiple CompLib components into a single page,
          customize variants, preview the result, and export production-ready bundles.
        </p>
        <h2>Workflow</h2>
        <ol>
          <li>Open the <Link href="/playground">playground</Link>.</li>
          <li>Add components from the library rail or quick-insert menu.</li>
          <li>Adjust variants and layout in the canvas.</li>
          <li>Export as vanilla HTML/CSS/JS, React, Vue, or a scaffold project.</li>
        </ol>
        <p>
          Playground state is saved locally in your browser. Favorites, recents, and collections
          sync to your account when signed in.
        </p>
      </main>
    </div>
  );
}
