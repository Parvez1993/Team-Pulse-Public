alter type public.log_severity add value if not exists 'critical';

do $$
begin
  if not exists (select 1 from pg_type where typname = 'log_status') then
    create type public.log_status as enum (
      'open',
      'in_progress',
      'resolved',
      'done'
    );
  end if;
end
$$;

alter table public.logs
  add column if not exists status public.log_status not null default 'open',
  add column if not exists updated_at timestamptz not null default timezone('utc', now());

update public.logs
set updated_at = created_at
where updated_at is null;

create or replace function public.set_logs_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_logs_updated_at on public.logs;

create trigger set_logs_updated_at
before update on public.logs
for each row execute procedure public.set_logs_updated_at();
