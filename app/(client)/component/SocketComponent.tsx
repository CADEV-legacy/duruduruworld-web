'use client';

import { useEffect, useState } from 'react';

import { Socket, connect } from 'socket.io-client';

import { useUserCount } from '@/(client)/service';

import { socketServerHealthRequest } from '@/(client)/request/outer/socket-server';

import { CLIENT_SETTINGS } from '@/setting';

export const SocketComponent = () => {
  const [socket, setSocket] = useState<Socket>();
  const { data: userCountData } = useUserCount();
  const [currentUserCount, setCurrentUserCount] = useState<number>(0);

  const getSocketServerHealth = async () => {
    try {
      await socketServerHealthRequest();

      const socket = connect(CLIENT_SETTINGS.SOCKER_SERVER_DOMAIN, { transports: ['websocket'] });

      socket.on('new-user', (data: number) => {
        setCurrentUserCount(data);
      });

      setSocket(socket);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSocketServerHealth();

    return () => {
      if (socket) {
        socket.disconnect();
        socket.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userCountData) {
      setCurrentUserCount(userCountData.userCount);
    }
  }, [userCountData]);

  return (
    <div>
      <div>Socket Component!!!!!</div>
      <div>Current User : {currentUserCount}</div>
    </div>
  );
};
