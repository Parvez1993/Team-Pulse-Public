do $$
begin
  if not exists (select 1 from pg_type where typname = 'invitation_status') then
    create type public.invitation_status as enum ('pending', 'accepted', 'revoked');
  end if;
end
$$;

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
  email text not null check (char_length(trim(email)) > 0),
  role public.team_role not null default 'member',
  invited_by uuid not null references public.profiles (id) on delete restrict,
  status public.invitation_status not null default 'pending',
  token text not null unique default encode(gen_random_bytes(24), 'hex'),
  created_at timestamptz not null default timezone('utc', now()),
  accepted_at timestamptz
);

create unique index if not exists invitations_team_email_pending_idx
  on public.invitations (team_id, lower(email))
  where status = 'pending';

create index if not exists invitations_team_created_at_idx
  on public.invitations (team_id, created_at desc);

create index if not exists invitations_email_status_idx
  on public.invitations (lower(email), status);
