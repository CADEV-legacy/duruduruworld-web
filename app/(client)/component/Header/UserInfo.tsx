'use client';

import { usePathname } from 'next/navigation';

import { Typography } from '@mui/material';

import { NavigationItem } from './NavigationItem';
import * as S from './UserInfo.styles';

import { SmartTypography } from '@/(client)/component';
import { useUserMe } from '@/(client)/service';
import { useAuthStore } from '@/(client)/store';

import { COLOR, ROUTE_URL, UNAUTH_PROTECTED_PAGE_ROUTE } from '@/constant';

export const UserInfo: React.FC = () => {
  const pathname = usePathname();
  const { accessToken } = useAuthStore();

  const { data, isLoading } = useUserMe(accessToken);

  if (UNAUTH_PROTECTED_PAGE_ROUTE.includes(pathname))
    return <NavigationItem name='로그인' link={ROUTE_URL.auth.signIn} />;

  if (accessToken === undefined || (accessToken && isLoading))
    return (
      <S.LoginSkeletonWrapper>
        <SmartTypography />
      </S.LoginSkeletonWrapper>
    );

  if (!data) return <NavigationItem name='로그인' link={ROUTE_URL.auth.signIn} />;

  return (
    <S.UserIcon>
      <Typography fontSize='2.5rem' fontWeight='700' color={COLOR.white}>
        {data.information.name.substring(0, 1)}
      </Typography>
    </S.UserIcon>
  );
};
