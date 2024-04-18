import { NextRequest } from 'next/server';

import { AuthVerificationCodeSendRequestBody, VerificationSchemaSelect } from './type';

import { getConnection, getSMSVerificationCount, sendSMSVerificationCode } from '@/(server)/lib';
import { VerificationModel } from '@/(server)/model';
import { SuccessResponse, getRequestBodyJSON, validate } from '@/(server)/util';

import { ErrorResponse, TooManyRequests } from '@/(error)';

import { VERIFICATION_LIMIT } from '@/constant';

/**
 * NOTE: /api/auth/verification-code/send
 * @body AuthVerificationCodeSendRequestBody
 * @return void
 */
export const POST = async (request: NextRequest) => {
  const connection = await getConnection();

  const session = await connection.startSession();

  session.startTransaction();

  try {
    const requestBodyJSON = await getRequestBodyJSON<AuthVerificationCodeSendRequestBody>(request, [
      { key: 'phoneNumber', required: true },
    ]);

    validate({ phoneNumber: requestBodyJSON.phoneNumber });

    const smsVerificationCount = await getSMSVerificationCount(requestBodyJSON.phoneNumber);

    if (parseInt(smsVerificationCount) > VERIFICATION_LIMIT.count) {
      throw new TooManyRequests({
        type: 'TooManyRequests',
        code: 429,
        detail: {
          count: VERIFICATION_LIMIT.count,
        },
      });
    }

    const verificationCode = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');

    const verification = await VerificationModel.findOne({
      phoneNumber: requestBodyJSON.phoneNumber,
    })
      .select<VerificationSchemaSelect>('verificationCode updatedAt')
      .exec();

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
      const limitTime = new Date(verification.updatedAt).getTime() + VERIFICATION_LIMIT.reIssue;
      const currentTime = Date.now();

      if (limitTime >= currentTime) {
        throw new TooManyRequests({
          type: 'TooManyRequests',
          code: 429,
          detail: {
            limit: VERIFICATION_LIMIT.reIssue,
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
  } finally {
    session.endSession();
  }
};

export const dynamic = 'force-dynamic';
