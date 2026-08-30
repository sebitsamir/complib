import LandingPage from "@/components/landing/landing-page";
import Footer from "@/layouts/Footer";
import SiteHeader from "@/layouts/Header";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <LandingPage />
      <Footer />
    </div>
  );
}
