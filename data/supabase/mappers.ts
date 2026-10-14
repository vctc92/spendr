import type { Category, Household, MemberRole, NeedLevel } from '@/data/types';

type HouseholdRow = {
  role: MemberRole;
  display_name: string;
  households: { id: string; name: string; base_currency: string } | null;
};

export function toHousehold(row: HouseholdRow): Household | null {
  if (!row.households) return null;
  return {
    id: row.households.id,
    name: row.households.name,
    baseCurrency: row.households.base_currency,
    role: row.role,
    displayName: row.display_name,
  };
}

type CategoryRow = {
  id: string;
  name: string;
  kind: 'expense' | 'income';
  default_need_level: NeedLevel | null;
  icon: string | null;
};

export function toCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    kind: row.kind,
    defaultNeedLevel: row.default_need_level,
    icon: row.icon,
  };
}
