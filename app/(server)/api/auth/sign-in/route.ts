import { NextRequest } from 'next/server';

import { AuthSignInRequestBody } from './type';

import { comparePassword, getConnection, getSignedTokens } from '@/(server)/lib';
import { AccountModel, UserModel } from '@/(server)/model';
import {
  SuccessResponse,
  getRequestBodyJSON,
  getAccessTokenCokie,
  getRefreshTokenCookie,
  validate,
  getAutoSignInCookie,
  getAuthCookie,
} from '@/(server)/util';

import { ErrorResponse, Forbidden, NotFound } from '@/(error)';

/**
 * NOTE: /api/auth/sign-in
 * @body AuthSignInRequestBody
 * @return void
 */
export const POST = async (request: NextRequest) => {
  await getConnection();

  try {
    const requestBodyJSON = await getRequestBodyJSON<AuthSignInRequestBody>(request, [
      { key: 'email', required: true },
      { key: 'password', required: true },
      { key: 'autoSignIn', required: true },
    ]);

    validate({ email: requestBodyJSON.email, password: requestBodyJSON.password });

    const user = await UserModel.findOne({ email: requestBodyJSON.email }).lean().exec();

    if (!user)
      throw new NotFound({
        type: 'NotFound',
        code: 404,
        detail: 'user',
      });

    const isAuthorized = await comparePassword(requestBodyJSON.password, user.password);

    if (!isAuthorized) {
      throw new Forbidden({
        type: 'Forbidden',
        code: 403,
        detail: { field: 'password', reason: 'UNAUTHORIZED' },
      });
    }

    const account = await AccountModel.findOne({ user: user._id }).exec();

    if (!account)
      throw new NotFound({
        type: 'NotFound',
        code: 404,
        detail: 'account',
      });

    const isActive = account.status === 'active';

    if (!isActive) {
      throw new Forbidden({
        type: 'Forbidden',
        code: 403,
        detail: { field: 'accountStatus', reason: 'INVALID' },
      });
    }

    const signedTokens = getSignedTokens({
      accountId: account._id.toHexString(),
      userId: user._id.toHexString(),
    });

    account.refreshToken = signedTokens.refreshToken;

    await account.save();

    const accessTokenCookie = getAccessTokenCokie({
      value: signedTokens.accessToken,
      autoSignIn: requestBodyJSON.autoSignIn,
    });
    const refreshTokenCookie = getRefreshTokenCookie({
      value: signedTokens.refreshToken,
      autoSignIn: requestBodyJSON.autoSignIn,
    });
    const autoSignInCookie = getAutoSignInCookie(requestBodyJSON.autoSignIn);
    const authCookie = getAuthCookie(requestBodyJSON.autoSignIn);

    return SuccessResponse({
      method: 'POST',
      cookies: [accessTokenCookie, refreshTokenCookie, autoSignInCookie, authCookie],
    });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const fetchCache = 'force-no-store';
