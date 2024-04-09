import { NextRequest } from 'next/server';

import { PostListResponse, PostRequestSearchParams, PostResponse } from './type';

import { getConnection, getVerifiedAccessToken } from '@/(server)/lib';
import { PostModel, UserSchema } from '@/(server)/model';
import {
  SuccessResponse,
  getRequestAccessToken,
  getRequestSearchPraramsJSON,
  isAuthorizedRequest,
} from '@/(server)/util';

import { ErrorResponse } from '@/(error)';

const DEFAULT_LIMIT = 10;

/**
 * NOTE: /api/post
 * @optional accessToken
 * @searchParams PostRequestSearchParams
 * @return PostListResponse
 */
export const GET = async (request: NextRequest) => {
  await getConnection();

  try {
    const requestSearchParamsJSON = getRequestSearchPraramsJSON<PostRequestSearchParams>(request, [
      { key: 'cursor', required: true },
      { key: 'limit' },
    ]);

    const cursor = parseInt(requestSearchParamsJSON.cursor);
    const limit = requestSearchParamsJSON.limit
      ? parseInt(requestSearchParamsJSON.limit)
      : DEFAULT_LIMIT;

    const [posts, nextPost] = await Promise.all([
      PostModel.find()
        .sort({ createdAt: -1 })
        .skip(cursor)
        .limit(limit)
        .populate<{ user: UserSchema }>('user', 'name email image')
        .lean()
        .exec(),
      PostModel.find()
        .sort({ createdAt: -1 })
        .skip(cursor + limit)
        .limit(1)
        .lean()
        .exec(),
    ]);

    const isAuthorized = isAuthorizedRequest(request);

    let authorizedUserId: string | undefined = undefined;

    if (isAuthorized) {
      const accessToken = getRequestAccessToken(request);

      const { userId } = getVerifiedAccessToken(accessToken);

      authorizedUserId = userId;
    }

    const nextCursor = nextPost.length ? cursor + limit : undefined;

    const prevCursor = cursor - limit < 0 ? undefined : cursor - limit;

    const responseData = posts.map<PostResponse>(post => ({
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
        isMe: post.user._id.toHexString() === authorizedUserId,
      },
    }));

    return SuccessResponse<PostListResponse>({
      method: 'GET',
      data: {
        data: responseData,
        nextCursor: nextCursor,
        prevCursor: prevCursor,
      },
    });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const fetchCache = 'force-no-store';
