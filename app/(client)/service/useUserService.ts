import { useQuery } from '@tanstack/react-query';

import { userCountRequest, userMeRequest } from '@/(client)/request';

export const userQueryKeys = {
  default: ['user'] as const,
  me: (accessToken?: string | null) => [...userQueryKeys.default, 'me', { accessToken }],
  count: () => [...userQueryKeys.default, 'count'],
};

export const userQueryOptions = {
  me: (accessToken?: string | null) => ({
    queryKey: userQueryKeys.me(accessToken),
    queryFn: () => userMeRequest(),
    enabled: !!accessToken,
  }),
  count: () => ({
    queryKey: userQueryKeys.count(),
    queryFn: () => userCountRequest(),
  }),
};

export const useUserMe = (accessToken?: string | null) =>
  useQuery(userQueryOptions.me(accessToken));

export const useUserCount = () => useQuery(userQueryOptions.count());
