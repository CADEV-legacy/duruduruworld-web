import { baseRequest } from '../..';

import { SOCKET_SERVER_API_URL } from '@/constant';
import { CLIENT_SETTINGS } from '@/setting';

export const socketServerHealthRequest = async () => {
  const response = await baseRequest({
    method: 'get',
    url: `${CLIENT_SETTINGS.SOCKER_SERVER_DOMAIN}${CLIENT_SETTINGS.SOCKET_SERVER_API_PREFIX}${SOCKET_SERVER_API_URL.socket.health}`,
  });

  return response.data;
};
