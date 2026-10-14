import type {
  Category,
  Household,
  InviteRole,
  JoinHouseholdInput,
  NewAccountInput,
  NewHouseholdInput,
} from '@/data/types';

import { supabase } from './client';
import { toDataError } from './errors';
import { toCategory, toHousehold } from './mappers';

export async function getMyHousehold(userId: string): Promise<Household | null> {
  const { data, error } = await supabase
    .from('members')
    .select('role, display_name, households(id, name, base_currency)')
    .eq('user_id', userId)
    .order('created_at')
    .limit(1)
    .maybeSingle();
  if (error) throw toDataError(error);
  return data ? toHousehold(data) : null;
}

export async function createHousehold(input: NewHouseholdInput): Promise<string> {
  const { data, error } = await supabase.rpc('create_household', {
    p_name: input.name,
    p_base_currency: input.baseCurrency,
    p_display_name: input.displayName,
    p_time_zone: input.timeZone,
    p_locale: input.locale,
  });
  if (error) throw toDataError(error);
  return data;
}

export async function joinHousehold(input: JoinHouseholdInput): Promise<string> {
  const { data, error } = await supabase.rpc('join_household', {
    p_code: input.code,
    p_display_name: input.displayName,
    p_time_zone: input.timeZone,
    p_locale: input.locale,
  });
  if (error) throw toDataError(error);
  return data;
}

export async function createInvite(householdId: string, role: InviteRole = 'member') {
  const { data, error } = await supabase.rpc('create_invite', {
    p_household_id: householdId,
    p_role: role,
  });
  if (error) throw toDataError(error);
  return data;
}

export async function getCategories(householdId: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, kind, default_need_level, icon')
    .eq('household_id', householdId)
    .order('name');
  if (error) throw toDataError(error);
  return data.map(toCategory);
}

export async function removeCategories(householdId: string, ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('household_id', householdId)
    .in('id', ids);
  if (error) throw toDataError(error);
}

export async function countAccounts(householdId: string): Promise<number> {
  const { count, error } = await supabase
    .from('accounts')
    .select('id', { count: 'exact', head: true })
    .eq('household_id', householdId);
  if (error) throw toDataError(error);
  return count ?? 0;
}

export async function addAccount(input: NewAccountInput, ownerId: string): Promise<void> {
  const { error } = await supabase.from('accounts').insert({
    household_id: input.householdId,
    owner_id: ownerId,
    type: input.type,
    name: input.name,
    last4: input.last4 || null,
  });
  if (error) throw toDataError(error);
}

export async function setBaseCurrency(householdId: string, currency: string): Promise<void> {
  const { error } = await supabase
    .from('households')
    .update({ base_currency: currency })
    .eq('id', householdId);
  if (error) throw toDataError(error);
}
