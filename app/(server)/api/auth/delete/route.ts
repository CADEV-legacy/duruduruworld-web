import { NextRequest } from 'next/server';

import { AuthDeleteRequestSearchParams } from './type';

import {
  comparePassword,
  getConnection,
  getObjectId,
  getVerifiedAccessToken,
} from '@/(server)/lib';
import { AccountModel, UserModel } from '@/(server)/model';
import {
  SuccessResponse,
  getRequestAccessToken,
  getRequestSearchPraramsJSON,
} from '@/(server)/util';

import { ErrorResponse, Forbidden, NotFound } from '@/(error)';

import { COOKIE_KEY } from '@/constant';

/**
 * NOTE: /api/auth/delete
 * @require accessToken
 * @searchParams AuthDeleteRequestSearchParams
 * @return void
 */
export const DELETE = async (request: NextRequest) => {
  await getConnection();

  try {
    const accessToken = getRequestAccessToken(request);

    const { accountId, userId } = getVerifiedAccessToken(accessToken);

    const [account, user] = await Promise.all([
      AccountModel.findById({ _id: getObjectId(accountId) }).exec(),
      UserModel.findById({ _id: getObjectId(userId) })
        .lean()
        .exec(),
    ]);

    if (!account)
      throw new NotFound({
        type: 'NotFound',
        code: 404,
        detail: 'account',
      });

    if (!user)
      throw new NotFound({
        type: 'NotFound',
        code: 404,
        detail: 'user',
      });

    if (account.status === 'withdrew')
      throw new Forbidden({
        type: 'Forbidden',
        code: 403,
        detail: { field: 'accountStatus', reason: 'INVALID' },
      });

    if (account.type === 'credentials') {
      const searchParams = getRequestSearchPraramsJSON<AuthDeleteRequestSearchParams>(request, [
        { key: 'password', required: true },
      ]);

      const isAuthorized = comparePassword(searchParams.password, user.password);

      if (!isAuthorized)
        throw new Forbidden({
          type: 'Forbidden',
          code: 403,
          detail: { field: 'password', reason: 'UNAUTHORIZED' },
        });
    } else {
      // TODO: Implement SSO After v1.0.0
    }

    account.status = 'withdrew';

    await account.save();

    const response = SuccessResponse({ method: 'DELETE' });

    response.cookies.delete(COOKIE_KEY.accessToken);
    response.cookies.delete(COOKIE_KEY.refreshToken);
    response.cookies.delete(COOKIE_KEY.autoSignIn);
    response.cookies.delete(COOKIE_KEY.auth);

    return response;
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const fetchCache = 'force-no-store';
