'use client';

import { useEffect } from 'react';

import { ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SnackbarProvider } from 'notistack';

import { ScrollToTop } from '@/(client)/component';
import { authRefreshTokenRequest } from '@/(client)/request';
import { getQueryClient } from '@/(client)/service';
import { useAuthStore } from '@/(client)/store';
import { theme } from '@/(client)/theme';

import { ErrorNotistack, SuccessNotistack, WarningNotistack } from '@/(client)/component/notistack';

import { MILLISECOND_TIME_FORMAT } from '@/constant';

type ProviderProps = {
  children: React.ReactNode;
  hasAuth: boolean;
};

export const Provider: React.FC<ProviderProps> = ({ children, hasAuth }) => {
  const { isMounted, accessToken, mount, updateAuth } = useAuthStore();

  const queryClient = getQueryClient();

  const initializeAuthStore = async () => {
    if (accessToken) return;

    try {
      const { accessToken: newAccessToken } = await authRefreshTokenRequest();

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
            Components={{
              success: SuccessNotistack,
              error: ErrorNotistack,
              warning: WarningNotistack,
            }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            autoHideDuration={MILLISECOND_TIME_FORMAT.seconds(1.5)}>
            {children}
          </SnackbarProvider>
        </ThemeProvider>
        <ScrollToTop />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppRouterCacheProvider>
  );
};
