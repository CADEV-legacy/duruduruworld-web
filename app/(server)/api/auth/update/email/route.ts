import { NextRequest } from 'next/server';

import { AuthUpdateEmailRequestBody } from './type';

import { getConnection, getObjectId, getVerifiedAccessToken } from '@/(server)/lib';
import { UserModel } from '@/(server)/model';
import { SuccessResponse, getRequestBodyJSON, getRequestAccessToken } from '@/(server)/util';

import { ErrorResponse, Forbidden } from '@/(error)';

/**
 * NOTE: /api/auth/update/email
 * @required accessToken
 * @body AuthUpdateEmailRequestBody
 * @return void
 */
export const PATCH = async (request: NextRequest) => {
  await getConnection();

  try {
    const accessToken = getRequestAccessToken(request);

    const { userId } = getVerifiedAccessToken(accessToken);

    const requestBody = await getRequestBodyJSON<AuthUpdateEmailRequestBody>(request, [
      { key: 'newEmail', required: true },
    ]);

    const user = await UserModel.findById(getObjectId(userId)).exec();

    if (!user)
      throw new Forbidden({
        type: 'Forbidden',
        code: 403,
        detail: { field: 'user', reason: 'NOT_EXIST' },
      });

    user.email = requestBody.newEmail;

    user.save();

    return SuccessResponse({ method: 'PATCH' });
  } catch (error) {
    return ErrorResponse(error);
  }
};
