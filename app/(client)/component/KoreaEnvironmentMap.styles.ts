import { styled } from '@mui/material';

export const Container = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  [theme.breakpoints.down('lg')]: {
    width: '16.875rem',
    height: '22.7813rem',
  },
}));
