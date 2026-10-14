import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  addAccount,
  countAccounts,
  createHousehold,
  createInvite,
  getCategories,
  getMyHousehold,
  joinHousehold,
  removeCategories,
  setBaseCurrency,
  type InviteRole,
  type JoinHouseholdInput,
  type NewAccountInput,
  type NewHouseholdInput,
} from '@/data';
import { useSession } from '@/features/auth/hooks/useSession';

export function useHousehold() {
  const { user } = useSession();
  return useQuery({
    queryKey: ['household', user?.id],
    queryFn: () => getMyHousehold(user?.id ?? ''),
    enabled: !!user,
  });
}

export function useAccountCount(householdId: string | undefined) {
  return useQuery({
    queryKey: ['accounts', householdId, 'count'],
    queryFn: () => countAccounts(householdId ?? ''),
    enabled: !!householdId,
  });
}

export function useCategories(householdId: string | undefined) {
  return useQuery({
    queryKey: ['categories', householdId],
    queryFn: () => getCategories(householdId ?? ''),
    enabled: !!householdId,
  });
}

export function useCreateHousehold() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NewHouseholdInput) => createHousehold(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['household'] }),
  });
}

export function useJoinHousehold() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: JoinHouseholdInput) => joinHousehold(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['household'] }),
  });
}

export function useCreateInvite() {
  return useMutation({
    mutationFn: ({ householdId, role }: { householdId: string; role?: InviteRole }) =>
      createInvite(householdId, role),
  });
}

type SetupInput = {
  householdId: string;
  account: NewAccountInput;
  removeCategoryIds: string[];
  currency: string;
};

/** Finishes quick setup: first account, then the categories the user did not want. */
export function useFinishSetup() {
  const queryClient = useQueryClient();
  const { user } = useSession();
  return useMutation({
    mutationFn: async ({ householdId, account, removeCategoryIds, currency }: SetupInput) => {
      await setBaseCurrency(householdId, currency);
      await addAccount(account, user?.id ?? '');
      await removeCategories(householdId, removeCategoryIds);
    },
    onSuccess: (_data, { householdId }) => {
      queryClient.invalidateQueries({ queryKey: ['household'] });
      queryClient.invalidateQueries({ queryKey: ['accounts', householdId] });
      queryClient.invalidateQueries({ queryKey: ['categories', householdId] });
    },
  });
}
