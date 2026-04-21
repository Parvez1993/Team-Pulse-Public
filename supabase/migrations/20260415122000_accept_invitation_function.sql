create or replace function public.accept_invitation(invitation_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  current_user_email text;
  invite_record public.invitations%rowtype;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  select p.email
  into current_user_email
  from public.profiles p
  where p.id = current_user_id;

  if current_user_email is null then
    raise exception 'Profile not found';
  end if;

  select *
  into invite_record
  from public.invitations i
  where i.id = invitation_id
    and i.status = 'pending'
  for update;

  if not found then
    raise exception 'Invitation not found';
  end if;

  if lower(invite_record.email) <> lower(current_user_email) then
    raise exception 'This invitation does not belong to you';
  end if;

  insert into public.team_members (team_id, user_id, role)
  values (invite_record.team_id, current_user_id, invite_record.role)
  on conflict (team_id, user_id) do update
  set role = excluded.role;

  update public.invitations
  set
    status = 'accepted',
    accepted_at = timezone('utc', now())
  where id = invite_record.id;

  return invite_record.team_id;
end;
$$;

revoke all on function public.accept_invitation(uuid) from public;
grant execute on function public.accept_invitation(uuid) to authenticated;
