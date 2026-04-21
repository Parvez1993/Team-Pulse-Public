"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  AI_DAILY_SUMMARY_REFRESH_COOLDOWN_MINUTES,
  AI_DAILY_SUMMARY_REFRESH_COOLDOWN_MS,
} from "@/lib/ai/constants";
import { generateDailySummary } from "@/lib/ai/daily-summary";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/logs/actions";

function getStringField(formData: FormData, field: string) {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

async function getCurrentUser(
  supabase: Awaited<ReturnType<typeof createClient>>,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?error=Please%20sign%20in%20again.");

  return user;
}

async function getSummaryTeam({
  supabase,
  teamId,
  userId,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  teamId: string;
  userId: string;
}) {
  const { data: teamMembership } = await supabase
    .from("team_members")
    .select("role, team:teams!inner(id, name)")
    .eq("team_id", teamId)
    .eq("user_id", userId)
    .maybeSingle();

  const team = Array.isArray(teamMembership?.team)
    ? teamMembership.team[0]
    : teamMembership?.team;

  if (!teamMembership || !team || teamMembership.role === "viewer") {
    return null;
  }

  return team;
}

async function getRecentLogs(
  supabase: Awaited<ReturnType<typeof createClient>>,
  teamId: string,
) {
  const since = new Date();
  since.setHours(since.getHours() - 24);

  const { data: logs, error } = await supabase
    .from("logs")
    .select("title, description, type, severity, status, created_at")
    .eq("team_id", teamId)
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) return { logs: null, error: error.message };

  return { logs: logs ?? [], error: null };
}

async function getExistingDailySummary(
  supabase: Awaited<ReturnType<typeof createClient>>,
  teamId: string,
  summaryDate: string,
) {
  const { data } = await supabase
    .from("ai_daily_summaries")
    .select("generated_at")
    .eq("team_id", teamId)
    .eq("summary_date", summaryDate)
    .maybeSingle();

  return data;
}

function getSummaryRefreshRemainingMs(generatedAt: string) {
  const generatedTime = new Date(generatedAt).getTime();
  const elapsedMs = Date.now() - generatedTime;

  return Math.max(0, AI_DAILY_SUMMARY_REFRESH_COOLDOWN_MS - elapsedMs);
}

function formatSummaryCooldownMessage(remainingMs: number) {
  const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));

  return `You can refresh this summary again in ${remainingMinutes} minute${
    remainingMinutes === 1 ? "" : "s"
  }.`;
}

export async function generateDailySummaryAction(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const teamId = getStringField(formData, "teamId");

  if (!teamId) return { error: "Team is required for AI summary." };

  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  const team = await getSummaryTeam({ supabase, teamId, userId: user.id });

  if (!team) return { error: "You cannot generate AI summaries for this team." };

  const summaryDate = new Date().toISOString().slice(0, 10);
  const existingSummary = await getExistingDailySummary(supabase, teamId, summaryDate);

  if (existingSummary?.generated_at) {
    const remainingMs = getSummaryRefreshRemainingMs(existingSummary.generated_at);

    if (remainingMs > 0) {
      return { error: formatSummaryCooldownMessage(remainingMs) };
    }
  }

  const { logs, error: logsError } = await getRecentLogs(supabase, teamId);
  if (logsError || !logs) return { error: logsError ?? "Could not fetch logs." };

  let summaryText: string;

  if (!logs.length) {
    summaryText = "No team activity was logged in the last 24 hours.";
  } else {
    try {
      summaryText = await generateDailySummary({ teamName: team.name, logs });
    } catch (err) {
      return {
        error:
          err instanceof Error
            ? err.message
            : "We could not generate the AI summary right now.",
      };
    }
  }

  const { error: upsertError } = await supabase
    .from("ai_daily_summaries")
    .upsert(
      {
        team_id: teamId,
        summary_date: summaryDate,
        summary_text: summaryText,
        generated_from_log_count: logs.length,
        generated_by: user.id,
        generated_at: new Date().toISOString(),
      },
      { onConflict: "team_id,summary_date" },
    );

  if (upsertError) return { error: upsertError.message };

  revalidatePath("/dashboard");

  return {
    success: `Summary generated. Refresh available in ${AI_DAILY_SUMMARY_REFRESH_COOLDOWN_MINUTES} minutes.`,
  };
}
