import { NextRequest } from 'next/server';

import { ImageDeleteRequestSearchParams } from './type';

import { deleteImageFromS3, getConnection } from '@/(server)/lib';
import { SuccessResponse, getRequestSearchPraramsJSON } from '@/(server)/util';

import { ErrorResponse } from '@/(error)';

/**
 * NOTE: /api/image/delete
 * @searchParams ImageDeleteRequestSearchParams
 * @return void
 */
export const DELETE = async (request: NextRequest) => {
  await getConnection();

  try {
    const requestSearchParamsJSON = getRequestSearchPraramsJSON<ImageDeleteRequestSearchParams>(
      request,
      [{ key: 'imageURL', required: true }]
    );

    await deleteImageFromS3(requestSearchParamsJSON.imageURL);

    return SuccessResponse({ method: 'DELETE' });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
