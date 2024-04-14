import { NextRequest } from 'next/server';

import { AuthSignInRequestBody, AuthSignInResponse } from './type';

import { comparePassword, getConnection, getNewSignedTokens } from '@/(server)/lib';
import { AccountModel, UserModel } from '@/(server)/model';
import { SuccessResponse, getRequestBodyJSON, validate, getNewAuthCookie } from '@/(server)/util';

import { ErrorResponse, Forbidden, NotFound } from '@/(error)';

/**
 * NOTE: /api/auth/sign-in
 * @body AuthSignInRequestBody
 * @return AuthSignInResponse
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

    const { accessToken, refreshToken } = getNewSignedTokens({
      accountId: account._id.toHexString(),
      userId: user._id.toHexString(),
    });

    account.refreshToken = refreshToken;

    await account.save();

    const { refreshTokenCookie, autoSignInCookie } = getNewAuthCookie({
      value: refreshToken,
      autoSignIn: requestBodyJSON.autoSignIn,
    });

    return SuccessResponse<AuthSignInResponse>({
      method: 'POST',
      cookies: autoSignInCookie ? [refreshTokenCookie, autoSignInCookie] : [refreshTokenCookie],
      data: { accessToken },
    });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const dynamic = 'force-dynamic';
