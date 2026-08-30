import Link from "next/link";
import SiteHeader from "@/layouts/Header";

export const metadata = {
  title: "Terms | CompLib",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader title="Terms" subtitle="Service terms of use" />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          By using CompLib you agree to use the library, playground, and exports
          in accordance with your plan. Free components may be used in personal
          and commercial projects. Pro-locked source requires an active Pro
          subscription to download.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          CompLib is provided as-is. Plan details and limits are described on{" "}
          <Link href="/pricing" className="font-medium text-blue-600 hover:underline">
            Pricing
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
