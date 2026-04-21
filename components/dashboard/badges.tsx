type LogType = "activity" | "error" | "incident";
type LogSeverity = "low" | "medium" | "high" | "critical";
type LogStatus = "open" | "in_progress" | "resolved" | "done";
type TeamRole = "admin" | "member" | "viewer";

const TYPE_STYLES: Record<LogType, string> = {
  activity: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  error: "bg-red-500/10 text-red-600 dark:text-red-400",
  incident: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
};

const SEVERITY_STYLES: Record<LogSeverity, string> = {
  low: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  high: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  critical: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const STATUS_STYLES: Record<LogStatus, string> = {
  open: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  in_progress: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  resolved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  done: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

const ROLE_STYLES: Record<TeamRole, string> = {
  admin: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  member: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  viewer: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
};

const STATUS_LABELS: Record<LogStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  done: "Done",
};

function Badge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-transparent px-2.5 py-1 text-[11px] font-semibold tracking-[0.01em] capitalize ${className}`}
    >
      {label}
    </span>
  );
}

export function TypeBadge({ type }: { type: LogType }) {
  return <Badge label={type} className={TYPE_STYLES[type]} />;
}

export function SeverityBadge({ severity }: { severity: LogSeverity }) {
  return <Badge label={severity} className={SEVERITY_STYLES[severity]} />;
}

export function StatusBadge({ status }: { status: LogStatus }) {
  return (
    <Badge label={STATUS_LABELS[status]} className={STATUS_STYLES[status]} />
  );
}

export function RoleBadge({ role }: { role: TeamRole }) {
  return <Badge label={role} className={ROLE_STYLES[role]} />;
}
