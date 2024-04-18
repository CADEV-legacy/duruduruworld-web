import { NextRequest } from 'next/server';

import axios from 'axios';

import {
  AuthSignUpCredentialRequestBody,
  AuthSignUpKakaoRequestBody,
  AuthSignUpRequestBody,
  CredentialSchemaSelect,
  VerificationSchemaSelect,
} from './type';

import { getConnection, getHashedPassword } from '@/(server)/lib';
import {
  AccountInformationModel,
  AccountModel,
  CredentialModel,
  KakaoModel,
  VerificationModel,
} from '@/(server)/model';
import { ACCOUNT_STATUS, ACCOUNT_TYPE } from '@/(server)/union';
import { getRequestBodyJSON, SuccessResponse, validate } from '@/(server)/util';

import {
  Conflict,
  ErrorResponse,
  Forbidden,
  NotFound,
  NotImplemented,
  ValidationFailed,
} from '@/(error)';

import { SOCKET_SERVER_API_URL, VERIFICATION_LIMIT } from '@/constant';
import { SERVER_SETTINGS } from '@/setting';

/**
 * NOTE: /api/auth/sign-up
 * @body AuthSignUpRequestBody
 * @body (option1) AuthSignUpCredentialRequestBody
 * @body (option2) AuthSignUpKakaoRequestBody
 * @return (option2) AuthSignUpSSOResponse
 */
export const POST = async (request: NextRequest) => {
  const db = await getConnection();

  const session = await db.startSession();

  session.startTransaction();

  try {
    const requestBody = await getRequestBodyJSON<AuthSignUpRequestBody>(request, [
      { key: 'type', required: true },
    ]);

    if (requestBody.type === 'credential') {
      const requestBodyJSON = await getRequestBodyJSON<AuthSignUpCredentialRequestBody>(request, [
        { key: 'identifier', required: true },
        { key: 'password', required: true },
        { key: 'passwordAccept', required: true },
        { key: 'email' },
        { key: 'pets', required: true },
        { key: 'name', required: true },
        { key: 'birth', required: true },
        { key: 'postalCode', required: true },
        { key: 'address', required: true },
        { key: 'addressDetail' },
        { key: 'gender', required: true },
        { key: 'phoneNumber', required: true },
        { key: 'verificationCode', required: true },
        { key: 'marketingAgreement' },
      ]);

      validate({
        identifier: requestBodyJSON.identifier,
        password: requestBodyJSON.password,
        email: requestBodyJSON.email,
        pets: requestBodyJSON.pets,
        name: requestBodyJSON.name,
        birth: requestBodyJSON.birth,
        gender: requestBodyJSON.gender,
        phoneNumber: requestBodyJSON.phoneNumber,
        verificationCode: requestBodyJSON.verificationCode,
      });

      if (requestBodyJSON.password !== requestBodyJSON.passwordAccept) {
        throw new ValidationFailed({
          type: 'ValidationFailed',
          code: 422,
          detail: [{ field: 'password', reason: 'NOT_MATCHED' }],
        });
      }

      const [credentials, verification] = await Promise.all([
        CredentialModel.find({
          $or: [
            { identifier: requestBodyJSON.identifier },
            { phoneNumber: requestBodyJSON.phoneNumber },
          ],
        })
          .select<CredentialSchemaSelect>('_id')
          .lean()
          .exec(),
        VerificationModel.findOne({ phoneNumber: requestBodyJSON.phoneNumber })
          .select<VerificationSchemaSelect>('verficiationCode updatedAt')
          .exec(),
      ]);

      if (credentials.length)
        throw new Conflict({
          type: 'Conflict',
          code: 409,
          detail: ['identifier', 'phoneNumber'],
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

      const hashedPassword = await getHashedPassword(requestBodyJSON.password);

      const today = new Date();

      const [newAccount] = await AccountModel.create(
        [
          {
            type: ACCOUNT_TYPE.credential,
            status: ACCOUNT_STATUS.active,
            createdAt: today,
            updatedAt: today,
          },
        ],
        { session }
      );

      const [newCredential] = await CredentialModel.create(
        [
          {
            identifier: requestBodyJSON.identifier,
            password: hashedPassword,
            phoneNumber: requestBodyJSON.phoneNumber,
            account: newAccount._id,
            createdAt: today,
            updatedAt: today,
          },
        ],
        { session }
      );

      await AccountInformationModel.create(
        [
          {
            email: requestBodyJSON.email,
            pets: requestBodyJSON.pets,
            name: requestBodyJSON.name,
            birth: requestBodyJSON.birth,
            postalCode: requestBodyJSON.postalCode,
            address: requestBodyJSON.address,
            addressDetail: requestBodyJSON.addressDetail,
            gender: requestBodyJSON.gender,
            marketingAgreement: requestBodyJSON.marketingAgreement,
            account: newAccount._id,
          },
        ],
        { session }
      );

      newAccount.credential = newCredential._id;

      await newAccount.save({ session });

      await verification.deleteOne({ session });

      await session.commitTransaction();

      const accountCount = await AccountModel.countDocuments().lean().exec();

      await sendRequestToSocketServer(accountCount);

      return SuccessResponse({ method: 'POST' });
    } else if (requestBody.type === 'kakao') {
      // TODO: Implement when kakao auth process is ready.

      const kakaoRequestBodyJSON = await getRequestBodyJSON<AuthSignUpKakaoRequestBody>(request, [
        { key: 'productAccountId', required: true },
      ]);

      const kakao = await KakaoModel.exists({
        productAccountId: kakaoRequestBodyJSON.productAccountId,
      })
        .lean()
        .exec();

      if (kakao)
        throw new Conflict({
          type: 'Conflict',
          code: 409,
          detail: ['kakao'],
        });

      // TOOD: Implement when kakao auth process is ready.
      const KAKAO_PRODUCT_ACCOUNT_ID = 'kakao-test';
      const KAKAO_REFRESH_TOKEN = 'kakao-test-refresh-token';

      session.startTransaction();

      const today = new Date();

      const [newAccount] = await AccountModel.create(
        [
          {
            type: ACCOUNT_TYPE.kakao,
            status: ACCOUNT_STATUS.pending,
            createdAt: today,
            updatedAt: today,
          },
        ],
        { session }
      );

      const [newKakao] = await KakaoModel.create(
        [
          {
            productAccountId: KAKAO_PRODUCT_ACCOUNT_ID,
            kakaoRefreshToken: KAKAO_REFRESH_TOKEN,
            account: newAccount._id,
            createdAt: today,
            updatedAt: today,
          },
        ],
        { session }
      );

      newAccount.kakao = newKakao._id;

      await newAccount.save({ session });

      await session.commitTransaction();

      const accountCount = await AccountModel.countDocuments().lean().exec();

      await sendRequestToSocketServer(accountCount);

      // return SuccessResponse({ method: 'POST' });

      throw new NotImplemented({
        type: 'NotImplemented',
        code: 501,
      });
    } else {
      // NOTE: Implement when other sso auth process is needed.

      throw new NotImplemented({
        type: 'NotImplemented',
        code: 501,
      });
    }
  } catch (error) {
    await session.abortTransaction();

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

export const dynamic = 'force-dynamic';
