type Stats = {
  teamCount: number;
  pendingInviteCount: number;
  openLogCount: number;
  resolvedLogCount: number;
};

function TeamsStatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function OpenStatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ResolvedStatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function InviteStatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon,
  accent,
}: {
  label: string;
  value: number;
  hint: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${accent}`}>
          {icon}
        </div>
      </div>
      <p className="mt-4 text-[2rem] font-semibold leading-none tabular-nums tracking-tight">
        {value}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

export function DashboardIntro({
  firstName,
  error,
  success,
  stats,
}: {
  firstName: string;
  error?: string;
  success?: string;
  stats: Stats;
}) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-5">
      {/* Greeting row */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Overview
          </p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-foreground">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{today}</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/8 px-3 py-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          Live workspace
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Teams"
          value={stats.teamCount}
          hint="active workspaces"
          icon={<TeamsStatIcon />}
          accent="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          label="Open"
          value={stats.openLogCount}
          hint="logs in motion"
          icon={<OpenStatIcon />}
          accent="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />
        <StatCard
          label="Resolved"
          value={stats.resolvedLogCount}
          hint="closed out"
          icon={<ResolvedStatIcon />}
          accent="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label="Invites"
          value={stats.pendingInviteCount}
          hint="pending action"
          icon={<InviteStatIcon />}
          accent={
            stats.pendingInviteCount > 0
              ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
              : "bg-muted text-muted-foreground"
          }
        />
      </div>

      {/* Inline alerts */}
      {(error || success) && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            error
              ? "border-destructive/30 bg-destructive/5 text-destructive"
              : "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
          }`}
        >
          {error ?? success}
        </div>
      )}
    </div>
  );
}

const STEPS = [
  {
    step: "01",
    title: "Create a team",
    description:
      "Set up the workspace where members, roles, and logs live together.",
  },
  {
    step: "02",
    title: "Invite the right people",
    description:
      "Keep access clean by assigning admins, members, and viewers intentionally.",
  },
  {
    step: "03",
    title: "Track work with logs",
    description:
      "Use status and severity so daily work stays visible instead of disappearing in history.",
  },
];

export function NextStepsSection() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold tracking-tight">
          Get started in 3 steps
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything you need to have your workspace running today.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {STEPS.map((step) => (
          <div
            key={step.step}
            className="rounded-xl border border-border/50 bg-muted/20 p-4"
          >
            <span className="text-xs font-bold tabular-nums text-muted-foreground/60">
              {step.step}
            </span>
            <h3 className="mt-2.5 text-sm font-semibold">{step.title}</h3>
            <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
