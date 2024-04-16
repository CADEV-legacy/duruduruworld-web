import Link from 'next/link';

import { Button, styled } from '@mui/material';

import { COLOR } from '@/constant';

export const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  padding: '3rem 2rem',
});

export const TitleContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  width: '100%',
  marginBottom: '2rem',
});

export const TitleLogoWrapper = styled('div')({
  position: 'relative',
  width: '8.75rem',
  height: '2.8875rem',
});

export const SupportLinkContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  marginTop: '1rem',
});

export const SupportLink = styled(Link)({
  color: COLOR.black,
  textDecoration: 'none',
});

export const LoginButton = styled(Button)({
  width: '100%',
  height: '3rem',
  marginTop: '0.4rem',
  backgroundColor: COLOR.themeColor1,
  color: COLOR.white,
  fontWeight: 700,
  '&:hover': {
    backgroundColor: COLOR.themeColor1Hover,
  },
});

export const KakaoLoginButton = styled(Button)({
  width: '100%',
  height: '3rem',
  marginTop: '0.5rem',
  backgroundColor: COLOR.kakao,
  color: COLOR.black,
  fontWeight: 700,
  '&:hover': {
    backgroundColor: COLOR.kakaoHover,
  },
});

export const DividerContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  width: '100%',
  height: '2.5rem',
});

export const Divider = styled('div')({
  width: '100%',
  height: '.125rem',
  backgroundColor: COLOR.divider,
});

export const DividerText = styled('div')({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '0 .5rem',
  backgroundColor: COLOR.white,
  color: COLOR.black,
  fontSize: '1rem',
  fontWeight: 700,
  zIndex: 1,
  whiteSpace: 'nowrap',
});

export const SignUpButton = styled(Button)({
  width: '100%',
  height: '3rem',
  backgroundColor: COLOR.themeColor2,
  color: COLOR.white,
  fontWeight: 700,
  '&:hover': {
    backgroundColor: COLOR.themeColor2Hover,
  },
});
