import { NextRequest } from 'next/server';

import {
  AuthDuplicateAccountCheckRequestSearchParams,
  AuthDuplicateAccountCheckResponse,
  AuthDuplicateKakaoAccountCheckRequestSearchParams,
} from './type';

import { getConnection } from '@/(server)/lib';
import { KakaoModel } from '@/(server)/model';
import { SuccessResponse, getRequestSearchPraramsJSON } from '@/(server)/util';

import { BadRequest, ErrorResponse, NotImplemented } from '@/(error)';

/**
 * NOTE: /api/auth/duplicate-account-check
 * @searchParams AuthDuplicateAccountCheckRequestSearchParams
 * @searchParams (option1) AuthDuplicateKakaoAccountCheckRequestSearchParams
 * @return AuthDuplicateAccountCheckResponse
 */
export const GET = async (request: NextRequest) => {
  await getConnection();

  try {
    const requestSearchParams =
      getRequestSearchPraramsJSON<AuthDuplicateAccountCheckRequestSearchParams>(request, [
        { key: 'type', required: true },
      ]);

    if (requestSearchParams.type === 'credential')
      throw new BadRequest({
        type: 'BadRequest',
        code: 400,
        detail: [{ field: 'type', reason: 'NOT_SUPPORTED' }],
      });

    if (requestSearchParams.type === 'kakao') {
      const kakaoRequestSearchParams =
        getRequestSearchPraramsJSON<AuthDuplicateKakaoAccountCheckRequestSearchParams>(request, [
          { key: 'productAccountId', required: true },
        ]);

      const kakao = await KakaoModel.exists({
        productAccountId: kakaoRequestSearchParams.productAccountId,
      })
        .lean()
        .exec();

      return SuccessResponse<AuthDuplicateAccountCheckResponse>({
        method: 'GET',
        data: { isDuplicate: !!kakao },
      });
    } else {
      // NOTE: If other SSO types are added, add them here.
      throw new NotImplemented({
        type: 'NotImplemented',
        code: 501,
      });
    }
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const dynamic = 'force-dynamic';
