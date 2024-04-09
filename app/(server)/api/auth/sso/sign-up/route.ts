import { NextRequest } from 'next/server';

import { AuthSSOSignUpRequestBody } from './type';

import { getConnection } from '@/(server)/lib';
import { AccountModel } from '@/(server)/model';
import { SuccessResponse, getRequestBodyJSON, validate } from '@/(server)/util';

import { Conflict, ErrorResponse } from '@/(error)';

/**
 * NOTE: /api/auth/sso/sign-up
 * @body AuthSSOSignUpRequestBody
 * @return void
 */
export const POST = async (request: NextRequest) => {
  await getConnection();

  try {
    const requestBodyJSON = await getRequestBodyJSON<AuthSSOSignUpRequestBody>(request, [
      { key: 'type', required: true },
      { key: 'productAccountId', required: true },
    ]);

    validate({
      accountType: requestBodyJSON.type,
    });

    const accountWithAccountTypeAndProductAccountId = await AccountModel.findOne({
      type: requestBodyJSON.type,
      accountId: requestBodyJSON.productAccountId,
    })
      .lean()
      .exec();

    if (accountWithAccountTypeAndProductAccountId)
      throw new Conflict({
        type: 'Conflict',
        code: 409,
        detail: 'account',
      });

    const today = new Date();

    await AccountModel.create({
      type: requestBodyJSON.type,
      accountId: requestBodyJSON.productAccountId,
      status: 'pending',
      createdAt: today,
      updatedAt: today,
    });

    return SuccessResponse({ method: 'POST' });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const fetchCache = 'force-no-store';
