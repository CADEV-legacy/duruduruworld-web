import { NextRequest } from 'next/server';

import { AuthSignUpInformationRequestBody } from './type';

import { getConnection, getObjectId, getVerifiedAccessToken } from '@/(server)/lib';
import { AccountInformationModel, AccountModel } from '@/(server)/model';
import { SuccessResponse, getAccessToken, getRequestBodyJSON, validate } from '@/(server)/util';

import { ErrorResponse, Forbidden, NotFound, NotImplemented } from '@/(error)';

/**
 * NOTE: /api/auth/sign-up/information
 * @required accessToken
 * @body AuthSignUpInformationRequestBody
 * @return void
 */
export const POST = async (request: NextRequest) => {
  const connection = await getConnection();

  const session = await connection.startSession();

  session.startTransaction();

  try {
    const accessToken = getAccessToken(request);

    const { accountId, accountType } = getVerifiedAccessToken(accessToken);

    if (accountType === 'credential') {
      throw new Forbidden({
        type: 'Forbidden',
        code: 403,
        detail: {
          field: 'accountType',
          reason: 'RESTRICTED',
        },
      });
    } else if (accountType === 'kakao') {
      const requestBodyJSON = await getRequestBodyJSON<AuthSignUpInformationRequestBody>(request, [
        { key: 'pets', required: true },
        { key: 'name', required: true },
        { key: 'birth', required: true },
        { key: 'postalCode', required: true },
        { key: 'address', required: true },
        { key: 'addressDetail' },
        { key: 'gender', required: true },
        { key: 'marketingAgreement' },
      ]);

      validate({
        pets: requestBodyJSON.pets,
        name: requestBodyJSON.name,
        birth: requestBodyJSON.birth,
        gender: requestBodyJSON.gender,
      });

      const account = await AccountModel.findById(getObjectId(accountId)).exec();

      if (!account)
        throw new NotFound({
          type: 'NotFound',
          code: 404,
          detail: 'account',
        });

      if (!account.kakao)
        throw new NotFound({
          type: 'NotFound',
          code: 404,
          detail: 'kakao',
        });

      const [newAccountInformation] = await AccountInformationModel.create(
        [
          {
            pets: requestBodyJSON.pets,
            name: requestBodyJSON.name,
            birth: requestBodyJSON.birth,
            postalCode: requestBodyJSON.postalCode,
            address: requestBodyJSON.address,
            addressDetail: requestBodyJSON.addressDetail,
            gender: requestBodyJSON.gender,
            marketingAgreement: requestBodyJSON.marketingAgreement,
            account: account._id,
          },
        ],
        { session }
      );

      account.information = newAccountInformation._id;
      account.status = 'active';

      await account.save({ session });

      await session.commitTransaction();

      return SuccessResponse({ method: 'POST' });
    } else {
      // NOTE: Implement when other sso auth process is needed.

      throw new NotImplemented({
        type: 'NotImplemented',
        code: 501,
      });
    }
  } catch (error) {
    await session.abortTransaction();

    return ErrorResponse(error);
  } finally {
    session.endSession();
  }
};
