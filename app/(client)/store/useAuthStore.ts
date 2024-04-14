import { useStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { Unauthorized } from '@/(error)';

import { AUTHORIZATION, SESSION_STORAGE_KEY } from '@/constant';

type GetAuthorizationHeaderReturn = {
  [AUTHORIZATION.key]: string;
};

type AuthStoreState = {
  isMounted: boolean | undefined;
  accessToken: string | null | undefined;
};

interface AuthStoreActions {
  mount: () => void;
  updateAuth: (newAccessToken: string | null) => void;
  clearAuth: () => void;
  getAuthorizationHeader: () => GetAuthorizationHeaderReturn;
}

export type AuthStore = AuthStoreState & AuthStoreActions;

const DEFAULT_AUTH_STORE: AuthStoreState = {
  accessToken: undefined,
  isMounted: undefined,
};

export const authStore = createStore<AuthStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_AUTH_STORE,
      mount: () => set({ isMounted: true }),
      updateAuth: newAccessToken => set({ accessToken: newAccessToken }),
      clearAuth: () => set({ accessToken: null }),
      getAuthorizationHeader: () => {
        const { accessToken } = get();

        if (!accessToken) {
          throw new Unauthorized({
            type: 'Unauthorized',
            code: 401,
            detail: {
              name: 'TokenNotExist',
              message: 'access token not exist',
            },
          });
        }

        return { [AUTHORIZATION.key]: `${AUTHORIZATION.value}${accessToken}` };
      },
    }),
    {
      name: SESSION_STORAGE_KEY.authStore,
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useAuthStore = () => useStore(authStore);
