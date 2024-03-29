import { NextRequest } from 'next/server';

import { AuthDeleteRequestSearchParams } from './type';

import { ErrorResponse, Forbidden } from '@/(server)/error';
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

import { COOKIE_KEY } from '@/constant';

/**
 * NOTE: /api/auth/delete
 * @requires token
 * @params AuthDeleteRequestSearchParams
 * @return void
 */
export const DELETE = async (request: NextRequest) => {
  await getConnection();

  try {
    const accessToken = getRequestAccessToken(request);

    const { accountId, userId } = getVerifiedAccessToken(accessToken);

    const account = await AccountModel.findOne({
      _id: getObjectId(accountId),
      userId: getObjectId(userId),
    }).exec();

    if (!account) throw new Forbidden({ type: 'Forbidden', code: 403, detail: 'account' });

    const user = await UserModel.findById(getObjectId(userId)).exec();

    if (!user) throw new Forbidden({ type: 'Forbidden', code: 403, detail: 'user' });

    if (account.status === 'withdrew')
      throw new Forbidden({
        type: 'Forbidden',
        code: 403,
        detail: 'accountStatus',
      });

    if (account.type === 'credentials') {
      const searchParams = getRequestSearchPraramsJSON<AuthDeleteRequestSearchParams>(request, [
        'password',
      ]);

      const isAuthorized = comparePassword(searchParams.password, user.password);

      if (!isAuthorized) throw new Forbidden({ type: 'Forbidden', code: 403, detail: 'password' });
    }

    account.status = 'withdrew';

    await account.save();

    const response = SuccessResponse({ method: 'DELETE' });

    response.cookies.delete(COOKIE_KEY.accessToken);
    response.cookies.delete(COOKIE_KEY.refreshToken);
    response.cookies.delete(COOKIE_KEY.autoSignIn);

    return response;
  } catch (error) {
    return ErrorResponse(error);
  }
};
