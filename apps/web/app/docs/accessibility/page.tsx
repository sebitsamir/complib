import Link from "next/link";
import SiteHeader from "@/layouts/Header";

export default function AccessibilityDocsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader title="Accessibility" subtitle="Documentation" />
      <main className="docs-prose container mx-auto max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <h1>Accessibility</h1>
        <p>
          CompLib components ship with accessibility guidance in the registry. Each component
          can include documentation for keyboard support, ARIA roles, and focus management.
        </p>
        <h2>Best practices</h2>
        <ul>
          <li>Preview components with keyboard-only navigation before exporting.</li>
          <li>Check contrast when applying custom themes or design tokens.</li>
          <li>Read the accessibility tab on each <Link href="/components">component detail</Link> page.</li>
          <li>Validate exported pages with your own automated a11y test suite.</li>
        </ul>
        <p>
          Registry metadata includes an <code>accessibility</code> field synced from component
          manifests during catalog publish.
        </p>
      </main>
    </div>
  );
}
