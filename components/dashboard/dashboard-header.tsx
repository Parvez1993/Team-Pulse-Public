"use client";

import { useFormStatus } from "react-dom";

import { signOutAction } from "@/lib/auth/actions";

type DashboardHeaderProps = {
  name: string;
  email: string;
};

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f766e,#1d4ed8)] text-[10px] font-semibold tracking-wide text-white ring-2 ring-background">
      {initials}
    </div>
  );
}

function LogOutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function SignOutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-muted/30 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-70"
      title={pending ? "Signing out..." : "Sign out"}
      aria-label={pending ? "Signing out..." : "Sign out"}
    >
      {pending ? (
        <span className="text-[10px] font-semibold">...</span>
      ) : (
        <LogOutIcon />
      )}
    </button>
  );
}

export function DashboardHeader({ name, email }: DashboardHeaderProps) {
  const displayName = name || email;
  const firstName = displayName.split(" ")[0];

  return (
    <header className="sticky top-0 z-30 border-b border-border/50 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: logo + nav breadcrumb */}
        <div className="flex items-center gap-4">
          {/* Logo mark */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-[linear-gradient(135deg,#0f766e,#1d4ed8)] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)]">
              <span className="text-[10px] font-bold tracking-wide text-white">TP</span>
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-foreground">
              TeamPulse
            </span>
          </div>

          {/* Separator + breadcrumb */}
          <div className="hidden items-center gap-3 sm:flex">
            <span className="text-border">/</span>
            <span className="text-[13px] font-medium text-muted-foreground">
              Dashboard
            </span>
          </div>
        </div>

        {/* Right: status + user + actions */}
        <div className="flex items-center gap-2">
          {/* Live indicator */}
          <div className="mr-1 hidden items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-2.5 py-1 sm:flex">
            <span className="h-[5px] w-[5px] animate-pulse rounded-full bg-emerald-500" />
            <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
              Live
            </span>
          </div>

          {/* User pill */}
          <div className="flex items-center gap-2 rounded-full border border-border/50 bg-muted/30 py-[5px] pl-[5px] pr-3 transition-colors hover:bg-muted/50">
            <Avatar name={displayName} />
            <div className="hidden sm:block">
              <p className="text-[12px] font-medium leading-none text-foreground">
                {firstName}
              </p>
              <p className="mt-[2px] text-[10px] leading-none text-muted-foreground/80">
                {email}
              </p>
            </div>
          </div>

          {/* Sign out button */}
          <form action={signOutAction}>
            <SignOutButton />
          </form>
        </div>
      </div>
    </header>
  );
}
