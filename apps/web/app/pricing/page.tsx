import Footer from "@/layouts/Footer";
import SiteHeader from "@/layouts/Header";
import PricingPageClerk from "./PricingPageClerk";

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <PricingPageClerk />
      <Footer />
    </div>
  );
}
