import { NextRequest } from 'next/server';

import { AuthPasswordResetRequestBody } from './type';

import { getConnection, getHashedPassword } from '@/(server)/lib';
import { CredentialModel, VerificationModel } from '@/(server)/model';
import { SuccessResponse, getRequestBodyJSON } from '@/(server)/util';

import { ErrorResponse, Forbidden, NotFound } from '@/(error)';

import { VERIFICATION_LIMIT } from '@/constant';

/**
 * NOTE: /api/auth/password-reset
 * @body AuthPasswordResetRequestBody
 * @return void
 */
export const PATCH = async (request: NextRequest) => {
  const connection = await getConnection();

  const session = await connection.startSession();

  session.startTransaction();

  try {
    const requestBodyJSON = await getRequestBodyJSON<AuthPasswordResetRequestBody>(request, [
      { key: 'identifier', required: true },
      { key: 'phoneNumber', required: true },
      { key: 'verificationCode', required: true },
      { key: 'newPassword', required: true },
    ]);

    const [user, verification] = await Promise.all([
      CredentialModel.findOne({ identifier: requestBodyJSON.identifier }).exec(),
      VerificationModel.findOne({
        phoneNumber: requestBodyJSON.phoneNumber,
      }).exec(),
    ]);

    if (!user)
      throw new NotFound({
        type: 'NotFound',
        code: 404,
        detail: 'user',
      });

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

    const limitTime = new Date(verification.updatedAt).getTime() + VERIFICATION_LIMIT.time;
    const currentTime = Date.now();

    if (limitTime < currentTime)
      throw new Forbidden({
        type: 'Forbidden',
        code: 403,
        detail: { field: 'verification', reason: 'TIMEOUT' },
      });

    const hashedPassword = await getHashedPassword(requestBodyJSON.newPassword);

    session.startTransaction();

    user.password = hashedPassword;

    await user.save({ session });

    await verification.deleteOne({ session });

    await session.commitTransaction();

    return SuccessResponse({ method: 'PATCH' });
  } catch (error) {
    await session.abortTransaction();

    return ErrorResponse(error);
  } finally {
    session.endSession();
  }
};

export const dynamic = 'force-dynamic';
