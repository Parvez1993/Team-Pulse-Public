import type { LogDateRange, LogSortOption } from "@/lib/logs/constants";
import { CreateLogForm } from "./create-log-form";
import { LogAttachmentLink } from "./log-attachment-link";
import { SeverityBadge, StatusBadge, TypeBadge } from "./badges";
import { LogFiltersBar } from "./log-filters-bar";
import { LogStatusForm } from "./log-status-form";

export type WritableTeamSummary = {
  id: string;
  name: string;
  role: "admin" | "member";
};

export type LogSummary = {
  id: string;
  title: string;
  description: string;
  type: "activity" | "error" | "incident";
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "done";
  file_url: string | null;
  attachment_url: string | null;
  attachment_name: string | null;
  updated_at: string;
  created_at: string;
  team: {
    id: string;
    name: string;
  } | null;
};

export type LogFilters = {
  q: string;
  team: string;
  type: "" | "activity" | "error" | "incident";
  severity: "" | "low" | "medium" | "high" | "critical";
  status: "" | "open" | "in_progress" | "resolved" | "done";
  dateRange: LogDateRange;
  sort: LogSortOption;
  from: string;
  to: string;
};

const SEVERITY_BAR: Record<LogSummary["severity"], string> = {
  low: "bg-emerald-500",
  medium: "bg-amber-500",
  high: "bg-orange-500",
  critical: "bg-red-500",
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}


function LogRow({ log, variant = "activity" }: { log: LogSummary; variant?: "activity" | "attention" }) {
  const age = variant === "attention" ? getOpenAge(log.created_at) : null;

  return (
    <div className="group flex items-start gap-3 rounded-2xl px-4 py-3.5 transition-colors hover:bg-muted/25">
      <div className={`mt-1.5 h-8 w-0.75 shrink-0 rounded-full ${SEVERITY_BAR[log.severity]}`} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <TypeBadge type={log.type} />
          <SeverityBadge severity={log.severity} />
          <span className="text-sm font-semibold leading-snug tracking-tight text-foreground">
            {log.title}
          </span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          {log.team && (
            <span className="text-[11px] font-medium text-foreground/80">{log.team.name}</span>
          )}
          {log.team && <span className="text-muted-foreground/40">·</span>}
          {age ? (
            <span className={`text-[11px] font-medium ${age.urgent ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}>
              {log.status === "in_progress" ? "In Progress" : "Open"} · {age.label}
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground">{formatDate(log.created_at)}</span>
          )}
        </div>
        {log.description ? (
          <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-muted-foreground">
            {log.description}
          </p>
        ) : null}
        {log.attachment_url && log.attachment_name ? (
          <div className="mt-3">
            <LogAttachmentLink href={log.attachment_url} name={log.attachment_name} />
          </div>
        ) : null}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        {variant === "activity" && <StatusBadge status={log.status} />}
        <LogStatusForm logId={log.id} status={log.status} />
      </div>
    </div>
  );
}

function getOpenAge(createdAt: string): { label: string; urgent: boolean } {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return { label: "just now", urgent: false };
  if (diffHours < 24) return { label: `${diffHours}h`, urgent: false };
  if (diffDays < 3) return { label: `${diffDays}d`, urgent: false };
  return { label: `${diffDays}d`, urgent: true }; // 3+ days = urgent
}

function NeedsAttentionFeed({ logs }: { logs: LogSummary[] }) {
  const openCount = logs.filter((l) => l.status === "open").length;
  const inProgressCount = logs.filter((l) => l.status === "in_progress").length;

  return (
    <div className="rounded-[1.65rem] border border-border/60 bg-card shadow-[0_18px_50px_-28px_rgba(15,23,42,0.18)]">
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Needs Attention</h2>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Open and in-progress items, oldest first.
            </p>
          </div>
          {logs.length > 0 && (
            <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[11px] font-semibold text-red-600 dark:text-red-400">
              {logs.length}
            </span>
          )}
        </div>
        {logs.length > 0 && (
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            {openCount > 0 && <span>{openCount} open</span>}
            {inProgressCount > 0 && <span>{inProgressCount} in progress</span>}
          </div>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-emerald-600 dark:text-emerald-400">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="mt-3 text-sm font-semibold text-foreground">All clear</p>
          <p className="mt-1 text-xs text-muted-foreground">
            No open items — your team is on top of things.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/40 py-1">
          {logs.map((log) => (
            <LogRow key={log.id} log={log} variant="attention" />
          ))}
        </div>
      )}
    </div>
  );
}

function RecentActivityFeed({ logs }: { logs: LogSummary[] }) {
  return (
    <div className="rounded-[1.65rem] border border-border/60 bg-card shadow-[0_18px_50px_-28px_rgba(15,23,42,0.18)]">
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Recent Activity</h2>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Last resolved and completed items.
            </p>
          </div>
          {logs.length > 0 && (
            <span className="rounded-full border border-border/60 bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {logs.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-[11px] text-muted-foreground">Live</span>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
          <p className="text-sm font-semibold text-foreground">No resolved items yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Resolved and done logs will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/40 py-1">
          {logs.map((log) => (
            <LogRow key={log.id} log={log} />
          ))}
        </div>
      )}
    </div>
  );
}

export function LogsSection({
  writableTeams,
  attentionLogs,
  activityLogs,
  teams,
  filters,
}: {
  writableTeams: WritableTeamSummary[];
  attentionLogs: LogSummary[];
  activityLogs: LogSummary[];
  teams: { id: string; name: string }[];
  filters: LogFilters;
}) {
  const totalCount = attentionLogs.length + activityLogs.length;

  return (
    <div className="space-y-4">
      <CreateLogForm teams={writableTeams} />
      <LogFiltersBar teams={teams} filters={filters} resultCount={totalCount} />
      <NeedsAttentionFeed logs={attentionLogs} />
      <RecentActivityFeed logs={activityLogs} />
    </div>
  );
}
