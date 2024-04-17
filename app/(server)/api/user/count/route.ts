import { UserCountResponse } from './type';

import { getConnection } from '@/(server)/lib';
import { AccountModel } from '@/(server)/model';
import { SuccessResponse } from '@/(server)/util';

import { ErrorResponse } from '@/(error)';

/**
 * NOTE: /api/user/count
 */
export const GET = async () => {
  await getConnection();

  try {
    const userCount = await AccountModel.countDocuments().lean().exec();

    return SuccessResponse<UserCountResponse>({ method: 'GET', data: { userCount } });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const dynamic = 'force-dynamic';
