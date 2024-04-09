import { NextRequest } from 'next/server';

import {
  getConnection,
  getObjectId,
  getSignedTokens,
  getVerifiedRefreshToken,
} from '@/(server)/lib';
import { AccountModel } from '@/(server)/model';
import {
  SuccessResponse,
  getAccessTokenCokie,
  getAuthCookie,
  getAutoSignInCookie,
  getRefreshTokenCookie,
  getRequestAutoSignIn,
  getRequestRefreshToken,
} from '@/(server)/util';

import { ErrorResponse, NotFound } from '@/(error)';

import { COOKIE_KEY } from '@/constant';

/**
 * NOTE: /api/auth/refresh-token
 * @required refreshToken
 * @return AuthRefreshTokenResponse
 */
export const POST = async (request: NextRequest) => {
  await getConnection();

  try {
    const refreshToken = getRequestRefreshToken(request);
    const autoSignIn = getRequestAutoSignIn(request);

    const { accountId, userId } = getVerifiedRefreshToken(refreshToken);

    const account = await AccountModel.findById(getObjectId(accountId)).exec();

    if (!account)
      throw new NotFound({
        type: 'NotFound',
        code: 404,
        detail: 'account',
      });

    const newSignedTokens = getSignedTokens({ accountId, userId });

    account.refreshToken = newSignedTokens.refreshToken;

    await account.save();

    const newAccessTokenCookie = getAccessTokenCokie({
      value: newSignedTokens.accessToken,
      autoSignIn,
    });
    const newRefreshTokenCookie = getRefreshTokenCookie({
      value: newSignedTokens.refreshToken,
      autoSignIn,
    });
    const newAutoSignInCookie = getAutoSignInCookie(autoSignIn);
    const newAuthCookie = getAuthCookie(autoSignIn);

    return SuccessResponse({
      method: 'POST',
      cookies: [newAccessTokenCookie, newRefreshTokenCookie, newAutoSignInCookie, newAuthCookie],
    });
  } catch (error) {
    const response = ErrorResponse(error);

    response.cookies.delete(COOKIE_KEY.accessToken);
    response.cookies.delete(COOKIE_KEY.refreshToken);
    response.cookies.delete(COOKIE_KEY.autoSignIn);
    response.cookies.delete(COOKIE_KEY.auth);

    return response;
  }
};

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
