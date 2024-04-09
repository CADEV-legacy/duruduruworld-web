import Daum from '@types/daum-postcode';
import _mongoose, { connect } from 'mongoose';
import { Socket } from 'socket.io-client';

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    createConnectionPromise: ReturnType<typeof connect> | null;
    connection: typeof _mongoose | null;
  };

  // eslint-disable-next-line no-var
  var socketInstance: Socket | null;

  interface Window {
    daum: Daum;
  }
}
