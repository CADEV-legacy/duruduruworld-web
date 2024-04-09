import axios from 'axios';

import { SuccessResponse } from '@/(server)/util';

import { ErrorResponse } from '@/(error)';

import { SOCKET_SERVER_API_URL } from '@/constant';
import { SERVER_SETTINGS } from '@/setting';

/**
 * NOTE: /api/health
 * @return void
 */
export const GET = async () => {
  try {
    await sendRequestToSocketServer();

    return SuccessResponse({ method: 'GET' });
  } catch (error) {
    return ErrorResponse({ method: 'GET' });
  }
};

const sendRequestToSocketServer = async () => {
  await axios.get(
    `${SERVER_SETTINGS.SOCKET_SERVER_DOMAIN}${SERVER_SETTINGS.SOKCET_SERVER_API_PREFIX}${SOCKET_SERVER_API_URL.socket}`
  );
};

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
