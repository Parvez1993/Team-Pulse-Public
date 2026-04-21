import type { Metadata } from "next";

import { LandingPage } from "@/components/marketing/landing-page";
import { landingPageContent } from "@/config/landing-page";

export const metadata: Metadata = {
  title: landingPageContent.metadata.title,
  description: landingPageContent.metadata.description,
};

export default function HomePage() {
  return <LandingPage />;
}
