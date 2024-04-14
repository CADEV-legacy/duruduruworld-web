import { NextRequest } from 'next/server';

import { AuthReIssueTokenResponse } from './type';

import {
  getConnection,
  getObjectId,
  getNewSignedTokens,
  getVerifiedRefreshToken,
} from '@/(server)/lib';
import { AccountModel } from '@/(server)/model';
import { SuccessResponse, getAuthCookie } from '@/(server)/util';

import { ErrorResponse, NotFound, Unauthorized } from '@/(error)';

import { COOKIE_KEY } from '@/constant';

/**
 * NOTE: /api/auth/refresh-token
 * @required refreshToken
 * @return AuthReIssueTokenResponse
 */
export const POST = async (request: NextRequest) => {
  await getConnection();

  try {
    const authCookie = getAuthCookie(request);

    const { accountId, userId } = getVerifiedRefreshToken(authCookie.refreshTokenCookie.value);

    const account = await AccountModel.findById(getObjectId(accountId)).lean().exec();

    if (!account)
      throw new NotFound({
        type: 'NotFound',
        code: 404,
        detail: 'account',
      });

    const isAuthorized = account.refreshToken === authCookie.refreshTokenCookie.value;

    if (!isAuthorized) {
      throw new Unauthorized({
        type: 'Unauthorized',
        code: 401,
        detail: { name: 'TokenNotExist', message: 'refresh token not exist' },
      });
    }

    const newSignedTokens = getNewSignedTokens({ accountId, userId });

    return SuccessResponse<AuthReIssueTokenResponse>({
      method: 'POST',
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
