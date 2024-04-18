import { NextRequest } from 'next/server';

import { AuthUpdatePasswordRequestBody, CredentialSchemaSelect } from './type';

import {
  comparePassword,
  getConnection,
  getObjectId,
  getVerifiedAccessToken,
} from '@/(server)/lib';
import { CredentialModel } from '@/(server)/model';
import { SuccessResponse, getRequestBodyJSON, getAccessToken } from '@/(server)/util';

import { ErrorResponse, Forbidden, NotFound } from '@/(error)';

/**
 * NOTE: /api/auth/update/password
 * @required accessToken
 * @body AuthUpdatePasswordRequestBody
 * @return void
 */
export const PATCH = async (request: NextRequest) => {
  await getConnection();

  try {
    const accessToken = getAccessToken(request);

    const { accountId, accountType } = getVerifiedAccessToken(accessToken);

    if (accountType !== 'credential')
      throw new Forbidden({
        type: 'Forbidden',
        code: 403,
        detail: { field: 'accountType', reason: 'RESTRICTED' },
      });

    const requestBody = await getRequestBodyJSON<AuthUpdatePasswordRequestBody>(request, [
      { key: 'currentPassword', required: true },
      { key: 'newPassword', required: true },
    ]);

    const credential = await CredentialModel.findOne({ accountId: getObjectId(accountId) })
      .select<CredentialSchemaSelect>('password')
      .exec();

    if (!credential)
      throw new NotFound({
        type: 'NotFound',
        code: 404,
        detail: 'user',
      });

    const isAuthorized = comparePassword(requestBody.currentPassword, credential.password);

    if (!isAuthorized)
      throw new Forbidden({
        type: 'Forbidden',
        code: 403,
        detail: { field: 'password', reason: 'UNAUTHORIZED' },
      });

    credential.password = requestBody.newPassword;

    await credential.save();

    return SuccessResponse({ method: 'PATCH' });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const dynamic = 'force-dynamic';
