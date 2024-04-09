'use client';

import { useEffect, useRef, useState } from 'react';

import { Socket } from 'socket.io-client';

import { userCountRequest } from '@/(client)/request';
import { getSocket } from '@/(client)/util';

import { socketServerHealthRequest } from '@/(client)/request/outer/socket-server';

export const SocketComponent = () => {
  const socketRef = useRef<Socket | null>(null);
  const [currentUserCount, setCurrentUserCount] = useState<number>(0);

  const getUserCount = async () => {
    try {
      const userCountResponse = await userCountRequest();

      setCurrentUserCount(userCountResponse.userCount);
    } catch (error) {
      console.error(error);
    }
  };

  const getSocketServerHealth = async () => {
    try {
      await socketServerHealthRequest();

      const socket = getSocket();

      const hasNewUserListener = socket.hasListeners('new-user');

      if (!hasNewUserListener) {
        socket.on('new-user', (data: number) => {
          setCurrentUserCount(data);
        });
      }

      socketRef.current = socket;
    } catch (error) {
      console.error(error);
    }
  };

  const initialize = async () => {
    await getUserCount();
    await getSocketServerHealth();
  };

  useEffect(() => {
    initialize();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div>Socket Component!!!!!</div>
      <div>Current User : {currentUserCount}</div>
    </div>
  );
};
