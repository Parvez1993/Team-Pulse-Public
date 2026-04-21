"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFormStatus } from "react-dom";
import { signOutAction } from "@/lib/auth/actions";

type DashboardSidebarProps = {
  name: string;
  email: string;
};

function OverviewIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}


const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", exact: true, icon: <OverviewIcon /> },
  { label: "Logs", href: "/dashboard/logs", exact: false, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg> },
  { label: "Teams", href: "/dashboard/teams", exact: false, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
];

function SidebarSignOutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg px-3 py-1.5 text-left text-xs text-sidebar-foreground/45 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground/80 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Signing out..." : "Sign out"}
    </button>
  );
}

export function DashboardSidebar({ name, email }: DashboardSidebarProps) {
  const pathname = usePathname();
  const displayName = name || email;
  const firstName = displayName.split(" ")[0] || "User";
  const userInitials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <aside className="hidden lg:flex w-[220px] shrink-0 flex-col h-screen sticky top-0 border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-[60px] items-center gap-3 border-b border-sidebar-border px-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#0f766e,#1d4ed8)] text-[11px] font-bold text-white shadow-sm">
          TP
        </div>
        <div>
          <p className="text-sm font-semibold text-sidebar-foreground leading-none">
            TeamPulse
          </p>
          <p className="mt-[3px] text-[10px] uppercase tracking-[0.14em] text-sidebar-foreground/40 leading-none">
            Workspace
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 pt-4">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/35">
          Menu
        </p>
        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-100 ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <span className={`shrink-0 transition-opacity ${active ? "opacity-100" : "opacity-50 group-hover:opacity-75"}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-teal-600 dark:bg-teal-400" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2.5 rounded-xl px-2 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0f766e,#1d4ed8)] text-xs font-semibold text-white">
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-sidebar-foreground leading-none">
              {firstName}
            </p>
            <p className="mt-[3px] truncate text-[11px] text-sidebar-foreground/45 leading-none">
              {email}
            </p>
          </div>
        </div>
        <form action={signOutAction} className="mt-0.5">
          <SidebarSignOutButton />
        </form>
      </div>
    </aside>
  );
}
