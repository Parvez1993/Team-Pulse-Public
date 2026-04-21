import Link from "next/link";

import { Button } from "@/components/ui/button";
import { landingPageContent } from "@/config/landing-page";

import { DashboardPreview } from "@/components/marketing/dashboard-preview";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.22),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.16),transparent_30%)]"
      />

      <div className="mx-auto grid min-h-[calc(100vh-73px)] w-full max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
        <section aria-labelledby="hero-title" className="max-w-3xl">
          <p className="inline-flex items-center rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            {landingPageContent.hero.eyebrow}
          </p>

          <h1
            id="hero-title"
            className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight  sm:text-6xl lg:text-6xl"
          >
            {landingPageContent.hero.title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            {landingPageContent.hero.description}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/register">Create Account</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={landingPageContent.hero.secondaryCta.href}>
                {landingPageContent.hero.secondaryCta.label}
              </Link>
            </Button>
          </div>

          <dl className="mt-12 grid gap-6 border-t border-border/60 pt-8 text-sm text-muted-foreground sm:grid-cols-3">
            {landingPageContent.hero.stats.map((stat) => (
              <div key={stat.title}>
                <dt className="font-medium text-foreground">{stat.title}</dt>
                <dd className="mt-2">{stat.description}</dd>
              </div>
            ))}
          </dl>
        </section>

        <DashboardPreview />
      </div>
    </section>
  );
}
