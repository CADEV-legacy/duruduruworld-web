import { NextRequest } from 'next/server';

import { PostDeleteRequestParams } from './type';

import { ErrorResponse } from '@/(server)/error';
import { getConnection, getObjectId, getVerifiedAccessToken } from '@/(server)/lib';
import { PostModel } from '@/(server)/model';
import { SuccessResponse, getRequestAccessToken } from '@/(server)/util';

/**
 * NOTE: /api/post/delete
 * @required accessToken
 * @searchParams PostDeleteRequestSearchParams
 * @return void
 */
export const DELETE = async (request: NextRequest, { params }: PostDeleteRequestParams) => {
  await getConnection();

  try {
    const accessToken = getRequestAccessToken(request);

    const { userId } = getVerifiedAccessToken(accessToken);

    const postId = params.postId;

    await PostModel.deleteOne({
      _id: getObjectId(postId),
      user: getObjectId(userId),
    })
      .lean()
      .exec();

    return SuccessResponse({ method: 'DELETE' });
  } catch (error) {
    return ErrorResponse(error);
  }
};
