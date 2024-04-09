import { NextRequest } from 'next/server';

import { PostDetailRequestParams, PostDetailResponse } from './type';

import { getConnection, getObjectId, getVerifiedAccessToken } from '@/(server)/lib';
import { PostModel, UserSchema } from '@/(server)/model';
import { SuccessResponse, getRequestAccessToken, isAuthorizedRequest } from '@/(server)/util';

import { ErrorResponse, NotFound } from '@/(error)';

/**
 * NOTE: /api/post/[postId]
 * @optional accessToken
 * @params PostDetailRequestParams
 * @return PostDetailResponse
 */
export const GET = async (request: NextRequest, { params }: PostDetailRequestParams) => {
  await getConnection();

  try {
    const postId = params.postId;

    const post = await PostModel.findById(getObjectId(postId))
      .populate<{ user: UserSchema }>('user')
      .lean()
      .exec();

    if (!post) throw new NotFound({ type: 'NotFound', code: 404, detail: 'post' });

    const isAuthorized = isAuthorizedRequest(request);

    let authorizedUserId: string | undefined = undefined;

    if (isAuthorized) {
      const accessToken = getRequestAccessToken(request);

      const { userId } = getVerifiedAccessToken(accessToken);

      authorizedUserId = userId;
    }

    const responseData: PostDetailResponse = {
      _id: post._id.toHexString(),
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      user: {
        _id: post.user._id.toHexString(),
        name: post.user.name,
        email: post.user.email,
        image: post.user.image,
        isMe: authorizedUserId === post.user._id.toHexString(),
      },
    };

    return SuccessResponse<PostDetailResponse>({ method: 'GET', data: responseData });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const fetchCache = 'force-no-store';
