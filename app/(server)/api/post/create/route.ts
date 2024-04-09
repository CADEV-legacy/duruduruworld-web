import { NextRequest } from 'next/server';

import { PostCreateRequestBody } from './type';

import { getConnection, getObjectId, getVerifiedAccessToken } from '@/(server)/lib';
import { AccountModel, PostModel, UserModel } from '@/(server)/model';
import { SuccessResponse, getRequestAccessToken, getRequestBodyJSON } from '@/(server)/util';

import { NotFound, ErrorResponse } from '@/(error)';

/**
 * NOTE: /api/post/create
 * @required accessToken
 * @body PostCreateRequestBody
 * @return void
 */
export const POST = async (request: NextRequest) => {
  await getConnection();

  try {
    const accessToken = getRequestAccessToken(request);

    const { accountId, userId } = getVerifiedAccessToken(accessToken);

    const [account, user] = await Promise.all([
      AccountModel.findById(getObjectId(accountId)).lean().exec(),
      UserModel.findById(getObjectId(userId)).lean().exec(),
    ]);

    if (!account) throw new NotFound({ type: 'NotFound', code: 404, detail: 'account' });

    if (!user) throw new NotFound({ type: 'NotFound', code: 404, detail: 'user' });

    const requestBodyJSON = await getRequestBodyJSON<PostCreateRequestBody>(request, [
      { key: 'title', required: true },
      { key: 'content' },
    ]);

    const today = new Date();

    await PostModel.create({
      title: requestBodyJSON.title,
      content: requestBodyJSON.content,
      user: getObjectId(userId),
      createdAt: today,
      updatedAt: today,
    });

    return SuccessResponse({ method: 'POST' });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const fetchCache = 'force-no-store';
