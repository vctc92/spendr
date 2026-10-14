-- Phase 0-1 core schema. Money is always integer minor units (never float).
-- Reconciliation tables (bank_events, matches, devices) are Phase 4 and are not created here.

create schema if not exists app;

create type public.member_role as enum ('owner', 'member', 'viewer');
create type public.account_type as enum ('bank', 'credit_card', 'cash', 'wallet', 'loan');
create type public.account_visibility as enum ('shared', 'private');
create type public.transaction_type as enum ('expense', 'income', 'transfer');
create type public.category_kind as enum ('expense', 'income');
create type public.need_level as enum ('must_have', 'necessary', 'nice_to_have', 'avoidable');

-- Keeps updated_at honest without relying on the client.
create function app.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- IANA zone names only (e.g. 'Asia/Kolkata', 'America/New_York'). Fixed offsets such as
-- "UTC+5:30" are rejected because they break at daylight-saving changes.
create function app.is_valid_time_zone(tz text) returns boolean
language sql stable as $$
  select exists (select 1 from pg_timezone_names where name = tz);
$$;

-- BCP 47 tags such as 'en', 'en-IN', 'pt-BR', 'zh-Hant-TW'.
create function app.is_valid_locale(tag text) returns boolean
language sql immutable as $$
  select tag ~ '^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$';
$$;

create function app.validate_time_zone() returns trigger
language plpgsql as $$
begin
  if not app.is_valid_time_zone(new.time_zone) then
    raise exception 'invalid time zone' using errcode = '22023';
  end if;
  return new;
end;
$$;

-- CHECK constraints cannot contain subqueries, so the tag rule lives in a function.
create function app.tags_are_valid(tags text[]) returns boolean
language sql immutable as $$
  select coalesce(bool_and(t <> '' and t = lower(t) and t !~ '[[:space:]#]'), true)
  from unnest(tags) as t;
$$;

create table public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 80),
  base_currency text not null check (base_currency ~ '^[A-Z]{3}$'),
  -- Fallback for members who have not chosen their own zone; each member's zone wins for display.
  time_zone text not null default 'UTC',
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.members (
  household_id uuid not null references public.households (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.member_role not null,
  display_name text not null check (char_length(btrim(display_name)) between 1 and 60),
  -- Per-person settings so people in different countries each see their own local days and language.
  time_zone text not null default 'UTC',
  locale text not null default 'en' check (app.is_valid_locale(locale)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (household_id, user_id)
);
create index members_user_id_idx on public.members (user_id);

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  owner_id uuid not null references auth.users (id),
  type public.account_type not null,
  name text not null check (char_length(btrim(name)) between 1 and 80),
  last4 text check (last4 ~ '^[0-9]{4}$'),
  visibility public.account_visibility not null default 'shared',
  opening_balance_minor bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index accounts_household_id_idx on public.accounts (household_id);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 60),
  kind public.category_kind not null,
  default_need_level public.need_level,
  icon text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (household_id, kind, name),
  -- Income categories never carry a need level.
  check (kind = 'expense' or default_need_level is null)
);

create table public.transactions (
  -- Client-generated so offline writes can be synced idempotently (upsert by id).
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  account_id uuid not null references public.accounts (id),
  to_account_id uuid references public.accounts (id),
  created_by uuid not null references auth.users (id),
  type public.transaction_type not null,
  amount_minor bigint not null check (amount_minor > 0),
  category_id uuid references public.categories (id),
  note text,
  txn_time timestamptz not null default now(),
  need_level public.need_level,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (type = 'transfer' and to_account_id is not null and to_account_id <> account_id
      and category_id is null and need_level is null)
    or (type = 'expense' and to_account_id is null and need_level is not null)
    or (type = 'income' and to_account_id is null and need_level is null)
  ),
  -- Tags: lowercase, trimmed, no spaces, stored without '#'.
  check (app.tags_are_valid(tags))
);
create index transactions_household_time_idx on public.transactions (household_id, txn_time desc);
create index transactions_account_idx on public.transactions (account_id);
create index transactions_tags_idx on public.transactions using gin (tags);

create table public.saved_views (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 60),
  filter jsonb not null default '{}',
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index saved_views_user_idx on public.saved_views (household_id, user_id);

create trigger households_validate_tz before insert or update of time_zone on public.households
  for each row execute function app.validate_time_zone();
create trigger members_validate_tz before insert or update of time_zone on public.members
  for each row execute function app.validate_time_zone();

create trigger households_updated_at before update on public.households
  for each row execute function app.set_updated_at();
create trigger members_updated_at before update on public.members
  for each row execute function app.set_updated_at();
create trigger accounts_updated_at before update on public.accounts
  for each row execute function app.set_updated_at();
create trigger categories_updated_at before update on public.categories
  for each row execute function app.set_updated_at();
create trigger transactions_updated_at before update on public.transactions
  for each row execute function app.set_updated_at();
create trigger saved_views_updated_at before update on public.saved_views
  for each row execute function app.set_updated_at();
