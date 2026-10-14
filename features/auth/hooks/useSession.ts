import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';

import { getCurrentUser, onAuthChange } from '@/data';

export const sessionKey = ['session'] as const;

/** Current user (null when signed out); stays in sync with sign-in, sign-out and token refresh. */
export function useSession() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: sessionKey, queryFn: getCurrentUser, staleTime: Infinity });

  React.useEffect(
    () =>
      onAuthChange((user) => {
        queryClient.setQueryData(sessionKey, user);
        if (!user) queryClient.removeQueries({ predicate: (q) => q.queryKey[0] !== 'session' });
      }),
    [queryClient]
  );

  return { user: query.data ?? null, isLoading: query.isPending };
}
