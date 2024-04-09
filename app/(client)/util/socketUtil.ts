import { connect } from 'socket.io-client';

import { CLIENT_SETTINGS } from '@/setting';

let cachedSocket = global.socketInstance;

if (!cachedSocket) {
  cachedSocket = global.socketInstance = null;
}

export const getSocket = () => {
  if (cachedSocket && cachedSocket.connected) {
    return cachedSocket;
  }

  cachedSocket = global.socketInstance = connect(CLIENT_SETTINGS.SOCKER_SERVER_DOMAIN);

  return cachedSocket;
};
