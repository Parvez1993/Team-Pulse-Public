"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { generateDailySummaryAction } from "@/lib/ai/actions";
import { AI_DAILY_SUMMARY_REFRESH_COOLDOWN_MS } from "@/lib/ai/constants";

function getSummaryRefreshRemainingMs(generatedAt: string) {
  const generatedTime = new Date(generatedAt).getTime();
  const elapsedMs = Date.now() - generatedTime;

  return Math.max(0, AI_DAILY_SUMMARY_REFRESH_COOLDOWN_MS - elapsedMs);
}

function formatCooldownRemaining(remainingMs: number) {
  const totalMinutes = Math.ceil(remainingMs / (60 * 1000));

  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (!minutes) {
      return `${hours}h`;
    }

    return `${hours}h ${minutes}m`;
  }

  return `${totalMinutes}m`;
}

function GenerateButton({
  hasExisting,
  cooldownRemainingMs,
}: {
  hasExisting: boolean;
  cooldownRemainingMs: number;
}) {
  const { pending } = useFormStatus();
  const isCoolingDown = hasExisting && cooldownRemainingMs > 0;

  return (
    <Button
      type="submit"
      size="sm"
      disabled={pending || isCoolingDown}
      className="h-9 rounded-xl px-4"
    >
      {pending
        ? "Generating…"
        : isCoolingDown
          ? `Refresh in ${formatCooldownRemaining(cooldownRemainingMs)}`
          : hasExisting
            ? "Refresh summary"
            : "Generate summary"}
    </Button>
  );
}

type SummaryTeam = {
  id: string;
  name: string;
  role: "admin" | "member" | "viewer";
} | null;

type DailySummary = {
  summary_text: string;
  summary_date: string;
  generated_at: string;
  generated_from_log_count: number;
} | null;

function formatGeneratedAt(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getCooldownHelperText(summary: DailySummary) {
  if (!summary?.generated_at) {
    return null;
  }

  const remainingMs = getSummaryRefreshRemainingMs(summary.generated_at);

  if (remainingMs <= 0) {
    return "Refresh is available now.";
  }

  return `Refresh available in ${formatCooldownRemaining(remainingMs)}.`;
}

function SummaryForm({
  teamId,
  hasExisting,
  cooldownRemainingMs,
}: {
  teamId: string;
  hasExisting: boolean;
  cooldownRemainingMs: number;
}) {
  const [state, formAction] = useActionState(generateDailySummaryAction, null);

  useEffect(() => {
    if (!state) return;
    if ("success" in state) toast.success(state.success);
    if ("error" in state) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction}>
      <input type="hidden" name="teamId" value={teamId} />
      <GenerateButton hasExisting={hasExisting} cooldownRemainingMs={cooldownRemainingMs} />
    </form>
  );
}

export function AiDailySummaryCard({
  team,
  summary,
}: {
  team: SummaryTeam;
  summary: DailySummary;
}) {
  const cooldownRemainingMs = summary?.generated_at
    ? getSummaryRefreshRemainingMs(summary.generated_at)
    : 0;

  if (!team) {
    return (
      <div
        id="ai-summary"
        className="rounded-[1.65rem] border border-border/60 bg-card p-5 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.32)]"
      >
        <h2 className="text-sm font-semibold tracking-tight">AI Daily Summary</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Create or join a team first to generate a summary.
        </p>
      </div>
    );
  }

  return (
    <div
      id="ai-summary"
      className="rounded-[1.65rem] border border-border/60 bg-card shadow-[0_18px_50px_-28px_rgba(15,23,42,0.32)]"
    >
      <div className="flex items-start justify-between gap-4 border-b border-border/50 px-5 py-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            AI Summary
          </p>
          <h2 className="mt-1 text-sm font-semibold tracking-tight">
            Last 24 hours for {team.name}
          </h2>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Manual generation only, so you stay in control of API cost.
          </p>
        </div>
        {team.role !== "viewer" ? (
          <SummaryForm
            teamId={team.id}
            hasExisting={Boolean(summary)}
            cooldownRemainingMs={cooldownRemainingMs}
          />
        ) : null}
      </div>

      <div className="space-y-4 px-5 py-5">
        {summary ? (
          <>
            <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
              <span className="rounded-full border border-border/60 bg-muted/50 px-2.5 py-1">
                {summary.generated_from_log_count} logs used
              </span>
              <span className="rounded-full border border-border/60 bg-muted/50 px-2.5 py-1">
                Generated {formatGeneratedAt(summary.generated_at)}
              </span>
              <span className="rounded-full border border-border/60 bg-muted/50 px-2.5 py-1">
                {getCooldownHelperText(summary)}
              </span>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="whitespace-pre-line text-sm leading-7 text-foreground/90">
                {summary.summary_text}
              </p>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-4">
            <p className="text-sm text-muted-foreground">
              No summary generated yet for this team today.
            </p>
          </div>
        )}

        {team.role === "viewer" ? (
          <p className="text-xs text-muted-foreground">
            Viewers can read summaries but cannot generate them.
          </p>
        ) : null}
      </div>
    </div>
  );
}
