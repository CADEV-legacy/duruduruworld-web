import { NextRequest } from 'next/server';

import axios from 'axios';

import { AuthSignUpRequestBody } from './type';

import { getConnection, getHashedPassword, uploadImageToS3 } from '@/(server)/lib';
import { AccountModel, UserModel, VerificationModel } from '@/(server)/model';
import { ACCOUNT_STATUS, ACCOUNT_TYPE } from '@/(server)/union';
import { getRequestFormDataJSON, SuccessResponse, validate } from '@/(server)/util';

import { Conflict, ErrorResponse, Forbidden, NotFound } from '@/(error)';

import { MILLISECOND_TIME_FORMAT, SOCKET_SERVER_API_URL } from '@/constant';
import { SERVER_SETTINGS } from '@/setting';

/**
 * NOTE: /api/auth/sign-up
 * @body AuthSignUpRequestBody
 * @return void
 */
export const POST = async (request: NextRequest) => {
  const db = await getConnection();

  const session = await db.startSession();

  try {
    const formDataJSON = await getRequestFormDataJSON<AuthSignUpRequestBody>(request, [
      { key: 'email', required: true },
      { key: 'password', required: true },
      { key: 'name', required: true },
      { key: 'image' },
      { key: 'phoneNumber', required: true },
      { key: 'age', required: true },
      { key: 'gender', required: true },
      { key: 'postalCode', required: true },
      { key: 'address', required: true },
      { key: 'addressDetail' },
      { key: 'verificationCode', required: true },
    ]);

    validate({
      email: formDataJSON.email,
      password: formDataJSON.password,
      phoneNumber: formDataJSON.phoneNumber,
      age: formDataJSON.age,
      gender: formDataJSON.gender,
    });

    const [users, verification] = await Promise.all([
      UserModel.find({
        $or: [{ email: formDataJSON.email }, { phoneNumber: formDataJSON.phoneNumber }],
      })
        .lean()
        .exec(),
      VerificationModel.findOne({ phoneNumber: formDataJSON.phoneNumber }).exec(),
    ]);

    if (users.length)
      throw new Conflict({
        type: 'Conflict',
        code: 409,
        detail: ['email', 'phoneNumber'],
      });
    if (!verification)
      throw new NotFound({
        type: 'NotFound',
        code: 404,
        detail: 'verification',
      });
    if (verification.verificationCode !== formDataJSON.verificationCode)
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

    const hashedPassword = await getHashedPassword(formDataJSON.password);

    const imageURL = formDataJSON.image
      ? await uploadImageToS3(formDataJSON.image, 'profile')
      : undefined;

    const today = new Date();

    await session.withTransaction(async () => {
      const [newUser] = await UserModel.create(
        [
          {
            ...formDataJSON,
            image: imageURL,
            password: hashedPassword,
            createdAt: today,
            updatedAt: today,
          },
        ],
        { session }
      );

      await AccountModel.create(
        [
          {
            type: ACCOUNT_TYPE.credentials,
            status: ACCOUNT_STATUS.active,
            user: newUser._id,
            createdAt: today,
            updatedAt: today,
          },
        ],
        { session }
      );

      await verification.deleteOne({ session });
    });

    const userCount = await UserModel.countDocuments().lean().exec();

    await sendRequestToSocketServer(userCount);

    return SuccessResponse({ method: 'POST' });
  } catch (error) {
    return ErrorResponse(error);
  } finally {
    await session.endSession();
  }
};

const sendRequestToSocketServer = async (userCount: number) => {
  await axios({
    method: 'get',
    url: `${SERVER_SETTINGS.SOCKET_SERVER_DOMAIN}${SERVER_SETTINGS.SOKCET_SERVER_API_PREFIX}${SOCKET_SERVER_API_URL.socket.newUser}`,
    params: { userCount },
  });
};

export const fetchCache = 'force-no-store';
