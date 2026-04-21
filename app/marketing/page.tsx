import type { Metadata } from "next";

import { LandingPage } from "@/components/marketing/landing-page";
import { landingPageContent } from "@/config/landing-page";

export const metadata: Metadata = {
  title: `Marketing | ${landingPageContent.brand.name}`,
  description: landingPageContent.metadata.description,
};

export default function MarketingPage() {
  return <LandingPage />;
}
