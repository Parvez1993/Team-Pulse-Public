import Link from "next/link";

import { Button } from "@/components/ui/button";
import { landingPageContent } from "@/config/landing-page";

export function SiteHeader() {
  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {landingPageContent.brand.name}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {landingPageContent.navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">Create Account</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
