import { QueryClient } from '@tanstack/react-query';

import { MILLISECOND_TIME_FORMAT } from '@/constant';

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
        retryDelay: MILLISECOND_TIME_FORMAT.seconds(2),
        staleTime: MILLISECOND_TIME_FORMAT.seconds(5),
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 0,
        retryDelay: MILLISECOND_TIME_FORMAT.seconds(2),
      },
    },
  });
};

let browserQueryClient: QueryClient | null = null;

export const getQueryClient = () => {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();

    return browserQueryClient;
  }
};
