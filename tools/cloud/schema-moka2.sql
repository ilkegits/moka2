-- moka2 accounts and sync. The same Supabase project and accounts as ShiHanzi (tools/cloud/schema.sql in ilkegits/moka),
-- but moka2's saves live in their own table, saves2, so the two apps never overwrite each other. Run once in the SQL editor.
-- One row per account: the app's whole save (db) as JSON. rev counts uploads; the app only
-- updates a row whose rev is the one it last saw, so two devices never overwrite each other blind.

create table if not exists public.saves2 (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null,
  rev        bigint not null default 1,
  device     text,
  updated_at timestamptz not null default now()
);

-- keep updated_at true, whatever the app sends
create or replace function public.saves2_touch() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end $$;
drop trigger if exists saves2_touch on public.saves2;
create trigger saves2_touch before insert or update on public.saves2 for each row execute function public.saves2_touch();

-- every account sees and changes only its own row
alter table public.saves2 enable row level security;
drop policy if exists "read own save" on public.saves2;
drop policy if exists "add own save" on public.saves2;
drop policy if exists "change own save" on public.saves2;
create policy "read own save"   on public.saves2 for select to authenticated using ((select auth.uid()) = user_id);
create policy "add own save"    on public.saves2 for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "change own save" on public.saves2 for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
revoke all on public.saves2 from anon;
grant select, insert, update on public.saves2 to authenticated;

-- "Delete account" uses the real app's delete_me() (already there); deleting the account removes this row too (on delete cascade)

-- a save may be at most 5 MB, so one account can't fill the free plan's 500 MB
alter table public.saves2 drop constraint if exists saves2_size;
alter table public.saves2 add constraint saves2_size check (pg_column_size(data) < 5000000);
