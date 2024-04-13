'use client';

import { useEffect, useRef, useState } from 'react';

import { Typography } from '@mui/material';
import { Socket } from 'socket.io-client';

import * as S from './SocketUserCount.styles';

import { SmartTypography } from '@/(client)/component';
import { useCountHook } from '@/(client)/hook';
import { useUserCount } from '@/(client)/service';
import { getSocket } from '@/(client)/util';

import { socketServerHealthRequest } from '@/(client)/request/outer/socket-server';

export const SocketUserCount = () => {
  const socketRef = useRef<Socket | null>(null);
  const { data: userCountData, isFetched } = useUserCount();
  const [currentUserCount, setCurrentUserCount] = useState<number>(0);
  const { count } = useCountHook({ end: currentUserCount });

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

  useEffect(() => {
    getSocketServerHealth();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userCountData) {
      setCurrentUserCount(userCountData.userCount);
    }
  }, [userCountData]);

  if (currentUserCount === 0 && !isFetched)
    return (
      <S.UserCountTextContainer>
        <SmartTypography />
      </S.UserCountTextContainer>
    );

  if (currentUserCount === 0 && isFetched)
    return (
      <Typography variant='h2' fontSize='2rem' fontWeight='400'>
        우리와 함께해주세요!
      </Typography>
    );

  return (
    <Typography variant='h2' fontSize='2rem' fontWeight='400'>
      지금까지 {count}명이 함께하고 있어요.
    </Typography>
  );
};
