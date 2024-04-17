import { NextRequest } from 'next/server';

import { AuthRefreshTokenResponse } from './type';

import {
  getConnection,
  getObjectId,
  getNewSignedTokens,
  getVerifiedRefreshToken,
} from '@/(server)/lib';
import { AccountModel } from '@/(server)/model';
import { SuccessResponse, getAuthCookie, getNewAuthCookie } from '@/(server)/util';

import { ErrorResponse, NotFound, Unauthorized } from '@/(error)';

import { COOKIE_KEY } from '@/constant';

/**
 * NOTE: /api/auth/refresh-token
 * @required refreshToken
 * @return AuthRefreshTokenResponse
 */
export const POST = async (request: NextRequest) => {
  await getConnection();

  try {
    const authCookie = getAuthCookie(request);

    const { accountId, accountType } = getVerifiedRefreshToken(authCookie.refreshTokenCookie.value);

    const account = await AccountModel.findById(getObjectId(accountId)).exec();

    if (!account)
      throw new NotFound({
        type: 'NotFound',
        code: 404,
        detail: 'account',
      });

    if (account.refreshToken !== authCookie.refreshTokenCookie.value) {
      throw new Unauthorized({
        type: 'Unauthorized',
        code: 401,
        detail: { name: 'TokenDestroyed', message: 'refresh token destroyed' },
      });
    }

    const newSignedTokens = getNewSignedTokens({ accountId, accountType });

    account.refreshToken = newSignedTokens.refreshToken;

    await account.save();

    const newAuthCookie = getNewAuthCookie({
      value: newSignedTokens.refreshToken,
      autoSignIn: !!authCookie.autoSignInCookie,
    });

    return SuccessResponse<AuthRefreshTokenResponse>({
      method: 'POST',
      cookies: newAuthCookie.autoSignInCookie
        ? [newAuthCookie.refreshTokenCookie, newAuthCookie.autoSignInCookie]
        : [newAuthCookie.refreshTokenCookie],
      data: {
        accessToken: newSignedTokens.accessToken,
      },
    });
  } catch (error) {
    const response = ErrorResponse(error);

    response.cookies.delete(COOKIE_KEY.refreshToken);
    response.cookies.delete(COOKIE_KEY.autoSignIn);

    return response;
  }
};

export const dynamic = 'force-dynamic';
