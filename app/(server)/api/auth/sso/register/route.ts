import { NextRequest } from 'next/server';

import { AuthSSORegisterRequestBody } from './type';

import { getConnection, getObjectId, getVerifiedAccessToken } from '@/(server)/lib';
import { AccountModel, UserModel, VerificationModel } from '@/(server)/model';
import {
  SuccessResponse,
  getRequestBodyJSON,
  validate,
  getRequestAccessToken,
} from '@/(server)/util';

import { ErrorResponse, Forbidden, NotFound } from '@/(error)';

import { MILLISECOND_TIME_FORMAT } from '@/constant';

/**
 * NOTE: /api/auth/sso/register
 * @body AuthSSORegisterRequestBody
 * @return void
 */
export const POST = async (request: NextRequest) => {
  const connection = await getConnection();

  const session = await connection.startSession();

  try {
    const accessToken = getRequestAccessToken(request);

    const { accountId } = getVerifiedAccessToken(accessToken);

    const requestBodyJSON = await getRequestBodyJSON<AuthSSORegisterRequestBody>(request, [
      { key: 'email', required: true },
      { key: 'name', required: true },
      { key: 'phoneNumber', required: true },
      { key: 'age', required: true },
      { key: 'gender', required: true },
      { key: 'postalCode', required: true },
      { key: 'address', required: true },
      { key: 'addressDetail' },
      { key: 'verificationCode', required: true },
    ]);

    validate({
      email: requestBodyJSON.email,
      phoneNumber: requestBodyJSON.phoneNumber,
      age: requestBodyJSON.age,
      gender: requestBodyJSON.gender,
    });

    const [account, verification] = await Promise.all([
      AccountModel.findById(getObjectId(accountId)).exec(),
      VerificationModel.findOne({ phoneNumber: requestBodyJSON.phoneNumber }).exec(),
    ]);

    if (!account)
      throw new NotFound({
        type: 'NotFound',
        code: 404,
        detail: 'account',
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

    const limitTime =
      new Date(verification.updatedAt).getTime() + MILLISECOND_TIME_FORMAT.minutes(5);
    const currentTime = Date.now();

    if (limitTime < currentTime)
      throw new Forbidden({
        type: 'Forbidden',
        code: 403,
        detail: { field: 'verification', reason: 'TIMEOUT' },
      });

    const today = new Date();

    await session.withTransaction(async () => {
      const [user] = await UserModel.create(
        [
          {
            ...requestBodyJSON,
            createdAt: today,
            updatedAt: today,
          },
        ],
        { session }
      );

      account.user = user._id;

      await account.save({ session });

      await verification.deleteOne({ session });
    });

    return SuccessResponse({ method: 'POST' });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const dynamic = 'force-dynamic';
