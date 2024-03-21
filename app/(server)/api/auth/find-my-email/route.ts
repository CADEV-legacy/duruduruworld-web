import { NextRequest } from 'next/server';

import { UserModel } from '@/(server)/entities';
import { ErrorResponse, NotFound } from '@/(server)/errors';
import { dbConnect } from '@/(server)/libs';
import { SuccessResponse } from '@/(server)/utils';

type GetResponse = {
  email: string;
};

/**
 * NOTE: /api/auth/find-my-email
 * @param phoneNumber: string
 * @param isVerified: string(boolean)
 */
export const GET = async (request: NextRequest) => {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;

    const phoneNumber = searchParams.get('phoneNumber');
    const isVerified = searchParams.get('isVerified');

    if (!phoneNumber)
      throw new NotFound({ type: 'NotFound', code: 404, detail: { fields: ['phoneNumber'] } });

    if (!isVerified || isVerified !== 'true')
      throw new NotFound({ type: 'NotFound', code: 404, detail: { fields: ['isVerified'] } });

    const user = await UserModel.findOne({ phoneNumber });

    if (!user) throw new NotFound({ type: 'NotFound', code: 404, detail: { fields: ['user'] } });

    return SuccessResponse<GetResponse>('GET', { email: user.email });
  } catch (error) {
    return ErrorResponse(error);
  }
};
