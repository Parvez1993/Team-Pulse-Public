import { landingPageContent } from "@/config/landing-page";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 px-6 py-8 text-sm text-muted-foreground lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>{landingPageContent.brand.name}</p>
        <p>{landingPageContent.brand.footerTagline}</p>
      </div>
    </footer>
  );
}
