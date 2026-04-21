"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import {
  createInvitationAction,
  removeInvitationAction,
} from "@/lib/invitations/actions";
import { createTeamAction } from "@/lib/teams/actions";
import { RoleBadge } from "./badges";
import { SubmitButton } from "./submit-button";

export type TeamSummary = {
  id: string;
  name: string;
  created_at: string;
  role: "admin" | "member" | "viewer";
};

export type InvitationSummary = {
  id: string;
  team_id: string;
  email: string;
  role: "admin" | "member" | "viewer";
  status: "pending" | "accepted" | "revoked";
  created_at: string;
};

function CreateTeamForm() {
  const [state, formAction] = useActionState(createTeamAction, null);

  useEffect(() => {
    if (!state) return;
    if ("success" in state) toast.success(state.success);
    if ("error" in state) toast.error(state.error);
  }, [state]);

  return (
    <div className="rounded-[1.65rem] border border-border/60 bg-card shadow-[0_18px_50px_-28px_rgba(15,23,42,0.32)]">
      <div className="border-b border-border/50 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 ring-1 ring-blue-500/10">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" x2="19" y1="8" y2="14" />
              <line x1="22" x2="16" y1="11" y2="11" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-tight">New workspace</h2>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Create a team and start inviting members.
            </p>
          </div>
        </div>
      </div>
      <form action={formAction} className="p-5">
        <div className="flex gap-2.5">
          <input
            id="teamName"
            name="teamName"
            type="text"
            placeholder="e.g. Atlas Platform Team"
            className="h-10 flex-1 rounded-xl border border-border/80 bg-background px-3 text-sm outline-none transition focus:border-foreground/30 focus:ring-4 focus:ring-primary/5 placeholder:text-muted-foreground/50"
          />
          <SubmitButton
            idleLabel="Create"
            pendingLabel="Creating..."
            className="h-10 shrink-0 rounded-xl px-4 text-sm shadow-sm"
          />
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Keep the name broad enough for your full team.
        </p>
      </form>
    </div>
  );
}

function PendingInviteRow({ invitation }: { invitation: InvitationSummary }) {
  const [state, formAction] = useActionState(removeInvitationAction, null);

  useEffect(() => {
    if (!state) return;
    if ("success" in state) toast.success(state.success);
    if ("error" in state) toast.error(state.error);
  }, [state]);

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/80 px-3 py-2.5">
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-foreground">
          {invitation.email}
        </p>
        <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
          {invitation.role}
        </p>
      </div>
      <form action={formAction} className="shrink-0">
        <input type="hidden" name="invitationId" value={invitation.id} />
        <input type="hidden" name="email" value={invitation.email} />
        <SubmitButton
          idleLabel="Remove"
          pendingLabel="Removing..."
          className="rounded-lg px-2 py-1 text-[11px] font-medium text-destructive/80 ring-1 ring-destructive/20 hover:bg-destructive/10 hover:text-destructive hover:ring-destructive/30"
        />
      </form>
    </div>
  );
}

function InviteForm({ teamId }: { teamId: string }) {
  const [state, formAction] = useActionState(createInvitationAction, null);

  useEffect(() => {
    if (!state) return;
    if ("success" in state) toast.success(state.success);
    if ("error" in state) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="teamId" value={teamId} />
      <input
        id={`invite-email-${teamId}`}
        name="email"
        type="email"
        placeholder="teammate@company.com"
        className="h-9 w-full rounded-xl border border-border/80 bg-background px-3 text-xs outline-none transition focus:border-foreground/30 focus:ring-4 focus:ring-primary/5 placeholder:text-muted-foreground/50"
      />
      <div className="flex items-center gap-2">
        <select
          id={`invite-role-${teamId}`}
          name="role"
          defaultValue="member"
          className="h-9 flex-1 rounded-xl border border-border/80 bg-background px-2 text-xs outline-none transition focus:border-foreground/30 focus:ring-4 focus:ring-primary/5"
        >
          <option value="member">Member</option>
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
        <SubmitButton
          idleLabel="Send invite"
          pendingLabel="Sending..."
          className="h-9 shrink-0 rounded-xl px-3 text-xs shadow-sm"
        />
      </div>
    </form>
  );
}

function TeamCard({
  team,
  pendingInvites,
}: {
  team: TeamSummary;
  pendingInvites: InvitationSummary[];
}) {
  const isAdmin = team.role === "admin";
  const initials = [...team.name].slice(0, 2).join("").toUpperCase();

  return (
    <div className="rounded-[1.5rem] border border-border/60 bg-card shadow-[0_18px_40px_-28px_rgba(15,23,42,0.3)]">
      <div className="flex items-start gap-3 border-b border-border/50 px-5 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,rgba(15,118,110,0.12),rgba(29,78,216,0.12))] text-sm font-bold text-foreground ring-1 ring-border/40">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold leading-tight tracking-tight text-foreground">
            {team.name}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Since{" "}
            {new Date(team.created_at).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <RoleBadge role={team.role} />
      </div>

      <div className="space-y-4 p-4">
        {isAdmin ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Invite a teammate
              </p>
              <span className="rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {pendingInvites.length} pending
              </span>
            </div>
            <InviteForm teamId={team.id} />

            {pendingInvites.length > 0 && (
              <div className="space-y-2 border-t border-border/50 pt-3">
                {pendingInvites.slice(0, 4).map((invite) => (
                  <PendingInviteRow key={invite.id} invitation={invite} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-border/60 bg-muted/20 px-3.5 py-3">
            <p className="text-xs font-medium text-foreground">
              Invite access is limited
            </p>
            <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
              Only admins can invite new teammates into this workspace.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function TeamListSection({
  teams,
  invitations,
}: {
  teams: TeamSummary[];
  invitations: InvitationSummary[];
}) {
  return (
    <div className="space-y-4 xl:sticky xl:top-24">
      <CreateTeamForm />

      {teams.length === 0 ? (
        <div className="rounded-[1.65rem] border border-dashed border-border/70 bg-card p-8 text-center shadow-[0_18px_50px_-28px_rgba(15,23,42,0.18)]">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-border/70 bg-muted/40">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h2 className="mt-4 text-sm font-semibold tracking-tight text-foreground">No workspaces yet</h2>
          <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
            Create your first workspace to start inviting teammates and tracking logs.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 px-1">
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-foreground">Workspaces</h2>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Manage membership and team access.</p>
            </div>
            <span className="rounded-full border border-border/60 bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {teams.length}
            </span>
          </div>

          <div className="space-y-4">
            {teams.map((team) => {
              const pendingInvites = invitations.filter(
                (inv) => inv.team_id === team.id && inv.status === "pending",
              );
              return (
                <TeamCard key={team.id} team={team} pendingInvites={pendingInvites} />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
