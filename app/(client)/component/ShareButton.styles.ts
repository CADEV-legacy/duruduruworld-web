import { styled } from '@mui/material';

export const ShareButtonImageWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '13.125rem',
  height: '5.625rem',
  [theme.breakpoints.down('lg')]: {
    width: '8.458rem',
    height: '3.625rem',
  },
}));
