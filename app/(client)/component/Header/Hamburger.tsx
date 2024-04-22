'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { Box, SwipeableDrawer, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

import * as S from './Hamburger.styles';

import { SmartImage, SmartTypography } from '@/(client)/component';
import { useAuthMutation, useUserMe } from '@/(client)/service';
import { useAuthStore } from '@/(client)/store';

import { COLOR, ROUTE_URL } from '@/constant';

import companyIntroduceIcon from '#/icons/companyIntroduce.svg';
import hamburgerIcon from '#/icons/hamburger.svg';
import serviceIntroduceIcon from '#/icons/serviceIntroduce.svg';
import signInIcon from '#/icons/signIn.svg';
import signOutIcon from '#/icons/signOut.svg';
import signUpIcon from '#/icons/signUp.svg';

export const Hamburger: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const { accessToken, clearAuth } = useAuthStore();
  const { authSignOutMutation } = useAuthMutation();
  const { enqueueSnackbar } = useSnackbar();

  const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const onClick = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setIsHamburgerOpen(open);
  };

  const onSignOutHamburgerClick = async () => {
    if (authSignOutMutation.isPending) return;

    try {
      await authSignOutMutation.mutateAsync();

      enqueueSnackbar('로그아웃 되었습니다.', { variant: 'success' });

      clearAuth();

      if (pathname !== ROUTE_URL.auth.signIn) router.push(ROUTE_URL.auth.signIn);

      setIsHamburgerOpen(false);
    } catch (error) {
      console.info(error);
    }
  };

  const Hamburger = (
    <Box role='presentation' onClick={onClick(false)} onKeyDown={onClick(false)}>
      <S.HamburgerContainer>
        <AuthComponent />
        <S.HamburgerLinkContainer>
          {!accessToken && (
            <S.HamburgerLink href={ROUTE_URL.auth.signUp}>
              <S.HamburgerIconWrapper>
                <SmartImage alt='sign-up-icon' src={signUpIcon} />
              </S.HamburgerIconWrapper>
              <Typography fontSize='0.875rem' fontWeight='bold'>
                회원가입
              </Typography>
            </S.HamburgerLink>
          )}
          <S.HamburgerLink href={ROUTE_URL.company.introduction}>
            <S.HamburgerIconWrapper>
              <SmartImage alt='company-introduce-icon' src={companyIntroduceIcon} />
            </S.HamburgerIconWrapper>
            <Typography fontSize='0.875rem' fontWeight='bold'>
              회사소개
            </Typography>
          </S.HamburgerLink>
          <S.HamburgerLink href={ROUTE_URL.company.service}>
            <S.HamburgerIconWrapper>
              <SmartImage alt='service-introduce-icon' src={serviceIntroduceIcon} />
            </S.HamburgerIconWrapper>
            <Typography fontSize='0.875rem' fontWeight='bold'>
              서비스소개
            </Typography>
          </S.HamburgerLink>
          {!!accessToken && (
            <S.Hamburger onClick={onSignOutHamburgerClick}>
              <S.HamburgerIconWrapper>
                <SmartImage alt='sign-out-icon' src={signOutIcon} />
              </S.HamburgerIconWrapper>
              <Typography fontSize='0.875rem' fontWeight='bold'>
                로그아웃
              </Typography>
            </S.Hamburger>
          )}
        </S.HamburgerLinkContainer>
      </S.HamburgerContainer>
    </Box>
  );

  return (
    <>
      <S.Container onClick={onClick(true)}>
        <SmartImage alt='mobile-hambuger-icon' src={hamburgerIcon} />
      </S.Container>
      <SwipeableDrawer
        anchor='top'
        open={isHamburgerOpen}
        onClose={onClick(false)}
        onOpen={onClick(true)}
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}>
        {Hamburger}
      </SwipeableDrawer>
    </>
  );
};

const AuthComponent: React.FC = () => {
  const { accessToken } = useAuthStore();
  const { data, isLoading } = useUserMe(accessToken);

  const showSkeleton = useMemo(
    () => accessToken === undefined || (!!accessToken && isLoading),
    [isLoading, accessToken]
  );

  if (showSkeleton)
    return (
      <S.AuthContainer>
        <S.AuthWrapper />
        <SmartTypography />
      </S.AuthContainer>
    );

  if (data)
    return (
      <S.AuthContainer>
        <S.AuthWrapper hasAuth={!!accessToken}>
          <Typography fontSize='2.25rem' fontWeight='bold' color={COLOR.white}>
            {data.information.name.substring(0, 1).toUpperCase()}
          </Typography>
        </S.AuthWrapper>
        <Typography fontSize='1rem' fontWeight='bold'>
          마이페이지
        </Typography>
      </S.AuthContainer>
    );

  return (
    <S.AuthContainer>
      <S.AuthWrapper hasAuth={!!accessToken}>
        <SmartImage alt='sign-in-icon' src={signInIcon} />
      </S.AuthWrapper>
      <Typography fontSize='1rem' fontWeight='bold'>
        로그인
      </Typography>
    </S.AuthContainer>
  );
};
