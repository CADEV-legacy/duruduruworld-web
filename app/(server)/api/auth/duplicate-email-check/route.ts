import { NextRequest } from 'next/server';

import {
  AuthDuplicateEmailCheckRequestSearchParams,
  AuthDuplicateEmailCheckResponse,
} from './type';

import { getConnection } from '@/(server)/lib';
import { UserModel } from '@/(server)/model';
import { SuccessResponse, getRequestSearchPraramsJSON } from '@/(server)/util';

import { ErrorResponse } from '@/(error)';

/**
 * NOTE: /api/auth/duplicate-email-check
 * @searchParams AuthDuplicateEmailCheckRequestSearchParams
 * @return AuthDuplicateEmailCheckResponse
 */
export const GET = async (request: NextRequest) => {
  await getConnection();

  try {
    const searchParams = getRequestSearchPraramsJSON<AuthDuplicateEmailCheckRequestSearchParams>(
      request,
      [{ key: 'email', required: true }]
    );

    const user = await UserModel.findOne({ email: searchParams.email }).lean().exec();

    return SuccessResponse<AuthDuplicateEmailCheckResponse>({
      method: 'GET',
      data: { isDuplicate: !!user },
    });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
