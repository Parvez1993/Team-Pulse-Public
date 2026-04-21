import type { Metadata } from "next";
import Link from "next/link";

import { githubOAuthAction, loginAction } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Log In",
  description: "Access your TeamPulse workspace.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};

  return (
    <section className="w-full max-w-md rounded-[2rem] border border-border/70 bg-card p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Welcome Back
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Log in to TeamPulse</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Access your workspace with email or GitHub.
        </p>
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
        action={loginAction}
        className="mt-8 space-y-5"
        aria-describedby="login-help"
      >
        <input type="hidden" name="authView" value="login" />
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Work Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@company.com"
            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-foreground/30"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-foreground/30"
          />
        </div>

        <div className="space-y-3">
          <Button type="submit" className="w-full">
            Continue with Email
          </Button>
          <Button
            type="submit"
            variant="outline"
            className="w-full"
            formAction={githubOAuthAction}
          >
            Continue with GitHub
          </Button>
        </div>

      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        Need an account?{" "}
        <Link href="/register" className="font-medium text-foreground underline">
          Create one
        </Link>
      </p>
    </section>
  );
}
