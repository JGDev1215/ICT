create table if not exists public.focus_cards (
  id text primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  card jsonb not null,
  instrument text,
  session text,
  card_date text,
  outcome text,
  final_saved boolean not null default false,
  favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_settings (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.focus_cards enable row level security;
alter table public.user_settings enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update, delete on table public.focus_cards to authenticated;
grant select, insert, update on table public.user_settings to authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists focus_cards_set_updated_at on public.focus_cards;
create trigger focus_cards_set_updated_at
before update on public.focus_cards
for each row execute function public.set_updated_at();

drop trigger if exists user_settings_set_updated_at on public.user_settings;
create trigger user_settings_set_updated_at
before update on public.user_settings
for each row execute function public.set_updated_at();

drop policy if exists focus_cards_select_own on public.focus_cards;
create policy focus_cards_select_own
on public.focus_cards for select
to authenticated
using (owner_id = (select auth.uid()));

drop policy if exists focus_cards_insert_own on public.focus_cards;
create policy focus_cards_insert_own
on public.focus_cards for insert
to authenticated
with check (owner_id = (select auth.uid()));

drop policy if exists focus_cards_update_own on public.focus_cards;
create policy focus_cards_update_own
on public.focus_cards for update
to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

drop policy if exists focus_cards_delete_own on public.focus_cards;
create policy focus_cards_delete_own
on public.focus_cards for delete
to authenticated
using (owner_id = (select auth.uid()));

drop policy if exists user_settings_select_own on public.user_settings;
create policy user_settings_select_own
on public.user_settings for select
to authenticated
using (owner_id = (select auth.uid()));

drop policy if exists user_settings_insert_own on public.user_settings;
create policy user_settings_insert_own
on public.user_settings for insert
to authenticated
with check (owner_id = (select auth.uid()));

drop policy if exists user_settings_update_own on public.user_settings;
create policy user_settings_update_own
on public.user_settings for update
to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

create index if not exists focus_cards_owner_updated_idx on public.focus_cards(owner_id, updated_at desc);
create index if not exists focus_cards_owner_instrument_idx on public.focus_cards(owner_id, instrument);
create index if not exists focus_cards_owner_outcome_idx on public.focus_cards(owner_id, outcome);
