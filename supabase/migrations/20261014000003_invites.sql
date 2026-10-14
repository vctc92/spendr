-- Invite codes: how a second person joins an existing household (T3).
-- Members cannot insert themselves under RLS, so joining goes through join_household().

create table public.household_invites (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  code text not null unique check (code ~ '^[A-HJ-NP-Z2-9]{8}$'),
  role public.member_role not null check (role in ('member', 'viewer')),
  created_by uuid not null references auth.users (id),
  expires_at timestamptz not null default now() + interval '7 days',
  used_by uuid references auth.users (id),
  used_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index household_invites_household_id_idx on public.household_invites (household_id);

create trigger household_invites_set_updated_at before update on public.household_invites
  for each row execute function app.set_updated_at();

alter table public.household_invites enable row level security;
alter table public.household_invites force row level security;
revoke all on public.household_invites from anon;

-- Inserts and updates happen only inside the RPCs below.
create policy household_invites_select on public.household_invites
  for select to authenticated using (app.is_owner(household_id));
create policy household_invites_delete on public.household_invites
  for delete to authenticated using (app.is_owner(household_id));

create function public.create_invite(p_household_id uuid, p_role public.member_role default 'member')
returns text
language plpgsql security definer set search_path = '' as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  new_code text;
  attempts int := 0;
begin
  if not app.is_owner(p_household_id) then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  if p_role not in ('member', 'viewer') then
    raise exception 'invalid role' using errcode = '22023';
  end if;

  loop
    new_code := '';
    for i in 1..8 loop
      new_code := new_code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    begin
      insert into public.household_invites (household_id, code, role, created_by)
      values (p_household_id, new_code, p_role, app.current_user_id());
      return new_code;
    exception when unique_violation then
      attempts := attempts + 1;
      if attempts > 5 then raise; end if;
    end;
  end loop;
end;
$$;

create function public.join_household(
  p_code text,
  p_display_name text,
  p_time_zone text default null,
  p_locale text default null
) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := app.current_user_id();
  inv public.household_invites;
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  select * into inv from public.household_invites
  where code = upper(btrim(p_code)) and used_at is null and expires_at > now()
  for update;

  if not found then
    raise exception 'invalid invite' using errcode = 'P0002';
  end if;

  insert into public.members (household_id, user_id, role, display_name, time_zone, locale)
  values (
    inv.household_id, uid, inv.role, p_display_name,
    coalesce(nullif(btrim(p_time_zone), ''), 'UTC'),
    coalesce(nullif(btrim(p_locale), ''), 'en')
  );

  update public.household_invites set used_by = uid, used_at = now() where id = inv.id;
  return inv.household_id;
end;
$$;

revoke all on function public.create_invite(uuid, public.member_role) from public, anon;
revoke all on function public.join_household(text, text, text, text) from public, anon;
grant execute on function public.create_invite(uuid, public.member_role) to authenticated;
grant execute on function public.join_household(text, text, text, text) to authenticated;
