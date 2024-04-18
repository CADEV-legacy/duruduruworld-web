import { NextRequest } from 'next/server';

import {
  AuthFindMyIdentifierRequestSearchParams,
  AuthFindMyIdentifierResponse,
  CredentialSchemaSelect,
  VerificationSchemaSelect,
} from './type';

import { getConnection } from '@/(server)/lib';
import { CredentialModel, VerificationModel } from '@/(server)/model';
import { SuccessResponse, getRequestSearchPraramsJSON } from '@/(server)/util';

import { ErrorResponse, Forbidden, NotFound } from '@/(error)';

import { VERIFICATION_LIMIT } from '@/constant';

/**
 * NOTE: /api/auth/find-my-identifier
 * @searchParams AuthFindMyIdentifierRequestSearchParams
 * @return AuthFindMyIdentifierResponse
 */
export const GET = async (request: NextRequest) => {
  await getConnection();

  try {
    const searchParams = getRequestSearchPraramsJSON<AuthFindMyIdentifierRequestSearchParams>(
      request,
      [
        { key: 'verificationCode', required: true },
        { key: 'phoneNumber', required: true },
      ]
    );

    const [credential, verification] = await Promise.all([
      CredentialModel.findOne({ phoneNumber: searchParams.phoneNumber })
        .select<CredentialSchemaSelect>('identifier')
        .lean()
        .exec(),
      VerificationModel.findOne({ phoneNumber: searchParams.phoneNumber })
        .select<VerificationSchemaSelect>('verificationCode updatedAt')
        .exec(),
    ]);

    if (!credential)
      throw new NotFound({
        type: 'NotFound',
        code: 404,
        detail: 'credential',
      });

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

    const limitTime = new Date(verification.updatedAt).getTime() + VERIFICATION_LIMIT.time;
    const currentTime = Date.now();

    if (limitTime < currentTime)
      throw new Forbidden({
        type: 'Forbidden',
        code: 403,
        detail: { field: 'verification', reason: 'TIMEOUT' },
      });

    await verification.deleteOne();

    return SuccessResponse<AuthFindMyIdentifierResponse>({
      method: 'GET',
      data: { identifier: credential.identifier },
    });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const dynamic = 'force-dynamic';
