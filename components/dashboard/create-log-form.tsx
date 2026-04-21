"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { LOG_ATTACHMENT_MAX_SIZE_BYTES } from "@/lib/logs/constants";
import { createLogAction } from "@/lib/logs/actions";
import type { WritableTeamSummary } from "./logs-section";
import { CreateLogSubmitButton } from "./create-log-submit-button";

function fieldClass(extra = "") {
  return `h-10 w-full rounded-xl border border-border/80 bg-background px-3 text-sm outline-none transition focus:border-foreground/30 focus:ring-4 focus:ring-primary/5 ${extra}`;
}

export function CreateLogForm({
  teams,
}: {
  teams: WritableTeamSummary[];
}) {
  const [state, formAction] = useActionState(createLogAction, null);

  useEffect(() => {
    if (!state) return;
    if ("success" in state) toast.success(state.success);
    if ("error" in state) toast.error(state.error);
  }, [state]);

  if (!teams.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card p-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/70 bg-muted/50">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-muted-foreground">
            <path fillRule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="mt-4 text-sm font-semibold">No writable team yet</h3>
        <p className="mt-1.5 max-w-[240px] text-xs leading-5 text-muted-foreground">
          Join or create a team as admin or member to start logging.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[1.65rem] border border-border/60 bg-card shadow-[0_18px_50px_-28px_rgba(15,23,42,0.32)]">
      <div className="border-b border-border/50 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#0f766e,#1d4ed8)]/10 ring-1 ring-teal-500/10">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-teal-700 dark:text-teal-400">
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-tight">New log entry</h2>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Capture work, issues, and incidents in one place.
            </p>
          </div>
        </div>
      </div>
      <form action={formAction} className="p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="title" className="text-xs font-medium text-foreground">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Stripe webhook failed"
              className={`${fieldClass()} placeholder:text-muted-foreground/50`}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="teamId" className="text-xs font-medium text-foreground">
              Team
            </label>
            <select id="teamId" name="teamId" defaultValue={teams[0]?.id} className={fieldClass()}>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="type" className="text-xs font-medium text-foreground">
              Type
            </label>
            <select id="type" name="type" defaultValue="activity" className={fieldClass()}>
              <option value="activity">Activity</option>
              <option value="error">Error</option>
              <option value="incident">Incident</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="severity" className="text-xs font-medium text-foreground">
              Severity
            </label>
            <select id="severity" name="severity" defaultValue="low" className={fieldClass()}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="status" className="text-xs font-medium text-foreground">
              Status
            </label>
            <select id="status" name="status" defaultValue="open" className={fieldClass()}>
              <option value="open">Open</option>
              <option value="in_progress">In progress</option>
              <option value="resolved">Resolved</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="description" className="text-xs font-medium text-foreground">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="What happened, what was affected, and any next steps."
              className={`${fieldClass("h-auto py-2.5")} resize-none placeholder:text-muted-foreground/50`}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="attachment" className="text-xs font-medium text-foreground">
              Attachment
            </label>
            <input
              id="attachment"
              name="attachment"
              type="file"
              className={`${fieldClass("h-auto cursor-pointer py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-foreground")} text-xs text-muted-foreground`}
              accept=".jpg,.jpeg,.png,.webp,.pdf,.txt,.csv,.json"
            />
            <p className="text-[11px] text-muted-foreground">
              Optional. Upload up to {Math.floor(LOG_ATTACHMENT_MAX_SIZE_BYTES / (1024 * 1024))}MB:
              JPG, PNG, WEBP, PDF, TXT, CSV, or JSON.
            </p>
          </div>
        </div>
        <CreateLogSubmitButton />
      </form>
    </div>
  );
}
