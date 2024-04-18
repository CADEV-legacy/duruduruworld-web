import { styled } from '@mui/material';

import { COLOR } from '@/constant';

export const LoginSkeletonWrapper = styled('div')({
  width: '3.5rem',
  height: '1.8125rem',
});

export const UserIcon = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '5rem',
  height: '5rem',
  backgroundColor: COLOR.themeColor2,
  borderRadius: '50%',
});
