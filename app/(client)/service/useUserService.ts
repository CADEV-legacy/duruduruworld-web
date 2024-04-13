import { useQuery } from '@tanstack/react-query';

import { userCountRequest, userMeRequest } from '@/(client)/request';

import { AUTH_COOKIE_VALUE, AuthCookieValue } from '@/constant';

const userQueryKeys = {
  default: ['user'] as const,
  me: (auth?: AuthCookieValue) => [...userQueryKeys.default, 'me', { auth: auth }],
  count: () => [...userQueryKeys.default, 'count'],
};

export const userQueryOptions = {
  me: (auth?: AuthCookieValue) => ({
    queryKey: userQueryKeys.me(auth),
    queryFn: () => userMeRequest(),
    enabled: auth === AUTH_COOKIE_VALUE,
  }),
  count: () => ({
    queryKey: userQueryKeys.count(),
    queryFn: () => userCountRequest(),
  }),
};

export const useUserMe = (auth?: AuthCookieValue) => useQuery(userQueryOptions.me(auth));

export const useUserCount = () => useQuery(userQueryOptions.count());
