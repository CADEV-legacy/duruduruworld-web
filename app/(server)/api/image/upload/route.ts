import { NextRequest } from 'next/server';

import { ImageUploadRequestFormData, ImageUploadResponseBody } from './type';

import { getConnection, uploadImageToS3 } from '@/(server)/lib';
import { SuccessResponse, getRequestFormDataJSON } from '@/(server)/util';

import { ErrorResponse } from '@/(error)';

/**
 * NOTE: /api/image/upload
 * @formData ImageUploadRequestFormData
 * @return ImageUploadResponseBody
 */
export const POST = async (request: NextRequest) => {
  await getConnection();

  try {
    const requestFormDataJSON = await getRequestFormDataJSON<ImageUploadRequestFormData>(request, [
      { key: 'image', required: true },
    ]);

    const imageURL = await uploadImageToS3(requestFormDataJSON.image, 'test');

    return SuccessResponse<ImageUploadResponseBody>({ method: 'POST', data: { imageURL } });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const fetchCache = 'force-no-store';
