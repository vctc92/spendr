export type User = { id: string; email: string };

export type MemberRole = 'owner' | 'member' | 'viewer';

export type Household = {
  id: string;
  name: string;
  baseCurrency: string;
  role: MemberRole;
  displayName: string;
};

export type AccountType = 'bank' | 'credit_card' | 'cash' | 'wallet' | 'loan';

export type NeedLevel = 'must_have' | 'necessary' | 'nice_to_have' | 'avoidable';

export type Category = {
  id: string;
  name: string;
  kind: 'expense' | 'income';
  defaultNeedLevel: NeedLevel | null;
  icon: string | null;
};

export type NewHouseholdInput = {
  name: string;
  baseCurrency: string;
  displayName: string;
  timeZone: string;
  locale: string;
};

export type JoinHouseholdInput = {
  code: string;
  displayName: string;
  timeZone: string;
  locale: string;
};

export type NewAccountInput = {
  householdId: string;
  type: AccountType;
  name: string;
  last4?: string;
};

export type InviteRole = 'member' | 'viewer';

/** Safe, user-presentable failure codes. Raw backend messages never leave `data/`. */
export type DataErrorCode =
  'network' | 'invalid_code' | 'invalid_invite' | 'rate_limited' | 'cancelled' | 'unknown';
