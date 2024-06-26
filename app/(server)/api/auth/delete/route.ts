import { NextRequest } from 'next/server';

import {
  AccountSchemaSelect,
  AuthDeleteCredentialRequestSearchParams,
  CredentialSchemaSelect,
} from './type';

import {
  comparePassword,
  getConnection,
  getObjectId,
  getVerifiedAccessToken,
} from '@/(server)/lib';
import { AccountModel, CredentialModel } from '@/(server)/model';
import { SuccessResponse, getAccessToken, getRequestSearchPraramsJSON } from '@/(server)/util';

import { ErrorResponse, NotFound, NotImplemented, ValidationFailed } from '@/(error)';

import { COOKIE_KEY } from '@/constant';

/**
 * NOTE: /api/auth/delete
 * @require accessToken
 * @searchParams (option1) AuthDeleteRequestSearchParams
 * @searchParams (option2) AuthDeleteSSORequestSearchParams
 * @return void
 */
export const DELETE = async (request: NextRequest) => {
  await getConnection();

  try {
    const accessToken = getAccessToken(request);

    const { accountId, accountType } = getVerifiedAccessToken(accessToken);

    if (accountType === 'credential') {
      const [account, credential] = await Promise.all([
        AccountModel.findById(getObjectId(accountId))
          .select<AccountSchemaSelect>('type status refreshToken')
          .exec(),
        CredentialModel.findOne({ account: getObjectId(accountId) })
          .select<CredentialSchemaSelect>('password')
          .lean()
          .exec(),
      ]);

      if (!account || account.status === 'withdrew')
        throw new NotFound({
          type: 'NotFound',
          code: 404,
          detail: 'account',
        });

      if (!credential)
        throw new NotFound({
          type: 'NotFound',
          code: 404,
          detail: 'credential',
        });

      const requestSearchPrarams =
        getRequestSearchPraramsJSON<AuthDeleteCredentialRequestSearchParams>(request, [
          { key: 'password', required: true },
        ]);

      const isAuthorized = await comparePassword(
        requestSearchPrarams.password,
        credential.password
      );

      if (!isAuthorized)
        throw new ValidationFailed({
          type: 'ValidationFailed',
          code: 422,
          detail: [{ field: 'password', reason: 'NOT_MATCHED' }],
        });

      account.refreshToken = '';

      account.status = 'withdrew';

      await account.save();

      const response = SuccessResponse({ method: 'DELETE' });

      response.cookies.delete(COOKIE_KEY.refreshToken);
      response.cookies.delete(COOKIE_KEY.autoSignIn);

      return response;
    } else if (accountType === 'kakao') {
      // TODO: Implement when kakao auth process is ready.

      throw new NotImplemented({ type: 'NotImplemented', code: 501 });
    } else {
      // NOTE: Implement when other sso auth process is needed.

      throw new NotImplemented({ type: 'NotImplemented', code: 501 });
    }
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const dynamic = 'force-dynamic';
