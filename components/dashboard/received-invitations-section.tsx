"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import { acceptInvitationAction } from "@/lib/invitations/actions";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "./badges";

export type ReceivedInvitationSummary = {
  id: string;
  email: string;
  role: "admin" | "member" | "viewer";
  status: "pending" | "accepted" | "revoked";
  created_at: string;
  team: {
    id: string;
    name: string;
  } | null;
};

function InvitationCard({
  invitation,
}: {
  invitation: ReceivedInvitationSummary;
}) {
  const [state, formAction] = useActionState(acceptInvitationAction, null);
  const teamName = invitation.team?.name ?? "Unknown team";
  const initials = [...teamName].slice(0, 2).join("").toUpperCase();

  useEffect(() => {
    if (!state) return;
    if ("success" in state) toast.success(state.success);
    if ("error" in state) toast.error(state.error);
  }, [state]);

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-purple-500/20 bg-purple-500/5 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-sm font-bold text-purple-700 dark:text-purple-300">
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight text-foreground">
            {teamName}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <RoleBadge role={invitation.role} />
            <span className="text-[11px] text-muted-foreground">
              {invitation.email}
            </span>
          </div>
        </div>
      </div>

      <form action={formAction} className="shrink-0">
        <input type="hidden" name="invitationId" value={invitation.id} />
        <Button type="submit" size="sm" className="h-8 rounded-xl px-3 text-xs">
          Accept
        </Button>
      </form>
    </div>
  );
}

export function ReceivedInvitationsSection({
  invitations,
}: {
  invitations: ReceivedInvitationSummary[];
}) {
  if (!invitations.length) return null;

  return (
    <div className="rounded-2xl border border-purple-500/20 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-semibold">Team invitations</h2>
          <p className="text-[11px] text-muted-foreground">
            You have been invited to join {invitations.length === 1 ? "a team" : `${invitations.length} teams`}.
          </p>
        </div>
        <span className="rounded-full border border-purple-500/25 bg-purple-500/10 px-2.5 py-1 text-[11px] font-semibold text-purple-700 dark:text-purple-400">
          {invitations.length} pending
        </span>
      </div>

      <div className="space-y-2">
        {invitations.map((invitation) => (
          <InvitationCard key={invitation.id} invitation={invitation} />
        ))}
      </div>
    </div>
  );
}
