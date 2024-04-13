import { NextRequest } from 'next/server';

import { AuthUpdateMeRequestBody } from './type';

import { getConnection, getObjectId, getVerifiedAccessToken } from '@/(server)/lib';
import { UserModel } from '@/(server)/model';
import { SuccessResponse, getRequestBodyJSON, getRequestAccessToken } from '@/(server)/util';

import { ErrorResponse, NotFound } from '@/(error)';

/**
 * NOTE: /api/auth/update/me
 * @required accessToken
 * @body AuthUpdateMeRequestBody
 * @return void
 */
export const PATCH = async (request: NextRequest) => {
  await getConnection();

  try {
    const accessToken = getRequestAccessToken(request);

    const { userId } = getVerifiedAccessToken(accessToken);

    const requestBody = await getRequestBodyJSON<AuthUpdateMeRequestBody>(request, [
      { key: 'name', required: true },
      { key: 'phoneNumber', required: true },
      { key: 'age', required: true },
      { key: 'gender', required: true },
      { key: 'postalCode', required: true },
      { key: 'address', required: true },
      { key: 'addressDetail' },
    ]);

    const user = await UserModel.findById(getObjectId(userId)).exec();

    if (!user)
      throw new NotFound({
        type: 'NotFound',
        code: 404,
        detail: 'user',
      });

    user.name = requestBody.name;
    user.phoneNumber = requestBody.phoneNumber;
    user.age = requestBody.age;
    user.gender = requestBody.gender;
    user.postalCode = requestBody.postalCode;
    user.address = requestBody.address;
    user.addressDetail = requestBody.addressDetail;

    await user.save();

    return SuccessResponse({ method: 'PATCH' });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const dynamic = 'force-dynamic';
