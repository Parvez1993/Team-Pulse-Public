import { AiDailySummaryCard } from "@/components/dashboard/ai-daily-summary-card";
import { LogsSection, type WritableTeamSummary } from "@/components/dashboard/logs-section";
import { LOG_ATTACHMENTS_BUCKET } from "@/lib/logs/constants";
import { getDateBounds, getLogFilters } from "@/lib/logs/filter-utils";
import { createClient } from "@/lib/supabase/server";
import type { LogSummary } from "./logs-section";

type TeamOption = { id: string; name: string };

type LogsFeedProps = {
  teamIds: string[];
  writableTeams: WritableTeamSummary[];
  teams: TeamOption[];
  summaryTeamId: string | null;
  summaryTeamName: string | null;
  summaryTeamRole: "admin" | "member" | "viewer" | null;
  searchParams: Record<string, string>;
};

async function getLogList(
  supabase: Awaited<ReturnType<typeof createClient>>,
  teamIds: string[],
  filters: ReturnType<typeof getLogFilters>,
): Promise<LogSummary[]> {
  if (!teamIds.length) return [];

  let query = supabase
    .from("logs")
    .select(
      "id, title, description, type, severity, status, file_url, updated_at, created_at, team:teams(id, name)",
    )
    .in("team_id", teamIds);

  if (filters.team) query = query.eq("team_id", filters.team);
  if (filters.type) query = query.eq("type", filters.type);
  if (filters.severity) query = query.eq("severity", filters.severity);
  if (filters.status) query = query.eq("status", filters.status);

  if (filters.q) {
    const escaped = filters.q.replace(/[%_,]/g, "\\$&");
    query = query.or(
      `title.ilike.%${escaped}%,description.ilike.%${escaped}%`,
    );
  }

  const { start, end } = getDateBounds(filters);
  if (start) query = query.gte("created_at", start);
  if (end) query = query.lt("created_at", end);

  const { data: logs } = await query
    .order("created_at", { ascending: filters.sort === "oldest" })
    .limit(20);

  const attachmentUrls = new Map<string, string>();

  await Promise.all(
    (logs ?? []).map(async (log) => {
      if (!log.file_url) return;
      const { data } = await supabase.storage
        .from(LOG_ATTACHMENTS_BUCKET)
        .createSignedUrl(log.file_url, 60 * 60);
      if (data?.signedUrl) attachmentUrls.set(log.id, data.signedUrl);
    }),
  );

  return (logs ?? []).map((log) => {
    const team = Array.isArray(log.team) ? log.team[0] : log.team;
    const attachmentName = log.file_url
      ?.split("/")
      .pop()
      ?.replace(/^[0-9a-f-]+-/, "");

    return {
      id: log.id,
      title: log.title,
      description: log.description,
      type: log.type,
      severity: log.severity,
      status: log.status,
      file_url: log.file_url,
      attachment_url: attachmentUrls.get(log.id) ?? null,
      attachment_name: attachmentName ?? null,
      updated_at: log.updated_at,
      created_at: log.created_at,
      team: team ? { id: team.id, name: team.name } : null,
    };
  }) satisfies LogSummary[];
}

async function getDailySummary(
  supabase: Awaited<ReturnType<typeof createClient>>,
  teamId: string | null,
) {
  if (!teamId) return null;

  const { data } = await supabase
    .from("ai_daily_summaries")
    .select("summary_text, summary_date, generated_at, generated_from_log_count")
    .eq("team_id", teamId)
    .order("generated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data;
}

// This is a Server Component — it owns all log-related data fetching.
// Wrapped in <Suspense> in the page so only this section re-renders
// when filters change, keeping the rest of the dashboard stable.
export async function LogsFeed({
  teamIds,
  writableTeams,
  teams,
  summaryTeamId,
  summaryTeamName,
  summaryTeamRole,
  searchParams,
}: LogsFeedProps) {
  const supabase = await createClient();
  const filters = getLogFilters(searchParams, teamIds);
  const [logList, dailySummary] = await Promise.all([
    getLogList(supabase, teamIds, filters),
    getDailySummary(supabase, summaryTeamId),
  ]);

  const summaryTeam =
    summaryTeamId && summaryTeamName && summaryTeamRole
      ? { id: summaryTeamId, name: summaryTeamName, role: summaryTeamRole }
      : null;

  const attentionLogs = logList
    .filter((l) => l.status === "open" || l.status === "in_progress")
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

  const activityLogs = logList
    .filter((l) => l.status === "resolved" || l.status === "done")
    .slice(0, 10);

  return (
    <div className="space-y-4">
      <AiDailySummaryCard team={summaryTeam} summary={dailySummary} />
      <LogsSection
        writableTeams={writableTeams}
        attentionLogs={attentionLogs}
        activityLogs={activityLogs}
        teams={teams}
        filters={filters}
      />
    </div>
  );
}
