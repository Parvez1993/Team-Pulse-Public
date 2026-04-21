import {
  Activity,
  BellRing,
  BrainCircuit,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import {
  landingPageContent,
  type LandingPageIcon,
} from "@/config/landing-page";

const iconMap: Record<LandingPageIcon, LucideIcon> = {
  activity: Activity,
  bellRing: BellRing,
  brainCircuit: BrainCircuit,
  shieldCheck: ShieldCheck,
};

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
          {landingPageContent.features.eyebrow}
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          {landingPageContent.features.title}
        </h2>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          {landingPageContent.features.description}
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {landingPageContent.features.items.map((item) => {
          const Icon = iconMap[item.icon];

          return (
            <article
              key={item.title}
              className="rounded-[1.75rem] border border-border/70 bg-card p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {item.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
