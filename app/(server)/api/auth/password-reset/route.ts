import { NextRequest } from 'next/server';

import { AuthPasswordResetRequestBody } from './type';

import { getConnection, getHashedPassword } from '@/(server)/lib';
import { UserModel, VerificationModel } from '@/(server)/model';
import { SuccessResponse, getRequestBodyJSON } from '@/(server)/util';

import { ErrorResponse, Forbidden, NotFound } from '@/(error)';

import { MILLISECOND_TIME_FORMAT } from '@/constant';

/**
 * NOTE: /api/auth/password-reset
 * @body AuthPasswordResetRequestBody
 * @return void
 */
export const PATCH = async (request: NextRequest) => {
  const connection = await getConnection();

  const session = await connection.startSession();

  try {
    const requestBodyJSON = await getRequestBodyJSON<AuthPasswordResetRequestBody>(request, [
      { key: 'email', required: true },
      { key: 'newPassword', required: true },
      { key: 'verificationCode', required: true },
    ]);

    const user = await UserModel.findOne({ email: requestBodyJSON.email }).exec();

    if (!user)
      throw new NotFound({
        type: 'NotFound',
        code: 404,
        detail: 'user',
      });

    const verification = await VerificationModel.findOne({
      phoneNumber: user.phoneNumber,
    }).exec();

    if (!verification)
      throw new NotFound({
        type: 'NotFound',
        code: 404,
        detail: 'verification',
      });

    if (verification.verificationCode !== requestBodyJSON.verificationCode)
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

    const hashedPassword = await getHashedPassword(requestBodyJSON.newPassword);

    await session.withTransaction(async () => {
      user.password = hashedPassword;

      await user.save();

      await verification.deleteOne({ session });
    });

    return SuccessResponse({ method: 'PATCH' });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const fetchCache = 'force-no-store';
