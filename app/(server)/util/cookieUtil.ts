import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

import { getNumericTime } from '@/(server)/util';

import { AUTH_COOKIE_VALUE, COOKIE_KEY } from '@/constant';

export type Cookie = {
  key: string;
  value: string;
  options?: Partial<ResponseCookie>;
};

export const getCookie = (
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

export const getAuthCookie = (autoSignIn: boolean): Cookie => {
  const AUTH_COOKIE_MAX_AGE = getNumericTime({ type: 'minute', day: 30 });

  return getCookie(COOKIE_KEY.auth, AUTH_COOKIE_VALUE, {
    sameSite: 'strict',
    secure: true,
    maxAge: autoSignIn ? AUTH_COOKIE_MAX_AGE : undefined,
    path: '/',
  });
};

export const getAutoSignInCookie = (autoSignIn: boolean): Cookie => {
  const AUTO_SIGN_IN_COOKIE_MAX_AGE = getNumericTime({ type: 'minute', day: 30 });

  return getCookie(COOKIE_KEY.autoSignIn, `${autoSignIn}`, {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    maxAge: autoSignIn ? AUTO_SIGN_IN_COOKIE_MAX_AGE : undefined,
    path: '/',
  });
};

type GetAccessTokenCookieParams = {
  value: string;
  options?: Partial<ResponseCookie>;
  autoSignIn: boolean;
};

/** NOTE: Expires in 1h */
export const getAccessTokenCokie = ({ value, options }: GetAccessTokenCookieParams): Cookie => {
  const ACCESS_TOKEN_COOKIE_MAX_AGE = getNumericTime({ type: 'minute', hour: 1 });

  return getCookie(COOKIE_KEY.accessToken, value, {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE,
    path: '/',
    ...options,
  });
};

type GetRefreshTokenCookieParams = {
  value: string;
  options?: Partial<ResponseCookie>;
  autoSignIn: boolean;
};

/** NOTE: Expires in 30d */
export const getRefreshTokenCookie = ({
  value,
  options,
  autoSignIn,
}: GetRefreshTokenCookieParams): Cookie => {
  const REFRESH_TOKEN_COOKIE_MAX_AGE = getNumericTime({ type: 'minute', day: 30 });

  return getCookie(COOKIE_KEY.refreshToken, value, {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    maxAge: autoSignIn ? REFRESH_TOKEN_COOKIE_MAX_AGE : undefined,
    path: '/',
    ...options,
  });
};
