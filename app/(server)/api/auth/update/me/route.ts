import { NextRequest } from 'next/server';

import { AuthUpdateMeRequestBody } from './type';

import { getConnection, getObjectId, getVerifiedAccessToken } from '@/(server)/lib';
import { AccountInformationModel } from '@/(server)/model';
import { SuccessResponse, getRequestBodyJSON, getAccessToken, validate } from '@/(server)/util';

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
    const accessToken = getAccessToken(request);

    const { accountId } = getVerifiedAccessToken(accessToken);

    const requestBody = await getRequestBodyJSON<AuthUpdateMeRequestBody>(request, [
      { key: 'name', required: true },
      { key: 'email' },
      { key: 'birth', required: true },
      { key: 'postalCode', required: true },
      { key: 'address', required: true },
      { key: 'addressDetail', required: true },
      { key: 'gender', required: true },
    ]);

    validate({
      name: requestBody.name,
      email: requestBody.email,
      birth: requestBody.birth,
      gender: requestBody.gender,
    });

    const accountInformation = await AccountInformationModel.findOne({
      account: getObjectId(accountId),
    }).exec();

    if (!accountInformation)
      throw new NotFound({
        type: 'NotFound',
        code: 404,
        detail: 'accountInformation',
      });

    accountInformation.name = requestBody.name;
    accountInformation.email = requestBody.email;
    accountInformation.birth = requestBody.birth;
    accountInformation.postalCode = requestBody.postalCode;
    accountInformation.address = requestBody.address;
    accountInformation.addressDetail = requestBody.addressDetail;
    accountInformation.gender = requestBody.gender;

    await accountInformation.save();

    return SuccessResponse({ method: 'PATCH' });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const dynamic = 'force-dynamic';
