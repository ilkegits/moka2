-- ShiHanzi waiting list. Run once in the Supabase SQL editor (project grzuyqtbfmaonzzmopny).
-- Nobody can read or change the table from the web: RLS is on with no policies.
-- The sign-up page can only call join_waitlist(), which adds one email and never says
-- whether it was already there. Read the list in the dashboard: Table editor > waitlist.

create table if not exists public.waitlist (
  id bigint generated always as identity primary key,
  email text not null unique,
  source text,
  created_at timestamptz not null default now()
);
alter table public.waitlist enable row level security;
revoke all on public.waitlist from anon, authenticated;

create or replace function public.join_waitlist(p_email text, p_source text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare e text := lower(trim(p_email));
begin
  if e is null or length(e) > 254 or e !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'invalid email' using errcode = '22023';
  end if;
  insert into public.waitlist (email, source) values (e, left(p_source, 40))
  on conflict (email) do nothing;
end
$$;

revoke all on function public.join_waitlist(text, text) from public;
grant execute on function public.join_waitlist(text, text) to anon, authenticated;
