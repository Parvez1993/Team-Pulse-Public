create or replace function public.is_team_member(check_team_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.team_members tm
    where tm.team_id = check_team_id
      and tm.user_id = auth.uid()
  );
$$;

create or replace function public.is_team_admin(check_team_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.team_members tm
    where tm.team_id = check_team_id
      and tm.user_id = auth.uid()
      and tm.role = 'admin'
  );
$$;

create or replace function public.can_write_team(check_team_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.team_members tm
    where tm.team_id = check_team_id
      and tm.user_id = auth.uid()
      and tm.role in ('admin', 'member')
  );
$$;

alter table public.profiles enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.logs enable row level security;
alter table public.alerts enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Members can read their teams" on public.teams;
create policy "Members can read their teams"
on public.teams
for select
to authenticated
using (public.is_team_member(id));

drop policy if exists "Authenticated users can create teams" on public.teams;
create policy "Authenticated users can create teams"
on public.teams
for insert
to authenticated
with check (auth.uid() = created_by);

drop policy if exists "Admins can update teams" on public.teams;
create policy "Admins can update teams"
on public.teams
for update
to authenticated
using (public.is_team_admin(id))
with check (public.is_team_admin(id));

drop policy if exists "Admins can delete teams" on public.teams;
create policy "Admins can delete teams"
on public.teams
for delete
to authenticated
using (public.is_team_admin(id));

drop policy if exists "Members can read team memberships" on public.team_members;
create policy "Members can read team memberships"
on public.team_members
for select
to authenticated
using (public.is_team_member(team_id));

drop policy if exists "Admins can insert team memberships" on public.team_members;
create policy "Admins can insert team memberships"
on public.team_members
for insert
to authenticated
with check (
  (
    exists (
      select 1
      from public.teams t
      where t.id = team_id
        and t.created_by = auth.uid()
    )
    and user_id = auth.uid()
    and role = 'admin'
  )
  or public.is_team_admin(team_id)
);

drop policy if exists "Admins can update team memberships" on public.team_members;
create policy "Admins can update team memberships"
on public.team_members
for update
to authenticated
using (public.is_team_admin(team_id))
with check (public.is_team_admin(team_id));

drop policy if exists "Admins can delete team memberships" on public.team_members;
create policy "Admins can delete team memberships"
on public.team_members
for delete
to authenticated
using (public.is_team_admin(team_id));

drop policy if exists "Members can read logs" on public.logs;
create policy "Members can read logs"
on public.logs
for select
to authenticated
using (public.is_team_member(team_id));

drop policy if exists "Writers can create logs" on public.logs;
create policy "Writers can create logs"
on public.logs
for insert
to authenticated
with check (
  auth.uid() = user_id
  and public.can_write_team(team_id)
);

drop policy if exists "Authors and admins can update logs" on public.logs;
create policy "Authors and admins can update logs"
on public.logs
for update
to authenticated
using (
  public.is_team_admin(team_id)
  or auth.uid() = user_id
)
with check (
  public.is_team_admin(team_id)
  or auth.uid() = user_id
);

drop policy if exists "Authors and admins can delete logs" on public.logs;
create policy "Authors and admins can delete logs"
on public.logs
for delete
to authenticated
using (
  public.is_team_admin(team_id)
  or auth.uid() = user_id
);

drop policy if exists "Members can read alerts" on public.alerts;
create policy "Members can read alerts"
on public.alerts
for select
to authenticated
using (public.is_team_member(team_id));
