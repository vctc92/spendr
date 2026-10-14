-- Sample data for local/dev testing only. Never run against a household with real data.
-- Creates two fake sign-in-less users (Arjun, Meera), a shared household and sample entries.
-- Amounts are minor units (paise): 234000 = ₹2,340. Safe to re-run.

insert into auth.users (
  id, instance_id, aud, role, email, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('00000000-0000-4000-8000-0000000000a1', '00000000-0000-0000-0000-000000000000',
   'authenticated', 'authenticated', 'arjun@spendr.invalid',
   '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('00000000-0000-4000-8000-0000000000a2', '00000000-0000-0000-0000-000000000000',
   'authenticated', 'authenticated', 'meera@spendr.invalid',
   '{"provider":"email","providers":["email"]}', '{}', now(), now())
on conflict (id) do nothing;

insert into public.households (id, name, base_currency, time_zone, created_by) values
  ('00000000-0000-4000-8000-0000000000b1', 'Arjun & Meera', 'INR', 'Asia/Kolkata',
   '00000000-0000-4000-8000-0000000000a1')
on conflict (id) do nothing;

insert into public.members (household_id, user_id, role, display_name, time_zone, locale) values
  ('00000000-0000-4000-8000-0000000000b1', '00000000-0000-4000-8000-0000000000a1',
   'owner', 'Arjun', 'Asia/Kolkata', 'en-IN'),
  ('00000000-0000-4000-8000-0000000000b1', '00000000-0000-4000-8000-0000000000a2',
   'member', 'Meera', 'Asia/Kolkata', 'en-IN')
on conflict (household_id, user_id) do nothing;

select app.seed_default_categories('00000000-0000-4000-8000-0000000000b1')
where not exists (
  select 1 from public.categories where household_id = '00000000-0000-4000-8000-0000000000b1'
);

insert into public.accounts (id, household_id, owner_id, type, name, last4, visibility, opening_balance_minor) values
  ('00000000-0000-4000-8000-0000000000c1', '00000000-0000-4000-8000-0000000000b1',
   '00000000-0000-4000-8000-0000000000a1', 'bank', 'Joint savings', '4821', 'shared', 15000000),
  ('00000000-0000-4000-8000-0000000000c2', '00000000-0000-4000-8000-0000000000b1',
   '00000000-0000-4000-8000-0000000000a2', 'credit_card', 'Meera credit card', '1093', 'shared', 0),
  ('00000000-0000-4000-8000-0000000000c3', '00000000-0000-4000-8000-0000000000b1',
   '00000000-0000-4000-8000-0000000000a1', 'wallet', 'Arjun private wallet', null, 'private', 500000)
on conflict (id) do nothing;

insert into public.transactions (
  id, household_id, account_id, to_account_id, created_by, type, amount_minor,
  category_id, note, txn_time, need_level, tags
)
select v.id::uuid, '00000000-0000-4000-8000-0000000000b1', v.account::uuid, null, v.by::uuid,
       v.type::public.transaction_type, v.amount,
       (select c.id from public.categories c
         where c.household_id = '00000000-0000-4000-8000-0000000000b1' and c.name = v.category),
       v.note, now() - v.ago, v.need::public.need_level, v.tags
from (values
  ('00000000-0000-4000-8000-0000000000d1', '00000000-0000-4000-8000-0000000000c2',
   '00000000-0000-4000-8000-0000000000a2', 'expense', 234000, 'Groceries', 'BigBasket',
   interval '2 hours', 'necessary', array['weekly']),
  ('00000000-0000-4000-8000-0000000000d2', '00000000-0000-4000-8000-0000000000c1',
   '00000000-0000-4000-8000-0000000000a1', 'expense', 48600, 'Food', 'Swiggy',
   interval '1 day', 'avoidable', array[]::text[]),
  ('00000000-0000-4000-8000-0000000000d3', '00000000-0000-4000-8000-0000000000c1',
   '00000000-0000-4000-8000-0000000000a1', 'expense', 192000, 'Utilities', 'Electricity – BESCOM',
   interval '2 days', 'must_have', array[]::text[]),
  ('00000000-0000-4000-8000-0000000000d4', '00000000-0000-4000-8000-0000000000c1',
   '00000000-0000-4000-8000-0000000000a1', 'expense', 150000, 'Transport', 'Petrol',
   interval '3 days', 'necessary', array[]::text[]),
  ('00000000-0000-4000-8000-0000000000d5', '00000000-0000-4000-8000-0000000000c1',
   '00000000-0000-4000-8000-0000000000a1', 'income', 14500000, 'Salary', 'Salary',
   interval '5 days', null, array[]::text[])
) as v(id, account, by, type, amount, category, note, ago, need, tags)
on conflict (id) do nothing;

-- One transfer (no category, no need level) so ledger totals can be checked against it.
insert into public.transactions (
  id, household_id, account_id, to_account_id, created_by, type, amount_minor, note, txn_time
) values (
  '00000000-0000-4000-8000-0000000000d6', '00000000-0000-4000-8000-0000000000b1',
  '00000000-0000-4000-8000-0000000000c1', '00000000-0000-4000-8000-0000000000c2',
  '00000000-0000-4000-8000-0000000000a2', 'transfer', 500000, 'Card bill payment',
  now() - interval '4 days'
) on conflict (id) do nothing;
