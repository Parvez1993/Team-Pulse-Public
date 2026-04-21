create or replace function public.create_team(team_name text)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  new_team_id uuid;
  clean_team_name text;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  clean_team_name := trim(team_name);

  if clean_team_name is null or char_length(clean_team_name) = 0 then
    raise exception 'Team name is required';
  end if;

  insert into public.teams (name, created_by)
  values (clean_team_name, auth.uid())
  returning id into new_team_id;

  insert into public.team_members (team_id, user_id, role)
  values (new_team_id, auth.uid(), 'admin');

  return new_team_id;
end;
$$;

revoke all on function public.create_team(text) from public;
grant execute on function public.create_team(text) to authenticated;
