import Link from "next/link";
import SiteHeader from "@/layouts/Header";

const SECTIONS = [
  { href: "/docs/getting-started", title: "Getting started", description: "Install CompLib and explore your first component." },
  { href: "/docs/playground", title: "Playground", description: "Compose pages, customize variants, and export projects." },
  { href: "/docs/exports", title: "Exports", description: "Vanilla, React, Vue, and scaffold bundles." },
  { href: "/docs/accessibility", title: "Accessibility", description: "Guidance for shipping accessible UI with CompLib." },
];

export default function DocsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader title="Documentation" subtitle="Learn CompLib" />
      <main className="container mx-auto max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-2xl font-bold sm:text-3xl">CompLib docs</h1>
        <p className="mt-3 text-muted-foreground">
          Discover, preview, customize, assemble, export, and reuse production-ready UI components.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-xl border border-border bg-card/40 p-5 hover:border-accent/40"
            >
              <h2 className="font-semibold">{section.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{section.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
