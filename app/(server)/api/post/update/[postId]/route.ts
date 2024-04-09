import { NextRequest } from 'next/server';

import { PostUpdateRequestBody, PostUpdateRequestParams } from './type';

import { getObjectId, getVerifiedAccessToken } from '@/(server)/lib';
import { PostModel } from '@/(server)/model';
import { SuccessResponse, getRequestAccessToken, getRequestBodyJSON } from '@/(server)/util';

import { ErrorResponse, NotFound } from '@/(error)';

/**
 * NOTE: /api/post/update/[postId]
 * @required token
 * @params PostUpdateRequestParams
 * @body PostUpdateRequestBody
 * @return void
 */
export const PATCH = async (request: NextRequest, { params }: PostUpdateRequestParams) => {
  try {
    const accessToken = getRequestAccessToken(request);

    const { userId } = getVerifiedAccessToken(accessToken);

    const postId = params.postId;

    const requestBodyJSON = await getRequestBodyJSON<PostUpdateRequestBody>(request, [
      { key: 'title', required: true },
      { key: 'content' },
    ]);

    const post = await PostModel.findOne({
      _id: getObjectId(postId),
      user: getObjectId(userId),
    }).exec();

    if (!post) throw new NotFound({ type: 'NotFound', code: 404, detail: 'post' });

    post.title = requestBodyJSON.title;
    post.content = requestBodyJSON.content ?? '';

    await post.save();

    return SuccessResponse({ method: 'PATCH' });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const dynamic = 'force-dynamic';
