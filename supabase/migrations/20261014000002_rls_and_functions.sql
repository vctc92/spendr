-- Row-Level Security, helper functions and the create_household RPC.
-- Every policy uses app.current_user_id() instead of auth.uid() (AGENTS §7.2).

create function app.current_user_id() returns uuid
language sql stable as $$
  select auth.uid();
$$;

-- Helpers are SECURITY DEFINER so they can read members/accounts without re-entering
-- those tables' own policies (which would recurse).
create function app.member_role(hid uuid) returns public.member_role
language sql stable security definer set search_path = '' as $$
  select m.role from public.members m
  where m.household_id = hid and m.user_id = app.current_user_id();
$$;

create function app.is_member(hid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select app.member_role(hid) is not null;
$$;

create function app.is_owner(hid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select app.member_role(hid) = 'owner';
$$;

-- Owners and members may write; viewers are read-only.
create function app.can_write(hid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(app.member_role(hid) in ('owner', 'member'), false);
$$;

-- Shared accounts are visible to the household; private ones only to their owner.
create function app.can_see_account(aid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.accounts a
    where a.id = aid
      and app.is_member(a.household_id)
      and (a.visibility = 'shared' or a.owner_id = app.current_user_id())
  );
$$;

-- Rows must not be moved between households after creation.
create function app.prevent_household_change() returns trigger
language plpgsql as $$
begin
  if new.household_id is distinct from old.household_id then
    raise exception 'household_id cannot be changed' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger accounts_lock_household before update on public.accounts
  for each row execute function app.prevent_household_change();
create trigger categories_lock_household before update on public.categories
  for each row execute function app.prevent_household_change();
create trigger transactions_lock_household before update on public.transactions
  for each row execute function app.prevent_household_change();
create trigger saved_views_lock_household before update on public.saved_views
  for each row execute function app.prevent_household_change();

-- A transaction may only reference accounts and categories of its own household.
create function app.check_transaction_refs() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if not exists (
    select 1 from public.accounts a
    where a.id = new.account_id and a.household_id = new.household_id
  ) then
    raise exception 'account is not in this household' using errcode = '23514';
  end if;
  if new.to_account_id is not null and not exists (
    select 1 from public.accounts a
    where a.id = new.to_account_id and a.household_id = new.household_id
  ) then
    raise exception 'destination account is not in this household' using errcode = '23514';
  end if;
  if new.category_id is not null and not exists (
    select 1 from public.categories c
    where c.id = new.category_id and c.household_id = new.household_id
  ) then
    raise exception 'category is not in this household' using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger transactions_check_refs before insert or update on public.transactions
  for each row execute function app.check_transaction_refs();

-- Only owners may change roles; people may edit their own name, time zone and locale.
create function app.guard_member_update() returns trigger
language plpgsql as $$
begin
  if new.user_id <> old.user_id or new.household_id <> old.household_id then
    raise exception 'membership keys cannot be changed' using errcode = '42501';
  end if;
  if new.role <> old.role and not app.is_owner(old.household_id) then
    raise exception 'only an owner can change roles' using errcode = '42501';
  end if;
  if old.role = 'owner' and new.role <> 'owner' and not exists (
    select 1 from public.members m
    where m.household_id = old.household_id and m.role = 'owner' and m.user_id <> old.user_id
  ) then
    raise exception 'a household needs at least one owner' using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger members_guard_update before update on public.members
  for each row execute function app.guard_member_update();

alter table public.households enable row level security;
alter table public.members enable row level security;
alter table public.accounts enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.saved_views enable row level security;

alter table public.households force row level security;
alter table public.members force row level security;
alter table public.accounts force row level security;
alter table public.categories force row level security;
alter table public.transactions force row level security;
alter table public.saved_views force row level security;

-- Signed-out visitors get nothing at all.
revoke all on public.households, public.members, public.accounts, public.categories,
  public.transactions, public.saved_views from anon;

-- households: created only through create_household(); "Delete everything" cascades from here.
create policy households_select on public.households
  for select to authenticated using (app.is_member(id));
create policy households_update on public.households
  for update to authenticated using (app.is_owner(id)) with check (app.is_owner(id));
create policy households_delete on public.households
  for delete to authenticated using (app.is_owner(id));

-- members: rows are created by create_household() and the invite/join RPCs added in T3/T11.
create policy members_select on public.members
  for select to authenticated using (app.is_member(household_id));
create policy members_update on public.members
  for update to authenticated
  using (user_id = app.current_user_id() or app.is_owner(household_id))
  with check (user_id = app.current_user_id() or app.is_owner(household_id));
create policy members_delete on public.members
  for delete to authenticated
  using (
    app.is_owner(household_id) and user_id <> app.current_user_id()
    or user_id = app.current_user_id() and role <> 'owner'
  );

create policy accounts_select on public.accounts
  for select to authenticated
  using (app.is_member(household_id)
    and (visibility = 'shared' or owner_id = app.current_user_id()));
create policy accounts_insert on public.accounts
  for insert to authenticated
  with check (app.can_write(household_id) and owner_id = app.current_user_id());
create policy accounts_update on public.accounts
  for update to authenticated
  using (app.can_write(household_id)
    and (owner_id = app.current_user_id() or (visibility = 'shared' and app.is_owner(household_id))))
  with check (app.can_write(household_id)
    and (owner_id = app.current_user_id() or (visibility = 'shared' and app.is_owner(household_id))));
create policy accounts_delete on public.accounts
  for delete to authenticated
  using (app.can_write(household_id)
    and (owner_id = app.current_user_id() or (visibility = 'shared' and app.is_owner(household_id))));

create policy categories_select on public.categories
  for select to authenticated using (app.is_member(household_id));
create policy categories_insert on public.categories
  for insert to authenticated with check (app.can_write(household_id));
create policy categories_update on public.categories
  for update to authenticated
  using (app.can_write(household_id)) with check (app.can_write(household_id));
create policy categories_delete on public.categories
  for delete to authenticated using (app.can_write(household_id));

-- transactions: visible only if every account involved is visible to the caller.
create policy transactions_select on public.transactions
  for select to authenticated
  using (app.is_member(household_id)
    and app.can_see_account(account_id)
    and (to_account_id is null or app.can_see_account(to_account_id)));
create policy transactions_insert on public.transactions
  for insert to authenticated
  with check (app.can_write(household_id)
    and created_by = app.current_user_id()
    and app.can_see_account(account_id)
    and (to_account_id is null or app.can_see_account(to_account_id)));
create policy transactions_update on public.transactions
  for update to authenticated
  using (app.can_write(household_id)
    and app.can_see_account(account_id)
    and (to_account_id is null or app.can_see_account(to_account_id)))
  with check (app.can_write(household_id)
    and app.can_see_account(account_id)
    and (to_account_id is null or app.can_see_account(to_account_id)));
create policy transactions_delete on public.transactions
  for delete to authenticated
  using (app.can_write(household_id)
    and app.can_see_account(account_id)
    and (to_account_id is null or app.can_see_account(to_account_id))
    and (created_by = app.current_user_id() or app.is_owner(household_id)));

-- saved_views: personal to the member who made them.
create policy saved_views_all on public.saved_views
  for all to authenticated
  using (user_id = app.current_user_id() and app.is_member(household_id))
  with check (user_id = app.current_user_id() and app.is_member(household_id));

-- Default categories (E3) with default need levels (PRD §2.2) and lucide icon names (D-027).
create function app.seed_default_categories(hid uuid) returns void
language sql security definer set search_path = '' as $$
  insert into public.categories (household_id, name, kind, default_need_level, icon)
  values
    (hid, 'Food', 'expense', 'nice_to_have', 'utensils'),
    (hid, 'Groceries', 'expense', 'necessary', 'shopping-cart'),
    (hid, 'Rent/EMI', 'expense', 'must_have', 'home'),
    (hid, 'Utilities', 'expense', 'must_have', 'zap'),
    (hid, 'Transport', 'expense', 'necessary', 'car'),
    (hid, 'Health', 'expense', 'necessary', 'heart-pulse'),
    (hid, 'Kids', 'expense', 'necessary', 'baby'),
    (hid, 'Shopping', 'expense', 'nice_to_have', 'shopping-bag'),
    (hid, 'Fees & Charges', 'expense', 'necessary', 'receipt'),
    (hid, 'Other', 'expense', 'nice_to_have', 'circle-ellipsis'),
    (hid, 'Salary', 'income', null, 'banknote'),
    (hid, 'Other income', 'income', null, 'circle-plus');
$$;

-- Creates a household, makes the caller its owner and seeds categories in one transaction.
-- The app passes the device time zone and locale so nobody is stuck on a hard-coded zone.
create function public.create_household(
  p_name text,
  p_base_currency text,
  p_display_name text,
  p_time_zone text default null,
  p_locale text default null
) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := app.current_user_id();
  hid uuid;
  tz text := coalesce(nullif(btrim(p_time_zone), ''), 'UTC');
  loc text := coalesce(nullif(btrim(p_locale), ''), 'en');
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  insert into public.households (name, base_currency, time_zone, created_by)
  values (p_name, upper(p_base_currency), tz, uid)
  returning id into hid;

  insert into public.members (household_id, user_id, role, display_name, time_zone, locale)
  values (hid, uid, 'owner', p_display_name, tz, loc);

  perform app.seed_default_categories(hid);
  return hid;
end;
$$;

revoke all on function public.create_household(text, text, text, text, text) from public, anon;
grant execute on function public.create_household(text, text, text, text, text) to authenticated;
revoke all on function app.seed_default_categories(uuid) from public, anon, authenticated;

grant usage on schema app to authenticated;
grant execute on function
  app.current_user_id(), app.member_role(uuid), app.is_member(uuid), app.is_owner(uuid),
  app.can_write(uuid), app.can_see_account(uuid), app.is_valid_time_zone(text),
  app.is_valid_locale(text), app.tags_are_valid(text[])
to authenticated;

-- Shared-ledger live updates (AGENTS §7.3). Realtime applies RLS to what each client receives.
alter publication supabase_realtime add table public.transactions;
