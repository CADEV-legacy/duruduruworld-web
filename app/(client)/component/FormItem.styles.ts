import { Button, styled } from '@mui/material';

import { COLOR } from '@/constant';

export const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  paddingBottom: '1.25rem',
  [theme.breakpoints.down('lg')]: {
    paddingBottom: '1rem',
  },
}));

export const LabelContainer = styled('div')(({ theme }) => ({
  width: '100%',
  marginBottom: '0.5rem',
  [theme.breakpoints.down('lg')]: {
    '& > h4': {
      fontSize: '.75rem',
    },
  },
}));

export const RowContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: '1rem',
  marginBottom: '.25rem',
  [theme.breakpoints.down('lg')]: {
    gap: '.5rem',
    marginBottom: 0,
  },
}));

export const InputContainer = styled('div')<{ hasFormHandleButton: boolean }>(
  ({ theme, hasFormHandleButton }) => ({
    width: hasFormHandleButton ? 'calc(100% - 8.5rem)' : '100%',
    [theme.breakpoints.down('lg')]: {
      width: hasFormHandleButton ? 'calc(100% - 5rem)' : '100%',
    },
  })
);

export const HandleButton = styled(Button)(({ theme }) => ({
  width: '7.5rem',
  height: '2.5rem',
  backgroundColor: COLOR.themeColor2,
  color: COLOR.white,
  fontWeight: 700,
  lineHeight: 'normal',
  '&:hover': {
    backgroundColor: COLOR.themeColor2Hover,
  },
  [theme.breakpoints.down('lg')]: {
    width: '4.5rem',
    '& > p': {
      fontSize: '.75rem',
    },
  },
}));
