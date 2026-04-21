create table if not exists public.ai_daily_summaries (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  summary_date date not null,
  summary_text text not null,
  generated_from_log_count integer not null default 0,
  generated_by uuid not null references public.profiles(id) on delete restrict,
  generated_at timestamptz not null default timezone('utc', now()),
  unique (team_id, summary_date),
  constraint ai_daily_summaries_generated_from_log_count_check
    check (generated_from_log_count >= 0)
);

create index if not exists ai_daily_summaries_team_id_summary_date_idx
  on public.ai_daily_summaries (team_id, summary_date desc);

alter table public.ai_daily_summaries enable row level security;

drop policy if exists "Members can read team AI daily summaries"
  on public.ai_daily_summaries;
create policy "Members can read team AI daily summaries"
on public.ai_daily_summaries
for select
to authenticated
using (public.is_team_member(team_id));

drop policy if exists "Writers can insert team AI daily summaries"
  on public.ai_daily_summaries;
create policy "Writers can insert team AI daily summaries"
on public.ai_daily_summaries
for insert
to authenticated
with check (public.can_write_team(team_id));

drop policy if exists "Writers can update team AI daily summaries"
  on public.ai_daily_summaries;
create policy "Writers can update team AI daily summaries"
on public.ai_daily_summaries
for update
to authenticated
using (public.can_write_team(team_id))
with check (public.can_write_team(team_id));
