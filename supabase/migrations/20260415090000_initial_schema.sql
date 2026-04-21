create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'team_role') then
    create type public.team_role as enum ('admin', 'member', 'viewer');
  end if;

  if not exists (select 1 from pg_type where typname = 'log_type') then
    create type public.log_type as enum ('activity', 'error', 'incident');
  end if;

  if not exists (select 1 from pg_type where typname = 'log_severity') then
    create type public.log_severity as enum ('low', 'medium', 'high');
  end if;
end
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  name text not null check (char_length(trim(name)) > 0),
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  created_by uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete restrict,
  role public.team_role not null default 'member',
  joined_at timestamptz not null default timezone('utc', now()),
  unique (team_id, user_id)
);

create table if not exists public.logs (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete restrict,
  title text not null check (char_length(trim(title)) > 0),
  description text not null default '',
  type public.log_type not null,
  severity public.log_severity not null default 'low',
  file_url text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
  log_id uuid references public.logs (id) on delete cascade,
  message text not null check (char_length(trim(message)) > 0),
  detected_at timestamptz not null default timezone('utc', now())
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update
  set
    email = excluded.email,
    name = excluded.name,
    avatar_url = excluded.avatar_url;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create index if not exists teams_created_by_idx
  on public.teams (created_by);

create index if not exists team_members_team_id_idx
  on public.team_members (team_id);

create index if not exists team_members_user_id_idx
  on public.team_members (user_id);

create index if not exists logs_team_created_at_idx
  on public.logs (team_id, created_at desc);

create index if not exists logs_user_id_idx
  on public.logs (user_id);

create index if not exists alerts_team_detected_at_idx
  on public.alerts (team_id, detected_at desc);

create index if not exists alerts_log_id_idx
  on public.alerts (log_id);
