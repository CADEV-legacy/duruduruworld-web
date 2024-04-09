import { NextRequest } from 'next/server';

import { AuthUpdatePasswordRequestBody } from './type';

import {
  comparePassword,
  getConnection,
  getObjectId,
  getVerifiedAccessToken,
} from '@/(server)/lib';
import { UserModel } from '@/(server)/model';
import { SuccessResponse, getRequestBodyJSON, getRequestAccessToken } from '@/(server)/util';

import { ErrorResponse, Forbidden, NotFound } from '@/(error)';

/**
 * NOTE: /api/auth/update/password
 * @required accessToken
 * @body AuthUpdatePasswordRequestBody
 * @return void
 */
export const PATCH = async (request: NextRequest) => {
  await getConnection();

  try {
    const accessToken = getRequestAccessToken(request);

    const { userId } = getVerifiedAccessToken(accessToken);

    const requestBody = await getRequestBodyJSON<AuthUpdatePasswordRequestBody>(request, [
      { key: 'currentPassword', required: true },
      { key: 'newPassword', required: true },
    ]);

    const user = await UserModel.findById(getObjectId(userId)).exec();

    if (!user)
      throw new NotFound({
        type: 'NotFound',
        code: 404,
        detail: 'user',
      });

    const isAuthorized = comparePassword(requestBody.currentPassword, user.password);

    if (!isAuthorized)
      throw new Forbidden({
        type: 'Forbidden',
        code: 403,
        detail: { field: 'password', reason: 'UNAUTHORIZED' },
      });

    user.password = requestBody.newPassword;

    await user.save();

    return SuccessResponse({ method: 'PATCH' });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
