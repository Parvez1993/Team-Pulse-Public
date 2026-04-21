import type { Metadata } from "next";
import Link from "next/link";

import { githubOAuthAction, registerAction } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

type RegisterPageProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a TeamPulse account for your team.",
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const params = (await searchParams) ?? {};
  const inputClassName =
    "h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-foreground/30 focus:ring-4 focus:ring-primary/5";

  return (
    <section className="w-full max-w-lg rounded-[2rem] border border-border/70 bg-card/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:p-10">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Get Started Free
        </p>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Create your account
          </h1>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Set up your TeamPulse workspace and invite your team in minutes.
          </p>
        </div>
      </div>

      {(params.error || params.success) && (
        <div
          className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
            params.error
              ? "border-destructive/30 bg-destructive/5 text-destructive"
              : "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
          }`}
        >
          {params.error ?? params.success}
        </div>
      )}

      <form
        action={registerAction}
        className="mt-8 space-y-5 border-t border-border/60 pt-8"
        aria-label="Create account"
      >
        <input type="hidden" name="authView" value="register" />
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Jane Smith"
              className={inputClassName}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="workspace" className="text-sm font-medium text-foreground">
              Workspace Name
            </label>
            <input
              id="workspace"
              name="workspace"
              type="text"
              placeholder="Acme Inc."
              className={inputClassName}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Work Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className={inputClassName}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Password
            </label>
            <span className="text-xs text-muted-foreground">
              8+ characters
            </span>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a strong password"
            className={inputClassName}
          />
        </div>

        <div className="space-y-3 pt-1">
          <Button type="submit" className="w-full">
            Create Account
          </Button>

          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              or
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="submit"
            variant="outline"
            className="w-full gap-2"
            formAction={githubOAuthAction}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 shrink-0"
              aria-hidden="true"
              fill="currentColor"
            >
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
            </svg>
            Sign up with GitHub
          </Button>
        </div>

        <p className="text-xs leading-5 text-muted-foreground">
          By creating an account you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
            Privacy Policy
          </Link>
          .
        </p>

      </form>

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-border/60 pt-6 text-sm">
        <p className="text-muted-foreground">Already have an account?</p>
        <Link
          href="/login"
          className="font-medium text-foreground underline underline-offset-4"
        >
          Log in
        </Link>
      </div>
    </section>
  );
}
