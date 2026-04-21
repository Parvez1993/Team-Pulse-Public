import { landingPageContent } from "@/config/landing-page";

export function WorkflowSection() {
  return (
    <section
      id="workflow"
      className="border-y border-border/60 bg-muted/30 px-6 py-20 lg:px-8"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-3">
        {landingPageContent.workflowSteps.map((step) => (
          <article
            key={step.title}
            className="rounded-[1.75rem] border border-border/70 bg-background p-6"
          >
            <p className="text-sm font-medium text-muted-foreground">
              {step.step}
            </p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">
              {step.title}
            </h3>
            <p className="mt-4 leading-7 text-muted-foreground">
              {step.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
