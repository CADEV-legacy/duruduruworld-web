import { SuccessResponse } from '@/(server)/util';

/**
 * NOTE: /api/health
 * @return void
 */
export const GET = async () => {
  return SuccessResponse({ method: 'GET' });
};

export const fetchCache = 'force-no-store';
