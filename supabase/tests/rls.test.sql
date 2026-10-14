-- Run locally with `npx supabase test db` (needs Docker). Never run against real data.
begin;
create extension if not exists pgtap with schema extensions;
select plan(21);

-- Fixtures: owner, member, viewer, outsider.
insert into auth.users (id, instance_id, aud, role, email) values
  ('00000000-0000-4000-8000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'owner@test.invalid'),
  ('00000000-0000-4000-8000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'member@test.invalid'),
  ('00000000-0000-4000-8000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'viewer@test.invalid'),
  ('00000000-0000-4000-8000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'outsider@test.invalid');

create temp table ctx (hid uuid);
grant all on ctx to authenticated;

-- Owner creates the household through the RPC, from a non-IST zone.
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}';
insert into ctx select public.create_household('Test home', 'usd', 'Owner', 'America/New_York', 'en-US');

select is((select count(*)::int from public.categories), 12, 'default categories seeded');
select is((select time_zone from public.members), 'America/New_York', 'member keeps the chosen time zone');
select is((select base_currency from public.households), 'USD', 'currency normalised');
select throws_ok(
  $$ update public.members set time_zone = 'UTC+5:30' $$, '22023', null, 'fixed-offset time zones are rejected');
select throws_ok(
  $$ update public.members set locale = 'not a locale' $$, '23514', null, 'bad locale is rejected');

-- Other members are added by the (later) join RPC; fixtures insert them as the superuser.
reset role;
insert into public.members (household_id, user_id, role, display_name)
select hid, '00000000-0000-4000-8000-000000000002', 'member', 'Member' from ctx;
insert into public.members (household_id, user_id, role, display_name)
select hid, '00000000-0000-4000-8000-000000000003', 'viewer', 'Viewer' from ctx;
insert into public.accounts (id, household_id, owner_id, type, name, visibility)
select '00000000-0000-4000-8000-0000000000a1', hid, '00000000-0000-4000-8000-000000000001', 'bank', 'Shared', 'shared' from ctx;
insert into public.accounts (id, household_id, owner_id, type, name, visibility)
select '00000000-0000-4000-8000-0000000000a2', hid, '00000000-0000-4000-8000-000000000001', 'bank', 'Private', 'private' from ctx;
insert into public.transactions (id, household_id, account_id, created_by, type, amount_minor, need_level)
select '00000000-0000-4000-8000-0000000000e1', hid, '00000000-0000-4000-8000-0000000000a1', '00000000-0000-4000-8000-000000000001', 'expense', 1000, 'necessary' from ctx;
insert into public.transactions (id, household_id, account_id, created_by, type, amount_minor, need_level)
select '00000000-0000-4000-8000-0000000000e2', hid, '00000000-0000-4000-8000-0000000000a2', '00000000-0000-4000-8000-000000000001', 'expense', 2000, 'avoidable' from ctx;

-- Outsider sees and changes nothing.
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-4000-8000-000000000004","role":"authenticated"}';
select is((select count(*)::int from public.households), 0, 'outsider: no households');
select is((select count(*)::int from public.members), 0, 'outsider: no members');
select is((select count(*)::int from public.accounts), 0, 'outsider: no accounts');
select is((select count(*)::int from public.categories), 0, 'outsider: no categories');
select is((select count(*)::int from public.transactions), 0, 'outsider: no transactions');
select throws_ok(
  $$ insert into public.accounts (household_id, owner_id, type, name)
     select hid, '00000000-0000-4000-8000-000000000004', 'cash', 'Sneaky' from ctx $$,
  '42501', null, 'outsider cannot add accounts to the household');

-- Member sees shared data but not the owner's private account.
set local request.jwt.claims = '{"sub":"00000000-0000-4000-8000-000000000002","role":"authenticated"}';
select is((select count(*)::int from public.accounts), 1, 'member: only the shared account');
select is((select count(*)::int from public.transactions), 1, 'member: private-account transactions hidden');
select lives_ok(
  $$ insert into public.transactions (household_id, account_id, created_by, type, amount_minor, need_level, tags)
     select hid, '00000000-0000-4000-8000-0000000000a1', '00000000-0000-4000-8000-000000000002', 'expense', 500, 'nice_to_have', array['goa-trip'] from ctx $$,
  'member can add an expense');
select throws_ok(
  $$ insert into public.transactions (household_id, account_id, created_by, type, amount_minor, need_level, tags)
     select hid, '00000000-0000-4000-8000-0000000000a1', '00000000-0000-4000-8000-000000000002', 'expense', 500, 'necessary', array['Goa Trip'] from ctx $$,
  '23514', null, 'tags must be lowercase with no spaces');
select throws_ok(
  $$ update public.members set role = 'owner' where user_id = '00000000-0000-4000-8000-000000000002' $$,
  '42501', null, 'member cannot promote themselves');

-- Viewer is read-only.
set local request.jwt.claims = '{"sub":"00000000-0000-4000-8000-000000000003","role":"authenticated"}';
select is((select count(*)::int from public.transactions), 2, 'viewer: reads shared transactions');
select throws_ok(
  $$ insert into public.transactions (household_id, account_id, created_by, type, amount_minor, need_level)
     select hid, '00000000-0000-4000-8000-0000000000a1', '00000000-0000-4000-8000-000000000003', 'expense', 100, 'necessary' from ctx $$,
  '42501', null, 'viewer cannot write');

-- Owner sees everything and transfer rules hold.
set local request.jwt.claims = '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}';
select is((select count(*)::int from public.transactions), 3, 'owner: sees private and shared transactions');
select throws_ok(
  $$ insert into public.transactions (household_id, account_id, to_account_id, created_by, type, amount_minor, need_level)
     select hid, '00000000-0000-4000-8000-0000000000a1', '00000000-0000-4000-8000-0000000000a2', '00000000-0000-4000-8000-000000000001', 'transfer', 100, 'necessary' from ctx $$,
  '23514', null, 'transfers cannot carry a need level');
select throws_ok(
  $$ insert into public.transactions (household_id, account_id, created_by, type, amount_minor, need_level)
     select hid, '00000000-0000-4000-8000-0000000000a1', '00000000-0000-4000-8000-000000000001', 'expense', 0, 'necessary' from ctx $$,
  '23514', null, 'amount must be positive');

select * from finish();
rollback;
