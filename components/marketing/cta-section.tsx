import Link from "next/link";

import { Button } from "@/components/ui/button";
import { landingPageContent } from "@/config/landing-page";

export function CtaSection() {
  return (
    <section id="cta" className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
      <div className="rounded-[2rem] border border-border/70 bg-card px-6 py-12 shadow-sm sm:px-10">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
          {landingPageContent.cta.eyebrow}
        </p>
        <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
          {landingPageContent.cta.title}
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
          {landingPageContent.cta.description}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/register">Create Account</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
