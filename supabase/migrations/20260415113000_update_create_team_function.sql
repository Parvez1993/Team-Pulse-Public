create or replace function public.create_team(team_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  new_team_id uuid;
  clean_team_name text;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  clean_team_name := trim(team_name);

  if clean_team_name is null or char_length(clean_team_name) = 0 then
    raise exception 'Team name is required';
  end if;

  insert into public.profiles (id, email, name)
  select
    u.id,
    u.email,
    coalesce(
      u.raw_user_meta_data ->> 'full_name',
      u.raw_user_meta_data ->> 'name',
      split_part(u.email, '@', 1)
    )
  from auth.users u
  where u.id = current_user_id
  on conflict (id) do nothing;

  insert into public.teams (name, created_by)
  values (clean_team_name, current_user_id)
  returning id into new_team_id;

  insert into public.team_members (team_id, user_id, role)
  values (new_team_id, current_user_id, 'admin');

  return new_team_id;
end;
$$;

revoke all on function public.create_team(text) from public;
grant execute on function public.create_team(text) to authenticated;
