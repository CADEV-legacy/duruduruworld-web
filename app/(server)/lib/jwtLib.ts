import jwt, { JwtPayload } from 'jsonwebtoken';

import { getNumericTime } from '@/(server)/util';

import { NotFound, Unauthorized } from '@/(error)';

import { SERVER_SETTINGS } from '@/setting';

/** NOTE: Expires in 1h 10m (For sync with cookie - 1h) */
const getSignedAccessToken = (payload: JwtPayload) => {
  const ACCESS_TOKEN_EXPIRES_IN = getNumericTime({ type: 'second', hour: 1, minute: 10 });

  if (!SERVER_SETTINGS.ACCESS_TOKEN_JWT_SECRET)
    throw new NotFound({
      type: 'NotFound',
      code: 404,
      detail: 'ACCESS_TOKEN_JWT_SECRET',
    });

  try {
    return jwt.sign(payload, SERVER_SETTINGS.ACCESS_TOKEN_JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Unauthorized({ type: 'Unauthorized', code: 401, detail: error as any });
  }
};

/** NOTE: Expires in 30 day */
const getSignedRefreshToken = (payload: JwtPayload) => {
  const REFRESH_TOKEN_EXPIRES_IN = getNumericTime({ type: 'second', day: 30 });

  if (!SERVER_SETTINGS.REFRESH_TOKEN_JWT_SECRET)
    throw new NotFound({
      type: 'NotFound',
      code: 404,
      detail: 'REFRESH_TOKEN_JWT_SECRET',
    });

  try {
    return jwt.sign(payload, SERVER_SETTINGS.REFRESH_TOKEN_JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Unauthorized({ type: 'Unauthorized', code: 401, detail: error as any });
  }
};

export const getNewSignedTokens = (payload: JwtPayload) => {
  return {
    accessToken: getSignedAccessToken(payload),
    refreshToken: getSignedRefreshToken(payload),
  };
};

export const getVerifiedAccessToken = (token: string) => {
  if (!SERVER_SETTINGS.ACCESS_TOKEN_JWT_SECRET)
    throw new NotFound({
      type: 'NotFound',
      code: 404,
      detail: 'ACCESS_TOKEN_JWT_SECRET',
    });

  try {
    return jwt.verify(token, SERVER_SETTINGS.ACCESS_TOKEN_JWT_SECRET) as JwtPayload;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Unauthorized({ type: 'Unauthorized', code: 401, detail: error as any });
  }
};

export const getVerifiedRefreshToken = (token: string) => {
  if (!SERVER_SETTINGS.REFRESH_TOKEN_JWT_SECRET)
    throw new NotFound({
      type: 'NotFound',
      code: 404,
      detail: 'REFRESH_TOKEN_JWT_SECRET',
    });

  try {
    return jwt.verify(token, SERVER_SETTINGS.REFRESH_TOKEN_JWT_SECRET) as JwtPayload;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    throw new Unauthorized({ type: 'Unauthorized', code: 401, detail: error as any });
  }
};
