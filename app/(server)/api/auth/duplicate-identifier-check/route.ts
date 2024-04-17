import { NextRequest } from 'next/server';

import {
  AuthDuplicateIdentifierCheckRequestSearchParams,
  AuthDuplicateIdentifierCheckResponse,
} from './type';

import { getConnection } from '@/(server)/lib';
import { CredentialModel } from '@/(server)/model';
import { SuccessResponse, getRequestSearchPraramsJSON } from '@/(server)/util';

import { ErrorResponse } from '@/(error)';

/**
 * NOTE: /api/auth/duplicate-identifier-check
 * @searchParams AuthDuplicateIdentifierCheckRequestSearchParams
 * @return AuthDuplicateIdentifierCheckResponse
 */
export const GET = async (request: NextRequest) => {
  await getConnection();

  try {
    const searchParams =
      getRequestSearchPraramsJSON<AuthDuplicateIdentifierCheckRequestSearchParams>(request, [
        { key: 'identifier', required: true },
      ]);

    const credential = await CredentialModel.findOne({ identifier: searchParams.identifier })
      .lean()
      .exec();

    return SuccessResponse<AuthDuplicateIdentifierCheckResponse>({
      method: 'GET',
      data: { isDuplicate: !!credential },
    });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const dynamic = 'force-dynamic';
