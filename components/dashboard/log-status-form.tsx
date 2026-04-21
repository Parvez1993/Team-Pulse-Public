"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { updateLogStatusAction } from "@/lib/logs/actions";
import { SubmitButton } from "./submit-button";

type LogStatus = "open" | "in_progress" | "resolved" | "done";

const statusSelectClass: Record<LogStatus, string> = {
  open: "border-slate-500/20 bg-slate-500/5 text-slate-700 dark:text-slate-300",
  in_progress: "border-blue-500/20 bg-blue-500/5 text-blue-700 dark:text-blue-300",
  resolved: "border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300",
  done: "border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300",
};

export function LogStatusForm({
  logId,
  status,
}: {
  logId: string;
  status: LogStatus;
}) {
  const [state, formAction] = useActionState(updateLogStatusAction, null);

  useEffect(() => {
    if (!state) return;
    if ("success" in state) toast.success(state.success);
    if ("error" in state) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="flex items-center gap-1.5">
      <input type="hidden" name="logId" value={logId} />
      <select
        name="status"
        defaultValue={status}
        className={`h-8 cursor-pointer rounded-lg border px-2.5 text-[11px] font-medium outline-none transition hover:border-border focus:border-foreground/30 ${statusSelectClass[status]}`}
      >
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="done">Done</option>
      </select>
      <SubmitButton
        idleLabel="Save"
        pendingLabel="Saving..."
        className="h-8 shrink-0 rounded-lg px-2.5 text-[11px]"
      />
    </form>
  );
}
