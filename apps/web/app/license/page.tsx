import Link from "next/link";
import SiteHeader from "@/layouts/Header";

export const metadata = {
  title: "License | CompLib",
};

export default function LicensePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader title="License" subtitle="Component usage rights" />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight">License</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Components you export from CompLib may be used in your products
          according to your subscription tier. Redistributing CompLib itself as
          a competing component library is not permitted.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Browse the catalog in the{" "}
          <Link href="/components" className="font-medium text-blue-600 hover:underline">
            Explorer
          </Link>{" "}
          or assemble pages in the{" "}
          <Link href="/playground" className="font-medium text-blue-600 hover:underline">
            Playground
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
