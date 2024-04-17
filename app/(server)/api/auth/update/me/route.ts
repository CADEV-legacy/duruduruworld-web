import { NextRequest } from 'next/server';

import { AuthUpdateMeRequestBody } from './type';

import { getConnection, getObjectId, getVerifiedAccessToken } from '@/(server)/lib';
import { AccountInformationModel, PetModel } from '@/(server)/model';
import { SuccessResponse, getRequestBodyJSON, getAccessToken } from '@/(server)/util';

import { ErrorResponse, NotFound } from '@/(error)';

/**
 * NOTE: /api/auth/update/me
 * @required accessToken
 * @body AuthUpdateMeRequestBody
 * @return void
 */
export const PATCH = async (request: NextRequest) => {
  const connection = await getConnection();

  const session = await connection.startSession();

  session.startTransaction();

  try {
    const accessToken = getAccessToken(request);

    const { accountId } = getVerifiedAccessToken(accessToken);

    const requestBody = await getRequestBodyJSON<AuthUpdateMeRequestBody>(request, [
      { key: 'pets', required: true },
      { key: 'name', required: true },
      { key: 'birth', required: true },
      { key: 'postalCode', required: true },
      { key: 'address', required: true },
      { key: 'addressDetail' },
      { key: 'gender', required: true },
    ]);

    const accountInformation = await AccountInformationModel.findOne({
      account: getObjectId(accountId),
    }).exec();

    if (!accountInformation)
      throw new NotFound({
        type: 'NotFound',
        code: 404,
        detail: 'user',
      });

    await PetModel.deleteMany({ _id: { $in: accountInformation.pets } }, { session }).exec();

    const pets = await PetModel.create(requestBody.pets, { session });

    accountInformation.pets = pets.map(pet => pet._id);
    accountInformation.name = requestBody.name;
    accountInformation.birth = requestBody.birth;
    accountInformation.postalCode = requestBody.postalCode;
    accountInformation.address = requestBody.address;
    accountInformation.addressDetail = requestBody.addressDetail;
    accountInformation.gender = requestBody.gender;

    await accountInformation.save({ session });

    await session.commitTransaction();

    return SuccessResponse({ method: 'PATCH' });
  } catch (error) {
    await session.abortTransaction();

    return ErrorResponse(error);
  } finally {
    session.endSession();
  }
};

export const dynamic = 'force-dynamic';
