'use client';

import { useEffect } from 'react';

import { ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SnackbarProvider } from 'notistack';

import { DefaultNotistack, ErrorNotistack } from './notistack';

import { authReissueTokenRequest } from '@/(client)/request';
import { useAuthStore } from '@/(client)/store';
import { theme } from '@/(client)/theme';

import { MILLISECOND_TIME_FORMAT } from '@/constant';

type ProviderProps = {
  children: React.ReactNode;
  hasAuth: boolean;
};

export const Provider: React.FC<ProviderProps> = ({ children, hasAuth }) => {
  const { isMounted, accessToken, mount, updateAuth } = useAuthStore();

  const queryClient = new QueryClient({
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

  const initializeAuthStore = async () => {
    if (accessToken) return;

    try {
      const { accessToken: newAccessToken } = await authReissueTokenRequest();

      updateAuth(newAccessToken);
    } catch (error) {
      updateAuth(null);
    }
  };

  useEffect(() => {
    mount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (!hasAuth) updateAuth(null);
      else initializeAuthStore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, hasAuth]);

  return (
    <AppRouterCacheProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider
            maxSnack={3}
            Components={{ default: DefaultNotistack, error: ErrorNotistack }}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            autoHideDuration={MILLISECOND_TIME_FORMAT.seconds(1.5)}>
            {children}
          </SnackbarProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppRouterCacheProvider>
  );
};
