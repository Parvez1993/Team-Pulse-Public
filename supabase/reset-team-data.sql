begin;

-- This keeps auth.users and public.profiles.
-- Team-related tables are removed through foreign-key cascade.
delete from public.teams;

commit;
