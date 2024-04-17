import { NextRequest } from 'next/server';

import { AuthUpdateStatusRequestBody } from './type';

import { getConnection, getObjectId, getVerifiedAccessToken } from '@/(server)/lib';
import { AccountModel } from '@/(server)/model';
import { SuccessResponse, getRequestBodyJSON, getAccessToken } from '@/(server)/util';

import { ErrorResponse, Forbidden, NotFound } from '@/(error)';

/**
 * NOTE: /api/auth/update/status
 * @required accessToken
 * @body AuthUpdateStatusRequestBody
 * @return void
 */
export const PATCH = async (request: NextRequest) => {
  await getConnection();

  try {
    const accessToken = getAccessToken(request);

    const { accountId } = getVerifiedAccessToken(accessToken);

    const requestBodyJSON = await getRequestBodyJSON<AuthUpdateStatusRequestBody>(request, [
      { key: 'status', required: true },
    ]);

    const account = await AccountModel.findById(getObjectId(accountId)).exec();

    if (!account)
      throw new NotFound({
        type: 'NotFound',
        code: 404,
        detail: 'account',
      });

    if (account.status === 'pending' || account.status === 'withdrew')
      throw new Forbidden({
        type: 'Forbidden',
        code: 403,
        detail: { field: 'accountStatus', reason: 'RESTRICTED' },
      });

    if (requestBodyJSON.status === 'pending' || requestBodyJSON.status === 'withdrew')
      throw new Forbidden({
        type: 'Forbidden',
        code: 403,
        detail: { field: 'accountStatus', reason: 'INVALID' },
      });

    if (account.status !== requestBodyJSON.status) {
      account.status = requestBodyJSON.status;

      await account.save();
    }

    return SuccessResponse({ method: 'PATCH' });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const dynamic = 'force-dynamic';
