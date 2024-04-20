'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import { Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

import { NavigationItem } from './NavigationItem';
import * as S from './UserInfo.styles';

import { SmartTypography } from '@/(client)/component';
import { useAuthMutation, useUserMe } from '@/(client)/service';
import { useAuthStore } from '@/(client)/store';

import { COLOR, ROUTE_URL, UNAUTH_PROTECTED_PAGE_ROUTE } from '@/constant';

export const UserInfo: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const userIconRef = useRef<HTMLDivElement>(null);
  const { accessToken, clearAuth } = useAuthStore();
  const [userInfoDropdownElement, setUserInfoDropdownElement] = useState<HTMLElement | null>(null);
  const { data, isLoading } = useUserMe(accessToken);
  const { authSignOutMutation } = useAuthMutation();
  const { enqueueSnackbar } = useSnackbar();

  const activateUserInfoDropdown = () => {
    if (!userIconRef.current) return;

    setUserInfoDropdownElement(userIconRef.current);
  };

  const deactivateUserInfoDropdown = () => {
    setUserInfoDropdownElement(null);
  };

  const onMypageClick = () => {
    deactivateUserInfoDropdown();

    router.push(ROUTE_URL.user.me);
  };

  const onSignOutClick = async () => {
    if (authSignOutMutation.isPending) return;

    try {
      await authSignOutMutation.mutateAsync();

      enqueueSnackbar('로그아웃 되었습니다.', { variant: 'success' });

      clearAuth();

      if (pathname !== ROUTE_URL.auth.signIn) router.push(ROUTE_URL.auth.signIn);
    } catch (error) {
      console.info(error);
    } finally {
      deactivateUserInfoDropdown();
    }
  };

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
    <>
      <S.UserIcon
        ref={userIconRef}
        onClick={activateUserInfoDropdown}
        className='clickable'
        onMouseEnter={activateUserInfoDropdown}>
        <Typography fontSize='1.25rem' fontWeight='700' color={COLOR.white}>
          {data.information.name.substring(0, 1)}
        </Typography>
      </S.UserIcon>
      <S.CustomMenu
        id='user-info-dropdown'
        anchorEl={userInfoDropdownElement}
        open={!!userInfoDropdownElement}
        onClose={deactivateUserInfoDropdown}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <S.CustomMenuUserIconContainer>
          <S.CustomMenuUserIcon>
            <Typography fontSize='1.5rem' fontWeight='700' color={COLOR.white}>
              {data.information.name.substring(0, 1)}
            </Typography>
          </S.CustomMenuUserIcon>
        </S.CustomMenuUserIconContainer>
        <S.CustomMenuItem onClick={onMypageClick}>
          <Typography fontSize='1rem' fontWeight='700' align='center'>
            마이페이지
          </Typography>
        </S.CustomMenuItem>
        <S.CustomMenuItem onClick={onSignOutClick}>
          <Typography fontSize='1rem' fontWeight='700' align='center'>
            로그아웃
          </Typography>
        </S.CustomMenuItem>
      </S.CustomMenu>
    </>
  );
};
