import { getCookie } from 'cookies-next';
import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';

import { Forbidden } from '@/(error)';

import { AUTH_COOKIE_VALUE, AuthCookieValue, COOKIE_KEY } from '@/constant';

type AuthStoreProps = {
  auth: AuthCookieValue | undefined;
};

interface AuthStoreActions {
  update: () => void;
}

type AuthStore = AuthStoreProps & AuthStoreActions;

const DEFAULT_AUTH_STORE: AuthStoreProps = {
  auth: undefined,
};

export const authStore = createStore<AuthStore>((set, get) => ({
  ...DEFAULT_AUTH_STORE,
  update: () => {
    const authCookieValue = getCookie(COOKIE_KEY.auth);

    const { auth } = get();

    if (!authCookieValue) return;

    if (authCookieValue === auth) return;

    if (authCookieValue !== AUTH_COOKIE_VALUE)
      throw new Forbidden({
        type: 'Forbidden',
        code: 403,
        detail: { field: COOKIE_KEY.auth, reason: 'INVALID' },
      });

    set({ auth: authCookieValue });

    return;
  },
}));

export const useAuthStore = () => useStore(authStore);
