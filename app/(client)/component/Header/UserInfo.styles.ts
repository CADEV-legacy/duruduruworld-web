import { styled } from '@mui/material';

export const LoginSkeletonWrapper = styled('div')(({ theme }) => ({
  width: '3.5rem',
  height: '1.8125rem',
  [theme.breakpoints.down('lg')]: {
    backgroundColor: 'black',
  },
}));
