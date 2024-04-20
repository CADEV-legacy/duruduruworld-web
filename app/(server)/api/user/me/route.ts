import { NextRequest } from 'next/server';

import { AccountInformationSchemaSelect, AccountSchemaSelect, UserMeResponse } from './type';

import { getConnection, getObjectId, getVerifiedAccessToken } from '@/(server)/lib';
import { AccountInformationModel, AccountModel, PetSchema } from '@/(server)/model';
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

    const [account, accountInformation] = await Promise.all([
      AccountModel.findById(getObjectId(accountId))
        .select<AccountSchemaSelect>('type status createdAt')
        .lean()
        .exec(),
      AccountInformationModel.findOne({ account: getObjectId(accountId) })
        .select<AccountInformationSchemaSelect>(
          'email pets name birth postalCode address addressDetail gender marketingAgreement deliveredCount'
        )
        .populate<{ pets: PetSchema[] }>('pets', 'name birth type typeText content')
        .lean()
        .exec(),
    ]);

    if (!account)
      throw new NotFound({
        type: 'NotFound',
        code: 404,
        detail: 'account',
      });

    if (!accountInformation)
      throw new NotFound({
        type: 'NotFound',
        code: 404,
        detail: 'accountInformation',
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

    return SuccessResponse<UserMeResponse>({
      method: 'GET',
      data: {
        account: {
          type: account.type,
          status: account.status,
          createdAt: account.createdAt,
        },
        information: {
          email: accountInformation.email,
          name: accountInformation.name,
          birth: accountInformation.birth,
          postalCode: accountInformation.postalCode,
          address: accountInformation.address,
          addressDetail: accountInformation.addressDetail,
          gender: accountInformation.gender,
          marketingAgreement: accountInformation.marketingAgreement,
          deliveredCount: accountInformation.deliveredCount,
        },
        pets: accountInformation.pets.map(pet => ({
          name: pet.name,
          birth: pet.birth,
          type: pet.type,
          typeText: pet.typeText,
          content: pet.content,
        })),
      },
    });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const dynamic = 'force-dynamic';
