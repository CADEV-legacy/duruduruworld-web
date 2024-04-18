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
  PetModel,
  VerificationModel,
} from '@/(server)/model';
import { ACCOUNT_STATUS, ACCOUNT_TYPE } from '@/(server)/union';
import { getRequestBodyJSON, requestBodyParser, SuccessResponse, validate } from '@/(server)/util';

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
      const credentialRequestBody = requestBodyParser<AuthSignUpCredentialRequestBody>(
        requestBody,
        [
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
        ]
      );

      validate({
        identifier: credentialRequestBody.identifier,
        password: credentialRequestBody.password,
        email: credentialRequestBody.email,
        pets: credentialRequestBody.pets,
        name: credentialRequestBody.name,
        birth: credentialRequestBody.birth,
        gender: credentialRequestBody.gender,
        phoneNumber: credentialRequestBody.phoneNumber,
        verificationCode: credentialRequestBody.verificationCode,
      });

      if (credentialRequestBody.password !== credentialRequestBody.passwordAccept) {
        throw new ValidationFailed({
          type: 'ValidationFailed',
          code: 422,
          detail: [{ field: 'password', reason: 'NOT_MATCHED' }],
        });
      }

      const [credentials, verification] = await Promise.all([
        CredentialModel.find({
          $or: [
            { identifier: credentialRequestBody.identifier },
            { phoneNumber: credentialRequestBody.phoneNumber },
          ],
        })
          .select<CredentialSchemaSelect>('_id')
          .lean()
          .exec(),
        VerificationModel.findOne({ phoneNumber: credentialRequestBody.phoneNumber })
          .select<VerificationSchemaSelect>('verificationCode updatedAt')
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

      if (verification.verificationCode !== credentialRequestBody.verificationCode)
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

      const hashedPassword = await getHashedPassword(credentialRequestBody.password);

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
            identifier: credentialRequestBody.identifier,
            password: hashedPassword,
            phoneNumber: credentialRequestBody.phoneNumber,
            account: newAccount._id,
            createdAt: today,
            updatedAt: today,
          },
        ],
        { session }
      );

      const pets = await PetModel.create(
        credentialRequestBody.pets.map(pet => ({ ...pet, createdAt: today, updatedAt: today })),
        { session }
      );

      await AccountInformationModel.create(
        [
          {
            email: credentialRequestBody.email,
            pets: pets.map(pet => pet._id),
            name: credentialRequestBody.name,
            birth: credentialRequestBody.birth,
            postalCode: credentialRequestBody.postalCode,
            address: credentialRequestBody.address,
            addressDetail: credentialRequestBody.addressDetail,
            gender: credentialRequestBody.gender,
            marketingAgreement: credentialRequestBody.marketingAgreement,
            account: newAccount._id,
            createdAt: today,
            updatedAt: today,
          },
        ],
        { session }
      );

      newAccount.credential = newCredential._id;

      await newAccount.save({ session });

      await verification.deleteOne({ session });

      const accountCount = await AccountModel.countDocuments().lean().exec();

      await sendRequestToSocketServer(accountCount);

      await session.commitTransaction();

      return SuccessResponse({ method: 'POST' });
    } else if (requestBody.type === 'kakao') {
      // TODO: Implement when kakao auth process is ready.

      const kakaoRequestBody = requestBodyParser<AuthSignUpKakaoRequestBody>(requestBody, [
        { key: 'productAccountId', required: true },
      ]);

      const kakao = await KakaoModel.exists({
        productAccountId: kakaoRequestBody.productAccountId,
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

      const accountCount = await AccountModel.countDocuments().lean().exec();

      await sendRequestToSocketServer(accountCount);

      throw new NotImplemented({
        type: 'NotImplemented',
        code: 501,
      });

      // await session.commitTransaction();

      // return SuccessResponse({ method: 'POST' });
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
  if (SERVER_SETTINGS.ENVIRONMENT !== 'product') return;

  await axios({
    method: 'get',
    url: `${SERVER_SETTINGS.SOCKET_SERVER_DOMAIN}${SERVER_SETTINGS.SOKCET_SERVER_API_PREFIX}${SOCKET_SERVER_API_URL.socket.newUser}`,
    params: { userCount },
  });
};

export const dynamic = 'force-dynamic';
