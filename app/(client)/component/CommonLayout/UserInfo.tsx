'use client';

import { Skeleton, Typography } from '@mui/material';

import * as S from './UserInfo.styles';

import { SmartImage } from '@/(client)/component';
import { useUserMe } from '@/(client)/service';
import { useAuthStore } from '@/(client)/store';

import { ROUTE_URL } from '@/constant';

export const UserInfo: React.FC = () => {
  const { auth } = useAuthStore();
  const { data, isFetched } = useUserMe(auth);

  if (!isFetched) return <Skeleton variant='rounded' width={100} height={40} />;

  if (!data) return <S.SignInLink href={ROUTE_URL.auth.signIn}>SIGN IN</S.SignInLink>;

  return (
    <S.Container href={ROUTE_URL.user.me}>
      <S.ProfileImageContainer>
        <SmartImage alt='user-profile-image' variant='circular' />
      </S.ProfileImageContainer>
      <Typography variant='h5'>{data.name}</Typography>
    </S.Container>
  );
};
