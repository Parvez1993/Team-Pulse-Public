import { landingPageContent } from "@/config/landing-page";

export function DashboardPreview() {
  return (
    <aside
      aria-label="Dashboard preview"
      className="rounded-[2rem] border border-border/70 bg-card/80 p-5 shadow-[0_30px_90px_rgba(15,23,42,0.14)] backdrop-blur"
    >
      <div className="rounded-[1.5rem] border border-border/70 bg-background p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              {landingPageContent.preview.heading}
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {landingPageContent.preview.status}
            </p>
          </div>
          <span className="rounded-full bg-emerald-500/12 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            {landingPageContent.preview.badge}
          </span>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {landingPageContent.preview.cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-border/70 bg-card p-4"
            >
              <p className="text-sm text-muted-foreground">{card.title}</p>
              {card.kind === "stat" ? (
                <>
                  <p className="mt-2 text-3xl font-semibold">{card.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {card.detail}
                  </p>
                </>
              ) : (
                <p className="mt-2 text-sm leading-6 text-foreground">
                  {card.content}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {landingPageContent.preview.alerts.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm text-muted-foreground"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
