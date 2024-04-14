import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

import { getNumericTime } from '@/(server)/util';

import { COOKIE_KEY } from '@/constant';

export type Cookie = {
  key: string;
  value: string;
  options?: Partial<ResponseCookie>;
};

export const getNewCookie = (
  key: string,
  value: string,
  options?: Partial<ResponseCookie>
): Cookie => {
  return {
    key,
    value,
    options,
  };
};

/**
 * NOTE: Cookie expires handled by autoSignIn
 * - If autoSignIn is true, the refresh-token cookie will expire in 30 days. (autoSignIn cookie will also expire in 30 days).
 * - If autoSignIn is false, the refresh-token cookie will expire when the browser is closed (session cookie)
 */
type GetNewAuthCookieParams = {
  value: string;
  options?: Partial<ResponseCookie>;
  autoSignIn: boolean;
};

type GetNewAuthCookieReturn = {
  refreshTokenCookie: Cookie;
  autoSignInCookie?: Cookie;
};

export const getNewAuthCookie = ({
  value,
  options,
  autoSignIn,
}: GetNewAuthCookieParams): GetNewAuthCookieReturn => {
  const COOKIE_MAX_AGE = autoSignIn ? getNumericTime({ type: 'minute', day: 30 }) : undefined;

  const refreshTokenCookie = getNewCookie(COOKIE_KEY.refreshToken, value, {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    maxAge: COOKIE_MAX_AGE,
    path: '/',
    ...options,
  });

  const autoSignInCookie = autoSignIn
    ? getNewCookie(COOKIE_KEY.autoSignIn, 'true', {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        maxAge: COOKIE_MAX_AGE,
        path: '/',
      })
    : undefined;

  return {
    refreshTokenCookie,
    autoSignInCookie,
  };
};
