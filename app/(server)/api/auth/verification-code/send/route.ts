import { NextRequest } from 'next/server';

import { AuthVerificationCodeSendRequestBody } from './type';

import { getConnection } from '@/(server)/lib';
import { VerificationModel } from '@/(server)/model';
import {
  SuccessResponse,
  getRequestBodyJSON,
  sendSMSVerificationCode,
  validate,
} from '@/(server)/util';

import { ErrorResponse, TooManyRequests } from '@/(error)';

import { MILLISECOND_TIME_FORMAT } from '@/constant';

/**
 * NOTE: /api/auth/verification-code/send
 * @body AuthVerificationCodeSendRequestBody
 * @return void
 */
export const POST = async (request: NextRequest) => {
  const connection = await getConnection();

  const session = await connection.startSession();

  try {
    const requestBodyJSON = await getRequestBodyJSON<AuthVerificationCodeSendRequestBody>(request, [
      { key: 'phoneNumber', required: true },
    ]);

    validate({ phoneNumber: requestBodyJSON.phoneNumber });

    const verificationCode = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');

    const verification = await VerificationModel.findOne({
      phoneNumber: requestBodyJSON.phoneNumber,
    }).exec();

    session.startTransaction();

    const today = new Date();

    if (!verification) {
      await VerificationModel.create(
        [
          {
            phoneNumber: requestBodyJSON.phoneNumber,
            verificationCode,
            createdAt: today,
            updatedAt: today,
          },
        ],
        { session }
      );

      await sendSMSVerificationCode(requestBodyJSON.phoneNumber, verificationCode);
    } else {
      const limitTime =
        new Date(verification.updatedAt).getTime() + MILLISECOND_TIME_FORMAT.minutes(5);
      const currentTime = Date.now();

      if (limitTime >= currentTime) {
        throw new TooManyRequests({
          type: 'TooManyRequests',
          code: 429,
          detail: {
            limit: limitTime,
            retryAfter: limitTime - currentTime,
          },
        });
      } else {
        verification.verificationCode = verificationCode;

        await verification.save({ session });

        await sendSMSVerificationCode(requestBodyJSON.phoneNumber, verificationCode);
      }
    }

    await session.commitTransaction();

    return SuccessResponse({ method: 'POST' });
  } catch (error) {
    await session.abortTransaction();

    return ErrorResponse(error);
  }
};

export const dynamic = 'force-dynamic';
