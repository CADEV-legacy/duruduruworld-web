import { NextRequest } from 'next/server';

import { getConnection, getObjectId, getVerifiedAccessToken } from '@/(server)/lib';
import { AccountModel, KakaoModel } from '@/(server)/model';
import { SuccessResponse, getAccessToken } from '@/(server)/util';

import { ErrorResponse, NotFound } from '@/(error)';

import { COOKIE_KEY } from '@/constant';

/**
 * NOTE: /api/auth/sign-out
 * @required accessToken
 * @return void
 */
export const POST = async (request: NextRequest) => {
  const connection = await getConnection();

  const session = await connection.startSession();

  session.startTransaction();

  try {
    const accessToken = getAccessToken(request);

    const { accountId, accountType } = getVerifiedAccessToken(accessToken);

    const account = await AccountModel.findById(getObjectId(accountId)).exec();

    if (!account)
      throw new NotFound({
        type: 'NotFound',
        code: 404,
        detail: 'account',
      });

    // NOTE: Implement when other sso auth process is needed.
    if (accountType === 'kakao') {
      const kakao = await KakaoModel.findOne({ account: getObjectId(accountId) }).exec();

      if (!kakao)
        throw new NotFound({
          type: 'NotFound',
          code: 404,
          detail: 'kakao',
        });

      kakao.kakaoRefreshToken = '';

      await kakao.save({ session });
    }

    account.refreshToken = '';

    await account.save({ session });

    const response = SuccessResponse({ method: 'POST' });

    response.cookies.delete(COOKIE_KEY.refreshToken);
    response.cookies.delete(COOKIE_KEY.autoSignIn);

    await session.commitTransaction();

    return response;
  } catch (error) {
    await session.abortTransaction();

    return ErrorResponse(error);
  } finally {
    session.endSession();
  }
};

export const dynamic = 'force-dynamic';
