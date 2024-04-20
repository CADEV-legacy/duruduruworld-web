import { NextRequest } from 'next/server';

import { AuthUpdatePetRequestBody } from './type';

import { getConnection, getObjectId, getVerifiedAccessToken } from '@/(server)/lib';
import { AccountInformationModel, PetModel } from '@/(server)/model';
import { SuccessResponse, getAccessToken, getRequestBodyJSON } from '@/(server)/util';

import { ErrorResponse, NotFound } from '@/(error)';

/**
 * NOTE: /api/auth/update/pet
 * @body AuthUpdatePetRequestBody
 * @return void
 */
export const PATCH = async (request: NextRequest) => {
  const connection = await getConnection();

  const session = await connection.startSession();

  session.startTransaction();

  try {
    const accessToken = getAccessToken(request);

    const { accountId } = getVerifiedAccessToken(accessToken);

    const requestBody = await getRequestBodyJSON<AuthUpdatePetRequestBody>(request, [
      { key: 'pets', required: true },
    ]);

    const accountInformation = await AccountInformationModel.findOne({
      account: getObjectId(accountId),
    }).exec();

    if (!accountInformation)
      throw new NotFound({ type: 'NotFound', code: 404, detail: 'accountInformation' });

    await PetModel.deleteMany({ _id: { $in: accountInformation.pets } }, { session })
      .lean()
      .exec();

    const today = new Date();

    const newPets = await PetModel.create(
      requestBody.pets.map(pet => ({ ...pet, createdAt: today, updatedAt: today })),
      { session }
    );

    accountInformation.pets = newPets.map(pet => pet._id);

    await accountInformation.save({ session });

    await session.commitTransaction();

    return SuccessResponse({ method: 'PATCH' });
  } catch (error) {
    console.info(error);
    await session.abortTransaction();

    return ErrorResponse(error);
  } finally {
    session.endSession();
  }
};
