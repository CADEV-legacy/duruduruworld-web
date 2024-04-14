'use client';

import { NavigationItem } from './NavigationItem';
import * as S from './UserInfo.styles';

import { SmartTypography } from '@/(client)/component';
import { useUserMe } from '@/(client)/service';
import { useAuthStore } from '@/(client)/store';

import { ROUTE_URL } from '@/constant';

export const UserInfo: React.FC = () => {
  const { accessToken } = useAuthStore();

  const { data, isLoading } = useUserMe(accessToken);

  if (accessToken === undefined || (accessToken && isLoading))
    return (
      <S.LoginSkeletonWrapper>
        <SmartTypography />
      </S.LoginSkeletonWrapper>
    );

  if (!data) return <NavigationItem name='로그인' link={ROUTE_URL.auth.signIn} />;

  return <NavigationItem name='마이페이지' link={ROUTE_URL.user.me} />;
};
