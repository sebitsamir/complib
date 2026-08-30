import Link from "next/link";
import SiteHeader from "@/layouts/Header";

export const metadata = {
  title: "Privacy | CompLib",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader title="Privacy" subtitle="How we handle your data" />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          CompLib stores account data required for authentication, billing, and
          library preferences (recent and favorite components). We do not sell
          personal data. Preview and export activity stay on your account.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Questions about privacy can be directed through your account contact
          channels. For product access and plans, see{" "}
          <Link href="/pricing" className="font-medium text-blue-600 hover:underline">
            Pricing
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
