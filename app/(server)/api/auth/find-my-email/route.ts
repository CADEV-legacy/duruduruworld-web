import { NextRequest } from 'next/server';

import { AuthFindMyEmailRequestSearchParams, AuthFindMyEmailResponse } from './type';

import { getConnection } from '@/(server)/lib';
import { UserModel, VerificationModel } from '@/(server)/model';
import { SuccessResponse, getRequestSearchPraramsJSON } from '@/(server)/util';

import { ErrorResponse, Forbidden, NotFound } from '@/(error)';

import { MILLISECOND_TIME_FORMAT } from '@/constant';

/**
 * NOTE: /api/auth/find-my-email
 * @searchParams AuthFindMyEmailRequestSearchParams
 * @return AuthFindMyEmailResponse
 */
export const GET = async (request: NextRequest) => {
  await getConnection();

  try {
    const searchParams = getRequestSearchPraramsJSON<AuthFindMyEmailRequestSearchParams>(request, [
      { key: 'verificationCode', required: true },
      { key: 'phoneNumber', required: true },
    ]);

    const [user, verification] = await Promise.all([
      UserModel.findOne({ phoneNumber: searchParams.phoneNumber }).lean().exec(),
      VerificationModel.findOne({ phoneNumber: searchParams.phoneNumber }).exec(),
    ]);

    if (!verification)
      throw new NotFound({
        type: 'NotFound',
        code: 404,
        detail: 'verification',
      });

    if (verification.verificationCode !== searchParams.verificationCode)
      throw new Forbidden({
        type: 'Forbidden',
        code: 403,
        detail: { field: 'verificationCode', reason: 'INVALID' },
      });

    const limitTime =
      new Date(verification.updatedAt).getTime() + MILLISECOND_TIME_FORMAT.minutes(5);
    const currentTime = Date.now();

    if (limitTime < currentTime)
      throw new Forbidden({
        type: 'Forbidden',
        code: 403,
        detail: { field: 'verification', reason: 'TIMEOUT' },
      });

    if (!user)
      throw new NotFound({
        type: 'NotFound',
        code: 404,
        detail: 'user',
      });

    await verification.deleteOne();

    return SuccessResponse<AuthFindMyEmailResponse>({ method: 'GET', data: { email: user.email } });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
