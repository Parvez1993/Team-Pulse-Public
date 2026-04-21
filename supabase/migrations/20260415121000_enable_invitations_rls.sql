create or replace function public.is_invitation_recipient(invite_email text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and lower(p.email) = lower(invite_email)
  );
$$;

alter table public.invitations enable row level security;

drop policy if exists "Admins can read team invitations" on public.invitations;
create policy "Admins can read team invitations"
on public.invitations
for select
to authenticated
using (public.is_team_admin(team_id));

drop policy if exists "Recipients can read their pending invitations" on public.invitations;
create policy "Recipients can read their pending invitations"
on public.invitations
for select
to authenticated
using (
  status = 'pending'
  and public.is_invitation_recipient(email)
);

drop policy if exists "Admins can create invitations" on public.invitations;
create policy "Admins can create invitations"
on public.invitations
for insert
to authenticated
with check (
  public.is_team_admin(team_id)
  and invited_by = auth.uid()
);

drop policy if exists "Admins can update invitations" on public.invitations;
create policy "Admins can update invitations"
on public.invitations
for update
to authenticated
using (public.is_team_admin(team_id))
with check (public.is_team_admin(team_id));

drop policy if exists "Admins can delete invitations" on public.invitations;
create policy "Admins can delete invitations"
on public.invitations
for delete
to authenticated
using (public.is_team_admin(team_id));
