import { CtaSection } from "@/components/marketing/cta-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { HeroSection } from "@/components/marketing/hero-section";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { WorkflowSection } from "@/components/marketing/workflow-section";

export function LandingPage() {
  return (
    <>
      <SiteHeader />

      <main id="main-content">
        <HeroSection />
        <FeaturesSection />
        <WorkflowSection />
        <CtaSection />
      </main>

      <SiteFooter />
    </>
  );
}
