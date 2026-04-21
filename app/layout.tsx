import type { Metadata } from "next";
import "@/app/globals.css";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001",
  ),
  title: {
    default: "TeamPulse | AI-Powered Team Activity Monitoring",
    template: "%s | TeamPulse",
  },
  description:
    "Monitor team activity, incidents, and recurring issues in real time with AI-powered summaries and anomaly detection.",
  applicationName: "TeamPulse",
  keywords: [
    "team monitoring dashboard",
    "activity logs",
    "incident tracking",
    "AI summaries",
    "Next.js SaaS",
  ],
  authors: [{ name: "Mohammed Parvez" }],
  creator: "Mohammed Parvez",
  publisher: "Mohammed Parvez",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TeamPulse | AI-Powered Team Activity Monitoring",
    description:
      "Track team logs in real time, surface anomalies, and summarize operational activity with AI.",
    url: "/",
    siteName: "TeamPulse",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TeamPulse | AI-Powered Team Activity Monitoring",
    description:
      "Track team logs in real time, surface anomalies, and summarize operational activity with AI.",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
