import { useQuery } from '@tanstack/react-query';

import { userCountRequest, userMeRequest } from '@/(client)/request';

const userQueryKeys = {
  default: ['user'] as const,
  me: (hasAuth?: boolean) => [...userQueryKeys.default, 'me', { hasAuth: !!hasAuth }],
  count: () => [...userQueryKeys.default, 'count'],
};

export const userQueryOptions = {
  me: (hasAuth?: boolean) => ({
    queryKey: userQueryKeys.me(hasAuth),
    queryFn: () => userMeRequest(),
    enabled: hasAuth,
  }),
  count: () => ({
    queryKey: userQueryKeys.count(),
    queryFn: () => userCountRequest(),
  }),
};

export const useUserMe = (hasAuth: boolean) => useQuery(userQueryOptions.me(hasAuth));

export const useUserCount = () => useQuery(userQueryOptions.count());
