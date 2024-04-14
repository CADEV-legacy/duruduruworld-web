import { NextRequest } from 'next/server';

import { AuthUpdateEmailRequestBody } from './type';

import { getConnection, getObjectId, getVerifiedAccessToken } from '@/(server)/lib';
import { UserModel } from '@/(server)/model';
import { SuccessResponse, getAccessToken, getRequestBodyJSON } from '@/(server)/util';

import { ErrorResponse, NotFound } from '@/(error)';

/**
 * NOTE: /api/auth/update/email
 * @required accessToken
 * @body AuthUpdateEmailRequestBody
 * @return void
 */
export const PATCH = async (request: NextRequest) => {
  await getConnection();

  try {
    const accessToken = getAccessToken(request);

    const { userId } = getVerifiedAccessToken(accessToken);

    const requestBody = await getRequestBodyJSON<AuthUpdateEmailRequestBody>(request, [
      { key: 'newEmail', required: true },
    ]);

    const user = await UserModel.findById(getObjectId(userId)).exec();

    if (!user)
      throw new NotFound({
        type: 'NotFound',
        code: 404,
        detail: 'user',
      });

    user.email = requestBody.newEmail;

    user.save();

    return SuccessResponse({ method: 'PATCH' });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const dynamic = 'force-dynamic';
