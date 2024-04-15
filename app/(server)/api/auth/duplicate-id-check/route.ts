import { NextRequest } from 'next/server';

import { AuthDuplicateIDCheckRequestSearchParams, AuthDuplicateIDCheckResponse } from './type';

import { getConnection } from '@/(server)/lib';
import { UserModel } from '@/(server)/model';
import { SuccessResponse, getRequestSearchPraramsJSON } from '@/(server)/util';

import { ErrorResponse } from '@/(error)';

/**
 * NOTE: /api/auth/duplicate-id-check
 * @searchParams AuthDuplicateIDCheckRequestSearchParams
 * @return AuthDuplicateIDCheckResponse
 */
export const GET = async (request: NextRequest) => {
  await getConnection();

  try {
    const searchParams = getRequestSearchPraramsJSON<AuthDuplicateIDCheckRequestSearchParams>(
      request,
      [{ key: 'email', required: true }]
    );

    const user = await UserModel.findOne({ email: searchParams.email }).lean().exec();

    return SuccessResponse<AuthDuplicateIDCheckResponse>({
      method: 'GET',
      data: { isDuplicate: !!user },
    });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const dynamic = 'force-dynamic';
