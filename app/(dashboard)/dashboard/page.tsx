import { Suspense } from "react";
import type { Metadata } from "next";

import {
  DashboardIntro,
  NextStepsSection,
} from "@/components/dashboard/dashboard-overview";
import { LogsFeed } from "@/components/dashboard/logs-feed";
import { LogsFeedSkeleton } from "@/components/dashboard/logs-feed-skeleton";
import { LogsRealtimeListener } from "@/components/dashboard/logs-realtime-listener";
import {
  ReceivedInvitationsSection,
  type ReceivedInvitationSummary,
} from "@/components/dashboard/received-invitations-section";
import {
  type InvitationSummary,
  TeamListSection,
} from "@/components/dashboard/team-list-section";
import type { WritableTeamSummary } from "@/components/dashboard/logs-section";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "TeamPulse workspace overview.",
};

type DashboardPageProps = {
  searchParams?: Promise<Record<string, string>>;
};

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;
type TeamListSectionProps = Parameters<typeof TeamListSection>[0];
type TeamSummary = TeamListSectionProps["teams"][number];
type DashboardStatsProps = Parameters<typeof DashboardIntro>[0]["stats"];

type DashboardPageData = {
  firstName: string;
  hasTeams: boolean;
  invitations: InvitationSummary[];
  params: Record<string, string>;
  receivedInvitationList: ReceivedInvitationSummary[];
  stats: DashboardStatsProps;
  summaryTeam: TeamSummary | null;
  teamIds: string[];
  teamList: TeamListSectionProps["teams"];
  teams: { id: string; name: string }[];
  writableTeams: WritableTeamSummary[];
};

async function getTeamList(supabase: SupabaseClient, userId: string) {
  const { data: memberships } = await supabase
    .from("team_members")
    .select("role, team:teams!inner(id, name, created_at)")
    .eq("user_id", userId)
    .order("joined_at", { ascending: false });

  return (memberships ?? []).flatMap((m) => {
    const team = Array.isArray(m.team) ? m.team[0] : m.team;
    if (!team) return [];
    return [{ id: team.id, name: team.name, created_at: team.created_at, role: m.role }];
  });
}

async function getManagedInvitations(supabase: SupabaseClient, teamIds: string[]) {
  if (!teamIds.length) return [] as InvitationSummary[];
  const { data } = await supabase
    .from("invitations")
    .select("id, team_id, email, role, status, created_at")
    .in("team_id", teamIds)
    .order("created_at", { ascending: false });
  return data ?? [];
}

async function getReceivedInvitationList(
  supabase: SupabaseClient,
  currentUserEmail: string | null,
) {
  if (!currentUserEmail) return [] as ReceivedInvitationSummary[];

  const { data } = await supabase
    .from("invitations")
    .select("id, email, role, status, created_at, team:teams(id, name)")
    .eq("status", "pending")
    .eq("email", currentUserEmail.toLowerCase())
    .order("created_at", { ascending: false });

  return (data ?? []).map((inv) => {
    const team = Array.isArray(inv.team) ? inv.team[0] : inv.team;
    return {
      id: inv.id,
      email: inv.email,
      role: inv.role,
      status: inv.status,
      created_at: inv.created_at,
      team: team ? { id: team.id, name: team.name } : null,
    };
  }) satisfies ReceivedInvitationSummary[];
}

// Lightweight COUNT query — does not change with filters, keeps stats stable
async function getOpenLogCount(supabase: SupabaseClient, teamIds: string[]) {
  if (!teamIds.length) return 0;
  const { count } = await supabase
    .from("logs")
    .select("*", { count: "exact", head: true })
    .in("team_id", teamIds)
    .in("status", ["open", "in_progress"]);
  return count ?? 0;
}

function getWritableTeams(teamList: TeamListSectionProps["teams"]): WritableTeamSummary[] {
  return teamList.flatMap((team) => {
    if (team.role === "viewer") return [];
    return [{ id: team.id, name: team.name, role: team.role }];
  });
}

function getUserDisplayName(
  user: Awaited<ReturnType<SupabaseClient["auth"]["getUser"]>>["data"]["user"],
) {
  return (
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email ??
    "there"
  );
}

function getSummaryTeam(
  teamList: TeamListSectionProps["teams"],
  selectedTeamId: string | undefined,
) {
  return teamList.find((team) => team.id === selectedTeamId) ?? teamList[0] ?? null;
}

function getDashboardStats({
  invitations,
  openLogCount,
  receivedInvitationList,
  teamList,
}: {
  invitations: InvitationSummary[];
  openLogCount: number;
  receivedInvitationList: ReceivedInvitationSummary[];
  teamList: TeamListSectionProps["teams"];
}) {
  return {
    teamCount: teamList.length,
    pendingInviteCount:
      invitations.filter((invitation) => invitation.status === "pending").length +
      receivedInvitationList.length,
    openLogCount,
    resolvedLogCount: 0, // kept for type compat — not shown in stable stats
  } satisfies DashboardStatsProps;
}

async function loadDashboardPageData(
  searchParams: DashboardPageProps["searchParams"],
): Promise<DashboardPageData> {
  const supabase = await createClient();
  const params = (await searchParams) ?? {};
  const { data: { user } } = await supabase.auth.getUser();
  const name = getUserDisplayName(user);
  const userEmail = user?.email ?? null;
  const teamList = user ? await getTeamList(supabase, user.id) : [];
  const teamIds = teamList.map((t) => t.id);
  const [invitations, receivedInvitationList, openLogCount] = await Promise.all([
    getManagedInvitations(supabase, teamIds),
    getReceivedInvitationList(supabase, userEmail),
    getOpenLogCount(supabase, teamIds),
  ]);

  return {
    firstName: name.split(" ")[0],
    hasTeams: teamList.length > 0,
    invitations,
    params,
    receivedInvitationList,
    stats: getDashboardStats({
      invitations,
      openLogCount,
      receivedInvitationList,
      teamList,
    }),
    summaryTeam: getSummaryTeam(teamList, params.team),
    teamIds,
    teamList,
    teams: teamList.map((team) => ({ id: team.id, name: team.name })),
    writableTeams: getWritableTeams(teamList),
  };
}

function DashboardPageContent({
  firstName,
  hasTeams,
  invitations,
  params,
  receivedInvitationList,
  stats,
  summaryTeam,
  teamIds,
  teamList,
  teams,
  writableTeams,
}: DashboardPageData) {
  return (
    <div className="space-y-6">
      <LogsRealtimeListener teamIds={teamIds} />

      <DashboardIntro
        firstName={firstName}
        error={params.error}
        success={params.success}
        stats={stats}
      />

      <ReceivedInvitationsSection invitations={receivedInvitationList} />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        {/* Left: logs feed — only this re-renders when filters change */}
        <Suspense fallback={<LogsFeedSkeleton />}>
          <LogsFeed
            teamIds={teamIds}
            writableTeams={writableTeams}
            teams={teams}
            summaryTeamId={summaryTeam?.id ?? null}
            summaryTeamName={summaryTeam?.name ?? null}
            summaryTeamRole={summaryTeam?.role ?? null}
            searchParams={params}
          />
        </Suspense>

        {/* Right: teams — stable, never affected by filter changes */}
        <TeamListSection teams={teamList} invitations={invitations} />
      </div>

      {!hasTeams && <NextStepsSection />}
    </div>
  );
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const pageData = await loadDashboardPageData(searchParams);

  return <DashboardPageContent {...pageData} />;
}
