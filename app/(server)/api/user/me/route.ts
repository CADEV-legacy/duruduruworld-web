import { NextRequest } from 'next/server';

import { UserMeResponse } from './type';

import { getConnection, getObjectId, getVerifiedAccessToken } from '@/(server)/lib';
import { AccountInformationSchema, AccountModel, PetModel } from '@/(server)/model';
import { SuccessResponse, getAccessToken } from '@/(server)/util';

import { ErrorResponse, Forbidden, NotFound } from '@/(error)';

/**
 * NOTE: /api/user/me
 * @requires token
 * @return UserMeResponse
 */
export const GET = async (request: NextRequest) => {
  await getConnection();

  try {
    const accessToken = getAccessToken(request);

    const { accountId } = getVerifiedAccessToken(accessToken);

    const account = await AccountModel.findOne({ _id: getObjectId(accountId) })
      .populate<{
        information: AccountInformationSchema;
      }>(
        'information',
        'email pets name birth postalCode address addressDetail gender marketingAgreement deliveredCount'
      )
      .lean()
      .exec();

    if (!account)
      throw new NotFound({
        type: 'NotFound',
        code: 404,
        detail: 'account',
      });

    if (account.status === 'pending')
      throw new Forbidden({
        type: 'Forbidden',
        code: 403,
        detail: { field: 'accountStatus', reason: 'RESTRICTED' },
      });

    if (account.status === 'withdrew')
      throw new Forbidden({
        type: 'Forbidden',
        code: 403,
        detail: { field: 'accountStatus', reason: 'INVALID' },
      });

    const pets = await PetModel.find({ _id: { $in: account.information.pets } })
      .lean()
      .exec();

    return SuccessResponse<UserMeResponse>({
      method: 'GET',
      data: {
        type: account.type,
        status: account.status,
        createdAt: account.createdAt,
        information: account.information,
        pets: pets,
      },
    });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const dynamic = 'force-dynamic';
