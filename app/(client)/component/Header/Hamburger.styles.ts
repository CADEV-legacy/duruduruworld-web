import Link from 'next/link';

import { styled } from '@mui/material';

import { COLOR } from '@/constant';

export const Container = styled('div')(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('lg')]: {
    position: 'relative',
    display: 'block',
    width: '1rem',
    height: '1rem',
  },
}));

export const HamburgerContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.625rem',
  width: '100%',
  height: '14.375rem',
  padding: '1.875rem 1.25rem 1rem',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  borderRadius: '0 0 1.25rem 1.25rem',
  boxSizing: 'border-box',
});

export const AuthContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.69rem',
  width: '3.5rem',
});

export const AuthWrapper = styled('div')<{ hasAuth?: boolean | null }>(({ hasAuth }) => ({
  position: 'relative',
  width: '3.5rem',
  height: '3.5rem',
  borderRadius: '50%',
  backgroundColor:
    hasAuth === undefined ? COLOR.inputBorder : hasAuth ? COLOR.userIcon : COLOR.white,
}));

export const HamburgerLinkContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '1.44rem',
});

export const Hamburger = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.69rem',
  width: '4.375rem',
});

export const HamburgerLink = styled(Link)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.69rem',
  width: '4.375rem',
  textDecoration: 'none',
  color: COLOR.black,
});

export const HamburgerIconWrapper = styled('div')({
  position: 'relative',
  width: '2.5rem',
  height: '2.5rem',
  backgroundColor: COLOR.white,
  borderRadius: '50%',
});
